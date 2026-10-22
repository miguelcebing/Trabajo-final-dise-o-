# Sistema de Autoservicio para Restaurante "RESTSMART"

**Proyecto Final — Diseño de Software**

Restaurante con autoservicio digital: el cliente consulta el menú en pantallas táctiles, arma y paga su pedido desde la misma pantalla, y la cocina lo recibe organizada por sectores de preparación.

> **Estado:** análisis y diseño. Aún no hay código fuente. Los requerimientos, historias de usuario y wireframes de este repositorio son la especificación vigente.

---

## Actores

| Actor | Tipo | Objetivo principal |
|---|---|---|
| Cliente | Primario | Consultar el menú, armar y pagar su pedido y seguir su estado |
| Cocina (por sector) | Primario | Ver y completar las tareas de preparación de su sector |
| Administrador del menú | Primario | Mantener el catálogo de productos y su sector de preparación |
| Sistema | Interno | Ejecutar las reglas automáticas de precio, enrutamiento y estado |
| Pasarela de pago | Sistema externo | Confirmar la transacción del pago (conceptual: pago simulado) |

Los sectores de cocina son fijos: **Bebidas, Parrilla, Cocina fría y Postres**. Un pedido con productos de varios sectores se divide y cada sector recibe solo sus ítems.

---

## Alcance

El alcance está definido por **15 requerimientos funcionales** y **21 historias de usuario**:

| Módulo | RF | HU |
|---|---|---|
| Menú | RF-01 a RF-03 | HU-01 a HU-03 |
| Pedido | RF-04 a RF-08 | HU-04 a HU-07, HU-09, HU-12 |
| Pago | RF-09, RF-10 | HU-08, HU-21 |
| Cocina (sectores) | RF-11 a RF-13 | HU-13 a HU-16 |
| Estado del pedido | RF-14 | HU-10, HU-11 |
| Administración del menú | RF-15 | HU-17 a HU-20 |

Queda **fuera del alcance**: inventario, reportes, riel de transporte, reservas de mesa, propinas, fidelización, domicilios y facturación. El pago es **simulado**: la pantalla registra la confirmación del cliente y deja preparado el punto de integración con una pasarela real.

---

## Documentación

| Documento | Contenido |
|---|---|
| [Requerimientos funcionales](docs/requerimientos/RF.md) | RF-01 a RF-15 con actor, prioridad MoSCoW y HU asociadas |
| [Historias de usuario](docs/historias/) | 21 HU con criterios de aceptación, INVEST, DoD y wireframe |
| [Wireframes](docs/wireframes/README.md) | Galería de los 21 wireframes en SVG |
| [Trazabilidad](docs/trazabilidad.md) | RF ↔ HU ↔ WF ↔ issue ↔ actor ↔ módulo |
| [Insumos para diagramas](docs/insumos-diagramas.md) | Actores, casos de uso, estados, entidades, flujos y pantallas |

Las historias de usuario viven además como **issues** en GitHub, creadas con la plantilla
[`.github/ISSUE_TEMPLATE/historia-de-usuario.md`](.github/ISSUE_TEMPLATE/historia-de-usuario.md).

---

## Estructura

```
├── README.md
├── .github/
│   └── ISSUE_TEMPLATE/        # Plantilla de historia de usuario y configuración
└── docs/
    ├── requerimientos/        # Requerimientos funcionales (RF)
    ├── historias/             # Historias de usuario (HU-01 a HU-21)
    ├── wireframes/            # Wireframes SVG y galería
    ├── trazabilidad.md        # Matriz de trazabilidad
    └── insumos-diagramas.md   # Insumos para los diagramas UML
```

---

## Integrantes

- Miguel Felipe Ceballos Ramírez

Proyecto académico — uso educativo.
