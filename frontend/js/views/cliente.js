import { api, ApiError } from "../api.js";
import { icon } from "../icons.js";
import { ui } from "../ui.js";
import {
  loadDemoOrder,
  createDemoOrder,
  advanceDemoOrder,
  clearDemoOrder,
} from "../demo.js";

const {
  escapeHtml: esc,
  money,
  moneyHtml,
  toast,
  openSheet,
  confirmDialog,
  emptyState,
  offlinePanel,
  sectorLabel,
  sectorIcon,
  sectorTone,
  estadoInfo,
  debounce,
} = ui;

export function renderCliente(root, ctx) {
  switch (ctx.state.view) {
    case "menu":
      return renderMenu(root, ctx);
    case "carrito":
      return renderCart(root, ctx);
    case "mesa":
      return renderTable(root, ctx);
    case "resumen":
      return renderSummary(root, ctx);
    case "pago":
      return renderPayment(root, ctx);
    case "comprobante":
      return renderReceipt(root, ctx);
    case "seguimiento":
      return renderTracking(root, ctx);
    default:
      return renderMenu(root, ctx);
  }
}

/* ============================================================
   Shared fragments
   ============================================================ */

function medallion(product, size = "md") {
  const tone = sectorTone(product?.sector);
  const name = sectorIcon(product?.sector);
  return `<span class="medallion medallion--${tone} medallion--${size}" aria-hidden="true">${icon(
    name,
    64
  )}</span>`;
}

function productPills(product) {
  return `
    <span class="pill">${icon(sectorIcon(product.sector), 15)}${esc(sectorLabel(product.sector))}</span>
    ${product.categoria?.nombre ? `<span class="pill">${esc(product.categoria.nombre)}</span>` : ""}
    ${
      product.variantes?.length
        ? `<span class="pill">${product.variantes.length} variantes</span>`
        : ""
    }
    ${
      product.complementos?.length
        ? `<span class="pill">${product.complementos.length} complementos</span>`
        : ""
    }
  `;
}

function selectionFor(product, variant, compIndexes) {
  return {
    variante: variant || null,
    complementos: (product.complementos || []).filter((_, index) => compIndexes.has(index)),
  };
}

function optionsText(item) {
  const names = (item.opciones || [])
    .map((entry) => entry?.opcion?.nombre)
    .filter(Boolean);
  return names.length ? names.join(" · ") : "Sin opciones";
}

function cartCount(cart) {
  return (cart?.items || []).reduce((sum, item) => sum + (item.cantidad || 0), 0);
}

function apiFailure(error, ctx) {
  if (error instanceof ApiError && error.offline) ctx.setOnline(false);
  const message = error instanceof ApiError ? error.message : "Ocurrió un error inesperado.";
  toast(message, "error");
}

/* ============================================================
   Menu
   ============================================================ */

