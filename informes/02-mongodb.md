# MongoDB en RestSmart — guía completa

Este documento explica **qué es MongoDB, cómo se conecta el proyecto, cómo están modelados los datos y cómo explicar su funcionamiento**. Incluye ejemplos reales de los documentos que genera la aplicación.

---

## 1. Qué es MongoDB (en una idea)

MongoDB es una base de datos **NoSQL orientada a documentos**. En lugar de tablas y filas usa:

- **Base de datos** → agrupación lógica (aquí: `restsmart`).
- **Colección** → equivalente a una tabla (aquí: `productos`, `pedidos`, …).
- **Documento** → un objeto **BSON** (JSON binario) con estructura flexible.

```json
{
  "_id": 1,
  "nombre": "Hamburguesa",
  "precioBase": 25000,
  "sector": "Parrilla"
}
```

Diferencias clave frente a una base relacional:

| Relacional | MongoDB |
|---|---|
| Tabla | Colección |
| Fila | Documento |
| Columna | Campo |
| JOIN | Documentos embebidos o referencias (`DBRef`) |
| Esquema rígido | Esquema flexible |
| Transacciones multi-tabla | Atomicidad por documento (transacciones opcionales) |

**Analogía para exponer:** una colección es una carpeta y cada documento es una ficha JSON dentro de esa carpeta. No hay que crear columnas: cada ficha puede tener campos distintos.

---

## 2. MongoDB Atlas

Atlas es el servicio en la nube de MongoDB. El proyecto usa un **cluster** con un **replica set** de tres nodos:

- `ac-84nn2kr-shard-00-00` (secundario)
- `ac-84nn2kr-shard-00-01` (**primario**)
- `ac-84nn2kr-shard-00-02` (secundario)

Un replica set mantiene copias de los datos y hace **failover automático**: si el primario cae, uno de los secundarios toma su lugar. Las escrituras van al primario y las lecturas del proyecto usan `readPreference=primary` (valor por defecto).

Características usadas:

| Característica | Detalle |
|---|---|
| TLS | La conexión usa `mongodb+srv://`, que resuelve los nodos por DNS y cifra con TLS |
| Autenticación | Usuario de base de datos con SCRAM (`miguelceballos1007_db_user`) |
| Base | `restsmart` |
| Acceso de red | La IP del equipo debe estar en la *Access List* de Atlas |

> **Importante:** la cuenta con la que se entra a la web de Atlas **no** es el usuario de base de datos. El proyecto usa solo el usuario de base de datos.

---

## 3. Cómo se conecta Spring Boot

### 3.1 Variable de entorno

La URI **no** está en el repositorio. Se lee de una variable de entorno:

```text
MDB_MCP_CONNECTION_STRING = mongodb+srv://USUARIO:PASSWORD@restsmart.hf9kjrb.mongodb.net/
```

Se configuró a nivel de usuario de Windows:

```powershell
[Environment]::SetEnvironmentVariable("MDB_MCP_CONNECTION_STRING", "mongodb+srv://...", "User")
```

### 3.2 `application.properties`

```properties
spring.application.name=restsmart
spring.mongodb.uri=${MDB_MCP_CONNECTION_STRING}
spring.mongodb.database=restsmart
```

> Spring Boot 4 cambió el prefijo: ahora es `spring.mongodb.*` (en Boot 3 era `spring.data.mongodb.*`). Si se usa la clave vieja, el cliente cae por defecto a `localhost:27017`.

### 3.3 Arranque

```powershell
cd restsmart
.\mvnw.cmd spring-boot:run
```

En el log se ve la conexión real:

```text
MongoCredential{... userName='miguelceballos1007_db_user' ...}
clusterSettings={ srvHost=restsmart.hf9kjrb.mongodb.net, requiredReplicaSetName='atlas-xvcnk9-shard-0' }
Monitor thread successfully connected to server ... type=REPLICA_SET_PRIMARY
```

---

## 4. Base de datos y colecciones

Base: **`restsmart`**

| Colección | Documento representa | Origen |
|---|---|---|
| `categorias` | Categoría del menú | `Categoria` |
| `productos` | Producto del menú | `Producto` |
| `mesas` | Mesa del restaurante | `Mesa` |
| `pedidos` | Pedido con ítems, pago y datos de contacto | `Pedido` |
| `tareasPreparacion` | Tarea de un sector para un pedido | `TareaPreparacion` |
| `secuencias` | Contadores para IDs `Integer` | `GeneradorSecuencia` (infraestructura) |

---

## 5. Documentos de ejemplo

Los documentos reales incluyen un campo `_class` que agrega Spring Data para saber a qué clase Java mapear.

### 5.1 `categorias`

