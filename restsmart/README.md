# RestSmart — Backend

Implementación del Sistema de Autoservicio para Restaurante **RestSmart** con **Java 21** y **Spring Boot** (solo Spring Boot), persistencia en **MongoDB Atlas**.

Este documento describe la estructura del **backend**. El frontend se implementará por separado.

---

## Requisitos

- Java 21
- Variable de entorno `MDB_MCP_CONNECTION_STRING` con la URI de MongoDB Atlas
- No requiere Maven instalado: se usa el Maven Wrapper incluido

---

## Ejecución

```powershell
cd restsmart
.\mvnw.cmd spring-boot:run
```

Compilar y empaquetar:

```powershell
.\mvnw.cmd -DskipTests package
```

La aplicación arranca en `http://localhost:8080`.

---

## Estructura

```
restsmart/
├── mvnw / mvnw.cmd               # Maven Wrapper
├── pom.xml                       # Spring Boot 4.x, Java 21
├── README.md                     # Este documento
└── src/
    ├── main/
    │   ├── java/com/restsmart/
    │   │   ├── RestsmartApplication.java
    │   │   ├── presentacion/             # Capa 1: Presentación
    │   │   │   ├── controller/           # Controladores REST
    │   │   │   └── dto/                  # Objetos de entrada/salida HTTP
    │   │   ├── negocio/                  # Capa 2: Negocio
    │   │   │   ├── service/              # Servicios de caso de uso
    │   │   │   └── contrato/             # Interfaces provistas (vista funcional)
    │   │   ├── datos/                    # Capa 3: Datos
    │   │   │   ├── repository/           # Repositorios MongoDB
    │   │   │   └── secuencia/            # Generación de IDs Integer
    │   │   └── modelo/dominio/           # Capa 4: Modelo de dominio
    │   │       └── enumeracion/          # Enumeraciones del dominio
    │   └── resources/
    │       └── application.properties    # URI y base de MongoDB
    └── test/java/com/restsmart/          # Prueba de contexto
```

---

## Capas y responsabilidades

| Capa | Paquete | Responsabilidad |
|---|---|---|
| Presentación | `presentacion.controller` | Expone endpoints REST, traduce HTTP a llamadas de servicio |
| Presentación (DTO) | `presentacion.dto` | Enlaza cuerpos JSON con tipos concretos |
| Negocio | `negocio.service` | Reglas de caso de uso y orquestación |
| Negocio (contratos) | `negocio.contrato` | Interfaces provistas por los componentes |
| Datos | `datos.repository` | Persistencia con Spring Data MongoDB |
| Datos (secuencias) | `datos.secuencia` | IDs `Integer` secuenciales |
| Dominio | `modelo.dominio` | Entidades, objetos de valor y reglas de negocio |
| Dominio (enums) | `modelo.dominio.enumeracion` | Estados, sectores y tipos |

La regla de dependencia es **hacia adentro**: presentación → negocio → datos → dominio. El dominio no conoce controladores ni servicios.

---

## Componentes principales

### Controladores

| Controlador | Ruta base | Responsabilidad |
|---|---|---|
| `MenuController` | `/menu` | Consulta de menú, detalle, opciones y precio |
| `PedidoController` | `/pedido` | Carrito, mesa, resumen y cancelación |
| `CocinaController` | `/cocina` | Tareas por sector, detalle e historial |
| `SeguimientoController` | `/seguimiento` | Estado del pedido y aviso de pedido listo |
| `AdministracionMenuController` | `/admin/productos` | Alta, edición, desactivación y sector |

### Servicios

| Servicio | Contrato | Responsabilidad |
|---|---|---|
| `GestionMenuService` | `iConsultaMenu`, `iAdministrarCatalogo` | Menú, validación de opciones y precio |
| `GestionPedidoService` | — | Carrito, mesa y confirmación de pedido |
| `GestionPagoService` | `iProcesarPago` | Datos de contacto, pago simulado y enrutamiento a cocina |
| `GestionCocinaService` | `iNotificarAvanceCocina` | Tareas por sector e historial del turno |
| `SeguimientoPedidoService` | `iConsultarEstado` | Estado del pedido y aviso al cliente |
| `AdministracionMenuService` | — | Administración del catálogo |

### Repositorios

`CategoriaRepository`, `ProductoRepository`, `MesaRepository`, `PedidoRepository`, `TareaPreparacionRepository`.

---

## Endpoints

| Método | Ruta | Operación |
|---|---|---|
| GET | `/menu/categoria/{categoriaId}` | Menú por categoría |
| GET | `/menu/producto/{id}` | Detalle de producto |
| POST | `/menu/producto/{id}/opciones` | Validar variante/complementos |
| POST | `/menu/producto/{id}/precio` | Calcular precio del ítem |
| POST | `/pedido/items?productoId=&cantidad=` | Agregar producto al carrito |
| PUT | `/pedido/items/{itemId}/cantidad?cantidad=` | Modificar cantidad |
| DELETE | `/pedido/items/{itemId}` | Quitar ítem |
| PUT | `/pedido/mesa?numeroMesa=` | Indicar mesa |
| GET | `/pedido/resumen` | Resumen del pedido |
| DELETE | `/pedido/{pedidoId}` | Cancelar pedido |
| GET | `/cocina/tareas?sector=` | Tareas pendientes del sector |
| GET | `/cocina/tareas/{tareaId}` | Detalle de tarea |
| PUT | `/cocina/tareas/{tareaId}/completar` | Marcar tarea completada |
| GET | `/cocina/historial?sector=` | Historial del turno |
| GET | `/seguimiento/{pedidoId}/estado` | Estado del pedido |
| GET | `/seguimiento/{pedidoId}/aviso` | Consultar aviso de pedido listo |
| POST | `/admin/productos?nombre=&precio=&categoria=&sector=` | Crear producto |
| PUT | `/admin/productos/{id}/precio?precio=&descripcion=` | Modificar precio/descripción |
| DELETE | `/admin/productos/{id}` | Desactivar producto |
| PUT | `/admin/productos/{id}/sector?sector=` | Asignar sector de cocina |

---

## Persistencia

- Base: `restsmart`
- Colecciones: `categorias`, `productos`, `mesas`, `pedidos`, `tareasPreparacion` y `secuencias`.
- `Pago`, `DatoContacto`, `ItemPedido` y `OpcionSeleccionada` se guardan **embebidos** dentro de `Pedido`.
- Las referencias a `Categoria`, `Producto`, `Mesa` y `Pedido` usan **`@DBRef`**.
- Los IDs son `Integer` y se generan con la colección `secuencias` (no se usa `ObjectId`).

La persistencia se detalla en la sección anterior y en la vista lógica de los diagramas.

---

## Convenciones

- Nombres de clases, métodos y capas tomados de los diagramas UML.
- Sin Lombok ni frameworks adicionales.
- Inyección por constructor.
- Errores de negocio con `IllegalArgumentException`.
- Sin credenciales en el repositorio: la URI se lee de `MDB_MCP_CONNECTION_STRING`.
