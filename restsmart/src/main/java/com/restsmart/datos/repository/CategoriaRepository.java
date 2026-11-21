package com.restsmart.datos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.restsmart.modelo.dominio.Categoria;

public interface CategoriaRepository extends MongoRepository<Categoria, Integer> {
}
