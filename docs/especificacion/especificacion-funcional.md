# Especificación Funcional - Sistema de Pedidos Restaurante

## Resumen del Proyecto
Sistema de pedidos para restaurante con pantalla táctil que integra: menú digital, autoservicio, cocina, riel de transporte, inventario, mesas, notificaciones y reportes.

---

## Historias de Usuario - Consolidado INVEST (56 HUs)

### MÓDULO 1: MENÚ DIGITAL (HU-01 a HU-14)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 1 | Visualizar menú completo en pantalla táctil | Cliente | RF-01 | Alta | ✅ COMPLIANT |
| 2 | Organizar productos por categorías | Cliente | RF-02 | Alta | ✅ COMPLIANT |
| 3 | Mostrar información completa del producto | Cliente | RF-03 | Alta | ✅ COMPLIANT |
| 4 | Consultar ingredientes y características | Cliente | RF-04 | Alta | ✅ COMPLIANT |
| 5 | Seleccionar tamaños/variantes | Cliente | RF-05 | Alta | ✅ COMPLIANT |
| 6 | Agregar/eliminar ingredientes | Cliente | RF-06 | Alta | ✅ COMPLIANT |
| 7 | Seleccionar complementos | Cliente | RF-07 | Alta | ✅ COMPLIANT |
| 8 | Actualizar precio automáticamente | Sistema | RF-08 | Alta | ✅ COMPLIANT |
| 9 | Agregar productos al carrito | Cliente | RF-09 | Alta | ✅ COMPLIANT |
| 10 | Modificar cantidades en carrito | Cliente | RF-10 | Alta | ✅ COMPLIANT |
| 11 | Eliminar productos del carrito | Cliente | RF-11 | Alta | ✅ COMPLIANT |
| 12 | Mostrar subtotal y total | Cliente | RF-12 | Alta | ✅ COMPLIANT |
| 13 | Mostrar disponibilidad en tiempo real | Cliente | RF-13 | Media | ✅ COMPLIANT |
| 14 | Ocultar productos agotados | Sistema | RF-14 | Media | ✅ COMPLIANT |

### MÓDULO 2: TOMA DE PEDIDOS (HU-15 a HU-23)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 15 | Iniciar nueva orden desde autoservicio | Cliente | RF-15 | Alta | ✅ COMPLIANT |
| 16 | Seleccionar tipo de pedido (aquí/llevar) | Cliente | RF-16 | Alta | ✅ COMPLIANT |
| 17 | Seleccionar/ingresar número de mesa | Cliente | RF-17 | Alta | ✅ COMPLIANT |
| 18 | Generar identificador único para pedido | Cliente | RF-18 | Alta | ✅ REESCRITO |
| 19 | Mostrar resumen antes de confirmar | Cliente | RF-19 | Alta | ✅ COMPLIANT |
| 20 | Confirmar o cancelar pedido | Cliente | RF-20 | Alta | ✅ COMPLIANT |
| 21 | Enviar pedido a cocina | Sistema | RF-21 | Alta | ✅ + dependencia |
| 22 | Informar pedido recibido | Sistema | RF-22 | Alta | ✅ COMPLIANT |
| 23 | Mostrar estado del pedido | Cliente | RF-23 | Media | ✅ + dependencia |

### MÓDULO 3: GESTIÓN DE PEDIDOS (HU-24 a HU-27)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 24a | Registrar nuevo pedido | Operador | RF-24 | Alta | ✅ NUEVA |
| 24b | Modificar pedido existente | Operador | RF-24 | Alta | ✅ NUEVA |
| 24c | Confirmar pedido para cocina | Operador | RF-24/21 | Alta | ✅ NUEVA |
| 25a | Consultar/actualizar estado | Operador | RF-25 | Alta | ✅ NUEVA |
| 25b | Ver tiempo estimado | Operador | RF-31 | Media | ✅ NUEVA |
| 26 | Cancelar pedidos con motivo | Operador | RF-26 | Media | ✅ COMPLIANT |
| 27 | Consultar historial | Cliente | RF-27 | Media | ✅ COMPLIANT |