async function renderMenu(root, ctx) {
  if (!ctx.state.catalog.loadedAt) {
    root.innerHTML = ui.skeletonMenu();
  }

  try {
    await ctx.loadCatalog();
  } catch (error) {
    if (!ctx.isCurrent()) return;
    if (error instanceof ApiError && error.offline) {
      ctx.setOnline(false);
      root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
    } else {
      ctx.setOnline(true);
      root.innerHTML = `
        <div class="view is-entering">
          <div class="notice notice--danger">${icon("alert", 19)}<span>${esc(
            error instanceof ApiError ? error.message : "No se pudo cargar el menú."
          )}</span></div>
          <div><button class="btn btn--primary" type="button" data-action="retry-menu">${icon(
            "refresh",
            19
          )} Reintentar</button></div>
        </div>`;
      root.querySelector('[data-action="retry-menu"]')?.addEventListener("click", () => {
        renderMenu(root, ctx);
      });
    }
    return;
  }
  if (!ctx.isCurrent()) return;

  const { products, categories } = ctx.state.catalog;

  if (!products.length) {
    root.innerHTML = `
      <div class="view is-entering">
        <div class="view__head">
          <div class="view__head-main">
            <h1>Menú</h1>
            <p class="view__sub">El catálogo está vacío en este momento.</p>
          </div>
          <div class="view__tools">
            <button class="icon-btn" type="button" data-action="reload-menu" aria-label="Recargar menú">${icon(
              "refresh",
              20
            )}</button>
          </div>
        </div>
        ${emptyState({
          iconName: "chef",
          title: "No hay productos publicados",
          text: "La API respondió, pero ninguna categoría tiene productos activos. Se pueden crear desde Administración usando una categoría existente.",
          action: `<button class="btn btn--primary" type="button" data-action="go-admin">${icon(
            "sliders",
            19
          )} Abrir administración</button>`,
        })}
      </div>
    `;
    root.querySelector('[data-action="reload-menu"]')?.addEventListener("click", () => {
      ctx.loadCatalog(true).then(() => {
        if (ctx.isCurrent()) renderMenu(root, ctx);
      });
    });
    root.querySelector('[data-action="go-admin"]')?.addEventListener("click", () => {
      ctx.navigate({ mode: "admin", view: "catalogo" });
    });
    return;
  }

  if (ctx.state.categoryId == null || !categories.some((c) => c.id === ctx.state.categoryId)) {
    ctx.state.categoryId = categories[0]?.id ?? products[0]?.categoria?.id ?? null;
  }

  const activeCategory = ctx.state.categoryId;
  const visible = products.filter((item) => item.categoria?.id === activeCategory);
  const feature = visible[0] || products[0];
  const rest = visible.slice(1);
  const flow = products.length <= 2;

  const featureSelection = {
    variant: feature.variantes?.[0] || null,
    comps: new Set(
      (feature.complementos || [])
        .map((comp, index) => (comp.obligatorio ? index : -1))
        .filter((index) => index >= 0)
    ),
  };

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Menú</h1>
          <p class="view__sub">Elige un plato, ajusta sus opciones y agrégalo a tu pedido.</p>
        </div>
        <div class="view__tools">
          ${
            ctx.state.table
              ? `<span class="pill pill--mango">${icon("table", 15)} Mesa ${ctx.state.table.numero}</span>`
              : ""
          }
          <button class="icon-btn" type="button" data-action="reload-menu" aria-label="Recargar menú">
            ${icon("refresh", 20)}
          </button>
        </div>
      </div>

      <div class="cats" role="tablist" aria-label="Categorías del menú">
        ${categories
          .map((category) => {
            const count = products.filter((item) => item.categoria?.id === category.id).length;
            const active = category.id === activeCategory;
            return `<button class="chip${active ? " is-active" : ""}" type="button" role="tab"
              aria-selected="${active}" data-category="${category.id}">
              ${esc(category.nombre)}
              <span class="chip__count">${count}</span>
            </button>`;
          })
          .join("")}
      </div>

      <article class="feature glass reveal" style="--i: 0" data-feature="${feature.id}">
        <div class="feature__art" data-fly-source>${medallion(feature, "lg")}</div>
        <div class="feature__main">
          <h2 class="feature__title">${esc(feature.nombre)}</h2>
          <p class="feature__desc">${esc(feature.descripcion || "Sin descripción registrada.")}</p>
          <div class="feature__meta">${productPills(feature)}</div>
          ${
            feature.variantes?.length
              ? `<div class="opts" role="group" aria-label="Variantes de ${esc(feature.nombre)}">
                  ${feature.variantes
                    .map(
                      (variant, index) => `
                      <button class="opt${index === 0 ? " is-active" : ""}" type="button"
                        data-feature-variant="${index}" aria-pressed="${index === 0}">
                        ${esc(variant.nombre)}
                        ${
                          variant.precioAdicional
                            ? `<span class="opt__extra">+ ${money(variant.precioAdicional)}</span>`
                            : ""
                        }
                      </button>`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>
        <div class="feature__buy">
          <div class="feature__price">
            <small>Precio calculado por la API</small>
            <span class="price price--lg" data-feature-price>${moneyHtml(feature.precioBase)}</span>
          </div>
          <div class="view__tools" style="gap: 8px">
            ${
              feature.variantes?.length || feature.complementos?.length
                ? `<button class="btn btn--ghost" type="button" data-action="feature-options">Personalizar</button>`
                : ""
            }
            <button class="btn btn--primary" type="button" data-action="feature-add">
              ${icon("plus", 20)} Agregar
            </button>
          </div>
        </div>
      </article>

      ${
        rest.length
          ? `<div class="grid">
              ${rest
                .map(
                  (item, index) => `
                  <article class="dish glass reveal" style="--i: ${index + 1}" data-product="${item.id}">
                    <div class="dish__top" data-fly-source>
                      ${medallion(item, "sm")}
                      <div style="min-width: 0">
                        <h3 class="dish__name">${esc(item.nombre)}</h3>
                        <div class="dish__sector">${esc(sectorLabel(item.sector))}</div>
                      </div>
                    </div>
                    <p class="dish__desc">${esc(item.descripcion || "Sin descripción registrada.")}</p>
                    <div class="dish__foot">
                      <span class="price price--sm">${moneyHtml(item.precioBase)}</span>
                      <button class="btn btn--ghost dish__add" type="button"
                        data-action="${item.variantes?.length || item.complementos?.length ? "open-product" : "quick-add"}"
                        data-id="${item.id}">
                        ${item.variantes?.length || item.complementos?.length ? "Opciones" : "Agregar"}
                      </button>
                    </div>
                  </article>`
                )
                .join("")}
            </div>`
          : ""
      }

      ${
        flow
          ? `<div class="flow">
              <div class="flow__step">
                <span class="medallion medallion--ember medallion--sm">${icon("menu", 24)}</span>
                <div><strong>Elige tu plato</strong><span>Toca una categoría o un producto.</span></div>
              </div>
              <div class="flow__step">
                <span class="medallion medallion--mango medallion--sm">${icon("sliders", 24)}</span>
                <div><strong>Ajusta las opciones</strong><span>El precio se recalcula con la API.</span></div>
              </div>
              <div class="flow__step">
                <span class="medallion medallion--mint medallion--sm">${icon("table", 24)}</span>
                <div><strong>Confirma tu mesa</strong><span>Y revisa el resumen antes de pagar.</span></div>
              </div>
            </div>`
          : ""
      }
    </div>
  `;

  const priceEl = root.querySelector("[data-feature-price]");
  const addBtn = root.querySelector('[data-action="feature-add"]');
  let pricing = 0;
  let featurePrice = feature.precioBase;

  const refreshFeaturePrice = async () => {
    const token = ++pricing;
    const selection = selectionFor(feature, featureSelection.variant, featureSelection.comps);
    priceEl?.classList.add("is-updating");
    try {
      const [price, valid] = await Promise.all([
        api.priceOf(feature.id, selection),
        api.validateSelection(feature.id, selection),
      ]);
      if (!ctx.isCurrent() || token !== pricing) return;
      featurePrice = price;
      if (priceEl) priceEl.innerHTML = moneyHtml(price);
      if (addBtn) addBtn.disabled = !valid;
      ctx.setOnline(true);
    } catch (error) {
      if (!ctx.isCurrent() || token !== pricing) return;
      if (addBtn) addBtn.disabled = true;
      apiFailure(error, ctx);
    } finally {
      window.setTimeout(() => priceEl?.classList.remove("is-updating"), 260);
    }
  };

  root.querySelectorAll("[data-category]").forEach((chip) => {
    chip.addEventListener("click", () => {
      ctx.state.categoryId = Number(chip.dataset.category);
      renderMenu(root, ctx);
    });
  });

  root.querySelector('[data-action="reload-menu"]')?.addEventListener("click", async () => {
    await ctx.loadCatalog(true).catch(() => {});
    if (ctx.isCurrent()) renderMenu(root, ctx);
  });

  root.querySelectorAll("[data-feature-variant]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const index = Number(chip.dataset.featureVariant);
      featureSelection.variant = feature.variantes[index] || null;
      root.querySelectorAll("[data-feature-variant]").forEach((other) => {
        const active = other === chip;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      refreshFeaturePrice();
    });
  });

  root.querySelector('[data-action="feature-options"]')?.addEventListener("click", (event) => {
    openProduct(feature.id, ctx, root.querySelector("[data-fly-source]"));
  });

  addBtn?.addEventListener("click", async () => {
    const required = (feature.complementos || []).filter((comp) => comp.obligatorio);
    if (required.length) {
      openProduct(feature.id, ctx, root.querySelector("[data-fly-source]"));
      return;
    }
    addBtn.disabled = true;
    const source = root.querySelector("[data-fly-source]");
    try {
      const cart = await api.addItem({
        productId: feature.id,
        quantity: 1,
        selection: selectionFor(feature, featureSelection.variant, featureSelection.comps),
      });
      ctx.updateCart(cart);
      ctx.feedOrb(source, sectorIcon(feature.sector));
      toast(`${feature.nombre} agregado al carrito.`);
      ctx.setOnline(true);
    } catch (error) {
      apiFailure(error, ctx);
    } finally {
      addBtn.disabled = false;
    }
  });

  root.querySelectorAll("[data-product]").forEach((card) => {
    const id = Number(card.dataset.product);
    const item = products.find((entry) => entry.id === id);
    const btn = card.querySelector('[data-action="open-product"], [data-action="quick-add"]');
    if (!item || !btn) return;
    btn.addEventListener("click", async (event) => {
      if (btn.dataset.action === "open-product") {
        openProduct(id, ctx, card.querySelector("[data-fly-source]"));
        return;
      }
      btn.disabled = true;
      const source = card.querySelector("[data-fly-source]");
      try {
        const cart = await api.addItem({ productId: id, quantity: 1, selection: null });
        ctx.updateCart(cart);
        ctx.feedOrb(source, sectorIcon(item.sector));
        toast(`${item.nombre} agregado al carrito.`);
        ctx.setOnline(true);
      } catch (error) {
        apiFailure(error, ctx);
      } finally {
        btn.disabled = false;
      }
    });
  });

  if (feature.variantes?.length || feature.complementos?.length) {
    refreshFeaturePrice();
  }
}

