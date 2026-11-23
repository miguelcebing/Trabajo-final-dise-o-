package com.restsmart.presentacion.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restsmart.presentacion.dto.SeleccionOpcionesRequest;
import com.restsmart.datos.repository.PedidoRepository;
import com.restsmart.modelo.dominio.Carrito;
import com.restsmart.modelo.dominio.Complemento;
import com.restsmart.modelo.dominio.DatoContacto;
import com.restsmart.modelo.dominio.ItemPedido;
import com.restsmart.modelo.dominio.Mesa;
import com.restsmart.modelo.dominio.OpcionProducto;
import com.restsmart.modelo.dominio.OpcionSeleccionada;
import com.restsmart.modelo.dominio.PasarelaPago;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.negocio.service.GestionPagoService;
import com.restsmart.negocio.service.GestionPedidoService;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

	private final GestionPedidoService gestionPedidoService;

	private final GestionPagoService gestionPagoService;

	private final PasarelaPago pasarelaPago;

	private final PedidoRepository pedidoRepository;

	public PedidoController(GestionPedidoService gestionPedidoService, GestionPagoService gestionPagoService,
			PasarelaPago pasarelaPago, PedidoRepository pedidoRepository) {
		this.gestionPedidoService = gestionPedidoService;
		this.gestionPagoService = gestionPagoService;
		this.pasarelaPago = pasarelaPago;
		this.pedidoRepository = pedidoRepository;
	}

	@PostMapping("/items")
	public Carrito agregarProducto(@RequestParam Integer productoId, @RequestParam Integer cantidad,
			@RequestBody(required = false) SeleccionOpcionesRequest request) {
		Producto producto = new Producto();
		producto.setId(productoId);
		return gestionPedidoService.agregarProducto(producto, cantidad, aOpciones(request));
	}

	@PutMapping("/items/{itemId}/cantidad")
	public Carrito modificarCantidad(@PathVariable Integer itemId, @RequestParam Integer cantidad) {
		ItemPedido item = new ItemPedido();
		item.setId(itemId);
		return gestionPedidoService.modificarCantidad(item, cantidad);
	}

	@DeleteMapping("/items/{itemId}")
	public Carrito quitarItem(@PathVariable Integer itemId) {
		ItemPedido item = new ItemPedido();
		item.setId(itemId);
		return gestionPedidoService.quitarItem(item);
	}

	@PutMapping("/mesa")
	public Mesa indicarMesa(@RequestParam Integer numeroMesa) {
		Mesa mesa = new Mesa();
		mesa.setNumero(numeroMesa);
		return gestionPedidoService.indicarMesa(mesa);
	}

	@GetMapping("/resumen")
	public Carrito verResumenPedido() {
		return gestionPedidoService.verResumen(null);
	}

	@PostMapping("/pagar")
	public Pedido pagar(@RequestBody DatoContacto datos) {
		if (datos == null || !datos.validarCamposObligatorios()) {
			throw new IllegalArgumentException("Completa el nombre y los datos de contacto antes de pagar");
		}
		Pedido pedido = gestionPedidoService.confirmarPedido(null, null);
		Pedido conContacto = gestionPagoService.registrarDatosContacto(pedido, datos);
		gestionPagoService.procesarPago(conContacto, pasarelaPago);
		return pedidoRepository.findById(conContacto.getId()).orElse(conContacto);
	}

	@DeleteMapping("/{pedidoId}")
	public Pedido cancelarPedido(@PathVariable Integer pedidoId) {
		Pedido pedido = new Pedido();
		pedido.setId(pedidoId);
		return gestionPedidoService.cancelarPedido(pedido);
	}

	private List<OpcionSeleccionada> aOpciones(SeleccionOpcionesRequest request) {
		List<OpcionSeleccionada> opciones = new ArrayList<>();
		if (request == null) {
			return opciones;
		}
		if (request.variante() != null) {
			opciones.add(aSeleccionada(request.variante()));
		}
		if (request.complementos() != null) {
			for (Complemento complemento : request.complementos()) {
				if (complemento == null) {
					throw new IllegalArgumentException("El complemento no puede estar vacío");
				}
				opciones.add(aSeleccionada(complemento));
			}
		}
		return opciones;
	}

	private OpcionSeleccionada aSeleccionada(OpcionProducto opcion) {
		OpcionSeleccionada seleccionada = new OpcionSeleccionada();
		seleccionada.setOpcion(opcion);
		return seleccionada;
	}
}
