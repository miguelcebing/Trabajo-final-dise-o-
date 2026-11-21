package com.restsmart.modelo.dominio;

public class OpcionSeleccionada {

	private OpcionProducto opcion;

	private double precioAplicado;

	public OpcionSeleccionada() {
	}

	public OpcionProducto getOpcion() {
		return opcion;
	}

	public void setOpcion(OpcionProducto opcion) {
		this.opcion = opcion;
	}

	public double getPrecioAplicado() {
		return precioAplicado;
	}

	public void setPrecioAplicado(double precioAplicado) {
		this.precioAplicado = precioAplicado;
	}

	public String obtenerDescripcion() {
		return opcion == null || opcion.getNombre() == null ? "" : opcion.getNombre();
	}
}
