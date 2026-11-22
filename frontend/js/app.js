import { api, ApiError } from "./api.js";
import { icon, hydrateIcons } from "./icons.js";
import { ui, SECTORS } from "./ui.js";
import { renderCliente } from "./views/cliente.js";
import { renderCocina } from "./views/cocina.js";
import { renderAdmin } from "./views/admin.js";

const RAIL_SECTOR_LABEL = {
  Bebidas: "Bebidas",
  Parrilla: "Parrilla",
  CocinaFria: "Fría",
  Postres: "Postres",
};

const CLIENT_VIEWS = ["menu", "carrito", "mesa", "resumen", "pago", "comprobante", "seguimiento"];
const MODES = ["cliente", "cocina", "admin"];

export const state = {
  mode: "cliente",
  view: "menu",
  sector: "Parrilla",
  categoryId: null,
  catalog: {
    products: [],
    categories: [],
    failedCategories: 0,
    loadedAt: 0,
    state: "idle",
  },
  cart: null,
  table: null,
  online: null,
};

const stage = document.getElementById("stage");
const rail = document.getElementById("rail");
const modesEl = document.getElementById("modes");
const orb = document.getElementById("cartOrb");
const statusEl = document.getElementById("apiStatus");

let renderToken = 0;
let cleanups = [];
let catalogPromise = null;

/* ---------- Shell ---------- */

function totalItems(cart) {
  return (cart?.items || []).reduce((sum, item) => sum + (item.cantidad || 0), 0);
}

function updateCart(cart) {
  state.cart = cart || { items: [], total: 0 };
  const count = totalItems(state.cart);
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = String(count);
  orb?.classList.toggle("is-empty", count === 0);
  orb?.setAttribute("aria-label", `Abrir carrito, ${count} ${count === 1 ? "ítem" : "ítems"}`);
  renderRail();
}

function setOnline(ok) {
  state.online = ok;
  if (!statusEl) return;
  statusEl.classList.toggle("is-online", ok === true);
  statusEl.classList.toggle("is-offline", ok === false);
  const text = statusEl.querySelector(".api-status__text");
  if (text) {
    text.textContent = ok === true ? "API en línea" : ok === false ? "API sin conexión" : "Conectando";
  }
}

function railItem({ href, label, iconName, active, badge = 0, ariaLabel }) {
  return `
    <button class="rail__item" type="button" data-href="${href}"
      ${active ? 'aria-current="page"' : ""} aria-label="${ui.escapeHtml(ariaLabel || label)}">
      ${icon(iconName, 22)}
      <span>${ui.escapeHtml(label)}</span>
      ${badge > 0 ? `<span class="rail__badge">${badge}</span>` : ""}
    </button>`;
}

function renderRail() {
  if (!rail) return;
  const count = totalItems(state.cart);
  if (state.mode === "cliente") {
    rail.innerHTML = [
      railItem({ href: "#cliente/menu", label: "Menú", iconName: "menu", active: state.view === "menu" }),
      railItem({
        href: "#cliente/carrito",
        label: "Carrito",
        iconName: "cart",
        active: state.view === "carrito",
        badge: count,
        ariaLabel: `Carrito, ${count} ítems`,
      }),
      railItem({ href: "#cliente/mesa", label: "Mesa", iconName: "table", active: state.view === "mesa" }),
      railItem({
        href: "#cliente/resumen",
        label: "Resumen",
        iconName: "receipt",
        active: state.view === "resumen",
      }),
      railItem({ href: "#cliente/pago", label: "Pago", iconName: "card", active: state.view === "pago" }),
      railItem({
        href: "#cliente/comprobante",
        label: "Comprobante",
        iconName: "receipt",
        active: state.view === "comprobante",
      }),
      railItem({
        href: "#cliente/seguimiento",
        label: "Seguir",
        iconName: "track",
        active: state.view === "seguimiento",
        ariaLabel: "Seguimiento del pedido",
      }),
    ].join("");
    return;
  }

  if (state.mode === "cocina") {
    rail.innerHTML = [
      ...SECTORS.map((sector) =>
        railItem({
          href: `#cocina/tareas/${sector}`,
          label: RAIL_SECTOR_LABEL[sector] || sector,
          iconName: ui.sectorIcon(sector),
          active: state.view === "tareas" && state.sector === sector,
          ariaLabel: ui.sectorLabel(sector),
        })
      ),
      railItem({
        href: `#cocina/historial/${state.sector}`,
        label: "Historial",
        iconName: "history",
        active: state.view === "historial",
      }),
    ].join("");
    return;
  }

  rail.innerHTML = [
    railItem({
      href: "#admin/catalogo",
      label: "Catálogo",
      iconName: "layers",
      active: state.view === "catalogo",
    }),
    railItem({
      href: "#admin/nuevo",
      label: "Nuevo",
      iconName: "plus",
      active: state.view === "nuevo",
      ariaLabel: "Nuevo producto",
    }),
  ].join("");
}

