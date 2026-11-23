const API_BASE = "/api";
const DEFAULT_TIMEOUT = 9000;
const READ_TIMEOUT = 45000;
const READ_RETRY_DELAY = 1000;
const CATEGORY_PROBE_LIMIT = 12;

export class ApiError extends Error {
  constructor(message, { status = 0, path = "", payload = null, cause = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.payload = payload;
    this.cause = cause;
    this.offline = status === 0 || status === 502 || status === 503 || status === 504;
  }
}

async function request(path, options = {}) {
  if ((options.method ?? "GET") !== "GET") return requestOnce(path, options);

  const readOptions = { timeout: READ_TIMEOUT, ...options };
  try {
    return await requestOnce(path, readOptions);
  } catch (error) {
    if (!(error instanceof ApiError) || !error.offline) throw error;
    await new Promise((resolve) => window.setTimeout(resolve, READ_RETRY_DELAY));
    return requestOnce(path, readOptions);
  }
}

async function requestOnce(path, { method = "GET", body, query, fallback, timeout = DEFAULT_TIMEOUT } = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);
  const options = {
    method,
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: controller.signal,
  };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;
  let raw;
  try {
    response = await fetch(url, options);
    raw = await response.text();
  } catch (error) {
    throw new ApiError(
      "No se pudo contactar la API. Verifica que el backend y el proxy estén en ejecución.",
      { status: 0, path, cause: error }
    );
  } finally {
    window.clearTimeout(timer);
  }

  let payload = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      if (response.ok) {
        throw new ApiError("La API devolvió una respuesta que no es JSON.", { path });
      }
      payload = raw;
    }
  }

  if (!response.ok) {
    if (payload && typeof payload === "object" && payload.error === "API_OFFLINE") {
      throw new ApiError(payload.message || "No se pudo contactar la API.", {
        status: 0,
        path,
        payload,
      });
    }
    const apiMessage = payload && typeof payload === "object" ? payload.message : null;
    const message =
      apiMessage && apiMessage !== "No message available"
        ? apiMessage
        : fallback || `La API respondió con un error ${response.status}.`;
    throw new ApiError(message, { status: response.status, path, payload });
  }

  return payload;
}

/* ---------- Menú ---------- */

export const menuByCategory = (categoryId) =>
  request(`/menu/categoria/${categoryId}`, {
    fallback: "No se pudo cargar la categoría.",
  });

export const product = (id) =>
  request(`/menu/producto/${id}`, { fallback: "No se pudo cargar el producto." });

export const validateSelection = (id, selection) =>
  request(`/menu/producto/${id}/opciones`, {
    method: "POST",
    body: selection,
    fallback: "La selección de opciones no es válida.",
  });

export const priceOf = (id, selection) =>
  request(`/menu/producto/${id}/precio`, {
    method: "POST",
    body: selection,
    fallback: "No se pudo calcular el precio.",
  });

/* ---------- Pedido ---------- */

export const addItem = ({ productId, quantity, selection }) =>
  request("/pedido/items", {
    method: "POST",
    query: { productoId: productId, cantidad: quantity },
    body: selection || { variante: null, complementos: [] },
    fallback: "No se pudo agregar el producto al carrito.",
  });

export const updateQuantity = ({ itemId, quantity }) =>
  request(`/pedido/items/${itemId}/cantidad`, {
    method: "PUT",
    query: { cantidad: quantity },
    fallback: "No se pudo cambiar la cantidad.",
  });

export const removeItem = (itemId) =>
  request(`/pedido/items/${itemId}`, {
    method: "DELETE",
    fallback: "No se pudo quitar el ítem del carrito.",
  });

export const setTable = (tableNumber) =>
  request("/pedido/mesa", {
    method: "PUT",
    query: { numeroMesa: tableNumber },
    fallback: "No se pudo confirmar la mesa. Verifica que exista y esté habilitada.",
  });

export const summary = () =>
  request("/pedido/resumen", { fallback: "No se pudo cargar el carrito." });

export const listMesas = () =>
  request("/mesas", { fallback: "No se pudo cargar el listado de mesas." });

export const payOrder = ({ nombre, medio, valor }) =>
  request("/pedido/pagar", {
    method: "POST",
    body: {
      nombre,
      medio: /correo/i.test(medio || "") ? "Correo" : "Telefono",
      valor,
    },
    fallback: "No se pudo procesar el pago.",
  });

export const cancelOrder = (orderId) =>
  request(`/pedido/${orderId}`, {
    method: "DELETE",
    fallback: "No se pudo cancelar el pedido.",
  });

