package com.restsmart.modelo.dominio;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "mesas")
public class Mesa {

	@Id
	private Integer id;

	private Integer numero;

	private Boolean habilitada;

	public Mesa() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getNumero() {
		return numero;
	}

	public void setNumero(Integer numero) {
		this.numero = numero;
	}

	public Boolean getHabilitada() {
		return habilitada;
	}

	public void setHabilitada(Boolean habilitada) {
		this.habilitada = habilitada;
	}

	public boolean validarNumero() {
		return numero != null && numero > 0;
	}

	public boolean estaHabilitada() {
		return Boolean.TRUE.equals(habilitada);
	}
}