```json
{
  "_id": 1,
  "nombre": "Bebidas",
  "descripcion": "Bebidas frias y calientes",
  "orden": 1,
  "icono": "bebida",
  "activa": true,
  "_class": "com.restsmart.modelo.dominio.Categoria"
}
```

### 5.2 `productos`

```json
{
  "_id": 1,
  "nombre": "Hamburguesa",
  "descripcion": "Hamburguesa de res",
  "precioBase": 25000,
  "imagenURL": null,
  "activo": true,
  "categoria": { "$ref": "categorias", "$id": 2 },
  "sector": "Parrilla",
  "variantes": [
    { "nombre": "Sencilla", "precioAdicional": 0 },
    { "nombre": "Doble", "precioAdicional": 5000 }
  ],
  "complementos": [
    { "nombre": "Queso", "precioAdicional": 2000, "obligatorio": false }
  ],
  "_class": "com.restsmart.modelo.dominio.Producto"
}
```

- `categoria` es un **`DBRef`**: apunta al documento de `categorias` con `_id = 2`.
- `variantes` y `complementos` son **documentos embebidos** (no tienen colección propia).
- Los enums se guardan como texto (`"Parrilla"`).

### 5.3 `mesas`

```json
{
  "_id": 1,
  "numero": 1,
  "habilitada": true,
  "_class": "com.restsmart.modelo.dominio.Mesa"
}
```

### 5.4 `pedidos`

```json
{
  "_id": 1,
  "numeroPedido": 1,
  "fechaHora": "2026-11-21T20:22:37.816Z",
  "estado": "Listo",
  "total": 25000,
  "confirmadoEnPantalla": false,
  "avisoCerrado": false,
  "items": [
    {
      "id": 1,
      "cantidad": 1,
      "precioUnitario": 25000,
      "subtotal": 25000,
      "producto": { "$ref": "productos", "$id": 1 },
      "opciones": [],
      "observaciones": null
    }
  ],
  "mesa": { "$ref": "mesas", "$id": 1 },
  "pago": {
    "monto": 25000,
    "fechaHora": "2026-11-21T20:22:37.816Z",
    "estado": "Confirmado",
    "referenciaExterna": "PAGO-d7b054a2-4a1b-491c-81ea-a05b743dcb92"
  },
  "datoContacto": {
    "nombre": "Miguel",
    "medio": "Correo",
    "valor": "miguel@example.com"
  },
  "_class": "com.restsmart.modelo.dominio.Pedido"
}
```

- `items`, `pago` y `datoContacto` están **embebidos**: viven dentro del pedido.
- `producto` y `mesa` son **`DBRef`**.
- `tareas` **no** se guarda aquí: vive en `tareasPreparacion` y se marca como campo `@Transient`.

### 5.5 `tareasPreparacion`

```json
{
  "_id": 1,
  "sector": "Parrilla",
  "estado": "Completada",
  "pedido": { "$ref": "pedidos", "$id": 1 },
  "fechaHoraCreacion": "2026-11-21T20:22:37.900Z",
  "fechaHoraCompletada": "2026-11-21T20:22:40.242Z",
  "indicaciones": "",
  "items": [
    {
      "id": 1,
      "cantidad": 1,
      "precioUnitario": 25000,
      "subtotal": 25000,
      "producto": { "$ref": "productos", "$id": 1 },
      "opciones": []
    }
  ],
  "_class": "com.restsmart.modelo.dominio.TareaPreparacion"
}
```

### 5.6 `secuencias`

```json
[
  { "_id": "producto", "valor": 2 },
  { "_id": "pedido", "valor": 1 },
  { "_id": "itemPedido", "valor": 2 },
  { "_id": "tareaPreparacion", "valor": 1 }
]
```

---

## 6. Embebido vs. referenciado

| Estrategia | Cuándo se usó | Ventaja | Costo |
|---|---|---|---|
| **Embeber** | `items`, `pago`, `datoContacto`, `opciones` | Una sola lectura trae todo el pedido | El documento crece; límite de 16 MB |
| **Referenciar (`DBRef`)** | `categoria`, `producto`, `mesa`, `pedido` | Evita duplicar datos que cambian | Cada referencia puede ser otra consulta |

**Regla mental:** lo que se lee junto y no cambia por separado se embebe; lo que tiene vida propia y se comparte se referencia.

En el código:

```java
@DBRef
private Categoria categoria;   // referencia

private List<ItemPedido> items; // embebido
```

---

## 7. Spring Data MongoDB: cómo se mapea

