package com.restsmart.datos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.restsmart.modelo.dominio.Pedido;

public interface PedidoRepository extends MongoRepository<Pedido, Integer> {
}
