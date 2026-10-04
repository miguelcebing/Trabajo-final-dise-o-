# Modelo de dominio

> Mundo del problema (el negocio del restaurante), no el software. Sin claves foráneas, métodos ni visibilidad.
> Derivado de `RF-01` a `RF-56`. Fuente editable: [`fuentes/modelo-dominio.puml`](fuentes/modelo-dominio.puml) · XMI para Visual Paradigm: `fuentes/modelo-dominio.xmi`.

![Modelo de dominio](modelo-dominio.png)

**Tipos básicos:** Texto · Entero · Decimal · Moneda · Booleano · FechaHora.

**Supuestos:** el pago es externo (solo se registra); los "complementos" son productos independientes; el "carrito" es la compra previa a confirmar; `Usuario`/`Rol` y `ConfiguracionSistema` son software, no dominio.

## Conceptos

| Concepto | Descripción | Atributos (tipo) |
|---|---|---|
| **Categoria** | Agrupación del menú | nombre, descripcion, ordenVisualizacion (Entero), activa (Booleano) |
| **Producto** | Artículo vendible | codigo, nombre, descripcion, precioBase (Moneda), imagen, tiempoPreparacionEstimado (Entero), disponible (Booleano) |
| **VarianteProducto** | Tamaño/formato que ajusta precio | nombre, descripcion, ajustePrecio (Moneda), ordenVisualizacion (Entero), activa (Booleano) |
| **Ingrediente** | Insumo con stock | codigo, nombre, unidadMedida, stockActual (Decimal), stockMinimo (Decimal), costoUnitario (Moneda) |
| **RecetaProducto** | Ingrediente de un producto *(clase de asociación)* | cantidadRequerida (Decimal), esOpcional (Booleano), cargoExtra (Moneda) |
| **ComplementoProducto** | Producto ofrecido como complemento *(clase de asociación)* | obligatorio (Booleano), ordenVisualizacion (Entero) |
| **Carrito** | Compra mientras se arma el pedido | fechaHoraApertura (FechaHora), estado (Texto) |
| **Pedido** | Orden confirmada | codigo, fechaHoraCreacion (FechaHora), tipo, estado, subtotal (Moneda), total (Moneda), observaciones, motivoCancelacion |
| **LineaPedido** | Detalle de producto del pedido | cantidad (Entero), precioUnitario (Moneda), subtotalLinea (Moneda), notasPersonalizacion |
| **PersonalizacionIngrediente** | Ingrediente quitado/agregado *(clase de asociación)* | accion, cantidadExtra (Decimal), cargoExtra (Moneda) |
| **ComplementoSeleccionado** | Complemento elegido en una línea *(clase de asociación)* | cantidad (Entero), precioUnitario (Moneda) |
| **Pago** | Pago del pedido (alcance acotado) | monto (Moneda), medio, fechaHora (FechaHora), estado |
| **Mesa** | Mesa física | numero, capacidad (Entero), ubicacion, estado, activa (Booleano) |
| **EstacionCocina** | Puesto de cocina | nombre, descripcion, ordenVisualizacion (Entero), activa (Booleano) |
| **TareaCocina** | Trabajo de una estación | estado, fechaHoraInicio (FechaHora), fechaHoraFin (FechaHora), tiempoEstimadoMinutos (Entero), prioridad (Entero) |
| **TransporteRiel** | Traslado cocina→mesa | estado, fechaHoraDespacho (FechaHora), fechaHoraEntrega (FechaHora), descripcionFalla |
| **MovimientoInventario** | Entrada/salida/ajuste de stock | tipo, cantidad (Decimal), fechaHora (FechaHora), motivo |
| **Alerta** | Evento que requiere atención | tipo, descripcion, fechaHoraGeneracion (FechaHora), atendida (Booleano) |

## Asociaciones

| Origen | Verbo (rol) | Destino | Mult. | Tipo |
|---|---|---|---|---|
| Categoria | agrupa (productos) | Producto | 1 → 0..* | Agregación |
| Producto | ofrece (variantes) | VarianteProducto | 1 → 0..* | Composición |
| Producto | define (receta) | RecetaProducto | 1 → 0..* | Composición |
| RecetaProducto | usa (ingrediente) | Ingrediente | * → 1 | Asociación |
| Producto | ofrece (complementos) | ComplementoProducto | 1 → 0..* | Asociación |
| ComplementoProducto | complementa (producto) | Producto | * → 1 | Asociación |
| Producto | se prepara en (estación) | EstacionCocina | * → 1 | Asociación |
| Pedido | se atiende en (mesa) | Mesa | 0..* → 0..1 | Asociación |
| Pedido | contiene (líneas) | LineaPedido | 1 → 1..* | Composición |
| LineaPedido | refiere a (producto) | Producto | * → 1 | Asociación |
| LineaPedido | usa (variante) | VarianteProducto | * → 0..1 | Asociación |
| LineaPedido | personaliza (ingredientes) | PersonalizacionIngrediente | 1 → 0..* | Composición |
| PersonalizacionIngrediente | refiere a (ingrediente) | Ingrediente | * → 1 | Asociación |
| LineaPedido | incluye (complementos) | ComplementoSeleccionado | 1 → 0..* | Composición |
| ComplementoSeleccionado | refiere a (producto) | Producto | * → 1 | Asociación |
| Carrito | reúne (líneas) | LineaPedido | 1 → 0..* | Composición |
| Carrito | se confirma como (pedido) | Pedido | 0..1 → 0..1 | Asociación |
| Pago | corresponde a (pedido) | Pedido | 1 → 1 | Asociación |
| Pedido | genera (tareas) | TareaCocina | 1 → 0..* | Composición |
| TareaCocina | se realiza en (estación) | EstacionCocina | * → 1 | Asociación |
| TareaCocina | prepara (línea) | LineaPedido | * → 1 | Asociación |
| Pedido | se transporta mediante | TransporteRiel | 0..1 → 0..1 | Composición |
| TransporteRiel | se dirige a (mesa) | Mesa | * → 1 | Asociación |
| Ingrediente | registra (movimientos) | MovimientoInventario | 1 → 0..* | Asociación |
| MovimientoInventario | se origina por (pedido) | Pedido | * → 0..1 | Asociación |
| Alerta | se refiere a | Pedido / Ingrediente / TransporteRiel | 0..* → 0..1 | Asociación |

