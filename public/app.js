import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";

const APP_CONFIG = {
  appName: "Habitar o Corpo",
  shortName: "Joelma Souza",
  brand: "Joelma Souza — Terapeuta Integrativa",
  concept: "Habitar o Corpo",
  phrase: "Habitar o corpo é voltar para si.",
  whatsapp: "5512988830247",
  pixKey: "",
  adminEmail: "joelmaespacosama@gmail.com",
  address: "Rua Fabiola Regina Sardinha, 47 - Res. Armando Moreira Righi, São José dos Campos - SP, CEP: 12247-812",
  defaultDuration: "1h30",
  defaultPrice: "R$ 300,00",
  domain: "app.joelmasouzaoficial.com.br",
};

const AGE_VERIFICATION_KEY = "habitar_age_verified";
const CLIENTS_STORAGE_KEY = "habitar_clients";
const APPOINTMENTS_STORAGE_KEY = "habitar_appointments";
const VIP_CONTENTS_STORAGE_KEY = "habitar_vip_contents";
const SESSION_STORAGE_KEY = "habitar_session";
const LEGACY_CLIENT_KEYS = [
  "clients",
  "customers",
  "users",
  "registeredUsers",
  "mockClients",
  "habitar_users",
  "habitar_customers",
];
const WHATSAPP_NUMBER = APP_CONFIG.whatsapp;
const VIP_NOTICE = "Conteúdo privado, autorizado apenas para uso pessoal da cliente cadastrada.";
const BOOKING_API_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co/functions/v1/joelma-booking";
const AUTH_API_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co/functions/v1/joelma-auth";
const SUPABASE_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_2nB7J2RIftfVxU1wuOXLFQ_50-ksYBZ";
const authClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
const businessHours = [
  ["Terça-feira", "09:00 às 19:00"],
  ["Quarta-feira", "09:00 às 19:00"],
  ["Quinta-feira", "09:00 às 19:00"],
  ["Sexta-feira", "09:00 às 19:00"],
  ["Sábado", "09:00 às 19:00"],
  ["Domingo", "Fechado"],
  ["Segunda-feira", "Sob consulta / fechado provisoriamente"],
];

const initialServices = [
  {
    id: "terapia-tantrica-integrativa",
    name: "Terapia Tântrica Integrativa",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Atendimento integrativo com foco em presença, consciência corporal, acolhimento e reconexão consigo.",
    benefits: ["Presença corporal", "Autoconhecimento", "Acolhimento individual"],
  },
  {
    id: "curso-vip-massagem-integrativa-tantrica",
    name: "Curso VIP — Massagem Integrativa Tântrica",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Experiência individual de aprendizado com orientação personalizada, ética e linguagem profissional.",
    benefits: ["Orientação personalizada", "Prática guiada", "Conteúdo reservado"],
  },
  {
    id: "epilacao-cera-hidrossoluvel-depilacao",
    name: "Epilação com Cera Hidrossolúvel e Depilação",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Serviço de cuidado corporal com técnica, higiene e atendimento reservado.",
    benefits: ["Cuidado estético", "Ambiente reservado", "Atendimento profissional"],
  },
  {
    id: "vivencia-erotismo-mistico",
    name: "Vivência em Erotismo Místico",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Vivência reservada para autoconhecimento, presença e consciência corporal, conduzida com respeito e ética.",
    benefits: ["Autoconhecimento", "Presença", "Cuidado reservado"],
  },
  {
    id: "massagem-pedras-quentes",
    name: "Massagem Relaxante com Pedras Quentes",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Massagem relaxante com pedras aquecidas para conforto, descanso e bem-estar corporal.",
    benefits: ["Relaxamento", "Conforto térmico", "Alívio de tensões"],
  },
  {
    id: "vivencia-massagem-nuru",
    name: "Vivência com Massagem Nuru",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Vivência corporal reservada, conduzida com cuidado, consentimento e ambiente preparado.",
    benefits: ["Consciência corporal", "Presença", "Ambiente reservado"],
  },
  {
    id: "massagem-relaxante-terapeutica",
    name: "Massagem Relaxante Terapêutica",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Técnicas terapêuticas para relaxamento, alívio de tensões e bem-estar.",
    benefits: ["Bem-estar", "Relaxamento profundo", "Cuidado humanizado"],
  },
  {
    id: "terapia-massagem-tantrica-homens",
    name: "Terapia & Massagem Tântrica para Homens",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Atendimento individual para homens com foco em consciência corporal, respiração e presença.",
    benefits: ["Respiração", "Presença corporal", "Acolhimento"],
  },
  {
    id: "terapia-massagem-tantrica-mulheres",
    name: "Terapia & Massagem Tântrica para Mulheres",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Atendimento individual para mulheres com foco em cuidado, reconexão e acolhimento.",
    benefits: ["Reconexão", "Acolhimento", "Autoconhecimento"],
  },
  {
    id: "atendimento-online",
    name: "Atendimento Online",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Sessão online para orientação, escuta e acompanhamento integrativo.",
    benefits: ["Acesso remoto", "Orientação individual", "Praticidade"],
  },
  {
    id: "atendimento-externo",
    name: "Atendimento Externo",
    duration: APP_CONFIG.defaultDuration,
    price: APP_CONFIG.defaultPrice,
    description: "Atendimento fora do espaço principal, mediante consulta prévia de disponibilidade e deslocamento.",
    benefits: ["Flexibilidade", "Consulta prévia", "Atendimento personalizado"],
  },
];

const initialAppointments = [];

const initialClients = [];

const initialVipContents = [];

const initialAdmins = [];

const availableTimes = ["09:00", "10:30", "13:30", "15:00", "16:30"];

const state = {
  route: "home",
  params: {},
  selectedServiceId: "",
  bookingDraft: null,
  recoveryResult: null,
  vipUser: null,
  client: null,
  admin: null,
  authReady: false,
  authSession: null,
  accountAppointments: [],
  adminAppointments: [],
  adminClients: [],
};

const app = document.querySelector("#app");
const appFrame = document.querySelector(".app-frame");

const store = {
  read(key, fallback) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  },
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const localDataStore = {
  getClients() {
    return store.read(CLIENTS_STORAGE_KEY, []);
  },
  saveClients(clients) {
    store.write(CLIENTS_STORAGE_KEY, clients);
  },
  findClientByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return this.getClients().find((client) => normalizeEmail(client.email) === normalizedEmail) || null;
  },
  createClient(client) {
    if (this.findClientByEmail(client.email)) return null;
    return this.updateClient({
      ...client,
      id: client.id || crypto.randomUUID(),
      role: "client",
      isVip: Boolean(client.isVip),
      active: client.active !== false,
      createdAt: client.createdAt || new Date().toISOString(),
    });
  },
  updateClient(client) {
    const normalizedEmail = normalizeEmail(client.email);
    const clients = this.getClients();
    const existing = clients.find((item) => item.id === client.id || normalizeEmail(item.email) === normalizedEmail);
    const now = new Date().toISOString();
    const nextClient = {
      ...existing,
      ...client,
      id: existing?.id || client.id || crypto.randomUUID(),
      email: normalizedEmail,
      role: "client",
      isVip: Boolean(client.isVip ?? existing?.isVip),
      active: client.active !== false,
      createdAt: existing?.createdAt || client.createdAt || now,
      updatedAt: now,
    };
    this.saveClients(existing ? clients.map((item) => (item.id === existing.id ? nextClient : item)) : [nextClient, ...clients]);
    return nextClient;
  },
  deleteClient(id) {
    this.saveClients(this.getClients().filter((client) => client.id !== id));
  },
  getAppointments() {
    return store.read(APPOINTMENTS_STORAGE_KEY, []);
  },
  saveAppointments(appointments) {
    store.write(APPOINTMENTS_STORAGE_KEY, appointments);
  },
  getVipContents() {
    return store.read(VIP_CONTENTS_STORAGE_KEY, []);
  },
  saveVipContents(contents) {
    store.write(VIP_CONTENTS_STORAGE_KEY, contents);
  },
  getSession() {
    return store.read(SESSION_STORAGE_KEY, null);
  },
  saveSession(session) {
    store.write(SESSION_STORAGE_KEY, session);
  },
  clearSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },
  clearTestData() {
    [CLIENTS_STORAGE_KEY, APPOINTMENTS_STORAGE_KEY, VIP_CONTENTS_STORAGE_KEY, SESSION_STORAGE_KEY].forEach((key) => localStorage.removeItem(key));
  },
};

function seedData() {
  localStorage.removeItem("services");
  localStorage.removeItem(VIP_CONTENTS_STORAGE_KEY);
  localStorage.removeItem("vipContents");
  [CLIENTS_STORAGE_KEY, APPOINTMENTS_STORAGE_KEY, SESSION_STORAGE_KEY, "admins", "clientSession", "vipUsers"].forEach((key) => localStorage.removeItem(key));
  LEGACY_CLIENT_KEYS.forEach((key) => localStorage.removeItem(key));
  state.client = null;
}

function resetDemoData() {
  localStorage.removeItem("services");
  localDataStore.saveAppointments([]);
  localDataStore.saveVipContents([]);
  localDataStore.saveClients([]);
  localStorage.removeItem("vipUsers");
  LEGACY_CLIENT_KEYS.forEach((key) => localStorage.removeItem(key));
  store.write("admins", initialAdmins);
  localDataStore.clearSession();
  localStorage.removeItem("clientSession");
  state.client = null;
}

function getServices() {
  return state.services || [];
}

function getAppointments() {
  return localDataStore.getAppointments();
}

function getVipContents() {
  return state.vipContents || [];
}

function getClients() {
  return localDataStore.getClients();
}

