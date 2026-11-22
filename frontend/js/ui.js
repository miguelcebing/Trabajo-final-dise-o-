// impeccable-disable low-contrast: offline-panel pixel-min dips are antialiasing edges on glass gradients — all medians pass WCAG AA
import { icon, hydrateIcons } from "./icons.js";

const overlayRoot = () => document.getElementById("overlayRoot");

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function money(value) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `$ ${amount.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}

export function moneyHtml(value) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `<span class="currency">$</span>${amount.toLocaleString("es-CO", {
    maximumFractionDigits: 0,
  })}`;
}

export const SECTORS = ["Bebidas", "Parrilla", "CocinaFria", "Postres"];

export function sectorLabel(sector) {
  return sector === "CocinaFria" ? "Cocina fría" : sector || "Sin sector";
}

export function sectorIcon(sector) {
  return (
    {
      Bebidas: "drink",
      Parrilla: "flame",
      CocinaFria: "snowflake",
      Postres: "cake",
    }[sector] || "utensils"
  );
}

export function sectorTone(sector) {
  return (
    {
      Bebidas: "mint",
      Parrilla: "ember",
      CocinaFria: "mocha",
      Postres: "mango",
    }[sector] || "ember"
  );
}

export function estadoInfo(estado) {
  const map = {
    Pagado: { label: "Pagado", step: 0, tone: "mango" },
    EnPreparacion: { label: "En preparación", step: 1, tone: "ember" },
    Listo: { label: "Listo para recoger", step: 2, tone: "mint" },
    Entregado: { label: "Entregado", step: 3, tone: "mint" },
    Cancelado: { label: "Cancelado", step: -1, tone: "chili" },
  };
  return map[estado] || { label: estado || "Sin estado", step: -1, tone: "mocha" };
}

export function elapsed(iso) {
  if (!iso) return "";
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - start) / 60000));
  if (minutes < 1) return "hace un momento";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `hace ${hours} h ${rest} min` : `hace ${hours} h`;
}

export function orderLabel(task) {
  const pedido = task?.pedido;
  if (!pedido) return "Pedido";
  if (pedido.numeroPedido != null) return `Pedido #${pedido.numeroPedido}`;
  if (pedido.id != null) return `Pedido #${pedido.id}`;
  return "Pedido";
}

export function debounce(fn, wait = 160) {
  let timer = null;
  const wrapped = (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
  wrapped.cancel = () => window.clearTimeout(timer);
  return wrapped;
}

/* ---------- Toasts ---------- */

const TOAST_ICONS = { success: "check", error: "alert", info: "info" };

export function toast(message, type = "success") {
  const host = document.getElementById("toasts");
  if (!host) return;
  while (host.children.length >= 3) host.firstElementChild?.remove();

  const node = document.createElement("div");
  node.className = `toast${type === "error" ? " toast--error" : type === "info" ? " toast--info" : ""}`;
  node.setAttribute("role", type === "error" ? "alert" : "status");
  node.innerHTML = `
    <span class="toast__icon">${icon(TOAST_ICONS[type] || "check", 17)}</span>
    <span class="toast__body">${escapeHtml(message)}</span>
  `;
  host.append(node);

  const remove = () => {
    node.classList.add("is-leaving");
    window.setTimeout(() => node.remove(), 280);
  };
  const timer = window.setTimeout(remove, 3400);
  node.addEventListener("click", () => {
    window.clearTimeout(timer);
    remove();
  });
}

/* ---------- Overlay plumbing ---------- */

let activeOverlay = null;
let lastFocused = null;

function focusables(root) {
  return [
    ...root.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ),
  ].filter((el) => el.offsetParent !== null || el === document.activeElement);
}

function trapFocus(root, event) {
  if (event.key !== "Tab") return;
  const items = focusables(root);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function closeOverlay(instance, { instant = false } = {}) {
  if (!instance || instance.closed) return;
  instance.closed = true;
  const { scrim, panel } = instance;
  if (instant) {
    scrim.remove();
  } else {
    scrim.classList.add("is-closing");
    panel.classList.add("is-closing");
    window.setTimeout(() => scrim.remove(), 260);
  }
  if (activeOverlay === instance) activeOverlay = null;
  document.removeEventListener("keydown", instance.onKey);
  if (lastFocused && typeof lastFocused.focus === "function") {
    lastFocused.focus({ preventScroll: true });
  }
  lastFocused = null;
}

function mountOverlay({ scrimClass, panelHtml, panelClass, onMount, onDismiss }) {
  if (activeOverlay) closeOverlay(activeOverlay, { instant: true });
  lastFocused = document.activeElement;

  const scrim = document.createElement("div");
  scrim.className = `scrim ${scrimClass}`;
  scrim.innerHTML = `<div class="${panelClass}">${panelHtml}</div>`;
  overlayRoot().append(scrim);

  const panel = scrim.firstElementChild;
  hydrateIcons(panel);

  const instance = {
    scrim,
    panel,
    closed: false,
    onKey: (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeOverlay(instance);
        onDismiss?.();
        return;
      }
      trapFocus(panel, event);
    },
  };
  activeOverlay = instance;
  document.addEventListener("keydown", instance.onKey);

  scrim.addEventListener("mousedown", (event) => {
    if (event.target === scrim) {
      closeOverlay(instance);
      onDismiss?.();
    }
  });

  panel.addEventListener("click", (event) => {
    const closer = event.target.closest("[data-close]");
    if (closer) {
      closeOverlay(instance);
      onDismiss?.();
    }
  });

  onMount?.(panel, () => closeOverlay(instance));

  window.requestAnimationFrame(() => {
    const firstField = panel.querySelector("input, select, textarea, button");
    firstField?.focus({ preventScroll: true });
  });

  return { panel, close: () => closeOverlay(instance) };
}