## Reglas de negocio

- **RN-01** Un Producto pertenece a una Categoria activa.
- **RN-02** Un Producto se prepara en una EstacionCocina activa.
- **RN-03** Precio de línea = precioBase + ajuste de variante + extras + complementos.
- **RN-04** Un Producto no disponible no se agrega a nuevos pedidos.
- **RN-05** Pedido EnRestaurante requiere Mesa Libre u Ocupada.
- **RN-06** Un Pedido se confirma solo si tiene al menos una LineaPedido.
- **RN-07** Al confirmar: se generan TareaCocina y se descuenta stock (validando existencias).
- **RN-08** Una TareaCocina pasa a EnProceso solo si el Pedido está EnPreparacion.
- **RN-09/10** El Pedido pasa a EnPreparacion con la primera tarea en proceso y a ListoParaEntregar cuando todas están completadas.
- **RN-11/12** En ListoParaEntregar se crea el TransporteRiel (si es EnRestaurante) y pasa a EnTransporte.
- **RN-13/14** Al entregar, el Pedido pasa a Entregado y la Mesa a Ocupada; una falla genera Alerta y deja el Pedido en ListoParaEntregar.
- **RN-15/16** El stock nunca es negativo; si baja del mínimo se genera Alerta de StockBajo.
- **RN-17/18/19** Complementos solo de productos disponibles; Quitado solo si la receta es opcional; AgregadoExtra solo con stock.
- **RN-20** Un Pedido Cancelado exige motivo y revierte las salidas de inventario.
- **RN-21/22** El código de Pedido es único por día; el estado de la Mesa cambia con el ciclo del pedido.
- **RN-23** Una Alerta se refiere a un Pedido, un Ingrediente o un TransporteRiel.

## Trazabilidad

| Requerimiento | Conceptos |
|---|---|
| RF-01–03 | Categoria, Producto |
| RF-04–06 | Ingrediente, RecetaProducto, PersonalizacionIngrediente |
| RF-05 | VarianteProducto |
| RF-07–08 | ComplementoProducto, ComplementoSeleccionado |
| RF-09–12 | Carrito, LineaPedido, Pedido, Pago |
| RF-13–14 | Producto (disponible) |
| RF-15–18 | Carrito, Pedido |
| RF-19–22 | Pedido, Pago |
| RF-23–27 | Pedido |
| RF-28–31 | TareaCocina, EstacionCocina, Alerta |
| RF-32–34 | EstacionCocina, TareaCocina |
| RF-35–38 | TransporteRiel, Mesa, Alerta |
| RF-39–41 | Mesa |
| RF-42–45 | Ingrediente, MovimientoInventario, Alerta |
| RF-46–48 | Producto, Categoria, VarianteProducto, ComplementoProducto, EstacionCocina |
| RF-49 | Fuera del dominio (acceso al sistema) |
| RF-50–51 | Pedido, TareaCocina, EstacionCocina |
| RF-52–53 | Alerta |
| RF-54–56 | Todos (flujo del Pedido) |

## Decisiones clave

| Relación | Tipo | Motivo |
|---|---|---|
| Categoria–Producto | Agregación | El producto existe sin la categoría. |
| Producto–VarianteProducto / Pedido–LineaPedido / Pedido–TareaCocina | Composición | La parte no existe sin el todo. |
| Pedido–TransporteRiel | Composición 0..1 | Solo aplica a pedidos EnRestaurante. |
| Ingrediente–MovimientoInventario | Asociación | El historial no depende de la vida del insumo. |
| RecetaProducto, ComplementoProducto, PersonalizacionIngrediente, ComplementoSeleccionado | Clase de asociación | La relación tiene datos propios. |

**Excluidos del dominio:** Usuario/Rol, ConfiguracionSistema y Notificacion dirigida (pertenecen al software).
