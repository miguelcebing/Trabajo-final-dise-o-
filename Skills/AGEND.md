AGENT.md — Agente para generar vistas de arquitectura desde RF y HU
Misión
Trabaja sobre el repositorio abierto en el entorno de desarrollo. Analiza sus requisitos funcionales (RF), historias de usuario (HU) y documentación disponible para producir tres diagramas de arquitectura profesionales —vista de contexto, vista funcional y vista lógica—, además de un documento Word que enseñe al usuario a recrearlos paso a paso.
Repositorio de referencia
https://github.com/miguelcebing/Trabajo-final-dise-o-.git

El enlace es una referencia proporcionada por el usuario. No des por hecho que tienes acceso a Internet ni clones otro repositorio sin comprobar primero el entorno. Trabaja con la carpeta del proyecto que está abierta localmente y verifica que sea el repositorio correcto.
Instrucciones de ejecución
Fase 1 — Inspección del proyecto
1. Identifica la raíz del repositorio y confirma la carpeta de trabajo.
2. Examina el README, la estructura de carpetas, los archivos de RF, HU, requisitos no funcionales, caso de estudio, diagramas anteriores y cualquier documentación de arquitectura.
3. Busca también nombres alternativos: requisitos, requirements, historias, user-stories, HU, RF, SRS, especificacion, documentacion, docs, UML, modelo de dominio.
4. Si hay versiones duplicadas o contradictorias de requisitos, identifica cuál parece ser la vigente y explica por qué. No elimines ni sobrescribas diagramas existentes sin autorización.
5. Crea un inventario de fuentes y registra los nombres/rutas exactos que sustentan el análisis.
6. Si no puedes encontrar RF o HU suficientes, no inventes contenido: genera un informe de faltantes y pide al usuario los archivos o aclaraciones necesarias antes de afirmar que los diagramas representan el sistema completo.
Fase 2 — Análisis y trazabilidad
1. Extrae los RF y HU pertinentes, respetando sus identificadores y texto.
2. Identifica actores, límites del sistema, capacidades funcionales, entidades de dominio, módulos, dependencias y sistemas externos explícitamente respaldados por las fuentes.
3. Separa:
   - Documentado: aparece de forma explícita en RF/HU, código o documentación.
   - Inferido: es una interpretación razonable, marcada como propuesta.
   - Pendiente: requiere confirmación del usuario.