/* ---------- Product sheet ---------- */

async function openProduct(productId, ctx, originEl) {
  let detail;
  try {
    detail = await api.product(productId);
    if (!ctx.isCurrent()) return;
  } catch (error) {
    apiFailure(error, ctx);
    return;
  }

  const state = {
    variant: detail.variantes?.[0] || null,
    comps: new Set(
      (detail.complementos || [])
        .map((comp, index) => (comp.obligatorio ? index : -1))
        .filter((index) => index >= 0)
    ),
    qty: 1,
    price: detail.precioBase,
    valid: true,
    pending: true,
    error: "",
  };

  const originRect = originEl?.getBoundingClientRect?.() || null;

  const sheet = openSheet({
    title: detail.nombre,
    sub: `${sectorLabel(detail.sector)}${detail.categoria?.nombre ? ` · ${detail.categoria.nombre}` : ""}`,
    body: `
      <div class="prod-art" data-sheet-art>${medallion(detail, "lg")}</div>
      <p class="view__sub">${esc(detail.descripcion || "Sin descripción registrada.")}</p>
      ${
        detail.variantes?.length
          ? `<fieldset class="opt-group">
              <div class="opt-group__head">
                <legend>Variante</legend>
                <span class="opt-group__hint">Elige una</span>
              </div>
              <div class="opt-list">
                ${detail.variantes
                  .map(
                    (variant, index) => `
                    <button class="opt-chip${index === 0 ? " is-active" : ""}" type="button"
                      data-variant="${index}" aria-pressed="${index === 0}">
                      <span>${esc(variant.nombre)}
                        <span class="opt-chip__price">${
                          variant.precioAdicional ? `+ ${money(variant.precioAdicional)}` : "Incluida"
                        }</span>
                      </span>
                      <span class="opt-chip__mark">${icon("check", 14)}</span>
                    </button>`
                  )
                  .join("")}
              </div>
            </fieldset>`
          : ""
      }
      ${
        detail.complementos?.length
          ? `<fieldset class="opt-group">
              <div class="opt-group__head">
                <legend>Complementos</legend>
                <span class="opt-group__hint">Los marcados son obligatorios</span>
              </div>
              <div class="opt-list">
                ${detail.complementos
                  .map(
                    (comp, index) => `
                    <button class="opt-chip${comp.obligatorio ? " is-active" : ""}" type="button"
                      data-comp="${index}" aria-pressed="${Boolean(comp.obligatorio)}">
                      <span>${esc(comp.nombre)}${comp.obligatorio ? '<span class="req">Obligatorio</span>' : ""}
                        <span class="opt-chip__price">+ ${money(comp.precioAdicional)}</span>
                      </span>
                      <span class="opt-chip__mark">${icon("check", 14)}</span>
                    </button>`
                  )
                  .join("")}
              </div>
            </fieldset>`
          : ""
      }
      <div class="qty-row">
        <span class="qty-row__label">Cantidad</span>
        <div class="qty">
          <button class="qty__btn" type="button" data-qty="-1" aria-label="Quitar una unidad">${icon(
            "minus",
            18
          )}</button>
          <span class="qty__value" data-qty-value aria-live="polite">1</span>
          <button class="qty__btn" type="button" data-qty="1" aria-label="Agregar una unidad">${icon(
            "plus",
            18
          )}</button>
        </div>
      </div>
      <div class="prod-price">
        <span>Total del ítem</span>
        <span class="price" data-sheet-price>${moneyHtml(detail.precioBase)}</span>
      </div>
      <p class="field__error" data-sheet-error hidden></p>
    `,
    foot: `
      <button class="btn btn--primary btn--wide" type="button" data-add disabled>
        ${icon("bag", 20)} <span data-add-label>Agregar al carrito</span>
      </button>
      <button class="btn btn--ghost btn--wide" type="button" data-close>${icon(
        "arrowLeft",
        18
      )} Seguir viendo el menú</button>
    `,
    onMount(panel, close) {
      const priceEl = panel.querySelector("[data-sheet-price]");
      const errorEl = panel.querySelector("[data-sheet-error]");
      const addBtn = panel.querySelector("[data-add]");
      const addLabel = panel.querySelector("[data-add-label]");
      const qtyEl = panel.querySelector("[data-qty-value]");
      let token = 0;

      const selection = () => selectionFor(detail, state.variant, state.comps);

      const paint = () => {
        qtyEl.textContent = String(state.qty);
        if (priceEl) priceEl.innerHTML = moneyHtml(state.price * state.qty);
        if (addLabel) addLabel.textContent = `Agregar ${state.qty} · ${money(state.price * state.qty)}`;
        if (errorEl) {
          errorEl.hidden = !state.error;
          errorEl.textContent = state.error;
        }
        if (addBtn) addBtn.disabled = !state.valid || state.pending;
      };

      const refresh = async () => {
        const current = ++token;
        state.pending = true;
        state.error = "";
        paint();
        try {
          const [price, valid] = await Promise.all([
            api.priceOf(detail.id, selection()),
            api.validateSelection(detail.id, selection()),
          ]);
          if (current !== token) return;
          state.price = price;
          state.valid = Boolean(valid);
          ctx.setOnline(true);
        } catch (error) {
          if (current !== token) return;
          state.valid = false;
          state.error = error instanceof ApiError ? error.message : "No se pudo calcular el precio.";
        } finally {
          if (current === token) {
            state.pending = false;
            paint();
          }
        }
      };

      panel.querySelectorAll("[data-variant]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number(btn.dataset.variant);
          state.variant = detail.variantes[index] || null;
          panel.querySelectorAll("[data-variant]").forEach((other) => {
            const active = other === btn;
            other.classList.toggle("is-active", active);
            other.setAttribute("aria-pressed", String(active));
          });
          refresh();
        });
      });

      panel.querySelectorAll("[data-comp]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number(btn.dataset.comp);
          if (state.comps.has(index)) state.comps.delete(index);
          else state.comps.add(index);
          const active = state.comps.has(index);
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-pressed", String(active));
          refresh();
        });
      });

      panel.querySelectorAll("[data-qty]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = Number(btn.dataset.qty);
          state.qty = Math.min(20, Math.max(1, state.qty + delta));
          paint();
        });
      });

      addBtn?.addEventListener("click", async () => {
        if (!state.valid || state.pending) return;
        addBtn.disabled = true;
        addLabel.textContent = "Agregando…";
        try {
          const cart = await api.addItem({
            productId: detail.id,
            quantity: state.qty,
            selection: selection(),
          });
          ctx.updateCart(cart);
          close();
          ctx.feedOrb(originRect ? { rect: originRect } : panel.querySelector("[data-sheet-art]"), sectorIcon(detail.sector));
          toast(`${detail.nombre} agregado al carrito.`);
          ctx.setOnline(true);
        } catch (error) {
          state.error = error instanceof ApiError ? error.message : "No se pudo agregar el producto.";
          state.pending = false;
          paint();
          addLabel.textContent = "Agregar al carrito";
          addBtn.disabled = false;
        }
      });

      refresh();
    },
  });

  return sheet;
}