| Anotación | Qué hace |
|---|---|
| `@Document(collection = "pedidos")` | Mapea la clase a la colección |
| `@Id` | Marca el identificador (`Integer`) |
| `@DBRef` | Guarda `{"$ref": "...", "$id": ...}` |
| `@Transient` | No persiste el campo |
| `MongoRepository<T, ID>` | Aporta `save`, `findById`, `findAll`, `delete`, `count` |

Ejemplo:

```java
public interface PedidoRepository extends MongoRepository<Pedido, Integer> { }
```

Spring genera la implementación en tiempo de arranque. En el log:

```text
Found 5 MongoDB repository interfaces.
```

---

## 8. IDs `Integer` y la colección `secuencias`

MongoDB genera por defecto `_id` de tipo `ObjectId`. El diagrama exige `Integer`, así que se implementó un contador atómico:

```java
Query query = new Query(Criteria.where("_id").is(nombre));
Update update = new Update().inc("valor", 1);
FindAndModifyOptions options = FindAndModifyOptions.options().upsert(true).returnNew(true);
Document documento = mongoTemplate.findAndModify(query, update, options, Document.class, "secuencias");
```

Qué significa:

1. Busca el documento cuyo `_id` es el nombre de la secuencia (por ejemplo `"pedido"`).
2. Incrementa `valor` en 1.
3. Si no existe, lo crea (`upsert`).
4. Devuelve el documento **nuevo** (`returnNew`).

Es una operación **atómica** en el servidor: dos peticiones simultáneas no obtienen el mismo número.

---

## 9. Cómo consulta la aplicación

Los repositorios solo usan `save`, `findById` y `findAll` (las operaciones del diagrama). Los filtros se hacen en memoria:

```java
return productoRepository.findAll().stream()
        .filter(Producto::estadoDisponible)
        .filter(p -> p.getCategoria() != null && Objects.equals(p.getCategoria().getId(), idBuscado))
        .toList();
```

**Ventaja:** fidelidad al diagrama y simplicidad.

**Costo:** trae toda la colección. Para producción se recomienda una consulta derivada y un índice:

```java
List<Producto> findByCategoria_IdAndActivoTrue(Integer categoriaId);
```

---

## 10. Índices recomendados

MongoDB solo crea índice en `_id` por defecto. Para el volumen de un restaurante conviene añadir:

```javascript
use restsmart

db.productos.createIndex({ "categoria.$id": 1, activo: 1 })
db.pedidos.createIndex({ numeroPedido: 1 }, { unique: true })
db.tareasPreparacion.createIndex({ sector: 1, estado: 1 })
db.pedidos.createIndex({ estado: 1 })
```

| Índice | Consulta que acelera |
|---|---|
| `productos (categoria.$id, activo)` | Menú por categoría |
| `pedidos (numeroPedido)` | Búsqueda por número y unicidad |
| `tareasPreparacion (sector, estado)` | Tareas pendientes por sector |
| `pedidos (estado)` | Seguimiento y filtros por estado |

Los índices se crean desde Atlas (**Indexes**) o con `mongosh`.

---

## 11. Cómo inspeccionar los datos

### 11.1 Atlas (interfaz web)

1. Entrar a <https://cloud.mongodb.com>.
2. **Database** → **Browse Collections**.
3. Seleccionar la base `restsmart` y una colección.
4. Usar **Filter** para buscar, por ejemplo `{ "sector": "Parrilla" }`.
5. **Indexes** muestra los índices; **Metrics** muestra operaciones y conexiones.

### 11.2 `mongosh`

```javascript
use restsmart

show collections
db.productos.find().pretty()
db.productos.countDocuments()
db.pedidos.findOne({ _id: 1 })
db.tareasPreparacion.find({ sector: "Parrilla", estado: "Pendiente" })
db.secuencias.find()
```

### 11.3 Compass

MongoDB Compass es la interfaz gráfica oficial: permite ver documentos, ejecutar filtros y crear índices sin escribir comandos.

---

## 12. Ciclo de vida del pedido en los documentos

| Momento | `pedidos` | `tareasPreparacion` |
|---|---|---|
| Carrito | No existe documento; el carrito está en memoria | — |
| Confirmación | Se crea el pedido con `estado = null` | — |
| Datos de contacto | Se guarda `datoContacto` | — |
| Pago | Se guarda `pago.estado = "Confirmado"` y `estado = "Pagado"` | — |
| Enrutamiento | `estado = "EnPreparacion"` | Se crea una tarea por sector |
| Cocina completa una tarea | — | `estado = "Completada"` + `fechaHoraCompletada` |
| Última tarea completada | `estado = "Listo"` | — |
| Cliente ve el aviso | `avisoCerrado = true` al cerrarlo | — |
| Cancelación (antes de pagar) | `estado = "Cancelado"` | No se generan tareas |

---

## 13. Seguridad

