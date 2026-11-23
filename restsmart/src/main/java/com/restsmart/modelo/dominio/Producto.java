package com.restsmart.modelo.dominio;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.restsmart.modelo.dominio.enumeracion.SectorCocina;

@Document(collection = "productos")
public class Producto {

	@Id
	private Integer id;

	private String nombre;

	private String descripcion;

	private double precioBase;

	private String imagenURL;

	private Boolean activo = true;

	@DBRef
	private Categoria categoria;

	private SectorCocina sector;

	private List<Variante> variantes = new ArrayList<>();

	private List<Complemento> complementos = new ArrayList<>();

	public Producto() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public double getPrecioBase() {
		return precioBase;
	}

	public void setPrecioBase(double precioBase) {
		this.precioBase = precioBase;
	}

	public String getImagenURL() {
		return imagenURL;
	}

	public void setImagenURL(String imagenURL) {
		this.imagenURL = imagenURL;
	}

	public Boolean getActivo() {
		return activo;
	}

	public void setActivo(Boolean activo) {
		this.activo = activo;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public SectorCocina getSector() {
		return sector;
	}

	public void setSector(SectorCocina sector) {
		this.sector = sector;
	}

	public List<Variante> getVariantes() {
		return variantes;
	}

	public void setVariantes(List<Variante> variantes) {
		this.variantes = variantes;
	}

	public List<Complemento> getComplementos() {
		return complementos;
	}

	public void setComplementos(List<Complemento> complementos) {
		this.complementos = complementos;
	}

	public boolean validarCamposObligatorios() {
		return nombre != null && !nombre.isBlank()
				&& precioBase > 0
				&& categoria != null
				&& categoria.getId() != null
				&& sector != null;
	}

	public boolean estadoDisponible() {
		return Boolean.TRUE.equals(activo);
	}

	public boolean validarSeleccion(Variante variante, List<Complemento> seleccionados) {
		List<Complemento> elegidos = seleccionados == null ? List.of() : seleccionados;
		if (variante != null && buscarOpcion(variantes, variante) == null) {
			return false;
		}
		if (elegidos.stream().anyMatch(c -> buscarOpcion(complementos, c) == null)
				|| elegidos.stream().map(Complemento::getNombre).distinct().count() != elegidos.size()) {
			return false;
		}
		for (Complemento ofertado : complementos) {
			if (ofertado.esObligatorio()) {
				boolean incluido = elegidos.stream()
						.anyMatch(c -> c.getNombre() != null && c.getNombre().equals(ofertado.getNombre()));
				if (!incluido) {
					return false;
				}
			}
		}
		return true;
	}

	public double calcularPrecioItem(Variante variante, List<Complemento> seleccionados) {
		return precioBase + resolverOpciones(variante, seleccionados).stream()
				.mapToDouble(OpcionProducto::getPrecioAdicional)
				.sum();
	}

	public List<OpcionProducto> resolverOpciones(Variante variante, List<Complemento> seleccionados) {
		if (!validarSeleccion(variante, seleccionados)) {
			throw new IllegalArgumentException("La selección de opciones no es válida");
		}
		List<OpcionProducto> opciones = new ArrayList<>();
		if (variante != null) {
			opciones.add(buscarOpcion(variantes, variante));
		}
		if (seleccionados != null) {
			for (Complemento complemento : seleccionados) {
				opciones.add(buscarOpcion(complementos, complemento));
			}
		}
		return opciones;
	}

	private <T extends OpcionProducto> T buscarOpcion(List<T> catalogo, T seleccion) {
		if (seleccion == null || seleccion.getNombre() == null) {
			return null;
		}
		return catalogo.stream()
				.filter(opcion -> seleccion.getNombre().equals(opcion.getNombre()))
				.findFirst()
				.orElse(null);
	}

	public void actualizarPrecioDescripcion(double precioBase, String descripcion) {
		this.precioBase = precioBase;
		this.descripcion = descripcion;
	}

	public void desactivar() {
		this.activo = false;
	}

	public void asignarSector(SectorCocina sector) {
		this.sector = sector;
	}
}
