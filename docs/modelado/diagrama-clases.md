# Diagrama de clases — Diseño de software

> El [modelo de dominio](modelo-dominio.md) describe el **mundo del problema** (sin métodos ni visibilidad). Este
> documento es el **diseño del software**: clases con tipos, métodos, visibilidad, interfaces, herencia y patrones.
>
> **Sin código fuente todavía:** es el diseño propuesto; la verificación "diagrama ↔ código" queda pendiente.

Fuentes: [`fuentes/diagrama-clases-dominio.puml`](fuentes/diagrama-clases-dominio.puml) y
[`fuentes/diagrama-clases-arquitectura.puml`](fuentes/diagrama-clases-arquitectura.puml) · XMI para Visual Paradigm en `fuentes/*.xmi`.

### Clases del dominio
![Clases dominio](diagrama-clases-dominio.png)

### Arquitectura (aplicación, infraestructura e interfaz)
![Clases arquitectura](diagrama-clases-arquitectura.png)

## Paquetes (capas)

| Paquete | Responsabilidad | Ejemplos |
|---|---|---|
| `dominio` | Conceptos del negocio con comportamiento | `Pedido`, `Producto`, `Ingrediente`, `Mesa`, `Alerta` |
| `aplicacion` | Casos de uso y **puertos** (interfaces) | `ServicioPedidos`, `RepositorioPedidos`, `EstrategiaPago` |
| `infraestructura` | Implementaciones técnicas de los puertos | `RepositorioPedidosEnMemoria`, `AdaptadorRiel`, `PagoTarjeta` |
| `interfaz` | Puntos de entrada del usuario | `PantallaKiosco`, `PantallaCocina`, `PanelAdministracion` |

## Elementos UML

- **Visibilidad:** `-` privado, `+` público · **método estático:** `Pedido.generarCodigo(fecha)`.
- **Asociaciones** con nombre-verbo, multiplicidad, rol y navegabilidad.
- **Agregación** (`Categoria o-- Producto`) vs **composición** (`Pedido *-- LineaPedido`, `Producto *-- VarianteProducto`).
- **Clases de asociación:** `RecetaProducto`, `ComplementoProducto`, `PersonalizacionIngrediente`, `ComplementoSeleccionado`.
- **Herencia:** `Alerta` (abstracta) ← `AlertaRetraso`, `AlertaStockBajo`, `AlertaFallaTransporte`.
- **Interfaces y realización:** `RepositorioPedidos`, `EstrategiaPago`, `PuertoTransporteRiel`, `ObservadorPedido`, `Notificador`.
- **Enumeraciones:** `EstadoPedido`, `TipoPedido`, `EstadoMesa`, `EstadoTareaCocina`, `EstadoTransporte`, `TipoMovimiento`, `AccionPersonalizacion`, `MedioPago`, `EstadoPago`, `EstadoCarrito`.

## Patrones aplicados

| Patrón | Dónde | Motivo |
|---|---|---|
| **Facade** | `ServicioPedidos`, `ServicioCocina`… | Exponen casos de uso y ocultan el dominio a la interfaz. |
| **Repository** | Interfaces `Repositorio*` + impl. en `infraestructura` | Aíslan la persistencia. |
| **Strategy** | `EstrategiaPago` | Métodos de pago intercambiables. |
| **Observer** | `Pedido` → `ObservadorPedido` (`ServicioAlertas`) | Desacopla la generación de alertas. |
| **Adapter** | `PuertoTransporteRiel` + `AdaptadorRiel` | Traduce el dominio al sistema del riel. |

## Trazabilidad con la vista funcional

| Componente | Servicio(s) de aplicación |
|---|---|
| KioscoCliente | `ServicioMenu`, `ServicioPedidos` |
| GestionPedidos | `ServicioPedidos` |
| MotorCocina | `ServicioCocina` |
| ControlRiel | `ServicioRiel` |
| GestionInventario | `ServicioInventario` |
| GestionMesas | `ServicioMesas` |
| Notificaciones | `ServicioAlertas` |
| Reportes | `ServicioReportes` |
