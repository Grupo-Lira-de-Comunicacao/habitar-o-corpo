const BOOKING_API_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co/functions/v1/joelma-booking";
const ADMIN_SERVICES_API_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co/functions/v1/joelma-admin-services";
const SUPABASE_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_2nB7J2RIftfVxU1wuOXLFQ_50-ksYBZ";

async function getSession() {
  const mod = await import("https://esm.sh/@supabase/supabase-js@2.112.3");
  const client = mod.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  const { data } = await client.auth.getSession();
  return data.session;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function centsFromPrice(value) {
  const text = String(value ?? "").trim();
  if (!text) return 0;
  const cleaned = text.replace(/[^0-9,.-]/g, "");
  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : NaN;
}

function minutesFromDuration(value) {
  const text = String(value ?? "").toLowerCase().trim();
  if (/^\d+$/.test(text)) return Number(text);
  const hour = text.match(/(\d+)\s*h/);
  const minute = text.match(/(\d+)\s*(?:min|m)/);
  return (hour ? Number(hour[1]) * 60 : 0) + (minute ? Number(minute[1]) : 0);
}

async function authorizedPost(url, body) {
  const session = await getSession();
  if (!session?.access_token) throw new Error("Sua sessão administrativa expirou. Entre novamente no painel.");
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({ ok: false, error: "resposta_invalida" }));
  if (!response.ok || result.ok !== true) {
    const messages = {
      nao_autenticado: "Sua sessão expirou. Entre novamente.",
      acesso_negado: "Este usuário não tem permissão administrativa.",
      dados_invalidos: "Confira os dados informados. A duração deve permanecer em 1h30.",
      falha_ao_salvar_servico: "O banco não conseguiu salvar a alteração.",
      falha_ao_desativar_servico: "O banco não conseguiu desativar o serviço.",
    };
    throw new Error(messages[result.error] || `Não foi possível concluir (${result.error || response.status}).`);
  }
  return result;
}

async function loadService(serviceId) {
  const result = await authorizedPost(BOOKING_API_URL, { action: "admin-data" });
  return (result.services || []).find((item) => item.id === serviceId);
}

function closeEditor() {
  document.querySelector("#serviceEditorBackdrop")?.remove();
}

async function openEditor(serviceId) {
  let service;
  try { service = await loadService(serviceId); } catch (error) { alert(error.message); return; }
  if (!service) { alert("Serviço não encontrado."); return; }
  closeEditor();
  const priceValue = Number(service.priceCents || 0) / 100;
  const backdrop = document.createElement("div");
  backdrop.id = "serviceEditorBackdrop";
  backdrop.className = "service-editor-backdrop";
  backdrop.innerHTML = `<div class="service-editor-card" role="dialog" aria-modal="true" aria-labelledby="serviceEditorTitle"><h2 id="serviceEditorTitle">Editar serviço</h2><p>Altere os dados abaixo e toque em Salvar alterações.</p><form id="serviceEditorForm" class="service-editor-form"><label>Nome<input name="name" required minlength="2" maxlength="160" value="${escapeHtml(service.name)}"></label><div class="service-editor-grid"><label>Duração<input name="duration" required value="${escapeHtml(service.duration || `${service.durationMinutes}min`)}" placeholder="Ex.: 1h30"></label><label>Valor (R$)<input name="price" inputmode="decimal" required value="${priceValue.toFixed(2).replace(".", ",")}" placeholder="Ex.: 350,00"></label></div><label>Descrição<textarea name="description" maxlength="1200">${escapeHtml(service.description || "")}</textarea></label><label>Benefícios, separados por vírgula<input name="benefits" value="${escapeHtml((service.benefits || []).join(", "))}"></label><p id="serviceEditorMessage" class="service-editor-message" aria-live="polite"></p><div class="service-editor-actions"><button class="ghost-btn" type="button" id="cancelServiceEditor">Cancelar</button><button class="gold-btn" type="submit">Salvar alterações</button></div></form></div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeEditor(); });
  backdrop.querySelector("#cancelServiceEditor")?.addEventListener("click", closeEditor);
  backdrop.querySelector("#serviceEditorForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = form.querySelector("#serviceEditorMessage");
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    const durationMinutes = minutesFromDuration(data.duration);
    const priceCents = centsFromPrice(data.price);
    if (durationMinutes !== 90 || !Number.isInteger(priceCents) || priceCents < 0) {
      message.textContent = "Confira o valor. A duração deve permanecer em 1h30.";
      message.className = "service-editor-message error";
      return;
    }
    button.disabled = true;
    message.textContent = "Salvando...";
    message.className = "service-editor-message";
    try {
      await authorizedPost(ADMIN_SERVICES_API_URL, {
        action: "update",
        id: service.id,
        name: String(data.name).trim(),
        durationMinutes,
        priceCents,
        description: String(data.description).trim(),
        benefits: String(data.benefits).split(",").map((item) => item.trim()).filter(Boolean),
        sortOrder: Number(service.sortOrder || 0),
        active: service.active !== false,
      });
      message.textContent = "Alterações salvas com sucesso.";
      message.className = "service-editor-message success";
      window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      message.textContent = error.message;
      message.className = "service-editor-message error";
      button.disabled = false;
    }
  });
}

async function deactivateService(button) {
  const id = button.dataset.deleteService;
  if (!id) return;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Desativando...";
  try {
    await authorizedPost(ADMIN_SERVICES_API_URL, { action: "deactivate", id });
    button.closest(".admin-item")?.remove();
    document.querySelectorAll(`option[value="${id}"]`).forEach((option) => option.remove());
  } catch (error) {
    alert(error.message);
    button.disabled = false;
    button.textContent = originalText;
  }
}

document.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-service]");
  if (editButton) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openEditor(editButton.dataset.editService);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-service]");
  if (deleteButton) {
    event.preventDefault();
    event.stopImmediatePropagation();
    deactivateService(deleteButton);
  }
}, true);
