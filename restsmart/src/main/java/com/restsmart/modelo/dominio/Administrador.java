package com.restsmart.modelo.dominio;

import com.restsmart.modelo.dominio.enumeracion.SectorCocina;

public class Administrador {

	private Integer id;

	private String nombre;

	private String correo;

	private String contrasena;

	private Boolean activo;

	public Administrador() {
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

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public String getContrasena() {
		return contrasena;
	}

	public void setContrasena(String contrasena) {
		this.contrasena = contrasena;
	}

	public Boolean getActivo() {
		return activo;
	}

	public void setActivo(Boolean activo) {
		this.activo = activo;
	}

	public Producto crearProducto(String nombre, String descripcion, double precioBase, String imagenURL,
			Categoria categoria, SectorCocina sector) {
		Producto producto = new Producto();
		producto.setNombre(nombre);
		producto.setDescripcion(descripcion);
		producto.setPrecioBase(precioBase);
		producto.setImagenURL(imagenURL);
		producto.setCategoria(categoria);
		producto.setSector(sector);
		return producto;
	}

	public void modificarProducto(Producto producto, double precioBase, String descripcion) {
		if (producto != null) {
			producto.actualizarPrecioDescripcion(precioBase, descripcion);
		}
	}

	public void desactivarProducto(Producto producto) {
		if (producto != null) {
			producto.desactivar();
		}
	}

	public void asignarSectorProducto(Producto producto, SectorCocina sector) {
		if (producto != null) {
			producto.asignarSector(sector);
		}
	}
}
