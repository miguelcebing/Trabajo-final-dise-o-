# Especificación Funcional - Sistema de Autoservicio Restaurante

## Resumen del Proyecto
Sistema de autoservicio para restaurante que permite a los clientes visualizar el menú, personalizar productos, gestionar su pedido y realizar el pago desde pantallas táctiles (kioscos).

**Plataforma detectada:** Touchscreen / kiosco

---

## Historias de Usuario Generadas

| ID | Título | Prioridad | Módulo | Requerimientos | Issue |
|---|---|---|---|---|---|
| HU-01 | Visualización del menú digital en pantalla táctil | Alta | Menú Digital | RF-01, RF-02, RF-03, RF-13, RF-14 | [#1](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/1) |
| HU-02 | Consulta y personalización de productos | Alta | Menú Digital | RF-04, RF-05, RF-06, RF-07, RF-08 | [#2](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/2) |
| HU-03 | Gestión del carrito de compra | Alta | Carrito | RF-09, RF-10, RF-11, RF-12 | [#3](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/3) |
| HU-04 | Inicio de orden y selección de tipo de pedido | Alta | Pedido | RF-15, RF-16, RF-17 | [#4](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/4) |
| HU-05 | Confirmación, envío y seguimiento de pedido | Alta | Pedido | RF-18, RF-19, RF-20, RF-21, RF-22, RF-23 | [#5](https://github.com/miguelcebing/Trabajo-final-dise-o-/issues/5) |

---

## Flujo del Usuario

```
[Inicio] → HU-04 (Nueva Orden / Tipo pedido)
    ↓
[Menú] → HU-01 (Ver menú por categorías)
    ↓
[Producto] → HU-02 (Personalizar producto)
    ↓
[Carrito] → HU-03 (Gestionar carrito)
    ↓
[Confirmar] → HU-05 (Resumen, confirmar, seguir estado)
```

---

## Requerimientos No Funcionales Detectados

- El sistema debe soportar múltiples kioscos simultáneamente
- La disponibilidad de productos debe actualizarse en tiempo real
- El sistema de cocina debe recibir pedidos inmediatamente tras confirmación
- La interfaz debe ser accesible para usuarios sin experiencia técnica

---

## Supuestos del Agente

1. El restaurante cuenta con inventario conectado al sistema para disponibilidad en tiempo real
2. Los productos tienen configuración de ingredientes obligatorios vs opcionales
3. El sistema aplica IVA automáticamente
4. Existe integración con sistema de gestión de cocina
5. El número máximo de mesas está configurado en el sistema
