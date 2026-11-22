package com.restsmart.presentacion.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> solicitudInvalida(IllegalArgumentException e) {
		String mensaje = e.getMessage() == null ? "La solicitud no es valida" : e.getMessage();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", mensaje));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> cuerpoInvalido(HttpMessageNotReadableException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(Map.of("message", "El formato de la solicitud no es valido"));
	}
}