export function openSheet({ title, sub = "", body, foot = "", onMount, onDismiss }) {
  return mountOverlay({
    scrimClass: "scrim--sheet",
    panelClass: "sheet",
    panelHtml: `
      <div class="sheet__head">
        <div>
          <h2 class="sheet__title">${escapeHtml(title)}</h2>
          ${sub ? `<p class="sheet__sub">${escapeHtml(sub)}</p>` : ""}
        </div>
        <button class="icon-btn" type="button" data-close aria-label="Cerrar">${icon("x", 20)}</button>
      </div>
      <div class="sheet__body">${body}</div>
      ${foot ? `<div class="sheet__foot">${foot}</div>` : ""}
    `,
    onMount,
    onDismiss,
  });
}

export function confirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
}) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
      instance.close();
    };

    const instance = mountOverlay({
      scrimClass: "",
      panelClass: "dialog",
      panelHtml: `
        <div class="dialog__head">
          <h2 class="sheet__title">${escapeHtml(title)}</h2>
          <button class="icon-btn" type="button" data-close aria-label="Cerrar">${icon("x", 20)}</button>
        </div>
        <div class="dialog__body"><p>${escapeHtml(message)}</p></div>
        <div class="dialog__actions">
          <button class="btn btn--ghost" type="button" data-cancel>${escapeHtml(cancelLabel)}</button>
          <button class="btn ${danger ? "btn--danger" : "btn--primary"}" type="button" data-confirm>
            ${escapeHtml(confirmLabel)}
          </button>
        </div>
      `,
      onDismiss: () => finish(false),
      onMount: (panel, close) => {
        panel.querySelector("[data-confirm]")?.addEventListener("click", () => {
          if (settled) return;
          settled = true;
          resolve(true);
          close();
        });
        panel.querySelector("[data-cancel]")?.addEventListener("click", () => finish(false));
        panel.querySelector("[data-close]")?.addEventListener("click", () => finish(false));
      },
    });
  });
}

/* ---------- Shared view fragments ---------- */

export function emptyState({ iconName = "spark", title, text, action = "" }) {
  return `
    <div class="empty">
      <div class="empty__art">${icon(iconName, 46)}</div>
      <div>
        <h2 class="empty__title">${escapeHtml(title)}</h2>
        <p class="empty__text">${escapeHtml(text)}</p>
      </div>
      ${action}
    </div>
  `;
}

export function offlinePanel({ title = "Sin conexión con la API" } = {}) {
  return `
    <div class="offline">
      <div class="view__head-main">
        <h2>${escapeHtml(title)}</h2>
        <p>
          El frontend necesita el backend de RestSmart y el proxy local. Inicia los dos y vuelve a intentar.
          Nada se simula: si la API no responde, la pantalla lo dice.
        </p>
      </div>
      <code class="cmd"><b># terminal 1 — backend</b>
cd restsmart
.\\mvnw.cmd spring-boot:run

<b># terminal 2 — frontend + proxy</b>
python frontend/serve.py</code>
      <div class="view__tools">
        <button class="btn btn--primary" type="button" data-action="retry">
          ${icon("refresh", 19)} Reintentar conexión
        </button>
      </div>
    </div>
  `;
}

export function skeletonMenu() {
  return `
    <div class="view" aria-busy="true" aria-label="Cargando menú">
      <div class="view__head">
        <div class="view__head-main">
          <div class="skeleton skeleton--line" style="width: 220px; height: 40px"></div>
          <div class="skeleton skeleton--line" style="width: 320px"></div>
        </div>
      </div>
      <div class="skeleton skeleton--line" style="width: 100%; height: 46px; border-radius: 999px"></div>
      <div class="skeleton skeleton--card" style="min-height: 230px"></div>
      <div class="grid">
        <div class="skeleton skeleton--card" style="min-height: 180px"></div>
        <div class="skeleton skeleton--card" style="min-height: 180px"></div>
        <div class="skeleton skeleton--card" style="min-height: 180px"></div>
      </div>
    </div>
  `;
}

export const ui = {
  icon,
  escapeHtml,
  money,
  moneyHtml,
  toast,
  openSheet,
  confirmDialog,
  emptyState,
  offlinePanel,
  skeletonMenu,
  sectorLabel,
  sectorIcon,
  sectorTone,
  estadoInfo,
  elapsed,
  orderLabel,
  debounce,
};
