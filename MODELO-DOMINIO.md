# Modelo de Dominio Conceptual - Sistema de Autoservicio Restaurante

> Generado a partir de requerimientos RF-01 a RF-56 siguiendo prácticas DDD e ingeniería de requisitos.
> Modelo conceptual neutral tecnológicamente, centrado en el negocio.

---

## 1. Supuestos y aclaraciones

- **RF-06**: "agregar o eliminar ingredientes" se interpreta como personalización de un producto base (ej. quitar cebolla, agregar queso extra), no como modificación de la receta maestra.
- **RF-07**: "complementos o productos adicionales" son items independientes que se venden junto al principal (ej. papas fritas, bebida), no variantes del mismo producto.
- **RF-16**: "tipo de pedido: consumir en el restaurante o para llevar" define dos modalidades que afectan si se requiere mesa.
- **RF-35-38**: El "sistema de riel" es un transporte automatizado (tipo bandejas en rieles) que lleva pedidos de cocina a mesa; se modela como entidad `TransporteRiel`.
- **RF-48**: Cada producto tiene una estación de preparación asignada y tiempo estimado; esto sugiere que la estación es responsable de ese producto.
- **RF-49**: "usuarios y roles" implica gestión de acceso al sistema back-office (admin, cocinero, mesero, etc.), no al cliente final.
- **RF-54-56**: La integración y ciclo completo son transversales; no generan entidades nuevas, sino flujos entre las existentes.
- No se especifica gestión de pagos (pasarela, métodos, facturación); se asume que el pago es externo o se registra solo como confirmación de orden.
- No se especifica gestión de clientes registrados (fidelización, historial personal); los pedidos se asocian a mesa/sesión anónima.

---

## 2. Entidades de negocio

### Categoria
Agrupación lógica de productos en el menú (ej. Entradas, Platos Fuertes, Bebidas, Postres).

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| nombre | Texto | Sí | Longitud máx 100, único |
| descripcion | Texto | No | Longitud máx 500 |
| ordenVisualizacion | Número entero | Sí | ≥ 0 |
| activa | Booleano | Sí | Default: true |

---

### Producto
Artículo vendible que aparece en el menú digital. Tiene precio base, ingredientes base, y puede tener variantes, complementos y opciones de personalización.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| codigo | Texto | Sí | Único, longitud máx 20 |
| nombre | Texto | Sí | Longitud máx 150 |
| descripcion | Texto | No | Longitud máx 1000 |
| precioBase | Moneda | Sí | ≥ 0 |
| imagenUrl | Texto | No | URL válida |
| tiempoPreparacionEstimado | Número entero | Sí | Minutos, ≥ 1 |
| disponible | Booleano | Sí | Default: true |
| categoriaId | Identificador único | Sí | FK a Categoria |
| estacionPreparacionId | Identificador único | Sí | FK a EstacionCocina |

---

### VarianteProducto
Opción de tamaño, presentación o formato de un producto que modifica su precio base (ej. "Pequeño", "Mediano", "Grande"; "Individual", "Familiar").

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| productoId | Identificador único | Sí | FK a Producto |
| nombre | Texto | Sí | Longitud máx 50 |
| descripcion | Texto | No | Longitud máx 200 |
| ajustePrecio | Moneda | Sí | Puede ser negativo, 0 o positivo |
| ordenVisualizacion | Número entero | Sí | ≥ 0 |
| activa | Booleano | Sí | Default: true |

---

### Ingrediente
Insumo base usado en la preparación de productos. Se gestiona en inventario.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| codigo | Texto | Sí | Único, longitud máx 20 |
| nombre | Texto | Sí | Longitud máx 100 |
| unidadMedida | Texto | Sí | Ej: "g", "ml", "unidad", "kg" |
| stockActual | Número decimal | Sí | ≥ 0 |
| stockMinimo | Número decimal | Sí | ≥ 0 |
| costoUnitario | Moneda | No | ≥ 0 |

---

### ProductoIngrediente (entidad de unión/composición)
Relación entre Producto e Ingrediente que define la receta base: cantidad requerida por unidad de producto.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| productoId | Identificador único | Sí | FK a Producto |
| ingredienteId | Identificador único | Sí | FK a Ingrediente |
| cantidadRequerida | Número decimal | Sí | > 0 |
| esOpcional | Booleano | Sí | Default: false (si true, el cliente puede quitarlo) |
| cargoExtra | Moneda | No | ≥ 0, solo si esOpcional=true |

---

### Complemento
Producto adicional que se ofrece junto a un producto principal (ej. "Agregar papas fritas", "Agregar bebida"). Es un producto independiente con precio propio.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| productoPrincipalId | Identificador único | Sí | FK a Producto |
| productoComplementoId | Identificador único | Sí | FK a Producto (auto-referencia) |
| obligatorio | Booleano | Sí | Default: false |
| ordenVisualizacion | Número entero | Sí | ≥ 0 |

