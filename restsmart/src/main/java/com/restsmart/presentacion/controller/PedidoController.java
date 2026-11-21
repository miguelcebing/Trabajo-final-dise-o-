package com.restsmart.presentacion.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.modelo.dominio.Carrito;
import com.restsmart.modelo.dominio.Complemento;
import com.restsmart.modelo.dominio.ItemPedido;
import com.restsmart.modelo.dominio.Mesa;
import com.restsmart.modelo.dominio.OpcionProducto;
import com.restsmart.modelo.dominio.OpcionSeleccionada;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.negocio.service.GestionPedidoService;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

	private final GestionPedidoService gestionPedidoService;

	public PedidoController(GestionPedidoService gestionPedidoService) {
		this.gestionPedidoService = gestionPedidoService;
	}

	@PostMapping("/items")
	public Carrito agregarProducto(@RequestParam Integer productoId, @RequestParam Integer cantidad,
			@RequestBody(required = false) SeleccionOpcionesRequest request) {
		Producto producto = new Producto();
		producto.setId(productoId);
		return gestionPedidoService.agregarProducto(producto, cantidad, aOpciones(request));
	}

	@PutMapping("/items/{itemId}/cantidad")
	public Carrito modificarCantidad(@PathVariable Integer itemId, @RequestParam Integer cantidad) {
		ItemPedido item = new ItemPedido();
		item.setId(itemId);
		return gestionPedidoService.modificarCantidad(item, cantidad);
	}

	@DeleteMapping("/items/{itemId}")
	public Carrito quitarItem(@PathVariable Integer itemId) {
		ItemPedido item = new ItemPedido();
		item.setId(itemId);
		return gestionPedidoService.quitarItem(item);
	}

	@PutMapping("/mesa")
	public Mesa indicarMesa(@RequestParam Integer numeroMesa) {
		Mesa mesa = new Mesa();
		mesa.setNumero(numeroMesa);
		return gestionPedidoService.indicarMesa(mesa);
	}

	@GetMapping("/resumen")
	public Carrito verResumenPedido() {
		return gestionPedidoService.verResumen(null);
	}

	@DeleteMapping("/{pedidoId}")
	public Pedido cancelarPedido(@PathVariable Integer pedidoId) {
		Pedido pedido = new Pedido();
		pedido.setId(pedidoId);
		return gestionPedidoService.cancelarPedido(pedido);
	}

	private List<OpcionSeleccionada> aOpciones(SeleccionOpcionesRequest request) {
		List<OpcionSeleccionada> opciones = new ArrayList<>();
		if (request == null) {
			return opciones;
		}
		if (request.variante() != null) {
			opciones.add(aSeleccionada(request.variante()));
		}
		if (request.complementos() != null) {
			for (Complemento complemento : request.complementos()) {
				opciones.add(aSeleccionada(complemento));
			}
		}
		return opciones;
	}

	private OpcionSeleccionada aSeleccionada(OpcionProducto opcion) {
		OpcionSeleccionada seleccionada = new OpcionSeleccionada();
		seleccionada.setOpcion(opcion);
		seleccionada.setPrecioAplicado(opcion.getPrecioAdicional());
		return seleccionada;
	}
}
