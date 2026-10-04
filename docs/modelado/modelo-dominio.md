# Modelo de dominio — Sistema de Autoservicio para Restaurante

> Representa el **mundo del problema** (el negocio del restaurante), no el software.
> Es neutral tecnológicamente: no contiene claves foráneas, métodos, visibilidad ni tipos de programación.
> Derivado de los requerimientos `RF-01` a `RF-56` y de la especificación funcional (56 HU INVEST).

---

## 1. Propósito y alcance

El modelo describe los conceptos del negocio de un restaurante con autoservicio digital:
qué se vende (menú), cómo se pide (carrito y pedido), cómo se prepara (cocina por estaciones),
cómo se entrega (riel), cómo se controla el consumo (inventario) y qué eventos relevantes se vigilan (alertas).
Quedan **fuera** del dominio las preocupaciones puramente técnicas (usuarios, roles, configuración del sistema,
notificaciones dirigidas a cuentas de usuario), que pertenecen al diseño del software y no al negocio.

---

## 2. Supuestos declarados

- **RF-06** "agregar o eliminar ingredientes" = personalización de un producto base (quitar cebolla, agregar queso extra), no modificación de la receta maestra.
- **RF-07** "complementos" = productos independientes que se ofrecen junto a un principal (papas, bebida), no variantes del mismo.
- **RF-16** el tipo de pedido define dos modalidades: `EnRestaurante` (requiere mesa) o `ParaLlevar` (sin mesa).
- **RF-35–38** el "riel" es un transporte automatizado de bandejas de cocina a mesa; se modela como `TransporteRiel`.
- **RF-12 y RF-20** mencionan el pago; se incluye `Pago` con **alcance acotado**: solo se registra monto, medio y estado; la pasarela es externa.
- **RF-09–11** el "carrito" es un concepto de negocio propio de la etapa previa a confirmar el pedido; se modela como `Carrito`.
- **RF-49** "usuarios y roles" es gestión de acceso al sistema → **no** es un concepto del dominio del restaurante.
- No se modelan clientes registrados (fidelización): el pedido se asocia a mesa o a una sesión anónima de autoservicio.

---

## 3. Conceptos del dominio

Tipos básicos usados: `Texto`, `Entero`, `Decimal`, `Moneda`, `Booleano`, `FechaHora`.

### Menú

#### Categoria
Agrupación lógica de productos del menú (Entradas, Platos fuertes, Bebidas, Postres).

| Atributo | Tipo | Descripción |
|---|---|---|
| nombre | Texto | Nombre de la categoría (único) |
| descripcion | Texto | Detalle opcional |
| ordenVisualizacion | Entero | Orden de aparición (≥ 0) |
| activa | Booleano | Si se muestra en el menú |

#### Producto
Artículo vendible del menú.

| Atributo | Tipo | Descripción |
|---|---|---|
| codigo | Texto | Código legible (único) |
| nombre | Texto | Nombre del producto |
| descripcion | Texto | Detalle del producto |
| precioBase | Moneda | Precio sin variantes ni extras (≥ 0) |
| imagen | Texto | Referencia a la imagen |
| tiempoPreparacionEstimado | Entero | Minutos estimados de preparación (≥ 1) |
| disponible | Booleano | Si puede pedirse actualmente |

#### VarianteProducto
Tamaño, presentación o formato de un producto que ajusta su precio (Pequeño, Mediano, Familiar).

| Atributo | Tipo | Descripción |
|---|---|---|
| nombre | Texto | Nombre de la variante |
| descripcion | Texto | Detalle opcional |
| ajustePrecio | Moneda | Puede ser negativo, cero o positivo |
| ordenVisualizacion | Entero | Orden de aparición (≥ 0) |
| activa | Booleano | Si se ofrece |

#### Ingrediente
Insumo usado en la preparación; su consumo afecta el inventario.

| Atributo | Tipo | Descripción |
|---|---|---|
| codigo | Texto | Código (único) |
| nombre | Texto | Nombre del insumo |
| unidadMedida | Texto | g, ml, unidad, kg… |
| stockActual | Decimal | Existencia actual (≥ 0) |
| stockMinimo | Decimal | Umbral de reposición (≥ 0) |
| costoUnitario | Moneda | Costo por unidad (≥ 0) |

#### RecetaProducto  *(clase de asociación Producto–Ingrediente)*
Define qué ingredientes y en qué cantidad componen un producto. Tiene datos propios, por eso es clase de asociación y no una simple línea.

