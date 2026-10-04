# Diagrama de clases — Diseño de software

> **Diferencia con el modelo de dominio:** el [modelo de dominio](modelo-dominio.md) describe el **mundo del problema**
> (conceptos del negocio, sin métodos ni visibilidad). Este documento describe el **diseño del software**: clases con
> atributos tipados, métodos, visibilidad, interfaces, herencia y patrones de diseño.

> **Aviso de consistencia (importante):** el repositorio **no contiene código fuente todavía**. Este diagrama es el
> **diseño propuesto** y la verificación "cada clase del diagrama existe en el código y viceversa" queda **pendiente**
> hasta que exista implementación. Cuando se programe, el código deberá ajustarse a este diagrama (o el diagrama al
> código, documentando el cambio).

El diagrama se presenta en **dos vistas** para mantener la legibilidad:

- **Clases del dominio:** fuente [`fuentes/diagrama-clases-dominio.puml`](fuentes/diagrama-clases-dominio.puml) · `diagrama-clases-dominio.png` / `.svg`
- **Arquitectura (aplicación, infraestructura e interfaz):** fuente [`fuentes/diagrama-clases-arquitectura.puml`](fuentes/diagrama-clases-arquitectura.puml) · `diagrama-clases-arquitectura.png` / `.svg`

---

## 1. Paquetes (capas)

El diseño se organiza en cuatro paquetes por responsabilidad, alineados con la vista funcional (Rozanski & Woods):

| Paquete | Responsabilidad | Ejemplos |
|---|---|---|
| `dominio` | Reglas y conceptos del negocio con comportamiento | `Pedido`, `Producto`, `Ingrediente`, `Mesa`, `TareaCocina`, `Alerta` |
| `aplicacion` | Casos de uso (servicios de aplicación) y **puertos** (interfaces) | `ServicioPedidos`, `ServicioCocina`, `RepositorioPedidos`, `EstrategiaPago` |
| `infraestructura` | Implementaciones técnicas de los puertos | `RepositorioPedidosEnMemoria`, `AdaptadorRiel`, `PagoTarjeta` |
| `interfaz` | Puntos de entrada del usuario (kiosco, cocina, mesero, admin) | `PantallaKiosco`, `PantallaCocina`, `PanelAdministracion` |

---

## 2. Elementos UML utilizados

- **Visibilidad:** `-` privado, `+` público (atributos privados, operaciones públicas).
- **Atributos tipados:** `UUID`, `String`, `int`, `boolean`, `BigDecimal`, `LocalDateTime`, enumeraciones y colecciones genéricas (`List~LineaPedido~`).
- **Métodos** con parámetros y tipo de retorno.
- **Método estático:** `Pedido.generarCodigo(fecha)` (genera el código único y secuencial por día, RF-18).
- **Asociaciones** con nombre-verbo, multiplicidades, roles y navegabilidad (`-->`).
- **Agregación** (`o--`): `Categoria o-- Producto` (el producto existe sin la categoría).
- **Composición** (`*--`): `Pedido *-- LineaPedido`, `Producto *-- VarianteProducto`, `Pedido *-- TareaCocina`.
- **Clases de asociación** (`«clase de asociación»`): `RecetaProducto`, `ComplementoProducto`, `PersonalizacionIngrediente`, `ComplementoSeleccionado`.
- **Herencia** (`<|--`): `Alerta` (abstracta) ← `AlertaRetraso`, `AlertaStockBajo`, `AlertaFallaTransporte`.
- **Interfaces y realización** (`..|>`): `RepositorioPedidos`, `EstrategiaPago`, `PuertoTransporteRiel`, `ObservadorPedido`, `Notificador` con sus implementaciones en `infraestructura`.
- **Dependencias** (`..>`): servicios → repositorios/puertos; interfaz → servicios.
- **Enumeraciones** (`«enumeration»`): `EstadoPedido`, `TipoPedido`, `EstadoMesa`, `EstadoTareaCocina`, `EstadoTransporte`, `TipoMovimiento`, `AccionPersonalizacion`, `MedioPago`, `EstadoPago`, `EstadoCarrito`.
- **Estereotipos:** `«clase de asociación»`, `«Observer»`, y notas para los patrones.

---

## 3. Patrones de diseño aplicados

| Patrón | Dónde | Justificación |
|---|---|---|
| **Facade** | `ServicioPedidos`, `ServicioCocina`, `ServicioRiel`… | Exponen operaciones de caso de uso y ocultan la complejidad del dominio a la capa de interfaz. |
| **Repository** | Interfaces `Repositorio*` + impl. en `infraestructura` | Aíslan la persistencia y permiten cambiar el almacenamiento sin tocar el dominio. |
| **Strategy** | `EstrategiaPago` (`PagoEfectivo`, `PagoTarjeta`, `PagoExterno`) | Los métodos de pago son intercambiables sin condicionales. |
| **Observer** | `Pedido` notifica a `ObservadorPedido`; `ServicioAlertas` observa | Desacopla la generación de alertas de los cambios de estado del pedido (RF-52/53). |
| **Adapter** | `PuertoTransporteRiel` + `AdaptadorRiel` | Traduce el dominio al sistema externo del riel (RF-36). |
| **Máquina de estados** | `Pedido.cambiarEstado` + `EstadoPedido` | El ciclo de vida del pedido (RF-25) está regulado por transiciones válidas. |

---

## 4. Catálogo de clases del dominio

| Clase | Responsabilidad |
|---|---|
| `Categoria` | Agrupar productos del menú. |
| `Producto` | Artículo vendible; calcula su precio con variante y extras; controla disponibilidad. |
| `VarianteProducto` | Ajuste de precio por tamaño/presentación. |
| `Ingrediente` | Insumo con stock; aplica movimientos y detecta reposición. |
| `RecetaProducto` | Cantidad y opcionalidad de un ingrediente en un producto. |
| `ComplementoProducto` | Oferta de un producto como complemento de otro. |
| `Carrito` | Compra en construcción; se confirma como `Pedido`. |
| `Pedido` | Orden confirmada; estado, líneas, totales y notificación a observadores. |
| `LineaPedido` | Detalle de producto dentro del pedido. |
| `PersonalizacionIngrediente` | Ingrediente quitado/agregado a una línea. |
| `ComplementoSeleccionado` | Complemento elegido para una línea. |
| `Pago` | Registro del pago de un pedido. |
| `Mesa` | Estado y ocupación de la mesa. |
| `EstacionCocina` | Puesto de trabajo de cocina. |
| `TareaCocina` | Unidad de trabajo; inicio, fin, retraso. |
| `TransporteRiel` | Traslado por riel; despacho, entrega y fallas. |
| `MovimientoInventario` | Entrada/salida/ajuste de stock. |
| `Alerta` (abstracta) | Evento que requiere atención; tres subtipos. |

---

## 5. Trazabilidad con la vista funcional

Cada componente de la [vista funcional](../arquitectura/vista-funcional.md) se corresponde con uno o más servicios de aplicación:

| Componente (vista funcional) | Servicio(s) de aplicación |
|---|---|
| KioscoCliente | `ServicioMenu`, `ServicioPedidos` |
| GestionPedidos | `ServicioPedidos` |
| MotorCocina | `ServicioCocina` |
| ControlRiel | `ServicioRiel` |
| GestionInventario | `ServicioInventario` |
| GestionMesas | `ServicioMesas` |
| Notificaciones | `ServicioAlertas` |
| Reportes | `ServicioReportes` |
