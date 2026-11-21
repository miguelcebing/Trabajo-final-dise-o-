package com.restsmart.presentacion.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.modelo.dominio.Categoria;
import com.restsmart.modelo.dominio.OpcionProducto;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.negocio.service.GestionMenuService;

@RestController
@RequestMapping("/menu")
public class MenuController {

	private final GestionMenuService gestionMenuService;

	public MenuController(GestionMenuService gestionMenuService) {
		this.gestionMenuService = gestionMenuService;
	}

	@GetMapping("/categoria/{categoriaId}")
	public List<Producto> listaMenuPorCategoria(@PathVariable Integer categoriaId) {
		Categoria categoria = new Categoria();
		categoria.setId(categoriaId);
		return gestionMenuService.listarPorCategoria(categoria);
	}

	@GetMapping("/producto/{id}")
	public Producto verDetalleProducto(@PathVariable Integer id) {
		Producto producto = new Producto();
		producto.setId(id);
		return gestionMenuService.obtenerDetalleProducto(producto);
	}

	@PostMapping("/producto/{id}/opciones")
	public boolean SeleccionarOpciones(@PathVariable Integer id, @RequestBody SeleccionOpcionesRequest request) {
		Producto producto = new Producto();
		producto.setId(id);
		return gestionMenuService.validarSeleccion(producto, aOpciones(request));
	}

	@PostMapping("/producto/{id}/precio")
	public double calcularPrecioItem(@PathVariable Integer id, @RequestBody SeleccionOpcionesRequest request) {
		Producto producto = new Producto();
		producto.setId(id);
		return gestionMenuService.calcularPrecioItem(producto, aOpciones(request));
	}

	private List<OpcionProducto> aOpciones(SeleccionOpcionesRequest request) {
		List<OpcionProducto> opciones = new ArrayList<>();
		if (request != null && request.variante() != null) {
			opciones.add(request.variante());
		}
		if (request != null && request.complementos() != null) {
			opciones.addAll(request.complementos());
		}
		return opciones;
	}
}