| Atributo | Tipo | Descripción |
|---|---|---|
| cantidadRequerida | Decimal | Cantidad por unidad de producto (> 0) |
| esOpcional | Booleano | Si el cliente puede quitarlo |
| cargoExtra | Moneda | Costo adicional cuando se agrega como extra |

#### ComplementoProducto  *(clase de asociación Producto–Producto)*
Indica que un producto se ofrece como complemento de otro producto principal. Tiene datos propios.

| Atributo | Tipo | Descripción |
|---|---|---|
| obligatorio | Booleano | Si el complemento es de selección obligatoria |
| ordenVisualizacion | Entero | Orden de aparición (≥ 0) |

### Pedido

#### Carrito
Contenedor de la compra mientras el cliente arma su pedido en el autoservicio (RF-09 a RF-12).

| Atributo | Tipo | Descripción |
|---|---|---|
| fechaHoraApertura | FechaHora | Inicio de la sesión de compra |
| estado | Texto | Abierto \| Confirmado \| Abandonado |

#### Pedido
Orden confirmada por un cliente, con sus líneas, estado y totales.

| Atributo | Tipo | Descripción |
|---|---|---|
| codigo | Texto | Identificador legible y único (ej. PED-2024-00123) |
| fechaHoraCreacion | FechaHora | Momento de creación |
| tipo | Texto | EnRestaurante \| ParaLlevar |
| estado | Texto | Pendiente \| Confirmado \| EnPreparacion \| ListoParaEntregar \| EnTransporte \| Entregado \| Cancelado \| Pagado |
| subtotal | Moneda | Suma de líneas (≥ 0) |
| total | Moneda | Subtotal más impuestos/propina si aplica (≥ 0) |
| observaciones | Texto | Notas generales |
| motivoCancelacion | Texto | Obligatorio si el estado es Cancelado |

#### LineaPedido
Detalle de un producto dentro de un pedido (cantidad, precio y notas).

| Atributo | Tipo | Descripción |
|---|---|---|
| cantidad | Entero | Unidades (≥ 1) |
| precioUnitario | Moneda | Precio calculado al momento (base + variante + extras) |
| subtotalLinea | Moneda | precioUnitario × cantidad |
| notasPersonalizacion | Texto | Texto libre de personalización |

#### PersonalizacionIngrediente  *(clase de asociación LineaPedido–Ingrediente)*
Ingrediente quitado o agregado como extra respecto de la receta base.

| Atributo | Tipo | Descripción |
|---|---|---|
| accion | Texto | Quitado \| AgregadoExtra |
| cantidadExtra | Decimal | Solo si accion = AgregadoExtra (> 0) |
| cargoExtra | Moneda | Solo si accion = AgregadoExtra (≥ 0) |

#### ComplementoSeleccionado  *(clase de asociación LineaPedido–Producto)*
Producto complementario elegido para una línea.

| Atributo | Tipo | Descripción |
|---|---|---|
| cantidad | Entero | Unidades (≥ 1) |
| precioUnitario | Moneda | Precio del complemento al momento de la compra |

#### Pago
Registro del pago de un pedido (alcance acotado).

| Atributo | Tipo | Descripción |
|---|---|---|
| monto | Moneda | Importe pagado (≥ 0) |
| medio | Texto | Efectivo \| Tarjeta \| Externo |
| fechaHora | FechaHora | Momento del pago |
| estado | Texto | Pendiente \| Aprobado \| Rechazado |

### Operación

#### Mesa
Mesa física del restaurante.

| Atributo | Tipo | Descripción |
|---|---|---|
| numero | Texto | Identificador de la mesa (único) |
| capacidad | Entero | Comensales (≥ 1) |
| ubicacion | Texto | Terraza, salón, etc. |
| estado | Texto | Libre \| Ocupada \| Reservada \| EnLimpieza |
| activa | Booleano | Si está habilitada |

#### EstacionCocina
Puesto de trabajo de la cocina (Parrilla, Freidora, Ensaladas, Postres, Bebidas).

| Atributo | Tipo | Descripción |
|---|---|---|
| nombre | Texto | Nombre de la estación (único) |
| descripcion | Texto | Detalle opcional |
| ordenVisualizacion | Entero | Orden de aparición (≥ 0) |
| activa | Booleano | Si está operativa |

#### TareaCocina
Unidad de trabajo asignada a una estación para preparar parte de un pedido.

