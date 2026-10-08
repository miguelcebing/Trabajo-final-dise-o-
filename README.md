# Sistema de Autoservicio para Restaurante

**Proyecto Final — Diseño de Software**

Restaurante con autoservicio digital: menú en pantallas táctiles, pedidos, cocina por estaciones, entrega por riel, mesas, inventario, notificaciones y reportes.

> **Estado:** análisis y diseño. Aún no hay código fuente; el diagrama de clases es el diseño propuesto.

---

## Diagrama de clases

Diseño de todo el sistema en un solo diagrama (51 clases + 10 enumeraciones, 4 capas coloreadas).
Detalle, inventario y relaciones en [docs/modelado/diagrama-clases.md](docs/modelado/diagrama-clases.md).

![Diagrama de clases](docs/modelado/diagrama-clases.png)

---

## Documentación

| Documento | Contenido |
|---|---|
| [Especificación funcional](docs/especificacion/especificacion-funcional.md) | 56 historias de usuario (INVEST) |
| [Requerimientos](docs/especificacion/requerimientos.txt) | RF-01 a RF-56 |
| [Diagrama de clases](docs/modelado/diagrama-clases.md) | Diseño de software (imagen + relaciones + patrones) |

> **Fuente del diagrama:** [`docs/modelado/diagrama-clases.mmd`](docs/modelado/diagrama-clases.mmd) (Mermaid).
> Para regenerar el PNG: `mmdc -i docs/modelado/diagrama-clases.mmd -o docs/modelado/diagrama-clases.png -b white -w 7502 -H 5224`.

---

## Estructura

```
├── README.md
└── docs/
    ├── especificacion/   # Requerimientos e historias de usuario
    └── modelado/         # Diagrama de clases (.mmd, .png y documentación)
```

---

## Integrantes

- Miguel Felipe Ceballos Ramírez

Proyecto académico — uso educativo.
