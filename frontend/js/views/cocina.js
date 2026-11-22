import { api, ApiError } from "../api.js";
import { icon } from "../icons.js";
import { ui, SECTORS } from "../ui.js";

const { escapeHtml: esc, toast, openSheet, emptyState, offlinePanel, sectorLabel, orderLabel, elapsed } =
  ui;

export function renderCocina(root, ctx) {
  if (ctx.state.view === "historial") return renderHistory(root, ctx);
  return renderBoard(root, ctx);
}

function taskItems(task) {
  const items = task.items || [];
  if (!items.length) return `<p class="tiny muted">Sin ítems registrados.</p>`;
  return `<div class="task__items">
    ${items
      .map(
        (item) => `
        <div class="task__item">
          <span class="task__qty">${item.cantidad ?? 1}</span>
          <span class="task__name">${esc(item.producto?.nombre || "Producto")}</span>
        </div>`
      )
      .join("")}
  </div>`;
}

function taskCard(task, index) {
  const sector = task.sector;
  const pedido = task.pedido;
  const table = pedido?.mesa?.numero;
  return `
    <article class="task glass reveal" style="--i: ${index}" data-task="${task.id}">
      <div class="task__head">
        <div>
          <p class="task__num">${esc(orderLabel(task))}</p>
          <p class="task__time">${table ? `Mesa ${table} · ` : ""}${esc(
            elapsed(task.fechaHoraCreacion) || "Sin hora"
          )}</p>
        </div>
        <span class="pill pill--ember">${icon("flame", 15)}Pendiente</span>
      </div>
      ${taskItems(task)}
      ${
        task.indicaciones
          ? `<div class="task__ind">${icon("info", 15)} ${esc(task.indicaciones)}</div>`
          : ""
      }
      <div class="task__foot">
        <span class="pill">${icon(ui.sectorIcon(sector), 15)}${esc(sectorLabel(sector))}</span>
        <div class="view__tools" style="gap: 6px">
          <button class="icon-btn" type="button" data-detail aria-label="Ver detalle de ${esc(
            orderLabel(task)
          )}">${icon("receipt", 18)}</button>
          <button class="btn btn--mint" type="button" data-complete="${task.id}">
            ${icon("check", 18)} Marcar lista
          </button>
        </div>
      </div>
    </article>`;
}