| Atributo | Tipo | Descripción |
|---|---|---|
| estado | Texto | Pendiente \| EnProceso \| Completada \| Cancelada |
| fechaHoraInicio | FechaHora | Al pasar a EnProceso |
| fechaHoraFin | FechaHora | Al completar |
| tiempoEstimadoMinutos | Entero | Estimación (≥ 1) |
| prioridad | Entero | Mayor valor = más urgente (≥ 0) |

#### TransporteRiel
Traslado de un pedido terminado desde cocina hasta la mesa mediante el riel.

| Atributo | Tipo | Descripción |
|---|---|---|
| estado | Texto | PendienteDespacho \| EnTransporte \| EntregadoEnMesa \| Falla |
| fechaHoraDespacho | FechaHora | Salida de cocina |
| fechaHoraEntrega | FechaHora | Llegada a la mesa |
| descripcionFalla | Texto | Detalle si el estado es Falla |

#### MovimientoInventario
Registro de entrada, salida o ajuste de existencias de un ingrediente.

| Atributo | Tipo | Descripción |
|---|---|---|
| tipo | Texto | Entrada \| SalidaPedido \| AjustePositivo \| AjusteNegativo \| Merma |
| cantidad | Decimal | Magnitud del movimiento (≠ 0) |
| fechaHora | FechaHora | Momento del movimiento |
| motivo | Texto | Causa del movimiento |

#### Alerta
Evento de negocio que requiere atención (retraso, stock bajo, falla de riel).

| Atributo | Tipo | Descripción |
|---|---|---|
| tipo | Texto | RetrasoPreparacion \| StockBajo \| FallaTransporte |
| descripcion | Texto | Detalle de la alerta |
| fechaHoraGeneracion | FechaHora | Momento de generación |
| atendida | Booleano | Si ya fue resuelta |

---

## 4. Asociaciones

Leyenda de tipo: **Asoc.** = asociación · **Agr.** = agregación (el todo "tiene" partes que existen por sí solas) · **Comp.** = composición (la parte no existe sin el todo).

| Origen | Verbo (rol) | Destino | Mult. origen | Mult. destino | Tipo |
|---|---|---|---|---|---|
| Categoria | agrupa (productos) | Producto | 1 | 0..* | Agr. |
| Producto | ofrece (variantes) | VarianteProducto | 1 | 0..* | Comp. |
| Producto | define (receta) | RecetaProducto | 1 | 0..* | Comp. |
| RecetaProducto | usa (ingrediente) | Ingrediente | * | 1 | Asoc. |
| Producto | ofrece (complementos) | ComplementoProducto | 1 | 0..* | Asoc. |
| ComplementoProducto | es ofrecido por (productoComplemento) | Producto | * | 1 | Asoc. |
| Producto | se prepara en (estación) | EstacionCocina | * | 1 | Asoc. |
| Pedido | se atiende en (mesa) | Mesa | 0..* | 0..1 | Asoc. |
| Pedido | contiene (líneas) | LineaPedido | 1 | 1..* | Comp. |
| LineaPedido | refiere a (producto) | Producto | * | 1 | Asoc. |
| LineaPedido | usa (variante) | VarianteProducto | * | 0..1 | Asoc. |
| LineaPedido | personaliza (ingredientes) | PersonalizacionIngrediente | 1 | 0..* | Comp. |
| PersonalizacionIngrediente | refiere a (ingrediente) | Ingrediente | * | 1 | Asoc. |
| LineaPedido | incluye (complementos) | ComplementoSeleccionado | 1 | 0..* | Comp. |
| ComplementoSeleccionado | refiere a (productoComplemento) | Producto | * | 1 | Asoc. |
| Carrito | reúne (líneas en borrador) | LineaPedido | 1 | 0..* | Comp. |
| Carrito | se confirma como (pedido) | Pedido | 0..1 | 0..1 | Asoc. |
| Pago | corresponde a (pedido) | Pedido | 1 | 1 | Asoc. |
| Pedido | genera (tareas) | TareaCocina | 1 | 0..* | Comp. |
| TareaCocina | se realiza en (estación) | EstacionCocina | * | 1 | Asoc. |
| TareaCocina | prepara (línea) | LineaPedido | * | 1 | Asoc. |
| Pedido | se transporta mediante | TransporteRiel | 0..1 | 0..1 | Comp. |
| TransporteRiel | se dirige a (mesaDestino) | Mesa | * | 1 | Asoc. |
| Ingrediente | registra (movimientos) | MovimientoInventario | 1 | 0..* | Asoc. |
| MovimientoInventario | se origina por (pedido) | Pedido | * | 0..1 | Asoc. |
| Alerta | se refiere a (pedido) | Pedido | 0..* | 0..1 | Asoc. |
| Alerta | se refiere a (ingrediente) | Ingrediente | 0..* | 0..1 | Asoc. |
| Alerta | se refiere a (transporte) | TransporteRiel | 0..* | 0..1 | Asoc. |

