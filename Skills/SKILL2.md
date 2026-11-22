SKILL2.md — Elaboración profesional de vistas de arquitectura
Propósito
Esta skill guía a un agente de programación para analizar el repositorio del proyecto, identificar los requisitos funcionales (RF), requisitos de calidad (RNF, si existen) e historias de usuario (HU), y producir tres vistas de arquitectura coherentes, profesionales y verificables: vista de contexto, vista funcional y vista lógica.
Principios obligatorios
1. Inspeccionar antes de diseñar. Revisar el contenido real del repositorio y localizar los RF, HU, documentación, modelos y diagramas existentes. No inventar requisitos ni asumir funcionalidades que no estén documentadas.
2. Trazabilidad. Cada actor, sistema externo, función, componente y relación debe poder justificarse con uno o más RF/HU o con evidencia concreta del código/documentación. Mantener una matriz breve de trazabilidad.
3. Consistencia entre vistas. Usar los mismos nombres para actores, sistema, módulos y conceptos en los tres diagramas. La vista de contexto establece límites; la funcional descompone capacidades; la lógica muestra componentes/clases y relaciones internas.
4. Profesionalismo visual. Composición ordenada, jerarquía visual, alineación, espaciado uniforme, tipografía legible, flechas etiquetadas, leyenda cuando sea necesaria y ausencia de cruces evitables. No entregar diagramas improvisados, incompletos o con texto ilegible.
5. No sobreinterpretar. Diferenciar explícitamente lo documentado, lo inferido y lo que falta por confirmar. No presentar una propuesta inferida como si ya existiera en el proyecto.
6. Archivos editables y exportables. Siempre que las herramientas instaladas lo permitan, guardar fuente editable (por ejemplo, .drawio, .puml, .mmd o .dot) y exportación visual .svg y/o .png. Verificar que los archivos se hayan generado en la carpeta de trabajo actual.
7. Documento guía. Generar un Word .docx que explique cómo construir cada vista paso a paso, qué elementos incluir, cómo conectarlos, qué convenciones visuales aplicar y cómo validar el resultado.
8. Calidad comprobable. Validar nombres, relaciones, legibilidad, correspondencia con requisitos y consistencia entre los tres diagramas antes de dar por terminado el trabajo.
Definición de las vistas solicitadas
1. Vista de contexto
- Mostrar el sistema como una unidad delimitada.
- Incluir actores humanos y sistemas externos solo cuando estén sustentados por RF/HU, código o documentación.
- Dibujar las interacciones relevantes entre actores/sistemas y el sistema, con flechas etiquetadas con acciones concretas.
- Indicar el límite del sistema y añadir una leyenda si hay distintos tipos de relación.
- Evitar detalles de clases, tablas o implementación interna.
2. Vista funcional
- Descomponer el sistema en capacidades, procesos o módulos funcionales derivados de los RF y HU.
- Agrupar funciones relacionadas sin ocultar capacidades importantes.
- Mostrar qué actor inicia o utiliza cada función cuando esté definido.
- Mantener un nivel de detalle homogéneo y evitar duplicar una misma función con nombres diferentes.
- Añadir identificadores de RF/HU en etiquetas o en una matriz de trazabilidad, siempre que la legibilidad lo permita.
3. Vista lógica
- Representar la organización interna del software: capas, subsistemas, módulos, componentes o clases, según lo que realmente justifique el proyecto.
- Mostrar responsabilidades claras y dependencias con dirección inequívoca.
- Si se usan clases, incluir nombres, atributos, operaciones y asociaciones relevantes solo cuando la documentación/código los respalde; distinguir clases implementadas de propuestas.
- No convertir automáticamente cada HU o RF en una clase.
- No confundir la vista lógica con despliegue físico, infraestructura o topología de servidores; eso corresponde a una vista de despliegue.
Entregables mínimos
- Guia_Vistas_Arquitectura.docx
- Una imagen de cada vista en PNG y/o SVG, con nombres claros:
  - Vista_Contexto.png o .svg
  - Vista_Funcional.png o .svg
  - Vista_Logica.png o .svg
- Fuentes editables de los diagramas, si las herramientas disponibles lo permiten.
- Trazabilidad_Vistas_RF_HU.md con referencias a los RF/HU que sustentan los elementos principales y una lista de vacíos o supuestos.
Contenido obligatorio del Word
Para cada una de las tres vistas, incluir:
1. Objetivo y qué pregunta responde.
2. Elementos que aparecen y por qué corresponden al proyecto.
3. Instrucciones paso a paso para dibujarla desde cero.
4. Ubicación sugerida de actores, límites, módulos, componentes y relaciones.
5. Explicación de cada flecha/conexión y su dirección.
6. Convenciones de diseño: formas, colores sobrios, tipografía, leyenda y espaciado.
7. Errores frecuentes que se deben evitar.
8. Lista de comprobación final.
9. Imagen final del diagrama insertada en el Word, si es técnicamente viable.
10. Referencias a los RF/HU utilizados, sin inventar identificadores.
Criterios de aceptación
- Los tres diagramas están completos, son legibles y tienen aspecto profesional.
- La vista de contexto no contiene detalles internos innecesarios.
- La vista funcional se deriva de capacidades documentadas y evita duplicaciones.
- La vista lógica refleja la arquitectura sustentada por el repositorio y separa hechos de propuestas.
- Los nombres y relaciones son consistentes entre las vistas.
- El Word se abre correctamente y contiene instrucciones accionables e imágenes legibles.
- Los archivos se guardan en la carpeta desde la que se abrió el agente/proyecto, no en una ubicación temporal desconocida.
- El agente informa los nombres y rutas exactas de los archivos creados, así como las limitaciones que no pudo resolver.