function saveClients(clients) {
  localDataStore.saveClients(clients);
}

function findClientByEmail(email) {
  return localDataStore.findClientByEmail(email);
}

function upsertClient(client) {
  return localDataStore.updateClient(client);
}

function deleteClientById(id) {
  localDataStore.deleteClient(id);
}

function mergeClientsByEmail(...clientGroups) {
  const merged = new Map();
  clientGroups.flat().filter(Boolean).forEach((client) => {
    const email = normalizeEmail(client.email || client.login);
    if (!email) return;
    const existing = merged.get(email) || {};
    merged.set(email, {
      ...existing,
      ...client,
      id: existing.id || client.id || crypto.randomUUID(),
      name: client.name || client.fullName || client.customerName || existing.name || "Cliente",
      phone: client.phone || client.customerPhone || client.whatsapp || existing.phone || "",
      city: client.city || existing.city || "",
      password: client.password || existing.password || "",
      email,
      role: "client",
      isVip: client.isVip !== undefined ? Boolean(client.isVip) : Boolean(existing.isVip || client.active),
      active: client.active !== undefined ? client.active !== false : existing.active !== false,
      createdAt: existing.createdAt || client.createdAt || new Date().toISOString(),
      updatedAt: client.updatedAt || existing.updatedAt || new Date().toISOString(),
    });
  });
  return [...merged.values()];
}

function migrateClients() {
  const hasOfficialClients = localStorage.getItem(CLIENTS_STORAGE_KEY) !== null;
  const currentClients = store.read(CLIENTS_STORAGE_KEY, []);
  const legacyClients = LEGACY_CLIENT_KEYS.flatMap((key) => store.read(key, []));
  const legacyVipUsers = store.read("vipUsers", [])
    .filter((user) => user.login && user.login.includes("@"))
    .map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone || "",
      email: user.login,
      city: user.city || "",
      password: user.password || crypto.randomUUID(),
      role: "client",
      isVip: Boolean(user.active),
      active: user.active !== false,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  const seedClients = hasOfficialClients ? [] : initialClients;
  const migratedClients = mergeClientsByEmail(seedClients, legacyVipUsers, legacyClients, currentClients);
  saveClients(migratedClients);
  LEGACY_CLIENT_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("vipUsers");
}

function migrateAppointments() {
  if (localStorage.getItem(APPOINTMENTS_STORAGE_KEY) !== null) return;
  const legacyAppointments = store.read("appointments", []);
  localDataStore.saveAppointments(legacyAppointments.length ? legacyAppointments : initialAppointments);
  localStorage.removeItem("appointments");
}

function migrateVipContents() {
  localStorage.removeItem(VIP_CONTENTS_STORAGE_KEY);
  localStorage.removeItem("vipContents");
}

function getAdmins() {
  return store.read("admins", []);
}

function getClientSession() {
  const legacySession = store.read("clientSession", null);
  if (legacySession && !localDataStore.getSession()) {
    localDataStore.saveSession(legacySession);
    localStorage.removeItem("clientSession");
  }
  const session = localDataStore.getSession();
  if (!session?.id) return null;
  return getClients().find((client) => client.id === session.id && client.active !== false) || null;
}

function saveClientSession(client) {
  const session = { id: client.id, email: client.email, loggedAt: new Date().toISOString() };
  localDataStore.saveSession(session);
  state.client = client;
}

function clearClientSession() {
  localDataStore.clearSession();
  localStorage.removeItem("clientSession");
  state.client = null;
}

async function apiRequest(action, payload = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (state.authSession?.access_token) headers.Authorization = `Bearer ${state.authSession.access_token}`;
  const response = await fetch(BOOKING_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...payload }),
  });
  const result = await response.json().catch(() => ({ ok: false, error: "resposta_invalida" }));
  if (!response.ok || result.ok !== true) {
    const error = new Error(result.error || "request_failed");
    error.status = response.status;
    throw error;
  }
  return result;
}

async function apiGet(action) {
  const response = await fetch(`${BOOKING_API_URL}?action=${encodeURIComponent(action)}`, {
    headers: { Accept: "application/json" },
  });
  const result = await response.json().catch(() => ({ ok: false, error: "resposta_invalida" }));
  if (!response.ok || result.ok !== true) throw new Error(result.error || "request_failed");
  return result;
}

async function loadCatalog() {
  const result = await apiGet("catalog");
  state.services = Array.isArray(result.services) ? result.services : [];
  return state.services;
}

async function loadPublicConfig() {
  const result = await apiGet("public-config");
  APP_CONFIG.pixKey = String(result.pix?.key || "");
  APP_CONFIG.pixType = String(result.pix?.type || "CPF");
  return result;
}

async function loadVipContents() {
  if (!state.authSession?.access_token) {
    state.vipContents = [];
    return [];
  }
  try {
    const result = await apiRequest("vip-content");
    state.vipContents = Array.isArray(result.contents) ? result.contents : [];
  } catch (error) {
    if (error?.status !== 403) console.warn("vip_content_unavailable");
    state.vipContents = [];
  }
  return state.vipContents;
}

function durationToMinutes(value) {
  const text = String(value || "").trim().toLowerCase();
  if (/^\d+$/.test(text)) return Number(text);
  const hourMatch = text.match(/(\d+)\s*h/);
  const minuteMatch = text.match(/h\s*(\d+)/) || text.match(/(\d+)\s*min/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  return hours * 60 + minutes || 90;
}

function priceToCents(value) {
  const text = String(value || "").trim();
  if (!text || /consulta/i.test(text)) return 0;
  const normalized = text.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : 0;
}

async function refreshAdminContent() {
  if (!state.admin) return;
  const dashboard = await apiRequest("admin-data");
  state.adminAppointments = dashboard.bookings || [];
  state.adminClients = dashboard.clients || [];
  state.adminServices = dashboard.services || [];
  state.adminVipContents = dashboard.vipContents || [];
  state.services = state.adminServices.filter((service) => service.active !== false);
  if (state.client?.isVip || state.admin) await loadVipContents();
}

async function authApiRequest(action, payload = {}, { authenticated = false } = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (authenticated && state.authSession?.access_token) headers.Authorization = `Bearer ${state.authSession.access_token}`;
  const response = await fetch(AUTH_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...payload }),
  });
  const result = await response.json().catch(() => ({ ok: false, error: "resposta_invalida" }));
  if (!response.ok || result.ok !== true) {
    const error = new Error(result.error || "request_failed");
    error.status = response.status;
    throw error;
  }
  return result;
}

async function trackActivity(eventName, metadata = {}) {
  if (!state.authSession?.access_token) return;
  try {
    await authApiRequest("track-event", { eventName, metadata }, { authenticated: true });
  } catch {
    // Telemetria nunca bloqueia a experiência do cliente.
  }
}

async function loadAccount(session, { renderAfter = true } = {}) {
  state.authSession = session;
  state.client = null;
  state.admin = null;
  state.accountAppointments = [];
  state.adminAppointments = [];
  state.adminClients = [];
  state.adminServices = [];
  state.adminVipContents = [];
  state.vipContents = [];
  if (session?.access_token) {
    const account = await apiRequest("account-data");
    state.client = account.profile;
    state.accountAppointments = account.bookings || [];
    if (account.isAdmin) {
      state.admin = { id: account.profile.id, email: account.profile.email, name: account.profile.name || "Administração" };
      const dashboard = await apiRequest("admin-data");
      state.adminAppointments = dashboard.bookings || [];
      state.adminClients = dashboard.clients || [];
      state.adminServices = dashboard.services || [];
      state.adminVipContents = dashboard.vipContents || [];
      state.services = state.adminServices.filter((service) => service.active !== false);
    }
    if (state.client?.isVip || account.isAdmin) await loadVipContents();
  }
  state.authReady = true;
  const nextRoute = new URLSearchParams(location.search).get("next");
  if (nextRoute) {
    history.replaceState(null, "", `/#${nextRoute}`);
    state.route = nextRoute;
  }
  if (renderAfter) render();
}

async function initializeAuth() {
  try {
    await Promise.allSettled([loadCatalog(), loadPublicConfig()]);
    const { data, error } = await authClient.auth.getSession();
    if (error) throw error;
    await loadAccount(data.session, { renderAfter: false });
  } catch (error) {
    console.error("auth_initialization_failed", error?.message || "unknown");
    state.authSession = null;
    state.client = null;
    state.admin = null;
    state.authReady = true;
  }
  render();
  authClient.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") return;
    if (event === "PASSWORD_RECOVERY") {
      state.authSession = session;
      state.authReady = true;
      history.replaceState(null, "", "/#nova-senha");
      state.route = "nova-senha";
      render();
      return;
    }
    window.setTimeout(() => loadAccount(session).catch(() => {
      state.authReady = true;
      render();
    }), 0);
  });
}

async function sendAccessLink(email, nextRoute, options = {}) {
  const redirect = `${location.origin}/?next=${encodeURIComponent(nextRoute)}`;
  const { error } = await authClient.auth.signInWithOtp({
    email: normalizeEmail(email),
    options: {
      shouldCreateUser: options.shouldCreateUser === true,
      emailRedirectTo: redirect,
      data: options.data || {},
    },
  });
  if (error) throw error;
}

async function signOut() {
  await authClient.auth.signOut();
  state.authSession = null;
  state.client = null;
  state.admin = null;
  state.accountAppointments = [];
  state.adminAppointments = [];
  state.adminClients = [];
}

function formatDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function appointmentStatusLabel(status) {
  const labels = {
    pending: "solicitado",
    confirmed: "confirmado",
    awaiting_payment: "aguardando pagamento",
    paid: "pago",
    completed: "concluído",
    canceled: "cancelado",
  };
  return labels[status] || status || "solicitado";
}

