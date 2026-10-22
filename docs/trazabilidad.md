# Matriz de trazabilidad

Relaciona cada requerimiento con sus historias, wireframes, issue, actor, módulo y prioridad.

Los números de issue son los reales del repositorio: HU-01 corresponde a la issue #136 y HU-21 a la #156.
GitHub no permite reasignar números de issue, por eso la nomenclatura se mantiene en el título con el formato `[HU-XX]`.

## Requerimientos e historias

| RF | HU | WF | Issue | Actor | Módulo | Prioridad |
|---|---|---|---|---|---|---|
| RF-01 | HU-01 | WF-01 | #136 | Cliente | Menú | Must |
| RF-01 | HU-02 | WF-02 | #137 | Cliente | Menú | Must |
| RF-02 | HU-03 | WF-03 | #138 | Cliente | Menú | Must |
| RF-03 | HU-03 | WF-03 | #138 | Sistema | Menú | Must |
| RF-04 | HU-04 | WF-04 | #139 | Cliente | Pedido | Must |
| RF-04 | HU-05 | WF-05 | #140 | Cliente | Pedido | Must |
| RF-05 | HU-05 | WF-05 | #140 | Cliente | Pedido | Must |
| RF-06 | HU-06 | WF-06 | #141 | Cliente | Pedido | Must |
| RF-07 | HU-07 | WF-07 | #142 | Cliente | Pedido | Must |
| RF-08 | HU-12 | WF-12 | #147 | Cliente | Pedido | Should |
| RF-09 | HU-21 | WF-21 | #156 | Cliente | Pago | Must |
| RF-10 | HU-08 | WF-08 | #143 | Cliente | Pago | Must |
| RF-10 | HU-09 | WF-09 | #144 | Cliente | Pedido | Must |
| RF-11 | HU-13 | WF-13 | #148 | Sistema | Cocina | Must |
| RF-11 | HU-16 | WF-16 | #151 | Sistema | Cocina | Must |
| RF-12 | HU-13 | WF-13 | #148 | Cocina | Cocina | Must |
| RF-12 | HU-14 | WF-14 | #149 | Cocina | Cocina | Must |
| RF-12 | HU-16 | WF-16 | #151 | Cocina | Cocina | Must |
| RF-13 | HU-15 | WF-15 | #150 | Cocina | Cocina | Must |
| RF-14 | HU-10 | WF-10 | #145 | Cliente | Estado del pedido | Must |
| RF-14 | HU-11 | WF-11 | #146 | Cliente | Estado del pedido | Must |
| RF-15 | HU-17 | WF-17 | #152 | Administrador | Administración del menú | Should |
| RF-15 | HU-18 | WF-18 | #153 | Administrador | Administración del menú | Should |
| RF-15 | HU-19 | WF-19 | #154 | Administrador | Administración del menú | Should |
| RF-15 | HU-20 | WF-20 | #155 | Administrador | Administración del menú | Should |

## Cobertura

- **15 RF** y **21 HU**, sin duplicados.
- **21 issues** creadas (#136 a #156) con el cuerpo de `docs/historias/HU-XX.md`, etiquetas y milestone de su módulo.
- Todo RF tiene al menos una HU: verificado sobre la matriz.
- Toda HU tiene un RF y un wireframe propio: verificado sobre la matriz.
- Todo actor tiene HU: Cliente (13), Cocina (4), Administrador (4).
- El actor **Sistema** aparece en RF-03 y RF-11 y se materializa en las HU de menú, pago y cocina; no tiene HU propia por no ser un actor humano.
- El actor **Pasarela de pago** es un sistema externo conceptual: se cubre en HU-08 sin integración real.

## Historias por módulo

| Módulo | Historias | Issues | Total |
|---|---|---|---|
| Menú | HU-01, HU-02, HU-03 | #136, #137, #138 | 3 |
| Pedido | HU-04, HU-05, HU-06, HU-07, HU-09, HU-12 | #139, #140, #141, #142, #144, #147 | 6 |
| Pago | HU-08, HU-21 | #143, #156 | 2 |
| Cocina | HU-13, HU-14, HU-15, HU-16 | #148, #149, #150, #151 | 4 |
| Estado del pedido | HU-10, HU-11 | #145, #146 | 2 |
| Administración del menú | HU-17, HU-18, HU-19, HU-20 | #152, #153, #154, #155 | 4 |

## Orden de implementación sugerido

1. Menú (HU-01 a HU-03).
2. Pedido (HU-04 a HU-07 y HU-12).
3. Pago (HU-21 y HU-08, con HU-09 como cierre).
4. Cocina (HU-13 a HU-16).
5. Estado del pedido (HU-10 y HU-11).
6. Administración del menú (HU-17 a HU-20).
