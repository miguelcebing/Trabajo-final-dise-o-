# Especificación Funcional - Sistema de Autoservicio Restaurante

## Resumen del Proyecto
Sistema de autoservicio para restaurante que permite a los clientes visualizar el menú, personalizar productos, gestionar su pedido y realizar el pago desde pantallas táctiles (kioscos).

**Plataforma detectada:** Touchscreen / kiosco

---

## Historias de Usuario Generadas (22 HU)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-01 | Visualizar menú completo en pantalla táctil | Alta | RF-01 | [#6](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/6) |
| HU-02 | Organizar productos por categorías | Alta | RF-02 | [#7](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/7) |
| HU-03 | Mostrar nombre, descripción, precio e imagen del producto | Alta | RF-03 | [#8](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/8) |
| HU-04 | Consultar ingredientes y características del producto | Alta | RF-04 | [#9](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/9) |
| HU-05 | Seleccionar tamaños, presentaciones o variantes | Alta | RF-05 | [#10](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/10) |
| HU-06 | Agregar o eliminar ingredientes del producto | Alta | RF-06 | [#11](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/11) |
| HU-07 | Seleccionar complementos o productos adicionales | Media | RF-07 | [#12](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/12) |
| HU-08 | Actualizar precio automáticamente según modificaciones | Alta | RF-08 | [#13](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/13) |
| HU-09 | Agregar productos al carrito de compra | Alta | RF-09 | [#14](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/14) |
| HU-10 | Modificar cantidades y eliminar productos del carrito | Alta | RF-10, RF-11 | [#15](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/15) |
| HU-11 | Mostrar subtotal y total antes del pago | Alta | RF-12 | [#16](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/16) |
| HU-12 | Mostrar disponibilidad de productos en tiempo real | Media | RF-13 | [#17](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/17) |
| HU-13 | Ocultar o marcar productos agotados | Media | RF-14 | [#18](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/18) |
| HU-14 | Iniciar una nueva orden desde autoservicio | Alta | RF-15 | [#19](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/19) |
| HU-15 | Seleccionar tipo de pedido (consumir aquí o para llevar) | Alta | RF-16 | [#20](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/20) |
| HU-16 | Seleccionar o ingresar número de mesa | Alta | RF-17 | [#21](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/21) |
| HU-17 | Generar identificador único para cada pedido | Media | RF-18 | [#22](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/22) |
| HU-18 | Mostrar resumen completo del pedido antes de confirmar | Alta | RF-19 | [#23](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/23) |
| HU-19 | Confirmar o cancelar pedido antes del pago | Alta | RF-20 | [#24](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/24) |
| HU-20 | Enviar pedido confirmado al sistema de cocina | Alta | RF-21 | [#25](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/25) |
| HU-21 | Informar al cliente que su pedido fue recibido | Alta | RF-22 | [#26](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/26) |
| HU-22 | Mostrar estado del pedido al cliente | Alta | RF-23 | [#27](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/27) |

---

## Flujo del Usuario

```
[Inicio] → HU-14 (Nueva Orden)
    ↓
[Tipo Pedido] → HU-15 (Consumir aquí / Para llevar)
    ↓
[Mesa] → HU-16 (Seleccionar mesa, si aplica)
    ↓
[Menú] → HU-01 (Ver menú) → HU-02 (Categorías) → HU-03 (Producto)
    ↓
[Personalizar] → HU-04 (Ingredientes) → HU-05 (Variantes) → HU-06 (Agregar/eliminar ingredientes) → HU-07 (Complementos) → HU-08 (Precio actualizado)
    ↓
[Agregar] → HU-09 (Agregar al carrito)
    ↓
[Carrito] → HU-10 (Modificar cantidades / Eliminar) → HU-11 (Subtotal/total)
    ↓
[Resumen] → HU-18 (Resumen completo) → HU-19 (Confirmar/Cancelar)
    ↓
[Confirmar] → HU-17 (ID único) → HU-20 (Enviar a cocina) → HU-21 (Confirmación recibida)
    ↓
[Seguimiento] → HU-22 (Estado del pedido)
```

---

## Requerimientos No Funcionales Detectados

- El sistema debe soportar múltiples kioscos simultáneamente
- La disponibilidad de productos debe actualizarse en tiempo real
- El sistema de cocina debe recibir pedidos inmediatamente tras confirmación
- La interfaz debe ser accesible para usuarios sin experiencia técnica

---

## Supuestos del Agente

1. El restaurante cuenta con inventario conectado al sistema para disponibilidad en tiempo real
2. Los productos tienen configuración de ingredientes obligatorios vs opcionales
3. El sistema aplica IVA automáticamente
4. Existe integración con sistema de gestión de cocina
5. El número máximo de mesas está configurado en el sistema