### MÓDULO 4: GESTIÓN DE COCINA (HU-28 a HU-29)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 28 | Enviar pedidos a estaciones | Sistema | RF-28 | Alta | ✅ + dependencia |
| 29a | Ver tareas por estación | Cocinero | RF-29 | Alta | ✅ NUEVA |
| 29b | Actualizar estado de tareas | Cocinero | RF-30 | Alta | ✅ NUEVA |
| 29c | Alertas de retraso | Supervisor | RF-31 | Alta | ✅ NUEVA |

### MÓDULO 5: ESTACIONES DE COCINA (HU-30 a HU-31)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 30a | Crear estaciones | Administrador | RF-32 | Alta | ✅ NUEVA |
| 30b | Asignar productos | Administrador | RF-33 | Alta | ✅ NUEVA |
| 31 | Carga de trabajo | Administrador | RF-34 | Media | ✅ + dependencia |

### MÓDULO 6: SISTEMA DE RIEL (HU-32 a HU-35)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 32 | Asociar pedido a destino | Sistema | RF-35 | Alta | ✅ + dependencia |
| 33 | Enviar transporte | Personal Riel | RF-36 | Alta | ✅ + dependencia |
| 34 | Estado en tránsito | Personal Riel | RF-37 | Alta | ✅ + dependencia |
| 35 | Alertas falla | Sistema | RF-38 | Alta | ✅ + dependencia |

### MÓDULO 7: GESTIÓN DE MESAS (HU-36 a HU-37)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 36 | Registrar mesas | Administrador | RF-39 | Alta | ✅ COMPLIANT |
| 37 | Ciclo de vida de mesa | Sistema | RF-41 | Alta | ✅ REESCRITO |

### MÓDULO 8: INVENTARIO (HU-38 a HU-39)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 38 | Registrar ingredientes | Administrador | RF-42 | Alta | ✅ COMPLIANT |
| 39a | Auto-update existencias | Encargado | RF-43 | Alta | ✅ NUEVA |
| 39b | Alertas stock mínimo | Encargado | RF-44 | Alta | ✅ NUEVA |
| 39c | Consultar movimientos | Encargado | RF-45 | Media | ✅ NUEVA |

### MÓDULO 9: ADMIN MENÚ (HU-40 a HU-41)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 40a | CRUD productos | Administrador | RF-46 | Alta | ✅ NUEVA |
| 40b | Configurar precios | Administrador | RF-47 | Alta | ✅ NUEVA |
| 41 | Asignar estación/tiempo | Administrador | RF-48 | Alta | ✅ REESCRITO |

### MÓDULO 10: ADMIN Y REPORTES (HU-42)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 42a | Administrar usuarios | Administrador | RF-49 | Alta | ✅ NUEVA |
| 42b | Reportes de ventas | Administrador | RF-50 | Alta | ✅ NUEVA |
| 42c | Rendimiento estaciones | Administrador | RF-51 | Media | ✅ NUEVA |

### MÓDULO 11: NOTIFICACIONES (HU-43)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 43a | Notif. pedidos | Sistema | RF-52 | Alta | ✅ NUEVA |
| 43b | Alertas del sistema | Sistema | RF-53 | Alta | ✅ NUEVA |

### MÓDULO 12: INTEGRACIÓN (HU-44)

| # | HU | Rol | RF | Prioridad | Estado INVEST |
|---|-----|-----|-----|-----------|---------------|
| 44a | Sync pedidos | Sistema | RF-54/55 | Alta | ✅ NUEVA |
| 44b | Sync módulos | Sistema | RF-54/55 | Alta | ✅ NUEVA |
| 44c | Ciclo completo | Administrador | RF-56 | Media | ✅ NUEVA |

---

## Mapa de Dependencias

