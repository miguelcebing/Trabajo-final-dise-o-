package com.restsmart.modelo.dominio;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class PasarelaPago implements iPasarelaPago {

	@Override
	public String solicitarPago(double monto) {
		return "PAGO-" + UUID.randomUUID();
	}

	@Override
	public boolean confirmarTransaccion(String referencia) {
		return referencia != null && !referencia.isBlank();
	}
}