async function renderBoard(root, ctx) {
  const sector = ctx.state.sector;
  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>${esc(sectorLabel(sector))}</h1>
          <p class="view__sub">Sector activo: <strong>${esc(
            sectorLabel(sector)
          )}</strong> · tareas que la API asignó a este sector.</p>
        </div>
        <div class="view__tools">
          <select class="sector-select" data-sector-select aria-label="Sector de cocina activo">
            ${SECTORS.map(
              (entry) =>
                `<option value="${entry}" ${
                  entry === sector ? "selected" : ""
                }>${esc(sectorLabel(entry))}</option>`
            ).join("")}
          </select>
          <span class="pill" data-count>${icon("clock", 15)}Cargando…</span>
          <button class="icon-btn" type="button" data-action="refresh" aria-label="Actualizar tareas">
            ${icon("refresh", 20)}
          </button>
          <button class="btn btn--ghost" type="button" data-action="auto" aria-pressed="true">
            ${icon("wifi", 18)} <span data-auto-label>En vivo</span>
          </button>
        </div>
      </div>
      <div data-board>
        <div class="kboard">
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
        </div>
      </div>
    </div>
  `;

  const board = root.querySelector("[data-board]");
  const countPill = root.querySelector("[data-count]");
  const autoBtn = root.querySelector('[data-action="auto"]');
  let auto = true;
  let timer = null;
  let loading = false;

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };
  ctx.registerCleanup(stop);

  const paint = (tasks) => {
    if (!ctx.isCurrent()) return;
    if (countPill) {
      countPill.innerHTML = `${icon("clock", 15)}${
        tasks.length ? `${tasks.length} pendientes` : "Sin pendientes"
      }`;
    }
    if (!tasks.length) {
      board.innerHTML = emptyState({
        iconName: "flame",
        title: "Sin tareas pendientes",
        text: `No hay pedidos esperando en ${sectorLabel(sector)}. Las tareas aparecen cuando un pago confirmado enruta el pedido.`,
        action: `<button class="btn btn--primary" type="button" data-action="reload">${icon(
          "refresh",
          19
        )} Actualizar</button>`,
      });
      board.querySelector('[data-action="reload"]')?.addEventListener("click", () => load());
      return;
    }
    board.innerHTML = `<div class="kboard">${tasks.map(taskCard).join("")}</div>`;
    board.querySelectorAll("[data-task]").forEach((card) => {
      const task = tasks.find((entry) => String(entry.id) === card.dataset.task);
      if (!task) return;
      card.querySelector("[data-complete]")?.addEventListener("click", (event) => {
        complete(task, card, event.currentTarget);
      });
      card.querySelector("[data-detail]")?.addEventListener("click", () => openTask(task));
      card.querySelector(".task__num")?.addEventListener("click", () => openTask(task));
    });
  };

  const load = async ({ silent = false } = {}) => {
    if (loading) return;
    loading = true;
    if (!silent) {
      board.innerHTML = `<div class="kboard">
        <div class="skeleton skeleton--card"></div>
        <div class="skeleton skeleton--card"></div>
      </div>`;
    }
    try {
      const tasks = await api.kitchenTasks(sector);
      ctx.setOnline(true);
      paint(tasks || []);
    } catch (error) {
      if (!ctx.isCurrent()) return;
      if (error instanceof ApiError && error.offline) {
        ctx.setOnline(false);
        board.innerHTML = offlinePanel();
        board.querySelector('[data-action="retry"]')?.addEventListener("click", () => load());
      } else {
        toast(error instanceof ApiError ? error.message : "No se pudieron cargar las tareas.", "error");
        board.innerHTML = `<div class="notice notice--danger">${icon("alert", 19)}<span>${esc(
          error instanceof ApiError ? error.message : "Error inesperado."
        )}</span></div>`;
      }
    } finally {
      loading = false;
    }
  };

  const complete = async (task, card, button) => {
    button.disabled = true;
    card.classList.add("is-completed");
    try {
      await api.completeTask(task.id);
      ctx.setOnline(true);
      toast(`${orderLabel(task)} marcado como listo.`);
      await load({ silent: true });
    } catch (error) {
      card.classList.remove("is-completed");
      button.disabled = false;
      if (error instanceof ApiError && error.offline) {
        ctx.setOnline(false);
        board.innerHTML = offlinePanel();
        board.querySelector('[data-action="retry"]')?.addEventListener("click", () => load());
        return;
      }
      toast(error instanceof ApiError ? error.message : "No se pudo completar la tarea.", "error");
    }
  };

  const openTask = (task) => {
    openSheet({
      title: orderLabel(task),
      sub: `${sectorLabel(task.sector)}${task.pedido?.mesa?.numero ? ` · Mesa ${task.pedido.mesa.numero}` : ""}`,
      body: `
        <div class="view__tools">
          <span class="pill pill--ember">${icon("clock", 15)}${esc(
            elapsed(task.fechaHoraCreacion) || "Sin hora"
          )}</span>
          <span class="pill">${icon("receipt", 15)}${esc(orderLabel(task))}</span>
        </div>
        ${taskItems(task)}
        ${
          task.indicaciones
            ? `<div class="notice">${icon("info", 19)}<span>${esc(task.indicaciones)}</span></div>`
            : ""
        }
        <p class="tiny muted">Tarea #${task.id} · estado ${esc(task.estado || "Pendiente")}${
          task.fechaHoraCompletada ? ` · completada ${esc(elapsed(task.fechaHoraCompletada))}` : ""
        }</p>
      `,
      foot: `<button class="btn btn--ghost btn--wide" type="button" data-close>${icon(
        "arrowLeft",
        18
      )} Cerrar detalle</button>`,
    });
  };

  autoBtn?.addEventListener("click", () => {
    auto = !auto;
    autoBtn.setAttribute("aria-pressed", String(auto));
    autoBtn.querySelector("[data-auto-label]").textContent = auto ? "En vivo" : "Manual";
    stop();
    if (auto) timer = window.setInterval(() => load({ silent: true }), 20000);
  });

  root.querySelector('[data-action="refresh"]')?.addEventListener("click", () => load());

  root.querySelector("[data-sector-select]")?.addEventListener("change", (event) => {
    ctx.navigate({ mode: "cocina", view: "tareas", sector: event.currentTarget.value });
  });

  load();
  timer = window.setInterval(() => load({ silent: true }), 20000);
}

async function renderHistory(root, ctx) {
  const sector = ctx.state.sector;
  root.innerHTML = `
    <div class="view is-entering">
      <div class="view__head">
        <div class="view__head-main">
          <h1>Historial · ${esc(sectorLabel(sector))}</h1>
          <p class="view__sub">Sector activo: <strong>${esc(
            sectorLabel(sector)
          )}</strong> · tareas completadas por este sector en el turno actual.</p>
        </div>
        <div class="view__tools">
          <select class="sector-select" data-sector-select aria-label="Sector de cocina activo">
            ${SECTORS.map(
              (entry) =>
                `<option value="${entry}" ${
                  entry === sector ? "selected" : ""
                }>${esc(sectorLabel(entry))}</option>`
            ).join("")}
          </select>
          <button class="icon-btn" type="button" data-action="refresh" aria-label="Actualizar historial">
            ${icon("refresh", 20)}
          </button>
        </div>
      </div>
      <div data-history>
        <div class="skeleton skeleton--card"></div>
      </div>
    </div>
  `;

  const host = root.querySelector("[data-history]");

  const load = async () => {
    try {
      const tasks = await api.kitchenHistory(sector);
      ctx.setOnline(true);
      if (!ctx.isCurrent()) return;
      if (!tasks?.length) {
        host.innerHTML = emptyState({
          iconName: "history",
          title: "El turno aún no tiene tareas completadas",
          text: "Cuando marques una tarea como lista aparecerá aquí con su tiempo de preparación.",
          action: `<button class="btn btn--ghost" type="button" data-action="back">${icon(
            "arrowLeft",
            18
          )} Volver al tablero</button>`,
        });
        host.querySelector('[data-action="back"]')?.addEventListener("click", () => {
          ctx.navigate({ mode: "cocina", view: "tareas", sector });
        });
        return;
      }
      host.innerHTML = `<div class="history">
        ${tasks
          .map((task) => {
            const minutes =
              task.fechaHoraCreacion && task.fechaHoraCompletada
                ? Math.max(
                    0,
                    Math.round(
                      (new Date(task.fechaHoraCompletada) - new Date(task.fechaHoraCreacion)) / 60000
                    )
                  )
                : null;
            return `<div class="history__row">
              <div>
                <div class="history__title">${esc(orderLabel(task))} · ${
                  (task.items || []).length
                } ${(task.items || []).length === 1 ? "ítem" : "ítems"}</div>
                <div class="history__meta">${esc(
                  (task.items || [])
                    .map((item) => `${item.cantidad}× ${item.producto?.nombre || "Producto"}`)
                    .join(" · ") || "Sin ítems"
                )}</div>
              </div>
              <span class="pill pill--mint">${icon("check", 15)}Completada</span>
              <span class="history__meta">${minutes != null ? `${minutes} min` : "—"}</span>
            </div>`;
          })
          .join("")}
      </div>`;
    } catch (error) {
      if (!ctx.isCurrent()) return;
      if (error instanceof ApiError && error.offline) {
        ctx.setOnline(false);
        host.innerHTML = offlinePanel();
        host.querySelector('[data-action="retry"]')?.addEventListener("click", () => load());
      } else {
        toast(error instanceof ApiError ? error.message : "No se pudo cargar el historial.", "error");
      }
    }
  };

  root.querySelector('[data-action="refresh"]')?.addEventListener("click", () => load());

  root.querySelector("[data-sector-select]")?.addEventListener("change", (event) => {
    ctx.navigate({ mode: "cocina", view: "historial", sector: event.currentTarget.value });
  });

  load();
}

export const cocina = { renderCocina };
