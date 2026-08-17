import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const ALLOWED_ORIGINS = new Set([
  "https://app.joelmasouzaoficial.com.br",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const EVENT_NAMES = new Set([
  "login_success",
  "service_view",
  "service_select",
  "booking_started",
  "booking_completed",
  "booking_canceled",
]);

const BLOCKED_METADATA_KEYS = new Set([
  "notes",
  "message",
  "description",
  "password",
  "token",
  "access_token",
  "refresh_token",
  "email",
  "phone",
  "whatsapp",
  "health",
  "sexuality",
  "intimacy",
]);

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://app.joelmasouzaoficial.com.br",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function normalizePhone(value: unknown) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function metadataPhone(user: { phone?: string | null; user_metadata?: Record<string, unknown> | null }) {
  const candidates = [
    user.phone,
    user.user_metadata?.phone,
    user.user_metadata?.whatsapp,
    user.user_metadata?.customer_phone,
  ];
  for (const candidate of candidates) {
    const normalized = normalizePhone(candidate);
    if (normalized) return normalized;
  }
  return "";
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string | number | boolean | null> = {};
  for (const [rawKey, rawValue] of Object.entries(value as Record<string, unknown>)) {
    const key = rawKey.toLowerCase().trim();
    if (!key || BLOCKED_METADATA_KEYS.has(key)) continue;
    if (typeof rawValue === "string") output[key] = rawValue.slice(0, 160);
    else if (typeof rawValue === "number" && Number.isFinite(rawValue)) output[key] = rawValue;
    else if (typeof rawValue === "boolean" || rawValue === null) output[key] = rawValue;
  }
  return output;
}

async function findEmailByPhone(admin: ReturnType<typeof createClient>, phone: string) {
  const wanted = normalizePhone(phone);
  if (!wanted) return null;

  const perPage = 200;
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data.users ?? [];
    const match = users.find((user) => metadataPhone(user) === wanted);
    if (match?.email) return match.email;
    if (users.length < perPage) break;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { ok: false, error: "method_not_allowed" }, 405);

  const origin = req.headers.get("origin") ?? "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(req, { ok: false, error: "origin_not_allowed" }, 403);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(req, { ok: false, error: "service_unavailable" }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(req, { ok: false, error: "invalid_json" }, 400);
  }

  const action = String(body.action ?? "");
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (action === "login-with-phone") {
    const phone = normalizePhone(body.phone);
    const password = String(body.password ?? "");
    if (!phone || password.length < 1) return json(req, { ok: false, error: "invalid_credentials" }, 401);

    try {
      const email = await findEmailByPhone(admin, phone);
      if (!email) return json(req, { ok: false, error: "invalid_credentials" }, 401);

      const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await authClient.auth.signInWithPassword({ email, password });
      if (error || !data.session) return json(req, { ok: false, error: "invalid_credentials" }, 401);

      return json(req, {
        ok: true,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at ?? null,
      });
    } catch {
      return json(req, { ok: false, error: "login_unavailable" }, 503);
    }
  }

  if (action === "track-event") {
    const eventName = String(body.eventName ?? "");
    if (!EVENT_NAMES.has(eventName)) return json(req, { ok: false, error: "invalid_event" }, 400);

    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return json(req, { ok: false, error: "unauthorized" }, 401);

    const verifier = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await verifier.auth.getUser(token);
    if (userError || !userData.user) return json(req, { ok: false, error: "unauthorized" }, 401);

    const metadata = cleanMetadata(body.metadata);
    const { error: insertError } = await admin.from("customer_events").insert({
      user_id: userData.user.id,
      event_name: eventName,
      metadata,
    });
    if (insertError) return json(req, { ok: false, error: "event_unavailable" }, 503);
    return json(req, { ok: true });
  }

  return json(req, { ok: false, error: "unknown_action" }, 400);
});
