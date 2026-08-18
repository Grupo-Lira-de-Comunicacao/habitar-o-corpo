import fs from 'node:fs';

const targets = ['app.js', 'public/app.js'];

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Patch obrigatório não encontrado: ${label}`);
  return source.replace(search, replacement);
}

function replaceRegexRequired(source, regex, replacement, label) {
  if (!regex.test(source)) throw new Error(`Patch obrigatório não encontrado: ${label}`);
  regex.lastIndex = 0;
  return source.replace(regex, replacement);
}

function patch(source) {
  source = replaceRequired(
    source,
    '  pixKey: "11987080279",',
    '  pixKey: "",',
    'remover Pix provisório hardcoded',
  );

  source = replaceRegexRequired(
    source,
    /const initialVipContents = \[[\s\S]*?\n\];\n\nconst initialAdmins = \[\];/,
    'const initialVipContents = [];\n\nconst initialAdmins = [];',
    'remover conteúdo VIP de demonstração',
  );

  source = replaceRequired(
    source,
    'function seedData() {\n  if (!localStorage.getItem("services")) store.write("services", initialServices);\n  migrateVipContents();',
    'function seedData() {\n  localStorage.removeItem("services");\n  localStorage.removeItem(VIP_CONTENTS_STORAGE_KEY);\n  localStorage.removeItem("vipContents");',
    'desativar seed local de serviços/VIP',
  );

  source = replaceRegexRequired(
    source,
    /function resetDemoData\(\) \{[\s\S]*?\n\}\n\nfunction getServices\(\) \{\n  return store\.read\("services", \[\]\);\n\}/,
    `function resetDemoData() {
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
}`,
    'fonte autoritativa de serviços',
  );

  source = replaceRequired(
    source,
    'function getVipContents() {\n  return localDataStore.getVipContents();\n}',
    'function getVipContents() {\n  return state.vipContents || [];\n}',
    'fonte autoritativa VIP',
  );

  source = replaceRegexRequired(
    source,
    /function migrateVipContents\(\) \{[\s\S]*?\n\}/,
    `function migrateVipContents() {
  localStorage.removeItem(VIP_CONTENTS_STORAGE_KEY);
  localStorage.removeItem("vipContents");
}`,
    'limpar migração VIP local',
  );

  source = replaceRequired(
    source,
    '\nasync function authApiRequest(action, payload = {}, { authenticated = false } = {}) {',
    `
