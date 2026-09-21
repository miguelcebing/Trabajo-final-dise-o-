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

Ver imágenes PNG en esta carpeta:
- `modelo-dominio.png` — Versión simplificada (entidades y relaciones)
- `modelo-dominio-completo.png` — Versión detallada (con atributos)
