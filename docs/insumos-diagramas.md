# Insumos para diagramas

Material base para elaborar los diagramas UML por separado. No incluye diagramas ni atributos inventados.

## 1. Actores

| Actor | Tipo | Objetivo principal | HU |
|---|---|---|---|
| Cliente | Primario | Consultar el menú, armar y pagar su pedido y seguir su estado | HU-01 a HU-12, HU-21 |
| Cocina (por sector) | Primario | Ver y completar las tareas de preparación de su sector | HU-13 a HU-16 |
| Administrador del menú | Primario | Mantener el catálogo de productos y su sector de preparación | HU-17 a HU-20 |
| Sistema | Sistema | Ejecutar reglas automáticas de precio, enrutamiento y estado | RF-03, RF-11 |
| Pasarela de pago | Sistema externo | Confirmar la transacción del pago (conceptual, pago simulado) | HU-08 |

## 2. Casos de uso candidatos

| Caso de uso | HU | Actor | Nombre |
|---|---|---|---|
| CU-01 | HU-01 | Cliente | Consultar el menú por categorías |
| CU-02 | HU-02 | Cliente | Ver el detalle de un producto |
| CU-03 | HU-03 | Cliente | Seleccionar variantes y complementos |
| CU-04 | HU-04 | Cliente | Agregar productos al carrito |
| CU-05 | HU-05 | Cliente | Editar el carrito |
| CU-06 | HU-06 | Cliente | Seleccionar la mesa |
| CU-07 | HU-07 | Cliente | Revisar el resumen del pedido |
| CU-08 | HU-21 | Cliente | Registrar datos de contacto |
| CU-09 | HU-08 | Cliente | Confirmar el pago del pedido |
| CU-10 | HU-09 | Cliente | Recibir el comprobante |
| CU-11 | HU-12 | Cliente | Cancelar el pedido |
| CU-12 | HU-10 | Cliente | Consultar el estado del pedido |
| CU-13 | HU-11 | Cliente | Recibir el aviso de pedido listo |
| CU-14 | HU-13 | Cocina | Ver las tareas del sector |
| CU-15 | HU-14 | Cocina | Ver el detalle de una tarea |
| CU-16 | HU-15 | Cocina | Marcar una tarea como lista |
| CU-17 | HU-16 | Cocina | Ver los pedidos completados del sector |
| CU-18 | HU-17 | Administrador | Crear un producto del menú |
| CU-19 | HU-18 | Administrador | Modificar un producto |
| CU-20 | HU-19 | Administrador | Desactivar un producto agotado |
| CU-21 | HU-20 | Administrador | Asignar un producto a un sector |

Relaciones evidentes: **incluye** — el pago (CU-09) incluye el registro de datos de contacto (CU-08); el detalle de tarea (CU-15) incluye la consulta de las tareas del sector (CU-14). **extiende** — la cancelación (CU-11) extiende el resumen del pedido (CU-07). **generaliza** — los actores Cliente, Cocina y Administrador son actores del sistema de autoservicio.

## 3. Estados del pedido y disparadores

| Estado | Descripción | Disparador |
|---|---|---|
| Pagado | El cliente confirmó el pago (HU-08) y se generó el número de pedido (HU-09). | Pago confirmado en la pantalla. |
| En preparación | Existe al menos una tarea de sector pendiente (HU-13). | Envío del pedido a los sectores (RF-11). |
| Listo | Todos los sectores marcaron sus tareas (HU-15) y se avisó al cliente (HU-11). | Completado de la última tarea pendiente. |
| Entregado | El cliente retiró el pedido; se registra al confirmar la entrega. | Confirmación de entrega (fuera del alcance detallado). |
| Cancelado | El cliente canceló antes de pagar (HU-12). | Cancelación confirmada antes del pago. |

## 4. Entidades candidatas

Sin atributos ni métodos: solo los conceptos que el dominio necesita.