---

### Mesa
Mesa física del restaurante con identificador y capacidad.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| numero | Texto | Sí | Único, longitud máx 10 (ej. "A-01", "Mesa 5") |
| capacidad | Número entero | Sí | ≥ 1 |
| ubicacion | Texto | No | Longitud máx 100 (ej. "Terraza", "Salón principal") |
| estado | Enumerado | Sí | Valores: Libre, Ocupada, Reservada, EnLimpieza |
| activa | Booleano | Sí | Default: true |

---

### Pedido
Orden realizada por un cliente (autoservicio) o mesero. Agrupa líneas de pedido, tiene estado, tipo, mesa opcional y totales.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| codigoPedido | Texto | Sí | Único, legible por humano (ej. "PED-2024-00123") |
| fechaHoraCreacion | Fecha y hora | Sí | Auto: now() |
| tipoPedido | Enumerado | Sí | Valores: EnRestaurante, ParaLlevar |
| mesaId | Identificador único | No | FK a Mesa, obligatorio si tipoPedido=EnRestaurante |
| estado | Enumerado | Sí | Valores: Pendiente, Confirmado, EnPreparacion, ListoParaEntregar, EnTransporte, Entregado, Cancelado, Pagado |
| subtotal | Moneda | Sí | ≥ 0, calculado |
| total | Moneda | Sí | ≥ 0, calculado (subtotal + impuestos/propina si aplica) |
| observaciones | Texto | No | Longitud máx 500 |
| motivoCancelacion | Texto | No | Obligatorio si estado=Cancelado |

---

### LineaPedido
Detalle de un producto (con su variante, personalizaciones y complementos) dentro de un pedido.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| pedidoId | Identificador único | Sí | FK a Pedido |
| productoId | Identificador único | Sí | FK a Producto |
| varianteId | Identificador único | No | FK a VarianteProducto |
| cantidad | Número entero | Sí | ≥ 1 |
| precioUnitario | Moneda | Sí | ≥ 0, calculado al momento (base + variante + complementos + extras ingredientes) |
| subtotalLinea | Moneda | Sí | ≥ 0, calculado (precioUnitario × cantidad) |
| notasPersonalizacion | Texto | No | Longitud máx 500 (ej. "Sin cebolla, extra queso") |

---

### LineaPedidoIngredientePersonalizado
Personalización de ingredientes en una línea de pedido (ingredientes quitados o agregados extra respecto a la receta base).

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| lineaPedidoId | Identificador único | Sí | FK a LineaPedido |
| ingredienteId | Identificador único | Sí | FK a Ingrediente |
| accion | Enumerado | Sí | Valores: Quitado, AgregadoExtra |
| cantidadExtra | Número decimal | No | > 0, solo si accion=AgregadoExtra |
| cargoExtra | Moneda | No | ≥ 0, solo si accion=AgregadoExtra |

---

### LineaPedidoComplemento
Complementos seleccionados para una línea de pedido.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| lineaPedidoId | Identificador único | Sí | FK a LineaPedido |
| complementoId | Identificador único | Sí | FK a Complemento (que a su vez referencia Producto) |
| cantidad | Número entero | Sí | ≥ 1 |
| precioUnitario | Moneda | Sí | ≥ 0 (copia del precio del producto complemento al momento) |

---

### EstacionCocina
Estación de trabajo en cocina (ej. Parrilla, Freidora, Ensaladas, Postres, Bebidas).

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| nombre | Texto | Sí | Longitud máx 50, único |
| descripcion | Texto | No | Longitud máx 200 |
| ordenVisualizacion | Número entero | Sí | ≥ 0 |
| activa | Booleano | Sí | Default: true |

---

### TareaCocina
Unidad de trabajo asignada a una estación para preparar parte de un pedido. Una línea de pedido puede generar una o más tareas (según estaciones involucradas).

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| pedidoId | Identificador único | Sí | FK a Pedido |
| lineaPedidoId | Identificador único | Sí | FK a LineaPedido |
| estacionCocinaId | Identificador único | Sí | FK a EstacionCocina |
| estado | Enumerado | Sí | Valores: Pendiente, EnProceso, Completada, Cancelada |
| fechaHoraInicio | Fecha y hora | No | Se setea al pasar a EnProceso |
| fechaHoraFin | Fecha y hora | No | Se setea al completar |
| tiempoEstimadoMinutos | Número entero | Sí | ≥ 1 |
| prioridad | Número entero | Sí | ≥ 0 (mayor = más urgente) |

---