async function apiGet(action) {
  const response = await fetch(\`${BOOKING_API_URL}?action=\${encodeURIComponent(action)}\`, {
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
  if (/^\\d+$/.test(text)) return Number(text);
  const hourMatch = text.match(/(\\d+)\\s*h/);
  const minuteMatch = text.match(/h\\s*(\\d+)/) || text.match(/(\\d+)\\s*min/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  return hours * 60 + minutes || 90;
}

function priceToCents(value) {
  const text = String(value || "").trim();
  if (!text || /consulta/i.test(text)) return 0;
  const normalized = text.replace(/[^0-9,.-]/g, "").replace(/\\./g, "").replace(",", ".");
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

async function authApiRequest(action, payload = {}, { authenticated = false } = {}) {`,
    'helpers de dados de produção',
  );

  source = replaceRequired(
    source,
    '  state.adminClients = [];\n  if (session?.access_token) {',
    '  state.adminClients = [];\n  state.adminServices = [];\n  state.adminVipContents = [];\n  state.vipContents = [];\n  if (session?.access_token) {',
    'reset de estado servidor',
  );

  source = replaceRequired(
    source,
    '      state.adminAppointments = dashboard.bookings || [];\n      state.adminClients = dashboard.clients || [];\n    }\n  }',
    '      state.adminAppointments = dashboard.bookings || [];\n      state.adminClients = dashboard.clients || [];\n      state.adminServices = dashboard.services || [];\n      state.adminVipContents = dashboard.vipContents || [];\n      state.services = state.adminServices.filter((service) => service.active !== false);\n    }\n    if (state.client?.isVip || account.isAdmin) await loadVipContents();\n  }',
    'hidratar painel com Supabase',
  );

  source = replaceRequired(
    source,
    'async function initializeAuth() {\n  try {\n    const { data, error } = await authClient.auth.getSession();',
    'async function initializeAuth() {\n  try {\n    await Promise.allSettled([loadCatalog(), loadPublicConfig()]);\n    const { data, error } = await authClient.auth.getSession();',
    'carregar catálogo/config na inicialização',
  );

  source = source.replaceAll('Pix provisório:', 'Pix:');
  source = source.replaceAll('Pix provisório para pagamento/sinal:', 'Pix para pagamento/sinal:');

  source = replaceRequired(
    source,
    '.join("") || `<div class="empty-state">Nenhum conteúdo VIP ativo no momento.</div>`}',
    '.join("") || `<div class="empty-state">Conteúdo exclusivo em preparação</div>`}',
    'estado vazio VIP',
  );

  source = replaceRequired(
    source,
    '        ${adminAppointments()}\n        ${adminClients(clients)}\n        ${adminSettings()}',
    '        ${adminAppointments()}\n        ${adminClients(clients)}\n        ${adminServices()}\n        ${adminVipContents()}\n        ${adminSettings()}',
    'painel com serviços e VIP',
  );

  source = replaceRequired(
    source,
    'function adminServices() {\n  return `',
    'function adminServices() {\n  const services = state.adminServices?.length ? state.adminServices : getServices();\n  return `',
    'serviços admin do servidor',
  );
  source = replaceRequired(
    source,
    '${getServices().map((service) => `',
    '${services.map((service) => `',
    'lista admin de serviços',
  );
  source = source.replaceAll('data-delete-service="${service.id}">Excluir</button>', 'data-delete-service="${service.id}">Desativar</button>');

  source = replaceRequired(
    source,
    'function adminVipContents() {\n  const contents = getVipContents();',
    'function adminVipContents() {\n  const contents = state.adminVipContents || [];',
    'conteúdos admin do servidor',
  );
  source = source.replaceAll('<option value="image">Imagem</option>\n            <option value="pdf">PDF</option>\n            <option value="audio">Áudio</option>', '<option value="photo">Imagem</option>\n            <option value="pdf">PDF</option>');
  source = source.replaceAll('<option value="inactive">Inativo</option>', '<option value="draft">Rascunho</option>');
  source = source.replaceAll('content.status === "inactive" ? "inativo" : "ativo"', 'content.status === "active" ? "ativo" : "rascunho"');
  source = source.replaceAll('content.status === "inactive" ? "Ativar" : "Desativar"', 'content.status === "active" ? "Desativar" : "Ativar"');
  source = source.replaceAll('data-delete-content="${content.id}">Excluir</button>', 'data-delete-content="${content.id}">Arquivar</button>');

  source = replaceRequired(
    source,
    'function getActiveVipContents() {\n  return getVipContents().filter((content) => content.status !== "inactive");\n}',
    'function getActiveVipContents() {\n  return getVipContents().filter((content) => content.status === "active");\n}',
    'filtro VIP ativo',
  );

  source = replaceRegexRequired(
    source,
    /function createService\(event\) \{[\s\S]*?\n\}\n\nfunction deleteService\(event\) \{[\s\S]*?\n\}\n\nfunction editService\(event\) \{[\s\S]*?\n\}\n\nfunction editClient/,
    `async function createService(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

function editClient`,
    'CRUD de serviços via backend',
  );

  source = replaceRegexRequired(
    source,
    /async function createVipContent\(event\) \{[\s\S]*?\n\}\n\nfunction deleteVipContent\(event\) \{[\s\S]*?\n\}\n\nfunction editVipContent\(event\) \{[\s\S]*?\n\}\n\nfunction toggleVipContent\(event\) \{[\s\S]*?\n\}/,
    `async function createVipContent(event) {
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
  if (!confirm(\`Arquivar o conteúdo "\${content.title}"? Ele poderá ser republicado depois.\`)) return;
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
}`,
    'CRUD VIP via backend',
  );

  source = replaceRequired(
    source,
    '  const urlTypes = ["video", "image", "pdf", "audio", "link"];',
    '  const urlTypes = ["video", "photo", "pdf", "link"];',
    'tipos VIP suportados',
  );

  source = replaceRequired(
    source,
    'if (type === "image" || type === "photo") return hasExtension(url, [".jpg", ".jpeg", ".png", ".webp"]);',
    'if (type === "photo") return hasExtension(url, [".jpg", ".jpeg", ".png", ".webp"]);',
    'validação de imagem VIP',
  );

  source = replaceRequired(
    source,
    '    image: "Use uma URL de imagem .jpg, .jpeg, .png ou .webp.",',
    '    photo: "Use uma URL de imagem .jpg, .jpeg, .png ou .webp.",',
    'mensagem de imagem VIP',
  );

  const privacyFunction = `
function renderPrivacy() {
  return \`
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
        <p>Você pode solicitar informações, correção e, quando aplicável, exclusão ou limitação do tratamento dos seus dados. Solicitações podem ser feitas pelo e-mail <strong>\${escapeHtml(APP_CONFIG.adminEmail)}</strong> ou pelo WhatsApp oficial.</p>
        <h2>Compartilhamento</h2>
        <p>Dados de clientes não são vendidos. O compartilhamento ocorre somente quando necessário à operação do serviço, segurança, atendimento ou cumprimento de obrigação aplicável.</p>
        <p><small>Última atualização: 18/08/2026. Esta política operacional pode ser atualizada quando novas funcionalidades forem adicionadas.</small></p>
        <button class="gold-btn" data-route="home">Voltar ao início</button>
      </div>
    </section>
  \`;
}
`;

  source = replaceRequired(
    source,
    '\nfunction render() {',
    privacyFunction + '\nfunction render() {',
    'rota de privacidade',
  );

  source = replaceRequired(
    source,
    '    clientes: renderAdminClientsPage,\n  };',
    '    clientes: renderAdminClientsPage,\n    privacidade: renderPrivacy,\n  };',
    'registrar rota privacidade',
  );

  source = replaceRequired(
    source,
    '          <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>\n        </label>',
    '          <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>\n        </label>\n        <button class="ghost-btn" type="button" data-route="privacidade">Ler Política de Privacidade</button>',
    'link de privacidade no cadastro',
  );

  source = source.replaceAll('/service-worker.js?v=20260817-auth-v2', '/service-worker.js?v=20260818-production-v1');

  return source;
}

for (const file of targets) {
  const original = fs.readFileSync(file, 'utf8');
  const next = patch(original);
  fs.writeFileSync(file, next);
  console.log(`patched ${file}`);
}