---

## 5. Clases de asociación

Una clase de asociación existe cuando la **relación misma** tiene datos propios:

- **RecetaProducto** (Producto–Ingrediente): la cantidad, el carácter opcional y el cargo extra pertenecen a la relación, no a ninguno de los dos extremos por separado.
- **ComplementoProducto** (Producto–Producto): "obligatorio" y el orden aplican a la relación entre un principal y su complemento.
- **PersonalizacionIngrediente** (LineaPedido–Ingrediente): la acción y el cargo extra describen la relación concreta línea–ingrediente.
- **ComplementoSeleccionado** (LineaPedido–Producto): cantidad y precio son propiedades de la selección, no del producto ni de la línea aislados.

---

## 6. Generalizaciones

**No se modelan generalizaciones.** No existe en el enunciado ninguna relación "es un" genuina entre los conceptos
del negocio (un ingrediente no es un producto, una mesa no es una estación, una tarea no es un pedido).
Forzar herencia aquí sería reutilización, no semántica de dominio.

---

## 7. Reglas de negocio

- **RN-01** Un Producto pertenece exactamente a una Categoria activa.
- **RN-02** Un Producto se prepara en exactamente una EstacionCocina activa.
- **RN-03** Precio de una LineaPedido = precioBase + ajustePrecio(variante) + Σ(cargoExtra de ingredientes agregados) + Σ(precioUnitario de complementos).
- **RN-04** Si Producto.disponible = falso, no puede agregarse a nuevos pedidos; los pedidos existentes conservan sus líneas.
- **RN-05** Un Pedido EnRestaurante debe tener una Mesa asignada y esta debe estar Libre u Ocupada.
- **RN-06** Un Pedido solo pasa a Confirmado si tiene al menos una LineaPedido.
- **RN-07** Al confirmar un Pedido: se generan TareaCocina por línea según la estación del producto, se descuenta stock de los ingredientes de la receta (SalidaPedido) y se valida stock suficiente antes de confirmar.
- **RN-08** Una TareaCocina solo pasa a EnProceso si su Pedido está EnPreparacion.
- **RN-09** Un Pedido pasa a EnPreparacion cuando al menos una TareaCocina pasa a EnProceso.
- **RN-10** Un Pedido pasa a ListoParaEntregar cuando todas sus TareaCocina están Completadas.
- **RN-11** Al pasar a ListoParaEntregar, se crea el TransporteRiel si el pedido es EnRestaurante.
- **RN-12** TransporteRiel solo pasa a EnTransporte si el Pedido está ListoParaEntregar.
- **RN-13** Al completar el TransporteRiel, el Pedido pasa a Entregado y la Mesa a Ocupada.
- **RN-14** Si el TransporteRiel falla, se genera una Alerta de FallaTransporte y el Pedido permanece ListoParaEntregar.
- **RN-15** El stock de un Ingrediente se actualiza mediante MovimientoInventario y nunca puede ser negativo.
- **RN-16** Si stockActual ≤ stockMinimo tras un movimiento, se genera una Alerta de StockBajo.
- **RN-17** Un ComplementoProducto solo referencia productos con disponible = verdadero.
- **RN-18** Una PersonalizacionIngrediente con acción Quitado solo se permite si la RecetaProducto correspondiente es opcional.
- **RN-19** Una PersonalizacionIngrediente con acción AgregadoExtra solo se permite si el Ingrediente tiene stockActual > 0.
- **RN-20** Un Pedido Cancelado exige motivoCancelacion y revierte las salidas de inventario con ajustes positivos.
- **RN-21** El código de Pedido es único y secuencial por día.
- **RN-22** El estado de la Mesa cambia: Libre → Ocupada al entregar el pedido; Ocupada → Libre al cerrar la cuenta.
- **RN-23** Una Alerta se refiere a un Pedido, un Ingrediente o un TransporteRiel, según su tipo.

---

## 8. Diagrama del modelo de dominio