### TransporteRiel
Registro del transporte de un pedido terminado desde cocina hasta la mesa vía sistema de riel automatizado.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| pedidoId | Identificador único | Sí | FK a Pedido (1:1) |
| mesaDestinoId | Identificador único | Sí | FK a Mesa |
| estado | Enumerado | Sí | Valores: PendienteDespacho, EnTransporte, EntregadoEnMesa, Falla |
| fechaHoraDespacho | Fecha y hora | No | Cuando sale de cocina |
| fechaHoraEntrega | Fecha y hora | No | Cuando llega a mesa |
| codigoFalla | Texto | No | Si estado=Falla |
| descripcionFalla | Texto | No | Longitud máx 500 |

---

### MovimientoInventario
Registro de entrada/salida/ajuste de stock de ingredientes.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| ingredienteId | Identificador único | Sí | FK a Ingrediente |
| tipoMovimiento | Enumerado | Sí | Valores: Entrada, SalidaPedido, AjustePositivo, AjusteNegativo, Merma |
| cantidad | Número decimal | Sí | ≠ 0 (positivo para entradas, negativo para salidas) |
| fechaHora | Fecha y hora | Sí | Auto: now() |
| referenciaPedidoId | Identificador único | No | FK a Pedido, si tipo=SalidaPedido |
| motivo | Texto | No | Longitud máx 200 (ej. "Recepción proveedor", "Ajuste inventario físico") |
| usuarioId | Identificador único | No | FK a Usuario (quien registra) |

---

### Usuario
Cuenta de acceso al sistema back-office (administradores, cocineros, meseros, cajeros).

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| nombreUsuario | Texto | Sí | Único, longitud máx 50 |
| nombreCompleto | Texto | Sí | Longitud máx 150 |
| email | Texto | Sí | Único, formato email |
| rol | Enumerado | Sí | Valores: Administrador, Cocinero, JefeCocina, Mesero, Cajero, Supervisor |
| activo | Booleano | Sí | Default: true |
| ultimaConexion | Fecha y hora | No | |

---

### Notificacion
Evento de notificación/alerta generado por el sistema para usuarios o clientes.

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único |
| tipo | Enumerado | Sí | Valores: NuevoPedido, PedidoListo, PedidoRetrasado, StockBajo, FallaTransporte, CambioEstadoPedido |
| titulo | Texto | Sí | Longitud máx 100 |
| mensaje | Texto | Sí | Longitud máx 500 |
| destinatarioRol | Enumerado | No | Valores: Cocinero, JefeCocina, Mesero, Administrador, Cliente (si aplica) |
| destinatarioUsuarioId | Identificador único | No | FK a Usuario, si es notificación dirigida |
| pedidoId | Identificador único | No | FK a Pedido, si relacionado |
| leida | Booleano | Sí | Default: false |
| fechaHoraCreacion | Fecha y hora | Sí | Auto: now() |

---

### ConfiguracionSistema
Parámetros globales del sistema (singleton conceptual).

| Atributo | Tipo de dato | Obligatorio | Restricciones |
|---|---|---|---|
| id | Identificador único | Sí | Único (solo 1 registro) |
| tiempoAlertaRetrasoMinutos | Número entero | Sí | ≥ 1, default: 15 |
| umbralStockBajoPorcentaje | Número decimal | Sí | 0-100, default: 20 |
| ivaPorcentaje | Número decimal | Sí | ≥ 0, default: 19 |
| propinaSugeridaPorcentaje | Número decimal | No | 0-100, default: 10 |

---

## 3. Relaciones

| Origen | Relación | Destino | Cardinalidad | Tipo |
|---|---|---|---|---|
| Categoria | contiene | Producto | 1 : N | Composición |
| Producto | tieneComoBase | VarianteProducto | 1 : N | Composición |
| Producto | recetaBase | ProductoIngrediente | 1 : N | Composición |
| ProductoIngrediente | referencia | Ingrediente | N : 1 | Asociación |
| Producto | ofreceComplemento | Complemento | 1 : N | Composición |
| Complemento | esProducto | Producto | N : 1 | Asociación |
| Pedido | tieneMesa | Mesa | N : 1 | Asociación |
| Pedido | contiene | LineaPedido | 1 : N | Composición |
| LineaPedido | referenciaProducto | Producto | N : 1 | Asociación |
| LineaPedido | usaVariante | VarianteProducto | N : 1 | Asociación |
| LineaPedido | personalizaIngrediente | LineaPedidoIngredientePersonalizado | 1 : N | Composición |
| LineaPedidoIngredientePersonalizado | referencia | Ingrediente | N : 1 | Asociación |
| LineaPedido | incluyeComplemento | LineaPedidoComplemento | 1 : N | Composición |
| LineaPedidoComplemento | referenciaComplemento | Complemento | N : 1 | Asociación |
| Producto | preparadoEn | EstacionCocina | N : 1 | Asociación |
| Pedido | generaTarea | TareaCocina | 1 : N | Composición |
| TareaCocina | asignadaA | EstacionCocina | N : 1 | Asociación |
| TareaCocina | correspondeALinea | LineaPedido | N : 1 | Asociación |
| Pedido | transportadoPor | TransporteRiel | 1 : 1 | Composición |
| TransporteRiel | entregaEn | Mesa | N : 1 | Asociación |
| Ingrediente | registraMovimiento | MovimientoInventario | 1 : N | Composición |
| MovimientoInventario | originadoPorPedido | Pedido | N : 1 | Asociación |
| MovimientoInventario | registradoPor | Usuario | N : 1 | Asociación |
| Usuario | recibe | Notificacion | 1 : N | Asociación |
| Pedido | generaNotificacion | Notificacion | 1 : N | Asociación |

