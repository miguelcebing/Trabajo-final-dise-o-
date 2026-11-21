package com.restsmart.modelo.dominio;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.restsmart.modelo.dominio.enumeracion.EstadoPedido;
import com.restsmart.modelo.dominio.enumeracion.EstadoTarea;
import com.restsmart.modelo.dominio.enumeracion.SectorCocina;
import com.restsmart.modelo.dominio.enumeracion.TipoContacto;

@Document(collection = "pedidos")
public class Pedido {

	@Id
	private Integer id;

	private Integer numeroPedido;

	private LocalDateTime fechaHora;

	private EstadoPedido estado;

	private double total;

	private Boolean confirmadoEnPantalla;

	private Boolean avisoCerrado;

	private List<ItemPedido> items = new ArrayList<>();

	@DBRef
	private Mesa mesa;

	private Pago pago;

	private DatoContacto datoContacto;

	@Transient
	private List<TareaPreparacion> tareas = new ArrayList<>();

	public Pedido() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getNumeroPedido() {
		return numeroPedido;
	}

	public void setNumeroPedido(Integer numeroPedido) {
		this.numeroPedido = numeroPedido;
	}

	public LocalDateTime getFechaHora() {
		return fechaHora;
	}

	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}

	public EstadoPedido getEstado() {
		return estado;
	}

	public void setEstado(EstadoPedido estado) {
		this.estado = estado;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public Boolean getConfirmadoEnPantalla() {
		return confirmadoEnPantalla;
	}

	public void setConfirmadoEnPantalla(Boolean confirmadoEnPantalla) {
		this.confirmadoEnPantalla = confirmadoEnPantalla;
	}

	public Boolean getAvisoCerrado() {
		return avisoCerrado;
	}

	public void setAvisoCerrado(Boolean avisoCerrado) {
		this.avisoCerrado = avisoCerrado;
	}

	public List<ItemPedido> getItems() {
		return items;
	}

	public void setItems(List<ItemPedido> items) {
		this.items = items;
	}

	public Mesa getMesa() {
		return mesa;
	}

	public void setMesa(Mesa mesa) {
		this.mesa = mesa;
	}

	public Pago getPago() {
		return pago;
	}

	public void setPago(Pago pago) {
		this.pago = pago;
	}

	public DatoContacto getDatoContacto() {
		return datoContacto;
	}

	public void setDatoContacto(DatoContacto datoContacto) {
		this.datoContacto = datoContacto;
	}

	public List<TareaPreparacion> getTareas() {
		return tareas;
	}

	public void setTareas(List<TareaPreparacion> tareas) {
		this.tareas = tareas;
	}

	public double calcularTotal() {
		this.total = items.stream()
				.peek(ItemPedido::calcularSubtotal)
				.mapToDouble(ItemPedido::getSubtotal)
				.sum();
		return this.total;
	}

	public DatoContacto registrarDatosContacto(String nombre, TipoContacto medio, String valor) {
		DatoContacto contacto = new DatoContacto();
		contacto.setNombre(nombre);
		contacto.setMedio(medio);
		contacto.setValor(valor);
		this.datoContacto = contacto;
		return contacto;
	}

	public void confirmarEnPantalla() {
		this.confirmadoEnPantalla = true;
	}

	public Pago pagar(iPasarelaPago pasarela) {
		Pago nuevoPago = new Pago();
		nuevoPago.setMonto(this.total);
		nuevoPago.setFechaHora(LocalDateTime.now());
		boolean aprobado = nuevoPago.procesar(pasarela);
		this.pago = nuevoPago;
		if (aprobado) {
			this.estado = EstadoPedido.Pagado;
			generarNumeroPedido();
		}
		return nuevoPago;
	}

	public Integer generarNumeroPedido() {
		if (this.numeroPedido == null) {
			this.numeroPedido = this.id != null ? this.id : Math.abs(hashCode());
		}
		return this.numeroPedido;
	}

	public List<TareaPreparacion> enviarACocina() {
		Map<SectorCocina, List<ItemPedido>> porSector = items.stream()
				.filter(i -> i.getProducto() != null && i.getProducto().getSector() != null)
				.collect(Collectors.groupingBy(i -> i.getProducto().getSector()));
		List<TareaPreparacion> generadas = new ArrayList<>();
		porSector.forEach((sector, itemsSector) -> {
			TareaPreparacion tarea = new TareaPreparacion();
			tarea.setSector(sector);
			tarea.setEstado(EstadoTarea.Pendiente);
			tarea.setPedido(this);
			tarea.setFechaHoraCreacion(LocalDateTime.now());
			tarea.setItems(new ArrayList<>(itemsSector));
			tarea.setIndicaciones(itemsSector.stream()
					.map(ItemPedido::obtenerIndicaciones)
					.filter(texto -> texto != null && !texto.isBlank())
					.collect(Collectors.joining("; ")));
			generadas.add(tarea);
		});
		this.tareas = generadas;
		this.estado = EstadoPedido.EnPreparacion;
		return generadas;
	}

	public boolean puedeCancelarse() {
		return this.estado == null;
	}

	public void cancelar() {
		if (puedeCancelarse()) {
			this.estado = EstadoPedido.Cancelado;
		}
	}

	public boolean todasTareasCompletadas() {
		return tareas != null && !tareas.isEmpty() && tareas.stream().allMatch(TareaPreparacion::estaCompletada);
	}

	public void actualizarEstado() {
		if (todasTareasCompletadas()) {
			this.estado = EstadoPedido.Listo;
		}
	}

	public EstadoPedido consultarEstado() {
		return this.estado;
	}

	public boolean debeMostrarAviso() {
		return this.estado == EstadoPedido.Listo && !Boolean.TRUE.equals(this.avisoCerrado);
	}

	public void cerrarAviso() {
		this.avisoCerrado = true;
	}
}