function renderModes() {
  modesEl?.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
  });
}

/* ---------- Data ---------- */

async function loadCatalog(force = false) {
  if (!force && state.catalog.loadedAt) return state.catalog;
  if (catalogPromise) return catalogPromise;

  state.catalog.state = "loading";
  catalogPromise = api
    .probeCatalog()
    .then((result) => {
      state.catalog = {
        products: result.products,
        categories: result.categories,
        failedCategories: result.failedCategories,
        loadedAt: Date.now(),
        state: "ready",
      };
      setOnline(true);
      return state.catalog;
    })
    .catch((error) => {
      state.catalog.state = error instanceof ApiError && error.offline ? "offline" : "error";
      throw error;
    })
    .finally(() => {
      catalogPromise = null;
    });

  return catalogPromise;
}

async function refreshCart() {
  try {
    const cart = await api.summary();
    updateCart(cart);
    setOnline(true);
    return cart;
  } catch (error) {
    if (error instanceof ApiError && error.offline) setOnline(false);
    else setOnline(true);
    throw error;
  }
}

/* ---------- Cart flight ---------- */

function feedOrb(source, iconName = "bag") {
  if (!orb) return;
  const sourceRect = source?.rect || source?.getBoundingClientRect?.();
  const orbRect = orb.getBoundingClientRect();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  orb.classList.remove("is-fed");
  void orb.offsetWidth;
  orb.classList.add("is-fed");
  window.setTimeout(() => orb.classList.remove("is-fed"), 700);

  const ring = document.createElement("span");
  ring.className = "orb-ring";
  ring.style.left = `${orbRect.left + orbRect.width / 2 - 27}px`;
  ring.style.top = `${orbRect.top + orbRect.height / 2 - 27}px`;
  document.body.append(ring);
  window.setTimeout(() => ring.remove(), 760);

  if (reduced || !sourceRect) return;

  const size = Math.max(38, Math.min(58, sourceRect.width || 48, sourceRect.height || 48));
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = orbRect.left + orbRect.width / 2;
  const endY = orbRect.top + orbRect.height / 2;

  const floater = document.createElement("span");
  floater.className = "fly-orb";
  floater.style.width = `${size}px`;
  floater.style.height = `${size}px`;
  floater.style.left = `${startX - size / 2}px`;
  floater.style.top = `${startY - size / 2}px`;
  floater.innerHTML = icon(iconName, 24);
  document.body.append(floater);

  const dx = endX - startX;
  const dy = endY - startY;

  const animation = floater.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.48}px, ${dy * 0.48 - 110}px) scale(0.92)`,
        opacity: 1,
        offset: 0.52,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.28)`, opacity: 0 },
    ],
    { duration: 680, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  );

  animation.onfinish = () => floater.remove();
  animation.oncancel = () => floater.remove();
}

/* ---------- Routing ---------- */

function parseRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [modeRaw, a, b] = raw.split("/");
  const mode = MODES.includes(modeRaw) ? modeRaw : "cliente";

  if (mode === "cliente") {
    return { mode, view: CLIENT_VIEWS.includes(a) ? a : "menu" };
  }
  if (mode === "cocina") {
    if (a === "historial") {
      return { mode, view: "historial", sector: SECTORS.includes(b) ? b : state.sector };
    }
    return { mode, view: "tareas", sector: SECTORS.includes(b) ? b : state.sector };
  }
  return { mode, view: a === "nuevo" ? "nuevo" : "catalogo" };
}

