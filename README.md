# Sistema de Autoservicio para Restaurante

**Proyecto Final - Diseño de Software**

Sistema integral de gestión para restaurante con autoservicio digital, cocina automatizada, inventario en tiempo real y transporte por riel.

---

## 📋 Índice / Navegación

| Documento | Descripción | Enlace |
|-----------|-------------|--------|
| **Especificación Funcional** | Requerimientos funcionales RF-01 a RF-56, casos de uso, reglas de negocio | [ESPECIFICACION-FUNCIONAL.md](ESPECIFICACION-FUNCIONAL.md) |
| **Modelo de Dominio** | Entidades, atributos, relaciones, cardinalidades, diagrama Mermaid, tablas para Visual Paradigm | [MODELO-DOMINIO.md](MODELO-DOMINIO.md) |
| **Requerimientos** | Lista original de requerimientos (RF-01 a RF-56) | [requerimientos/requerimientos.txt](requerimientos/requerimientos.txt) |
| **Wireframes** | Maquetas de pantallas: menú digital, autoservicio, cocina, riel, administración | [wireframes/](wireframes/) |
| **Wiki** | Documentación extendida, decisiones de diseño, guías técnicas | [wiki/](wiki/) |

---

## 🏗️ Estructura del Proyecto

```
Trabajo-final-diseño/
├── ESPECIFICACION-FUNCIONAL.md   # Requerimientos funcionales detallados
├── MODELO-DOMINIO.md             # Modelo conceptual de dominio (DDD)
├── README.md                     # Este archivo
├── requerimientos/
│   └── requerimientos.txt        # Requerimientos originales (RF-01 a RF-56)
├── wireframes/                   # Maquetas de interfaz (PNG/Draw.io/Figma)
└── wiki/                         # Documentación técnica extendida
```

---

## 🎯 Alcance del Sistema

El sistema cubre 12 módulos funcionales:
1. **Gestión del Menú Digital** (RF-01 a RF-14)
2. **Toma de Pedidos - Autoservicio** (RF-15 a RF-23)
3. **Gestión de Pedidos** (RF-24 a RF-27)
4. **Gestión de Cocina** (RF-28 a RF-31)
5. **Organización de Estaciones** (RF-32 a RF-34)
6. **Sistema de Riel Automatizado** (RF-35 a RF-38)
7. **Gestión de Mesas** (RF-39 a RF-41)
8. **Gestión de Inventario** (RF-42 a RF-45)
9. **Administración del Menú** (RF-46 a RF-48)
10. **Administración y Reportes** (RF-49 a RF-51)
11. **Notificaciones y Alertas** (RF-52 a RF-53)
12. **Integración del Sistema** (RF-54 a RF-56)

---

## 👥 Roles del Sistema

| Rol | Permisos principales |
|-----|---------------------|
| **Cliente (Autoservicio)** | Navegar menú, personalizar productos, crear pedido, pagar, ver estado |
| **Cocinero** | Ver tareas de su estación, marcar completadas, reportar retrasos |
| **Jefe de Cocina** | Supervisar todas las estaciones, gestionar alertas, reasignar tareas |
| **Mesero** | Ver estado de mesas/pedidos, atender solicitudes, cerrar cuentas |
| **Administrador** | CRUD productos/categorías, usuarios, inventario, reportes, configuración |

---

## 📄 Licencia

Proyecto académico - Uso educativo.