package com.restsmart.modelo.dominio;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SesionCocina {

	private Integer id;

	private LocalDateTime inicio;

	private String turno;

	private List<TareaPreparacion> tareas = new ArrayList<>();

	public SesionCocina() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getInicio() {
		return inicio;
	}

	public void setInicio(LocalDateTime inicio) {
		this.inicio = inicio;
	}

	public String getTurno() {
		return turno;
	}

	public void setTurno(String turno) {
		this.turno = turno;
	}

	public List<TareaPreparacion> getTareas() {
		return tareas;
	}

	public void setTareas(List<TareaPreparacion> tareas) {
		this.tareas = tareas;
	}

	public List<TareaPreparacion> obtenerTareasDelSector(SectorCocina sector) {
		return tareas.stream()
				.filter(t -> t.getSector() == sector)
				.toList();
	}

	public boolean obtenerTareasCompletadas() {
		return !tareas.isEmpty() && tareas.stream().allMatch(TareaPreparacion::estaCompletada);
	}

	public List<TareaPreparacion> obtenerHistorialTurno() {
		return tareas;
	}
}
