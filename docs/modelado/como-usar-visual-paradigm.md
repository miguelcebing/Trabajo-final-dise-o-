# Uso de Visual Paradigm (importación de los modelos)

## Resumen rápido

| Formato | ¿Sirve en Visual Paradigm? | Para qué |
|---|---|---|
| **PNG / SVG** (`docs/modelado/*.png`, `*.svg`) | No se importan, pero **se ven/descargan directo** | Ver o insertar el diagrama ya dibujado |
| **XMI** (`docs/modelado/fuentes/*.xmi`) | **Sí** (`Import XMI`) | Importar el **modelo** (clases, atributos, métodos, asociaciones, enums, componentes) |
| **PlantUML** (`docs/modelado/fuentes/*.puml`) | **No** (VP no lo importa) | Fuente editable del diagrama |

> **Importante:** al importar XMI, Visual Paradigm reconstruye el **modelo**, pero **no dibuja el diagrama**
> automáticamente. Tras importar hay que crear el diagrama y agregar los elementos (ver paso 4).

## Archivos XMI disponibles

| Modelo | Archivo XMI | Contenido |
|---|---|---|
| Modelo de dominio | `fuentes/modelo-dominio.xmi` | 18 clases, 28 asociaciones (con multiplicidad, rol y agregación/composición) |
| Clases — dominio | `fuentes/diagrama-clases-dominio.xmi` | Clases con visibilidad, tipos, métodos, enums, herencia de `Alerta` |
| Clases — arquitectura | `fuentes/diagrama-clases-arquitectura.xmi` | Interfaces, realizaciones, dependencias, servicios y UI |
| Vista funcional | `fuentes/vista-funcional-componentes.xmi` | 15 componentes, 10 interfaces y 21 dependencias |

Los XMI se generan con `fuentes/generar-xmi.py` (Python 3). Se probó su importación en **Visual Paradigm 18.1**:
los cuatro se importan sin errores.

## Opción A — Importar el modelo desde XMI (recomendada)

1. Abrir Visual Paradigm: `Project > Open` o crear uno nuevo y guardarlo como `docs/modelado/proyecto.vpp`.
2. `File > Import > XMI...` (o el asistente **Import XMI**), elegir el `.xmi` deseado y aceptar.
3. El modelo aparece en el **Model Explorer** (árbol de clases, atributos, relaciones).
4. Crear el diagrama y poblarlo:
   1. `Diagram > New > Class Diagram` (o *Component Diagram* para la vista funcional).
   2. Arrastrar las clases desde el **Model Explorer** al lienzo, o seleccionarlas y usar
      **Add Related Elements** para traer también las asociaciones.
   3. `Ctrl+A` y luego **Diagram > Auto Layout** (o `Layout > Auto Layout`) para ordenar.
   4. Revisar y ajustar a mano si quedan cruces.
5. `File > Export > Active Diagram as Image` → guardar **PNG** y **SVG** (o PDF) en `docs/modelado/`.
6. Guardar el proyecto `.vpp`.

> Si al importar un XMI se desea **un solo diagrama con todo**, repetir el paso 4 por cada `.xmi`
> (dominio, clases-dominio, clases-arquitectura y componentes) dentro del mismo proyecto.

## Opción B — Dibujar a partir de PlantUML / PNG

Si se prefiere no usar XMI: usar `fuentes/*.puml` o las imágenes `*.png` como guía y recrear los diagramas
manualmente en VP (`Diagram > New > ...`). Los `.puml` **no** se pueden importar directamente.

## Ajustes manuales recomendados

- En `diagrama-clases-dominio`, acercar `Producto` a `Categoria` y `ComplementoProducto` para evitar cruces.
- En `diagrama-clases-arquitectura`, distribuir en varias filas (queda muy ancho).
- En `modelo-dominio`, separar las etiquetas `se refiere a` que se agrupan entre `Alerta` e `Ingrediente`.

## Notas

- No fue posible automatizar el dibujo/exportación en VP desde este entorno (no hay control de GUI y el
  CLI de VP no crea ni maqueta diagramas), por eso las imágenes `docs/modelado/*.png|svg` son
  **renderizados de PlantUML**.
- Visual Paradigm 18.1 detectó el archivo `wmic` ausente (no afecta la importación).
