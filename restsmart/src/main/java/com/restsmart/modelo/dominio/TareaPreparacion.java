package com.restsmart.modelo.dominio;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tareasPreparacion")
public class TareaPreparacion {

	@Id
	private Integer id;

	private SectorCocina sector;

	private EstadoTarea estado;

	@DBRef
	private Pedido pedido;

	private LocalDateTime fechaHoraCreacion;

	private LocalDateTime fechaHoraCompletada;

	private String indicaciones;

	private List<ItemPedido> items = new ArrayList<>();

	public TareaPreparacion() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public SectorCocina getSector() {
		return sector;
	}

	public void setSector(SectorCocina sector) {
		this.sector = sector;
	}

	public EstadoTarea getEstado() {
		return estado;
	}

	public void setEstado(EstadoTarea estado) {
		this.estado = estado;
	}

	public Pedido getPedido() {
		return pedido;
	}

	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	public LocalDateTime getFechaHoraCreacion() {
		return fechaHoraCreacion;
	}

	public void setFechaHoraCreacion(LocalDateTime fechaHoraCreacion) {
		this.fechaHoraCreacion = fechaHoraCreacion;
	}

	public LocalDateTime getFechaHoraCompletada() {
		return fechaHoraCompletada;
	}

	public void setFechaHoraCompletada(LocalDateTime fechaHoraCompletada) {
		this.fechaHoraCompletada = fechaHoraCompletada;
	}

	public String getIndicaciones() {
		return indicaciones;
	}

	public void setIndicaciones(String indicaciones) {
		this.indicaciones = indicaciones;
	}

	public List<ItemPedido> getItems() {
		return items;
	}

	public void setItems(List<ItemPedido> items) {
		this.items = items;
	}

	public List<ItemPedido> obtenerItemsDelSector() {
		return items.stream()
				.filter(i -> i.getProducto() != null && i.getProducto().getSector() == sector)
				.toList();
	}

	public void marcarCompletada() {
		this.estado = EstadoTarea.Completada;
		this.fechaHoraCompletada = LocalDateTime.now();
	}

	public boolean estaCompletada() {
		return this.estado == EstadoTarea.Completada;
	}

	public long calcularTiempoPreparacion() {
		if (fechaHoraCreacion == null) {
			return 0;
		}
		LocalDateTime fin = fechaHoraCompletada == null ? LocalDateTime.now() : fechaHoraCompletada;
		return Duration.between(fechaHoraCreacion, fin).toMinutes();
	}

	public List<ItemPedido> obtenerDetalleCompleto() {
		return items;
	}
}
