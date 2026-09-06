# Especificación Funcional - Sistema de Autoservicio Restaurante

## Resumen del Proyecto
Sistema de autoservicio para restaurante que permite a los clientes visualizar el menú, personalizar productos, gestionar su pedido y realizar el pago desde pantallas táctiles (kioscos).

**Plataforma detectada:** Touchscreen / kiosco

---

## Historias de Usuario Generadas (34 HU consolidadas)

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

### 3. Gestión de pedidos (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-24 | Registrar y administrar pedidos | Alta | RF-24 | [#90](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/90) |
| HU-25 | Consultar y actualizar estado de pedidos | Alta | RF-25 | [#91](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/91) |
| HU-26 | Cancelar pedidos | Media | RF-26 | [#92](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/92) |
| HU-27 | Consultar historial de pedidos | Media | RF-27 | [#93](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/93) |

### 4. Gestión de cocina (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-28 | Enviar y gestionar pedidos en estaciones de cocina | Alta | RF-28, RF-29 | [#94](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/94) |
| HU-29 | Actualizar estado, tiempos y alertas de cocina | Alta | RF-30, RF-31 | [#95](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/95) |

### 5. Estaciones de cocina (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-30 | Crear estaciones y asignar productos | Alta | RF-32, RF-33 | [#96](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/96) |
| HU-31 | Ver carga de trabajo de estaciones | Media | RF-34 | [#97](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/97) |

### 6. Sistema de riel (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-32 | Asociar pedido a destino (mesa/cliente) | Alta | RF-35 | [#98](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/98) |
| HU-33 | Enviar pedidos completados al riel | Alta | RF-36 | [#99](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/99) |
| HU-34 | Transportar pedidos del riel al destino | Alta | RF-37 | [#100](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/100) |
| HU-35 | Alertas de fallas del sistema de riel | Alta | RF-38 | [#101](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/101) |

### 7. Gestión de mesas (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-36 | Registrar mesas y gestionar su estado | Alta | RF-39, RF-40 | [#102](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/102) |
| HU-37 | Actualizar estado de mesa según ciclo | Alta | RF-41 | [#103](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/103) |

### 8. Inventario (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-38 | Registrar ingredientes y actualizar existencias | Alta | RF-42, RF-43 | [#104](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/104) |
| HU-39 | Alertas de stock bajo y consultar movimientos | Alta | RF-44, RF-45 | [#105](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/105) |

### 9. Administración del menú (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-40 | Crear/modificar platos y configurar precios | Alta | RF-46, RF-47 | [#106](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/106) |
| HU-41 | Asignar platos a estaciones y tiempos | Alta | RF-48 | [#107](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/107) |

### 10. Administración y reportes (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-42 | Administrar usuarios, ventas y reportes | Alta | RF-49, RF-50, RF-51 | [#108](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/108) |

### 11. Notificaciones (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-43 | Notificaciones y alertas en tiempo real | Alta | RF-52, RF-53 | [#109](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/109) |

### 12. Integración del sistema (consolidada)

| ID | Título | Prioridad | RF | Issue |
|---|---|---|---|---|
| HU-44 | Integrar todos los módulos del sistema | Alta | RF-54, RF-55, RF-56 | [#110](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/110) |

---

## Flujo del Usuario

### Flujo Principal (Cliente - Pantalla Táctil)
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

### Flujo Cocina (Personal)
```
[Recibir pedido] → HU-28 (Enviar/gestionar en estaciones) → HU-29 (Actualizar estado y tiempos)
    ↓
[Listo] → HU-32 (Asociar con mesa) → HU-33 (Enviar a riel)
```

### Flujo Riel (Transporte)
```
[Recibir orden] → HU-34 (Transportar pedido) → HU-35 (Alertar si hay falla)
    ↓
[Entregar] → HU-37 (Actualizar estado mesa)
```

### Flujo Administración
```
[Configurar] → HU-30 (Estaciones) → HU-40 (Menú) → HU-38 (Inventario) → HU-36 (Mesas) → HU-42 (Usuarios)
    ↓
[Monitorear] → HU-24/25/26/27 (Pedidos) → HU-42 (Reportes) → HU-43 (Notificaciones)
    ↓
[Integrar] → HU-44 (Sistema completo)
```

---

## Requerimientos No Funcionales Detectados

- El sistema debe soportar múltiples kioscos simultáneamente
- La disponibilidad de productos debe actualizarse en tiempo real
- El sistema de cocina debe recibir pedidos inmediatamente tras confirmación
- La interfaz debe ser accesible para usuarios sin experiencia técnica
- El sistema de riel debe funcionar de forma autónoma con monitoreo
- Los reportes deben actualizarse en tiempo real
- Las alertas deben ser visuales y opcionalmente sonoras

---

## Supuestos del Agente

1. El restaurante cuenta con inventario conectado al sistema para disponibilidad en tiempo real
2. Los productos tienen configuración de ingredientes obligatorios vs opcionales
3. El sistema aplica IVA automáticamente
4. Existe integración con sistema de gestión de cocina
5. El número máximo de mesas está configurado en el sistema
6. Existe un sistema de riel de transporte automatizado
7. Cada estación de cocina tiene una pantalla dedicada
8. Los usuarios tienen roles definidos con permisos específicos

---

## Requerimientos Funcionales Cubiertos (Mapeo RF → HU)

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
| RF-24 | Registrar y administrar pedidos realizados | HU-24 |
| RF-25 | Consultar y actualizar estado de pedidos | HU-25 |
| RF-26 | Cancelar pedidos | HU-26 |
| RF-27 | Consultar historial de pedidos | HU-27 |
| RF-28 | Enviar pedidos a estaciones de cocina | HU-28 |
| RF-29 | Gestionar pedidos en estaciones de cocina | HU-28 |
| RF-30 | Actualizar estado del pedido en cocina | HU-29 |
| RF-31 | Tiempos de preparación y alertas | HU-29 |
| RF-32 | Crear estaciones de cocina | HU-30 |
| RF-33 | Asignar productos a estaciones | HU-30 |
| RF-34 | Ver carga de trabajo de estaciones | HU-31 |
| RF-35 | Asociar pedido a destino (mesa/cliente) | HU-32 |
| RF-36 | Enviar pedidos completados al riel | HU-33 |
| RF-37 | Transportar pedidos del riel al destino | HU-34 |
| RF-38 | Alertas de fallas del sistema de riel | HU-35 |
| RF-39 | Registrar mesas | HU-36 |
| RF-40 | Mostrar estado de mesas | HU-36 |
| RF-41 | Actualizar estado de mesa según ciclo | HU-37 |
| RF-42 | Registrar ingredientes | HU-38 |
| RF-43 | Actualizar existencias de inventario | HU-38 |
| RF-44 | Alertas de stock bajo | HU-39 |
| RF-45 | Consultar movimientos de inventario | HU-39 |
| RF-46 | Crear y modificar platos | HU-40 |
| RF-47 | Configurar precios y descuentos | HU-40 |
| RF-48 | Asignar platos a estaciones y tiempos | HU-41 |
| RF-49 | Administrar usuarios | HU-42 |
| RF-50 | Consultar ventas | HU-42 |
| RF-51 | Ver rendimiento de estaciones | HU-42 |
| RF-52 | Enviar notificaciones a actores del sistema | HU-43 |
| RF-53 | Alertas de retrasos, inventario y fallas | HU-43 |
| RF-54 | Integrar todos los módulos del sistema | HU-44 |
| RF-55 | Mantener información consistente entre módulos | HU-44 |
| RF-56 | Registrar ciclo completo del pedido | HU-44 |

---

## Wireframes de Referencia (SVG)

Los wireframes de baja fidelidad están almacenados como archivos SVG en la carpeta `wireframes/images/`.

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

### Panel de Gestión de Pedidos (HU-24 a HU-27)
![Wireframe: Gestión de Pedidos](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu7-gestion-pedidos.svg)

### Panel de Cocina (HU-28, HU-29)
![Wireframe: Cocina](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu8-cocina.svg)

### Panel de Estaciones (HU-30, HU-31)
![Wireframe: Estaciones](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu9-estaciones.svg)

### Panel de Riel (HU-32 a HU-35)
![Wireframe: Riel](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu10-riel.svg)

### Panel de Mesas (HU-36, HU-37)
![Wireframe: Mesas](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu11-mesas.svg)

### Panel de Inventario (HU-38, HU-39)
![Wireframe: Inventario](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu12-inventario.svg)

### Panel de Administración del Menú (HU-40, HU-41)
![Wireframe: Admin Menú](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu13-admin-menu.svg)

### Panel de Reportes (HU-42)
![Wireframe: Reportes](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu14-reportes.svg)

### Panel de Notificaciones (HU-43)
![Wireframe: Notificaciones](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu15-notificaciones.svg)

### Panel de Integración (HU-44)
![Wireframe: Integración](https://raw.githubusercontent.com/miguelcebing/Trabajo-final-dise-o-/main/wireframes/images/hu16-integracion.svg)

---

## Wireframes Interactivos (HTML)

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