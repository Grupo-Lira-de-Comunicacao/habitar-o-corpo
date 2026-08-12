const APP_CONFIG = {
  appName: "Habitar o Corpo",
  shortName: "Joelma Souza",
  brand: "Joelma Souza — Terapeuta Integrativa",
  concept: "Habitar o Corpo",
  phrase: "Habitar o corpo é voltar para si.",
  whatsapp: "5512988830247",
  pixKey: "11987080279",
  adminEmail: "joelmaespacosama@gmail.com",
  adminPassword: "Joelma67@#$",
  vipCode: "JOELMAVIP",
  address: "Rua Fabiola Regina Sardinha, 47 - Res. Armando Moreira Righi, São José dos Campos - SP, CEP: 12247-812",
  defaultDuration: "1 hora",
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
// Autenticação local apenas para protótipo. Migrar para Supabase Auth em produção.
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
    name: "Curso VIP — Massagem Integrativa Tântrica Quatro Elementos",
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

const initialAppointments = [
  {
    id: "demo-agendamento-1",
    clientId: "client-mariana",
    serviceId: "massagem-relaxante-terapeutica",
    serviceName: "Massagem Relaxante Terapêutica",
    customerName: "Mariana Alves",
    customerPhone: "(12) 99911-2233",
    customerEmail: "mariana@email.com",
    date: todayIso(),
    time: "10:30",
    notes: "Primeiro atendimento. Busca relaxamento e alívio de tensão nos ombros.",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-agendamento-2",
    clientId: "client-renata",
    serviceId: "terapia-tantrica-integrativa",
    serviceName: "Terapia Tântrica Integrativa",
    customerName: "Renata Lima",
    customerPhone: "(12) 98888-4455",
    customerEmail: "renata@email.com",
    date: todayIso(),
    time: "15:00",
    notes: "Quer conhecer o trabalho integrativo antes de iniciar acompanhamento.",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

const initialClients = [
  {
    id: "client-mariana",
    role: "client",
    isVip: true,
    name: "Mariana Alves",
    phone: "(12) 99911-2233",
    email: "mariana@email.com",
    password: "123456",
    city: "São José dos Campos",
    acceptedTerms: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "client-renata",
    role: "client",
    isVip: false,
    name: "Renata Lima",
    phone: "(12) 98888-4455",
    email: "renata@email.com",
    password: "123456",
    city: "São José dos Campos",
    acceptedTerms: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "client-vip-demo",
    role: "client",
    isVip: true,
    name: "Cliente VIP",
    phone: "(12) 98883-0247",
    email: "clientevip@email.com",
    password: APP_CONFIG.vipCode,
    city: "São José dos Campos",
    acceptedTerms: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialVipContents = [
  {
    id: "boas-vindas",
    title: "Boas-vindas da Joelma",
    description: "Mensagem reservada para clientes VIP com orientações iniciais.",
    type: "video",
    category: "Orientações",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    textContent: "",
    thumbnail: "https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?auto=format&fit=crop&w=800&q=80",
    date: "2026-07-05",
    status: "active",
    access: "VIP",
  },
  {
    id: "ambiente-preparado",
    title: "Ambiente preparado",
    description: "Registro do espaço terapêutico reservado para atendimentos.",
    type: "photo",
    category: "Espaço",
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    textContent: "",
    thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    date: "2026-07-05",
    status: "active",
    access: "VIP",
  },
  {
    id: "texto-vip-demo",
    title: "Ritual de presença",
    description: "Texto reservado para leitura antes do atendimento.",
    type: "text",
    category: "Leitura",
    url: "",
    textContent: "Respire com calma. Observe o corpo sem pressa. Habitar o corpo é voltar para si, reconhecendo limites, presença e cuidado.",
    thumbnail: "",
    date: "2026-07-07",
    status: "active",
    access: "VIP",
  },
];

const initialAdmins = [
  { id: "admin-demo", name: "Joelma Souza", email: APP_CONFIG.adminEmail, password: APP_CONFIG.adminPassword },
];

const availableTimes = ["09:00", "10:30", "13:30", "15:00", "16:30", "18:00"];

const state = {
  route: "home",
  params: {},
  selectedServiceId: "",
  bookingDraft: null,
  recoveryResult: null,
  vipUser: null,
  client: null,
  admin: null,
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
  const currentServices = store.read("services", initialServices);
  store.write("services", currentServices.filter((service) => service.id !== "massagem-pedras-quentes"));
  migrateClients();
  migrateAppointments();
  migrateVipContents();
  if (!localStorage.getItem("admins")) store.write("admins", initialAdmins);
  state.client = getClientSession();
}

function resetDemoData() {
  store.write("services", initialServices);
  localDataStore.saveAppointments(initialAppointments);
  localDataStore.saveVipContents(initialVipContents);
  localDataStore.saveClients(initialClients);
  localStorage.removeItem("vipUsers");
  LEGACY_CLIENT_KEYS.forEach((key) => localStorage.removeItem(key));
  store.write("admins", initialAdmins);
  localDataStore.clearSession();
  localStorage.removeItem("clientSession");
  state.client = null;
}

function getServices() {
  return store.read("services", []);
}

function getAppointments() {
  return localDataStore.getAppointments();
}

function getVipContents() {
  return localDataStore.getVipContents();
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
      password: user.password || APP_CONFIG.vipCode,
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
  if (localStorage.getItem(VIP_CONTENTS_STORAGE_KEY) !== null) return;
  const legacyContents = store.read("vipContents", []);
  localDataStore.saveVipContents(legacyContents.length ? legacyContents : initialVipContents);
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

function formatDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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
  if (type === "image" || type === "photo") return hasExtension(url, [".jpg", ".jpeg", ".png", ".webp"]);
  if (type === "pdf") return hasExtension(url, [".pdf"]);
  if (type === "audio") return hasExtension(url, [".mp3", ".wav", ".ogg"]);
  if (type === "link") return true;
  return false;
}

function getUrlValidationMessage(type) {
  const messages = {
    video: "Use um link do YouTube, youtu.be, Vimeo ou uma URL direta .mp4.",
    image: "Use uma URL de imagem .jpg, .jpeg, .png ou .webp.",
    pdf: "Use uma URL de arquivo PDF.",
    audio: "Use uma URL direta de áudio .mp3, .wav ou .ogg.",
    link: "Informe uma URL válida para o conteúdo externo.",
  };
  return messages[type] || "A URL não é compatível com o tipo escolhido.";
}

function getActiveVipContents() {
  return getVipContents().filter((content) => content.status !== "inactive");
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
        <p>Pix provisório: <strong>${APP_CONFIG.pixKey}</strong></p>
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
      <div class="form-row">
        <label>Nome <input name="customerName" autocomplete="name" required placeholder="Nome completo" value="${client?.name || ""}" /></label>
        <label>Telefone/WhatsApp <input name="customerPhone" autocomplete="tel" required placeholder="(12) 99999-9999" value="${client?.phone || ""}" /></label>
      </div>
      <label>E-mail <input name="customerEmail" type="email" autocomplete="email" required placeholder="email@exemplo.com" value="${client?.email || ""}" /></label>
      <label>Observações <textarea name="notes" rows="4" placeholder="Objetivo do atendimento, preferências ou dúvidas"></textarea></label>
      <button class="gold-btn" type="submit">Confirmar agendamento</button>
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
          <h1>Entre ou crie sua conta</h1>
          <p>Acompanhe seus agendamentos, atualize seus dados e veja quando o acesso VIP estiver liberado.</p>
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

  const appointments = getClientAppointments(state.client);
  return `
    <section class="page-title">
      <p class="eyebrow">Minha Conta</p>
      <h1>Olá, ${state.client.name}</h1>
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
        <label>Nome completo <input name="name" required value="${state.client.name}" /></label>
        <label>Telefone / WhatsApp <input name="phone" required value="${state.client.phone}" /></label>
        <label>E-mail <input name="email" type="email" required value="${state.client.email}" /></label>
        <label>Cidade <input name="city" required value="${state.client.city || ""}" /></label>
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
        <h1>Entrar</h1>
        <label>E-mail <input name="email" type="email" required placeholder="seuemail@exemplo.com" /></label>
        <label>Senha <input name="password" type="password" required placeholder="Sua senha" /></label>
        <button class="text-link-btn" type="button" data-route="recuperar-senha">Esqueci minha senha</button>
        <button class="gold-btn" type="submit">Entrar</button>
        <button class="ghost-btn" type="button" data-route="criar-conta">Criar conta</button>
        <p class="form-message" id="clientLoginMessage"></p>
      </form>
    </section>
  `;
}

function renderPasswordRecovery() {
  const email = state.recoveryResult?.email || "";
  return `
    <section class="auth-layout">
      <div class="form-shell auth-card">
        <p class="eyebrow">Recuperação de acesso</p>
        <h1>Recuperar senha</h1>
        <p>Informe o e-mail cadastrado para solicitar a recuperação de acesso.</p>
        <form id="passwordRecoveryForm" class="mini-form">
          <label>E-mail
            <input name="email" type="email" required placeholder="seuemail@exemplo.com" value="${escapeHtml(email)}" />
          </label>
          <button class="gold-btn" type="submit">Verificar cadastro</button>
        </form>
        <div id="passwordRecoveryResult">${renderRecoveryResult(state.recoveryResult)}</div>
      </div>
    </section>
  `;
}

function renderRecoveryResult(result) {
  if (!result) return "";
  if (result.status === "found") {
    const message = `Olá, Joelma. Esqueci minha senha do app Habitar o Corpo. Meu e-mail cadastrado é: ${result.email}`;
    return `
      <div class="recovery-result success">
        <p>Encontramos seu cadastro. Para sua segurança, solicite a redefinição de senha pelo WhatsApp.</p>
        <a class="gold-btn link-btn" href="${waLink(message)}" target="_blank" rel="noreferrer">Solicitar nova senha pelo WhatsApp</a>
      </div>
    `;
  }
  if (result.status === "missing") {
    return `
      <div class="recovery-result">
        <p>Não encontramos cadastro com este e-mail. Verifique o endereço digitado ou crie uma nova conta.</p>
        <div class="button-row">
          <button class="ghost-btn" data-route="recuperar-senha" type="button">Tentar novamente</button>
          <button class="gold-btn" data-route="criar-conta" type="button">Criar conta</button>
        </div>
      </div>
    `;
  }
  return "";
}

function renderClientSignup() {
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="clientSignupForm">
        <p class="eyebrow">Minha Conta</p>
        <h1>Criar conta</h1>
        <label>Nome completo <input name="name" autocomplete="name" required placeholder="Nome completo" /></label>
        <label>Telefone / WhatsApp <input name="phone" autocomplete="tel" required placeholder="(12) 99999-9999" /></label>
        <label>E-mail <input name="email" type="email" autocomplete="email" required placeholder="email@exemplo.com" /></label>
        <div class="form-row">
          <label>Senha <input name="password" type="password" required placeholder="Crie uma senha" /></label>
          <label>Confirmar senha <input name="confirmPassword" type="password" required placeholder="Repita a senha" /></label>
        </div>
        <label>Cidade <input name="city" required placeholder="Sua cidade" /></label>
        <label class="checkbox-label">
          <input name="acceptedTerms" type="checkbox" />
          <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>
        </label>
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
      <strong>${appointment.serviceName}</strong>
      <span>${formatDate(appointment.date)} às ${appointment.time}</span>
      <small>${appointmentStatusLabel(appointment.status)}</small>
    </article>
  `;
}

function timeOptions(date) {
  const appointments = getAppointments();
  return `<option value="">Selecione</option>${availableTimes
    .map((time) => {
      const busy = appointments.some(
        (appointment) =>
          appointment.date === date &&
          appointment.time === time &&
          appointment.status !== "canceled",
      );
      return `<option value="${time}" ${busy ? "disabled" : ""}>${time}${busy ? " indisponível" : ""}</option>`;
    })
    .join("")}`;
}

function renderConfirmation() {
  const booking = state.bookingDraft;
  if (!booking) return renderBooking();
  const message = `Olá, Joelma! Novo agendamento:\nServiço: ${booking.serviceName}\nNome: ${booking.customerName}\nData: ${formatDate(booking.date)}\nHorário: ${booking.time}\nTelefone: ${booking.customerPhone}`;
  return `
    <section class="success-panel">
      <p class="script">Agendamento enviado</p>
      <h1>Solicitação registrada com sucesso</h1>
      <p>Agora você pode avisar a Joelma pelo WhatsApp com a mensagem pronta.</p>
      <p class="pix-line">Pix provisório para pagamento/sinal: <strong>${APP_CONFIG.pixKey}</strong></p>
      <div class="summary-box">
        <strong>${booking.serviceName}</strong>
        <span>${formatDate(booking.date)} às ${booking.time}</span>
        <span>${booking.customerName} · ${booking.customerPhone}</span>
      </div>
      <a class="gold-btn link-btn" href="${waLink(message)}" target="_blank" rel="noreferrer">Enviar pelo WhatsApp</a>
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
  if (state.vipUser) return renderVipContent();
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="vipLoginForm">
        <p class="eyebrow">Área VIP</p>
        <h1>Entrar com acesso autorizado</h1>
        <p>${VIP_NOTICE}</p>
        <label>E-mail ou telefone <input name="login" required placeholder="cliente@vip.com" /></label>
        <label>Senha ou código VIP <input name="password" type="password" required placeholder="JOELMAVIP" /></label>
        <button class="text-link-btn" type="button" data-route="recuperar-senha">Esqueci minha senha</button>
        <button class="gold-btn" type="submit">Acessar conteúdo</button>
        <button class="ghost-btn" type="button" data-route="minha-conta">Entrar pela Minha Conta</button>
        <p class="form-message" id="vipMessage"></p>
      </form>
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
      ${state.vipUser ? `<button class="ghost-btn" id="vipLogout">Sair da área VIP</button>` : `<button class="ghost-btn" data-route="minha-conta">Minha Conta</button>`}
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
        .join("") || `<div class="empty-state">Nenhum conteúdo VIP ativo no momento.</div>`}
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
  if (state.admin) return renderAdmin();
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="adminLoginForm">
        <p class="eyebrow">Administração</p>
        <h1>Login administrativo</h1>
        <label>E-mail <input name="email" type="email" required placeholder="${APP_CONFIG.adminEmail}" /></label>
        <label>Senha <input name="password" type="password" required placeholder="Senha administrativa" /></label>
        <button class="gold-btn" type="submit">Entrar no painel</button>
        <p class="form-message" id="adminMessage"></p>
      </form>
    </section>
  `;
}

function renderAdmin() {
  const appointments = getAppointments();
  const todayAppointments = appointments.filter((item) => item.date === todayIso());
  const clients = getClients();
  return `
    <section class="admin-shell">
      <div class="section-heading">
        <p class="eyebrow">Painel administrativo</p>
        <h1>Dashboard</h1>
        <div class="admin-actions">
          <button class="ghost-btn" id="resetDemo">Restaurar demo</button>
          <button class="danger-btn" id="clearLocalData">Limpar dados locais de teste</button>
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
  const clients = getClients();
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
  const appointments = getAppointments();
  const statuses = ["pending", "confirmed", "awaiting_payment", "paid", "completed", "canceled"];
  return `
    <section class="admin-card wide">
      <h2>Agendamentos</h2>
      <div class="table-list">
        ${appointments.length ? appointments.map((item) => `
          <article>
            <div><strong>${item.customerName}</strong><span>${item.serviceName} · ${formatDate(item.date)} às ${item.time}</span></div>
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
      <div class="client-diagnostics">
        <strong>Diagnóstico de clientes</strong>
        <span>Chave oficial usada: ${CLIENTS_STORAGE_KEY}</span>
        <span>Total de clientes: ${clients.length}</span>
        <span>Sessão atual: ${localDataStore.getSession()?.email || "nenhuma"}</span>
        <small>${clients.map((client) => normalizeEmail(client.email)).filter(Boolean).join(", ") || "Nenhum e-mail carregado"}</small>
      </div>
      <p class="admin-warning">Esta é uma recuperação provisória. Em produção, use autenticação segura com backend.</p>
      <form id="adminClientForm" class="mini-form">
        <div class="form-row">
          <input name="name" placeholder="Nome completo" required />
          <input name="phone" placeholder="Telefone / WhatsApp" required />
        </div>
        <div class="form-row">
          <input name="email" type="email" placeholder="E-mail" required />
          <input name="city" placeholder="Cidade" />
        </div>
        <div class="form-row">
          <input name="password" type="password" placeholder="Senha provisória" required />
          <select name="isVip">
            <option value="false">Cliente comum</option>
            <option value="true">Cliente VIP</option>
          </select>
        </div>
        <button class="gold-btn" type="submit">Criar cliente</button>
        <p class="form-message" id="adminClientMessage"></p>
      </form>
      <div class="client-grid">
        ${clients.length ? clients.map((client) => `
          <article class="client-card">
            <strong>${client.name}</strong>
            <span>${client.phone}</span>
            <span>${client.email}</span>
            <span>${client.city || "Cidade não informada"}</span>
            <small>${client.isVip ? "VIP ativo" : "VIP não liberado"}</small>
            <div class="admin-actions">
              <button class="ghost-btn" data-edit-client="${client.id}">Editar</button>
              <button class="ghost-btn" data-reset-client-password="${client.id}">Redefinir senha</button>
              <button class="ghost-btn" data-toggle-client-vip="${client.id}">${client.isVip ? "Desativar VIP" : "Ativar VIP"}</button>
              <button class="danger-btn" data-delete-client="${client.id}">Excluir</button>
            </div>
          </article>
        `).join("") : "<p>Nenhuma cliente cadastrada ainda.</p>"}
      </div>
    </section>
  `;
}

function adminServices() {
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
      ${getServices().map((service) => `
        <div class="admin-item">
          <span>${service.name}</span>
          <div class="admin-actions">
            <button class="ghost-btn" data-edit-service="${service.id}">Editar</button>
            <button class="danger-btn" data-delete-service="${service.id}">Excluir</button>
          </div>
        </div>
      `).join("")}
    </section>
  `;
}

function adminVipContents() {
  const contents = getVipContents();
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
            <option value="image">Imagem</option>
            <option value="pdf">PDF</option>
            <option value="audio">Áudio</option>
            <option value="link">Link externo</option>
          </select>
          <select name="status" required>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
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
          <span>${escapeHtml(content.title)} · ${vipTypeLabel(content.type)} · ${content.status === "inactive" ? "inativo" : "ativo"}</span>
          <div class="admin-actions">
            <button class="ghost-btn" data-edit-content="${content.id}">Editar</button>
            <button class="ghost-btn" data-toggle-content="${content.id}">${content.status === "inactive" ? "Ativar" : "Desativar"}</button>
            <button class="danger-btn" data-delete-content="${content.id}">Excluir</button>
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

function render() {
  parseRoute();
  if (state.route === "vip-conteudo" && !state.vipUser && !state.client?.isVip) state.route = "vip-login";
  if (state.route === "admin" && !state.admin) state.route = "admin-login";
  if (state.route === "clientes" && !state.admin) state.route = "admin-login";
  document.body.classList.toggle("admin-logged-in", Boolean(state.admin));
  document.querySelectorAll(".admin-only-nav").forEach((link) => {
    link.classList.toggle("hidden-field", !state.admin);
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const accountRoutes = ["minha-conta", "entrar", "criar-conta", "recuperar-senha"];
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
    "vip-login": renderVipLogin,
    "vip-conteudo": renderVipContent,
    "admin-login": renderAdminLogin,
    admin: renderAdmin,
    clientes: renderAdminClientsPage,
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
    const serviceInput = bookingForm.elements.serviceId;
    const dateInput = bookingForm.elements.date;
    const timeInput = bookingForm.elements.time;
    const refreshTimes = () => {
      timeInput.innerHTML = timeOptions(dateInput.value);
    };
    serviceInput.addEventListener("change", refreshTimes);
    dateInput.addEventListener("change", refreshTimes);
    bookingForm.addEventListener("submit", submitBooking);
  }

  document.querySelector("#vipLoginForm")?.addEventListener("submit", submitVipLogin);
  document.querySelector("#clientLoginForm")?.addEventListener("submit", submitClientLogin);
  document.querySelector("#clientSignupForm")?.addEventListener("submit", submitClientSignup);
  document.querySelector("#passwordRecoveryForm")?.addEventListener("submit", submitPasswordRecovery);
  document.querySelector("#clientProfileForm")?.addEventListener("submit", updateClientProfile);
  document.querySelector("#clientLogout")?.addEventListener("click", () => {
    clearClientSession();
    setRoute("minha-conta");
  });
  document.querySelector("#adminLoginForm")?.addEventListener("submit", submitAdminLogin);
  document.querySelector("#vipLogout")?.addEventListener("click", () => {
    state.vipUser = null;
    setRoute("vip-login");
  });
  document.querySelector("#adminLogout")?.addEventListener("click", () => {
    state.admin = null;
    setRoute("admin-login");
  });
  document.querySelector("#resetDemo")?.addEventListener("click", () => {
    resetDemoData();
    render();
  });
  document.querySelector("#clearLocalData")?.addEventListener("click", () => {
    if (!confirm("Apagar clientes, agendamentos, conteúdos VIP e sessão locais deste navegador?")) return;
    localDataStore.clearTestData();
    location.reload();
  });

  document.querySelectorAll("[data-status]").forEach((select) => select.addEventListener("change", updateAppointmentStatus));
  document.querySelector("#serviceForm")?.addEventListener("submit", createService);
  document.querySelector("#adminClientForm")?.addEventListener("submit", createAdminClient);
  const contentForm = document.querySelector("#contentForm");
  if (contentForm) {
    const syncContentFields = () => updateContentFormFields(contentForm);
    contentForm.elements.type.addEventListener("change", syncContentFields);
    syncContentFields();
    contentForm.addEventListener("submit", createVipContent);
  }
  document.querySelectorAll("[data-delete-service]").forEach((button) => button.addEventListener("click", deleteService));
  document.querySelectorAll("[data-edit-service]").forEach((button) => button.addEventListener("click", editService));
  document.querySelectorAll("[data-edit-client]").forEach((button) => button.addEventListener("click", editClient));
  document.querySelectorAll("[data-reset-client-password]").forEach((button) => button.addEventListener("click", resetClientPassword));
  document.querySelectorAll("[data-toggle-client-vip]").forEach((button) => button.addEventListener("click", toggleClientVip));
  document.querySelectorAll("[data-delete-client]").forEach((button) => button.addEventListener("click", deleteClient));
  document.querySelectorAll("[data-open-vip]").forEach((button) => button.addEventListener("click", () => setRoute("vip-conteudo", { id: button.dataset.openVip })));
  document.querySelectorAll("[data-close-vip]").forEach((button) => button.addEventListener("click", () => setRoute("vip-conteudo")));
  document.querySelectorAll("[data-delete-content]").forEach((button) => button.addEventListener("click", deleteVipContent));
  document.querySelectorAll("[data-edit-content]").forEach((button) => button.addEventListener("click", editVipContent));
  document.querySelectorAll("[data-toggle-content]").forEach((button) => button.addEventListener("click", toggleVipContent));
}

function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());
  const service = getServices().find((item) => item.id === formData.serviceId);
  const appointments = getAppointments();
  const conflict = appointments.some(
    (item) =>
      item.date === formData.date &&
      item.time === formData.time &&
      item.status !== "canceled",
  );
  if (conflict) {
    document.querySelector("#bookingMessage").textContent = "Este horário acabou de ficar indisponível.";
    return;
  }
  const appointment = {
    id: crypto.randomUUID(),
    clientId: state.client?.id || null,
    serviceId: service.id,
    serviceName: service.name,
    customerName: formData.customerName,
    customerPhone: formData.customerPhone,
    customerEmail: formData.customerEmail,
    date: formData.date,
    time: formData.time,
    notes: formData.notes,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  localDataStore.saveAppointments([appointment, ...appointments]);
  state.bookingDraft = appointment;
  setRoute("confirmacao");
}

function submitVipLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  if (String(data.password).trim().toUpperCase() === APP_CONFIG.vipCode) {
    state.vipUser = { id: "code-access", name: "Acesso provisório", login: data.login, active: true };
    setRoute("vip-conteudo");
    return;
  }
  const client = getClients().find(
    (item) =>
      item.active !== false &&
      item.isVip &&
      (normalizeEmail(item.email) === normalizeEmail(data.login) || normalizePhone(item.phone || "") === normalizePhone(data.login || "")) &&
      item.password === data.password,
  );
  if (!client) {
    document.querySelector("#vipMessage").textContent = "Acesso não autorizado.";
    return;
  }
  state.vipUser = { id: client.id, name: client.name, login: client.email, active: true };
  setRoute("vip-conteudo");
}

function submitClientLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const email = normalizeEmail(data.email);
  const client = findClientByEmail(email);
  if (!client || client.active === false || client.password !== data.password) {
    document.querySelector("#clientLoginMessage").textContent = "E-mail ou senha incorretos.";
    return;
  }
  saveClientSession(client);
  setRoute("minha-conta");
}

function submitClientSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const message = document.querySelector("#clientSignupMessage");
  const email = normalizeEmail(data.email);

  if (!data.name.trim()) {
    message.textContent = "Informe seu nome completo.";
    return;
  }
  if (!data.phone.trim()) {
    message.textContent = "Informe seu telefone/WhatsApp.";
    return;
  }
  if (!email || !isValidEmail(email)) {
    message.textContent = "Informe um e-mail válido.";
    return;
  }
  if (!data.password) {
    message.textContent = "Crie uma senha.";
    return;
  }
  if (data.password !== data.confirmPassword) {
    message.textContent = "A confirmação de senha precisa ser igual à senha.";
    return;
  }
  if (!form.elements.acceptedTerms.checked) {
    message.textContent = "Aceite os Termos de Uso e a Política de Privacidade.";
    return;
  }
  if (findClientByEmail(email)) {
    message.innerHTML = `
      Este e-mail já está cadastrado. Entrar ou recuperar senha?
      <div class="button-row inline-actions">
        <button class="ghost-btn" type="button" data-route="entrar">Entrar</button>
        <button class="gold-btn" type="button" data-route="recuperar-senha">Recuperar senha</button>
      </div>
    `;
    bindEvents();
    return;
  }

  const client = {
    id: crypto.randomUUID(),
    role: "client",
    isVip: false,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email,
    password: data.password,
    city: data.city.trim(),
    acceptedTerms: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const savedClient = localDataStore.createClient(client);
  saveClientSession(savedClient);
  setRoute("minha-conta");
}

function submitPasswordRecovery(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const normalizedEmail = normalizeEmail(data.email);
  const clients = getClients();
  const foundClient = findClientByEmail(normalizedEmail);

  // Debug temporário:
  // console.log("Clientes carregados:", clients);
  // console.log("E-mail pesquisado:", normalizedEmail);
  // console.log("Cliente encontrado:", foundClient || null);

  state.recoveryResult = {
    status: foundClient ? "found" : "missing",
    email: normalizedEmail,
  };

  const resultContainer = document.querySelector("#passwordRecoveryResult");
  if (resultContainer) {
    resultContainer.innerHTML = renderRecoveryResult(state.recoveryResult);
    bindEvents();
  }
}

function updateClientProfile(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const email = normalizeEmail(data.email);
  const message = document.querySelector("#profileMessage");

  if (!data.name.trim() || !data.phone.trim() || !email || !isValidEmail(email)) {
    message.textContent = "Revise nome, telefone e e-mail.";
    return;
  }
  const duplicate = getClients().some((client) => client.id !== state.client.id && normalizeEmail(client.email) === email);
  if (duplicate) {
    message.textContent = "Este e-mail já está em uso por outra conta.";
    return;
  }

  const updatedClient = upsertClient({
    ...state.client,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email,
    city: data.city.trim(),
  });
  saveClientSession(updatedClient);
  message.textContent = "Dados atualizados com sucesso.";
}

function submitAdminLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const admin = getAdmins().find((item) => item.email === data.email && item.password === data.password);
  if (!admin) {
    document.querySelector("#adminMessage").textContent = "Login administrativo inválido.";
    return;
  }
  state.admin = admin;
  setRoute("admin");
}

function updateAppointmentStatus(event) {
  const appointments = getAppointments().map((item) =>
    item.id === event.currentTarget.dataset.status ? { ...item, status: event.currentTarget.value } : item,
  );
  localDataStore.saveAppointments(appointments);
}

function createService(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const service = {
    id: data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: data.name,
    duration: data.duration,
    price: data.price || "Sob consulta",
    description: data.description,
    benefits: data.benefits.split(",").map((item) => item.trim()).filter(Boolean),
  };
  store.write("services", [service, ...getServices()]);
  render();
}

function deleteService(event) {
  store.write("services", getServices().filter((service) => service.id !== event.currentTarget.dataset.deleteService));
  render();
}

function editService(event) {
  const serviceId = event.currentTarget.dataset.editService;
  const services = getServices();
  const service = services.find((item) => item.id === serviceId);
  if (!service) return;

  const name = prompt("Nome do serviço", service.name);
  if (!name) return;
  const duration = prompt("Duração", service.duration) || service.duration;
  const price = prompt("Valor", service.price) || service.price;
  const description = prompt("Descrição", service.description) || service.description;
  const benefits = prompt("Benefícios separados por vírgula", service.benefits.join(", ")) || service.benefits.join(", ");

  store.write(
    "services",
    services.map((item) =>
      item.id === serviceId
        ? {
            ...item,
            name,
            duration,
            price,
            description,
            benefits: benefits.split(",").map((benefit) => benefit.trim()).filter(Boolean),
          }
        : item,
    ),
  );
  render();
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

function toggleClientVip(event) {
  const clientId = event.currentTarget.dataset.toggleClientVip;
  const client = getClients().find((item) => item.id === clientId);
  if (!client) return;
  const updatedClient = upsertClient({ ...client, isVip: !client.isVip });
  if (state.client?.id === clientId) {
    saveClientSession(updatedClient);
  }
  render();
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
  if (!validation.valid) {
    message.textContent = validation.message;
    return;
  }

  const type = data.type.trim();
  const content = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    description: data.description.trim(),
    type,
    url: type === "text" ? "" : data.url.trim(),
    textContent: type === "text" ? data.textContent.trim() : data.textContent.trim(),
    thumbnail: ["image", "photo"].includes(type) ? data.url.trim() : "",
    date: todayIso(),
    category: data.category.trim(),
    status: data.status || "active",
    access: "VIP",
  };

  localDataStore.saveVipContents([content, ...getVipContents()]);
  form.reset();
  message.textContent = "Conteúdo VIP salvo com sucesso.";
  window.setTimeout(render, 650);
}

function deleteVipContent(event) {
  const content = getVipContents().find((item) => item.id === event.currentTarget.dataset.deleteContent);
  if (!content) return;
  if (!confirm(`Excluir o conteúdo "${content.title}"?`)) return;
  localDataStore.saveVipContents(getVipContents().filter((item) => item.id !== content.id));
  render();
}

function editVipContent(event) {
  const contentId = event.currentTarget.dataset.editContent;
  const contents = getVipContents();
  const content = contents.find((item) => item.id === contentId);
  if (!content) return;

  const title = prompt("Título do conteúdo", content.title);
  if (!title) return;
  const category = prompt("Categoria", content.category) || content.category;
  const type = prompt("Tipo: text, video, image, pdf, audio ou link", content.type) || content.type;
  const description = prompt("Descrição", content.description) || content.description;
  const url = type === "text" ? "" : prompt("URL/link do conteúdo", content.url || "") || content.url || "";
  const textContent = type === "text" ? prompt("Conteúdo em texto", content.textContent || "") || content.textContent || "" : prompt("Texto complementar opcional", content.textContent || "") || content.textContent || "";

  const validation = validateVipContentData({ title, category, type, description, url, textContent, status: content.status });
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  localDataStore.saveVipContents(
    contents.map((item) =>
      item.id === contentId
        ? {
            ...item,
            title: title.trim(),
            category: category.trim(),
            type: type.trim(),
            description: description.trim(),
            url: type === "text" ? "" : url.trim(),
            textContent: textContent.trim(),
            thumbnail: ["image", "photo"].includes(type) ? url.trim() : item.thumbnail || "",
          }
        : item,
    ),
  );
  render();
}

function toggleVipContent(event) {
  const contentId = event.currentTarget.dataset.toggleContent;
  localDataStore.saveVipContents(
    getVipContents().map((content) =>
      content.id === contentId
        ? { ...content, status: content.status === "inactive" ? "active" : "inactive" }
        : content,
    ),
  );
  render();
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
  const urlTypes = ["video", "image", "pdf", "audio", "link"];

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
  navigator.serviceWorker.register("/service-worker.js").catch(() => {});
}
render();
bindAgeGate();
applyAgeGateState();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.querySelector("#splashScreen")?.classList.add("hidden");
  }, 900);
});
