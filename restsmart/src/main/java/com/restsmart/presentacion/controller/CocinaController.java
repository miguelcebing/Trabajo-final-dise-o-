package com.restsmart.presentacion.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.modelo.dominio.SectorCocina;
import com.restsmart.modelo.dominio.TareaPreparacion;
import com.restsmart.negocio.service.GestionCocinaService;

@RestController
@RequestMapping("/cocina")
public class CocinaController {

	private final GestionCocinaService gestionCocinaService;

	private final SeguimientoController seguimientoController;

	public CocinaController(GestionCocinaService gestionCocinaService, SeguimientoController seguimientoController) {
		this.gestionCocinaService = gestionCocinaService;
		this.seguimientoController = seguimientoController;
	}

	@GetMapping("/tareas")
	public List<TareaPreparacion> verTareasSector(@RequestParam SectorCocina sector) {
		return gestionCocinaService.verTareasSector(sector);
	}

	@GetMapping("/tareas/{tareaId}")
	public TareaPreparacion verDetalleTarea(@PathVariable Integer tareaId) {
		TareaPreparacion tarea = new TareaPreparacion();
		tarea.setId(tareaId);
		return gestionCocinaService.verDetalleTarea(tarea);
	}

	@PutMapping("/tareas/{tareaId}/completar")
	public TareaPreparacion marcarTareaCompletada(@PathVariable Integer tareaId) {
		TareaPreparacion tarea = new TareaPreparacion();
		tarea.setId(tareaId);
		TareaPreparacion completada = gestionCocinaService.marcarTareaCompletada(tarea);
		if (completada.getPedido() != null && completada.getPedido().getId() != null) {
			seguimientoController.consultarEstado(completada.getPedido().getId());
		}
		return completada;
	}

	@GetMapping("/historial")
	public List<TareaPreparacion> verHistorialTurno(@RequestParam SectorCocina sector) {
		return gestionCocinaService.verHistorialTurno(sector);
	}
}
