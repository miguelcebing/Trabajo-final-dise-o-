# Requerimientos Funcionales

Proyecto: **Sistema de Autoservicio para Restaurante**.

## Convenciones

- Cada requerimiento describe **una sola acción observable** del sistema, sin tecnología ni adjetivos vagos.
- `ID`: identificador secuencial `RF-01` a `RF-15`, sin saltos.
- `Módulo`: agrupación funcional del alcance aprobado.
- `Prioridad`: escala MoSCoW (`Must`, `Should`, `Could`).
- `HU`: historias de usuario que materializan el requerimiento. Todo RF tiene al menos una HU.

## Tabla de requerimientos

| ID | Módulo | El sistema deberá... | Actor | Prioridad | HU asociadas |
|---|---|---|---|---|---|
| RF-01 | Menú | El sistema deberá mostrar el menú del restaurante agrupado por categorías, con el nombre, la descripción, el precio y la imagen de cada producto. | Cliente | Must | HU-01, HU-02 |
| RF-02 | Menú | El sistema deberá permitir seleccionar variantes y complementos de un producto. | Cliente | Must | HU-03 |
| RF-03 | Menú | El sistema deberá actualizar el precio del ítem según las variantes y complementos seleccionados. | Sistema | Must | HU-03 |
| RF-04 | Pedido | El sistema deberá registrar los productos seleccionados por el cliente en un carrito de compra. | Cliente | Must | HU-04, HU-05 |
| RF-05 | Pedido | El sistema deberá permitir modificar las cantidades y eliminar ítems del carrito de compra. | Cliente | Must | HU-05 |
| RF-06 | Pedido | El sistema deberá registrar la mesa seleccionada por el cliente. | Cliente | Must | HU-06 |
| RF-07 | Pedido | El sistema deberá mostrar el resumen del pedido con subtotales y total antes del pago. | Cliente | Must | HU-07 |
| RF-08 | Pedido | El sistema deberá permitir al cliente cancelar el pedido antes del pago. | Cliente | Should | HU-12 |
| RF-09 | Pago | El sistema deberá solicitar el nombre y un medio de contacto del cliente antes de confirmar el pago. | Cliente | Must | HU-21 |
| RF-10 | Pago | El sistema deberá registrar el pago del pedido confirmado por el cliente en la pantalla. | Cliente | Must | HU-08, HU-09 |
| RF-11 | Cocina | El sistema deberá enviar cada ítem del pedido al sector de cocina que le corresponde. | Sistema | Must | HU-13, HU-16 |
| RF-12 | Cocina | El sistema deberá mostrar a cada sector de cocina las tareas de preparación que le corresponden. | Cocina | Must | HU-13, HU-14, HU-16 |
| RF-13 | Cocina | El sistema deberá registrar el estado de cada tarea de preparación marcado por el sector de cocina. | Cocina | Must | HU-15 |
| RF-14 | Estado del pedido | El sistema deberá mostrar al cliente el estado de su pedido según el avance de los sectores de cocina. | Cliente | Must | HU-10, HU-11 |
| RF-15 | Administración del menú | El sistema deberá administrar el catálogo de productos del menú. | Administrador | Should | HU-17, HU-18, HU-19, HU-20 |

## Notas de alcance

- El pago del alcance aprobado es **simulado**: la pantalla registra la confirmación del cliente y deja preparado el punto de integración con una pasarela real (RF-10).
- La identificación del cliente usa el **número de mesa** (RF-06) más los **datos de contacto** capturados antes de pagar (RF-09).
- Los sectores de cocina son **fijos**: Bebidas, Parrilla, Cocina fría y Postres (RF-11).
- Quedan **fuera del alcance**: inventario, reportes, riel de transporte, reservas de mesa, propinas, fidelización, domicilios y facturación.

Historias de usuario: [`docs/historias/`](../historias/). Wireframes: [`docs/wireframes/`](../wireframes/).