**Notas sobre cardinalidades:**
- `Categoria → Producto`: Composición porque un producto no tiene sentido sin su categoría (si se borra la categoría, los productos pierden su agrupación lógica).
- `Producto → VarianteProducto`: Composición; las variantes solo existen en el contexto de su producto padre.
- `Producto → ProductoIngrediente`: Composición; la receta es parte intrínseca del producto.
- `Producto → Complemento`: Composición; la relación de complemento se define en el contexto del producto principal.
- `Pedido → LineaPedido`: Composición fuerte; una línea no existe sin su pedido.
- `LineaPedido → personalizaciones/complementos`: Composición; son detalle de la línea.
- `Pedido → TareaCocina`: Composición; las tareas nacen y mueren con el pedido.
- `Pedido → TransporteRiel`: Composición 1:1; cada pedido tiene máximo un transporte.
- `Ingrediente → MovimientoInventario`: Composición; el historial de stock pertenece al ingrediente.

---

## 4. Reglas de negocio

- **RN-01**: Un Producto debe pertenecer exactamente a una Categoria activa.
- **RN-02**: Un Producto debe tener asignada exactamente una EstacionCocina activa.
- **RN-03**: El precio final de una LineaPedido = precioBase(Producto) + ajustePrecio(Variante si aplica) + Σ(cargoExtra ingredientes AgregadoExtra) + Σ(precioUnitario complementos seleccionados).
- **RN-04**: Si Producto.disponible = false, no puede agregarse a nuevos pedidos (pero pedidos existentes conservan sus líneas).
- **RN-05**: Un Pedido con tipoPedido = EnRestaurante debe tener mesaId obligatorio y la mesa debe estar en estado Libre u Ocupada.
- **RN-06**: Un Pedido solo puede cambiar a estado Confirmado si tiene al menos una LineaPedido.
- **RN-07**: Al confirmar un Pedido (estado → Confirmado), se debe:
  - Generar TareaCocina por cada LineaPedido, asignada a la EstacionCocina del Producto.
  - Descontar stock de Ingredientes según receta base × cantidad (crear MovimientoInventario tipo SalidaPedido).
  - Validar stock suficiente antes de confirmar; si falta stock, rechazar confirmación.
- **RN-08**: Una TareaCocina solo puede pasar a EnProceso si su Pedido está en EnPreparacion.
- **RN-09**: Un Pedido pasa a EnPreparacion cuando al menos una TareaCocina pasa a EnProceso.
- **RN-10**: Un Pedido pasa a ListoParaEntregar cuando TODAS sus TareaCocina están en Completada.
- **RN-11**: Al pasar Pedido a ListoParaEntregar, se crea TransporteRiel (estado PendienteDespacho) si tipoPedido = EnRestaurante.
- **RN-12**: TransporteRiel solo puede pasar a EnTransporte si Pedido está en ListoParaEntregar.
- **RN-13**: Al completar TransporteRiel (estado → EntregadoEnMesa), Pedido pasa a Entregado y Mesa pasa a Ocupada (si estaba Libre).
- **RN-14**: Si TransporteRiel entra en Falla, se genera Notificacion tipo FallaTransporte para JefeCocina y Administrador; Pedido permanece en ListoParaEntregar.
- **RN-15**: Stock de Ingrediente se actualiza automáticamente via MovimientoInventario; stockActual nunca puede ser < 0.
- **RN-16**: Si stockActual ≤ stockMinimo tras un movimiento, se genera Notificacion tipo StockBajo para Administrador y JefeCocina.
- **RN-17**: Un Complemento referencia un Producto que debe tener disponible = true.
- **RN-18**: LineaPedidoIngredientePersonalizado con accion=Quitado solo permitido si el ProductoIngrediente correspondiente tiene esOpcional=true.
- **RN-19**: LineaPedidoIngredientePersonalizado con accion=AgregadoExtra solo permitido si el Ingrediente tiene stockActual > 0.
- **RN-20**: Un Usuario con rol=Cocinero solo ve TareaCocina de su EstacionCocina asignada (asignación usuario-estación no modelada explícitamente; se infiere como dato operativo).
- **RN-21**: Un Pedido Cancelado debe registrar motivoCancelacion obligatorio; se revierten MovimientosInventario de tipo SalidaPedido asociados (crear Movimientos de tipo AjustePositivo).
- **RN-22**: CodigoPedido debe ser único y secuencial por día (ej. PED-YYYYMMDD-NNNN).
- **RN-23**: Mesa.estado se actualiza automáticamente: Libre → Ocupada al entregar pedido; Ocupada → Libre al cerrar cuenta/pagar (fuera de alcance: no se modela cierre de cuenta).
- **RN-24**: Notificacion destinatarioRol o destinatarioUsuarioId debe estar poblado (al menos uno).