/* ---------- Cocina ---------- */

export const kitchenTasks = (sector) =>
  request("/cocina/tareas", {
    query: { sector },
    fallback: "No se pudieron cargar las tareas del sector.",
  });

export const kitchenTask = (taskId) =>
  request(`/cocina/tareas/${taskId}`, { fallback: "No se pudo cargar la tarea." });

export const completeTask = (taskId) =>
  request(`/cocina/tareas/${taskId}/completar`, {
    method: "PUT",
    fallback: "No se pudo marcar la tarea como completada.",
  });

export const kitchenHistory = (sector) =>
  request("/cocina/historial", {
    query: { sector },
    fallback: "No se pudo cargar el historial del turno.",
  });

/* ---------- Seguimiento ---------- */

export const orderStatus = (orderId) =>
  request(`/seguimiento/${orderId}/estado`, {
    fallback: "No se encontró el pedido.",
  });

export const orderNotice = (orderId) =>
  request(`/seguimiento/${orderId}/aviso`, {
    fallback: "No se pudo consultar el aviso del pedido.",
  });

/* ---------- Administración ---------- */

export const createProduct = ({ name, price, categoryId, sector }) =>
  request("/admin/productos", {
    method: "POST",
    query: { nombre: name, precio: price, categoria: categoryId, sector },
    fallback: "No se pudo crear el producto. Revisa los datos y la categoría.",
  });

export const updatePrice = ({ id, price, description }) =>
  request(`/admin/productos/${id}/precio`, {
    method: "PUT",
    query: { precio: price, descripcion: description ?? "" },
    fallback: "No se pudo actualizar el producto.",
  });

export const deactivateProduct = (id) =>
  request(`/admin/productos/${id}`, {
    method: "DELETE",
    fallback: "No se pudo desactivar el producto.",
  });

export const assignSector = ({ id, sector }) =>
  request(`/admin/productos/${id}/sector`, {
    method: "PUT",
    query: { sector },
    fallback: "No se pudo asignar el sector.",
  });

/* ---------- Catálogo descubierto ---------- */

export function deriveCategories(products) {
  const map = new Map();
  for (const item of products) {
    const category = item?.categoria;
    if (!category || category.id == null) continue;
    if (!map.has(category.id)) {
      map.set(category.id, {
        id: category.id,
        nombre: category.nombre || `Categoría ${category.id}`,
        descripcion: category.descripcion || "",
        orden: category.orden ?? category.id,
      });
    }
  }
  return [...map.values()].sort((a, b) => (a.orden ?? a.id) - (b.orden ?? b.id));
}

export async function probeCatalog() {
  const ids = Array.from({ length: CATEGORY_PROBE_LIMIT }, (_, index) => index + 1);
  const results = await Promise.allSettled(ids.map((id) => menuByCategory(id)));

  const fulfilled = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");

  if (fulfilled.length === 0) {
    const first = rejected[0]?.reason;
    throw first instanceof ApiError
      ? first
      : new ApiError("No se pudo cargar el catálogo.", { status: 0, path: "/menu" });
  }

  const byId = new Map();
  for (const result of fulfilled) {
    for (const item of result.value || []) {
      if (item && item.id != null) byId.set(item.id, item);
    }
  }

  const products = [...byId.values()].sort((a, b) => {
    const catA = a.categoria?.id ?? 0;
    const catB = b.categoria?.id ?? 0;
    if (catA !== catB) return catA - catB;
    return String(a.nombre || "").localeCompare(String(b.nombre || ""), "es");
  });

  const categories = deriveCategories(products);
  if (categories.length === 0) {
    for (const item of products) {
      if (item.categoria?.id != null && !categories.some((c) => c.id === item.categoria.id)) {
        categories.push({
          id: item.categoria.id,
          nombre: item.categoria.nombre || `Categoría ${item.categoria.id}`,
          orden: item.categoria.id,
        });
      }
    }
  }

  return { products, categories, failedCategories: rejected.length };
}

export const api = {
  menuByCategory,
  product,
  validateSelection,
  priceOf,
  addItem,
  updateQuantity,
  removeItem,
  setTable,
  summary,
  listMesas,
  payOrder,
  cancelOrder,
  kitchenTasks,
  kitchenTask,
  completeTask,
  kitchenHistory,
  orderStatus,
  orderNotice,
  createProduct,
  updatePrice,
  deactivateProduct,
  assignSector,
  probeCatalog,
};