| Tema | Cómo está resuelto |
|---|---|
| Credenciales | Fuera del repositorio, en variable de entorno |
| Usuario de BD | Usuario dedicado de Atlas con permisos sobre `restsmart` |
| Transporte | TLS (`mongodb+srv://`) |
| Red | Lista de acceso de IP en Atlas |
| Recomendación | Crear un usuario solo-lectura para consultas y uno de escritura para la app |

Buenas prácticas adicionales:

- No reutilizar la cuenta personal de Atlas como usuario de base de datos.
- Rotar la contraseña si se comparte en un chat.
- En producción, restringir la IP a la del servidor, no `0.0.0.0/0`.
- Activar alertas de Atlas (conexiones, CPU, disco).

---

## 14. Respaldo y recuperación

| Opción | Cuándo usarla |
|---|---|
| **Snapshots de Atlas** | Planes dedicados (M10+); restauración desde la interfaz |
| `mongodump` / `mongorestore` | Copias manuales de una base pequeña |
| Exportar colección | Atlas → Collection → Export |

Ejemplo de copia manual:

```powershell
mongodump --uri "mongodb+srv://USUARIO:PASSWORD@restsmart.hf9kjrb.mongodb.net/restsmart" --out .\respaldo
mongorestore --uri "mongodb+srv://USUARIO:PASSWORD@restsmart.hf9kjrb.mongodb.net/" .\respaldo
```

---

## 15. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `MongoSocketOpenException: Connection refused` a `localhost:27017` | La URI no se leyó (variable no definida o propiedad con prefijo viejo) | Definir `MDB_MCP_CONNECTION_STRING` y usar `spring.mongodb.uri` |
| `MongoTimeoutException ... serverSelectionTimeout` | IP no autorizada o red bloqueada | Agregar la IP en **Network Access** |
| `Authentication failed` | Usuario/contraseña incorrectos o caracteres sin codificar | Revisar credenciales y codificar (`@` → `%40`) |
| `E11000 duplicate key` | Se reinició `secuencias` con documentos existentes | Reiniciar también las colecciones o ajustar el contador |
| `Cannot convert ... to Integer` | `_id` guardado como `ObjectId` | Insertar documentos con `_id` numérico |
| Documento demasiado grande | Muchos ítems embebidos | Referenciar en colecciones separadas |

---

## 16. Cómo explicar MongoDB en la exposición

**1. Idea general**
“MongoDB guarda documentos JSON en colecciones. Una colección es como una carpeta y cada documento es una ficha con los datos del pedido.”

**2. Por qué se eligió**
“El pedido es naturalmente un documento: ítems, pago y datos de contacto se leen juntos. Embeberlos evita JOINs y simplifica el modelo.”

**3. Cómo se conecta**
“Spring Boot lee `spring.mongodb.uri`, que viene de una variable de entorno con la URI de Atlas. Atlas resuelve el replica set por DNS y cifra con TLS.”

**4. Cómo se modeló**
“`categorias`, `productos`, `mesas`, `pedidos` y `tareasPreparacion` son colecciones. Lo que se comparte se referencia con `DBRef`; lo que pertenece al pedido se embebe.”

**5. Cómo se generan los IDs**
“El diagrama pide `Integer`. Como Mongo usa `ObjectId`, se implementó una colección `secuencias` con `findAndModify` e `$inc`, que es atómica.”

**6. Cómo se demuestra en vivo**
“Abro Atlas → Browse Collections → `restsmart` → `pedidos`, filtro `{ _id: 1 }` y se ve el pago confirmado y el estado `Listo`. En `tareasPreparacion` se ve la tarea `Completada`.”

**7. Ventajas y límites**
“Ventajas: esquema flexible, lectura de un pedido en un solo documento, escalado horizontal. Límites: no hay JOIN nativo, hay que cuidar el tamaño del documento y diseñar índices.”

---

## 17. Glosario

| Término | Significado |
|---|---|
| **BSON** | Formato binario de JSON que usa MongoDB |
| **Colección** | Grupo de documentos |
| **Documento** | Registro JSON/BSON |
| **`_id`** | Identificador único del documento |
| **`DBRef`** | Referencia a otro documento |
| **Embedded document** | Documento anidado dentro de otro |
| **Replica set** | Grupo de nodos con copias y failover |
| **Primario** | Nodo que recibe escrituras |
| **Secundario** | Nodo con copia de los datos |
| **Atlas** | Servicio administrado de MongoDB en la nube |
| **`mongosh`** | Shell oficial de MongoDB |
| **Índice** | Estructura que acelera consultas |
| **Upsert** | Insertar si no existe, actualizar si existe |
| **SCRAM** | Mecanismo de autenticación usado por MongoDB |