function vipTypeLabel(type) {
  const labels = {
    text: "Texto",
    video: "Vídeo",
    image: "Imagem",
    photo: "Imagem",
    pdf: "PDF",
    audio: "Áudio",
    link: "Link externo",
  };
  return labels[type] || type || "Conteúdo";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "data:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return `https://www.youtube.com/embed/${parsed.pathname.split("/embed/")[1]}`;
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }
  return "";
}

function getVimeoEmbedUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return "";
    const id = parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : "";
  } catch {
    return "";
  }
}

function getEmbeddableVideoUrl(url) {
  return getYoutubeEmbedUrl(url) || getVimeoEmbedUrl(url);
}

function hasExtension(url, extensions) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    return extensions.some((extension) => path.endsWith(extension));
  } catch {
    return false;
  }
}

function isYoutubeOrVimeo(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("youtube.com") || parsed.hostname === "youtu.be" || parsed.hostname.includes("vimeo.com");
  } catch {
    return false;
  }
}

function isUrlCompatibleWithType(type, url) {
  if (type === "text") return true;
  if (type === "video") return isYoutubeOrVimeo(url) || hasExtension(url, [".mp4"]);
  if (type === "photo") return hasExtension(url, [".jpg", ".jpeg", ".png", ".webp"]);
  if (type === "pdf") return hasExtension(url, [".pdf"]);
  if (type === "audio") return hasExtension(url, [".mp3", ".wav", ".ogg"]);
  if (type === "link") return true;
  return false;
}

function getUrlValidationMessage(type) {
  const messages = {
    video: "Use um link do YouTube, youtu.be, Vimeo ou uma URL direta .mp4.",
    photo: "Use uma URL de imagem .jpg, .jpeg, .png ou .webp.",
    pdf: "Use uma URL de arquivo PDF.",
    audio: "Use uma URL direta de áudio .mp3, .wav ou .ogg.",
    link: "Informe uma URL válida para o conteúdo externo.",
  };
  return messages[type] || "A URL não é compatível com o tipo escolhido.";
}

