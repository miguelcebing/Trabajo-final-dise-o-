# Sistema de Autoservicio para Restaurante

**Proyecto Final — Diseño de Software**

Sistema integral de gestión para un restaurante con autoservicio digital: menú en pantallas táctiles,
toma de pedidos, cocina organizada por estaciones, entrega por riel automatizado, control de mesas,
inventario en tiempo real, notificaciones y reportes.

> **Estado del proyecto:** fase de **análisis y diseño**. El repositorio contiene la especificación,
> los modelos (dominio, clases, arquitectura) y los wireframes. **Aún no incluye código fuente**; el
> [diagrama de clases](docs/modelado/diagrama-clases.md) es el diseño propuesto para la implementación.

---

## Caso de estudio

El sistema cubre 12 módulos funcionales y 56 requerimientos (`RF-01` a `RF-56`):

| # | Módulo | Requerimientos |
|---|--------|----------------|
| 1 | Gestión del menú digital | RF-01 a RF-14 |
| 2 | Toma de pedidos (autoservicio) | RF-15 a RF-23 |
| 3 | Gestión de pedidos | RF-24 a RF-27 |
| 4 | Gestión de cocina | RF-28 a RF-31 |
| 5 | Organización de estaciones | RF-32 a RF-34 |
| 6 | Sistema de riel | RF-35 a RF-38 |
| 7 | Gestión de mesas | RF-39 a RF-41 |
| 8 | Gestión de inventario | RF-42 a RF-45 |
| 9 | Administración del menú | RF-46 a RF-48 |
| 10 | Administración y reportes | RF-49 a RF-51 |
| 11 | Notificaciones y alertas | RF-52 a RF-53 |
| 12 | Integración del sistema | RF-54 a RF-56 |

**Roles:** Cliente (autoservicio), Cocinero, Jefe de cocina, Mesero y Administrador.

---

## Tecnologías

- **Documentación:** Markdown.
- **Modelado:** UML, con fuentes **PlantUML** y **Visual Paradigm** (ver
  [cómo usar Visual Paradigm](docs/modelado/como-usar-visual-paradigm.md)).
- **Wireframes:** SVG + HTML.

---

## Estructura del repositorio

```
Trabajo-final-diseño/
├── README.md
├── docs/
│   ├── especificacion/
│   │   ├── especificacion-funcional.md   # 56 historias de usuario (INVEST)
│   │   └── requerimientos.txt            # RF-01 a RF-56 (fuente original)
│   ├── modelado/
│   │   ├── modelo-dominio.md             # Modelo conceptual (mundo del problema)
│   │   ├── diagrama-clases.md            # Diseño de software (clases)
│   │   ├── como-usar-visual-paradigm.md  # Procedimiento en Visual Paradigm
│   │   ├── fuentes/                      # Fuentes PlantUML y modelos XMI importables
│   │   └── *.png / *.svg                 # Diagramas exportados
│   ├── arquitectura/
│   │   └── vista-funcional.md            # Vista funcional (Rozanski & Woods)
│   └── wireframes/
│       ├── index.html                    # Galería de maquetas
│       └── images/                       # 18 wireframes SVG
└── .gitignore
```

---

## Cómo instalar y ejecutar

El repositorio es **documental** (no hay programa que compilar ni ejecutar).

1. **Clonar:**
   ```bash
   git clone https://github.com/miguelcebing/Trabajo-final-dise-o-.git
   ```
2. **Ver la documentación:** abrir los `.md` en cualquier visor de Markdown (VS Code, GitHub, etc.).
3. **Ver los wireframes:** abrir `docs/wireframes/index.html` en el navegador.
4. **Regenerar los diagramas** (opcional): con [PlantUML](https://plantuml.com/) instalado,
   ```bash
   java -jar plantuml.jar -tpng -o .. docs/modelado/fuentes/*.puml
   java -jar plantuml.jar -tsvg -o .. docs/modelado/fuentes/*.puml
   ```
5. **Importar en Visual Paradigm** (opcional): usar los modelos **XMI** de `docs/modelado/fuentes/`
   (`File > Import > XMI`). Ver [cómo usar Visual Paradigm](docs/modelado/como-usar-visual-paradigm.md).
   > El código PlantUML **no** se importa en Visual Paradigm; solo sirve como fuente editable.

---

## Diagramas y arquitectura

| Documento | Diagrama |
|---|---|
| [Modelo de dominio](docs/modelado/modelo-dominio.md) | `docs/modelado/modelo-dominio.png` |
| [Diagrama de clases — dominio](docs/modelado/diagrama-clases.md) | `docs/modelado/diagrama-clases-dominio.png` |
| [Diagrama de clases — arquitectura](docs/modelado/diagrama-clases.md) | `docs/modelado/diagrama-clases-arquitectura.png` |
| [Vista funcional (componentes)](docs/arquitectura/vista-funcional.md) | `docs/modelado/vista-funcional-componentes.png` |
| Secuencias | `docs/modelado/secuencia-*.png` |

---

## Integrantes

- Miguel Felipe Ceballos Ramírez

---

## Licencia

Proyecto académico — uso educativo.
