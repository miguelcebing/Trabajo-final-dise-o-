# Vista funcional (Rozanski & Woods)

> Describe **qué hace** el sistema y **de qué componentes** se compone, con las interfaces que cada uno ofrece y requiere.
> Fuente editable: [`../modelado/fuentes/vista-funcional-componentes.puml`](../modelado/fuentes/vista-funcional-componentes.puml) · XMI para Visual Paradigm: `../modelado/fuentes/vista-funcional-componentes.xmi`.

## Propósito

Define los elementos funcionales de la arquitectura, sus interfaces ofrecidas/requeridas y sus dependencias, de modo que cada requerimiento se pueda rastrear hasta el componente que lo realiza. Sirve de contrato entre análisis, diseño y desarrollo, y es la base de los paquetes del código.

## Diagrama de componentes

![Componentes](../modelado/vista-funcional-componentes.png)

## Catálogo de componentes

> Sin código todavía: la columna "implementación" son las clases del [diagrama de clases](../modelado/diagrama-clases.md).

| Componente | Responsabilidad | Ofrece | Requiere |
|---|---|---|---|
| **KioscoCliente** | Mostrar menú, armar carrito y confirmar pedido | — | `IMenu`, `IPedidos`, `IPago` |
| **GestionMenu** | Catálogo: productos, categorías, variantes, complementos, recetas | `IMenu` | `IRepositorioProductos` |
| **GestionPedidos** | Crear, confirmar, cancelar y seguir pedidos | `IPedidos` | `IMenu`, `IInventario`, `ICocina`, `IMesas`, `IPago` |
| **MotorCocina** | Repartir tareas por estación y controlar tiempos | `ICocina` | `IPedidos`, `INotificaciones` |
| **ControlRiel** | Transporte cocina→mesa y fallas | `IRiel` | `IPedidos`, `IMesas`, `IRielExterno` |
| **GestionMesas** | Registrar mesas y su estado | `IMesas` | `IRepositorioMesas` |
| **GestionInventario** | Existencias, movimientos y stock bajo | `IInventario` | `IMenu`, `INotificaciones` |
| **Notificaciones** | Alertas y avisos de estado | `INotificaciones` | `INotificador` |
| **Reportes** | Ventas y rendimiento por estación | `IReportes` | `IPedidos`, `ICocina` |
| **Administracion** | Usuarios/roles y configuración | `IAdministracion` | `IMenu`, `IReportes` |
| **PasarelaPago** *(externo)* | Procesar el pago | `IPago` | — |
| **SistemaRielExterno** *(externo)* | Hardware/software del riel | `IRielExterno` | — |

## Flujos principales

**Pedido en kiosco → cocina** (RF-15…23, RF-28)

![Secuencia pedido](../modelado/secuencia-pedido-kiosco.png)

**Preparación → riel → entrega** (RF-29…38)

![Secuencia riel](../modelado/secuencia-preparacion-riel.png)

**Alerta de stock bajo** (RF-43…45, RF-53)

![Secuencia stock](../modelado/secuencia-alerta-stock.png)

## Trazabilidad (requerimiento → componente)

| RF | Componente(s) |
|---|---|
| RF-01–03 | GestionMenu, KioscoCliente |
| RF-04–08 | GestionMenu, KioscoCliente, GestionPedidos |
| RF-09–14 | KioscoCliente, GestionPedidos, GestionMenu, GestionInventario |
| RF-15–23 | KioscoCliente, GestionPedidos, GestionMesas, MotorCocina |
| RF-24–27 | GestionPedidos |
| RF-28–34 | MotorCocina, Notificaciones, Administracion |
| RF-35–38 | ControlRiel, Notificaciones |
| RF-39–41 | GestionMesas, GestionPedidos |
| RF-42–45 | GestionInventario, Notificaciones |
| RF-46–48 | GestionMenu, Administracion |
| RF-49 | Administracion |
| RF-50–51 | Reportes |
| RF-52–53 | Notificaciones |
| RF-54–56 | Todos (orquestado por GestionPedidos) |

## Decisiones

- **GestionPedidos** orquesta el ciclo del pedido; el resto colabora por interfaces (sin ciclos fuertes).
- **Pago** es externo (`PasarelaPago`) y se abstrae con el patrón **Strategy**.
- **Notificaciones** se desacopla con el patrón **Observer** (el pedido publica eventos).
- **Riel** se aísla tras `IRielExterno` con el patrón **Adapter**.
- **Restricción:** sin código fuente, los servicios de la capa `aplicacion` deben corresponder 1:1 con estos componentes.
