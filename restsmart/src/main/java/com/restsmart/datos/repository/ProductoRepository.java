package com.restsmart.datos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.restsmart.modelo.dominio.Producto;

public interface ProductoRepository extends MongoRepository<Producto, Integer> {
}
