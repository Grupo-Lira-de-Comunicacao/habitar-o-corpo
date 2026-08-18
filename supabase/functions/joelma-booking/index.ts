import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const APP_ORIGINS = new Set([
  "https://app.joelmasouzaoficial.com.br",
  "https://habitar-o-corpo.vercel.app",
]);
const N8N_WEBHOOK = "https://n8n.tvattual.com.br/webhook/joelma-novo-agendamento";
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
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-max-age": "86400",
    "vary": "Origin",
  };
}

function json(body: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors(origin),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function isBrowserOriginAllowed(origin: string | null) {
  return !origin || APP_ORIGINS.has(origin);
}

function saoPauloToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function cleanText(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizePhone(value: unknown) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function validUuid(value: unknown) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value ?? ""));
}

async function authenticatedUser(req: Request) {
  const authorization = req.headers.get("authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return null;
  return data.user;
}

async function isAdminEmail(email: string) {
  const { data, error } = await supabase.rpc("joelma_is_admin_email", { p_email: email.toLowerCase() });
  if (error) {
    console.error("admin_check_error", error.code);
    return false;
  }
  return data === true;
}

function acceptedTermsDate(value: unknown) {
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString();
}

async function syncProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const email = String(user.email ?? "").toLowerCase();
  const metadata = user.user_metadata ?? {};
  const { data: current } = await supabase
    .from("joelma_profiles")
    .select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  const profile = {
    user_id: user.id,
    email,
    full_name: current?.full_name || cleanText(metadata.full_name ?? metadata.name, 120),
    phone: current?.phone || cleanText(metadata.phone, 30),
    city: current?.city || cleanText(metadata.city, 100),
    is_vip: current?.is_vip === true,
    active: current?.active !== false,
    accepted_terms_at: current?.accepted_terms_at || acceptedTermsDate(metadata.accepted_terms_at),
    created_at: current?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("joelma_profiles")
    .upsert(profile, { onConflict: "user_id" })
    .select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at")
    .single();
  if (error) throw error;
  return data;
}

function publicProfile(profile: Record<string, unknown>) {
  return {
    id: profile.user_id,
    email: profile.email,
    name: profile.full_name,
    phone: profile.phone,
    city: profile.city,
    isVip: profile.is_vip === true,
    active: profile.active !== false,
    acceptedTermsAt: profile.accepted_terms_at,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

function publicBooking(item: Record<string, unknown>) {
  return {
    id: item.id,
    clientId: item.customer_user_id,
    serviceId: item.service_id,
    serviceName: item.service_name,
    customerName: item.customer_name,
    customerPhone: item.customer_phone,
    customerEmail: item.customer_email,
    date: item.local_date,
    time: String(item.local_time ?? "").slice(0, 5),
    startAt: item.starts_at,
    endAt: item.ends_at,
    notes: item.notes,
    status: item.status,
    origin: item.origin,
    notificationStatus: item.notification_status,
    calendarEventId: item.calendar_event_id,
    createdAt: item.created_at,
  };
}

const BOOKING_COLUMNS = "id,customer_user_id,service_id,service_name,customer_name,customer_phone,customer_email,local_date,local_time,starts_at,ends_at,notes,status,origin,notification_status,calendar_event_id,created_at";

async function availability(url: URL, origin: string | null) {
  const date = url.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < saoPauloToday()) {
    return json({ ok: false, error: "data_invalida" }, 400, origin);
  }
  const { data, error } = await supabase.rpc("joelma_available_slots", { p_date: date });
  if (error) {
    console.error("availability_rpc_error", error.code);
    return json({ ok: false, error: "falha_ao_consultar_horarios" }, 500, origin);
  }
  return json({
    ok: true,
    date,
    timezone: "America/Sao_Paulo",
    durationMinutes: 90,
    slots: data ?? [],
  }, 200, origin);
}

async function booking(payload: Record<string, unknown>, origin: string | null, req: Request) {
  const user = await authenticatedUser(req);
  if (!user?.email) {
    return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  }

  let profile: Record<string, unknown>;
  try {
    profile = await syncProfile(user) as Record<string, unknown>;
  } catch (error) {
    console.error("booking_profile_error", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, error: "falha_ao_carregar_perfil" }, 500, origin);
  }

  if (profile.active === false) {
    return json({ ok: false, error: "conta_inativa" }, 403, origin);
  }

  const idempotencyKey = cleanText(payload.idempotencyKey, 100);
  const serviceId = cleanText(payload.serviceId, 100);
  const customerName = cleanText(profile.full_name, 120);
  const customerPhone = normalizePhone(profile.phone);
  const customerEmail = user.email.toLowerCase();
  const date = cleanText(payload.date, 10);
  const time = cleanText(payload.time, 5);
  const notes = cleanText(payload.notes, 1000);

  const requestIsValid =
    /^[A-Za-z0-9_-]{8,100}$/.test(idempotencyKey) &&
    /^[a-z0-9-]{3,100}$/.test(serviceId) &&
    customerName.length >= 2 &&
    /^\d{12,13}$/.test(customerPhone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    /^\d{2}:\d{2}$/.test(time) &&
    date >= saoPauloToday();
  if (!requestIsValid) {
    return json({
      ok: false,
      error: customerName.length < 2 || !/^\d{12,13}$/.test(customerPhone)
        ? "perfil_incompleto"
        : "dados_invalidos",
    }, 400, origin);
  }

  const { data, error } = await supabase.rpc("joelma_create_booking", {
    p_idempotency_key: idempotencyKey,
    p_service_id: serviceId,
    p_customer_name: customerName,
    p_customer_phone: customerPhone,
    p_customer_email: customerEmail,
    p_date: date,
    p_time: time,
    p_notes: notes,
    p_origin: "App Habitar o Corpo",
  });
  if (error) {
    const unavailable = error.code === "23P01" ||
      String(error.message).includes("horario_indisponivel");
    console.error("booking_rpc_error", error.code);
    return json({
      ok: false,
      error: unavailable ? "horario_indisponivel" : "falha_ao_agendar",
    }, unavailable ? 409 : 500, origin);
  }

  const bookingId = String(data.bookingId);
  const notificationToken = String(data.notificationToken);
  await supabase
    .from("joelma_bookings")
    .update({ customer_user_id: user.id })
    .eq("id", bookingId)
    .is("customer_user_id", null);

  let notificationQueued = false;
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingId, notificationToken }),
      signal: AbortSignal.timeout(8000),
    });
    notificationQueued = response.ok;
  } catch {
    console.error("n8n_notification_unavailable");
  }

  return json({
    ok: true,
    bookingId,
    status: data.status,
    startAt: data.startAt,
    endAt: data.endAt,
    idempotent: Boolean(data.idempotent),
    notificationQueued,
  }, data.idempotent ? 200 : 201, origin);
}

