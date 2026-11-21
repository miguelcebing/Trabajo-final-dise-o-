package com.restsmart.modelo.dominio;

public class Complemento extends OpcionProducto {

	private boolean obligatorio = false;

	public Complemento() {
	}

	@Override
	public boolean esObligatorio() {
		return obligatorio;
	}

	public boolean isObligatorio() {
		return obligatorio;
	}

	public void setObligatorio(boolean obligatorio) {
		this.obligatorio = obligatorio;
	}
}
