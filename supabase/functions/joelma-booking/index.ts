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

function validNotificationToken(value: unknown) {
  return /^[0-9a-f]{64}$/i.test(String(value ?? ""));
}

function formatDuration(minutes: number) {
  if (minutes <= 0) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}min`;
  if (!rest) return `${hours}h`;
  return `${hours}h${String(rest).padStart(2, "0")}`;
}

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceCents / 100);
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
  const { data: current } = await supabase.from("joelma_profiles").select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at").eq("user_id", user.id).maybeSingle();
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
  const { data, error } = await supabase.from("joelma_profiles").upsert(profile, { onConflict: "user_id" }).select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at").single();
  if (error) throw error;
  return data;
}

function publicProfile(profile: Record<string, unknown>) {
  return { id: profile.user_id, email: profile.email, name: profile.full_name, phone: profile.phone, city: profile.city, isVip: profile.is_vip === true, active: profile.active !== false, acceptedTermsAt: profile.accepted_terms_at, createdAt: profile.created_at, updatedAt: profile.updated_at };
}

function publicBooking(item: Record<string, unknown>) {
  return { id: item.id, clientId: item.customer_user_id, serviceId: item.service_id, serviceName: item.service_name, customerName: item.customer_name, customerPhone: item.customer_phone, customerEmail: item.customer_email, date: item.local_date, time: String(item.local_time ?? "").slice(0, 5), startAt: item.starts_at, endAt: item.ends_at, notes: item.notes, status: item.status, origin: item.origin, notificationStatus: item.notification_status, calendarEventId: item.calendar_event_id, createdAt: item.created_at };
}

function publicService(item: Record<string, unknown>) {
  const durationMinutes = Number(item.duration_minutes ?? 0);
  const priceCents = Number(item.price_cents ?? 0);
  return { id: item.id, name: item.name, duration: formatDuration(durationMinutes), durationMinutes, price: formatPrice(priceCents), priceCents, description: item.description ?? "", benefits: Array.isArray(item.benefits) ? item.benefits : [], active: item.active !== false, sortOrder: Number(item.sort_order ?? 0) };
}

function publicVipContent(item: Record<string, unknown>) {
  return { id: item.id, title: item.title, description: item.description ?? "", type: item.content_type, category: item.category, url: item.media_url ?? "", textContent: item.text_content ?? "", thumbnail: item.thumbnail_url ?? "", date: String(item.created_at ?? "").slice(0, 10), status: item.status, access: item.access_level, sortOrder: Number(item.sort_order ?? 0) };
}

const BOOKING_COLUMNS = "id,customer_user_id,service_id,service_name,customer_name,customer_phone,customer_email,local_date,local_time,starts_at,ends_at,notes,status,origin,notification_status,calendar_event_id,created_at";
const SERVICE_COLUMNS = "id,name,duration_minutes,price_cents,active,description,benefits,sort_order,created_at,updated_at";
const VIP_COLUMNS = "id,title,description,content_type,category,media_url,text_content,thumbnail_url,status,access_level,sort_order,created_at,updated_at";

async function availability(url: URL, origin: string | null) {
  const date = url.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < saoPauloToday()) return json({ ok: false, error: "data_invalida" }, 400, origin);
  const { data, error } = await supabase.rpc("joelma_available_slots", { p_date: date });
  if (error) { console.error("availability_rpc_error", error.code); return json({ ok: false, error: "falha_ao_consultar_horarios" }, 500, origin); }
  return json({ ok: true, date, timezone: "America/Sao_Paulo", durationMinutes: 90, slots: data ?? [] }, 200, origin);
}

async function catalog(origin: string | null) {
  const { data, error } = await supabase.from("joelma_services").select(SERVICE_COLUMNS).eq("active", true).order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (error) { console.error("catalog_error", error.code); return json({ ok: false, error: "falha_ao_carregar_servicos" }, 500, origin); }
  return json({ ok: true, services: (data ?? []).map(publicService) }, 200, origin);
}

async function publicConfig(origin: string | null) {
  const { data, error } = await supabase.rpc("joelma_public_config");
  if (error || !data) { console.error("public_config_error", error?.code ?? "empty"); return json({ ok: false, error: "falha_ao_carregar_configuracao" }, 500, origin); }
  return json({ ok: true, pix: { type: cleanText((data as Record<string, unknown>).pixType, 20), key: cleanText((data as Record<string, unknown>).pixKey, 120) } }, 200, origin);
}

async function booking(payload: Record<string, unknown>, origin: string | null, req: Request) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  let profile: Record<string, unknown>;
  try { profile = await syncProfile(user) as Record<string, unknown>; } catch (error) { console.error("booking_profile_error", error instanceof Error ? error.message : "unknown"); return json({ ok: false, error: "falha_ao_carregar_perfil" }, 500, origin); }
  if (profile.active === false) return json({ ok: false, error: "conta_inativa" }, 403, origin);
  const idempotencyKey = cleanText(payload.idempotencyKey, 100), serviceId = cleanText(payload.serviceId, 100), customerName = cleanText(profile.full_name, 120), customerPhone = normalizePhone(profile.phone), customerEmail = user.email.toLowerCase(), date = cleanText(payload.date, 10), time = cleanText(payload.time, 5), notes = cleanText(payload.notes, 1000);
  const requestIsValid = /^[A-Za-z0-9_-]{8,100}$/.test(idempotencyKey) && /^[a-z0-9-]{3,100}$/.test(serviceId) && customerName.length >= 2 && /^\d{12,13}$/.test(customerPhone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) && /^\d{4}-\d{2}-\d{2}$/.test(date) && /^\d{2}:\d{2}$/.test(time) && date >= saoPauloToday();
  if (!requestIsValid) return json({ ok: false, error: customerName.length < 2 || !/^\d{12,13}$/.test(customerPhone) ? "perfil_incompleto" : "dados_invalidos" }, 400, origin);
  const { data, error } = await supabase.rpc("joelma_create_booking", { p_idempotency_key: idempotencyKey, p_service_id: serviceId, p_customer_name: customerName, p_customer_phone: customerPhone, p_customer_email: customerEmail, p_date: date, p_time: time, p_notes: notes, p_origin: "App Habitar o Corpo" });
  if (error) { const unavailable = error.code === "23P01" || String(error.message).includes("horario_indisponivel"); console.error("booking_rpc_error", error.code); return json({ ok: false, error: unavailable ? "horario_indisponivel" : "falha_ao_agendar" }, unavailable ? 409 : 500, origin); }
  const bookingId = String(data.bookingId), notificationToken = String(data.notificationToken);
  await supabase.from("joelma_bookings").update({ customer_user_id: user.id }).eq("id", bookingId).is("customer_user_id", null);
  let notificationQueued = false;
  try { const response = await fetch(N8N_WEBHOOK, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ bookingId, notificationToken }), signal: AbortSignal.timeout(8000) }); notificationQueued = response.ok; } catch { console.error("n8n_notification_unavailable"); }
  return json({ ok: true, bookingId, status: data.status, startAt: data.startAt, endAt: data.endAt, idempotent: Boolean(data.idempotent), notificationQueued }, data.idempotent ? 200 : 201, origin);
}

async function accountData(req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  try {
    const profile = await syncProfile(user);
    await supabase.from("joelma_bookings").update({ customer_user_id: user.id }).eq("customer_email", user.email.toLowerCase()).is("customer_user_id", null);
    const { data: bookings, error } = await supabase.from("joelma_bookings").select(BOOKING_COLUMNS).or(`customer_user_id.eq.${user.id},customer_email.eq.${user.email.toLowerCase()}`).order("starts_at", { ascending: true });
    if (error) throw error;
    return json({ ok: true, profile: publicProfile(profile), bookings: (bookings ?? []).map(publicBooking), isAdmin: await isAdminEmail(user.email) }, 200, origin);
  } catch (error) { console.error("account_data_error", error instanceof Error ? error.message : "unknown"); return json({ ok: false, error: "falha_ao_carregar_conta" }, 500, origin); }
}

async function updateProfile(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  const fullName = cleanText(payload.name, 120), phone = cleanText(payload.phone, 30), city = cleanText(payload.city, 100);
  if (fullName.length < 2 || normalizePhone(phone).length < 12) return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  await syncProfile(user);
  const { data, error } = await supabase.from("joelma_profiles").update({ full_name: fullName, phone, city, updated_at: new Date().toISOString() }).eq("user_id", user.id).select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at").single();
  if (error) return json({ ok: false, error: "falha_ao_atualizar_perfil" }, 500, origin);
  return json({ ok: true, profile: publicProfile(data) }, 200, origin);
}

async function vipContent(req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  let profile: Record<string, unknown>;
  try { profile = await syncProfile(user) as Record<string, unknown>; } catch { return json({ ok: false, error: "falha_ao_carregar_perfil" }, 500, origin); }
  const admin = await isAdminEmail(user.email);
  if (profile.active === false) return json({ ok: false, error: "conta_inativa" }, 403, origin);
  if (profile.is_vip !== true && !admin) return json({ ok: false, error: "acesso_vip_necessario" }, 403, origin);
  const { data, error } = await supabase.from("joelma_vip_contents").select(VIP_COLUMNS).eq("status", "active").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) { console.error("vip_content_error", error.code); return json({ ok: false, error: "falha_ao_carregar_conteudo" }, 500, origin); }
  return json({ ok: true, contents: (data ?? []).map(publicVipContent) }, 200, origin);
}

async function adminData(req: Request, origin: string | null) {
  const user = await authenticatedUser(req);
  if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin);
  if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const [bookingsResult, profilesResult, servicesResult, vipResult] = await Promise.all([
    supabase.from("joelma_bookings").select(BOOKING_COLUMNS).order("starts_at", { ascending: false }),
    supabase.from("joelma_profiles").select("user_id,email,full_name,phone,city,is_vip,active,accepted_terms_at,created_at,updated_at").order("created_at", { ascending: false }),
    supabase.from("joelma_services").select(SERVICE_COLUMNS).order("sort_order", { ascending: true }).order("name", { ascending: true }),
    supabase.from("joelma_vip_contents").select(VIP_COLUMNS).order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
  ]);
  if (bookingsResult.error || profilesResult.error || servicesResult.error || vipResult.error) { console.error("admin_data_error", bookingsResult.error?.code ?? profilesResult.error?.code ?? servicesResult.error?.code ?? vipResult.error?.code); return json({ ok: false, error: "falha_ao_carregar_painel" }, 500, origin); }
  return json({ ok: true, bookings: (bookingsResult.data ?? []).map(publicBooking), clients: (profilesResult.data ?? []).map(publicProfile), services: (servicesResult.data ?? []).map(publicService), vipContents: (vipResult.data ?? []).map(publicVipContent) }, 200, origin);
}

async function updateBookingStatus(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req); if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin); if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const bookingId = cleanText(payload.bookingId, 36), status = cleanText(payload.status, 30), allowed = new Set(["confirmed", "completed", "canceled", "no_show"]);
  if (!validUuid(bookingId) || !allowed.has(status)) return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  const { error } = await supabase.from("joelma_bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", bookingId); if (error) return json({ ok: false, error: "falha_ao_atualizar_agendamento" }, 500, origin); return json({ ok: true }, 200, origin);
}

async function setClientVip(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req); if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin); if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const userId = cleanText(payload.userId, 36); if (!validUuid(userId) || typeof payload.isVip !== "boolean") return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  const { error } = await supabase.from("joelma_profiles").update({ is_vip: payload.isVip, updated_at: new Date().toISOString() }).eq("user_id", userId); if (error) return json({ ok: false, error: "falha_ao_atualizar_cliente" }, 500, origin); return json({ ok: true }, 200, origin);
}

async function upsertService(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req); if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin); if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const id = cleanText(payload.id, 100), name = cleanText(payload.name, 160), description = cleanText(payload.description, 1200), durationMinutes = Number(payload.durationMinutes), priceCents = Number(payload.priceCents), sortOrder = Number(payload.sortOrder ?? 0), active = payload.active !== false;
  const benefits = Array.isArray(payload.benefits) ? payload.benefits.slice(0, 8).map((item) => cleanText(item, 120)).filter(Boolean) : [];
  if (!/^[a-z0-9-]{3,100}$/.test(id) || name.length < 2 || !Number.isInteger(durationMinutes) || durationMinutes < 30 || durationMinutes > 480 || !Number.isInteger(priceCents) || priceCents < 0 || priceCents > 100000000 || !Number.isInteger(sortOrder)) return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  const { data, error } = await supabase.from("joelma_services").upsert({ id, name, description, duration_minutes: durationMinutes, price_cents: priceCents, benefits, active, sort_order: sortOrder, updated_at: new Date().toISOString() }, { onConflict: "id" }).select(SERVICE_COLUMNS).single(); if (error) return json({ ok: false, error: "falha_ao_salvar_servico" }, 500, origin); return json({ ok: true, service: publicService(data) }, 200, origin);
}

async function upsertVipContent(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req); if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin); if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin);
  const id = cleanText(payload.id, 36), title = cleanText(payload.title, 180), description = cleanText(payload.description, 1200), contentType = cleanText(payload.type ?? payload.contentType, 20), category = cleanText(payload.category, 80) || "Conteúdo", mediaUrl = cleanText(payload.url ?? payload.mediaUrl, 1000), textContent = cleanText(payload.textContent, 12000), thumbnailUrl = cleanText(payload.thumbnail ?? payload.thumbnailUrl, 1000), status = cleanText(payload.status, 20) || "draft", sortOrder = Number(payload.sortOrder ?? 0);
  const allowedTypes = new Set(["video", "photo", "text", "pdf", "link"]), allowedStatus = new Set(["draft", "active", "archived"]);
  if ((id && !validUuid(id)) || title.length < 2 || !allowedTypes.has(contentType) || !allowedStatus.has(status) || !Number.isInteger(sortOrder)) return json({ ok: false, error: "dados_invalidos" }, 400, origin);
  const record = { title, description, content_type: contentType, category, media_url: mediaUrl, text_content: textContent, thumbnail_url: thumbnailUrl, status, access_level: "VIP", sort_order: sortOrder, updated_at: new Date().toISOString() };
  const query = id ? supabase.from("joelma_vip_contents").update(record).eq("id", id) : supabase.from("joelma_vip_contents").insert(record); const { data, error } = await query.select(VIP_COLUMNS).single(); if (error) return json({ ok: false, error: "falha_ao_salvar_conteudo" }, 500, origin); return json({ ok: true, content: publicVipContent(data) }, 200, origin);
}

async function archiveVipContent(payload: Record<string, unknown>, req: Request, origin: string | null) {
  const user = await authenticatedUser(req); if (!user?.email) return json({ ok: false, error: "nao_autenticado" }, 401, origin); if (!(await isAdminEmail(user.email))) return json({ ok: false, error: "acesso_negado" }, 403, origin); const id = cleanText(payload.id, 36); if (!validUuid(id)) return json({ ok: false, error: "dados_invalidos" }, 400, origin); const { error } = await supabase.from("joelma_vip_contents").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id); if (error) return json({ ok: false, error: "falha_ao_arquivar_conteudo" }, 500, origin); return json({ ok: true }, 200, origin);
}

async function notification(payload: Record<string, unknown>) {
  const bookingId = cleanText(payload.bookingId, 36), notificationToken = cleanText(payload.notificationToken, 64); if (!validUuid(bookingId) || !validNotificationToken(notificationToken)) return json({ ok: false, error: "token_invalido" }, 403); const { data, error } = await supabase.rpc("joelma_get_notification", { p_booking_id: bookingId, p_notification_token: notificationToken }); if (error || !data) return json({ ok: false, error: "reserva_nao_encontrada" }, 404); return json({ ok: true, booking: data });
}

async function notificationResult(payload: Record<string, unknown>) {
  const bookingId = cleanText(payload.bookingId, 36), notificationToken = cleanText(payload.notificationToken, 64), success = payload.success === true; if (!validUuid(bookingId) || !validNotificationToken(notificationToken)) return json({ ok: false, error: "token_invalido" }, 403); const { data, error } = await supabase.rpc("joelma_mark_notification", { p_booking_id: bookingId, p_notification_token: notificationToken, p_success: success, p_provider_id: cleanText(payload.providerId, 200) || null, p_error: cleanText(payload.error, 500) || null }); if (error || data !== true) return json({ ok: false, error: "reserva_nao_encontrada" }, 404); return json({ ok: true });
}

async function calendarEventResult(payload: Record<string, unknown>) {
  const bookingId = cleanText(payload.bookingId, 36), notificationToken = cleanText(payload.notificationToken, 64), calendarEventId = cleanText(payload.calendarEventId, 255); if (!validUuid(bookingId) || !validNotificationToken(notificationToken) || calendarEventId.length < 3) return json({ ok: false, error: "token_ou_evento_invalido" }, 403); const { data, error } = await supabase.rpc("joelma_mark_calendar_event", { p_booking_id: bookingId, p_notification_token: notificationToken, p_calendar_event_id: calendarEventId }); if (error || data !== true) { console.error("calendar_event_result_error", error?.code ?? "not_updated"); return json({ ok: false, error: "reserva_nao_encontrada" }, 404); } return json({ ok: true });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin"); if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) }); if (!isBrowserOriginAllowed(origin)) return json({ ok: false, error: "origem_nao_permitida" }, 403, origin);
  const url = new URL(req.url); if (req.method === "GET" && url.searchParams.has("date")) return availability(url, origin); if (req.method === "GET" && url.searchParams.get("action") === "catalog") return catalog(origin); if (req.method === "GET" && url.searchParams.get("action") === "public-config") return publicConfig(origin); if (req.method !== "POST") return json({ ok: false, error: "metodo_nao_permitido" }, 405, origin);
  const length = Number(req.headers.get("content-length") || "0"); if (length > 16_384) return json({ ok: false, error: "payload_muito_grande" }, 413, origin);
  let payload: Record<string, unknown>; try { payload = await req.json(); } catch { return json({ ok: false, error: "json_invalido" }, 400, origin); }
  const action = cleanText(payload.action, 40) || "book";
  if (action === "book") return booking(payload, origin, req); if (action === "account-data") return accountData(req, origin); if (action === "update-profile") return updateProfile(payload, req, origin); if (action === "vip-content") return vipContent(req, origin); if (action === "admin-data") return adminData(req, origin); if (action === "update-booking-status") return updateBookingStatus(payload, req, origin); if (action === "set-client-vip") return setClientVip(payload, req, origin); if (action === "upsert-service") return upsertService(payload, req, origin); if (action === "upsert-vip-content") return upsertVipContent(payload, req, origin); if (action === "archive-vip-content") return archiveVipContent(payload, req, origin); if (action === "notification") return notification(payload); if (action === "notification-result") return notificationResult(payload); if (action === "calendar-event-result") return calendarEventResult(payload); return json({ ok: false, error: "acao_invalida" }, 400, origin);
});
