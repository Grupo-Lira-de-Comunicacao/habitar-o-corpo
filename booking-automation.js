// Habitar o Corpo — secretária automática de agendamentos
// Camada complementar sem backend: confirma o horário no app, bloqueia a agenda local
// e prepara envio futuro para n8n/WhatsApp quando o webhook for conectado.

window.N8N_BOOKING_WEBHOOK_URL = window.N8N_BOOKING_WEBHOOK_URL || "";
window.HABITAR_LAST_BOOKING_KEY = "habitar_last_booking";

function habitarReadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function habitarWriteJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function habitarFormatDate(date) {
  if (!date) return "";
  const [year, month, day] = String(date).split("-");
  return day && month && year ? `${day}/${month}/${year}` : date;
}

function habitarNormalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function habitarCurrentClient() {
  const session = habitarReadJson("habitar_session", null);
  if (!session?.id && !session?.email) return null;
  const clients = habitarReadJson("habitar_clients", []);
  return clients.find((client) =>
    client?.active !== false &&
    (client.id === session.id || habitarNormalizeEmail(client.email) === habitarNormalizeEmail(session.email)),
  ) || null;
}

function habitarServiceById(serviceId) {
  return habitarReadJson("services", []).find((service) => service.id === serviceId) || null;
}

function habitarAppointmentWhatsappMessage(appointment) {
  return [
    "Novo agendamento confirmado pelo app Habitar o Corpo:",
    "",
    `Cliente: ${appointment.customerName}`,
    `WhatsApp: ${appointment.customerPhone}`,
    `E-mail: ${appointment.customerEmail}`,
    `Serviço: ${appointment.serviceName}`,
    `Data: ${habitarFormatDate(appointment.date)}`,
    `Horário: ${appointment.time}`,
    "Status: Confirmado automaticamente",
    "Origem: App Habitar o Corpo",
  ].join("\n");
}

function habitarWaLink(message) {
  return `https://wa.me/5512988830247?text=${encodeURIComponent(message)}`;
}

