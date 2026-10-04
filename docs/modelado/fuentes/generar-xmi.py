#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera archivos XMI (UML 2.1) importables en Visual Paradigm a partir de los
modelos del proyecto. Salida: *.xmi en la misma carpeta (docs/modelado/fuentes/).

Uso:  python generar-xmi.py
"""
import os
from xml.sax.saxutils import escape, quoteattr

OUT = os.path.dirname(os.path.abspath(__file__))


def attrs(d):
    return " ".join('%s=%s' % (k, quoteattr(str(v))) for k, v in d.items())


def header(name):
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<xmi:XMI xmi:version="2.1" '
        'xmlns:xmi="http://schema.omg.org/spec/XMI/2.1" '
        'xmlns:uml="http://schema.omg.org/spec/UML/2.1">\n'
        '<uml:Model xmi:id="model" name=%s>\n' % quoteattr(name)
    )


FOOTER = "</uml:Model>\n</xmi:XMI>\n"


def attr_line(aid, name, typ, visibility="private", static=False):
    return (
        '      <ownedAttribute xmi:type="uml:Property" xmi:id=%s name=%s type=%s '
        'visibility=%s isStatic=%s/>\n'
        % (quoteattr(aid), quoteattr(name), quoteattr(typ), quoteattr(visibility),
           quoteattr("true" if static else "false"))
    )


def op_line(oid, name, ret, params, visibility="public", static=False):
    s = ('      <ownedOperation xmi:type="uml:Operation" xmi:id=%s name=%s '
         'visibility=%s isStatic=%s>\n'
         % (quoteattr(oid), quoteattr(name), quoteattr(visibility),
            quoteattr("true" if static else "false")))
    if ret:
        s += ('        <ownedParameter xmi:type="uml:Parameter" xmi:id=%s '
              'name="return" type=%s direction="return"/>\n'
              % (quoteattr(oid + "_ret"), quoteattr(ret)))
    for i, (pn, pt) in enumerate(params or []):
        s += ('        <ownedParameter xmi:type="uml:Parameter" xmi:id=%s '
              'name=%s type=%s/>\n'
              % (quoteattr("%s_p%d" % (oid, i)), quoteattr(pn), quoteattr(pt)))
    s += "      </ownedOperation>\n"
    return s


def class_block(cid, name, attributes=None, operations=None, abstract=False, stereotype=None):
    s = '    <packagedElement xmi:type="uml:Class" xmi:id=%s name=%s isAbstract=%s' % (
        quoteattr(cid), quoteattr(name), quoteattr("true" if abstract else "false"))
    if stereotype:
        s += ">"
        s += "\n"
    else:
        s += ">\n"
    for i, a in enumerate(attributes or []):
        s += attr_line("%s_a%d" % (cid, i), a[0], a[1],
                       a[2] if len(a) > 2 else "private",
                       a[3] if len(a) > 3 else False)
    for i, o in enumerate(operations or []):
        s += op_line("%s_o%d" % (cid, i), o[0], o[1],
                     o[2] if len(o) > 2 else [], o[3] if len(o) > 3 else "public",
                     o[4] if len(o) > 4 else False)
    s += "    </packagedElement>\n"
    return s


def interface_block(iid, name, operations=None):
    s = '    <packagedElement xmi:type="uml:Interface" xmi:id=%s name=%s>\n' % (
        quoteattr(iid), quoteattr(name))
    for i, o in enumerate(operations or []):
        s += op_line("%s_o%d" % (iid, i), o[0], o[1], o[2] if len(o) > 2 else [])
    s += "    </packagedElement>\n"
    return s


def enum_block(eid, name, literals):
    s = '    <packagedElement xmi:type="uml:Enumeration" xmi:id=%s name=%s>\n' % (
        quoteattr(eid), quoteattr(name))
    for i, lit in enumerate(literals):
        s += ('      <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id=%s name=%s/>\n'
              % (quoteattr("%s_l%d" % (eid, i)), quoteattr(lit)))
    s += "    </packagedElement>\n"
    return s


def component_block(cid, name):
    return ('    <packagedElement xmi:type="uml:Component" xmi:id=%s name=%s/>\n'
            % (quoteattr(cid), quoteattr(name)))


def generalization(child, parent):
    return ('    <packagedElement xmi:type="uml:Class" xmi:id=%s name=%s>\n'
            '      <generalization xmi:type="uml:Generalization" xmi:id=%s general=%s/>\n'
            '    </packagedElement>\n'
            % (quoteattr(child + "_g"), quoteattr(child),
               quoteattr(child + "_gen"), quoteattr(parent)))


def realization(impl, iface):
    return ('    <packagedElement xmi:type="uml:InterfaceRealization" xmi:id=%s '
            'name=%s client=%s supplier=%s/>\n'
            % (quoteattr(impl + "_ir_" + iface), quoteattr(iface),
               quoteattr(impl), quoteattr(iface)))


def dependency(client, supplier, name=""):
    return ('    <packagedElement xmi:type="uml:Dependency" xmi:id=%s name=%s '
            'client=%s supplier=%s/>\n'
            % (quoteattr(client + "_dep_" + supplier), quoteattr(name),
               quoteattr(client), quoteattr(supplier)))


def association(aid, name, ends):
    """ends: list of dicts {type, role, lower, upper, agg, navigable}"""
    s = ('    <packagedElement xmi:type="uml:Association" xmi:id=%s name=%s>\n'
         % (quoteattr(aid), quoteattr(name)))
    for i, e in enumerate(ends):
        s += '      <memberEnd xmi:idref=%s/>\n' % quoteattr("%s_e%d" % (aid, i))
    for i, e in enumerate(ends):
        extra = ""
        if e.get("agg"):
            extra += " aggregation=%s" % quoteattr(e["agg"])
        s += ('      <ownedEnd xmi:type="uml:Property" xmi:id=%s name=%s type=%s '
              'association=%s%s>\n'
              % (quoteattr("%s_e%d" % (aid, i)), quoteattr(e.get("role", "")),
                 quoteattr(e["type"]), quoteattr(aid), extra))
        s += ('        <lowerValue xmi:type="uml:LiteralInteger" xmi:id=%s value=%s/>\n'
              % (quoteattr("%s_e%d_l" % (aid, i)), quoteattr(str(e.get("lower", 1)))))
        upper = e.get("upper", 1)
        utype = ("uml:LiteralUnlimitedNatural" if str(upper) == "*" else "uml:LiteralInteger")
        s += ('        <upperValue xmi:type="%s" xmi:id=%s value=%s/>\n'
              % (utype, quoteattr("%s_e%d_u" % (aid, i)), quoteattr(str(upper))))
        s += "      </ownedEnd>\n"
    s += "    </packagedElement>\n"
    return s


def package_block(pid, name, body):
    return ('  <packagedElement xmi:type="uml:Package" xmi:id=%s name=%s>\n%s  </packagedElement>\n'
            % (quoteattr(pid), quoteattr(name), body))


def write(name, body):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(header(name.replace(".xmi", "")) + body + FOOTER)
    print("escrito:", path)


# =====================================================================
# 1) MODELO DE DOMINIO (conceptual: sin visibilidad, tipos basicos)
# =====================================================================
def modelo_dominio():
    A = lambda n, t: (n, t, "public")
    menu = ""
    menu += class_block("Categoria", "Categoria", [A("nombre", "Texto"), A("descripcion", "Texto"), A("ordenVisualizacion", "Entero"), A("activa", "Booleano")])
    menu += class_block("Producto", "Producto", [A("codigo", "Texto"), A("nombre", "Texto"), A("descripcion", "Texto"), A("precioBase", "Moneda"), A("imagen", "Texto"), A("tiempoPreparacionEstimado", "Entero"), A("disponible", "Booleano")])
    menu += class_block("VarianteProducto", "VarianteProducto", [A("nombre", "Texto"), A("descripcion", "Texto"), A("ajustePrecio", "Moneda"), A("ordenVisualizacion", "Entero"), A("activa", "Booleano")])
    menu += class_block("Ingrediente", "Ingrediente", [A("codigo", "Texto"), A("nombre", "Texto"), A("unidadMedida", "Texto"), A("stockActual", "Decimal"), A("stockMinimo", "Decimal"), A("costoUnitario", "Moneda")])
    menu += class_block("RecetaProducto", "RecetaProducto", [A("cantidadRequerida", "Decimal"), A("esOpcional", "Booleano"), A("cargoExtra", "Moneda")])
    menu += class_block("ComplementoProducto", "ComplementoProducto", [A("obligatorio", "Booleano"), A("ordenVisualizacion", "Entero")])

    ped = ""
    ped += class_block("Carrito", "Carrito", [A("fechaHoraApertura", "FechaHora"), A("estado", "Texto")])
    ped += class_block("Pedido", "Pedido", [A("codigo", "Texto"), A("fechaHoraCreacion", "FechaHora"), A("tipo", "Texto"), A("estado", "Texto"), A("subtotal", "Moneda"), A("total", "Moneda"), A("observaciones", "Texto"), A("motivoCancelacion", "Texto")])
    ped += class_block("LineaPedido", "LineaPedido", [A("cantidad", "Entero"), A("precioUnitario", "Moneda"), A("subtotalLinea", "Moneda"), A("notasPersonalizacion", "Texto")])
    ped += class_block("PersonalizacionIngrediente", "PersonalizacionIngrediente", [A("accion", "Texto"), A("cantidadExtra", "Decimal"), A("cargoExtra", "Moneda")])
    ped += class_block("ComplementoSeleccionado", "ComplementoSeleccionado", [A("cantidad", "Entero"), A("precioUnitario", "Moneda")])
    ped += class_block("Pago", "Pago", [A("monto", "Moneda"), A("medio", "Texto"), A("fechaHora", "FechaHora"), A("estado", "Texto")])

    op = ""
    op += class_block("Mesa", "Mesa", [A("numero", "Texto"), A("capacidad", "Entero"), A("ubicacion", "Texto"), A("estado", "Texto"), A("activa", "Booleano")])
    op += class_block("EstacionCocina", "EstacionCocina", [A("nombre", "Texto"), A("descripcion", "Texto"), A("ordenVisualizacion", "Entero"), A("activa", "Booleano")])
    op += class_block("TareaCocina", "TareaCocina", [A("estado", "Texto"), A("fechaHoraInicio", "FechaHora"), A("fechaHoraFin", "FechaHora"), A("tiempoEstimadoMinutos", "Entero"), A("prioridad", "Entero")])
    op += class_block("TransporteRiel", "TransporteRiel", [A("estado", "Texto"), A("fechaHoraDespacho", "FechaHora"), A("fechaHoraEntrega", "FechaHora"), A("descripcionFalla", "Texto")])
    op += class_block("MovimientoInventario", "MovimientoInventario", [A("tipo", "Texto"), A("cantidad", "Decimal"), A("fechaHora", "FechaHora"), A("motivo", "Texto")])
    op += class_block("Alerta", "Alerta", [A("tipo", "Texto"), A("descripcion", "Texto"), A("fechaHoraGeneracion", "FechaHora"), A("atendida", "Booleano")])

    body = package_block("pkg_menu", "Menu", menu)
    body += package_block("pkg_pedido", "Pedido", ped)
    body += package_block("pkg_operacion", "Operacion", op)

    E = lambda t, role, lo, hi, agg=None: {"type": t, "role": role, "lower": lo, "upper": hi, "agg": agg}
    body += association("a_cat_prod", "agrupa", [E("Categoria", "categoria", 1, 1), E("Producto", "productos", 0, "*", "shared")])
    body += association("a_prod_var", "ofrece", [E("Producto", "producto", 1, 1), E("VarianteProducto", "variantes", 0, "*", "composite")])
    body += association("a_prod_rec", "define", [E("Producto", "producto", 1, 1), E("RecetaProducto", "receta", 0, "*", "composite")])
    body += association("a_rec_ing", "usa", [E("RecetaProducto", "receta", "*", "*"), E("Ingrediente", "ingrediente", 1, 1)])
    body += association("a_prod_comp", "ofrece", [E("Producto", "productoPrincipal", 1, 1), E("ComplementoProducto", "complementos", 0, "*")])
    body += association("a_comp_prod", "complementa", [E("ComplementoProducto", "complemento", "*", "*"), E("Producto", "productoComplemento", 1, 1)])
    body += association("a_prod_est", "se prepara en", [E("Producto", "producto", "*", "*"), E("EstacionCocina", "estacion", 1, 1)])
    body += association("a_car_lin", "reune", [E("Carrito", "carrito", 1, 1), E("LineaPedido", "lineas", 0, "*", "composite")])
    body += association("a_car_ped", "se confirma como", [E("Carrito", "carrito", 0, 1), E("Pedido", "pedido", 0, 1)])
    body += association("a_ped_lin", "contiene", [E("Pedido", "pedido", 1, 1), E("LineaPedido", "lineas", 1, "*", "composite")])
    body += association("a_lin_prod", "refiere a", [E("LineaPedido", "linea", "*", "*"), E("Producto", "producto", 1, 1)])
    body += association("a_lin_var", "usa", [E("LineaPedido", "linea", "*", "*"), E("VarianteProducto", "variante", 0, 1)])
    body += association("a_lin_pers", "personaliza", [E("LineaPedido", "linea", 1, 1), E("PersonalizacionIngrediente", "personalizaciones", 0, "*", "composite")])
    body += association("a_pers_ing", "refiere a", [E("PersonalizacionIngrediente", "personalizacion", "*", "*"), E("Ingrediente", "ingrediente", 1, 1)])
    body += association("a_lin_csel", "incluye", [E("LineaPedido", "linea", 1, 1), E("ComplementoSeleccionado", "complementos", 0, "*", "composite")])
    body += association("a_csel_prod", "refiere a", [E("ComplementoSeleccionado", "seleccion", "*", "*"), E("Producto", "producto", 1, 1)])
    body += association("a_pago_ped", "corresponde a", [E("Pago", "pago", 1, 1), E("Pedido", "pedido", 1, 1)])
    body += association("a_ped_mesa", "se atiende en", [E("Pedido", "pedido", 0, "*"), E("Mesa", "mesa", 0, 1)])
    body += association("a_ped_tar", "genera", [E("Pedido", "pedido", 1, 1), E("TareaCocina", "tareas", 0, "*", "composite")])
    body += association("a_tar_est", "se realiza en", [E("TareaCocina", "tarea", "*", "*"), E("EstacionCocina", "estacion", 1, 1)])
    body += association("a_tar_lin", "prepara", [E("TareaCocina", "tarea", "*", "*"), E("LineaPedido", "linea", 1, 1)])
    body += association("a_ped_tr", "se transporta mediante", [E("Pedido", "pedido", 0, 1), E("TransporteRiel", "transporte", 0, 1, "composite")])
    body += association("a_tr_mesa", "se dirige a", [E("TransporteRiel", "transporte", "*", "*"), E("Mesa", "mesaDestino", 1, 1)])
    body += association("a_ing_mov", "registra", [E("Ingrediente", "ingrediente", 1, 1), E("MovimientoInventario", "movimientos", 0, "*")])
    body += association("a_mov_ped", "se origina por", [E("MovimientoInventario", "movimiento", "*", "*"), E("Pedido", "pedido", 0, 1)])
    body += association("a_ale_ped", "se refiere a", [E("Alerta", "alerta", 0, "*"), E("Pedido", "pedido", 0, 1)])
    body += association("a_ale_ing", "se refiere a", [E("Alerta", "alerta", 0, "*"), E("Ingrediente", "ingrediente", 0, 1)])
    body += association("a_ale_tr", "se refiere a", [E("Alerta", "alerta", 0, "*"), E("TransporteRiel", "transporte", 0, 1)])
    write("modelo-dominio.xmi", body)


# =====================================================================
# 2) DIAGRAMA DE CLASES - DOMINIO (software)
# =====================================================================
def diagrama_clases_dominio():
    b = ""
    b += class_block("Alerta", "Alerta", [("id", "UUID"), ("descripcion", "String"), ("fechaHoraGeneracion", "LocalDateTime"), ("atendida", "boolean")], [("atender", "void"), ("estaAtendida", "boolean")], abstract=True)
    b += generalization("AlertaRetraso", "Alerta")
    b += generalization("AlertaStockBajo", "Alerta")
    b += generalization("AlertaFallaTransporte", "Alerta")
    b += class_block("Categoria", "Categoria", [("id", "UUID"), ("nombre", "String"), ("ordenVisualizacion", "int"), ("activa", "boolean")], [("activar", "void"), ("desactivar", "void")])
    b += class_block("Producto", "Producto", [("id", "UUID"), ("codigo", "String"), ("nombre", "String"), ("descripcion", "String"), ("precioBase", "BigDecimal"), ("imagen", "String"), ("tiempoPreparacionMinutos", "int"), ("disponible", "boolean")], [("calcularPrecio", "BigDecimal", [("ajusteVariante", "BigDecimal"), ("extras", "BigDecimal")]), ("marcarAgotado", "void"), ("estaDisponible", "boolean")])
    b += class_block("VarianteProducto", "VarianteProducto", [("id", "UUID"), ("nombre", "String"), ("ajustePrecio", "BigDecimal"), ("orden", "int"), ("activa", "boolean")])
    b += class_block("Ingrediente", "Ingrediente", [("id", "UUID"), ("codigo", "String"), ("nombre", "String"), ("unidadMedida", "String"), ("stockActual", "BigDecimal"), ("stockMinimo", "BigDecimal"), ("costoUnitario", "BigDecimal")], [("tieneStock", "boolean", [("cantidad", "BigDecimal")]), ("aplicarMovimiento", "void", [("movimiento", "MovimientoInventario")]), ("requiereReposicion", "boolean")])
    b += class_block("RecetaProducto", "RecetaProducto", [("cantidadRequerida", "BigDecimal"), ("esOpcional", "boolean"), ("cargoExtra", "BigDecimal")])
    b += class_block("ComplementoProducto", "ComplementoProducto", [("obligatorio", "boolean"), ("orden", "int")])
    b += class_block("Carrito", "Carrito", [("id", "UUID"), ("fechaHoraApertura", "LocalDateTime"), ("estado", "EstadoCarrito")], [("agregarProducto", "void", [("producto", "Producto"), ("cantidad", "int")]), ("quitarProducto", "void", [("lineaId", "UUID")]), ("calcularTotal", "BigDecimal"), ("confirmar", "Pedido")])
    b += class_block("Pedido", "Pedido", [("id", "UUID"), ("codigo", "String"), ("fechaHoraCreacion", "LocalDateTime"), ("tipo", "TipoPedido"), ("estado", "EstadoPedido"), ("observaciones", "String"), ("motivoCancelacion", "String")], [("generarCodigo", "String", [("fecha", "LocalDate")], "public", True), ("agregarLinea", "void", [("linea", "LineaPedido")]), ("confirmar", "void"), ("cancelar", "void", [("motivo", "String")]), ("calcularTotal", "BigDecimal"), ("cambiarEstado", "void", [("nuevo", "EstadoPedido")])])
    b += class_block("LineaPedido", "LineaPedido", [("id", "UUID"), ("cantidad", "int"), ("precioUnitario", "BigDecimal"), ("notasPersonalizacion", "String")], [("calcularSubtotal", "BigDecimal")])
    b += class_block("PersonalizacionIngrediente", "PersonalizacionIngrediente", [("accion", "AccionPersonalizacion"), ("cantidadExtra", "BigDecimal"), ("cargoExtra", "BigDecimal")])
    b += class_block("ComplementoSeleccionado", "ComplementoSeleccionado", [("cantidad", "int"), ("precioUnitario", "BigDecimal")])
    b += class_block("Pago", "Pago", [("id", "UUID"), ("monto", "BigDecimal"), ("medio", "MedioPago"), ("fechaHora", "LocalDateTime"), ("estado", "EstadoPago")], [("aprobar", "void"), ("rechazar", "void")])
    b += class_block("Mesa", "Mesa", [("id", "UUID"), ("numero", "String"), ("capacidad", "int"), ("ubicacion", "String"), ("estado", "EstadoMesa")], [("ocupar", "void"), ("liberar", "void"), ("estaLibre", "boolean")])
    b += class_block("EstacionCocina", "EstacionCocina", [("id", "UUID"), ("nombre", "String"), ("activa", "boolean")], [("activar", "void"), ("desactivar", "void")])
    b += class_block("TareaCocina", "TareaCocina", [("id", "UUID"), ("estado", "EstadoTareaCocina"), ("fechaHoraInicio", "LocalDateTime"), ("fechaHoraFin", "LocalDateTime"), ("tiempoEstimadoMinutos", "int"), ("prioridad", "int")], [("iniciar", "void"), ("completar", "void"), ("estaRetrasada", "boolean", [("ahora", "LocalDateTime")])])
    b += class_block("TransporteRiel", "TransporteRiel", [("id", "UUID"), ("estado", "EstadoTransporte"), ("fechaHoraDespacho", "LocalDateTime"), ("fechaHoraEntrega", "LocalDateTime"), ("descripcionFalla", "String")], [("despachar", "void"), ("entregar", "void"), ("reportarFalla", "void", [("descripcion", "String")])])
    b += class_block("MovimientoInventario", "MovimientoInventario", [("id", "UUID"), ("tipo", "TipoMovimiento"), ("cantidad", "BigDecimal"), ("fechaHora", "LocalDateTime"), ("motivo", "String")])
    b += enum_block("EstadoCarrito", "EstadoCarrito", ["Abierto", "Confirmado", "Abandonado"])
    b += enum_block("TipoPedido", "TipoPedido", ["EnRestaurante", "ParaLlevar"])
    b += enum_block("EstadoPedido", "EstadoPedido", ["Pendiente", "Confirmado", "EnPreparacion", "ListoParaEntregar", "EnTransporte", "Entregado", "Cancelado", "Pagado"])
    b += enum_block("EstadoMesa", "EstadoMesa", ["Libre", "Ocupada", "Reservada", "EnLimpieza"])
    b += enum_block("EstadoTareaCocina", "EstadoTareaCocina", ["Pendiente", "EnProceso", "Completada", "Cancelada"])
    b += enum_block("EstadoTransporte", "EstadoTransporte", ["PendienteDespacho", "EnTransporte", "EntregadoEnMesa", "Falla"])
    b += enum_block("TipoMovimiento", "TipoMovimiento", ["Entrada", "SalidaPedido", "AjustePositivo", "AjusteNegativo", "Merma"])
    b += enum_block("AccionPersonalizacion", "AccionPersonalizacion", ["Quitado", "AgregadoExtra"])
    b += enum_block("MedioPago", "MedioPago", ["Efectivo", "Tarjeta", "Externo"])
    b += enum_block("EstadoPago", "EstadoPago", ["Pendiente", "Aprobado", "Rechazado"])
    E = lambda t, role, lo, hi, agg=None: {"type": t, "role": role, "lower": lo, "upper": hi, "agg": agg}
    b += association("c_cat_prod", "agrupa", [E("Categoria", "categoria", 1, 1), E("Producto", "productos", 0, "*", "shared")])
    b += association("c_prod_var", "ofrece", [E("Producto", "producto", 1, 1), E("VarianteProducto", "variantes", 0, "*", "composite")])
    b += association("c_prod_rec", "define", [E("Producto", "producto", 1, 1), E("RecetaProducto", "receta", 0, "*", "composite")])
    b += association("c_rec_ing", "usa", [E("RecetaProducto", "receta", "*", "*"), E("Ingrediente", "ingrediente", 1, 1)])
    b += association("c_prod_comp", "ofrece", [E("Producto", "producto", 1, 1), E("ComplementoProducto", "complementos", 0, "*")])
    b += association("c_comp_prod", "complementa", [E("ComplementoProducto", "complemento", "*", "*"), E("Producto", "productoComplemento", 1, 1)])
    b += association("c_prod_est", "se prepara en", [E("Producto", "producto", "*", "*"), E("EstacionCocina", "estacion", 1, 1)])
    b += association("c_car_lin", "reune", [E("Carrito", "carrito", 1, 1), E("LineaPedido", "lineas", 0, "*", "composite")])
    b += association("c_car_ped", "se confirma como", [E("Carrito", "carrito", 0, 1), E("Pedido", "pedido", 0, 1)])
    b += association("c_ped_lin", "contiene", [E("Pedido", "pedido", 1, 1), E("LineaPedido", "lineas", 1, "*", "composite")])
    b += association("c_lin_prod", "refiere a", [E("LineaPedido", "linea", "*", "*"), E("Producto", "producto", 1, 1)])
    b += association("c_lin_var", "usa", [E("LineaPedido", "linea", "*", "*"), E("VarianteProducto", "variante", 0, 1)])
    b += association("c_lin_pers", "personaliza", [E("LineaPedido", "linea", 1, 1), E("PersonalizacionIngrediente", "personalizaciones", 0, "*", "composite")])
    b += association("c_pers_ing", "refiere a", [E("PersonalizacionIngrediente", "personalizacion", "*", "*"), E("Ingrediente", "ingrediente", 1, 1)])
    b += association("c_lin_csel", "incluye", [E("LineaPedido", "linea", 1, 1), E("ComplementoSeleccionado", "complementos", 0, "*", "composite")])
    b += association("c_csel_prod", "refiere a", [E("ComplementoSeleccionado", "seleccion", "*", "*"), E("Producto", "producto", 1, 1)])
    b += association("c_pago_ped", "corresponde a", [E("Pago", "pago", 1, 1), E("Pedido", "pedido", 1, 1)])
    b += association("c_ped_mesa", "se atiende en", [E("Pedido", "pedido", 0, "*"), E("Mesa", "mesa", 0, 1)])
    b += association("c_ped_tar", "genera", [E("Pedido", "pedido", 1, 1), E("TareaCocina", "tareas", 0, "*", "composite")])
    b += association("c_tar_est", "se realiza en", [E("TareaCocina", "tarea", "*", "*"), E("EstacionCocina", "estacion", 1, 1)])
    b += association("c_tar_lin", "prepara", [E("TareaCocina", "tarea", "*", "*"), E("LineaPedido", "linea", 1, 1)])
    b += association("c_ped_tr", "se transporta mediante", [E("Pedido", "pedido", 0, 1), E("TransporteRiel", "transporte", 0, 1, "composite")])
    b += association("c_tr_mesa", "se dirige a", [E("TransporteRiel", "transporte", "*", "*"), E("Mesa", "mesaDestino", 1, 1)])
    b += association("c_ing_mov", "registra", [E("Ingrediente", "ingrediente", 1, 1), E("MovimientoInventario", "movimientos", 0, "*")])
    b += association("c_mov_ped", "se origina por", [E("MovimientoInventario", "movimiento", "*", "*"), E("Pedido", "pedido", 0, 1)])
    write("diagrama-clases-dominio.xmi", b)


# =====================================================================
# 3) DIAGRAMA DE CLASES - ARQUITECTURA (aplicacion/infra/interfaz)
# =====================================================================
def diagrama_clases_arquitectura():
    app = ""
    app += interface_block("RepositorioPedidos", "RepositorioPedidos", [("guardar", "void", [("pedido", "Pedido")]), ("buscarPorId", "Pedido", [("id", "UUID")]), ("listarPorEstado", "Pedido", [("estado", "EstadoPedido")])])
    app += interface_block("RepositorioProductos", "RepositorioProductos", [("guardar", "void", [("producto", "Producto")]), ("buscarPorId", "Producto", [("id", "UUID")]), ("listarDisponibles", "Producto")])
    app += interface_block("RepositorioIngredientes", "RepositorioIngredientes", [("guardar", "void", [("ingrediente", "Ingrediente")]), ("buscarPorId", "Ingrediente", [("id", "UUID")]), ("listarBajoMinimo", "Ingrediente")])
    app += interface_block("RepositorioMesas", "RepositorioMesas", [("guardar", "void", [("mesa", "Mesa")]), ("buscarPorNumero", "Mesa", [("numero", "String")]), ("listarLibres", "Mesa")])
    app += interface_block("RepositorioTareas", "RepositorioTareas", [("guardar", "void", [("tarea", "TareaCocina")]), ("listarPorEstacion", "TareaCocina", [("idEstacion", "UUID")])])
    app += interface_block("PuertoTransporteRiel", "PuertoTransporteRiel", [("despachar", "void", [("transporte", "TransporteRiel")]), ("consultarEstado", "EstadoTransporte", [("idTransporte", "UUID")])])
    app += interface_block("EstrategiaPago", "EstrategiaPago", [("procesar", "boolean", [("monto", "BigDecimal")])])
    app += interface_block("ObservadorPedido", "ObservadorPedido", [("actualizar", "void", [("pedido", "Pedido"), ("evento", "String")])])
    app += interface_block("Notificador", "Notificador", [("enviar", "void", [("destino", "String"), ("mensaje", "String")])])
    app += class_block("ServicioPedidos", "ServicioPedidos", [], [("crearDesdeCarrito", "Pedido", [("carrito", "Carrito")]), ("confirmarPedido", "void", [("idPedido", "UUID")]), ("cancelarPedido", "void", [("idPedido", "UUID"), ("motivo", "String")]), ("registrarPago", "boolean", [("idPedido", "UUID"), ("estrategia", "EstrategiaPago")])])
    app += class_block("ServicioMenu", "ServicioMenu", [], [("listarMenu", "Producto"), ("buscarProducto", "Producto", [("id", "UUID")])])
    app += class_block("ServicioCocina", "ServicioCocina", [], [("enviarAEstaciones", "void", [("pedido", "Pedido")]), ("iniciarTarea", "void", [("idTarea", "UUID")]), ("completarTarea", "void", [("idTarea", "UUID")])])
    app += class_block("ServicioRiel", "ServicioRiel", [], [("despacharPedido", "void", [("idPedido", "UUID")]), ("reportarFalla", "void", [("idTransporte", "UUID"), ("descripcion", "String")])])
    app += class_block("ServicioInventario", "ServicioInventario", [], [("descontarPorPedido", "void", [("pedido", "Pedido")]), ("registrarMovimiento", "void", [("movimiento", "MovimientoInventario")]), ("ingredientesBajoMinimo", "Ingrediente")])
    app += class_block("ServicioMesas", "ServicioMesas", [], [("ocuparMesa", "void", [("numero", "String")]), ("liberarMesa", "void", [("numero", "String")])])
    app += class_block("ServicioReportes", "ServicioReportes", [], [("ventasPorProducto", "Map"), ("rendimientoPorEstacion", "Map")])
    app += class_block("ServicioAlertas", "ServicioAlertas", [], [("actualizar", "void", [("pedido", "Pedido"), ("evento", "String")])])

    infra = ""
    infra += class_block("RepositorioPedidosEnMemoria", "RepositorioPedidosEnMemoria")
    infra += class_block("RepositorioProductosEnMemoria", "RepositorioProductosEnMemoria")
    infra += class_block("RepositorioIngredientesEnMemoria", "RepositorioIngredientesEnMemoria")
    infra += class_block("RepositorioMesasEnMemoria", "RepositorioMesasEnMemoria")
    infra += class_block("RepositorioTareasEnMemoria", "RepositorioTareasEnMemoria")
    infra += class_block("AdaptadorRiel", "AdaptadorRiel")
    infra += class_block("PagoEfectivo", "PagoEfectivo")
    infra += class_block("PagoTarjeta", "PagoTarjeta")
    infra += class_block("NotificadorCorreo", "NotificadorCorreo")

    ui = ""
    ui += class_block("PantallaKiosco", "PantallaKiosco", [], [("iniciarPedido", "Carrito"), ("agregarAlCarrito", "void", [("idProducto", "UUID"), ("cantidad", "int")]), ("confirmarPedido", "Pedido")])
    ui += class_block("PantallaCocina", "PantallaCocina", [], [("verTareas", "TareaCocina", [("idEstacion", "UUID")]), ("completarTarea", "void", [("idTarea", "UUID")])])
    ui += class_block("PantallaMesero", "PantallaMesero", [], [("verEstadoMesa", "EstadoMesa", [("numero", "String")])])
    ui += class_block("PanelAdministracion", "PanelAdministracion", [], [("gestionarProducto", "void", [("producto", "Producto")]), ("verReporte", "Map", [("nombre", "String")])])

    b = package_block("pkg_app", "aplicacion", app)
    b += package_block("pkg_infra", "infraestructura", infra)
    b += package_block("pkg_ui", "interfaz", ui)

    for impl, iface in [("RepositorioPedidosEnMemoria", "RepositorioPedidos"),
                        ("RepositorioProductosEnMemoria", "RepositorioProductos"),
                        ("RepositorioIngredientesEnMemoria", "RepositorioIngredientes"),
                        ("RepositorioMesasEnMemoria", "RepositorioMesas"),
                        ("RepositorioTareasEnMemoria", "RepositorioTareas"),
                        ("AdaptadorRiel", "PuertoTransporteRiel"),
                        ("PagoEfectivo", "EstrategiaPago"),
                        ("PagoTarjeta", "EstrategiaPago"),
                        ("NotificadorCorreo", "Notificador"),
                        ("ServicioAlertas", "ObservadorPedido")]:
        b += realization(impl, iface)

    for c, s in [("ServicioPedidos", "RepositorioPedidos"), ("ServicioPedidos", "RepositorioMesas"),
                 ("ServicioPedidos", "EstrategiaPago"), ("ServicioMenu", "RepositorioProductos"),
                 ("ServicioCocina", "RepositorioTareas"), ("ServicioRiel", "PuertoTransporteRiel"),
                 ("ServicioInventario", "RepositorioIngredientes"), ("ServicioMesas", "RepositorioMesas"),
                 ("ServicioAlertas", "Notificador"), ("PantallaKiosco", "ServicioMenu"),
                 ("PantallaKiosco", "ServicioPedidos"), ("PantallaCocina", "ServicioCocina"),
                 ("PantallaMesero", "ServicioMesas"), ("PanelAdministracion", "ServicioReportes"),
                 ("PanelAdministracion", "ServicioMenu")]:
        b += dependency(c, s)
    write("diagrama-clases-arquitectura.xmi", b)


# =====================================================================
# 4) VISTA FUNCIONAL - COMPONENTES
# =====================================================================
def vista_funcional_componentes():
    b = ""
    b += component_block("KioscoCliente", "KioscoCliente")
    b += component_block("PantallaCocinaCmp", "PantallaCocina")
    b += component_block("PanelAdministracionCmp", "PanelAdministracion")
    b += component_block("PantallaMeseroCmp", "PantallaMesero")
    b += component_block("GestionMenu", "GestionMenu")
    b += component_block("GestionPedidos", "GestionPedidos")
    b += component_block("MotorCocina", "MotorCocina")
    b += component_block("ControlRiel", "ControlRiel")
    b += component_block("GestionMesas", "GestionMesas")
    b += component_block("GestionInventario", "GestionInventario")
    b += component_block("Notificaciones", "Notificaciones")
    b += component_block("Reportes", "Reportes")
    b += component_block("Administracion", "Administracion")
    b += component_block("PasarelaPago", "PasarelaPago")
    b += component_block("SistemaRielExterno", "SistemaRielExterno")
    for iid, nm in [("IMenu", "IMenu"), ("IPedidos", "IPedidos"), ("ICocina", "ICocina"),
                    ("IRiel", "IRiel"), ("IMesas", "IMesas"), ("IInventario", "IInventario"),
                    ("INotificaciones", "INotificaciones"), ("IReportes", "IReportes"),
                    ("IPago", "IPago"), ("IRielExterno", "IRielExterno")]:
        b += interface_block(iid, nm)
    for c, s in [("KioscoCliente", "IMenu"), ("KioscoCliente", "IPedidos"), ("KioscoCliente", "IPago"),
                 ("GestionPedidos", "IMenu"), ("GestionPedidos", "IInventario"), ("GestionPedidos", "ICocina"),
                 ("GestionPedidos", "IMesas"), ("GestionPedidos", "IPago"), ("MotorCocina", "IPedidos"),
                 ("MotorCocina", "INotificaciones"), ("ControlRiel", "IPedidos"), ("ControlRiel", "IMesas"),
                 ("ControlRiel", "IRielExterno"), ("GestionInventario", "IMenu"), ("GestionInventario", "INotificaciones"),
                 ("Reportes", "IPedidos"), ("Reportes", "ICocina"), ("PantallaCocinaCmp", "ICocina"),
                 ("PantallaMeseroCmp", "IMesas"), ("PanelAdministracionCmp", "IReportes"),
                 ("PanelAdministracionCmp", "IMenu")]:
        b += dependency(c, s)
    for c, s in [("GestionMenu", "IMenu"), ("GestionPedidos", "IPedidos"), ("MotorCocina", "ICocina"),
                 ("ControlRiel", "IRiel"), ("GestionMesas", "IMesas"), ("GestionInventario", "IInventario"),
                 ("Notificaciones", "INotificaciones"), ("Reportes", "IReportes")]:
        b += realization(c, s)
    write("vista-funcional-componentes.xmi", b)


if __name__ == "__main__":
    modelo_dominio()
    diagrama_clases_dominio()
    diagrama_clases_arquitectura()
    vista_funcional_componentes()