---

## 5. Diagrama del modelo de dominio

```mermaid
classDiagram
    class Categoria {
        +id: Identificador único
        +nombre: Texto
        +descripcion: Texto
        +ordenVisualizacion: Entero
        +activa: Booleano
    }

    class Producto {
        +id: Identificador único
        +codigo: Texto
        +nombre: Texto
        +descripcion: Texto
        +precioBase: Moneda
        +imagenUrl: Texto
        +tiempoPreparacionEstimado: Entero
        +disponible: Booleano
        +categoriaId: Identificador único
        +estacionPreparacionId: Identificador único
    }

    class VarianteProducto {
        +id: Identificador único
        +productoId: Identificador único
        +nombre: Texto
        +descripcion: Texto
        +ajustePrecio: Moneda
        +ordenVisualizacion: Entero
        +activa: Booleano
    }

    class Ingrediente {
        +id: Identificador único
        +codigo: Texto
        +nombre: Texto
        +unidadMedida: Texto
        +stockActual: Decimal
        +stockMinimo: Decimal
        +costoUnitario: Moneda
    }

    class ProductoIngrediente {
        +id: Identificador único
        +productoId: Identificador único
        +ingredienteId: Identificador único
        +cantidadRequerida: Decimal
        +esOpcional: Booleano
        +cargoExtra: Moneda
    }

    class Complemento {
        +id: Identificador único
        +productoPrincipalId: Identificador único
        +productoComplementoId: Identificador único
        +obligatorio: Booleano
        +ordenVisualizacion: Entero
    }

    class Mesa {
        +id: Identificador único
        +numero: Texto
        +capacidad: Entero
        +ubicacion: Texto
        +estado: Enum[Libre, Ocupada, Reservada, EnLimpieza]
        +activa: Booleano
    }

    class Pedido {
        +id: Identificador único
        +codigoPedido: Texto
        +fechaHoraCreacion: DateTime
        +tipoPedido: Enum[EnRestaurante, ParaLlevar]
        +mesaId: Identificador único
        +estado: Enum[Pendiente, Confirmado, EnPreparacion, ListoParaEntregar, EnTransporte, Entregado, Cancelado, Pagado]
        +subtotal: Moneda
        +total: Moneda
        +observaciones: Texto
        +motivoCancelacion: Texto
    }

    class LineaPedido {
        +id: Identificador único
        +pedidoId: Identificador único
        +productoId: Identificador único
        +varianteId: Identificador único
        +cantidad: Entero
        +precioUnitario: Moneda
        +subtotalLinea: Moneda
        +notasPersonalizacion: Texto
    }

    class LineaPedidoIngredientePersonalizado {
        +id: Identificador único
        +lineaPedidoId: Identificador único
        +ingredienteId: Identificador único
        +accion: Enum[Quitado, AgregadoExtra]
        +cantidadExtra: Decimal
        +cargoExtra: Moneda
    }

    class LineaPedidoComplemento {
        +id: Identificador único
        +lineaPedidoId: Identificador único
        +complementoId: Identificador único
        +cantidad: Entero
        +precioUnitario: Moneda
    }

    class EstacionCocina {
        +id: Identificador único
        +nombre: Texto
        +descripcion: Texto
        +ordenVisualizacion: Entero
        +activa: Booleano
    }

    class TareaCocina {
        +id: Identificador único
        +pedidoId: Identificador único
        +lineaPedidoId: Identificador único
        +estacionCocinaId: Identificador único
        +estado: Enum[Pendiente, EnProceso, Completada, Cancelada]
        +fechaHoraInicio: DateTime
        +fechaHoraFin: DateTime
        +tiempoEstimadoMinutos: Entero
        +prioridad: Entero
    }

    class TransporteRiel {
        +id: Identificador único
        +pedidoId: Identificador único
        +mesaDestinoId: Identificador único
        +estado: Enum[PendienteDespacho, EnTransporte, EntregadoEnMesa, Falla]
        +fechaHoraDespacho: DateTime
        +fechaHoraEntrega: DateTime
        +codigoFalla: Texto
        +descripcionFalla: Texto
    }

    class MovimientoInventario {
        +id: Identificador único
        +ingredienteId: Identificador único
        +tipoMovimiento: Enum[Entrada, SalidaPedido, AjustePositivo, AjusteNegativo, Merma]
        +cantidad: Decimal
        +fechaHora: DateTime
        +referenciaPedidoId: Identificador único
        +motivo: Texto
        +usuarioId: Identificador único
    }

    class Usuario {
        +id: Identificador único
        +nombreUsuario: Texto
        +nombreCompleto: Texto
        +email: Texto
        +rol: Enum[Administrador, Cocinero, JefeCocina, Mesero, Cajero, Supervisor]
        +activo: Booleano
        +ultimaConexion: DateTime
    }

    class Notificacion {
        +id: Identificador único
        +tipo: Enum[NuevoPedido, PedidoListo, PedidoRetrasado, StockBajo, FallaTransporte, CambioEstadoPedido]
        +titulo: Texto
        +mensaje: Texto
        +destinatarioRol: Enum[Cocinero, JefeCocina, Mesero, Administrador, Cliente]
        +destinatarioUsuarioId: Identificador único
        +pedidoId: Identificador único
        +leida: Booleano
        +fechaHoraCreacion: DateTime
    }

    class ConfiguracionSistema {
        +id: Identificador único
        +tiempoAlertaRetrasoMinutos: Entero
        +umbralStockBajoPorcentaje: Decimal
        +ivaPorcentaje: Decimal
        +propinaSugeridaPorcentaje: Decimal
    }

    %% Relaciones
    Categoria *-- Producto : contiene (1:N)
    Producto *-- VarianteProducto : tiene (1:N)
    Producto *-- ProductoIngrediente : receta (1:N)
    ProductoIngrediente ..> Ingrediente : referencia (N:1)
    Producto *-- Complemento : ofrece (1:N)
    Complemento ..> Producto : esProducto (N:1)
    Pedido ..> Mesa : tieneMesa (N:1)
    Pedido *-- LineaPedido : contiene (1:N)
    LineaPedido ..> Producto : referencia (N:1)
    LineaPedido ..> VarianteProducto : usa (N:1)
    LineaPedido *-- LineaPedidoIngredientePersonalizado : personaliza (1:N)
    LineaPedidoIngredientePersonalizado ..> Ingrediente : referencia (N:1)
    LineaPedido *-- LineaPedidoComplemento : incluye (1:N)
    LineaPedidoComplemento ..> Complemento : referencia (N:1)
    Producto ..> EstacionCocina : preparadoEn (N:1)
    Pedido *-- TareaCocina : genera (1:N)
    TareaCocina ..> EstacionCocina : asignadaA (N:1)
    TareaCocina ..> LineaPedido : correspondeA (N:1)
    Pedido *-- TransporteRiel : transportadoPor (1:1)
    TransporteRiel ..> Mesa : entregaEn (N:1)
    Ingrediente *-- MovimientoInventario : registra (1:N)
    MovimientoInventario ..> Pedido : originadoPor (N:1)
    MovimientoInventario ..> Usuario : registradoPor (N:1)
    Usuario ..> Notificacion : recibe (1:N)
    Pedido ..> Notificacion : genera (1:N)
```

