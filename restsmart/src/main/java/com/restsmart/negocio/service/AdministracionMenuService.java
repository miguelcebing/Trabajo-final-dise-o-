package com.restsmart.negocio.service;

import org.springframework.stereotype.Service;

import com.restsmart.datos.GeneradorSecuencia;
import com.restsmart.datos.repository.CategoriaRepository;
import com.restsmart.datos.repository.ProductoRepository;
import com.restsmart.modelo.dominio.Administrador;
import com.restsmart.modelo.dominio.Categoria;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.modelo.dominio.SectorCocina;

@Service
public class AdministracionMenuService {

	private final Administrador administrador = new Administrador();

	private final ProductoRepository productoRepository;

	private final CategoriaRepository categoriaRepository;

	private final GeneradorSecuencia generadorSecuencia;

	public AdministracionMenuService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository,
			GeneradorSecuencia generadorSecuencia) {
		this.productoRepository = productoRepository;
		this.categoriaRepository = categoriaRepository;
		this.generadorSecuencia = generadorSecuencia;
	}

	public Producto crearProducto(String nombre, double precio, Categoria categoria, SectorCocina sector) {
		if (categoria == null || categoria.getId() == null) {
			throw new IllegalArgumentException("La categoria es obligatoria");
		}
		Categoria existente = categoriaRepository.findById(categoria.getId())
				.orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada: " + categoria.getId()));
		Producto producto = administrador.crearProducto(nombre, null, precio, null, existente, sector);
		if (!producto.validarCamposObligatorios()) {
			throw new IllegalArgumentException("Los datos del producto no son validos");
		}
		producto.setId(generadorSecuencia.siguiente("producto"));
		return productoRepository.save(producto);
	}

	public Producto modificarPrecioYDescripcion(Producto producto, double precio, String descripcion) {
		Producto existente = obtener(producto);
		administrador.modificarProducto(existente, precio, descripcion);
		return productoRepository.save(existente);
	}

	public Producto desactivarProducto(Producto producto) {
		Producto existente = obtener(producto);
		administrador.desactivarProducto(existente);
		return productoRepository.save(existente);
	}

	public Producto asignarSectorCocina(Producto producto, SectorCocina sector) {
		Producto existente = obtener(producto);
		administrador.asignarSectorProducto(existente, sector);
		return productoRepository.save(existente);
	}

	private Producto obtener(Producto producto) {
		if (producto == null || producto.getId() == null) {
			throw new IllegalArgumentException("El producto es obligatorio");
		}
		return productoRepository.findById(producto.getId())
				.orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + producto.getId()));
	}
}
