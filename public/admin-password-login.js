import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";

const SUPABASE_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_2nB7J2RIftfVxU1wuOXLFQ_50-ksYBZ";
const BOOKING_API_URL = "https://onrmaojjvcbqbgwuhzwq.supabase.co/functions/v1/joelma-booking";
const ADMIN_EMAILS = new Set(["splira@gmail.com", "joelmaespacosama@gmail.com"]);

const auth = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function adminLoginHtml() {
  return `
    <section class="auth-layout">
      <form class="form-shell auth-card" id="adminPasswordLoginForm" autocomplete="on">
        <p class="eyebrow">Administração</p>
        <h1>Painel administrativo</h1>
        <p>Entre com e-mail e senha de usuário autorizado.</p>
        <label>E-mail administrativo
          <input name="email" type="email" autocomplete="username" required value="joelmaespacosama@gmail.com" />
        </label>
        <label>Senha
          <input name="password" type="password" autocomplete="current-password" minlength="8" required />
        </label>
        <button class="gold-btn" type="submit">Entrar no painel</button>
        <button class="ghost-btn" type="button" data-route="recuperar-senha">Esqueci minha senha</button>
        <p class="form-message" id="adminPasswordLoginMessage"></p>
      </form>
    </section>
  `;
}

async function validateAdminSession(session) {
  const response = await fetch(BOOKING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action: "account-data" }),
  });
  const result = await response.json().catch(() => ({ ok: false }));
  if (!response.ok || result.ok !== true || result.isAdmin !== true) {
    throw new Error("not_admin");
  }
  return result;
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = normalizeEmail(form.elements.email.value);
  const password = String(form.elements.password.value || "");
  const message = form.querySelector("#adminPasswordLoginMessage");
  const button = form.querySelector('button[type="submit"]');

  if (!ADMIN_EMAILS.has(email)) {
    message.textContent = "Este e-mail não está autorizado para o painel.";
    return;
  }

  button.disabled = true;
  message.textContent = "Entrando no painel...";
  try {
    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    if (error || !data.session) throw error || new Error("sem_sessao");
    await validateAdminSession(data.session);
    message.textContent = "Acesso autorizado. Abrindo painel...";
    window.location.hash = "admin";
    window.setTimeout(() => window.location.reload(), 250);
  } catch {
    await auth.auth.signOut().catch(() => {});
    message.textContent = "E-mail ou senha inválidos, ou usuário sem permissão administrativa.";
  } finally {
    button.disabled = false;
  }
}

function patchAdminLogin() {
  const hash = window.location.hash.replace("#", "") || "home";
  if (hash !== "admin-login") return;
  const app = document.querySelector("#app");
  if (!app) return;
  const oldForm = app.querySelector("#adminLoginForm");
  const alreadyPatched = app.querySelector("#adminPasswordLoginForm");
  if (!oldForm || alreadyPatched) return;
  app.innerHTML = adminLoginHtml();
  const form = app.querySelector("#adminPasswordLoginForm");
  form?.addEventListener("submit", handleAdminLogin);
  app.querySelector('[data-route="recuperar-senha"]')?.addEventListener("click", () => {
    window.location.hash = "recuperar-senha";
  });
}

window.addEventListener("hashchange", () => window.setTimeout(patchAdminLogin, 0));
window.addEventListener("load", () => window.setTimeout(patchAdminLogin, 500));

const observer = new MutationObserver(() => patchAdminLogin());
observer.observe(document.documentElement, { childList: true, subtree: true });
