# Especificación Funcional - Sistema de Autoservicio Restaurante

## Resumen del Proyecto
Sistema de autoservicio para restaurante que permite a los clientes visualizar el menú, personalizar productos, gestionar su pedido y realizar el pago desde pantallas táctiles (kioscos).

**Plataforma detectada:** Touchscreen / kiosco

---

## Historias de Usuario Generadas (6 HU)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-1 | Visualización y exploración del menú digital en pantalla táctil | Alta | RF-01, RF-02, RF-03, RF-04, RF-13, RF-14 | [#28](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/28) |
| HU-2 | Personalización de productos en el menú | Alta | RF-05, RF-06, RF-07, RF-08 | [#29](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/29) |
| HU-3 | Gestión del carrito de compra | Alta | RF-09, RF-10, RF-11, RF-12 | [#30](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/30) |
| HU-4 | Inicio de pedido y selección de opciones | Alta | RF-15, RF-16, RF-17 | [#31](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/31) |
| HU-5 | Confirmación y envío del pedido | Alta | RF-18, RF-19, RF-20, RF-21, RF-22 | [#32](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/32) |
| HU-6 | Seguimiento del estado del pedido | Media | RF-23 | [#33](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/33) |

---

## Flujo del Usuario

```
[Inicio] → HU-4 (Iniciar nueva orden)
    ↓
[Tipo Pedido] → HU-4 (Seleccionar tipo de pedido)
    ↓
[Mesa] → HU-4 (Seleccionar mesa, si aplica)
    ↓
[Menú] → HU-1 (Ver menú, categorías, detalles, disponibilidad)
    ↓
[Personalizar] → HU-2 (Seleccionar variantes, ingredientes, complementos, precio actualizado)
    ↓
[Agregar] → HU-3 (Agregar al carrito)
    ↓
[Carrito] → HU-3 (Modificar cantidades, eliminar productos, ver subtotal/total)
    ↓
[Resumen] → HU-5 (Ver resumen completo, confirmar o cancelar)
    ↓
[Confirmar] → HU-5 (Generar ID único, enviar a cocina, confirmación al cliente)
    ↓
[Seguimiento] → HU-6 (Ver estado del pedido en tiempo real)
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

## Requerimientos Funcionales Cubiertos

### 1. Gestión del menú digital
- RF-01: Visualización del menú en pantalla táctil → HU-1
- RF-02: Organización por categorías → HU-1
- RF-03: Información del producto (nombre, descripción, precio, imagen) → HU-1
- RF-04: Consulta de ingredientes y características → HU-1
- RF-05: Selección de variantes (tamaños, presentaciones) → HU-2
- RF-06: Personalización de ingredientes → HU-2
- RF-07: Selección de complementos → HU-2
- RF-08: Actualización automática de precios → HU-2
- RF-09: Agregar al carrito → HU-3
- RF-10: Modificar cantidades en carrito → HU-3
- RF-11: Eliminar productos del carrito → HU-3
- RF-12: Mostrar subtotal y total → HU-3
- RF-13: Disponibilidad en tiempo real → HU-1
- RF-14: Ocultar productos agotados → HU-1

### 2. Toma de pedidos mediante autoservicio
- RF-15: Iniciar nueva orden → HU-4
- RF-16: Seleccionar tipo de pedido → HU-4
- RF-17: Seleccionar número de mesa → HU-4
- RF-18: Generar identificador único → HU-5
- RF-19: Mostrar resumen del pedido → HU-5
- RF-20: Confirmar o cancelar pedido → HU-5
- RF-21: Enviar pedido a cocina → HU-5
- RF-22: Informar confirmación al cliente → HU-5
- RF-23: Mostrar estado del pedido → HU-6

---

## Wireframes de Referencia (SVG)

Los wireframes de baja fidelidad están almacenados como archivos SVG en la carpeta `wireframes/images/`. Cada wireframe representa la interfaz de usuario para una Historia de Usuario específica, con el estilo tradicional de cajas grises/esqueléticas.

### HU-1: Visualización del menú digital
![Wireframe HU-1: Menú Digital](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu1-menu.svg)

### HU-2: Personalización de productos
![Wireframe HU-2: Personalización](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu2-personalizacion.svg)

### HU-3: Gestión del carrito
![Wireframe HU-3: Carrito](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu3-carrito.svg)

### HU-4: Inicio de pedido
![Wireframe HU-4: Inicio Pedido](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu4-inicio-pedido.svg)

### HU-5: Confirmación del pedido
![Wireframe HU-5: Confirmación](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu5-confirmacion.svg)

### HU-6: Seguimiento del pedido
![Wireframe HU-6: Seguimiento](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu6-seguimiento.svg)

---

## Wireframes Interactivos (HTML)

Además de los SVGs estáticos, se ha creado un wireframe interactivo completo en HTML con Tailwind CSS:

**Archivo:** [`wireframes/index.html`](https://github.com/miguelcebing/Trabajo-final-dise-o-/blob/main/wireframes/index.html)

### Características:
- **Plataforma:** Touchscreen / kiosco
- **Estilo:** Baja fidelidad con cajas grises, líneas de texto y botones genéricos
- **Interactividad:** Navegación entre pantallas, botones clickeables, formularios interactivos
- **Tecnología:** HTML5 con Tailwind CSS vía CDN
- **Modularidad:** Cada HU tiene su propia pantalla con navegación fluida

### Cómo visualizar:
1. Abrir [`wireframes/index.html`](https://github.com/miguelcebing/Trabajo-final-dise-o-/blob/main/wireframes/index.html) en un navegador
2. Usar los botones de navegación en la parte superior para cambiar entre HU
3. Cada pantalla muestra el wireframe interactivo correspondiente
4. Los botones y elementos son clickeables para simular la interacción