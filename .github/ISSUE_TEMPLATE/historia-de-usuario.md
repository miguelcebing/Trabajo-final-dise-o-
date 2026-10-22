---
name: Historia de usuario
about: Plantilla oficial para crear una historia de usuario (HU) del proyecto
title: "[HU-XX] Verbo + objeto"
labels: ["HU"]
assignees: []
---

# [HU-XX] Verbo + objeto

## 1. Campos de la historia

| Campo | Valor |
|---|---|
| ID | HU-XX |
| Módulo / épica | <!-- menú, pedido, pago, cocina, estado o admin --> |
| Actor | <!-- Cliente, Cocina o Administrador --> |
| RF relacionado | <!-- RF-XX --> |
| Prioridad (MoSCoW) | <!-- Must, Should o Could --> |
| Estimación | <!-- 1, 2, 3 o 5 puntos --> |
| Dependencias | <!-- HU-XX o — --> |
| Wireframe | <!-- docs/wireframes/WF-XX.svg --> |

## 2. Historia

Como **<actor>** quiero <acción> para <beneficio>.

## 3. Contexto

<!-- 2 a 3 líneas: por qué existe esta historia y en qué momento del flujo ocurre. -->

## 4. Criterios de aceptación

- [ ] **CA-1** — Dado <contexto>, cuando <acción>, entonces <resultado>.
- [ ] **CA-2** — Dado <contexto alterno o de error>, cuando <acción>, entonces <resultado>.
- [ ] **CA-3** — Dado <contexto de borde o usabilidad táctil>, cuando <acción>, entonces <resultado medible>.

## 5. Reglas de negocio

- <!-- Regla verificable. -->

## 6. Wireframe

![WF-XX](https://github.com/miguelcebing/Trabajo-final-dise-o-/blob/main/docs/wireframes/WF-XX.svg?raw=true)

<details>
<summary>Versión en texto del wireframe</summary>

- [Zona] Descripción del elemento.

</details>

## 7. Validación INVEST

| Criterio | Cumple | Nota |
|---|---|---|
| Independiente | ✔ | |
| Negociable | ✔ | |
| Valiosa | ✔ | |
| Estimable | ✔ | |
| Pequeña | ✔ | |
| Testable | ✔ | |

## 8. Definición de hecho (DoD)

- [ ] Criterios de aceptación verificados en la pantalla táctil.
- [ ] Wireframe revisado y coherente con los criterios de aceptación.
- [ ] Etiquetas aplicadas: `HU`, `módulo:*`, `actor:*`, `prioridad:*`, `pts:*`.
- [ ] Sin dependencias pendientes que bloqueen la prueba.
- [ ] Revisada por un integrante distinto al autor.

## 9. Fuera de alcance

- <!-- Lo que esta historia no cubre. -->
