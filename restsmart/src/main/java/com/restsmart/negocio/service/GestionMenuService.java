package com.restsmart.negocio.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.restsmart.datos.repository.CategoriaRepository;
import com.restsmart.datos.repository.ProductoRepository;
import com.restsmart.modelo.dominio.Categoria;
import com.restsmart.modelo.dominio.Complemento;
import com.restsmart.modelo.dominio.OpcionProducto;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.modelo.dominio.Variante;
import com.restsmart.negocio.contrato.iAdministrarCatalogo;
import com.restsmart.negocio.contrato.iConsultaMenu;

@Service
public class GestionMenuService implements iConsultaMenu, iAdministrarCatalogo {

	private final CategoriaRepository categoriaRepository;

	private final ProductoRepository productoRepository;

	public GestionMenuService(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
		this.categoriaRepository = categoriaRepository;
		this.productoRepository = productoRepository;
	}

	public List<Producto> listarPorCategoria(Categoria categoria) {
		Integer categoriaId = categoria == null ? null : categoria.getId();
		if (categoriaId == null) {
			return List.of();
		}
		Categoria existente = categoriaRepository.findById(categoriaId).orElse(null);
		Integer idBuscado = existente == null ? categoriaId : existente.getId();
		return productoRepository.findAll().stream()
				.filter(Producto::estadoDisponible)
				.filter(p -> p.getCategoria() != null && Objects.equals(p.getCategoria().getId(), idBuscado))
				.toList();
	}

	public Producto obtenerDetalleProducto(Producto producto) {
		Integer id = producto == null ? null : producto.getId();
		if (id == null) {
			throw new IllegalArgumentException("El producto es obligatorio");
		}
		return productoRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + id));
	}

	public boolean validarSeleccion(Producto producto, List<OpcionProducto> opciones) {
		Producto encontrado = obtenerDetalleProducto(producto);
		return encontrado.validarSeleccion(obtenerVariante(opciones), obtenerComplementos(opciones));
	}

	public double calcularPrecioItem(Producto producto, List<OpcionProducto> opciones) {
		Producto encontrado = obtenerDetalleProducto(producto);
		return encontrado.calcularPrecioItem(obtenerVariante(opciones), obtenerComplementos(opciones));
	}

	private Variante obtenerVariante(List<OpcionProducto> opciones) {
		if (opciones == null) {
			return null;
		}
		return opciones.stream()
				.filter(Variante.class::isInstance)
				.map(Variante.class::cast)
				.findFirst()
				.orElse(null);
	}

	private List<Complemento> obtenerComplementos(List<OpcionProducto> opciones) {
		if (opciones == null) {
			return new ArrayList<>();
		}
		return opciones.stream()
				.filter(Complemento.class::isInstance)
				.map(Complemento.class::cast)
				.toList();
	}
}
