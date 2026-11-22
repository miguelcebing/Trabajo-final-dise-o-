/* Comprobante de pago simulado (RF-09 / RF-10).
   El pago pasa por la API (POST /pedido/pagar): el pedido se confirma y enruta
   a cocina desde el backend. Esta pieza conserva en el navegador el comprobante
   y la máquina de estados local usada por la vista de seguimiento. */

const STORAGE_KEY = "restsmart.demoOrder";

const NEXT_STATUS = {
  Pagado: "EnPreparacion",
  EnPreparacion: "Listo",
  Listo: "Entregado",
};

export function loadDemoOrder() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const order = JSON.parse(raw);
    return order && order.numero != null ? order : null;
  } catch {
    return null;
  }
}

export function saveDemoOrder(order) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* almacenamiento no disponible: el pedido sigue vivo en memoria de la vista */
  }
  return order;
}

export function clearDemoOrder() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nada que limpiar */
  }
}

function demoNumber() {
  const pad = (value) => String(value).padStart(2, "0");
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return Number(`${stamp}${time}`.slice(-9));
}

export function createDemoOrder({ cart, table, contact, numero }) {
  const items = (cart?.items || []).map((item) => ({
    nombre: item.producto?.nombre || "Producto",
    cantidad: item.cantidad || 0,
    subtotal: item.subtotal || 0,
    opciones: (item.opciones || [])
      .map((entry) => entry?.opcion?.nombre)
      .filter(Boolean),
  }));

  return saveDemoOrder({
    numero: numero ?? demoNumber(),
    creado: new Date().toISOString(),
    estado: "Pagado",
    mesa: table?.numero ?? null,
    contacto: {
      nombre: contact?.nombre || "",
      medio: contact?.medio || "",
      valor: contact?.valor || "",
    },
    items,
    lineas: items.length,
    total: cart?.total || 0,
    demo: true,
  });
}

export function advanceDemoOrder(order) {
  const estado = NEXT_STATUS[order?.estado];
  if (!estado) return order;
  return saveDemoOrder({ ...order, estado, actualizado: new Date().toISOString() });
}

export function isDemoNumber(value) {
  const demo = loadDemoOrder();
  return Boolean(demo && Number(value) === Number(demo.numero));
}
