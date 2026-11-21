package com.restsmart.datos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.restsmart.modelo.dominio.Mesa;

public interface MesaRepository extends MongoRepository<Mesa, Integer> {
}