---

## 6. Formato tabular para Visual Paradigm

### Clases (Entidades)

| Clase | Atributo | Tipo | Visibilidad | Estereotipo |
|---|---|---|---|---|
| Categoria | id | String | public | «id» |
| Categoria | nombre | String | public | |
| Categoria | descripcion | String | public | |
| Categoria | ordenVisualizacion | Integer | public | |
| Categoria | activa | Boolean | public | |
| Producto | id | String | public | «id» |
| Producto | codigo | String | public | |
| Producto | nombre | String | public | |
| Producto | descripcion | String | public | |
| Producto | precioBase | Float | public | «money» |
| Producto | imagenUrl | String | public | |
| Producto | tiempoPreparacionEstimado | Integer | public | |
| Producto | disponible | Boolean | public | |
| Producto | categoriaId | String | public | «fk» |
| Producto | estacionPreparacionId | String | public | «fk» |
| VarianteProducto | id | String | public | «id» |
| VarianteProducto | productoId | String | public | «fk» |
| VarianteProducto | nombre | String | public | |
| VarianteProducto | descripcion | String | public | |
| VarianteProducto | ajustePrecio | Float | public | «money» |
| VarianteProducto | ordenVisualizacion | Integer | public | |
| VarianteProducto | activa | Boolean | public | |
| Ingrediente | id | String | public | «id» |
| Ingrediente | codigo | String | public | |
| Ingrediente | nombre | String | public | |
| Ingrediente | unidadMedida | String | public | |
| Ingrediente | stockActual | Float | public | |
| Ingrediente | stockMinimo | Float | public | |
| Ingrediente | costoUnitario | Float | public | «money» |
| ProductoIngrediente | id | String | public | «id» |
| ProductoIngrediente | productoId | String | public | «fk» |
| ProductoIngrediente | ingredienteId | String | public | «fk» |
| ProductoIngrediente | cantidadRequerida | Float | public | |
| ProductoIngrediente | esOpcional | Boolean | public | |
| ProductoIngrediente | cargoExtra | Float | public | «money» |
| Complemento | id | String | public | «id» |
| Complemento | productoPrincipalId | String | public | «fk» |
| Complemento | productoComplementoId | String | public | «fk» |
| Complemento | obligatorio | Boolean | public | |
| Complemento | ordenVisualizacion | Integer | public | |
| Mesa | id | String | public | «id» |
| Mesa | numero | String | public | |
| Mesa | capacidad | Integer | public | |
| Mesa | ubicacion | String | public | |
| Mesa | estado | String | public | «enum» |
| Mesa | activa | Boolean | public | |
| Pedido | id | String | public | «id» |
| Pedido | codigoPedido | String | public | |
| Pedido | fechaHoraCreacion | DateTime | public | |
| Pedido | tipoPedido | String | public | «enum» |
| Pedido | mesaId | String | public | «fk» |
| Pedido | estado | String | public | «enum» |
| Pedido | subtotal | Float | public | «money» |
| Pedido | total | Float | public | «money» |
| Pedido | observaciones | String | public | |
| Pedido | motivoCancelacion | String | public | |
| LineaPedido | id | String | public | «id» |
| LineaPedido | pedidoId | String | public | «fk» |
| LineaPedido | productoId | String | public | «fk» |
| LineaPedido | varianteId | String | public | «fk» |
| LineaPedido | cantidad | Integer | public | |
| LineaPedido | precioUnitario | Float | public | «money» |
| LineaPedido | subtotalLinea | Float | public | «money» |
| LineaPedido | notasPersonalizacion | String | public | |
| LineaPedidoIngredientePersonalizado | id | String | public | «id» |
| LineaPedidoIngredientePersonalizado | lineaPedidoId | String | public | «fk» |
| LineaPedidoIngredientePersonalizado | ingredienteId | String | public | «fk» |
| LineaPedidoIngredientePersonalizado | accion | String | public | «enum» |
| LineaPedidoIngredientePersonalizado | cantidadExtra | Float | public | |
| LineaPedidoIngredientePersonalizado | cargoExtra | Float | public | «money» |
| LineaPedidoComplemento | id | String | public | «id» |
| LineaPedidoComplemento | lineaPedidoId | String | public | «fk» |
| LineaPedidoComplemento | complementoId | String | public | «fk» |
| LineaPedidoComplemento | cantidad | Integer | public | |
| LineaPedidoComplemento | precioUnitario | Float | public | «money» |
| EstacionCocina | id | String | public | «id» |
| EstacionCocina | nombre | String | public | |
| EstacionCocina | descripcion | String | public | |
| EstacionCocina | ordenVisualizacion | Integer | public | |
| EstacionCocina | activa | Boolean | public | |
| TareaCocina | id | String | public | «id» |
| TareaCocina | pedidoId | String | public | «fk» |
| TareaCocina | lineaPedidoId | String | public | «fk» |
| TareaCocina | estacionCocinaId | String | public | «fk» |
| TareaCocina | estado | String | public | «enum» |
| TareaCocina | fechaHoraInicio | DateTime | public | |
| TareaCocina | fechaHoraFin | DateTime | public | |
| TareaCocina | tiempoEstimadoMinutos | Integer | public | |
| TareaCocina | prioridad | Integer | public | |
| TransporteRiel | id | String | public | «id» |
| TransporteRiel | pedidoId | String | public | «fk» |
| TransporteRiel | mesaDestinoId | String | public | «fk» |
| TransporteRiel | estado | String | public | «enum» |
| TransporteRiel | fechaHoraDespacho | DateTime | public | |
| TransporteRiel | fechaHoraEntrega | DateTime | public | |
| TransporteRiel | codigoFalla | String | public | |
| TransporteRiel | descripcionFalla | String | public | |
| MovimientoInventario | id | String | public | «id» |
| MovimientoInventario | ingredienteId | String | public | «fk» |
| MovimientoInventario | tipoMovimiento | String | public | «enum» |
| MovimientoInventario | cantidad | Float | public | |
| MovimientoInventario | fechaHora | DateTime | public | |
| MovimientoInventario | referenciaPedidoId | String | public | «fk» |
| MovimientoInventario | motivo | String | public | |
| MovimientoInventario | usuarioId | String | public | «fk» |
| Usuario | id | String | public | «id» |
| Usuario | nombreUsuario | String | public | |
| Usuario | nombreCompleto | String | public | |
| Usuario | email | String | public | |
| Usuario | rol | String | public | «enum» |
| Usuario | activo | Boolean | public | |
| Usuario | ultimaConexion | DateTime | public | |
| Notificacion | id | String | public | «id» |
| Notificacion | tipo | String | public | «enum» |
| Notificacion | titulo | String | public | |
| Notificacion | mensaje | String | public | |
| Notificacion | destinatarioRol | String | public | «enum» |
| Notificacion | destinatarioUsuarioId | String | public | «fk» |
| Notificacion | pedidoId | String | public | «fk» |
| Notificacion | leida | Boolean | public | |
| Notificacion | fechaHoraCreacion | DateTime | public | |
| ConfiguracionSistema | id | String | public | «id» |
| ConfiguracionSistema | tiempoAlertaRetrasoMinutos | Integer | public | |
| ConfiguracionSistema | umbralStockBajoPorcentaje | Float | public | |
| ConfiguracionSistema | ivaPorcentaje | Float | public | |
| ConfiguracionSistema | propinaSugeridaPorcentaje | Float | public | |