function hashFor({ mode, view, sector }) {
  if (mode === "cliente") return `#cliente/${view || "menu"}`;
  if (mode === "cocina") {
    return view === "historial"
      ? `#cocina/historial/${sector || state.sector}`
      : `#cocina/tareas/${sector || state.sector}`;
  }
  return `#admin/${view || "catalogo"}`;
}

function navigate(partial, { force = false } = {}) {
  const next = { ...state, ...partial };
  if (partial.mode && partial.mode !== state.mode) {
    if (partial.mode === "cliente") next.view = partial.view || "menu";
    if (partial.mode === "cocina") {
      next.view = partial.view || "tareas";
      next.sector = partial.sector || state.sector || "Parrilla";
    }
    if (partial.mode === "admin") next.view = partial.view || "catalogo";
  }
  const hash = hashFor(next);
  if (window.location.hash === hash) {
    applyRoute();
  } else {
    window.location.hash = hash;
  }
}

function runCleanups() {
  for (const fn of cleanups) {
    try {
      fn();
    } catch {}
  }
  cleanups = [];
}

const ctx = {
  state,
  api,
  ui,
  icon,
  navigate,
  loadCatalog,
  refreshCart,
  updateCart,
  setOnline,
  feedOrb,
  isCurrent: () => true,
  registerCleanup: (fn) => cleanups.push(fn),
};

function applyRoute() {
  const route = parseRoute();
  state.mode = route.mode;
  state.view = route.view;
  if (route.sector) state.sector = route.sector;

  runCleanups();
  const token = ++renderToken;
  ctx.isCurrent = () => token === renderToken;

  renderModes();
  renderRail();

  stage.innerHTML = "";
  stage.scrollTop = 0;

  let result;
  if (state.mode === "cliente") result = renderCliente(stage, ctx);
  else if (state.mode === "cocina") result = renderCocina(stage, ctx);
  else result = renderAdmin(stage, ctx);

  Promise.resolve(result)
    .catch((error) => {
      if (token !== renderToken) return;
      console.error(error);
    })
    .finally(() => {
      if (token !== renderToken) return;
      const heading = stage.querySelector("h1, h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    });
}

/* ---------- Boot ---------- */

hydrateIcons(document);
setOnline(null);

try {
  const stored = sessionStorage.getItem("restsmart.table");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.numero != null) state.table = parsed;
  }
} catch {}

modesEl?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  const mode = button.dataset.mode;
  if (mode === state.mode) return;
  if (mode === "cliente") navigate({ mode, view: "menu" });
  else if (mode === "cocina") navigate({ mode, view: "tareas", sector: state.sector });
  else navigate({ mode, view: "catalogo" });
});

rail?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-href]");
  if (!button) return;
  event.preventDefault();
  if (window.location.hash === button.dataset.href) applyRoute();
  else window.location.hash = button.dataset.href;
});

orb?.addEventListener("click", () => {
  if (state.mode === "cliente" && state.view === "carrito") return;
  navigate({ mode: "cliente", view: "carrito" });
});

window.addEventListener("hashchange", applyRoute);

if (!window.location.hash || !/^#(cliente|cocina|admin)\b/.test(window.location.hash)) {
  history.replaceState(null, "", "#cliente/menu");
}

renderRail();
applyRoute();

refreshCart().catch(() => {});

/* Pointer-following sheen, batched on animation frames. */
let sheenFrame = 0;
let lastPointer = null;
document.addEventListener(
  "pointermove",
  (event) => {
    lastPointer = event;
    if (sheenFrame) return;
    sheenFrame = window.requestAnimationFrame(() => {
      sheenFrame = 0;
      const target = lastPointer?.target?.closest?.(".glass");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${lastPointer.clientX - rect.left}px`);
      target.style.setProperty("--my", `${lastPointer.clientY - rect.top}px`);
    });
  },
  { passive: true }
);
