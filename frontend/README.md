# RestSmart — Frontend

Frontend estático de **RestSmart** (HTML + CSS + JavaScript vanilla, sin build step) con
liquid glass + claymorphism, animaciones de física clay y datos **solo de la API real**.

## Ejecutar

1. Backend (terminal 1), desde la raíz del repositorio:

   ```powershell
   cd restsmart
   .\mvnw.cmd spring-boot:run
   ```

   Requiere Java 21 y la variable `MDB_MCP_CONNECTION_STRING`.

2. Frontend + proxy (terminal 2), desde la raíz:

   ```powershell
   python frontend/serve.py
   ```

3. Abrir <http://127.0.0.1:5173>.

El proxy sirve `frontend/` y reenvía `/api/*` a `http://127.0.0.1:8080`, de modo que el
navegador ve un solo origen y no hace falta configurar CORS en Spring Boot. El backend no
se modifica.

Variables opcionales: `PORT` (por defecto `5173`) y `BACKEND` (por defecto
`http://127.0.0.1:8080`).

## Rutas

| Hash | Pantalla |
|---|---|
| `#cliente/menu` | Menú por categorías |
| `#cliente/carrito` | Carrito editable |
| `#cliente/mesa` | Selección de mesa |
| `#cliente/resumen` | Resumen previo al pago |
| `#cliente/pago` | Pago (simulado en el frontend) |
| `#cliente/comprobante` | Comprobante del pedido simulado |
| `#cliente/seguimiento` | Estado del pedido (real o demo) |
| `#cocina/tareas/<sector>` | Tablero de cocina (`Bebidas`, `Parrilla`, `CocinaFria`, `Postres`) |
| `#cocina/historial/<sector>` | Historial del turno |
| `#admin/catalogo` | Administración del menú |
| `#admin/nuevo` | Alta de producto |

## Qué usa de la API

- `GET /menu/categoria/{id}` — para descubrir categorías con productos activos (la API no
  expone un listado de categorías, así que se sondean los IDs 1–12).
- `GET /menu/producto/{id}`, `POST .../opciones`, `POST .../precio`.
- `POST/PUT/DELETE /pedido/items...`, `GET /pedido/resumen`, `PUT /pedido/mesa`.
- `GET/PUT /cocina/...`.
- `GET /seguimiento/{id}/estado` y `/aviso`.
- `POST/PUT/DELETE /admin/productos...`.

No hay catálogo demo ni datos inventados: si la API no responde, la interfaz lo dice y
ofrece reintentar. La única pieza local es el **pedido de pago simulado** (`js/demo.js`),
que siempre se presenta en pantalla como demostración.

## Límites actuales (por la API)

- **Pago y comprobante (RF-09 / RF-10)**: la API no expone endpoint de pago, así que el
  pago se **simula en el frontend**. El formulario de contacto es real y se valida; al
  confirmar se genera un comprobante local (`localStorage`), se vacía el carrito del kiosco
  y se ofrece el seguimiento de demostración. **El pedido no se envía al backend ni a
  cocina**: no aparecerá en los tableros de preparación.
- **Seguimiento**: un número real se consulta contra `GET /seguimiento/{id}/estado`; el
  número del pedido simulado se resuelve en local y su avance es manual (botón
  «Simular avance») para no fingir progreso de cocina.
- **Categorías y mesas**: no hay endpoint de listado. Las categorías se derivan de los
  productos devueltos; la mesa se captura por número y la API valida que exista.
- **Productos desactivados**: `GET /menu/categoria/{id}` solo devuelve activos, así que un
  producto desactivado desaparece del catálogo y no se puede reactivar desde la interfaz.
- **Imágenes**: `imagenURL` viene nula y la API no permite administrarla; se usan medallones
  ilustrados por sector, no fotos falsas.

## Estructura

```
frontend/
├── index.html
├── serve.py              # estáticos + proxy /api
├── package.json          # solo marca el JS como ESM para herramientas
├── assets/fonts/         # Bricolage Grotesque + Gabarito (self-hosted)
├── css/
│   ├── tokens.css        # fuentes, paleta, base, superficies
│   ├── shell.css         # top bar, rail, primitivas, overlays
│   ├── views.css         # menú, carrito, mesa, resumen, pago, cocina, admin
│   └── motion.css        # keyframes y reduced motion
└── js/
    ├── app.js            # shell, rutas, estado y orquestación
    ├── api.js            # adaptador de la API real
    ├── demo.js           # pedido de pago simulado (local, marcado como demo)
    ├── icons.js          # set SVG propio
    ├── ui.js             # toasts, sheets, formato, estados
    └── views/            # cliente, cocina, admin
```
