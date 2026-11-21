package com.restsmart.negocio.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.restsmart.datos.secuencia.GeneradorSecuencia;
import com.restsmart.datos.repository.PedidoRepository;
import com.restsmart.datos.repository.TareaPreparacionRepository;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.enumeracion.SectorCocina;
import com.restsmart.modelo.dominio.SesionCocina;
import com.restsmart.modelo.dominio.TareaPreparacion;
import com.restsmart.negocio.contrato.iNotificarAvanceCocina;

@Service
public class GestionCocinaService implements iNotificarAvanceCocina {

	private final TareaPreparacionRepository tareaPreparacionRepository;

	private final PedidoRepository pedidoRepository;

	private final GeneradorSecuencia generadorSecuencia;

	private final SeguimientoPedidoService seguimientoPedidoService;

	public GestionCocinaService(TareaPreparacionRepository tareaPreparacionRepository,
			PedidoRepository pedidoRepository, GeneradorSecuencia generadorSecuencia,
			SeguimientoPedidoService seguimientoPedidoService) {
		this.tareaPreparacionRepository = tareaPreparacionRepository;
		this.pedidoRepository = pedidoRepository;
		this.generadorSecuencia = generadorSecuencia;
		this.seguimientoPedidoService = seguimientoPedidoService;
	}

	public List<TareaPreparacion> verTareasSector(SectorCocina sector) {
		return sesionDe(sector).obtenerTareasDelSector(sector).stream()
				.filter(t -> !t.estaCompletada())
				.toList();
	}

	public TareaPreparacion verDetalleTarea(TareaPreparacion tarea) {
		if (tarea == null || tarea.getId() == null) {
			throw new IllegalArgumentException("La tarea es obligatoria");
		}
		return tareaPreparacionRepository.findById(tarea.getId())
				.orElseThrow(() -> new IllegalArgumentException("Tarea no encontrada: " + tarea.getId()));
	}

	public TareaPreparacion marcarTareaCompletada(TareaPreparacion tarea) {
		TareaPreparacion encontrada = verDetalleTarea(tarea);
		encontrada.marcarCompletada();
		TareaPreparacion guardada = tareaPreparacionRepository.save(encontrada);
		seguimientoPedidoService.notificarAvance(guardada);
		return guardada;
	}

	public List<TareaPreparacion> verHistorialTurno(SectorCocina sector) {
		return sesionDe(sector).obtenerHistorialTurno().stream()
				.filter(TareaPreparacion::estaCompletada)
				.toList();
	}

	public List<TareaPreparacion> enrutarPedido(Pedido pedido) {
		if (pedido == null || pedido.getId() == null) {
			throw new IllegalArgumentException("El pedido es obligatorio");
		}
		Pedido encontrado = pedidoRepository.findById(pedido.getId())
				.orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado: " + pedido.getId()));
		List<TareaPreparacion> generadas = encontrado.enviarACocina();
		for (TareaPreparacion tarea : generadas) {
			tarea.setId(generadorSecuencia.siguiente("tareaPreparacion"));
			tareaPreparacionRepository.save(tarea);
		}
		pedidoRepository.save(encontrado);
		return generadas;
	}

	private SesionCocina sesionDe(SectorCocina sector) {
		SesionCocina sesion = new SesionCocina();
		sesion.setInicio(LocalDate.now().atStartOfDay());
		sesion.setTurno(LocalDate.now().toString());
		sesion.setTareas(new ArrayList<>(tareaPreparacionRepository.findAll().stream()
				.filter(t -> t.getSector() == sector)
				.toList()));
		return sesion;
	}
}
