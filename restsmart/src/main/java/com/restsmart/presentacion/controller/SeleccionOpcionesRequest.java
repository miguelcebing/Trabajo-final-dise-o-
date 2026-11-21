package com.restsmart.presentacion.controller;

import java.util.List;

import com.restsmart.modelo.dominio.Complemento;
import com.restsmart.modelo.dominio.Variante;

public record SeleccionOpcionesRequest(Variante variante, List<Complemento> complementos) {
}