```
FASE 1 - BASE (Sprint 1-2)
├── HU-36 (Mesas)
├── HU-38 (Inventario)
├── HU-30a (Crear estaciones)
├── HU-30b (Asignar productos) ← HU-30a
├── HU-40a (CRUD productos)
├── HU-40b (Configuración) ← HU-40a
└── HU-41 (Asignar estación) ← HU-30a, HU-40a

FASE 2 - CLIENTE (Sprint 3-4)
├── HU-01 a HU-14 (Menú digital)
├── HU-15 a HU-18 (Inicio de pedido)
├── HU-19 a HU-22 (Confirmación)
└── HU-23 (Seguimiento)

FASE 3 - PEDIDOS (Sprint 5-6)
├── HU-24a (Crear pedido)
├── HU-24b (Modificar) ← HU-24a
├── HU-24c (Confirmar) ← HU-24a, HU-30a
├── HU-25a (Actualizar estado)
├── HU-25b (Tiempos) ← HU-29b
├── HU-26 (Cancelar)
└── HU-27 (Historial)

FASE 4 - COCINA (Sprint 7-8)
├── HU-28 (Enviar a estaciones) ← HU-30a, HU-30b
├── HU-29a (Ver tareas) ← HU-30a, HU-24c
├── HU-29b (Actualizar) ← HU-29a
├── HU-29c (Alertas) ← HU-29b
└── HU-31 (Carga) ← HU-30a, HU-28

FASE 5 - RIEL (Sprint 9)
├── HU-32 (Asociar destino)
├── HU-33 (Enviar transporte) ← HU-29b
├── HU-34 (Estado tránsito) ← HU-33
└── HU-35 (Alertas falla) ← HU-32, HU-33, HU-34

FASE 6 - INVENTARIO (Sprint 9)
├── HU-39a (Auto-update) ← HU-38, HU-24c
├── HU-39b (Alertas) ← HU-38
└── HU-39c (Consulta) ← HU-38, HU-39a

FASE 7 - ADMIN (Sprint 10)
├── HU-42a (Usuarios)
├── HU-42b (Reportes) ← HU-24c, HU-39a
└── HU-42c (Rendimiento) ← HU-30a, HU-29b

FASE 8 - TRANSVERSAL (Sprint 11)
├── HU-37 (Estado mesas) ← HU-36, HU-24c
├── HU-43a (Notif. pedidos) ← HU-24c, HU-29b
├── HU-43b (Alertas) ← HU-29c, HU-39b, HU-35
├── HU-44a (Sync pedidos)
├── HU-44b (Sync módulos)
└── HU-44c (Ciclo completo) ← Todos
```

---

## Wireframes

| Archivo | Módulo | HUs |
|---------|--------|-----|
| hu1-menu.svg | Menú | HU-01 a HU-03, HU-13, HU-14 |
| hu2-personalizacion.svg | Personalización | HU-04 a HU-08 |
| hu3-carrito.svg | Carrito | HU-09 a HU-12 |
| hu4-inicio-pedido.svg | Inicio | HU-15 a HU-17 |
| hu5-confirmacion.svg | Confirmación | HU-18 a HU-22 |
| hu6-seguimiento.svg | Seguimiento | HU-23 |
| hu7-gestion-pedidos.svg | Pedidos | HU-24a/b/c, HU-25a/b, HU-26, HU-27 |
| hu8-cocina.svg | Cocina | HU-28, HU-29a/b/c |
| hu9-estaciones.svg | Estaciones | HU-30a/b, HU-31 |
| hu10-riel.svg | Riel | HU-32 a HU-35 |
| hu11-mesas.svg | Mesas | HU-36, HU-37 |
| hu12-inventario.svg | Inventario | HU-38, HU-39a/b/c |
| hu13-admin-menu.svg | Admin Menú | HU-40a/b, HU-41 |
| hu14-reportes.svg | Reportes | HU-42b |
| hu15-notificaciones.svg | Notificaciones | HU-43a, HU-43b |
| hu16-integracion.svg | Integración | HU-44a, HU-44b, HU-44c |
| **hu42a-usuarios.svg** | **Admin Usuarios** | **HU-42a (NUEVO)** |
| **hu42c-rendimiento.svg** | **Rendimiento** | **HU-42c (NUEVO)** |

---

## Checkpoint INVEST Final

| Métrica | Antes | Después |
|---------|-------|---------|
| Total HUs | 44 | 56 |
| HUs con violaciones | 16 | 0 |
| Wireframes dañados | — | 0 |
| Wireframes nuevos | — | 2 |
| Issues creados | — | 22 |
| Issues reescritos | — | 3 |
| Dependencias documentadas | — | 8 |

**✅ Todas las 56 HUs cumplen INVEST:**
- **I**ndependiente
- **N**egotiable
- **V**aluable
- **E**stimable
- **S**mall
- **T**estable
