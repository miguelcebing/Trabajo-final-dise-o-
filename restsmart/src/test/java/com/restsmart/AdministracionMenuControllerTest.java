package com.restsmart;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.restsmart.modelo.dominio.Producto;
import com.restsmart.modelo.dominio.enumeracion.SectorCocina;
import com.restsmart.negocio.service.AdministracionMenuService;
import com.restsmart.presentacion.controller.AdministracionMenuController;

class AdministracionMenuControllerTest {

	private final AdministracionMenuService servicio = mock(AdministracionMenuService.class);
	private final MockMvc api = MockMvcBuilders.standaloneSetup(new AdministracionMenuController(servicio))
			.build();

	@Test
	void aceptaJsonYParametrosConElMismoServicio() throws Exception {
		when(servicio.crearProducto(eq("Perro caliente"), eq(15000.0), any(), eq(SectorCocina.Parrilla)))
				.thenReturn(new Producto());

		api.perform(post("/admin/productos").contentType(MediaType.APPLICATION_JSON).content("""
				{"nombre":"Perro caliente","precio":15000,"categoria":2,"sector":"Parrilla"}
				""")).andExpect(status().isOk());

		api.perform(post("/admin/productos").param("nombre", "Perro caliente").param("precio", "15000")
				.param("categoria", "2").param("sector", "Parrilla")).andExpect(status().isOk());

		verify(servicio, times(2)).crearProducto(eq("Perro caliente"), eq(15000.0),
				argThat(categoria -> Integer.valueOf(2).equals(categoria.getId())),
				eq(SectorCocina.Parrilla));
	}
}