function getActiveVipContents() {
  return getVipContents().filter((content) => content.status === "active");
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function setRoute(route, params = {}) {
  if (route === "recuperar-senha" && state.route !== "recuperar-senha") {
    state.recoveryResult = null;
  }
  state.route = route;
  state.params = params;
  location.hash = params.id ? `${route}/${params.id}` : route;
  render();
}

function isAgeVerified() {
  return localStorage.getItem(AGE_VERIFICATION_KEY) === "true";
}

function applyAgeGateState() {
  const ageGate = document.querySelector("#ageGate");
  const ageDenied = document.querySelector("#ageDenied");
  const verified = isAgeVerified();

  ageGate?.classList.toggle("hidden-field", verified);
  ageDenied?.classList.add("hidden-field");
  appFrame?.classList.toggle("age-locked", !verified);
  document.body.classList.toggle("age-gate-open", !verified);
}

function bindAgeGate() {
  document.querySelector("#confirmAge")?.addEventListener("click", () => {
    localStorage.setItem(AGE_VERIFICATION_KEY, "true");
    applyAgeGateState();
  });
  document.querySelector("#denyAge")?.addEventListener("click", () => {
    document.querySelector("#ageGate")?.classList.add("hidden-field");
    document.querySelector("#ageDenied")?.classList.remove("hidden-field");
    appFrame?.classList.add("age-locked");
    document.body.classList.add("age-gate-open");
  });
  document.querySelector("#leaveApp")?.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

window.clearHabitarAgeVerification = function clearHabitarAgeVerification() {
  localStorage.removeItem(AGE_VERIFICATION_KEY);
  applyAgeGateState();
};

window.resetAgeGate = function resetAgeGate() {
  localStorage.removeItem(AGE_VERIFICATION_KEY);
  location.reload();
};

function parseRoute() {
  const hash = location.hash.replace("#", "") || "home";
  const parts = hash.split("/");
  const [route, id] = parts;
  state.route = route;
  state.params = id ? { id } : {};
}

function cardService(service) {
  return `
    <article class="card service-card">
      <div class="card-icon">✦</div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="pill-row">
        <span>${service.duration}</span>
        <span>${service.price || "Sob consulta"}</span>
      </div>
      <div class="button-row">
        <button class="ghost-btn" data-detail="${service.id}">Detalhes</button>
        <button class="gold-btn" data-book="${service.id}">Agendar este serviço</button>
      </div>
    </article>
  `;
}

function renderHome() {
  const services = getServices().slice(0, 3);
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="script">${APP_CONFIG.phrase}</p>
        <h1>${APP_CONFIG.appName}</h1>
        <p>
          ${APP_CONFIG.brand}. Atendimentos com hora marcada em um espaço reservado para
          presença, consciência corporal, cuidado e reconexão consigo.
        </p>
        <div class="hero-actions">
          <button class="gold-btn" data-route="agendar">Agendar atendimento</button>
          <button class="light-btn" data-route="servicos">Conhecer serviços</button>
          <button class="light-btn" data-route="vip-login">Área VIP</button>
          <a class="outline-link" href="${waLink("Olá, Joelma! Gostaria de agendar um atendimento.")}" target="_blank" rel="noreferrer">Falar no WhatsApp</a>
        </div>
      </div>
    </section>

    <section class="champagne-section two-col">
      <div>
        <p class="eyebrow">Sobre a profissional</p>
        <h2>Acolhimento, presença e bem-estar corporal</h2>
      </div>
      <p>
        O conceito Habitar o Corpo nasce como um convite para voltar para si, com práticas
        integrativas, massagem, escuta cuidadosa e atendimentos individuais em ambiente reservado.
      </p>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <p class="eyebrow">Principais serviços</p>
        <h2>Escolha o cuidado ideal para o seu momento</h2>
      </div>
      <div class="card-grid">${services.map(cardService).join("")}</div>
    </section>

    <section class="cta-band">
      <p class="script">Habitar o corpo é voltar para si.</p>
      <h2>Agende seu atendimento com tranquilidade</h2>
      <button class="gold-btn" data-route="agendar">Começar agendamento</button>
    </section>

    <section class="contact-section">
      <div>
        <p class="eyebrow">Contato e atendimento</p>
        <h2>Espaço Joelma Souza</h2>
        <p>${APP_CONFIG.address}</p>
        <p>Pix: <strong>${APP_CONFIG.pixKey}</strong></p>
      </div>
      <div class="hours-grid">
        ${businessHours.map(([day, hours]) => `<span>${day}</span><strong>${hours}</strong>`).join("")}
      </div>
    </section>
  `;
}

function renderServicesPage() {
  return `
    <section class="page-title">
      <p class="eyebrow">Serviços</p>
      <h1>Atendimentos disponíveis</h1>
      <p>Todos os serviços usam comunicação segura, terapêutica e profissional.</p>
    </section>
    <section class="card-grid">${getServices().map(cardService).join("")}</section>
  `;
}

function renderServiceDetail() {
  const service = getServices().find((item) => item.id === state.params.id) || getServices()[0];
  return `
    <section class="detail-layout">
      <div class="detail-panel">
        <p class="eyebrow">Detalhe do serviço</p>
        <h1>${service.name}</h1>
        <p>${service.description}</p>
        <div class="pill-row">
          <span>${service.duration}</span>
          <span>${service.price || "Sob consulta"}</span>
        </div>
        <h2>Benefícios</h2>
        <ul class="benefit-list">${service.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}</ul>
        <button class="gold-btn" data-book="${service.id}">Agendar este serviço</button>
      </div>
      <div class="photo-panel"></div>
    </section>
  `;
}

function renderBooking() {
  const services = getServices();
  const selectedServiceId = state.selectedServiceId || services[0]?.id || "";
  const selectedDate = todayIso();
  const client = state.client;
  return `
    <section class="page-title">
      <p class="eyebrow">Agendamento</p>
      <h1>Solicitar atendimento</h1>
      <p>Escolha o serviço, data e horário. Horários já ocupados ficam bloqueados.</p>
      ${
        client
          ? `<p class="account-note">Você está agendando como <strong>${client.name}</strong>.</p>`
          : `<div class="account-callout"><span>Entre ou crie sua conta para acompanhar seus agendamentos.</span><button class="ghost-btn" data-route="minha-conta">Entrar ou criar conta</button></div>`
      }
    </section>
    <form class="form-shell" id="bookingForm">
      <label>Serviço
        <select name="serviceId" required>
          ${services.map((service) => `<option value="${service.id}" ${service.id === selectedServiceId ? "selected" : ""}>${service.name}</option>`).join("")}
        </select>
      </label>
      <div class="form-row">
        <label>Data <input name="date" type="date" min="${todayIso()}" value="${selectedDate}" required /></label>
        <label>Horário
          <select name="time" required>${timeOptions(selectedDate)}</select>
        </label>
      </div>
      ${client ? `
        <div class="form-row">
          <label>Nome <input name="customerName" autocomplete="name" readonly value="${escapeHtml(client.name || "")}" /></label>
          <label>Telefone/WhatsApp <input name="customerPhone" autocomplete="tel" readonly value="${escapeHtml(client.phone || "")}" /></label>
        </div>
        <label>E-mail <input name="customerEmail" type="email" autocomplete="email" readonly value="${escapeHtml(client.email || "")}" /></label>
      ` : ""}
      <label>Observações <textarea name="notes" rows="4" placeholder="Dúvidas ou informações práticas que queira acrescentar"></textarea></label>
      <button class="gold-btn" type="submit">${client ? "Confirmar agendamento" : "Entrar para confirmar"}</button>
      <p class="form-message" id="bookingMessage"></p>
    </form>
  `;
}

function renderAccount() {
  if (!state.client) {
    return `
      <section class="account-hero">
        <div>
          <p class="eyebrow">Minha Conta</p>
          <h1>Entre ou crie sua conta segura</h1>
          <p>Entre com seu WhatsApp e senha para acompanhar agendamentos e a liberação VIP.</p>
        </div>
        <div class="account-actions">
          <button class="gold-btn" data-route="entrar">Entrar</button>
          <button class="light-btn" data-route="criar-conta">Criar conta</button>
        </div>
      </section>
      <section class="champagne-section two-col">
        <div>
          <p class="script">Habitar o corpo é voltar para si.</p>
          <h2>Um espaço reservado para sua jornada</h2>
        </div>
        <p>Com a conta criada, seus próximos agendamentos ficam organizados e a liberação VIP pode ser ativada pela administração.</p>
      </section>
    `;
  }

  const appointments = state.accountAppointments;
  return `
    <section class="page-title">
      <p class="eyebrow">Minha Conta</p>
      <h1>Olá, ${escapeHtml(state.client.name || "cliente")}</h1>
      <p>${state.client.isVip ? "Seu acesso VIP está liberado." : "Seu acesso VIP ainda não está liberado."}</p>
      <div class="hero-actions">
        <button class="gold-btn" data-route="agendar">Novo agendamento</button>
        <button class="ghost-btn" data-route="vip-login">Área VIP</button>
        <button class="danger-btn" id="clientLogout">Sair</button>
      </div>
    </section>
    <section class="account-grid">
      <form class="form-shell account-form" id="clientProfileForm">
        <p class="eyebrow">Meus dados</p>
        <label>Nome completo <input name="name" required value="${escapeHtml(state.client.name || "")}" /></label>
        <label>Telefone / WhatsApp <input name="phone" required value="${escapeHtml(state.client.phone || "")}" /></label>
        <label>E-mail <input name="email" type="email" readonly value="${escapeHtml(state.client.email || "")}" /></label>
        <label>Cidade <input name="city" required value="${escapeHtml(state.client.city || "")}" /></label>
        <button class="gold-btn" type="submit">Salvar dados</button>
        <p class="form-message" id="profileMessage"></p>
      </form>
      <section class="account-card">
        <p class="eyebrow">Meus agendamentos</p>
        <h2>Acompanhamento</h2>
        <div class="appointment-stack">
          ${appointments.length ? appointments.map(clientAppointmentCard).join("") : "<p>Nenhum agendamento encontrado para sua conta.</p>"}
        </div>
      </section>
    </section>
  `;
}

function renderClientLogin() {
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="clientLoginForm">
        <p class="eyebrow">Minha Conta</p>
        <h1>Entrar na sua conta</h1>
        <p>Use seu WhatsApp cadastrado e sua senha. O e-mail também pode ser usado como alternativa.</p>
        <label>WhatsApp ou e-mail <input name="identifier" autocomplete="username" required placeholder="(12) 99999-9999 ou email@exemplo.com" /></label>
        <label>Senha <input name="password" type="password" autocomplete="current-password" minlength="8" required /></label>
        <button class="gold-btn" type="submit">Entrar</button>
        <button class="ghost-btn" type="button" data-route="recuperar-senha">Esqueci minha senha</button>
        <button class="ghost-btn" type="button" data-route="criar-conta">Criar conta</button>
        <p class="form-message" id="clientLoginMessage"></p>
      </form>
    </section>
  `;
}

function renderPasswordRecovery() {
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="passwordRecoveryForm">
        <p class="eyebrow">Recuperação de acesso</p>
        <h1>Redefinir sua senha</h1>
        <p>Informe o e-mail cadastrado. Você receberá um link seguro para criar uma nova senha.</p>
        <label>E-mail <input name="email" type="email" autocomplete="email" required placeholder="seuemail@exemplo.com" /></label>
        <button class="gold-btn" type="submit">Enviar link de recuperação</button>
        <button class="ghost-btn" type="button" data-route="entrar">Voltar para entrar</button>
        <p class="form-message" id="passwordRecoveryMessage"></p>
      </form>
    </section>
  `;
}

function renderNewPassword() {
  if (!state.authSession?.access_token) {
    return `
      <section class="auth-layout">
        <div class="form-shell auth-card">
          <p class="eyebrow">Nova senha</p>
          <h1>Link de recuperação necessário</h1>
          <p>Abra o link recebido no seu e-mail para definir uma nova senha.</p>
          <button class="gold-btn" data-route="recuperar-senha">Enviar novo link</button>
        </div>
      </section>
    `;
  }
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="newPasswordForm">
        <p class="eyebrow">Nova senha</p>
        <h1>Crie sua nova senha</h1>
        <label>Nova senha <input name="password" type="password" autocomplete="new-password" minlength="8" required /></label>
        <label>Confirmar nova senha <input name="passwordConfirm" type="password" autocomplete="new-password" minlength="8" required /></label>
        <button class="gold-btn" type="submit">Salvar nova senha</button>
        <p class="form-message" id="newPasswordMessage"></p>
      </form>
    </section>
  `;
}

function renderClientSignup() {
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="clientSignupForm">
        <p class="eyebrow">Minha Conta</p>
        <h1>Criar conta segura</h1>
        <p>Cadastre seus dados uma única vez. O e-mail será usado para confirmação e recuperação da senha.</p>
        <label>Nome completo <input name="name" autocomplete="name" required placeholder="Nome completo" /></label>
        <label>Telefone / WhatsApp <input name="phone" autocomplete="tel" required placeholder="(12) 99999-9999" /></label>
        <label>E-mail <input name="email" type="email" autocomplete="email" required placeholder="email@exemplo.com" /></label>
        <label>Cidade <input name="city" required placeholder="Sua cidade" /></label>
        <label>Senha <input name="password" type="password" autocomplete="new-password" minlength="8" required /></label>
        <label>Confirmar senha <input name="passwordConfirm" type="password" autocomplete="new-password" minlength="8" required /></label>
        <label class="checkbox-label">
          <input name="acceptedTerms" type="checkbox" />
          <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>
        </label>
        <button class="ghost-btn" type="button" data-route="privacidade">Ler Política de Privacidade</button>
        <button class="gold-btn" type="submit">Criar conta</button>
        <button class="ghost-btn" type="button" data-route="entrar">Já tenho conta</button>
        <p class="form-message" id="clientSignupMessage"></p>
      </form>
    </section>
  `;
}

function getClientAppointments(client) {
  const email = normalizeEmail(client.email);
  const phone = normalizePhone(client.phone);
  return getAppointments().filter((appointment) => {
    const appointmentEmail = normalizeEmail(appointment.customerEmail);
    const appointmentPhone = normalizePhone(appointment.customerPhone || "");
    return appointment.clientId === client.id || appointmentEmail === email || appointmentPhone === phone;
  });
}

function clientAppointmentCard(appointment) {
  return `
    <article class="appointment-mini">
      <strong>${escapeHtml(appointment.serviceName || "Atendimento")}</strong>
      <span>${formatDate(appointment.date)} às ${escapeHtml(appointment.time || "")}</span>
      <small>${appointmentStatusLabel(appointment.status)}</small>
    </article>
  `;
}

function timeOptions(date) {
  return `<option value="">Selecione</option>${availableTimes
    .map((time) => `<option value="${time}">${time}</option>`)
    .join("")}`;
}

async function refreshAvailableTimes(date, select) {
  select.disabled = true;
  select.innerHTML = '<option value="">Consultando horários...</option>';
  try {
    const response = await fetch(`${BOOKING_API_URL}?date=${encodeURIComponent(date)}`, {
      headers: { Accept: "application/json" },
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true || !Array.isArray(result.slots)) {
      throw new Error("availability_failed");
    }
    const slots = result.slots
      .filter((item) => item && item.available === true && availableTimes.includes(item.slot))
      .map((item) => item.slot);
    select.innerHTML = slots.length
      ? `<option value="">Selecione</option>${slots.map((time) => `<option value="${time}">${time}</option>`).join("")}`
      : '<option value="">Nenhum horário disponível</option>';
  } catch {
    select.innerHTML = '<option value="">Não foi possível consultar</option>';
  } finally {
    select.disabled = false;
  }
}

function renderConfirmation() {
  const booking = state.bookingDraft;
  if (!booking) return renderBooking();
  return `
    <section class="success-panel">
      <p class="script">Agendamento confirmado</p>
      <h1>Seu horário está reservado</h1>
      <p>A confirmação foi registrada automaticamente. A Joelma receberá a notificação do agendamento.</p>
      <p class="pix-line">Pix para pagamento/sinal: <strong>${APP_CONFIG.pixKey}</strong></p>
      <div class="summary-box">
        <strong>${booking.serviceName}</strong>
        <span>${formatDate(booking.date)} às ${booking.time}</span>
        <span>${booking.customerName} · ${booking.customerPhone}</span>
      </div>
      <a class="gold-btn link-btn" href="${waLink("Olá, Joelma! Tenho uma dúvida sobre meu agendamento.")}" target="_blank" rel="noreferrer">Falar com a Joelma</a>
    </section>
  `;
}

function renderVipLogin() {
  if (state.client?.isVip) return renderVipContent();
  if (state.client && !state.client.isVip) {
    return `
      <section class="auth-layout">
        <div class="form-shell auth-card">
          <p class="eyebrow">Área VIP</p>
          <h1>Acesso ainda não liberado</h1>
          <p>Seu acesso VIP ainda não está liberado. Fale com a Joelma pelo WhatsApp.</p>
          <a class="gold-btn link-btn" href="${waLink("Olá, Joelma! Gostaria de liberar meu acesso VIP.")}" target="_blank" rel="noreferrer">Falar no WhatsApp</a>
          <button class="ghost-btn" data-route="minha-conta">Voltar para Minha Conta</button>
        </div>
      </section>
    `;
  }
  return `
    <section class="auth-layout">
      <div class="form-shell auth-card">
        <p class="eyebrow">Área VIP</p>
        <h1>Entre pela sua conta</h1>
        <p>${VIP_NOTICE}</p>
        <p>O acesso VIP usa a mesma conta e senha do aplicativo.</p>
        <button class="gold-btn" type="button" data-route="entrar">Entrar na minha conta</button>
        <button class="ghost-btn" type="button" data-route="minha-conta">Voltar para Minha Conta</button>
      </div>
    </section>
  `;
}

function renderVipContent() {
  const contents = getActiveVipContents();
  const selectedContent = state.params.id ? contents.find((content) => content.id === state.params.id) : null;
  return `
    <section class="page-title">
      <p class="eyebrow">VIP</p>
      <h1>Fotos e vídeos exclusivos</h1>
      <p>${VIP_NOTICE}</p>
      <button class="ghost-btn" data-route="minha-conta">Minha Conta</button>
    </section>
    <section class="media-grid">
      ${contents
        .map(
          (content) => `
          <button class="media-card media-button" data-open-vip="${content.id}" type="button">
            ${vipCardPreview(content)}
            <span>${vipTypeLabel(content.type)} · ${escapeHtml(content.category)}</span>
            <h3>${escapeHtml(content.title)}</h3>
            <p>${escapeHtml(content.description)}</p>
            <small>${formatDate(content.date)}</small>
          </button>
        `,
        )
        .join("") || `<div class="empty-state">Conteúdo exclusivo em preparação</div>`}
    </section>
    ${selectedContent ? renderVipModal(selectedContent) : ""}
  `;
}

function vipCardPreview(content) {
  const imageUrl = content.thumbnail || (["image", "photo"].includes(content.type) ? content.url : "");
  if (imageUrl) {
    return `<img src="${imageUrl}" alt="${escapeHtml(content.title)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'media-placeholder', textContent: 'Prévia indisponível' }))" />`;
  }
  return `<div class="media-placeholder">${vipTypeLabel(content.type)}</div>`;
}

function renderVipModal(content) {
  return `
    <div class="vip-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="vipModalTitle">
      <article class="vip-modal">
        <button class="modal-close" type="button" data-close-vip>Fechar</button>
        <p class="eyebrow">${escapeHtml(content.category)} · ${vipTypeLabel(content.type)}</p>
        <h2 id="vipModalTitle">${escapeHtml(content.title)}</h2>
        <p>${escapeHtml(content.description)}</p>
        ${renderVipMedia(content)}
      </article>
    </div>
  `;
}

function renderVipMedia(content) {
  const type = content.type === "photo" ? "image" : content.type;
  const url = String(content.url || "").trim();
  const textContent = String(content.textContent || "").trim();

  if (type === "text") {
    return `<div class="vip-text-content">${escapeHtml(textContent).replace(/\n/g, "<br />")}</div>`;
  }
  if (type === "video") {
    const embedUrl = getEmbeddableVideoUrl(url);
    if (embedUrl) {
      return `<div class="video-frame"><iframe src="${embedUrl}" title="${escapeHtml(content.title)}" allowfullscreen loading="lazy"></iframe></div>`;
    }
    if (hasExtension(url, [".mp4"])) {
      return `<video class="vip-video" controls src="${url}">Seu navegador não conseguiu reproduzir este vídeo.</video>`;
    }
    return `<a class="gold-btn link-btn" href="${url}" target="_blank" rel="noreferrer">Abrir vídeo</a>`;
  }
  if (type === "image") {
    return `<img class="vip-detail-image" src="${url}" alt="${escapeHtml(content.title)}" onerror="this.replaceWith(Object.assign(document.createElement('p'), { className: 'form-message', textContent: 'Não foi possível carregar esta imagem.' }))" />`;
  }
  if (type === "pdf") {
    return `<a class="gold-btn link-btn" href="${url}" target="_blank" rel="noreferrer">Abrir PDF</a>`;
  }
  if (type === "audio") {
    return `<audio class="vip-audio" controls src="${url}">Seu navegador não conseguiu reproduzir este áudio.</audio>`;
  }
  if (type === "link") {
    return `<a class="gold-btn link-btn" href="${url}" target="_blank" rel="noreferrer">Acessar conteúdo</a>`;
  }
  return `<a class="gold-btn link-btn" href="${url}" target="_blank" rel="noreferrer">Abrir conteúdo</a>`;
}

function renderAdminLogin() {
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="adminLoginForm">
        <p class="eyebrow">Administração</p>
        <h1>Painel seguro</h1>
        <p>Digite um e-mail autorizado. O acesso será confirmado por um link de uso único.</p>
        <label>E-mail administrativo <input name="email" type="email" required value="${escapeHtml(APP_CONFIG.adminEmail)}" /></label>
        <button class="gold-btn" type="submit">Enviar link administrativo</button>
        <p class="form-message" id="adminLoginMessage"></p>
      </form>
    </section>
  `;
}

function renderAdmin() {
  const appointments = state.adminAppointments;
  const todayAppointments = appointments.filter((item) => item.date === todayIso());
  const clients = state.adminClients;
  return `
    <section class="admin-shell">
      <div class="section-heading">
        <p class="eyebrow">Painel administrativo</p>
        <h1>Dashboard</h1>
        <div class="admin-actions">
          <button class="ghost-btn" id="adminLogout">Sair</button>
        </div>
      </div>
      <div class="stats-grid">
        <article><strong>${todayAppointments.length}</strong><span>Agendamentos hoje</span></article>
        <article><strong>${appointments.length}</strong><span>Total de solicitações</span></article>
        <article><strong>${clients.filter((client) => client.isVip).length}</strong><span>Clientes VIP ativos</span></article>
        <article><strong>${clients.length}</strong><span>Clientes cadastradas</span></article>
      </div>
      <div class="admin-grid">
        ${adminAppointments()}
        ${adminClients(clients)}
        ${adminServices()}
        ${adminVipContents()}
        ${adminSettings()}
      </div>
    </section>
  `;
}

function renderAdminClientsPage() {
  const clients = state.adminClients;
  return `
    <section class="admin-shell">
      <div class="section-heading">
        <p class="eyebrow">Painel administrativo</p>
        <h1>Clientes</h1>
        <div class="admin-actions">
          <button class="ghost-btn" data-route="admin">Voltar ao dashboard</button>
          <button class="ghost-btn" id="adminLogout">Sair</button>
        </div>
      </div>
      ${adminClients(clients)}
    </section>
  `;
}

function uniqueClients(appointments) {
  const clients = new Map();
  appointments.forEach((appointment) => {
    const key = normalizePhone(appointment.customerPhone);
    if (!clients.has(key)) {
      clients.set(key, {
        name: appointment.customerName,
        phone: appointment.customerPhone,
        email: appointment.customerEmail || "Sem e-mail",
        total: 0,
      });
    }
    clients.get(key).total += 1;
  });
  return [...clients.values()];
}

function adminAppointments() {
  const appointments = state.adminAppointments;
  const statuses = ["confirmed", "completed", "canceled", "no_show"];
  return `
    <section class="admin-card wide">
      <h2>Agendamentos</h2>
      <div class="table-list">
        ${appointments.length ? appointments.map((item) => `
          <article>
            <div><strong>${escapeHtml(item.customerName || "Cliente")}</strong><span>${escapeHtml(item.serviceName || "Atendimento")} · ${formatDate(item.date)} às ${escapeHtml(item.time || "")}</span></div>
            <select data-status="${item.id}">
              ${statuses.map((status) => `<option value="${status}" ${item.status === status ? "selected" : ""}>${appointmentStatusLabel(status)}</option>`).join("")}
            </select>
          </article>
        `).join("") : "<p>Nenhum agendamento cadastrado.</p>"}
      </div>
    </section>
  `;
}

function adminClients(clients) {
  return `
    <section class="admin-card wide">
      <h2>Clientes</h2>
      <strong class="admin-counter">Clientes cadastrados: ${clients.length}</strong>
      <div class="client-grid">
        ${clients.length ? clients.map((client) => `
          <article class="client-card">
            <strong>${escapeHtml(client.name || "Cliente")}</strong>
            <span>${escapeHtml(client.phone || "Telefone não informado")}</span>
            <span>${escapeHtml(client.email || "")}</span>
            <span>${escapeHtml(client.city || "Cidade não informada")}</span>
            <small>${client.isVip ? "VIP ativo" : "VIP não liberado"}</small>
            <div class="admin-actions">
              <button class="ghost-btn" data-toggle-client-vip="${client.id}">${client.isVip ? "Desativar VIP" : "Ativar VIP"}</button>
            </div>
          </article>
        `).join("") : "<p>Nenhuma cliente cadastrada ainda.</p>"}
      </div>
    </section>
  `;
}

function adminServices() {
  const services = state.adminServices?.length ? state.adminServices : getServices();
  return `
    <section class="admin-card">
      <h2>Serviços</h2>
      <form id="serviceForm" class="mini-form">
        <input name="name" placeholder="Nome do serviço" required />
        <input name="duration" placeholder="Duração" required />
        <input name="price" placeholder="Valor opcional" />
        <textarea name="description" placeholder="Descrição" required></textarea>
        <input name="benefits" placeholder="Benefícios separados por vírgula" required />
        <button class="gold-btn" type="submit">Criar serviço</button>
      </form>
      ${services.map((service) => `
        <div class="admin-item">
          <span>${service.name}</span>
          <div class="admin-actions">
            <button class="ghost-btn" data-edit-service="${service.id}">Editar</button>
            <button class="danger-btn" data-delete-service="${service.id}">Desativar</button>
          </div>
        </div>
      `).join("")}
    </section>
  `;
}

function adminVipContents() {
  const contents = state.adminVipContents || [];
  return `
    <section class="admin-card wide">
      <h2>Conteúdos VIP</h2>
      <form id="contentForm" class="mini-form">
        <div class="form-row">
          <input name="title" placeholder="Título" required />
          <input name="category" placeholder="Categoria" required />
        </div>
        <div class="form-row">
          <select name="type" required>
            <option value="">Tipo de conteúdo</option>
            <option value="text">Texto</option>
            <option value="video">Vídeo</option>
            <option value="photo">Imagem</option>
            <option value="pdf">PDF</option>
            <option value="link">Link externo</option>
          </select>
          <select name="status" required>
            <option value="active">Ativo</option>
            <option value="draft">Rascunho</option>
          </select>
        </div>
        <label class="vip-url-field">URL do conteúdo
          <input name="url" placeholder="https://youtube.com/watch?v=..." />
          <small>Para vídeos, envie para o YouTube como Não listado e cole o link aqui.</small>
        </label>
        <textarea name="textContent" placeholder="Conteúdo em texto, quando o tipo for texto"></textarea>
        <textarea name="description" placeholder="Descrição" required></textarea>
        <input name="access" type="hidden" value="VIP" />
        <button class="gold-btn" type="submit">Adicionar conteúdo</button>
        <p class="form-message" id="contentMessage"></p>
      </form>
      ${contents.map((content) => `
        <div class="admin-item">
          <span>${escapeHtml(content.title)} · ${vipTypeLabel(content.type)} · ${content.status === "active" ? "ativo" : "rascunho"}</span>
          <div class="admin-actions">
            <button class="ghost-btn" data-edit-content="${content.id}">Editar</button>
            <button class="ghost-btn" data-toggle-content="${content.id}">${content.status === "active" ? "Desativar" : "Ativar"}</button>
            <button class="danger-btn" data-delete-content="${content.id}">Arquivar</button>
          </div>
        </div>
      `).join("") || "<p>Nenhum conteúdo VIP cadastrado.</p>"}
    </section>
  `;
}

function adminSettings() {
  return `
    <section class="admin-card wide">
      <h2>Dados oficiais</h2>
      <div class="settings-grid">
        <article><strong>WhatsApp</strong><span>${APP_CONFIG.whatsapp}</span></article>
        <article><strong>Pix</strong><span>${APP_CONFIG.pixKey}</span></article>
        <article><strong>Domínio</strong><span>${APP_CONFIG.domain}</span></article>
        <article><strong>Endereço</strong><span>${APP_CONFIG.address}</span></article>
      </div>
      <h3>Horários de atendimento</h3>
      <div class="hours-grid">
        ${businessHours.map(([day, hours]) => `<span>${day}</span><strong>${hours}</strong>`).join("")}
      </div>
    </section>
  `;
}

function renderPrivacy() {
  return `
    <section class="page-title">
      <p class="eyebrow">Privacidade e LGPD</p>
      <h1>Política de Privacidade — Habitar o Corpo</h1>
      <p>Esta política explica, em linguagem clara, como os dados necessários ao aplicativo são utilizados para cadastro, segurança, agendamento e comunicação com clientes.</p>
    </section>
    <section class="champagne-section">
      <div>
        <h2>Dados utilizados</h2>
        <p>Podemos tratar nome, e-mail, telefone/WhatsApp, cidade, dados de autenticação, informações operacionais do agendamento e registros técnicos de uso e segurança.</p>
        <p>O aplicativo não exige que você informe detalhes íntimos ou clínicos nas observações do agendamento. Evite registrar informações sensíveis desnecessárias nesse campo.</p>
        <h2>Finalidades</h2>
        <p>Os dados são utilizados para criar e proteger sua conta, confirmar identidade, organizar horários, comunicar confirmações, administrar acessos VIP, prestar o serviço solicitado, prevenir abuso e compreender o funcionamento do aplicativo.</p>
        <h2>Serviços utilizados</h2>
        <p>Quando necessário à operação, dados mínimos podem ser processados por fornecedores de infraestrutura, autenticação, hospedagem, e-mail, WhatsApp e Google Calendar. Esses serviços são usados somente para viabilizar as funções do aplicativo.</p>
        <h2>Retenção e segurança</h2>
        <p>Os dados são mantidos pelo tempo necessário à operação, segurança, histórico do serviço e obrigações aplicáveis. O acesso administrativo é restrito e senhas não são armazenadas em texto aberto pelo aplicativo.</p>
        <h2>Seus direitos</h2>
        <p>Você pode solicitar informações, correção e, quando aplicável, exclusão ou limitação do tratamento dos seus dados. Solicitações podem ser feitas pelo e-mail <strong>${escapeHtml(APP_CONFIG.adminEmail)}</strong> ou pelo WhatsApp oficial.</p>
        <h2>Compartilhamento</h2>
        <p>Dados de clientes não são vendidos. O compartilhamento ocorre somente quando necessário à operação do serviço, segurança, atendimento ou cumprimento de obrigação aplicável.</p>
        <p><small>Última atualização: 18/08/2026. Esta política operacional pode ser atualizada quando novas funcionalidades forem adicionadas.</small></p>
        <button class="gold-btn" data-route="home">Voltar ao início</button>
      </div>
    </section>
  `;
}

function render() {
  parseRoute();
  if (!state.authReady) {
    app.innerHTML = `<section class="auth-layout"><div class="form-shell auth-card"><p class="eyebrow">Habitar o Corpo</p><h1>Carregando acesso seguro...</h1></div></section>`;
    return;
  }
  if (state.route === "vip-conteudo" && !state.client?.isVip) state.route = "vip-login";
  if (state.route === "admin" && !state.admin) state.route = "admin-login";
  if (state.route === "clientes" && !state.admin) state.route = "admin-login";
  document.body.classList.toggle("admin-logged-in", Boolean(state.admin));
  document.querySelectorAll(".admin-only-nav").forEach((link) => {
    link.classList.toggle("hidden-field", !state.admin);
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const accountRoutes = ["minha-conta", "entrar", "criar-conta", "recuperar-senha", "nova-senha"];
    const isAccount = link.dataset.nav === "minha-conta" && accountRoutes.includes(state.route);
    link.classList.toggle("active", link.dataset.nav === state.route || isAccount);
  });
  const routes = {
    home: renderHome,
    servicos: renderServicesPage,
    servico: renderServiceDetail,
    agendar: renderBooking,
    confirmacao: renderConfirmation,
    "minha-conta": renderAccount,
    entrar: renderClientLogin,
    "criar-conta": renderClientSignup,
    "recuperar-senha": renderPasswordRecovery,
    "nova-senha": renderNewPassword,
    "vip-login": renderVipLogin,
    "vip-conteudo": renderVipContent,
    "admin-login": renderAdminLogin,
    admin: renderAdmin,
    clientes: renderAdminClientsPage,
    privacidade: renderPrivacy,
  };
  app.innerHTML = (routes[state.route] || renderHome)();
  bindEvents();
  app.focus();
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => setRoute(button.dataset.route)));
  document.querySelectorAll("[data-detail]").forEach((button) => button.addEventListener("click", () => setRoute("servico", { id: button.dataset.detail })));
  document.querySelectorAll("[data-book]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedServiceId = button.dataset.book;
      setRoute("agendar");
    });
  });

  const bookingForm = document.querySelector("#bookingForm");
  if (bookingForm) {
    const dateInput = bookingForm.elements.date;
    const timeInput = bookingForm.elements.time;
    const refreshTimes = () => refreshAvailableTimes(dateInput.value, timeInput);
    dateInput.addEventListener("change", refreshTimes);
    bookingForm.addEventListener("submit", submitBooking);
    refreshTimes();
  }

  document.querySelector("#clientLoginForm")?.addEventListener("submit", submitClientLogin);
  document.querySelector("#clientSignupForm")?.addEventListener("submit", submitClientSignup);
  document.querySelector("#passwordRecoveryForm")?.addEventListener("submit", submitPasswordRecovery);
  document.querySelector("#newPasswordForm")?.addEventListener("submit", submitNewPassword);
  document.querySelector("#clientProfileForm")?.addEventListener("submit", updateClientProfile);
  document.querySelector("#clientLogout")?.addEventListener("click", async () => {
    await signOut();
    setRoute("minha-conta");
  });
  document.querySelector("#adminLoginForm")?.addEventListener("submit", submitAdminLogin);
  document.querySelector("#adminLogout")?.addEventListener("click", async () => {
    await signOut();
    setRoute("admin-login");
  });

  document.querySelectorAll("[data-status]").forEach((select) => select.addEventListener("change", updateAppointmentStatus));
  document.querySelector("#serviceForm")?.addEventListener("submit", createService);
  const contentForm = document.querySelector("#contentForm");
  if (contentForm) {
    const syncContentFields = () => updateContentFormFields(contentForm);
    contentForm.elements.type.addEventListener("change", syncContentFields);
    syncContentFields();
    contentForm.addEventListener("submit", createVipContent);
  }
  document.querySelectorAll("[data-delete-service]").forEach((button) => button.addEventListener("click", deleteService));
  document.querySelectorAll("[data-edit-service]").forEach((button) => button.addEventListener("click", editService));
  document.querySelectorAll("[data-toggle-client-vip]").forEach((button) => button.addEventListener("click", toggleClientVip));
  document.querySelectorAll("[data-open-vip]").forEach((button) => button.addEventListener("click", () => setRoute("vip-conteudo", { id: button.dataset.openVip })));
  document.querySelectorAll("[data-close-vip]").forEach((button) => button.addEventListener("click", () => setRoute("vip-conteudo")));
  document.querySelectorAll("[data-delete-content]").forEach((button) => button.addEventListener("click", deleteVipContent));
  document.querySelectorAll("[data-edit-content]").forEach((button) => button.addEventListener("click", editVipContent));
  document.querySelectorAll("[data-toggle-content]").forEach((button) => button.addEventListener("click", toggleVipContent));
}

