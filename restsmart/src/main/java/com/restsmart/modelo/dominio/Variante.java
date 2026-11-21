package com.restsmart.modelo.dominio;

public class Variante extends OpcionProducto {

	public Variante() {
	}

	@Override
	public boolean esObligatorio() {
		return false;
	}

	public double calcularPrecioAdicional() {
		return getPrecioAdicional();
	}
}
