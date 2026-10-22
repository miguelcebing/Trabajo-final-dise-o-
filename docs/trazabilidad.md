# Matriz de trazabilidad

Relaciona cada requerimiento con sus historias, wireframes, issue, actor, módulo y prioridad.
La columna `Issue` se completa con el número real que GitHub asigne al crear cada issue (GitHub no permite reasignar números).

## Requerimientos e historias

| RF | HU | WF | Issue | Actor | Módulo | Prioridad |
|---|---|---|---|---|---|---|
| RF-01 | HU-01 | WF-01 | #— (por crear) | Cliente | Menú | Must |
| RF-01 | HU-02 | WF-02 | #— (por crear) | Cliente | Menú | Must |
| RF-02 | HU-03 | WF-03 | #— (por crear) | Cliente | Menú | Must |
| RF-03 | HU-03 | WF-03 | #— (por crear) | Sistema | Menú | Must |
| RF-04 | HU-04 | WF-04 | #— (por crear) | Cliente | Pedido | Must |
| RF-04 | HU-05 | WF-05 | #— (por crear) | Cliente | Pedido | Must |
| RF-05 | HU-05 | WF-05 | #— (por crear) | Cliente | Pedido | Must |
| RF-06 | HU-06 | WF-06 | #— (por crear) | Cliente | Pedido | Must |
| RF-07 | HU-07 | WF-07 | #— (por crear) | Cliente | Pedido | Must |
| RF-08 | HU-12 | WF-12 | #— (por crear) | Cliente | Pedido | Should |
| RF-09 | HU-21 | WF-21 | #— (por crear) | Cliente | Pago | Must |
| RF-10 | HU-08 | WF-08 | #— (por crear) | Cliente | Pago | Must |
| RF-10 | HU-09 | WF-09 | #— (por crear) | Cliente | Pedido | Must |
| RF-11 | HU-13 | WF-13 | #— (por crear) | Sistema | Cocina | Must |
| RF-11 | HU-16 | WF-16 | #— (por crear) | Sistema | Cocina | Must |
| RF-12 | HU-13 | WF-13 | #— (por crear) | Cocina | Cocina | Must |
| RF-12 | HU-14 | WF-14 | #— (por crear) | Cocina | Cocina | Must |
| RF-12 | HU-16 | WF-16 | #— (por crear) | Cocina | Cocina | Must |
| RF-13 | HU-15 | WF-15 | #— (por crear) | Cocina | Cocina | Must |
| RF-14 | HU-10 | WF-10 | #— (por crear) | Cliente | Estado del pedido | Must |
| RF-14 | HU-11 | WF-11 | #— (por crear) | Cliente | Estado del pedido | Must |
| RF-15 | HU-17 | WF-17 | #— (por crear) | Administrador | Administración del menú | Should |
| RF-15 | HU-18 | WF-18 | #— (por crear) | Administrador | Administración del menú | Should |
| RF-15 | HU-19 | WF-19 | #— (por crear) | Administrador | Administración del menú | Should |
| RF-15 | HU-20 | WF-20 | #— (por crear) | Administrador | Administración del menú | Should |

## Cobertura

- **15 RF** y **21 HU**, sin duplicados.
- Todo RF tiene al menos una HU: verificado sobre la matriz.
- Toda HU tiene un RF y un wireframe propio: verificado sobre la matriz.
- Todo actor tiene HU: Cliente (13), Cocina (4), Administrador (4).
- El actor **Sistema** aparece en RF-03 y RF-11 y se materializa en las HU de menú, pago y cocina; no tiene HU propia por no ser un actor humano.
- El actor **Pasarela de pago** es un sistema externo conceptual: se cubre en HU-08 sin integración real.

## Historias por módulo

| Módulo | Historias | Total |
|---|---|---|
| Menú | HU-01, HU-02, HU-03 | 3 |
| Pedido | HU-04, HU-05, HU-06, HU-07, HU-09, HU-12 | 6 |
| Pago | HU-08, HU-21 | 2 |
| Cocina | HU-13, HU-14, HU-15, HU-16 | 4 |
| Estado del pedido | HU-10, HU-11 | 2 |
| Administración del menú | HU-17, HU-18, HU-19, HU-20 | 4 |

## Orden de implementación sugerido

1. Menú (HU-01 a HU-03).
2. Pedido (HU-04 a HU-07 y HU-12).
3. Pago (HU-21 y HU-08, con HU-09 como cierre).
4. Cocina (HU-13 a HU-16).
5. Estado del pedido (HU-10 y HU-11).
6. Administración del menú (HU-17 a HU-20).