async function submitBooking(event) {
  event.preventDefault();
  if (!state.authSession?.access_token || !state.client) {
    setRoute("entrar");
    return;
  }
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());
  const service = getServices().find((item) => item.id === formData.serviceId);
  const message = document.querySelector("#bookingMessage");
  const submitButton = form.querySelector('button[type="submit"]');
  if (!service || !formData.time) {
    message.textContent = "Escolha um serviço e um horário disponível.";
    return;
  }
  submitButton.disabled = true;
  message.textContent = "Confirmando seu horário...";
  await trackActivity("booking_started", { serviceId: service.id, date: formData.date });
  try {
    const response = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${state.authSession.access_token}`,
      },
      body: JSON.stringify({
        action: "book",
        idempotencyKey: crypto.randomUUID(),
        serviceId: service.id,
        customerName: state.client.name,
        customerPhone: state.client.phone,
        customerEmail: state.client.email,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      }),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) {
      if (response.status === 401 || response.status === 403) {
        message.textContent = "Sua sessão expirou. Entre novamente para confirmar.";
        return;
      }
      if (response.status === 409 || result.error === "horario_indisponivel") {
        message.textContent = "Este horário acabou de ficar indisponível. Escolha outro.";
        await refreshAvailableTimes(formData.date, form.elements.time);
        return;
      }
      throw new Error(result.error || "booking_failed");
    }
    const appointment = {
      id: result.bookingId,
      clientId: state.client.id,
      serviceId: service.id,
      serviceName: service.name,
      customerName: state.client.name,
      customerPhone: state.client.phone,
      customerEmail: state.client.email,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      status: "confirmed",
      startAt: result.startAt,
      endAt: result.endAt,
      createdAt: new Date().toISOString(),
    };
    state.accountAppointments = [appointment, ...state.accountAppointments.filter((item) => item.id !== appointment.id)];
    state.bookingDraft = appointment;
    await trackActivity("booking_completed", { serviceId: service.id, bookingId: result.bookingId });
    setRoute("confirmacao");
  } catch {
    message.textContent = "Não foi possível confirmar agora. Tente novamente em instantes.";
  } finally {
    submitButton.disabled = false;
  }
}

async function submitClientLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const message = document.querySelector("#clientLoginMessage");
  const button = event.currentTarget.querySelector('button[type="submit"]');
  const identifier = String(data.identifier || "").trim();
  const password = String(data.password || "");
  button.disabled = true;
  message.textContent = "Entrando...";
  try {
    if (identifier.includes("@")) {
      const { data: loginData, error } = await authClient.auth.signInWithPassword({ email: normalizeEmail(identifier), password });
      if (error) throw error;
      if (loginData.session) await loadAccount(loginData.session, { renderAfter: false });
    } else {
      const result = await authApiRequest("login-with-phone", { phone: identifier, password });
      const { data: sessionData, error } = await authClient.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      if (error) throw error;
      if (sessionData.session) await loadAccount(sessionData.session, { renderAfter: false });
    }
    await trackActivity("login_success");
    setRoute("minha-conta");
  } catch {
    message.textContent = "WhatsApp/e-mail ou senha inválidos.";
  } finally {
    button.disabled = false;
  }
}

async function submitClientSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const message = document.querySelector("#clientSignupMessage");
  const email = normalizeEmail(data.email);
  const password = String(data.password || "");

  if (!String(data.name || "").trim()) { message.textContent = "Informe seu nome completo."; return; }
  if (!String(data.phone || "").trim()) { message.textContent = "Informe seu telefone/WhatsApp."; return; }
  if (!email || !isValidEmail(email)) { message.textContent = "Informe um e-mail válido."; return; }
  if (password.length < 8) { message.textContent = "Crie uma senha com pelo menos 8 caracteres."; return; }
  if (password !== String(data.passwordConfirm || "")) { message.textContent = "As senhas não coincidem."; return; }
  if (!form.elements.acceptedTerms.checked) { message.textContent = "Aceite os Termos de Uso e a Política de Privacidade."; return; }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Criando sua conta segura...";
  try {
    const redirect = `${location.origin}/?next=${encodeURIComponent("minha-conta")}`;
    const { data: signUpData, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirect,
        data: {
          full_name: String(data.name).trim(),
          phone: String(data.phone).trim(),
          city: String(data.city || "").trim(),
          accepted_terms_at: new Date().toISOString(),
        },
      },
    });
    if (error) throw error;
    if (signUpData.session) {
      await loadAccount(signUpData.session, { renderAfter: false });
      setRoute("minha-conta");
      return;
    }
    message.textContent = "Conta criada. Confira seu e-mail para confirmar o cadastro e depois entre com sua senha.";
  } catch {
    message.textContent = "Não foi possível criar a conta agora. Confira os dados ou tente novamente em instantes.";
  } finally {
    button.disabled = false;
  }
}

async function submitPasswordRecovery(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const email = normalizeEmail(data.email);
  const message = document.querySelector("#passwordRecoveryMessage");
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Enviando link de recuperação...";
  try {
    const redirectTo = `${location.origin}/?next=${encodeURIComponent("nova-senha")}`;
    const { error } = await authClient.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    message.textContent = "Se este e-mail estiver cadastrado, você receberá o link para criar uma nova senha. Confira também o spam.";
  } catch {
    message.textContent = "Não foi possível enviar a recuperação agora. Tente novamente em instantes.";
  } finally {
    button.disabled = false;
  }
}

async function submitNewPassword(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const password = String(data.password || "");
  const message = document.querySelector("#newPasswordMessage");
  if (password.length < 8) { message.textContent = "Use pelo menos 8 caracteres."; return; }
  if (password !== String(data.passwordConfirm || "")) { message.textContent = "As senhas não coincidem."; return; }
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Salvando nova senha...";
  try {
    const { error } = await authClient.auth.updateUser({ password });
    if (error) throw error;
    message.textContent = "Senha atualizada com sucesso.";
    window.setTimeout(() => setRoute("minha-conta"), 500);
  } catch {
    message.textContent = "Não foi possível atualizar a senha. Solicite um novo link de recuperação.";
  } finally {
    button.disabled = false;
  }
}

async function updateClientProfile(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const message = document.querySelector("#profileMessage");

  if (!data.name.trim() || !data.phone.trim()) {
    message.textContent = "Revise nome e telefone.";
    return;
  }
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Salvando...";
  try {
    const result = await apiRequest("update-profile", {
      name: data.name.trim(),
      phone: data.phone.trim(),
      city: data.city.trim(),
    });
    state.client = result.profile;
    message.textContent = "Dados atualizados com sucesso.";
  } catch {
    message.textContent = "Não foi possível atualizar agora.";
  } finally {
    button.disabled = false;
  }
}

async function submitAdminLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const message = document.querySelector("#adminLoginMessage");
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Enviando link administrativo...";
  try {
    await sendAccessLink(data.email, "admin", { shouldCreateUser: true });
    message.textContent = "Link enviado. Abra o e-mail e clique para acessar o painel.";
  } catch {
    message.textContent = "Não foi possível enviar o link administrativo agora.";
  } finally {
    button.disabled = false;
  }
}

async function updateAppointmentStatus(event) {
  const select = event.currentTarget;
  const previous = state.adminAppointments.find((item) => item.id === select.dataset.status)?.status;
  select.disabled = true;
  try {
    await apiRequest("update-booking-status", { bookingId: select.dataset.status, status: select.value });
    state.adminAppointments = state.adminAppointments.map((item) =>
      item.id === select.dataset.status ? { ...item, status: select.value } : item,
    );
  } catch {
    select.value = previous || "confirmed";
    alert("Não foi possível atualizar o status do agendamento.");
  } finally {
    select.disabled = false;
  }
}

async function createService(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  try {
    const result = await apiRequest("upsert-service", {
      id,
      name: data.name.trim(),
      durationMinutes: durationToMinutes(data.duration),
      priceCents: priceToCents(data.price),
      description: data.description.trim(),
      benefits: data.benefits.split(",").map((item) => item.trim()).filter(Boolean),
      sortOrder: (state.adminServices || []).reduce((max, item) => Math.max(max, Number(item.sortOrder || 0)), 0) + 10,
      active: true,
    });
    state.adminServices = [result.service, ...(state.adminServices || []).filter((item) => item.id !== result.service.id)];
    state.services = state.adminServices.filter((item) => item.active !== false);
    form.reset();
    render();
  } catch {
    alert("Não foi possível salvar o serviço.");
  }
}

async function deleteService(event) {
  const service = (state.adminServices || []).find((item) => item.id === event.currentTarget.dataset.deleteService);
  if (!service) return;
  try {
    const result = await apiRequest("upsert-service", { ...service, active: false });
    state.adminServices = state.adminServices.map((item) => item.id === result.service.id ? result.service : item);
    state.services = state.adminServices.filter((item) => item.active !== false);
    render();
  } catch {
    alert("Não foi possível desativar o serviço.");
  }
}

async function editService(event) {
  const serviceId = event.currentTarget.dataset.editService;
  const service = (state.adminServices || []).find((item) => item.id === serviceId) || getServices().find((item) => item.id === serviceId);
  if (!service) return;
  const name = prompt("Nome do serviço", service.name); if (!name) return;
  const duration = prompt("Duração", service.duration) || service.duration;
  const price = prompt("Valor", service.price) || service.price;
  const description = prompt("Descrição", service.description) || service.description;
  const benefits = prompt("Benefícios separados por vírgula", (service.benefits || []).join(", ")) || (service.benefits || []).join(", ");
  try {
    const result = await apiRequest("upsert-service", {
      id: service.id,
      name: name.trim(),
      durationMinutes: durationToMinutes(duration),
      priceCents: priceToCents(price),
      description: description.trim(),
      benefits: benefits.split(",").map((item) => item.trim()).filter(Boolean),
      sortOrder: Number(service.sortOrder || 0),
      active: service.active !== false,
    });
    state.adminServices = (state.adminServices || []).map((item) => item.id === serviceId ? result.service : item);
    state.services = state.adminServices.filter((item) => item.active !== false);
    render();
  } catch {
    alert("Não foi possível atualizar o serviço.");
  }
}

function editClient(event) {
  const clientId = event.currentTarget.dataset.editClient;
  const clients = getClients();
  const client = clients.find((item) => item.id === clientId);
  if (!client) return;

  const name = prompt("Nome completo", client.name);
  if (!name) return;
  const phone = prompt("Telefone / WhatsApp", client.phone) || client.phone;
  const email = normalizeEmail(prompt("E-mail", client.email) || client.email);
  const city = prompt("Cidade", client.city || "") || client.city || "";

  if (!isValidEmail(email)) {
    alert("E-mail inválido.");
    return;
  }
  if (clients.some((item) => item.id !== clientId && normalizeEmail(item.email) === email)) {
    alert("Já existe uma cliente com este e-mail.");
    return;
  }

  const updatedClient = upsertClient({ ...client, name: name.trim(), phone: phone.trim(), email, city: city.trim() });
  if (state.client?.id === clientId) {
    saveClientSession(updatedClient);
  }
  render();
}

function createAdminClient(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const message = document.querySelector("#adminClientMessage");
  const email = normalizeEmail(data.email);

  if (!data.name.trim() || !data.phone.trim() || !email || !isValidEmail(email) || !data.password) {
    message.textContent = "Preencha nome, telefone, e-mail válido e senha.";
    return;
  }
  if (findClientByEmail(email)) {
    message.textContent = "Já existe uma cliente com este e-mail.";
    return;
  }

  const client = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    phone: data.phone.trim(),
    email,
    city: data.city.trim(),
    password: data.password,
    role: "client",
    isVip: data.isVip === "true",
    acceptedTerms: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localDataStore.createClient(client);
  form.reset();
  render();
}

function resetClientPassword(event) {
  const clientId = event.currentTarget.dataset.resetClientPassword;
  const client = getClients().find((item) => item.id === clientId);
  if (!client) return;

  const password = prompt(`Digite a nova senha provisória para ${client.name}`);
  if (!password) return;
  const confirmation = prompt("Confirme a nova senha provisória");
  if (password !== confirmation) {
    alert("As senhas não conferem.");
    return;
  }

  upsertClient({ ...client, password });
  alert("Senha redefinida com sucesso.");
}

async function toggleClientVip(event) {
  const clientId = event.currentTarget.dataset.toggleClientVip;
  const client = state.adminClients.find((item) => item.id === clientId);
  if (!client) return;
  event.currentTarget.disabled = true;
  try {
    await apiRequest("set-client-vip", { userId: clientId, isVip: !client.isVip });
    state.adminClients = state.adminClients.map((item) => item.id === clientId ? { ...item, isVip: !item.isVip } : item);
    if (state.client?.id === clientId) state.client = { ...state.client, isVip: !client.isVip };
    render();
  } catch {
    event.currentTarget.disabled = false;
    alert("Não foi possível atualizar o acesso VIP.");
  }
}

function deleteClient(event) {
  const clientId = event.currentTarget.dataset.deleteClient;
  const client = getClients().find((item) => item.id === clientId);
  if (!client) return;
  if (!confirm(`Excluir a cliente ${client.name}? Esta ação não remove agendamentos já criados.`)) return;

  deleteClientById(clientId);
  if (state.client?.id === clientId) clearClientSession();
  render();
}

async function createVipContent(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const message = document.querySelector("#contentMessage");
  const validation = validateVipContentData(data);
  if (!validation.valid) { message.textContent = validation.message; return; }
  try {
    const result = await apiRequest("upsert-vip-content", {
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type.trim(),
      url: data.type === "text" ? "" : data.url.trim(),
      textContent: data.textContent.trim(),
      thumbnail: ["photo"].includes(data.type) ? data.url.trim() : "",
      category: data.category.trim(),
      status: data.status || "active",
      sortOrder: (state.adminVipContents || []).reduce((max, item) => Math.max(max, Number(item.sortOrder || 0)), 0) + 10,
    });
    await refreshAdminContent();
    form.reset();
    message.textContent = "Conteúdo VIP salvo com sucesso.";
    window.setTimeout(render, 350);
  } catch {
    message.textContent = "Não foi possível salvar o conteúdo VIP.";
  }
}

async function deleteVipContent(event) {
  const content = (state.adminVipContents || []).find((item) => item.id === event.currentTarget.dataset.deleteContent);
  if (!content) return;
  if (!confirm(`Arquivar o conteúdo "${content.title}"? Ele poderá ser republicado depois.`)) return;
  try {
    await apiRequest("archive-vip-content", { id: content.id });
    await refreshAdminContent();
    render();
  } catch {
    alert("Não foi possível arquivar o conteúdo.");
  }
}

async function editVipContent(event) {
  const contentId = event.currentTarget.dataset.editContent;
  const content = (state.adminVipContents || []).find((item) => item.id === contentId);
  if (!content) return;
  const title = prompt("Título do conteúdo", content.title); if (!title) return;
  const category = prompt("Categoria", content.category) || content.category;
  const type = prompt("Tipo: text, video, photo, pdf ou link", content.type) || content.type;
  const description = prompt("Descrição", content.description) || content.description;
  const url = type === "text" ? "" : prompt("URL/link do conteúdo", content.url || "") || content.url || "";
  const textContent = type === "text" ? prompt("Conteúdo em texto", content.textContent || "") || content.textContent || "" : prompt("Texto complementar opcional", content.textContent || "") || content.textContent || "";
  const validation = validateVipContentData({ title, category, type, description, url, textContent, status: content.status });
  if (!validation.valid) { alert(validation.message); return; }
  try {
    await apiRequest("upsert-vip-content", { id: content.id, title: title.trim(), category: category.trim(), type: type.trim(), description: description.trim(), url: type === "text" ? "" : url.trim(), textContent: textContent.trim(), thumbnail: type === "photo" ? url.trim() : content.thumbnail || "", status: content.status === "archived" ? "draft" : content.status, sortOrder: Number(content.sortOrder || 0) });
    await refreshAdminContent();
    render();
  } catch {
    alert("Não foi possível atualizar o conteúdo.");
  }
}

async function toggleVipContent(event) {
  const contentId = event.currentTarget.dataset.toggleContent;
  const content = (state.adminVipContents || []).find((item) => item.id === contentId);
  if (!content) return;
  try {
    await apiRequest("upsert-vip-content", { id: content.id, title: content.title, category: content.category, type: content.type, description: content.description, url: content.url || "", textContent: content.textContent || "", thumbnail: content.thumbnail || "", status: content.status === "active" ? "draft" : "active", sortOrder: Number(content.sortOrder || 0) });
    await refreshAdminContent();
    render();
  } catch {
    alert("Não foi possível alterar o status do conteúdo.");
  }
}

function updateContentFormFields(form) {
  const type = form.elements.type.value;
  const urlField = form.querySelector(".vip-url-field");
  const textField = form.elements.textContent;
  const isText = type === "text";
  urlField.classList.toggle("hidden-field", isText);
  form.elements.url.required = !isText;
  textField.required = isText;
  textField.placeholder = isText ? "Digite o texto completo do conteúdo VIP" : "Texto complementar opcional";
}

function validateVipContentData(data) {
  const title = String(data.title || "").trim();
  const category = String(data.category || "").trim();
  const type = String(data.type || "").trim();
  const description = String(data.description || "").trim();
  const url = String(data.url || "").trim();
  const textContent = String(data.textContent || "").trim();
  const urlTypes = ["video", "photo", "pdf", "link"];

  if (!title) return { valid: false, message: "Informe o título do conteúdo." };
  if (!category) return { valid: false, message: "Informe a categoria do conteúdo." };
  if (!type) return { valid: false, message: "Selecione o tipo de conteúdo." };
  if (!description) return { valid: false, message: "Informe a descrição do conteúdo." };
  if (type === "text" && !textContent) return { valid: false, message: "Informe o conteúdo em texto." };
  if (urlTypes.includes(type) && !url) return { valid: false, message: "Informe a URL do conteúdo." };
  if (url && !isValidUrl(url)) return { valid: false, message: "Informe uma URL válida começando com http:// ou https://." };
  if (url && !isUrlCompatibleWithType(type, url)) return { valid: false, message: getUrlValidationMessage(type) };
  return { valid: true, message: "" };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

seedData();
window.addEventListener("hashchange", render);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .finally(() => navigator.serviceWorker.register("/service-worker.js?v=20260818-production-v1", { updateViaCache: "none" }))
    .catch(() => {});
}
render();
initializeAuth();
bindAgeGate();
applyAgeGateState();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.querySelector("#splashScreen")?.classList.add("hidden");
  }, 900);
});