/* ============================================================
   Cart
   ============================================================ */

async function renderCart(root, ctx) {
  if (!ctx.state.cart) {
    root.innerHTML = `<div class="view is-entering"><div class="skeleton skeleton--card"></div></div>`;
    try {
      ctx.updateCart(await api.summary());
    } catch (error) {
      if (!ctx.isCurrent()) return;
      if (error instanceof ApiError && error.offline) {
        ctx.setOnline(false);
        root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
      } else {
        apiFailure(error, ctx);
      }
      return;
    }
  }
  if (!ctx.isCurrent()) return;

  const cart = ctx.state.cart;
  const items = cart?.items || [];

  if (!items.length) {
    root.innerHTML = `
      <div class="view is-entering">
        <div class="view__head">
          <div class="view__head-main">
            <h1>Carrito</h1>
            <p class="view__sub">Aquí se acumulan los productos del kiosco.</p>
          </div>
        </div>
        ${emptyState({
          iconName: "bag",
          title: "Tu carrito está vacío",
          text: "Vuelve al menú para elegir un plato. Cada plato se guarda en el carrito del kiosco.",
          action: `<button class="btn btn--primary" type="button" data-action="go-menu">${icon(
            "menu",
            19
          )} Ver el menú</button>`,
        })}
      </div>
    `;
    root.querySelector('[data-action="go-menu"]')?.addEventListener("click", () => {
      ctx.navigate({ mode: "cliente", view: "menu" });
    });
    return;
  }

  const count = cartCount(cart);

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Carrito</h1>
          <p class="view__sub">${count} ${count === 1 ? "ítem" : "ítems"} en el pedido del kiosco.</p>
        </div>
        <div class="view__tools">
          <button class="btn btn--ghost" type="button" data-action="go-menu">${icon(
            "plus",
            18
          )} Agregar más</button>
        </div>
      </div>
      <div class="cart-layout">
        <div class="lines">
          ${items
            .map(
              (item, index) => `
              <article class="line reveal" style="--i: ${index}" data-line="${item.id}">
                <div class="line__art" data-fly-source>${medallion(item.producto, "sm")}</div>
                <div class="line__main">
                  <h3 class="line__name">${esc(item.producto?.nombre || "Producto")}</h3>
                  <p class="line__opts">${esc(optionsText(item))}</p>
                </div>
                <div class="line__side">
                  <div class="qty">
                    <button class="qty__btn" type="button" data-delta="-1" data-item="${item.id}"
                      aria-label="Quitar una unidad de ${esc(item.producto?.nombre || "producto")}">${icon(
                        "minus",
                        18
                      )}</button>
                    <span class="qty__value">${item.cantidad}</span>
                    <button class="qty__btn" type="button" data-delta="1" data-item="${item.id}"
                      aria-label="Agregar una unidad de ${esc(item.producto?.nombre || "producto")}">${icon(
                        "plus",
                        18
                      )}</button>
                  </div>
                  <div class="line__amount">
                    <div class="line__unit">${money(item.precioUnitario)} c/u</div>
                    <div class="line__subtotal">${money(item.subtotal)}</div>
                  </div>
                  <button class="icon-btn line__remove" type="button" data-remove="${item.id}"
                    aria-label="Quitar ${esc(item.producto?.nombre || "producto")} del carrito">${icon(
                      "trash",
                      18
                    )}</button>
                </div>
              </article>`
            )
            .join("")}
        </div>
        <aside class="cart-summary glass">
          <div class="cart-summary__row"><span>Ítems</span><strong class="num">${count}</strong></div>
          <div class="cart-summary__row"><span>Subtotal</span><strong class="num">${money(
            cart.total
          )}</strong></div>
          <div class="cart-summary__row"><span>Mesa</span><strong>${
            ctx.state.table ? `Mesa ${ctx.state.table.numero}` : "Sin elegir"
          }</strong></div>
          <div class="cart-summary__total">
            <span>Total</span>
            <span class="price price--lg">${moneyHtml(cart.total)}</span>
          </div>
          <button class="btn btn--primary btn--wide" type="button" data-action="continue">
            ${icon(ctx.state.table ? "receipt" : "table", 20)}
            ${ctx.state.table ? "Ver el resumen" : "Elegir mesa"}
          </button>
          <button class="btn btn--ghost btn--wide" type="button" data-action="clear">
            ${icon("trash", 18)} Vaciar carrito
          </button>
        </aside>
      </div>
    </div>
  `;

  root.querySelector('[data-action="go-menu"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "menu" });
  });

  root.querySelector('[data-action="continue"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: ctx.state.table ? "resumen" : "mesa" });
  });

  root.querySelector('[data-action="clear"]')?.addEventListener("click", async () => {
    const confirmed = await confirmDialog({
      title: "¿Vaciar el carrito?",
      message: "Se quitarán todos los ítems del pedido actual. Esta acción no se puede deshacer.",
      confirmLabel: "Sí, vaciar",
      danger: true,
    });
    if (!confirmed) return;
    await clearCart(ctx);
    if (ctx.isCurrent()) renderCart(root, ctx);
  });

  const changeQty = async (itemId, delta) => {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    const next = (item.cantidad || 1) + delta;
    if (next < 1) {
      await removeLine(itemId);
      return;
    }
    try {
      const cartNext = await api.updateQuantity({ itemId, quantity: next });
      ctx.updateCart(cartNext);
      ctx.setOnline(true);
      if (ctx.isCurrent()) renderCart(root, ctx);
    } catch (error) {
      apiFailure(error, ctx);
    }
  };

  const removeLine = async (itemId) => {
    try {
      const cartNext = await api.removeItem(itemId);
      ctx.updateCart(cartNext);
      ctx.setOnline(true);
      toast("Ítem quitado del carrito.", "info");
      if (ctx.isCurrent()) renderCart(root, ctx);
    } catch (error) {
      apiFailure(error, ctx);
    }
  };

  root.querySelectorAll("[data-delta]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.item), Number(btn.dataset.delta)));
  });

  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeLine(Number(btn.dataset.remove)));
  });
}

async function clearCart(ctx) {
  const items = [...(ctx.state.cart?.items || [])];
  let cart = ctx.state.cart;
  for (const item of items) {
    try {
      cart = await api.removeItem(item.id);
    } catch (error) {
      apiFailure(error, ctx);
      ctx.updateCart(cart);
      return;
    }
  }
  ctx.updateCart(cart);
  toast("Carrito vacío.", "info");
}

/* ============================================================
   Table
   ============================================================ */

function renderTable(root, ctx) {
  let buffer = ctx.state.table ? String(ctx.state.table.numero) : "";
  let error = "";

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Elige tu mesa</h1>
          <p class="view__sub">Escribe el número que aparece en tu mesa. La API verifica que exista y esté habilitada.</p>
        </div>
      </div>
      <div class="table-card glass">
        <div class="table-display" aria-live="polite">
          <span>Mesa</span><b data-table-value>${buffer || "—"}</b>
        </div>
        <div class="keypad" role="group" aria-label="Teclado numérico de mesa">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
            .map(
              (number) =>
                `<button class="key" type="button" data-key="${number}" aria-label="Mesa ${number}">${number}</button>`
            )
            .join("")}
          <button class="key key--fn" type="button" data-key="clear" aria-label="Borrar número">${icon(
            "x",
            20
          )}</button>
          <button class="key" type="button" data-key="0" aria-label="Mesa 0">0</button>
          <button class="key key--fn" type="button" data-key="back" aria-label="Borrar último dígito">${icon(
            "arrowLeft",
            20
          )}</button>
        </div>
        <p class="field__error" data-table-error ${error ? "" : "hidden"}>${esc(error)}</p>
        <button class="btn btn--primary btn--wide" type="button" data-action="confirm-table" ${
          buffer ? "" : "disabled"
        }>
          ${icon("check", 20)} Confirmar mesa
        </button>
        ${
          ctx.state.cart?.items?.length
            ? `<button class="btn btn--ghost btn--wide" type="button" data-action="skip">${icon(
                "cart",
                18
              )} Revisar el carrito</button>`
            : ""
        }
      </div>
    </div>
  `;

  const valueEl = root.querySelector("[data-table-value]");
  const errorEl = root.querySelector("[data-table-error]");
  const confirmBtn = root.querySelector('[data-action="confirm-table"]');

  const paint = () => {
    if (valueEl) valueEl.textContent = buffer || "—";
    if (confirmBtn) confirmBtn.disabled = !buffer;
    if (errorEl) {
      errorEl.hidden = !error;
      errorEl.textContent = error;
    }
  };

  root.querySelectorAll("[data-key]").forEach((key) => {
    key.addEventListener("click", () => {
      const value = key.dataset.key;
      error = "";
      if (value === "clear") buffer = "";
      else if (value === "back") buffer = buffer.slice(0, -1);
      else if (buffer.length < 3) buffer += value;
      paint();
    });
  });

  confirmBtn?.addEventListener("click", async () => {
    const number = Number(buffer);
    if (!number) {
      error = "Escribe un número de mesa válido.";
      paint();
      return;
    }
    confirmBtn.disabled = true;
    try {
      const mesa = await api.setTable(number);
      ctx.setOnline(true);
      ctx.state.table = mesa;
      try {
        sessionStorage.setItem("restsmart.table", JSON.stringify(mesa));
      } catch {}
      toast(`Mesa ${mesa.numero} confirmada.`);
      ctx.navigate({ mode: "cliente", view: "resumen" });
    } catch (err) {
      if (err instanceof ApiError && err.offline) {
        ctx.setOnline(false);
        root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
        return;
      }
      error = err instanceof ApiError ? err.message : "No se pudo confirmar la mesa.";
      confirmBtn.disabled = false;
      paint();
    }
  });

  root.querySelector('[data-action="skip"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "carrito" });
  });
}

