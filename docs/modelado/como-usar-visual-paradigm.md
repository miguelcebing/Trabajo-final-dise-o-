# Uso de Visual Paradigm (procedimiento manual)

## Estado

Los diagramas se generaron primero en **formato textual** (PlantUML) en [`fuentes/`](fuentes/) y se
renderizaron a **PNG y SVG** en esta carpeta. Sin embargo, **no fue posible automatizar Visual Paradigm**:

- Visual Paradigm 18.1 **no importa PlantUML** (no incluye ese soporte en sus librerías).
- Su interfaz de línea de comandos (`ImportXMI`, `ExportDiagramImage`, `ExportXMI`) **sí importa modelos XMI**,
  pero **no crea ni maqueta diagramas**; para dibujar y organizar un diagrama se necesita la **interfaz gráfica**.
- Este entorno no dispone de control de GUI (clic/captura de pantalla), por lo que **no se pudo operar VP con el ratón**.

Por tanto, los PNG/SVG de `docs/modelado/` son **renderizados de PlantUML**, no exportaciones de VP.
A continuación se indica el paso a paso para **reproducir y exportar los diagramas en Visual Paradigm**.

## Archivos fuente disponibles

| Diagrama | Fuente PlantUML | Imagen renderizada |
|---|---|---|
| Modelo de dominio | `fuentes/modelo-dominio.puml` | `modelo-dominio.png` / `.svg` |
| Clases — dominio | `fuentes/diagrama-clases-dominio.puml` | `diagrama-clases-dominio.png` / `.svg` |
| Clases — arquitectura | `fuentes/diagrama-clases-arquitectura.puml` | `diagrama-clases-arquitectura.png` / `.svg` |
| Vista funcional (componentes) | `fuentes/vista-funcional-componentes.puml` | `vista-funcional-componentes.png` / `.svg` |
| Secuencia — pedido en kiosco | `fuentes/secuencia-pedido-kiosco.puml` | `secuencia-pedido-kiosco.png` / `.svg` |
| Secuencia — preparación y riel | `fuentes/secuencia-preparacion-riel.puml` | `secuencia-preparacion-riel.png` / `.svg` |
| Secuencia — alerta de stock | `fuentes/secuencia-alerta-stock.puml` | `secuencia-alerta-stock.png` / `.svg` |

## Paso a paso en Visual Paradigm

1. **Crear el proyecto**: `File > New Project` y guardarlo como `docs/modelado/proyecto.vpp`.
2. **Diagrama de clases** (modelo de dominio y clases):
   1. `Diagram > New > Class Diagram`.
   2. Crear las clases del `modelo-dominio.puml` con sus atributos (sin visibilidad ni métodos).
   3. Dibujar las asociaciones con su nombre, multiplicidades y roles; usar **Aggregation** para
      `Categoria–Producto` y **Composition** para `Producto–VarianteProducto`, `Pedido–LineaPedido`, etc.
   4. Marcar `RecetaProducto`, `ComplementoProducto`, `PersonalizacionIngrediente` y
      `ComplementoSeleccionado` como **Association Class**.
   5. Repetir para `diagrama-clases-dominio.puml` (con visibilidad, tipos y métodos) y
      `diagrama-clases-arquitectura.puml` (interfaces, realizaciones, enums).
3. **Vista funcional**: `Diagram > New > Component Diagram`; crear los componentes, las interfaces
   (ofrecidas/requeridas) y las dependencias del `vista-funcional-componentes.puml`.
4. **Secuencias**: `Diagram > New > Sequence Diagram` para cada flujo.
5. **Organizar**: seleccionar todo (`Ctrl+A`) y aplicar `Diagram > Auto Layout` (o `Layout > Auto Layout`),
   revisando que no queden cruces ni solapes.
6. **Exportar**: `File > Export > Active Diagram as Image`, guardando **PNG** y **SVG** (o PDF) en
   `docs/modelado/` con los nombres de la tabla anterior.
7. **Guardar** el proyecto `.vpp` en `docs/modelado/proyecto.vpp`.

## Ajustes manuales recomendados (no se pudieron aplicar)

- En `diagrama-clases-dominio`, acercar `Producto` a `Categoria` y `ComplementoProducto` para evitar cruces.
- En `diagrama-clases-arquitectura`, distribuir en varias filas (hoy queda muy ancho) para mejorar la lectura.
- En `modelo-dominio`, separar las etiquetas `se refiere a` que se agrupan entre `Alerta` e `Ingrediente`.

> Si se prefiere, se puede solicitar la generación de un **XMI** a partir de estas fuentes para importar el
> modelo en VP y ahorrar el dibujo de clases (aunque el maquetado del diagrama seguiría siendo manual).
