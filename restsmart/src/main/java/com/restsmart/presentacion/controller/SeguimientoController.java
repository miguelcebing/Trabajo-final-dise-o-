package com.restsmart.presentacion.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.modelo.dominio.EstadoPedido;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.negocio.service.SeguimientoPedidoService;

@RestController
@RequestMapping("/seguimiento")
public class SeguimientoController {

	private final SeguimientoPedidoService seguimientoPedidoService;

	public SeguimientoController(SeguimientoPedidoService seguimientoPedidoService) {
		this.seguimientoPedidoService = seguimientoPedidoService;
	}

	@GetMapping("/{pedidoId}/estado")
	public EstadoPedido consultarEstado(@PathVariable Integer pedidoId) {
		Pedido pedido = new Pedido();
		pedido.setId(pedidoId);
		return seguimientoPedidoService.consultarEstado(pedido);
	}

	@GetMapping("/{pedidoId}/aviso")
	public boolean verAvisoPedidoListo(@PathVariable Integer pedidoId) {
		Pedido pedido = new Pedido();
		pedido.setId(pedidoId);
		return seguimientoPedidoService.verAvisoPedidoListo(pedido);
	}
}
