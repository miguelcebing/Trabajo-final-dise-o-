package com.restsmart;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.restsmart.modelo.dominio.Complemento;
import com.restsmart.modelo.dominio.Producto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class ProductoTest {

	@Test
	void cotizaConElPrecioDelCatalogoYRechazaComplementosDuplicados() {
		Producto producto = new Producto();
		producto.setPrecioBase(5000);
		Complemento ofertado = new Complemento();
		ofertado.setNombre("Extra");
		ofertado.setPrecioAdicional(1000);
		producto.setComplementos(List.of(ofertado));

		Complemento enviado = new Complemento();
		enviado.setNombre("Extra");
		enviado.setPrecioAdicional(-4999);

		assertEquals(6000, producto.calcularPrecioItem(null, List.of(enviado)));
		assertFalse(producto.validarSeleccion(null, List.of(enviado, enviado)));
	}
}
