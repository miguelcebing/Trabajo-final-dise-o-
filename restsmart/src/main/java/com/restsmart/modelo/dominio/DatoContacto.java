package com.restsmart.modelo.dominio;

public class DatoContacto {

	private String nombre;

	private TipoContacto medio;

	private String valor;

	public DatoContacto() {
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public TipoContacto getMedio() {
		return medio;
	}

	public void setMedio(TipoContacto medio) {
		this.medio = medio;
	}

	public String getValor() {
		return valor;
	}

	public void setValor(String valor) {
		this.valor = valor;
	}

	public boolean validarCamposObligatorios() {
		return nombre != null && !nombre.isBlank()
				&& medio != null
				&& valor != null && !valor.isBlank();
	}
}
