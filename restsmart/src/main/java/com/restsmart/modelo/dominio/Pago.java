package com.restsmart.modelo.dominio;

import java.time.LocalDateTime;

import com.restsmart.modelo.dominio.enumeracion.EstadoPago;

public class Pago {

	private Integer id;

	private double monto;

	private LocalDateTime fechaHora;

	private EstadoPago estado;

	private String referenciaExterna;

	public Pago() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public double getMonto() {
		return monto;
	}

	public void setMonto(double monto) {
		this.monto = monto;
	}

	public LocalDateTime getFechaHora() {
		return fechaHora;
	}

	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}

	public EstadoPago getEstado() {
		return estado;
	}

	public void setEstado(EstadoPago estado) {
		this.estado = estado;
	}

	public String getReferenciaExterna() {
		return referenciaExterna;
	}

	public void setReferenciaExterna(String referenciaExterna) {
		this.referenciaExterna = referenciaExterna;
	}

	public boolean procesar(iPasarelaPago pasarela) {
		this.estado = EstadoPago.EnProceso;
		String referencia = pasarela.solicitarPago(this.monto);
		if (referencia != null && pasarela.confirmarTransaccion(referencia)) {
			confirmar(referencia);
		}
		return this.estado == EstadoPago.Confirmado;
	}

	public boolean estadoEnProceso() {
		return this.estado == EstadoPago.EnProceso;
	}

	public void confirmar(String referencia) {
		this.referenciaExterna = referencia;
		this.estado = EstadoPago.Confirmado;
	}
}