async function accountData(req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  try {
    const profile = await syncProfile(user);
    await supabase
      .from("joelma_bookings")
      .update({ customer_user_id: user.id })
      .eq("customer_email", user.email.toLowerCase())
      .is("customer_user_id", null);
    const { data: bookings, error } = await supabase
      .from("joelma_bookings")
      .select(BOOKING_COLUMNS)
      .or(`customer_user_id.eq.${user.id},customer_email.eq.${user.email.toLowerCase()}`)
      .order("starts_at", { ascending: true });
    if (error) throw error;
    return json({
      ok: true,
      profile: publicProfile(profile),
      bookings: (bookings ?? []).map(publicBooking),
      isAdmin: await isAdminEmail(user.email),
    }, 200, origin);
  } catch (error) {
    console.error("account_data_error", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, error: "falha_ao_carregar_conta" }, 500, origin);
  }
}

async function updateProfile(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  const fullName = cleanText(payload.name, 120);
  const phone = cleanText(payload.phone, 30);
  const city = cleanText(payload.city, 100);
  if (fullName.length < 2 || normalizePhone(phone).length < 12) {
    return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  }
  await syncProfile(user);
  const { data, error } = await supabase
    .from("joelma_profiles")
    .update({ full_name: fullName, phone, city, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at")
    .single();
  if (error) return json({ ok: false, error: "falha_ao_atualizar_perfil" }, 500, origin);
  return json({ ok: true, profile: publicProfile(data) }, 200, origin);
}

async function adminData(req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const [bookingsResult, profilesResult] = await Promise.all([
    supabase.from("joelma_bookings").select(BOOKING_COLUMNS).order("starts_at", { ascending: false }),
    supabase.from("joelma_profiles").select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at").order("created_at", { ascending: false }),
  ]);
  if (bookingsResult.error || profilesResult.error) {
    console.error("admin_data_error", bookingsResult.error?.code ?? profilesResult.error?.code);
    return json({ ok: false, error: "falha_ao_carregar_painel" }, 500, origin);
  }
  return json({
    ok: true,
    bookings: (bookingsResult.data ?? []).map(publicBooking),
    clients: (profilesResult.data ?? []).map(publicProfile),
  }, 200, origin);
}

async function updateBookingStatus(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const bookingId = cleanText(payload.bookingId, 36);
  const status = cleanText(payload.status, 30);
  const allowed = new Set(["confirmed", "completed", "canceled", "no_show"]);
  if (!validUuid(bookingId) || !allowed.has(status)) {
    return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  }
  const { error } = await supabase
    .from("joelma_bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) return json({ ok: false, error: "falha_ao_atualizar_agendamento" }, 500, origin);
  return json({ ok: true }, 200, origin);
}

async function setClientVip(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const userId = cleanText(payload.userId, 36);
  if (!validUuid(userId) || typeof payload.isVip !== "boolean") {
    return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  }
  const { error } = await supabase
    .from("joelma_profiles")
    .update({ is_vip: payload.isVip, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) return json({ ok: false, error: "falha_ao_atualizar_cliente" }, 500, origin);
  return json({ ok: true }, 200, origin);
}

async function notification(payload: Record<string, unknown>) {
  const bookingId = cleanText(payload.bookingId, 36);
  const notificationToken = cleanText(payload.notificationToken, 64);
  if (!/^[0-9a-f-]{36}$/i.test(bookingId) || !/^[0-9a-f]{64}$/i.test(notificationToken)) {
    return json({ ok: false, error: "token_invalido" }, 403);
  }
  const { data, error } = await supabase.rpc("joelma_get_notification", {
    p_booking_id: bookingId,
    p_notification_token: notificationToken,
  });
  if (error || !data) {
    return json({ ok: false, error: "reserva_nao_encontrada" }, 404);
  }
  return json({ ok: true, booking: data });
}

async function notificationResult(payload: Record<string, unknown>) {
  const bookingId = cleanText(payload.bookingId, 36);
  const notificationToken = cleanText(payload.notificationToken, 64);
  const success = payload.success === true;
  if (!/^[0-9a-f-]{36}$/i.test(bookingId) || !/^[0-9a-f]{64}$/i.test(notificationToken)) {
    return json({ ok: false, error: "token_invalido" }, 403);
  }
  const { data, error } = await supabase.rpc("joelma_mark_notification", {
    p_booking_id: bookingId,
    p_notification_token: notificationToken,
    p_success: success,
    p_provider_id: cleanText(payload.providerId, 200) || null,
    p_error: cleanText(payload.error, 500) || null,
  });
  if (error || data !== true) {
    return json({ ok: false, error: "reserva_nao_encontrada" }, 404);
  }
  return json({ ok: true });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }
  if (!isBrowserOriginAllowed(origin)) {
    return json({ ok: false, error: "origem_nao_permitida" }, 403, origin);
  }

  const url = new URL(req.url);
  if (req.method === "GET" && url.searchParams.has("date")) {
    return availability(url, origin);
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "metodo_nao_permitido" }, 405, origin);
  }

  const length = Number(req.headers.get("content-length") || "0");
  if (length > 16_384) {
    return json({ ok: false, error: "payload_muito_grande" }, 413, origin);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "json_invalido" }, 400, origin);
  }

  const action = cleanText(payload.action, 40) || "book";
  if (action === "book") return booking(payload, origin, req);
  if (action === "account-data") return accountData(req, origin);
  if (action === "update-profile") return updateProfile(payload, req, origin);
  if (action === "admin-data") return adminData(req, origin);
  if (action === "update-booking-status") return updateBookingStatus(payload, req, origin);
  if (action === "set-client-vip") return setClientVip(payload, req, origin);
  if (action === "notification") return notification(payload);
  if (action === "notification-result") return notificationResult(payload);
  return json({ ok: false, error: "acao_invalida" }, 400, origin);
});