4. Prepara una matriz RF/HU → elemento del diagrama → fuente antes de dibujar.
5. No conviertas mecánicamente cada RF/HU en una caja. Agrupa por responsabilidad y nivel arquitectónico, sin perder trazabilidad.
6. No añadas tecnologías, APIs, servicios externos, bases de datos, actores ni clases sin evidencia. Si una vista lógica necesita una decisión que no está documentada, etiqueta la parte como propuesta.
Fase 3 — Diseño de los diagramas
Genera las tres vistas con el nivel de abstracción correcto:
A. Vista de contexto
- Sistema principal en el centro o en una posición visual dominante, claramente delimitado.
- Actores y sistemas externos alrededor, agrupados de forma equilibrada.
- Flechas direccionales y etiquetadas con interacciones concretas.
- Leyenda para diferenciar tipos de elementos si hace falta.
- No incluir clases, atributos, tablas ni detalles internos.
B. Vista funcional
- Módulos/capacidades funcionales agrupados con nombres breves y consistentes.
- Relaciones entre actores y funciones, y entre funciones cuando estén justificadas.
- Cobertura de los RF/HU relevantes sin duplicados ni agrupaciones excesivamente vagas.
- Mostrar identificadores RF/HU en el diagrama cuando sea legible; si no, usar la matriz de trazabilidad complementaria.
C. Vista lógica
- Elegir el formato que mejor represente el proyecto real: capas, componentes, subsistemas o clases.
- Mostrar responsabilidades, relaciones y dependencias con dirección clara.
- Incluir atributos, métodos y multiplicidades solo si corresponden al modelo de clases y existe respaldo suficiente.
- No confundir esta vista con el despliegue de infraestructura.
- Si no hay arquitectura implementada en el código, producir una propuesta lógica explícitamente etiquetada como tal, no como hecho existente.
Fase 4 — Calidad visual y técnica
1. Usa una herramienta disponible en el entorno (por ejemplo, PlantUML, Mermaid, Graphviz, draw.io u otra instalada) y verifica qué formatos puede exportar.
2. Prioriza un estilo profesional: fondo claro, paleta sobria y accesible, tipografía legible, títulos claros, márgenes consistentes, alineación, agrupación por responsabilidad y conectores sin cruces innecesarios.
3. Las flechas deben tener dirección inequívoca; no uses líneas ambiguas.
4. Evita texto diminuto, cajas amontonadas, conectores que atraviesen etiquetas y elementos decorativos sin función.
5. Exporta cada diagrama en PNG y/o SVG. Si es posible, guarda además el archivo fuente editable.
6. Abre o inspecciona las exportaciones para verificar que no estén vacías, cortadas, borrosas o desproporcionadas. Corrige los problemas antes de entregar.
Fase 5 — Generar el documento Word
Crea Guia_Vistas_Arquitectura.docx en la raíz del proyecto abierto. El documento debe estar en español, con redacción clara y formal, y contener:
- Portada breve con título, nombre del proyecto si está documentado y fecha de generación.
- Una sección por cada vista: contexto, funcional y lógica.
- Para cada vista:
  1. propósito y pregunta que responde;
  2. fuentes RF/HU utilizadas;
  3. explicación de cada elemento y cada relación;
  4. guía numerada para recrear el diagrama desde cero;
  5. indicaciones de distribución espacial (qué ubicar al centro, laterales, arriba/abajo);
  6. convenciones de formas, flechas, colores y leyenda;
  7. errores comunes y cómo evitarlos;
  8. lista de verificación.
- Insertar una imagen legible del diagrama correspondiente, si es técnicamente viable.
- Incluir una matriz de trazabilidad resumida y una sección de supuestos/elementos pendientes.
- No rellenar páginas con contenido genérico: todas las explicaciones deben referirse al proyecto encontrado en el repositorio.
Fase 6 — Guardar y comprobar entregables
Guarda todo en la carpeta raíz del repositorio abierto, salvo que el usuario haya indicado otra ubicación. Usa estos nombres:
- Guia_Vistas_Arquitectura.docx
- Vista_Contexto.png y/o Vista_Contexto.svg
- Vista_Funcional.png y/o Vista_Funcional.svg
- Vista_Logica.png y/o Vista_Logica.svg
- Fuentes editables de cada diagrama, según la herramienta disponible.
- Trazabilidad_Vistas_RF_HU.md
No afirmes que creaste un archivo si no verificaste que existe y tiene contenido. Si una herramienta no permite exportar un formato, indícalo y entrega la alternativa que sí funcione. No inventes rutas.
Autonomía y comunicación
- Continúa sin pedir confirmación para decisiones de formato reversibles.
- Pregunta al usuario solo si falta información esencial que impide modelar correctamente el sistema o si hay contradicciones que cambian de forma importante el resultado.
- No cambies código funcional ni borres archivos del proyecto como parte de esta tarea.
- Antes de finalizar, resume qué fuentes se analizaron, qué decisiones fueron inferidas y qué archivos se generaron.
- Si no tienes acceso a los archivos locales, explica el bloqueo y solicita abrir la carpeta correcta o proporcionar los RF/HU; no simules haber inspeccionado el repositorio.
Definición de terminado
La tarea solo está completa cuando:
1. Las tres vistas están generadas y son coherentes entre sí.
2. La trazabilidad de RF/HU está documentada.
3. El Word contiene instrucciones específicas, paso a paso, e imágenes legibles.
4. Los archivos están en la carpeta correcta y se verificó su existencia.
5. Se informa de forma transparente cualquier limitación, supuesto o dato faltante.