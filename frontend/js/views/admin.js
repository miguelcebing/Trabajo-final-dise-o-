import { api, ApiError } from "../api.js";
import { icon } from "../icons.js";
import { ui } from "../ui.js";

const {
  escapeHtml: esc,
  money,
  toast,
  openSheet,
  confirmDialog,
  emptyState,
  offlinePanel,
  sectorLabel,
  sectorIcon,
  sectorTone,
} = ui;

export function renderAdmin(root, ctx) {
  if (ctx.state.view === "nuevo") return renderNewProduct(root, ctx);
  return renderCatalog(root, ctx);
}

function adminMedallion(product) {
  const tone = sectorTone(product?.sector);
  return `<span class="medallion medallion--${tone} medallion--sm" aria-hidden="true">${icon(
    sectorIcon(product?.sector),
    48
  )}</span>`;
}

async function ensureCatalog(ctx) {
  try {
    await ctx.loadCatalog();
    ctx.setOnline(true);
    return true;
  } catch (error) {
    return error;
  }
}

async function renderCatalog(root, ctx) {
  root.innerHTML = `<div class="view is-entering"><div class="skeleton skeleton--card"></div></div>`;
  const loaded = await ensureCatalog(ctx);
  if (!ctx.isCurrent()) return;
  if (loaded !== true) {
    if (loaded instanceof ApiError && loaded.offline) {
      ctx.setOnline(false);
      root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
    } else {
      root.innerHTML = `<div class="view is-entering"><div class="notice notice--danger">${icon(
        "alert",
        19
      )}<span>${esc(
        loaded instanceof ApiError ? loaded.message : "No se pudo cargar el catálogo."
      )}</span></div></div>`;
    }
    return;
  }

  const products = ctx.state.catalog.products || [];
  const categories = ctx.state.catalog.categories || [];

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Administración del menú</h1>
          <p class="view__sub">Catálogo activo según la API: nombre, precio, sector y disponibilidad.</p>
        </div>
        <div class="view__tools">
          <span class="pill">${icon("layers", 15)}${products.length} ${
            products.length === 1 ? "producto" : "productos"
          }</span>
          <button class="icon-btn" type="button" data-action="refresh" aria-label="Recargar catálogo">
            ${icon("refresh", 20)}
          </button>
          <button class="btn btn--primary" type="button" data-action="new">
            ${icon("plus", 19)} Nuevo producto
          </button>
        </div>
      </div>
      <p class="admin-note">${icon("info", 15)}<span>La API solo devuelve productos activos; al desactivar uno, desaparece de esta lista. Tampoco expone un listado de categorías: el formulario usa el ID de una categoría existente.</span></p>
      ${
        products.length
          ? `<div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Categoría</th>
                    <th scope="col" style="text-align: right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${products
                    .map(
                      (product) => `
                      <tr data-row="${product.id}">
                        <td>
                          <div class="data-table__prod">
                            ${adminMedallion(product)}
                            <div style="min-width: 0">
                              <div class="data-table__name">${esc(product.nombre)}</div>
                              <div class="data-table__desc">${esc(
                                product.descripcion || "Sin descripción"
                              )} · ID ${product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td class="num">${money(product.precioBase)}</td>
                        <td>
                          <select class="sector-select" data-sector="${product.id}" aria-label="Sector de ${esc(
                            product.nombre
                          )}">
                            ${["Bebidas", "Parrilla", "CocinaFria", "Postres"]
                              .map(
                                (sector) =>
                                  `<option value="${sector}"${
                                    product.sector === sector ? " selected" : ""
                                  }>${sectorLabel(sector)}</option>`
                              )
                              .join("")}
                          </select>
                        </td>
                        <td>${esc(product.categoria?.nombre || product.categoria?.id || "—")}</td>
                        <td>
                          <div class="row-actions">
                            <button class="icon-btn" type="button" data-edit="${product.id}" aria-label="Editar ${esc(
                              product.nombre
                            )}">${icon("edit", 18)}</button>
                            <button class="icon-btn" type="button" data-deactivate="${product.id}" aria-label="Desactivar ${esc(
                              product.nombre
                            )}">${icon("trash", 18)}</button>
                          </div>
                        </td>
                      </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
          : emptyState({
              iconName: "layers",
              title: "El catálogo está vacío",
              text: "No hay productos activos en las categorías que la API devuelve. Crea uno para verlo en el menú del cliente.",
              action: `<button class="btn btn--primary" type="button" data-action="new">${icon(
                "plus",
                19
              )} Crear producto</button>`,
            })
      }
    </div>
  `;

  root.querySelectorAll('[data-action="new"]').forEach((button) => {
    button.addEventListener("click", () => ctx.navigate({ mode: "admin", view: "nuevo" }));
  });

  root.querySelector('[data-action="refresh"]')?.addEventListener("click", async () => {
    await ctx.loadCatalog(true).catch(() => {});
    if (ctx.isCurrent()) renderCatalog(root, ctx);
  });

  root.querySelectorAll("[data-sector]").forEach((select) => {
    select.addEventListener("change", async () => {
      const id = Number(select.dataset.sector);
      const previous = products.find((product) => product.id === id)?.sector;
      select.disabled = true;
      try {
        await api.assignSector({ id, sector: select.value });
        ctx.setOnline(true);
        toast(`Sector actualizado a ${sectorLabel(select.value)}.`);
        await ctx.loadCatalog(true);
        if (ctx.isCurrent()) renderCatalog(root, ctx);
      } catch (error) {
        select.value = previous || "";
        select.disabled = false;
        if (error instanceof ApiError && error.offline) ctx.setOnline(false);
        toast(error instanceof ApiError ? error.message : "No se pudo asignar el sector.", "error");
      }
    });
  });

  root.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((entry) => entry.id === Number(button.dataset.edit));
      if (product) openEdit(product, ctx, root);
    });
  });

  root.querySelectorAll("[data-deactivate]").forEach((button) => {
    button.addEventListener("click", async () => {
      const product = products.find((entry) => entry.id === Number(button.dataset.deactivate));
      if (!product) return;
      const confirmed = await confirmDialog({
        title: `¿Desactivar ${product.nombre}?`,
        message:
          "El producto dejará de aparecer en el menú del cliente. La API no expone una acción para reactivarlo.",
        confirmLabel: "Desactivar",
        danger: true,
      });
      if (!confirmed) return;
      try {
        await api.deactivateProduct(product.id);
        ctx.setOnline(true);
        toast(`${product.nombre} desactivado. Ya no aparece en el menú.`);
        await ctx.loadCatalog(true);
        if (ctx.isCurrent()) renderCatalog(root, ctx);
      } catch (error) {
        if (error instanceof ApiError && error.offline) ctx.setOnline(false);
        toast(error instanceof ApiError ? error.message : "No se pudo desactivar.", "error");
      }
    });
  });
}

function openEdit(product, ctx, root) {
  openSheet({
    title: product.nombre,
    sub: `ID ${product.id} · ${sectorLabel(product.sector)}`,
    body: `
      <div class="form-grid">
        <div class="field field--full">
          <label for="edit-price">Precio base</label>
          <input id="edit-price" type="number" min="1" step="1" value="${Number(
            product.precioBase
          )}" inputmode="numeric" />
        </div>
        <div class="field field--full">
          <label for="edit-desc">Descripción</label>
          <textarea id="edit-desc" placeholder="Describe el plato para el menú">${esc(
            product.descripcion || ""
          )}</textarea>
        </div>
      </div>
      <p class="field__error" data-edit-error hidden></p>
    `,
    foot: `<button class="btn btn--primary btn--wide" type="button" data-save>${icon(
      "check",
      19
    )} Guardar cambios</button>`,
    onMount(panel, close) {
      const priceInput = panel.querySelector("#edit-price");
      const descInput = panel.querySelector("#edit-desc");
      const errorEl = panel.querySelector("[data-edit-error]");
      const save = panel.querySelector("[data-save]");

      save?.addEventListener("click", async () => {
        const price = Number(priceInput.value);
        const description = descInput.value.trim();
        if (!Number.isFinite(price) || price <= 0) {
          errorEl.hidden = false;
          errorEl.textContent = "El precio debe ser mayor que cero.";
          return;
        }
        errorEl.hidden = true;
        save.disabled = true;
        try {
          await api.updatePrice({ id: product.id, price, description });
          ctx.setOnline(true);
          toast("Producto actualizado.");
          close();
          await ctx.loadCatalog(true);
          if (ctx.isCurrent()) renderCatalog(root, ctx);
        } catch (error) {
          save.disabled = false;
          errorEl.hidden = false;
          errorEl.textContent =
            error instanceof ApiError ? error.message : "No se pudo actualizar el producto.";
          if (error instanceof ApiError && error.offline) ctx.setOnline(false);
        }
      });
    },
  });
}

async function renderNewProduct(root, ctx) {
  const loaded = await ensureCatalog(ctx);
  if (!ctx.isCurrent()) return;
  if (loaded instanceof ApiError && loaded.offline) {
    ctx.setOnline(false);
    root.innerHTML = `<div class="view is-entering">${offlinePanel()}</div>`;
    root.querySelector('[data-action="retry"]')?.addEventListener("click", () => {
      renderNewProduct(root, ctx);
    });
    return;
  }
  if (loaded !== true) {
    toast(loaded?.message || "No se pudo cargar el catálogo.", "error");
  }
  const categories = ctx.state.catalog.categories || [];

  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Nuevo producto</h1>
          <p class="view__sub">Alta en el catálogo de la API. El nombre, el precio, la categoría y el sector son obligatorios.</p>
        </div>
        <div class="view__tools">
          <button class="btn btn--ghost" type="button" data-action="back">${icon(
            "arrowLeft",
            18
          )} Volver al catálogo</button>
        </div>
      </div>
      <form class="new-product glass" data-new-form novalidate>
        <div class="view__tools">
          <span class="medallion medallion--ember medallion--md">${icon("chef", 30)}</span>
          <div>
            <h2>Datos del plato</h2>
            <p class="tiny muted">La imagen no está expuesta por la API en esta versión.</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="field field--full">
            <label for="np-name">Nombre</label>
            <input id="np-name" type="text" placeholder="Ej. Hamburguesa" required />
          </div>
          <div class="field">
            <label for="np-price">Precio base</label>
            <input id="np-price" type="number" min="1" step="1" placeholder="25000" required inputmode="numeric" />
          </div>
          <div class="field">
            <label for="np-category">ID de categoría</label>
            <input id="np-category" type="number" min="1" step="1" placeholder="Ej. 2" required inputmode="numeric"
              list="np-categories" />
            <datalist id="np-categories">
              ${categories
                .map((category) => `<option value="${category.id}">${esc(category.nombre)}</option>`)
                .join("")}
            </datalist>
            <p class="field__hint">La API no expone el listado de categorías. IDs detectados en el menú: ${
              categories.length
                ? categories.map((category) => `${category.id} (${esc(category.nombre)})`).join(", ")
                : "ninguno todavía"
            }.</p>
          </div>
          <div class="field">
            <label for="np-sector">Sector de preparación</label>
            <select id="np-sector" required>
              ${["Bebidas", "Parrilla", "CocinaFria", "Postres"]
                .map((sector) => `<option value="${sector}">${sectorLabel(sector)}</option>`)
                .join("")}
            </select>
          </div>
          <div class="field field--full">
            <label for="np-desc">Descripción (opcional)</label>
            <textarea id="np-desc" placeholder="Se guarda justo después de crear el producto"></textarea>
          </div>
        </div>
        <p class="field__error" data-new-error hidden></p>
        <div class="view__tools">
          <button class="btn btn--primary" type="submit" data-submit>${icon(
            "plus",
            19
          )} Crear producto</button>
          <button class="btn btn--ghost" type="button" data-action="back">Cancelar</button>
        </div>
        <p class="tiny muted">Si la categoría no existe, la API rechazará el alta. Los productos creados aparecen en el menú del cliente cuando quedan activos.</p>
      </form>
    </div>
  `;

  root.querySelectorAll('[data-action="back"]').forEach((button) => {
    button.addEventListener("click", () => ctx.navigate({ mode: "admin", view: "catalogo" }));
  });

  const form = root.querySelector("[data-new-form]");
  const errorEl = root.querySelector("[data-new-error]");
  const submit = root.querySelector("[data-submit]");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.querySelector("#np-name").value.trim();
    const price = Number(form.querySelector("#np-price").value);
    const categoryId = Number(form.querySelector("#np-category").value);
    const sector = form.querySelector("#np-sector").value;
    const description = form.querySelector("#np-desc").value.trim();

    const fail = (message) => {
      errorEl.hidden = false;
      errorEl.textContent = message;
      errorEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };

    if (!name) return fail("Escribe el nombre del producto.");
    if (!Number.isFinite(price) || price <= 0) return fail("El precio debe ser mayor que cero.");
    if (!Number.isFinite(categoryId) || categoryId <= 0)
      return fail("Escribe el ID de una categoría existente.");

    errorEl.hidden = true;
    submit.disabled = true;
    submit.textContent = "Creando…";

    try {
      const created = await api.createProduct({ name, price, categoryId, sector });
      ctx.setOnline(true);
      if (description && created?.id != null) {
        try {
          await api.updatePrice({ id: created.id, price, description });
        } catch (error) {
          toast("Producto creado, pero la descripción no se pudo guardar.", "info");
        }
      }
      toast(`${name} creado.`);
      await ctx.loadCatalog(true);
      ctx.navigate({ mode: "admin", view: "catalogo" });
    } catch (error) {
      submit.disabled = false;
      submit.innerHTML = `${icon("plus", 19)} Crear producto`;
      if (error instanceof ApiError && error.offline) ctx.setOnline(false);
      fail(error instanceof ApiError ? error.message : "No se pudo crear el producto.");
    }
  });
}

export const admin = { renderAdmin };
