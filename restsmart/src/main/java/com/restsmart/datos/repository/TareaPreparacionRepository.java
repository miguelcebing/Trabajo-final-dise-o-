package com.restsmart.datos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.restsmart.modelo.dominio.TareaPreparacion;

public interface TareaPreparacionRepository extends MongoRepository<TareaPreparacion, Integer> {
}
