# Sistema de Autoservicio para Restaurante "RESTSMART"

**Proyecto Final — Diseño de Software**

Restaurante con autoservicio digital: el cliente consulta el menú en pantallas táctiles, arma y paga su pedido desde la misma pantalla, y la cocina lo recibe organizada por sectores de preparación.

> **Estado:** análisis, diseño e implementación. El backend está en la carpeta [`restsmart/`](restsmart/) y el frontend en [`frontend/`](frontend/). Los requerimientos, historias de usuario y wireframes de este repositorio son la especificación vigente.

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
| [Diagramas](diagramas/) | Vistas de contexto, funcional, lógica, desarrollo y despliegue exportadas en PNG/JPG, con sus fuentes `.vpp` |

Las historias de usuario viven además como **issues** en GitHub, creadas con la plantilla
[`.github/ISSUE_TEMPLATE/historia-de-usuario.md`](.github/ISSUE_TEMPLATE/historia-de-usuario.md).

---

## Backend (código fuente)

La carpeta [`restsmart/`](restsmart/) contiene **únicamente el backend** (API REST) en **Java 21 con
Spring Boot** (solo Spring Boot), organizada en las cuatro capas de la vista de desarrollo.
El **frontend** se implementará por separado.

| Paquete | Capa |
|---|---|
| `com.restsmart.presentacion.controller` / `.dto` | Presentación / Controller + DTO |
| `com.restsmart.negocio.service` / `.contrato` | Negocio / Service + contratos |
| `com.restsmart.datos.repository` / `.secuencia` | Datos / Repository (MongoDB) + secuencias |
| `com.restsmart.modelo.dominio` / `.enumeracion` | Modelo de dominio + enumeraciones |

La estructura detallada está en [`restsmart/README.md`](restsmart/README.md).

La conexión a MongoDB Atlas se toma de la variable de entorno `MDB_MCP_CONNECTION_STRING`
(no hay credenciales en el repositorio).

```powershell
cd restsmart
.\mvnw.cmd spring-boot:run
```

---

## Frontend (código fuente)

La carpeta [`frontend/`](frontend/) contiene la **interfaz estática** (HTML + CSS +
JavaScript vanilla, sin build step) con la dirección visual **liquid glass +
claymorphism** y animaciones. Cubre las 21 historias de usuario: cliente (menú, carrito,
mesa, resumen, pago, comprobante y seguimiento), cocina por sector y administración.

```powershell
# terminal 2, desde la raíz del repositorio
python frontend/serve.py
```

Luego abrir <http://127.0.0.1:5173>. El proxy sirve `frontend/` y reenvía `/api/*` al
backend en `127.0.0.1:8080` (no hace falta tocar CORS ni modificar el backend).

El **pago es simulado en el frontend** (la API no expone RF-09/RF-10): el comprobante y
el seguimiento del pedido simulado viven en el navegador y quedan marcados como
demostración; los pedidos reales se consultan por número contra `/seguimiento`.
Detalles, rutas y límites en [`frontend/README.md`](frontend/README.md).

---

## Diagramas

Los diagramas se elaboraron en Visual Paradigm. En [`diagramas/`](diagramas/) están las
exportaciones finales en PNG/JPG y sus fuentes editables (`.vpp`).

### Vista de contexto (vista de sistema)

Ubica el sistema en su entorno: con quién interactúa y qué intercambia con cada actor o sistema externo.

![Vista de contexto del sistema](diagramas/Diagrama%20de%20contexto%20RestSmart%20finalizado.png)

### Vista funcional (componentes)

Descompone el sistema en componentes y las interfaces que **provisten** (lollipop) y que **requieren**
(socket) entre ellos, con la trazabilidad a RF y HU.

![Vista funcional por componentes](diagramas/diagrama%20vista%20funcional%20finalizado.jpg)

### Vista lógica (modelo de clases)

Modelo lógico completo de clases: atributos, operaciones, relaciones y multiplicidades del dominio.

![Vista lógica de clases](diagramas/diagrama%20vista%20logica%20dise%C3%B1o%20finalizado.jpg)

### Vista de desarrollo (implementación)

Organiza el sistema en capas y paquetes: **Presentación/Controller**, **Negocio Service**,
**Datos Repository** y **Modelo Dominio**, mostrando controladores, servicios y repositorios
con sus operaciones y dependencias.

![Vista de desarrollo por capas](diagramas/Diagrama%20de%20desarrollo%20dise%C3%B1o.jpg)

### Vista de despliegue

Distribuye el sistema en nodos y dispositivos: kiosco de autoservicio, pantalla de cocina por
sector y pantalla de administración (navegador web) contra el servidor de aplicación (JVM con
`restsmart.jar`), MongoDB Atlas sobre TLS y la pasarela de pago externa, comunicados por HTTPS REST.

![Vista de despliegue](diagramas/diagrama%20de%20vista%20de%20despliegue%20dise%C3%B1o.jpg)

| Archivo | Contenido |
|---|---|
| [Diagrama de contexto RestSmart finalizado.png](diagramas/Diagrama%20de%20contexto%20RestSmart%20finalizado.png) | Vista de contexto exportada |
| [diagrama vista funcional finalizado.jpg](diagramas/diagrama%20vista%20funcional%20finalizado.jpg) | Vista funcional por componentes exportada |
| [diagrama vista logica diseño finalizado.jpg](diagramas/diagrama%20vista%20logica%20dise%C3%B1o%20finalizado.jpg) | Vista lógica (modelo de clases) completa |
| [Diagrama de desarrollo diseño.jpg](diagramas/Diagrama%20de%20desarrollo%20dise%C3%B1o.jpg) | Vista de desarrollo (implementación) exportada |
| [diagrama de vista de despliegue diseño.jpg](diagramas/diagrama%20de%20vista%20de%20despliegue%20dise%C3%B1o.jpg) | Vista de despliegue exportada |
| [diagrama vista funcional.vpp](diagramas/diagrama%20vista%20funcional.vpp) | Fuente editable de la vista funcional (Visual Paradigm) |
| [driagrama de vista diseño.vpp](diagramas/driagrama%20de%20vista%20dise%C3%B1o.vpp) | Fuente editable de la vista de contexto (Visual Paradigm) |
| [Diagrama vista logica diseño completo .vpp](diagramas/Diagrama%20vista%20logica%20dise%C3%B1o%20completo%20.vpp) | Fuente editable de la vista lógica (Visual Paradigm) |
| [Diagrama vista de Desarrollo finalizandolo.vpp](diagramas/Diagrama%20vista%20de%20Desarrollo%20finalizandolo.vpp) | Fuente editable de las vistas de desarrollo y despliegue (Visual Paradigm) |

---

## Estructura

```
├── README.md
├── .github/
│   └── ISSUE_TEMPLATE/        # Plantilla de historia de usuario y configuración
├── restsmart/                 # Backend: API REST Spring Boot (Java 21 + MongoDB)
├── frontend/                  # Frontend estático (HTML/CSS/JS) + proxy local
├── diagramas/                 # Diagramas exportados (PNG/JPG) y fuentes .vpp
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
