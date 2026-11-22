package com.restsmart.presentacion.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.datos.repository.MesaRepository;
import com.restsmart.modelo.dominio.Mesa;

@RestController
@RequestMapping("/mesas")
public class MesaController {

	private final MesaRepository mesaRepository;

	public MesaController(MesaRepository mesaRepository) {
		this.mesaRepository = mesaRepository;
	}

	@GetMapping
	public List<Mesa> listarMesas() {
		return mesaRepository.findAll();
	}
}
