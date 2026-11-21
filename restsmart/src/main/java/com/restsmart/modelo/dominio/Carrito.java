package com.restsmart.modelo.dominio;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Carrito {

	private Integer id;

	private String sesionId;

	private double total;

	private List<ItemPedido> items = new ArrayList<>();

	public Carrito() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSesionId() {
		return sesionId;
	}

	public void setSesionId(String sesionId) {
		this.sesionId = sesionId;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public List<ItemPedido> getItems() {
		return items;
	}

	public void setItems(List<ItemPedido> items) {
		this.items = items;
	}

	public void agregarProducto(Producto producto, int cantidad, List<OpcionSeleccionada> opciones) {
		List<OpcionSeleccionada> seleccion = opciones == null ? List.of() : opciones;
		ItemPedido existente = items.stream()
				.filter(i -> i.tieneMismasOpciones(producto, seleccion))
				.findFirst()
				.orElse(null);
		if (existente != null) {
			existente.acumularCantidad(cantidad);
		} else {
			ItemPedido item = new ItemPedido();
			item.setProducto(producto);
			item.setCantidad(cantidad);
			item.setOpciones(new ArrayList<>(seleccion));
			item.setPrecioUnitario(precioUnitario(producto, seleccion));
			item.calcularSubtotal();
			items.add(item);
		}
		recalcularTotal();
	}

	public void modificarCantidad(ItemPedido item, int cantidad) {
		items.stream()
				.filter(i -> i.getId() != null && item != null && i.getId().equals(item.getId()))
				.findFirst()
				.ifPresent(i -> i.cambiarCantidad(cantidad));
		recalcularTotal();
	}

	public void quitarItem(ItemPedido item) {
		if (item == null || item.getId() == null) {
			return;
		}
		items.removeIf(i -> i.getId() != null && i.getId().equals(item.getId()));
		recalcularTotal();
	}

	public void recalcularTotal() {
		this.total = items.stream()
				.peek(ItemPedido::calcularSubtotal)
				.mapToDouble(ItemPedido::getSubtotal)
				.sum();
	}

	public Pedido confirmarPedido(Mesa mesa) {
		Pedido pedido = new Pedido();
		pedido.setFechaHora(LocalDateTime.now());
		pedido.setMesa(mesa);
		pedido.setItems(new ArrayList<>(items));
		pedido.setConfirmadoEnPantalla(false);
		pedido.setAvisoCerrado(false);
		pedido.calcularTotal();
		return pedido;
	}

	private double precioUnitario(Producto producto, List<OpcionSeleccionada> opciones) {
		double precio = producto.getPrecioBase();
		for (OpcionSeleccionada opcion : opciones) {
			precio += opcion.getPrecioAplicado();
		}
		return precio;
	}
}
