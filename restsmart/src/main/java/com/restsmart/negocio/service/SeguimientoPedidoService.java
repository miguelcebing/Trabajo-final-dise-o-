package com.restsmart.negocio.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.restsmart.datos.repository.PedidoRepository;
import com.restsmart.datos.repository.TareaPreparacionRepository;
import com.restsmart.modelo.dominio.enumeracion.EstadoPedido;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.TareaPreparacion;
import com.restsmart.negocio.contrato.iConsultarEstado;

@Service
public class SeguimientoPedidoService implements iConsultarEstado {

	private final PedidoRepository pedidoRepository;

	private final TareaPreparacionRepository tareaPreparacionRepository;

	public SeguimientoPedidoService(PedidoRepository pedidoRepository,
			TareaPreparacionRepository tareaPreparacionRepository) {
		this.pedidoRepository = pedidoRepository;
		this.tareaPreparacionRepository = tareaPreparacionRepository;
	}

	public EstadoPedido consultarEstado(Pedido pedido) {
		if (pedido == null || pedido.getId() == null) {
			throw new IllegalArgumentException("El pedido es obligatorio");
		}
		Pedido encontrado = pedidoRepository.findById(pedido.getId())
				.orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado: " + pedido.getId()));
		return encontrado.consultarEstado();
	}

	public boolean verAvisoPedidoListo(Pedido pedido) {
		if (pedido == null || pedido.getId() == null) {
			throw new IllegalArgumentException("El pedido es obligatorio");
		}
		Pedido encontrado = pedidoRepository.findById(pedido.getId())
				.orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado: " + pedido.getId()));
		return encontrado.debeMostrarAviso();
	}

	public Pedido notificarAvance(TareaPreparacion tarea) {
		if (tarea == null || tarea.getPedido() == null || tarea.getPedido().getId() == null) {
			throw new IllegalArgumentException("La tarea debe pertenecer a un pedido");
		}
		Integer pedidoId = tarea.getPedido().getId();
		Pedido pedido = pedidoRepository.findById(pedidoId)
				.orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado: " + pedidoId));
		pedido.setTareas(new ArrayList<>(tareaPreparacionRepository.findAll().stream()
				.filter(t -> t.getPedido() != null && pedidoId.equals(t.getPedido().getId()))
				.toList()));
		pedido.actualizarEstado();
		return pedidoRepository.save(pedido);
	}
}