/* ============================================================
   Summary
   ============================================================ */

async function renderSummary(root, ctx) {
  root.innerHTML = `<div class="view is-entering"><div class="skeleton skeleton--card"></div></div>`;
  let cart;
  try {
    cart = await api.summary();
    ctx.updateCart(cart);
    ctx.setOnline(true);
  } catch (error) {
    if (!ctx.isCurrent()) return;
    if (error instanceof ApiError && error.offline) {
      ctx.setOnline(false);
      root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
    } else {
      apiFailure(error, ctx);
    }
    return;
  }
  if (!ctx.isCurrent()) return;

  const items = cart?.items || [];
  if (!items.length) {
    root.innerHTML = `
      <div class="view is-entering">
        <div class="view__head">
          <div class="view__head-main"><h1>Resumen</h1></div>
        </div>
        ${emptyState({
          iconName: "receipt",
          title: "No hay nada que resumir",
          text: "Tu carrito está vacío. Agrega un plato y vuelve a este paso.",
          action: `<button class="btn btn--primary" type="button" data-action="go-menu">${icon(
            "menu",
            19
          )} Ver el menú</button>`,
        })}
      </div>
    `;
    root.querySelector('[data-action="go-menu"]')?.addEventListener("click", () => {
      ctx.navigate({ mode: "cliente", view: "menu" });
    });
    return;
  }

  const table = ctx.state.table;

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Resumen</h1>
          <p class="view__sub">Revisa tu pedido antes de continuar al pago.</p>
        </div>
        <div class="view__tools">
          <span class="pill ${table ? "pill--mango" : "pill--chili"}">${icon(
            "table",
            15
          )}${table ? `Mesa ${table.numero}` : "Mesa sin elegir"}</span>
        </div>
      </div>
      <div class="summary-layout">
        <section class="receipt glass">
          <div class="receipt__head">
            <div>
              <h2>Pedido del kiosco</h2>
              <p class="tiny muted">${items.length} líneas · ${cartCount(cart)} ítems</p>
            </div>
            <span class="pill">${icon("history", 15)}API en vivo</span>
          </div>
          ${items
            .map(
              (item) => `
              <div class="receipt__line">
                <span>${esc(item.producto?.nombre || "Producto")}<br><small class="tiny muted">${esc(
                  optionsText(item)
                )}</small></span>
                <span class="receipt__qty">× ${item.cantidad}</span>
                <span class="receipt__amount">${money(item.subtotal)}</span>
              </div>`
            )
            .join("")}
          <div class="receipt__totals">
            <div class="cart-summary__row"><span>Subtotal</span><strong class="num">${money(
              cart.total
            )}</strong></div>
            <div class="cart-summary__total">
              <span>Total</span>
              <span class="price price--lg">${moneyHtml(cart.total)}</span>
            </div>
          </div>
        </section>
        <aside class="summary-actions glass">
          <div class="summary-actions__total">
            <span>Listo para pagar</span>
            <span class="price price--lg">${moneyHtml(cart.total)}</span>
          </div>
          ${
            table
              ? ""
              : `<div class="notice">${icon("info", 19)}<span>Elige tu mesa para continuar al pago.</span></div>`
          }
          <button class="btn btn--primary btn--wide" type="button" data-action="pay" ${
            table ? "" : "disabled"
          }>
            ${icon("card", 20)} Ir a pago
          </button>
          <button class="btn btn--ghost btn--wide" type="button" data-action="table">
            ${icon("table", 18)} ${table ? "Cambiar mesa" : "Elegir mesa"}
          </button>
          <button class="btn btn--ghost btn--wide" type="button" data-action="cart">
            ${icon("arrowLeft", 18)} Volver al carrito
          </button>
          <button class="link-danger" type="button" data-action="clear">
            ${icon("trash", 16)} Vaciar pedido
          </button>
        </aside>
      </div>
    </div>
  `;

  root.querySelector('[data-action="pay"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "pago" });
  });
  root.querySelector('[data-action="table"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "mesa" });
  });
  root.querySelector('[data-action="cart"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "carrito" });
  });
  root.querySelector('[data-action="clear"]')?.addEventListener("click", async () => {
    const confirmed = await confirmDialog({
      title: "¿Vaciar el pedido?",
      message: "Se quitarán todos los ítems del carrito del kiosco. Esta acción no se puede deshacer.",
      confirmLabel: "Sí, vaciar",
      danger: true,
    });
    if (!confirmed) return;
    await clearCart(ctx);
    if (ctx.isCurrent()) ctx.navigate({ mode: "cliente", view: "menu" });
  });
}

/* ============================================================
   Payment (simulated locally — RF-09 / RF-10)
   ============================================================ */

const PAY_DELAY_MS = 1100;

function contactError(name, medium, value) {
  if (name.trim().length < 2) return "Escribe tu nombre para continuar.";
  if (medium === "Teléfono") {
    if (value.replace(/\D/g, "").length < 7) {
      return "Escribe un teléfono válido (mínimo 7 dígitos).";
    }
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
    return "Escribe un correo válido.";
  }
  return "";
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function renderPayment(root, ctx) {
  if (!ctx.state.cart) {
    root.innerHTML = `<div class="view is-entering"><div class="skeleton skeleton--card"></div></div>`;
    try {
      await ctx.refreshCart();
    } catch (error) {
      if (!ctx.isCurrent()) return;
      if (error instanceof ApiError && error.offline) {
        ctx.setOnline(false);
        root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
      } else {
        root.innerHTML = `<div class="view is-entering"><div class="notice notice--danger">${icon(
          "alert",
          19
        )}<span>${esc(
          error instanceof ApiError ? error.message : "No se pudo cargar el pedido."
        )}</span></div></div>`;
      }
      return;
    }
  }
  if (!ctx.isCurrent()) return;

  const cart = ctx.state.cart;
  if (!cart || !(cart.items || []).length) {
    root.innerHTML = `
      <div class="view is-entering">
        <div class="view__head">
          <div class="view__head-main"><h1>Pago</h1></div>
        </div>
        ${emptyState({
          iconName: "card",
          title: "No hay un pedido para pagar",
          text: "Agrega productos al carrito y elige una mesa antes de llegar al pago.",
          action: `<button class="btn btn--primary" type="button" data-action="go-menu">${icon(
            "menu",
            19
          )} Ver el menú</button>`,
        })}
      </div>
    `;
    root.querySelector('[data-action="go-menu"]')?.addEventListener("click", () => {
      ctx.navigate({ mode: "cliente", view: "menu" });
    });
    return;
  }

  const table = ctx.state.table;

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Pago</h1>
          <p class="view__sub">Confirma tus datos de contacto y valida el pedido. El pago se simula en esta pantalla.</p>
        </div>
        <div class="view__tools">
          <span class="pill">${icon("table", 15)}Mesa ${
            table ? table.numero : "sin elegir"
          }</span>
        </div>
      </div>
      <div class="pay-layout">
        <section class="pay-card glass">
          <div class="pay-card__head">
            <span class="lock-badge">${icon("shield", 22)}</span>
            <div>
              <h2>Datos de contacto</h2>
              <p class="tiny muted">RF-09 · nombre y un medio de contacto antes de pagar.</p>
            </div>
          </div>
          <form class="form-grid" id="pay-form" novalidate>
            <div class="field field--full">
              <label for="pay-name">Nombre</label>
              <input id="pay-name" type="text" placeholder="Tu nombre" autocomplete="name"
                aria-describedby="pay-error" />
            </div>
            <div class="field">
              <label for="pay-medium">Medio de contacto</label>
              <select id="pay-medium">
                <option>Teléfono</option>
                <option>Correo</option>
              </select>
            </div>
            <div class="field">
              <label for="pay-value">Teléfono o correo</label>
              <input id="pay-value" type="text" placeholder="Número o correo"
                aria-describedby="pay-error" />
            </div>
            <p class="field__error field--full" id="pay-error" role="alert"></p>
          </form>
          <div class="notice notice--demo">
            ${icon("info", 19)}
            <span><strong>Pago simulado.</strong> La confirmación ocurre en esta pantalla: el pedido no se envía al backend ni a cocina, y queda marcado como demostración.</span>
          </div>
        </section>
        <aside class="pay-total glass">
          <div class="summary-actions__total">
            <span>Total a pagar</span>
            <span class="price price--lg">${moneyHtml(cart.total)}</span>
          </div>
          <div class="view__tools">
            <span class="pill">${icon("bag", 15)}${cartCount(cart)} ítems</span>
            <span class="pill ${table ? "" : "pill--chili"}">${icon("table", 15)}Mesa ${
              table ? table.numero : "sin elegir"
            }</span>
          </div>
          ${
            table
              ? ""
              : `<div class="notice">${icon("info", 19)}<span>Elige tu mesa antes de pagar: el pedido se registra contra una mesa del kiosco.</span></div>`
          }
          <button class="btn btn--primary btn--wide" type="submit" form="pay-form" data-action="pay" ${
            table ? "" : "disabled"
          }>
            ${icon("card", 20)} <span data-pay-label>Pagar ${money(cart.total)}</span>
          </button>
          <button class="btn btn--ghost btn--wide" type="button" data-action="back">
            ${icon("arrowLeft", 18)} Volver al resumen
          </button>
          <p class="tiny muted">RF-10 · el comprobante se genera en pantalla al confirmar.</p>
        </aside>
      </div>
    </div>
  `;

  const form = root.querySelector("#pay-form");
  const errorEl = root.querySelector("#pay-error");
  const payBtn = root.querySelector('[data-action="pay"]');
  const payLabel = root.querySelector("[data-pay-label]");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ctx.state.table) {
      if (errorEl) errorEl.textContent = "Elige tu mesa antes de pagar.";
      return;
    }
    const name = root.querySelector("#pay-name")?.value || "";
    const medium = root.querySelector("#pay-medium")?.value || "Teléfono";
    const value = root.querySelector("#pay-value")?.value || "";

    const invalid = contactError(name, medium, value);
    if (invalid) {
      if (errorEl) errorEl.textContent = invalid;
      if (name.trim().length < 2) root.querySelector("#pay-name")?.focus();
      else root.querySelector("#pay-value")?.focus();
      return;
    }
    if (errorEl) errorEl.textContent = "";

    form.querySelectorAll("input, select").forEach((field) => {
      field.disabled = true;
    });
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.classList.add("is-loading");
    }
    if (payLabel) payLabel.textContent = "Procesando…";

    await new Promise((resolve) => window.setTimeout(resolve, PAY_DELAY_MS));

    const order = createDemoOrder({
      cart: ctx.state.cart,
      table: ctx.state.table,
      contact: { nombre: name.trim(), medio: medium, valor: value.trim() },
    });

    try {
      await clearCart(ctx);
    } catch {
      /* clearCart ya notifica el error; el comprobante no depende de ello */
    }

    if (!ctx.isCurrent()) return;
    toast(`Pedido #${order.numero} confirmado (pago simulado).`, "success");
    ctx.navigate({ mode: "cliente", view: "comprobante" });
  });

  root.querySelector('[data-action="back"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "resumen" });
  });
}

