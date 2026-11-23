package com.restsmart.presentacion.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.modelo.dominio.Categoria;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.modelo.dominio.enumeracion.SectorCocina;
import com.restsmart.negocio.service.AdministracionMenuService;
import com.restsmart.presentacion.dto.CrearProductoRequest;

@RestController
@RequestMapping("/admin/productos")
public class AdministracionMenuController {

	private final AdministracionMenuService administracionMenuService;

	public AdministracionMenuController(AdministracionMenuService administracionMenuService) {
		this.administracionMenuService = administracionMenuService;
	}

	@PostMapping(params = {"nombre", "precio", "categoria", "sector"})
	public Producto crearProducto(@RequestParam String nombre, @RequestParam double precio,
			@RequestParam Integer categoria, @RequestParam SectorCocina sector) {
		Categoria existente = new Categoria();
		existente.setId(categoria);
		return administracionMenuService.crearProducto(nombre, precio, existente, sector);
	}

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public Producto crearProductoDesdeJson(@RequestBody CrearProductoRequest solicitud) {
		if (solicitud.precio() == null) {
			throw new IllegalArgumentException("El precio es obligatorio");
		}
		return crearProducto(solicitud.nombre(), solicitud.precio(), solicitud.categoria(), solicitud.sector());
	}

	@PutMapping("/{id}/precio")
	public Producto modificarPrecioYDescripcion(@PathVariable Integer id, @RequestParam double precio,
			@RequestParam(required = false) String descripcion) {
		Producto producto = new Producto();
		producto.setId(id);
		return administracionMenuService.modificarPrecioYDescripcion(producto, precio, descripcion);
	}

	@DeleteMapping("/{id}")
	public Producto desactivarProducto(@PathVariable Integer id) {
		Producto producto = new Producto();
		producto.setId(id);
		return administracionMenuService.desactivarProducto(producto);
	}

	@PutMapping("/{id}/sector")
	public Producto asignarSectorCocina(@PathVariable Integer id, @RequestParam SectorCocina sector) {
		Producto producto = new Producto();
		producto.setId(id);
		return administracionMenuService.asignarSectorCocina(producto, sector);
	}
}