### Relaciones (Asociaciones)

| Origen | Destino | Nombre Rol Origen | Nombre Rol Destino | Multiplicidad Origen | Multiplicidad Destino | Tipo |
|---|---|---|---|---|---|---|
| Categoria | Producto | categorias | producto | 1 | * | Composición |
| Producto | VarianteProducto | producto | variantes | 1 | * | Composición |
| Producto | ProductoIngrediente | producto | ingredientesReceta | 1 | * | Composición |
| ProductoIngrediente | Ingrediente | productoIngrediente | ingrediente | * | 1 | Asociación |
| Producto | Complemento | productoPrincipal | complementos | 1 | * | Composición |
| Complemento | Producto | complemento | productoComplemento | * | 1 | Asociación |
| Pedido | Mesa | pedidos | mesa | * | 1 | Asociación |
| Pedido | LineaPedido | pedido | lineas | 1 | * | Composición |
| LineaPedido | Producto | lineaPedido | producto | * | 1 | Asociación |
| LineaPedido | VarianteProducto | lineaPedido | variante | * | 0..1 | Asociación |
| LineaPedido | LineaPedidoIngredientePersonalizado | lineaPedido | personalizaciones | 1 | * | Composición |
| LineaPedidoIngredientePersonalizado | Ingrediente | personalizacion | ingrediente | * | 1 | Asociación |
| LineaPedido | LineaPedidoComplemento | lineaPedido | complementosSeleccionados | 1 | * | Composición |
| LineaPedidoComplemento | Complemento | lineaComplemento | complemento | * | 1 | Asociación |
| Producto | EstacionCocina | productos | estacion | * | 1 | Asociación |
| Pedido | TareaCocina | pedido | tareas | 1 | * | Composición |
| TareaCocina | EstacionCocina | tareas | estacion | * | 1 | Asociación |
| TareaCocina | LineaPedido | tarea | lineaPedido | * | 1 | Asociación |
| Pedido | TransporteRiel | pedido | transporte | 1 | 1 | Composición |
| TransporteRiel | Mesa | transporte | mesaDestino | * | 1 | Asociación |
| Ingrediente | MovimientoInventario | ingrediente | movimientos | 1 | * | Composición |
| MovimientoInventario | Pedido | movimiento | pedidoOrigen | * | 1 | Asociación |
| MovimientoInventario | Usuario | movimiento | usuarioRegistro | * | 1 | Asociación |
| Usuario | Notificacion | usuario | notificaciones | 1 | * | Asociación |
| Pedido | Notificacion | pedido | notificaciones | 1 | * | Asociación |

