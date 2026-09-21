# Modelo de Dominio - Resumen

> Sistema de Autoservicio Restaurante | RF-01 a RF-56 | Modelo conceptual neutral tecnológicamente.

---

## Supuestos clave

- **Personalización** (RF-06): quitar/agregar ingredientes a un producto base, no modificar receta maestra.
- **Complementos** (RF-07): productos independientes que se venden junto al principal (ej. papas fritas, bebida).
- **Tipo de pedido** (RF-16): EnRestaurante (requiere mesa) o ParaLlevar.
- **Sistema de riel** (RF-35-38): transporte automatizado de bandejas de cocina a mesa.
- **Estación por producto** (RF-48): cada producto tiene una estación de cocina asignada.
- **Usuarios back-office** (RF-49): admin, cocinero, mesero, cajero; no cliente final.
- **Sin pagos ni clientes** registrados en el modelo actual.

---

## Entidades (17)

| Entidad | Descripción | Atributos clave |
|---|---|---|
| **Categoria** | Agrupación del menú (Entradas, Bebidas...) | nombre, ordenVisualizacion, activa |
| **Producto** | Artículo vendible del menú | codigo, nombre, precioBase, tiempoPreparacionEstimado, disponible |
| **VarianteProducto** | Tamaño/formato (Pequeño, Grande...) | nombre, ajustePrecio |
| **Ingrediente** | Insumo base con stock | codigo, nombre, unidadMedida, stockActual, stockMinimo |
| **ProductoIngrediente** | Receta: vincula producto con ingrediente | cantidadRequerida, esOpcional, cargoExtra |
| **Complemento** | Producto adicional Offered junto al principal | obligatorio |
| **Mesa** | Mesa física del restaurante | numero, capacidad, ubicacion, estado (Libre/Ocupada/Reservada/EnLimpieza) |
| **Pedido** | Orden del cliente | codigoPedido, tipoPedido, estado, subtotal, total |
| **LineaPedido** | Detalle de producto dentro del pedido | cantidad, precioUnitario, subtotalLinea, notasPersonalizacion |
| **LineaPedidoIngredientePersonalizado** | Ingrediente quitado o agregado extra | accion (Quitado/AgregadoExtra), cantidadExtra, cargoExtra |
| **LineaPedidoComplemento** | Complementos seleccionados por línea | cantidad, precioUnitario |
| **EstacionCocina** | Estación de trabajo (Parrilla, Freidora...) | nombre, ordenVisualizacion |
| **TareaCocina** | Unidad de trabajo por estación | estado (Pendiente/EnProceso/Completada/Cancelada), tiempoEstimadoMinutos, prioridad |
| **TransporteRiel** | Transporte automatizado cocina→mesa | estado (PendienteDespacho/EnTransporte/EntregadoEnMesa/Falla) |
| **MovimientoInventario** | Entrada/salida/ajuste de stock | tipoMovimiento, cantidad, motivo |
| **Usuario** | Acceso back-office | nombreUsuario, email, rol (Administrador/Cocinero/JefeCocina/Mesero/Cajero/Supervisor) |
| **Notificacion** | Alerta del sistema | tipo, titulo, mensaje, destinatarioRol, leida |
| **ConfiguracionSistema** | Parámetros globales (singleton) | tiempoAlertaRetrasoMinutos, umbralStockBajoPorcentaje, ivaPorcentaje |

---

## Relaciones principales

```
Categoria 1──N Producto 1──N VarianteProducto
                │ 1──N ProductoIngrediente N──1 Ingrediente
                │ 1──N Complemento N──1 Producto
                │ N──1 EstacionCocina
                │
Pedido N──1 Mesa
      1──N LineaPedido N──1 Producto
                     │ N──0..1 VarianteProducto
                     │ 1──N LineaPedidoIngredientePersonalizado N──1 Ingrediente
                     │ 1──N LineaPedidoComplemento N──1 Complemento
      1──N TareaCocina N──1 EstacionCocina
      1──0..1 TransporteRiel N──1 Mesa
      1──N Notificacion N──1 Usuario

Ingrediente 1──N MovimientoInventario N──0..1 Pedido
                                N──1 Usuario
```

---

## Reglas de negocio (24)

| RN | Regla |
|---|---|
| RN-01 | Producto pertenece a exactamente 1 Categoria activa |
| RN-02 | Producto tiene asignada 1 EstacionCocina activa |
| RN-03 | Precio línea = base + variante + extras ingredientes + complementos |
| RN-04 | Producto no disponible no se agrega a nuevos pedidos |
| RN-05 | Pedido EnRestaurante requiere mesaId obligatorio |
| RN-06 | Pedido Confirmado necesita al menos 1 LineaPedido |
| RN-07 | Al confirmar: genera TareaCocina, descuenta stock, valida stock |
| RN-08 | TareaCocina → EnProso solo si Pedido está en EnPreparacion |
| RN-09 | Pedido → EnPreparacion cuando 1+ TareaCocina pasa a EnProceso |
| RN-10 | Pedido → ListoParaEntregar cuando TODAS las TareaCocina Completada |
| RN-11 | ListoParaEntregar crea TransporteRiel si EnRestaurante |
| RN-12 | TransporteRiel → EnTransporte solo si Pedido ListoParaEntregar |
| RN-13 | TransporteRiel Entregado → Pedido Entregado + Mesa Ocupada |
| RN-14 | Falla riel → Notificacion FallaTransporte; Pedido permanece Listo |
| RN-15 | Stock nunca < 0; se actualiza via MovimientoInventario |
| RN-16 | Stock ≤ mínimo → Notificacion StockBajo |
| RN-17 | Complemento referencia Producto disponible = true |
| RN-18 | Quitado solo si esOpcional = true |
| RN-19 | AgregadoExtra solo si stock > 0 |
| RN-20 | Cocinero ve solo tareas de su estación |
| RN-21 | Cancelado registra motivo; revierte movimientos SalidaPedido |
| RN-22 | CodigoPedido único secuencial por día |
| RN-23 | Mesa: Libre→Ocupada al entregar; Ocupada→Libre al cerrar |
| RN-24 | Notificacion requiere destinatarioRol o destinatarioUsuarioId |

---

## Diagrama

Ver imágenes PNG en esta carpeta:
- `modelo-dominio.png` — Versión simplificada (entidades y relaciones)
- `modelo-dominio-completo.png` — Versión detallada (con atributos)