/* ============================================================
   Receipt (simulated payment — RF-10)
   ============================================================ */

function renderReceipt(root, ctx) {
  const order = loadDemoOrder();

  if (!order) {
    root.innerHTML = `
      <div class="view is-entering">
        <div class="view__head">
          <div class="view__head-main"><h1>Comprobante</h1></div>
        </div>
        ${emptyState({
          iconName: "receipt",
          title: "Sin comprobante todavía",
          text: "El comprobante se genera en pantalla cuando confirmas el pago (simulado en esta versión).",
          action: `<button class="btn btn--primary" type="button" data-action="go-menu">${icon(
            "menu",
            19
          )} Ver el menú</button>`,
        })}
      </div>
    `;
    root.querySelector('[data-action="go-menu"]')?.addEventListener("click", () => {
      ctx.navigate({ mode: "cliente", view: "menu" });
    });
    return;
  }

  const info = estadoInfo(order.estado);
  const count = (order.items || []).reduce((sum, item) => sum + (item.cantidad || 0), 0);
  const contacto = order.contacto || {};

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Comprobante</h1>
          <p class="view__sub">Pedido #${order.numero} · ${esc(formatWhen(order.creado))}</p>
        </div>
        <div class="view__tools">
          <span class="pill pill--mango">${icon("info", 15)}Pago simulado</span>
          <span class="pill">${icon("table", 15)}Mesa ${
            order.mesa != null ? order.mesa : "sin elegir"
          }</span>
        </div>
      </div>
      <div class="summary-layout">
        <section class="receipt glass">
          <div class="receipt__head">
            <div>
              <h2>Pedido #${order.numero}</h2>
              <p class="tiny muted">${order.lineas} líneas · ${count} ítems</p>
            </div>
            <span class="pill pill--mango">${icon("check", 15)}${esc(info.label)}</span>
          </div>
          ${(order.items || [])
            .map(
              (item) => `
              <div class="receipt__line">
                <span>${esc(item.nombre)}${
                  item.opciones?.length
                    ? `<br><small class="tiny muted">${esc(item.opciones.join(" · "))}</small>`
                    : ""
                }</span>
                <span class="receipt__qty">× ${item.cantidad}</span>
                <span class="receipt__amount">${money(item.subtotal)}</span>
              </div>`
            )
            .join("")}
          <div class="receipt__totals">
            <div class="cart-summary__row"><span>Subtotal</span><strong class="num">${money(
              order.total
            )}</strong></div>
            <div class="cart-summary__total">
              <span>Total pagado</span>
              <span class="price price--lg">${moneyHtml(order.total)}</span>
            </div>
          </div>
          <div class="notice notice--demo">
            ${icon("info", 19)}
            <span><strong>Demostración.</strong> Este pedido no fue enviado al backend ni a cocina: no aparecerá en los tableros de preparación.</span>
          </div>
        </section>
        <aside class="summary-actions glass">
          <div class="summary-actions__total">
            <span>Estado</span>
            <span class="price price--lg">${esc(info.label)}</span>
          </div>
          <div class="view__tools">
            <span class="pill">${icon("user", 15)}${esc(contacto.nombre || "Cliente")}</span>
            <span class="pill">${icon(
              contacto.medio === "Correo" ? "mail" : "phone",
              15
            )}${esc(contacto.valor || "")}</span>
          </div>
          <button class="btn btn--primary btn--wide" type="button" data-action="track">
            ${icon("track", 20)} Ver seguimiento
          </button>
          <button class="btn btn--ghost btn--wide" type="button" data-action="menu">
            ${icon("menu", 18)} Volver al menú
          </button>
          <button class="link-danger" type="button" data-action="new">
            ${icon("refresh", 16)} Empezar un pedido nuevo
          </button>
        </aside>
      </div>
    </div>
  `;

  root.querySelector('[data-action="track"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "seguimiento" });
  });
  root.querySelector('[data-action="menu"]')?.addEventListener("click", () => {
    ctx.navigate({ mode: "cliente", view: "menu" });
  });
  root.querySelector('[data-action="new"]')?.addEventListener("click", async () => {
    const confirmed = await confirmDialog({
      title: "¿Empezar un pedido nuevo?",
      message: "Se descartará el comprobante y el seguimiento de demostración de esta pantalla.",
      confirmLabel: "Sí, empezar de nuevo",
      danger: true,
    });
    if (!confirmed) return;
    clearDemoOrder();
    if (ctx.isCurrent()) ctx.navigate({ mode: "cliente", view: "menu" });
  });
}

/* ============================================================
   Tracking
   ============================================================ */

function renderTracking(root, ctx) {
  let current = null;
  let notice = false;
  let error = "";
  let polling = null;
  let demoOrder = loadDemoOrder();
  let showingDemo = Boolean(demoOrder);

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Seguimiento</h1>
          <p class="view__sub">Consulta el estado de tu pedido por su número. La cocina avanza las tareas por sector.</p>
        </div>
      </div>
      <form class="track-search" data-track-form>
        <div class="field">
          <label for="track-number">Número de pedido</label>
          <input id="track-number" name="number" inputmode="numeric" autocomplete="off"
            placeholder="Ej. 1" aria-describedby="track-hint" />
        </div>
        <button class="btn btn--primary" type="submit">${icon("search", 19)} Consultar</button>
      </form>
      <p class="field__hint" id="track-hint">El número aparece en el comprobante del pedido.</p>
      <div data-track-result></div>
    </div>
  `;

  const result = root.querySelector("[data-track-result]");
  const input = root.querySelector("#track-number");
  if (demoOrder && input) input.value = String(demoOrder.numero);

  const stopPolling = () => {
    if (polling) {
      window.clearInterval(polling);
      polling = null;
    }
  };
  ctx.registerCleanup(stopPolling);

  const timelineHtml = (step) => {
    const steps = ["Pagado", "En preparación", "Listo", "Entregado"];
    return `<div class="timeline">
      ${steps
        .map((label, index) => {
          const cls = index < step ? "is-done" : index === step ? "is-current" : "";
          return `<div class="tl ${cls}">
            <div class="track-step"><div class="tl__track"><span class="tl__fill"></span><span class="tl__dot"></span></div></div>
            <span class="tl__label">${label}</span>
          </div>`;
        })
        .join("")}
    </div>`;
  };

  const paintDemo = () => {
    if (!result || !demoOrder) return;
    const info = estadoInfo(demoOrder.estado);
    const isReady = demoOrder.estado === "Listo";
    const isDone = demoOrder.estado === "Entregado";

    result.innerHTML = `
      <article class="track-card glass">
        <div class="track-state">
          <div>
            <p class="tiny muted">Pedido #${demoOrder.numero} · demostración</p>
            <p class="track-state__label">${esc(info.label)}</p>
          </div>
          <div class="track-meta">
            <span class="pill pill--mango">${icon("info", 15)}Simulado</span>
            <span class="pill">${icon("clock", 15)}${esc(formatWhen(demoOrder.creado))}</span>
            <button class="icon-btn" type="button" data-action="refresh-demo" aria-label="Actualizar estado demo">
              ${icon("refresh", 19)}
            </button>
          </div>
        </div>
        ${
          isReady
            ? `<div class="track-ready">
                <span class="track-ready__icon">${icon("check", 22)}</span>
                <div><strong>Tu pedido está listo</strong><span>Acércate al punto de entrega con tu número de pedido.</span></div>
              </div>`
            : ""
        }
        ${timelineHtml(info.step)}
        <div class="notice notice--demo">
          ${icon("info", 19)}
          <span><strong>Solo demostración.</strong> Este pedido no existe en el backend ni en cocina: el avance lo controlas con el botón de abajo.</span>
        </div>
        <div class="demo-controls">
          ${
            isDone
              ? `<button class="btn btn--ghost" type="button" data-action="new-demo">${icon(
                  "refresh",
                  18
                )} Empezar un pedido nuevo</button>`
              : `<button class="btn btn--primary" type="button" data-action="advance-demo">${icon(
                  "arrowRight",
                  18
                )} Simular avance</button>
              <button class="btn btn--ghost" type="button" data-action="new-demo">${icon(
                "trash",
                18
              )} Descartar pedido demo</button>`
          }
        </div>
        <p class="tiny muted">Estado local (demostración). Los pedidos reales se consultan con su número desde el buscador.</p>
      </article>
    `;

    result.querySelector('[data-action="advance-demo"]')?.addEventListener("click", () => {
      demoOrder = advanceDemoOrder(demoOrder);
      paintDemo();
      toast("Estado de demostración actualizado.", "info");
    });
    result.querySelector('[data-action="refresh-demo"]')?.addEventListener("click", () => {
      demoOrder = loadDemoOrder();
      if (demoOrder) paintDemo();
      else {
        showingDemo = false;
        paint();
      }
    });
    result.querySelector('[data-action="new-demo"]')?.addEventListener("click", async () => {
      const confirmed = await confirmDialog({
        title: "¿Descartar el pedido demo?",
        message: "Se borrará el comprobante y el seguimiento de demostración de esta pantalla.",
        confirmLabel: "Sí, descartar",
        danger: true,
      });
      if (!confirmed) return;
      clearDemoOrder();
      demoOrder = null;
      showingDemo = false;
      if (input) input.value = "";
      paint();
    });
  };

  const paint = () => {
    if (!result) return;
    if (showingDemo && demoOrder) {
      paintDemo();
      return;
    }
    if (error) {
      result.innerHTML = `<div class="notice notice--danger">${icon("alert", 19)}<span>${esc(
        error
      )}</span></div>`;
      return;
    }
    if (!current) {
      result.innerHTML = `
        <div class="empty" style="min-height: 240px">
          <div class="empty__art">${icon("track", 44)}</div>
          <div>
            <h2 class="empty__title">Sin pedido cargado</h2>
            <p class="empty__text">Consulta un número para ver la línea de tiempo del pedido.</p>
          </div>
        </div>`;
      return;
    }

    const info = estadoInfo(current.estado);
    const canceled = current.estado === "Cancelado";

    result.innerHTML = `
      <article class="track-card glass">
        <div class="track-state">
          <div>
            <p class="tiny muted">Pedido consultado</p>
            <p class="track-state__label">${esc(info.label)}</p>
          </div>
          <div class="track-meta">
            <span class="pill">${icon("clock", 15)}${esc(current.updated)}</span>
            <button class="icon-btn" type="button" data-action="refresh" aria-label="Actualizar estado">
              ${icon("refresh", 19)}
            </button>
          </div>
        </div>
        ${
          notice
            ? `<div class="track-ready">
                <span class="track-ready__icon">${icon("check", 22)}</span>
                <div><strong>Tu pedido está listo</strong><span>Acércate al punto de entrega con tu número de pedido.</span></div>
              </div>`
            : ""
        }
        ${
          canceled
            ? `<div class="notice notice--danger">${icon("alert", 19)}<span>Este pedido fue cancelado antes del pago.</span></div>`
            : timelineHtml(info.step)
        }
        <p class="tiny muted">El estado se calcula con el avance de las tareas de cocina. Se actualiza automáticamente cada 12 segundos.</p>
      </article>
    `;

    result.querySelector('[data-action="refresh"]')?.addEventListener("click", () => load());
  };

  const load = async (silent = false) => {
    const number = Number(input?.value || 0);
    if (!number) {
      error = "Escribe un número de pedido válido.";
      paint();
      return;
    }
    error = "";
    if (!silent) {
      result.innerHTML = `<div class="skeleton skeleton--card" style="min-height: 260px"></div>`;
    }
    try {
      const [estado, aviso] = await Promise.all([
        api.orderStatus(number),
        api.orderNotice(number).catch(() => false),
      ]);
      current = { estado, updated: "actualizado ahora" };
      notice = Boolean(aviso);
      ctx.setOnline(true);
      paint();
    } catch (err) {
      if (err instanceof ApiError && err.offline) {
        ctx.setOnline(false);
        result.innerHTML = offlinePanel();
        result.querySelector('[data-action="retry"]')?.addEventListener("click", () => load());
        return;
      }
      current = null;
      notice = false;
      error = err instanceof ApiError ? err.message : "No se pudo consultar el pedido.";
      paint();
    }
  };

  root.querySelector("[data-track-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    stopPolling();
    const number = Number(input?.value || 0);
    if (demoOrder && number === Number(demoOrder.numero)) {
      showingDemo = true;
      error = "";
      paint();
      return;
    }
    showingDemo = false;
    load().then(() => {
      if (!showingDemo) polling = window.setInterval(() => load(true), 12000);
    });
  });

  paint();
}

export const cliente = { renderCliente };
