# Especificación Funcional - Sistema de Autoservicio Restaurante

## Resumen del Proyecto
Sistema de autoservicio para restaurante que permite a los clientes visualizar el menú, personalizar productos, gestionar su pedido y realizar el pago desde pantallas táctiles (kioscos).

**Plataforma detectada:** Touchscreen / kiosco

---

## Historias de Usuario Generadas (23 HU)

### 1. Gestión del menú digital

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-01 | Visualizar menú completo en pantalla táctil | Alta | RF-01 | [#34](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/34) |
| HU-02 | Organizar productos por categorías | Alta | RF-02 | [#35](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/35) |
| HU-03 | Mostrar información completa del producto | Alta | RF-03 | [#36](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/36) |
| HU-04 | Consultar ingredientes y características del producto | Alta | RF-04 | [#37](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/37) |
| HU-05 | Seleccionar tamaños, presentaciones o variantes | Alta | RF-05 | [#38](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/38) |
| HU-06 | Agregar o eliminar ingredientes del producto | Alta | RF-06 | [#39](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/39) |
| HU-07 | Seleccionar complementos o productos adicionales | Alta | RF-07 | [#40](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/40) |
| HU-08 | Actualizar precio automáticamente según modificaciones | Alta | RF-08 | [#41](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/41) |
| HU-09 | Agregar productos al carrito de compra | Alta | RF-09 | [#42](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/42) |
| HU-10 | Modificar cantidades de productos en el carrito | Alta | RF-10 | [#43](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/43) |
| HU-11 | Eliminar productos del carrito | Alta | RF-11 | [#44](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/44) |
| HU-12 | Mostrar subtotal y total antes del pago | Alta | RF-12 | [#45](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/45) |
| HU-13 | Mostrar disponibilidad de productos en tiempo real | Media | RF-13 | [#46](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/46) |
| HU-14 | Ocultar o marcar productos agotados | Media | RF-14 | [#47](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/47) |

### 2. Toma de pedidos mediante autoservicio

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-15 | Iniciar una nueva orden desde autoservicio | Alta | RF-15 | [#48](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/48) |
| HU-16 | Seleccionar tipo de pedido (consumir aquí o llevar) | Alta | RF-16 | [#49](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/49) |
| HU-17 | Seleccionar o ingresar número de mesa | Alta | RF-17 | [#50](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/50) |
| HU-18 | Generar identificador único para cada pedido | Alta | RF-18 | [#51](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/51) |
| HU-19 | Mostrar resumen completo del pedido antes de confirmar | Alta | RF-19 | [#52](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/52) |
| HU-20 | Confirmar o cancelar pedido antes del pago | Alta | RF-20 | [#53](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/53) |
| HU-21 | Enviar pedido confirmado al sistema de cocina | Alta | RF-21 | [#54](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/54) |
| HU-22 | Informar al cliente que su pedido fue recibido | Alta | RF-22 | [#55](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/55) |
| HU-23 | Mostrar estado del pedido al cliente | Media | RF-23 | [#56](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/56) |

---

## Flujo del Usuario

```
[Inicio] → HU-15 (Iniciar nueva orden)
    ↓
[Tipo Pedido] → HU-16 (Seleccionar tipo de pedido)
    ↓
[Mesa] → HU-17 (Seleccionar mesa, si aplica)
    ↓
[Menú] → HU-01 (Ver menú) → HU-02 (Categorías) → HU-03 (Info producto) → HU-04 (Detalles)
    ↓
[Personalizar] → HU-05 (Variantes) → HU-06 (Ingredientes) → HU-07 (Complementos) → HU-08 (Precio actualizado)
    ↓
[Agregar] → HU-09 (Agregar al carrito)
    ↓
[Carrito] → HU-10 (Modificar cantidades) → HU-11 (Eliminar productos) → HU-12 (Subtotal/total)
    ↓
[Resumen] → HU-19 (Resumen completo) → HU-20 (Confirmar/Cancelar)
    ↓
[Confirmar] → HU-18 (ID único) → HU-21 (Enviar a cocina) → HU-22 (Confirmación al cliente)
    ↓
[Seguimiento] → HU-23 (Estado del pedido)
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

---

## Requerimientos Funcionales Cubiertos (1 a 1)

| RF | Descripción | HU |
|---|---|---|
| RF-01 | Visualizar menú completo en pantalla táctil | HU-01 |
| RF-02 | Organizar productos por categorías | HU-02 |
| RF-03 | Mostrar nombre, descripción, precio e imagen del producto | HU-03 |
| RF-04 | Consultar ingredientes y características del producto | HU-04 |
| RF-05 | Seleccionar tamaños, presentaciones o variantes | HU-05 |
| RF-06 | Agregar o eliminar ingredientes del producto | HU-06 |
| RF-07 | Seleccionar complementos o productos adicionales | HU-07 |
| RF-08 | Actualizar precio automáticamente según modificaciones | HU-08 |
| RF-09 | Agregar productos al carrito de compra | HU-09 |
| RF-10 | Modificar cantidades de productos del carrito | HU-10 |
| RF-11 | Eliminar productos del carrito | HU-11 |
| RF-12 | Mostrar subtotal y total de la orden antes del pago | HU-12 |
| RF-13 | Mostrar disponibilidad de productos en tiempo real | HU-13 |
| RF-14 | Ocultar o marcar como no disponibles los productos agotados | HU-14 |
| RF-15 | Iniciar una nueva orden desde pantalla de autoservicio | HU-15 |
| RF-16 | Seleccionar tipo de pedido (consumir aquí o para llevar) | HU-16 |
| RF-17 | Seleccionar o ingresar número de mesa | HU-17 |
| RF-18 | Generar identificador único para cada pedido | HU-18 |
| RF-19 | Mostrar resumen completo del pedido antes de confirmar | HU-19 |
| RF-20 | Confirmar o cancelar pedido antes del pago | HU-20 |
| RF-21 | Enviar pedido confirmado al sistema de cocina | HU-21 |
| RF-22 | Informar al cliente que su pedido fue recibido correctamente | HU-22 |
| RF-23 | Mostrar estado del pedido al cliente | HU-23 |

---

## Wireframes de Referencia (SVG)

Los wireframes de baja fidelidad están almacenados como archivos SVG en la carpeta `wireframes/images/`. Cada wireframe representa la interfaz de usuario para las Historias de Usuario, con el estilo tradicional de cajas grises/esqueléticas.

### Pantalla de Menú (HU-01 a HU-04, HU-13, HU-14)
![Wireframe: Menú Digital](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu1-menu.svg)

### Pantalla de Personalización (HU-05 a HU-08)
![Wireframe: Personalización](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu2-personalizacion.svg)

### Pantalla del Carrito (HU-09 a HU-12)
![Wireframe: Carrito](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu3-carrito.svg)

### Pantalla de Inicio de Pedido (HU-15 a HU-17)
![Wireframe: Inicio Pedido](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu4-inicio-pedido.svg)

### Pantalla de Confirmación (HU-18 a HU-22)
![Wireframe: Confirmación](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu5-confirmacion.svg)

### Pantalla de Seguimiento (HU-23)
![Wireframe: Seguimiento](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu6-seguimiento.svg)

---

## Wireframes Interactivos (HTML)

Además de los SVGs estáticos, se ha creado un wireframe interactivo completo en HTML con Tailwind CSS:

**Archivo:** [`wireframes/index.html`](https://github.com/miguelcebing/Trabajo-final-dise-o-/blob/main/wireframes/index.html)

### Características:
- **Plataforma:** Touchscreen / kiosco
- **Estilo:** Baja fidelidad con cajas grises, líneas de texto y botones genéricos
- **Interactividad:** Navegación entre pantallas, botones clickeables, formularios interactivos
- **Tecnología:** HTML5 con Tailwind CSS vía CDN
- **Modularidad:** Cada pantalla tiene su propia vista con navegación fluida

### Cómo visualizar:
1. Abrir [`wireframes/index.html`](https://github.com/miguelcebing/Trabajo-final-dise-o-/blob/main/wireframes/index.html) en un navegador
2. Usar los botones de navegación en la parte superior para cambiar entre pantallas
3. Cada pantalla muestra el wireframe interactivo correspondiente
4. Los botones y elementos son clickeables para simular la interacción