async function notifyBookingWebhook(appointment) {
  if (!window.N8N_BOOKING_WEBHOOK_URL) return;
  try {
    await fetch(window.N8N_BOOKING_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
  } catch (error) {
    console.warn("Falha ao notificar webhook de agendamento", error);
  }
}

function habitarBuildAutoConfirmedAppointment(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const service = habitarServiceById(data.serviceId);
  const client = habitarCurrentClient();

  return {
    id: crypto.randomUUID(),
    clientId: client?.id || null,
    serviceId: service?.id || data.serviceId,
    serviceName: service?.name || "Atendimento",
    customerName: String(data.customerName || "").trim(),
    customerPhone: String(data.customerPhone || "").trim(),
    customerEmail: habitarNormalizeEmail(data.customerEmail),
    date: data.date,
    time: data.time,
    notes: String(data.notes || "").trim(),
    status: "confirmed",
    statusLabel: "Confirmado automaticamente",
    origin: "App Habitar o Corpo",
    autoConfirmed: true,
    createdAt: new Date().toISOString(),
  };
}

function habitarHasBookingConflict(appointment) {
  const blockingStatuses = new Set(["pending", "confirmed", "awaiting_payment", "paid"]);
  return habitarReadJson("habitar_appointments", []).some((item) =>
    item.date === appointment.date &&
    item.time === appointment.time &&
    blockingStatuses.has(item.status),
  );
}

function habitarSaveAppointment(appointment) {
  const appointments = habitarReadJson("habitar_appointments", []);
  habitarWriteJson("habitar_appointments", [appointment, ...appointments]);
  habitarWriteJson(window.HABITAR_LAST_BOOKING_KEY, appointment);
}

function habitarConfirmationHtml(booking) {
  const message = habitarAppointmentWhatsappMessage(booking);
  return `
    <section class="success-panel" data-booking-auto-confirmation="true">
      <p class="script">Agendamento confirmado</p>
      <h1>Horário reservado com sucesso</h1>
      <p>Seu agendamento foi confirmado automaticamente. Em caso de necessidade de reagendamento, fale com a Joelma pelo WhatsApp.</p>
      <p class="pix-line">Pix provisório para pagamento/sinal: <strong>11987080279</strong></p>
      <div class="summary-box">
        <strong>${booking.serviceName}</strong>
        <span>${habitarFormatDate(booking.date)} às ${booking.time}</span>
        <span>${booking.customerName} · ${booking.customerPhone}</span>
        <span>${booking.customerEmail}</span>
        <span>Status: confirmado automaticamente</span>
      </div>
      <a class="gold-btn link-btn" href="${habitarWaLink(message)}" target="_blank" rel="noreferrer">Enviar aviso para Joelma</a>
    </section>
  `;
}

function habitarRenderAutoConfirmation() {
  const app = document.querySelector("#app");
  const booking = habitarReadJson(window.HABITAR_LAST_BOOKING_KEY, null);
  if (!app || !booking) return false;
  if (app.querySelector('[data-booking-auto-confirmation="true"]')) return true;
  app.innerHTML = habitarConfirmationHtml(booking);
  return true;
}

window.renderConfirmation = function renderConfirmation() {
  const booking = habitarReadJson(window.HABITAR_LAST_BOOKING_KEY, null);
  if (!booking && typeof window.renderBooking === "function") return window.renderBooking();
  return habitarConfirmationHtml(booking);
};

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "bookingForm") return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const messageEl = document.querySelector("#bookingMessage");
  const appointment = habitarBuildAutoConfirmedAppointment(form);

  if (!appointment.serviceId || !appointment.date || !appointment.time || !appointment.customerName || !appointment.customerPhone || !appointment.customerEmail) {
    if (messageEl) messageEl.textContent = "Preencha serviço, data, horário, nome, telefone e e-mail.";
    return;
  }

  if (habitarHasBookingConflict(appointment)) {
    if (messageEl) messageEl.textContent = "Este horário acabou de ficar indisponível. Escolha outro horário.";
    return;
  }

  habitarSaveAppointment(appointment);
  notifyBookingWebhook(appointment);

  location.hash = "confirmacao";
  window.setTimeout(habitarRenderAutoConfirmation, 0);
}, true);

function habitarEnhanceAdmin() {
  const heading = document.querySelector(".admin-shell .section-heading");
  if (!heading || document.querySelector(".booking-auto-admin-note")) return;
  const note = document.createElement("p");
  note.className = "admin-warning booking-auto-admin-note";
  note.textContent = "O app confirma horários automaticamente. Use Cancelar ou Reagendar apenas quando necessário.";
  heading.insertAdjacentElement("afterend", note);
}

function habitarEnhanceAccountAppointments() {
  document.querySelectorAll(".appointment-mini").forEach((card) => {
    if (card.querySelector(".booking-auto-contact")) return;
    const text = card.textContent || "";
    const link = document.createElement("a");
    link.className = "text-link-btn booking-auto-contact";
    link.href = habitarWaLink(`Olá, Joelma. Gostaria de falar sobre meu agendamento pelo app Habitar o Corpo.\n\n${text}`);
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Falar com Joelma sobre este agendamento";
    card.appendChild(link);
  });
}

const habitarObserver = new MutationObserver(() => {
  habitarEnhanceAdmin();
  habitarEnhanceAccountAppointments();
  if (location.hash.replace("#", "") === "confirmacao") habitarRenderAutoConfirmation();
});

const habitarStartAutomationLayer = () => {
  const app = document.querySelector("#app");
  if (app) habitarObserver.observe(app, { childList: true, subtree: true });
  habitarEnhanceAdmin();
  habitarEnhanceAccountAppointments();
  if (location.hash.replace("#", "") === "confirmacao") habitarRenderAutoConfirmation();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", habitarStartAutomationLayer);
} else {
  habitarStartAutomationLayer();
}
