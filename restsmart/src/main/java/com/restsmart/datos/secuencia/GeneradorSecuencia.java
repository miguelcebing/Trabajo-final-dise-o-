package com.restsmart.datos.secuencia;

import org.bson.Document;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

@Component
public class GeneradorSecuencia {

	private final MongoTemplate mongoTemplate;

	public GeneradorSecuencia(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	public Integer siguiente(String nombre) {
		Query query = new Query(Criteria.where("_id").is(nombre));
		Update update = new Update().inc("valor", 1);
		FindAndModifyOptions options = FindAndModifyOptions.options().upsert(true).returnNew(true);
		Document documento = mongoTemplate.findAndModify(query, update, options, Document.class, "secuencias");
		return ((Number) documento.get("valor")).intValue();
	}
}