```mermaid
classDiagram
    namespace Menu {
        class Categoria {
            +nombre: Texto
            +descripcion: Texto
            +ordenVisualizacion: Entero
            +activa: Booleano
        }
        class Producto {
            +codigo: Texto
            +nombre: Texto
            +descripcion: Texto
            +precioBase: Moneda
            +imagen: Texto
            +tiempoPreparacionEstimado: Entero
            +disponible: Booleano
        }
        class VarianteProducto {
            +nombre: Texto
            +descripcion: Texto
            +ajustePrecio: Moneda
            +ordenVisualizacion: Entero
            +activa: Booleano
        }
        class Ingrediente {
            +codigo: Texto
            +nombre: Texto
            +unidadMedida: Texto
            +stockActual: Decimal
            +stockMinimo: Decimal
            +costoUnitario: Moneda
        }
        class RecetaProducto {
            +cantidadRequerida: Decimal
            +esOpcional: Booleano
            +cargoExtra: Moneda
        }
        class ComplementoProducto {
            +obligatorio: Booleano
            +ordenVisualizacion: Entero
        }
    }

    namespace Pedido {
        class Carrito {
            +fechaHoraApertura: FechaHora
            +estado: Texto
        }
        class Pedido {
            +codigo: Texto
            +fechaHoraCreacion: FechaHora
            +tipo: Texto
            +estado: Texto
            +subtotal: Moneda
            +total: Moneda
            +observaciones: Texto
            +motivoCancelacion: Texto
        }
        class LineaPedido {
            +cantidad: Entero
            +precioUnitario: Moneda
            +subtotalLinea: Moneda
            +notasPersonalizacion: Texto
        }
        class PersonalizacionIngrediente {
            +accion: Texto
            +cantidadExtra: Decimal
            +cargoExtra: Moneda
        }
        class ComplementoSeleccionado {
            +cantidad: Entero
            +precioUnitario: Moneda
        }
        class Pago {
            +monto: Moneda
            +medio: Texto
            +fechaHora: FechaHora
            +estado: Texto
        }
    }

    namespace Operacion {
        class Mesa {
            +numero: Texto
            +capacidad: Entero
            +ubicacion: Texto
            +estado: Texto
            +activa: Booleano
        }
        class EstacionCocina {
            +nombre: Texto
            +descripcion: Texto
            +ordenVisualizacion: Entero
            +activa: Booleano
        }
        class TareaCocina {
            +estado: Texto
            +fechaHoraInicio: FechaHora
            +fechaHoraFin: FechaHora
            +tiempoEstimadoMinutos: Entero
            +prioridad: Entero
        }
        class TransporteRiel {
            +estado: Texto
            +fechaHoraDespacho: FechaHora
            +fechaHoraEntrega: FechaHora
            +descripcionFalla: Texto
        }
        class MovimientoInventario {
            +tipo: Texto
            +cantidad: Decimal
            +fechaHora: FechaHora
            +motivo: Texto
        }
        class Alerta {
            +tipo: Texto
            +descripcion: Texto
            +fechaHoraGeneracion: FechaHora
            +atendida: Booleano
        }
    }

    Categoria "1" o-- "0..*" Producto : agrupa
    Producto "1" *-- "0..*" VarianteProducto : ofrece
    Producto "1" *-- "0..*" RecetaProducto : define
    RecetaProducto "*" --> "1" Ingrediente : usa
    Producto "1" --> "0..*" ComplementoProducto : ofrece
    ComplementoProducto "*" --> "1" Producto : complementa
    Producto "*" --> "1" EstacionCocina : se prepara en

    Carrito "1" *-- "0..*" LineaPedido : reune
    Carrito "0..1" --> "0..1" Pedido : se confirma como
    Pedido "1" *-- "1..*" LineaPedido : contiene
    LineaPedido "*" --> "1" Producto : refiere a
    LineaPedido "*" --> "0..1" VarianteProducto : usa
    LineaPedido "1" *-- "0..*" PersonalizacionIngrediente : personaliza
    PersonalizacionIngrediente "*" --> "1" Ingrediente : refiere a
    LineaPedido "1" *-- "0..*" ComplementoSeleccionado : incluye
    ComplementoSeleccionado "*" --> "1" Producto : refiere a
    Pago "1" --> "1" Pedido : corresponde a

    Pedido "0..*" --> "0..1" Mesa : se atiende en
    Pedido "1" *-- "0..*" TareaCocina : genera
    TareaCocina "*" --> "1" EstacionCocina : se realiza en
    TareaCocina "*" --> "1" LineaPedido : prepara
    Pedido "0..1" *-- "0..1" TransporteRiel : se transporta mediante
    TransporteRiel "*" --> "1" Mesa : se dirige a
    Ingrediente "1" --> "0..*" MovimientoInventario : registra
    MovimientoInventario "*" --> "0..1" Pedido : se origina por
    Alerta "0..*" --> "0..1" Pedido : se refiere a
    Alerta "0..*" --> "0..1" Ingrediente : se refiere a
    Alerta "0..*" --> "0..1" TransporteRiel : se refiere a
```

