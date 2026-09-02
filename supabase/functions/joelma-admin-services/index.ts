import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const APP_ORIGINS = new Set([
  "https://app.joelmasouzaoficial.com.br",
  "https://habitar-o-corpo.vercel.app",
]);
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function cors(origin: string | null) {
  const allowed = origin && APP_ORIGINS.has(origin)
    ? origin
    : "https://app.joelmasouzaoficial.com.br";
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-max-age": "86400",
    "vary": "Origin",
  };
}

function json(body: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function cleanText(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

async function authenticatedAdmin(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return null;
  const { data: isAdmin, error: adminError } = await supabase.rpc("joelma_is_admin_email", { p_email: data.user.email.toLowerCase() });
  if (adminError || isAdmin !== true) return null;
  return data.user;
}

const SERVICE_COLUMNS = "id,name,duration_minutes,price_cents,active,description,benefits,sort_order,created_at,updated_at";

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (origin && !APP_ORIGINS.has(origin)) return json({ ok: false, error: "origem_nao_permitida" }, 403, origin);
  if (req.method !== "POST") return json({ ok: false, error: "metodo_nao_permitido" }, 405, origin);
  const admin = await authenticatedAdmin(req);
  if (!admin) return json({ ok: false, error: "acesso_negado" }, 403, origin);

  let payload: Record<string, unknown>;
  try { payload = await req.json(); } catch { return json({ ok: false, error: "json_invalido" }, 400, origin); }

  const id = cleanText(payload.id, 100);
  const name = cleanText(payload.name, 160);
  const description = cleanText(payload.description, 1200);
  const durationMinutes = Number(payload.durationMinutes);
  const priceCents = Number(payload.priceCents);
  const sortOrder = Number(payload.sortOrder ?? 0);
  const active = payload.active !== false;
  const benefits = Array.isArray(payload.benefits)
    ? payload.benefits.slice(0, 8).map((item) => cleanText(item, 120)).filter(Boolean)
    : [];

  if (!/^[a-z0-9-]{3,100}$/.test(id) || name.length < 2 || !Number.isInteger(durationMinutes) || durationMinutes < 30 || durationMinutes > 480 || !Number.isInteger(priceCents) || priceCents < 0 || priceCents > 100000000 || !Number.isInteger(sortOrder)) {
    return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  }

  const record = {
    name,
    description,
    duration_minutes: durationMinutes,
    price_cents: priceCents,
    benefits,
    active,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("joelma_services")
    .update(record)
    .eq("id", id)
    .select(SERVICE_COLUMNS)
    .single();

  if (error) {
    console.error("service_update_error", { code: error.code, message: error.message, details: error.details, hint: error.hint });
    return json({ ok: false, error: "falha_ao_salvar_servico", code: error.code ?? "db_error" }, 500, origin);
  }

  return json({ ok: true, service: data }, 200, origin);
});
