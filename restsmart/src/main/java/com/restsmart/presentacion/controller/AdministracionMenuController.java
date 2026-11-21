package com.restsmart.presentacion.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.modelo.dominio.Categoria;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.modelo.dominio.enumeracion.SectorCocina;
import com.restsmart.negocio.service.AdministracionMenuService;

@RestController
@RequestMapping("/admin/productos")
public class AdministracionMenuController {

	private final AdministracionMenuService administracionMenuService;

	public AdministracionMenuController(AdministracionMenuService administracionMenuService) {
		this.administracionMenuService = administracionMenuService;
	}

	@PostMapping
	public Producto crearProducto(@RequestParam String nombre, @RequestParam double precio,
			@RequestParam Integer categoria, @RequestParam SectorCocina sector) {
		Categoria existente = new Categoria();
		existente.setId(categoria);
		return administracionMenuService.crearProducto(nombre, precio, existente, sector);
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
