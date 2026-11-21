package com.restsmart.modelo.dominio;

public interface iPasarelaPago {

	String solicitarPago(double monto);

	boolean confirmarTransaccion(String referencia);
}
