---
version: 1
slug: "frontend-index-html"
primary_target: "frontend/index.html"
related_targets: []
---

# Surface brief — RestSmart frontend

## Scope and visitor mode

Operate. Full frontend for RestSmart: cliente kiosk (menu → cart → table → summary → payment/tracking), cocina by sector, and menu administration. Primary target and first viewport: the client menu at 1280 × 720 touch. Real API only; endpoints the backend does not expose stay visible but disabled. Delivered as static HTML/CSS/JS with a local Python proxy to the Spring Boot API.

## Audience, job, action, constraints

- Diner at a touch kiosk: build an order without help, pick a table, review the total. Success is reaching the summary with a correct cart.
- Kitchen staff: see only their sector's tasks, complete them, review the shift history.
- Menu admin: create products, change price/description, deactivate, reassign sector.
- Constraints: no backend code changes; no authenticated roles; categories and tables have no list endpoint; payment has no endpoint; product images are null; Spanish UI; 88 px touch targets; reduced-motion support.

## Chosen direction and memorable moment

Liquid glass fused with claymorphism on a warm, low-light dining room canvas. Glass carries the shell and the surfaces that must feel refractive; clay carries every control and every price pill, so touch feels physical. Memorable moment: the cart orb — a floating liquid-glass bubble in the top bar that squashes, stretches, and snaps when an item is added, fed by a curved flight from the product card.

## Direction contract

THESIS: A restaurant kiosk that feels like handling warm molten glass and soft clay, refusing the flat card-grid food app and the generic dark dashboard.

OWN-WORLD: Deep espresso ground lit by drifting ember and mango auroras, with a fine grain. Shell and large surfaces are liquid glass: heavy blur, saturation, a specular rim, an inner top highlight, and a pointer-following sheen. Every control is clay: peach, sand, and mocha pellets with dual soft shadows, inner light and squash. Palette roles: ember #FF7A3D primary, mango #FFC24B attention, mint #8FD6A0 success, chili #FF5C4D danger, cream #FFF1E4 text. Display: Bricolage Grotesque; body: Gabarito. Icons: one authored SVG family, 1.75 stroke.

STORY: The diner recognizes real dishes, adds one with its variants and complements, sees the price computed by the API, checks the cart, chooses a table, and reviews the order. Kitchen staff sees a sector board and completes tasks; admin maintains the catalog. Actions the API cannot support are visibly present, explained, and disabled — never faked.

FIRST VIEWPORT: 1280 × 720. A 76 px glass top bar: RestSmart mark at left, mode segmented control (Cliente / Cocina / Admin) at center-right, live API status, cart orb at far right. Below, an 88 px glass step rail (Menú, Carrito, Mesa, Resumen) and the menu stage. The stage opens with the category chips and a 56 px Bricolage title over the real catalog, then a wide featured dish panel in glass-clay: dish medallion at left, name and description, price pill, variant chips, and a 64 px ember clay "Agregar" action. The product grid follows with clay tiles on glass. The primary action sits inside the featured panel and repeats on each tile.

FORM: Brief-pinned world, no concept-seed roll; Operate mode rules govern. The world contributes type, palette, density, and one signature move only. Navigation, controls, tables, and forms stay standard web patterns.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- Backend next phase: cart per session/kiosk, payment endpoint, catalog seed. Cart-per-session and payment priority were named by the user as future work.
- Category discovery: the API has no category list, so the client probes sequential category IDs and derives names from returned products.
- No product photography exists; dish medallions are authored SVG illustrations, not synthetic photos.
