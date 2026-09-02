const PERMANENTLY_HIDDEN_SERVICE_IDS = new Set(["massagem-pedras-quentes"]);
const LOCAL_HIDDEN_KEY = "habitar_hidden_service_ids";

function getLocalHidden() {
  try { return new Set(JSON.parse(localStorage.getItem(LOCAL_HIDDEN_KEY) || "[]")); }
  catch { return new Set(); }
}

function saveLocalHidden(ids) {
  localStorage.setItem(LOCAL_HIDDEN_KEY, JSON.stringify([...ids]));
}

function hiddenIds() {
  return new Set([...PERMANENTLY_HIDDEN_SERVICE_IDS, ...getLocalHidden()]);
}

function hideServiceFromUi(id) {
  document.querySelectorAll(`[data-book="${id}"], [data-detail="${id}"], [data-edit-service="${id}"], [data-delete-service="${id}"]`).forEach((node) => {
    const container = node.closest("article, .admin-item, .service-card, .card, li");
    if (container) container.remove();
  });
  document.querySelectorAll(`option[value="${id}"]`).forEach((option) => option.remove());
}

function applyHiddenServices() {
  hiddenIds().forEach(hideServiceFromUi);
}

const observer = new MutationObserver(() => applyHiddenServices());
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("load", applyHiddenServices);
window.addEventListener("hashchange", () => window.setTimeout(applyHiddenServices, 0));

// Intercepta o botão Desativar para dar efeito imediato na interface, mesmo quando o backend estiver indisponível.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-service]");
  if (!button) return;
  const id = button.dataset.deleteService;
  if (!id) return;
  const local = getLocalHidden();
  local.add(id);
  saveLocalHidden(local);
  window.setTimeout(() => hideServiceFromUi(id), 0);
}, true);