> Fuente editable: [`fuentes/modelo-dominio.puml`](fuentes/modelo-dominio.puml). Exportaciones: `modelo-dominio.png` / `modelo-dominio.svg`.

---

## 9. Trazabilidad requerimiento → concepto

| Requerimiento | Conceptos del dominio |
|---|---|
| RF-01–RF-03 | Categoria, Producto |
| RF-04–RF-06 | Ingrediente, RecetaProducto, PersonalizacionIngrediente |
| RF-05 | VarianteProducto |
| RF-07–RF-08 | ComplementoProducto, ComplementoSeleccionado |
| RF-09–RF-12 | Carrito, LineaPedido, Pedido, Pago |
| RF-13–RF-14 | Producto (disponible) |
| RF-15–RF-18 | Carrito, Pedido |
| RF-19–RF-22 | Pedido, Pago |
| RF-23–RF-27 | Pedido (estado, motivoCancelacion) |
| RF-28–RF-31 | TareaCocina, EstacionCocina, Alerta (retraso) |
| RF-32–RF-34 | EstacionCocina, TareaCocina |
| RF-35–RF-38 | TransporteRiel, Mesa, Alerta (falla) |
| RF-39–RF-41 | Mesa |
| RF-42–RF-45 | Ingrediente, MovimientoInventario, Alerta (stock) |
| RF-46–RF-48 | Producto, Categoria, VarianteProducto, ComplementoProducto, EstacionCocina |
| RF-49 | *Fuera del dominio* (acceso al sistema) |
| RF-50–RF-51 | Pedido, TareaCocina, EstacionCocina (insumo de reportes) |
| RF-52–RF-53 | Alerta |
| RF-54–RF-56 | Todos (flujo transversal del Pedido) |

---

## 10. Decisiones de modelado

| Relación | Decisión | Justificación |
|---|---|---|
| Categoria–Producto | **Agregación** | La categoría "tiene" productos, pero un producto existe aunque se elimine la categoría (a lo sumo queda sin agrupar). No hay dependencia de ciclo de vida. |
| Producto–VarianteProducto | **Composición** | Una variante (Pequeño/Grande) carece de sentido sin su producto; nace y desaparece con él. |
| Producto–RecetaProducto | **Composición** | La línea de receta es parte intrínseca del producto. |
| RecetaProducto–Ingrediente | **Asociación** | El ingrediente es un insumo compartido por muchos productos; no depende del producto. |
| Producto–ComplementoProducto | **Asociación** | El complemento es, a su vez, un Producto independiente; la relación es entre dos productos, con datos propios. |
| Pedido–LineaPedido | **Composición** | Una línea no existe sin su pedido. |
| Pedido–TransporteRiel | **Composición 0..1** | El transporte solo aplica a pedidos EnRestaurante; si el pedido se cancela, su transporte desaparece. |
| Ingrediente–MovimientoInventario | **Asociación** | El historial de movimientos describe eventos; no "pertenece" al ingrediente como parte estructural (y un movimiento puede sobrevivir a un cambio de ingrediente). |
| Alerta–(Pedido/Ingrediente/Transporte) | **Asociación** | Una alerta referencia un hecho; el hecho existe con independencia de la alerta. |
| Carrito–LineaPedido / Pedido–LineaPedido | **Composición (borrador) / Composición (confirmado)** | La línea se arma dentro del Carrito y, al confirmar, pasa a formar parte del Pedido; ambos vínculos no coexisten en el tiempo. |

### Conceptos deliberadamente excluidos
- **Usuario / Rol**: gestión de acceso al software (RF-49), no del negocio del restaurante.
- **ConfiguracionSistema** (IVA, umbrales): parámetro de la aplicación.
- **Notificacion dirigida a usuario**: reemplazada por `Alerta` como evento de negocio; el "a quién se avisa" es una decisión del software.
