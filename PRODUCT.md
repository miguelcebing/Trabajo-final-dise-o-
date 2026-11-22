# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS single-page app (vanilla, no framework), delivered as a standalone `frontend/` folder. Decision offered and confirmed by the user: HTML is a requirement, SPA structure is the confirmed choice.

## Users

- **Cliente / comensal**: está frente a una pantalla táctil de autoservicio en el restaurante. Consulta el menú, arma su pedido, elige mesa, paga y sigue el estado de su pedido.
- **Cocina (por sector)**: personal de uno de los cuatro sectores fijos (Bebidas, Parrilla, Cocina fría, Postres) que ve las tareas de preparación de su sector y las marca como completadas.
- **Administrador del menú**: mantiene el catálogo de productos, su precio, descripción, disponibilidad y sector de preparación.
- **Sistema**: ejecuta reglas automáticas de precio, enrutamiento por sector y transición de estados.

## Product Purpose

RestSmart es un sistema de autoservicio para restaurante: el cliente pide desde una pantalla táctil sin intervención del mesero, el pago se confirma en pantalla y la cocina recibe el pedido ya dividido por sector de preparación. El éxito significa que un cliente completa menú → carrito → mesa → pago → seguimiento sin ayuda, y que cada sector de cocina recibe solo los ítems que le corresponden.

## Positioning

La división automática de un pedido en tareas por sector de cocina (Bebidas, Parrilla, Cocina fría, Postres) y la consolidación del estado del pedido a partir del avance de esas tareas. Un menú digital genérico no puede replicarlo sin el modelo de sectores y enrutamiento.

## Operating Context

- Pantallas táctiles horizontales de 1280 × 720 para el kiosco del cliente (wireframes oficiales).
- Pantallas de cocina por sector y pantalla de administración en navegador web.
- Sectores de cocina fijos: Bebidas, Parrilla, Cocina fría, Postres.
- El pago es simulado: la pantalla registra la confirmación del cliente y deja preparado el punto de integración con una pasarela real.
- La identificación del cliente usa número de mesa más datos de contacto (nombre y un medio de contacto) capturados antes de pagar.
- Fuera de alcance: inventario, reportes, riel de transporte, reservas, propinas, fidelización, domicilios y facturación.

## Capabilities and Constraints

- Alcance funcional: 15 requerimientos (RF-01 a RF-15) y 21 historias de usuario (HU-01 a HU-21). La entrega de frontend cubre todas: experiencia cliente, cocina por sector y administración del menú.
- Backend existente: API REST Spring Boot en `restsmart/` con endpoints de menú, pedido, cocina, seguimiento y administración. **No se modifica en esta fase** (decisión del usuario: "solo frontend con lo existente").
- Faltan en el backend actual: endpoint de pago, listado de categorías, listado de mesas y datos iniciales. El frontend debe adaptarse a lo existente y simular localmente esas piezas para que la experiencia sea funcional.
- Carrito del backend: estado global de sesión única de kiosco (`sesionId = "kiosco"`).
- Categorías y mesas no tienen endpoint de listado; el frontend requiere un origen de datos local para ellas.
- Sin autenticación ni roles en la API actual.
- La entrega debe ser estática y ejecutable en navegador sin build step.
- Idioma de la interfaz: español.
- Backend design questions for a later phase are explicitly requested by the user and are open decisions, not part of this build.

## Brand Commitments

- Nombre del producto: **RestSmart**.
- Restricción visual declarada por el usuario y vinculante: **liquid glass combinado con claymorphism**, con animaciones.
- Wireframes de referencia: `docs/wireframes/` (baja fidelidad, escala de grises, táctil 1280 × 720).

## Evidence on Hand

- Requerimientos: `docs/requerimientos/RF.md`.
- Historias con criterios de aceptación: `docs/historias/HU-01.md` … `HU-21.md`.
- Wireframes SVG: `docs/wireframes/WF-01.svg` … `WF-21.svg`.
- Trazabilidad y diagramas UML: `docs/trazabilidad.md`, `docs/insumos-diagramas.md`, `diagramas/`.
- Backend real: `restsmart/` (endpoints documentados en `restsmart/README.md`).
- **Ausencias que no se deben inventar:** no hay logo, fotografías de productos, carta real con precios, testimonios ni métricas de negocio. Los datos de menú serán de demostración y deben marcarse como tales.

## Product Principles

1. El cliente completa el pedido solo, sin fricción y sin ayuda del personal.
2. Cada sector recibe únicamente lo que le toca preparar; el enrutamiento es la promesa central.
3. El estado del pedido se deriva del avance real de las tareas, no de una estimación.
4. La pantalla táctil manda: áreas de toque amplias, pasos cortos y feedback inmediato.
5. El pago simulado debe sentirse como un pago real, con su comprobante y su seguimiento.

## Accessibility & Inclusion

- Áreas táctiles de al menos 88 px (convención de los wireframes).
- En pantalla táctil horizontal 1280 × 720 como escena principal; el diseño debe degradar con dignidad a escritorio y móvil.
- Contraste legible sobre superficies de vidrio; el movimiento debe respetar `prefers-reduced-motion`.