| Entidad | Relación evidente |
|---|---|
| Producto | pertenece a una Categoría y a un Sector de cocina |
| Categoría | agrupa Productos |
| Variante | pertenece a un Producto |
| Complemento | se ofrece en un Producto |
| Carrito | contiene Ítems de pedido antes del pago |
| Ítem de pedido | referencia un Producto con sus opciones y cantidad |
| Pedido | agrupa Ítems, se asocia a una Mesa y a un Pago y genera Tareas de preparación |
| Pago | pertenece a un Pedido |
| Datos de contacto del cliente | se asocian a un Pedido |
| Mesa | se asocia a los Pedidos del servicio |
| Sector de cocina | agrupa Tareas de preparación de los productos asignados |
| Tarea de preparación | pertenece a un Sector y a un Pedido |
| Administrador | gestiona Productos y sus asignaciones de sector |

## 5. Flujos principales

**Flujo 1 — Consulta y armado del pedido**

1. El cliente inicia en el menú (HU-01).
2. Abre el detalle de un producto (HU-02).
3. Selecciona variantes y complementos (HU-03).
4. Agrega el producto al carrito (HU-04).
5. Repite hasta terminar y edita el carrito (HU-05).
6. Selecciona la mesa (HU-06).
7. Revisa el resumen (HU-07).

**Flujo 2 — Pago**

1. El cliente toca 'Pagar' en el resumen (HU-07).
2. Registra nombre y contacto (HU-21).
3. Confirma el pago simulado (HU-08).
4. El sistema registra el pago y genera el número de pedido.
5. El cliente recibe el comprobante (HU-09).
6. El sistema envía los ítems a los sectores (RF-11).

**Flujo 3 — Cocina por sectores**

1. Cada sector recibe solo sus ítems (HU-13).
2. El cocinero abre el detalle de la tarea (HU-14).
3. Prepara y marca la tarea como lista (HU-15).
4. El sector consulta lo completado del turno (HU-16).
5. Al completar el último sector, el pedido pasa a Listo.

**Flujo 4 — Seguimiento del cliente**

1. El cliente consulta el estado de su pedido (HU-10).
2. El sistema muestra la etapa vigente.
3. Al pasar a Listo, la pantalla muestra el aviso (HU-11).
4. El cliente cierra el aviso y retira el pedido.

**Flujo 5 — Administración del menú**

1. El administrador crea un producto (HU-17).
2. Asigna el producto a un sector (HU-20).
3. Ajusta precio o descripción cuando hace falta (HU-18).
4. Desactiva el producto si se agota (HU-19).
5. El menú del cliente refleja los cambios.

## 6. Pantallas y navegación

| Pantalla origen | Pantalla destino | Transición |
|---|---|---|
| Menú por categorías | Detalle de producto | Al tocar una tarjeta de producto (HU-01 a HU-02). |
| Detalle de producto | Variantes y complementos | Al tocar 'Elegir opciones' (HU-02 a HU-03). |
| Variantes y complementos | Cantidad y agregado | Al confirmar las opciones (HU-03 a HU-04). |
| Cantidad y agregado | Carrito | Al tocar 'Agregar al carrito' (HU-04 a HU-05). |
| Carrito | Mesas | Al tocar 'Continuar' (HU-05 a HU-06). |
| Mesas | Resumen | Al confirmar la mesa (HU-06 a HU-07). |
| Resumen | Datos de contacto | Al tocar 'Pagar' (HU-07 a HU-21). |
| Resumen | Cancelación | Al tocar 'Cancelar pedido' (HU-07 a HU-12). |
| Datos de contacto | Pago | Al tocar 'Continuar al pago' (HU-21 a HU-08). |
| Pago | Comprobante | Al aprobarse el pago (HU-08 a HU-09). |
| Comprobante | Menú por categorías | Al tocar 'Volver al inicio' (HU-09). |
| Seguimiento | Aviso de pedido listo | Al pasar el pedido a Listo (HU-10 a HU-11). |
| Tareas del sector | Detalle de tarea | Al tocar 'Ver' (HU-13 a HU-14). |
| Detalle de tarea | Completar tarea | Al tocar 'Marcar como lista' (HU-14 a HU-15). |
| Completar tarea | Historial del turno | Al confirmar el completado (HU-15 a HU-16). |
| Administración del menú | Edición de producto | Al seleccionar un producto (HU-17 a HU-18). |
| Administración del menú | Producto y sector | Al elegir la asignación de sector (HU-17 a HU-20). |