---

## 7. Notas para el siguiente paso

1. **Estados de Pedido y TareaCocina**: Definir máquina de estados explícita (diagrama de estados) con transiciones válidas y eventos disparadores.
2. **Asignación Usuario–EstaciónCocina**: Modelo actual no incluye relación explícita; se necesita entidad `AsignacionEstacion` (usuario, estación, turno, fechaInicio, fechaFin) para RN-20.
3. **Cierre de cuenta / Pago**: No modelado; agregar entidad `Pago` (pedidoId, monto, metodo, fechaHora, estado, referenciaExterna) y `CuentaMesa` (mesaId, pedidoId, estado, fechaApertura, fechaCierre).
4. **Cliente registrado / Fidelización**: Si se requiere historial por cliente, agregar `Cliente` (id, nombre, telefono, email, puntosFidelidad) y vincular a `Pedido`.
5. **Proveedores y Órdenes de Compra**: Para reabastecimiento de inventario (Entrada en MovimientoInventario), agregar `Proveedor` y `OrdenCompra`.
6. **Auditoría / Logs**: Considerar entidad `LogSistema` para trazabilidad técnica (RF-56).
7. **API Externa / Integración Riel**: Definir contrato de eventos (PedidoListo → despachar riel; FallaRiel → alerta) para RF-54/55.
8. **Reportes**: Definir vistas materializadas o consultas OLAP para RF-50/51 (ventas por producto, tiempos por estación, pedidos por hora, etc.).