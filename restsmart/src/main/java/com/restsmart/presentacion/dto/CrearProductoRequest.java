package com.restsmart.presentacion.dto;

import com.restsmart.modelo.dominio.enumeracion.SectorCocina;

public record CrearProductoRequest(String nombre, Double precio, Integer categoria, SectorCocina sector) {
}
