package com.restsmart.modelo.dominio;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class ItemPedido {

	@Id
	private Integer id;

	private Integer cantidad;

	private double precioUnitario;

	private double subtotal;

	@DBRef
	private Producto producto;

	private List<OpcionSeleccionada> opciones = new ArrayList<>();

	private String observaciones;

	public ItemPedido() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public double getPrecioUnitario() {
		return precioUnitario;
	}

	public void setPrecioUnitario(double precioUnitario) {
		this.precioUnitario = precioUnitario;
	}

	public double getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(double subtotal) {
		this.subtotal = subtotal;
	}

	public Producto getProducto() {
		return producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	public List<OpcionSeleccionada> getOpciones() {
		return opciones;
	}

	public void setOpciones(List<OpcionSeleccionada> opciones) {
		this.opciones = opciones;
	}

	public String getObservaciones() {
		return observaciones;
	}

	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}

	public boolean tieneMismasOpciones(Producto otroProducto, List<OpcionSeleccionada> otrasOpciones) {
		if (producto == null || otroProducto == null || producto.getId() == null) {
			return false;
		}
		if (!producto.getId().equals(otroProducto.getId())) {
			return false;
		}
		List<String> actuales = opciones.stream().map(OpcionSeleccionada::obtenerDescripcion).sorted().toList();
		List<String> nuevas = otrasOpciones == null ? List.of()
				: otrasOpciones.stream().map(OpcionSeleccionada::obtenerDescripcion).sorted().toList();
		return actuales.equals(nuevas);
	}

	public void acumularCantidad(int cantidadAdicional) {
		this.cantidad = (this.cantidad == null ? 0 : this.cantidad) + cantidadAdicional;
		calcularSubtotal();
	}

	public void cambiarCantidad(int nuevaCantidad) {
		this.cantidad = nuevaCantidad;
		calcularSubtotal();
	}

	public double calcularSubtotal() {
		this.subtotal = this.precioUnitario * (this.cantidad == null ? 0 : this.cantidad);
		return this.subtotal;
	}

	public String obtenerIndicaciones() {
		StringBuilder indicaciones = new StringBuilder();
		for (OpcionSeleccionada opcion : opciones) {
			if (!indicaciones.isEmpty()) {
				indicaciones.append(", ");
			}
			indicaciones.append(opcion.obtenerDescripcion());
		}
		if (observaciones != null && !observaciones.isBlank()) {
			if (!indicaciones.isEmpty()) {
				indicaciones.append(" - ");
			}
			indicaciones.append(observaciones);
		}
		return indicaciones.toString();
	}
}
