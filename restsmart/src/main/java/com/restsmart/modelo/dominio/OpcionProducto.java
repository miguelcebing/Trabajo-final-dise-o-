package com.restsmart.modelo.dominio;

public abstract class OpcionProducto {

	private String nombre;

	private double precioAdicional;

	public OpcionProducto() {
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public double getPrecioAdicional() {
		return precioAdicional;
	}

	public void setPrecioAdicional(double precioAdicional) {
		this.precioAdicional = precioAdicional;
	}

	public abstract boolean esObligatorio();
}
