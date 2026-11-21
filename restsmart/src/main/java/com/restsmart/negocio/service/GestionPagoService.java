package com.restsmart.negocio.service;

import org.springframework.stereotype.Service;

import com.restsmart.datos.secuencia.GeneradorSecuencia;
import com.restsmart.datos.repository.PedidoRepository;
import com.restsmart.modelo.dominio.DatoContacto;
import com.restsmart.modelo.dominio.enumeracion.EstadoPago;
import com.restsmart.modelo.dominio.Pago;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.iPasarelaPago;
import com.restsmart.negocio.contrato.iProcesarPago;

@Service
public class GestionPagoService implements iProcesarPago {

	private final PedidoRepository pedidoRepository;

	private final GeneradorSecuencia generadorSecuencia;

	private final GestionCocinaService gestionCocinaService;

	public GestionPagoService(PedidoRepository pedidoRepository, GeneradorSecuencia generadorSecuencia,
			GestionCocinaService gestionCocinaService) {
		this.pedidoRepository = pedidoRepository;
		this.generadorSecuencia = generadorSecuencia;
		this.gestionCocinaService = gestionCocinaService;
	}

	public Pedido registrarDatosContacto(Pedido pedido, DatoContacto datos) {
		if (pedido == null) {
			throw new IllegalArgumentException("El pedido es obligatorio");
		}
		if (datos == null || !datos.validarCamposObligatorios()) {
			throw new IllegalArgumentException("Los datos de contacto son obligatorios");
		}
		pedido.registrarDatosContacto(datos.getNombre(), datos.getMedio(), datos.getValor());
		return pedidoRepository.save(asegurarId(pedido));
	}

	public Pago procesarPago(Pedido pedido, iPasarelaPago pasarela) {
		if (pedido == null) {
			throw new IllegalArgumentException("El pedido es obligatorio");
		}
		if (pasarela == null) {
			throw new IllegalArgumentException("La pasarela de pago es obligatoria");
		}
		Pedido actual = asegurarId(pedido);
		if (actual.getDatoContacto() == null || !actual.getDatoContacto().validarCamposObligatorios()) {
			throw new IllegalArgumentException("Debe registrar los datos de contacto antes de pagar");
		}
		actual.calcularTotal();
		Pago pago = actual.pagar(pasarela);
		pedidoRepository.save(actual);
		if (pago.getEstado() == EstadoPago.Confirmado) {
			gestionCocinaService.enrutarPedido(actual);
		}
		return pago;
	}

	private Pedido asegurarId(Pedido pedido) {
		if (pedido.getId() == null) {
			pedido.setId(generadorSecuencia.siguiente("pedido"));
		}
		return pedido;
	}
}
