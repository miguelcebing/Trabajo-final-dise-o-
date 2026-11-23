package com.restsmart.negocio.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import com.restsmart.datos.secuencia.GeneradorSecuencia;
import com.restsmart.datos.repository.MesaRepository;
import com.restsmart.datos.repository.PedidoRepository;
import com.restsmart.datos.repository.ProductoRepository;
import com.restsmart.modelo.dominio.Carrito;
import com.restsmart.modelo.dominio.Complemento;
import com.restsmart.modelo.dominio.ItemPedido;
import com.restsmart.modelo.dominio.Mesa;
import com.restsmart.modelo.dominio.OpcionSeleccionada;
import com.restsmart.modelo.dominio.OpcionProducto;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.Producto;
import com.restsmart.modelo.dominio.Variante;

@Service
@SessionScope
public class GestionPedidoService {

	private final ProductoRepository productoRepository;

	private final MesaRepository mesaRepository;

	private final PedidoRepository pedidoRepository;

	private final GeneradorSecuencia generadorSecuencia;

	private Carrito carrito = nuevoCarrito();

	private Mesa mesaSeleccionada;

	public GestionPedidoService(ProductoRepository productoRepository, MesaRepository mesaRepository,
			PedidoRepository pedidoRepository, GeneradorSecuencia generadorSecuencia) {
		this.productoRepository = productoRepository;
		this.mesaRepository = mesaRepository;
		this.pedidoRepository = pedidoRepository;
		this.generadorSecuencia = generadorSecuencia;
	}

	public Carrito agregarProducto(Producto producto, int cantidad, List<OpcionSeleccionada> opciones) {
		if (producto == null || producto.getId() == null) {
			throw new IllegalArgumentException("El producto es obligatorio");
		}
		if (cantidad <= 0) {
			throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
		}
		Producto encontrado = productoRepository.findById(producto.getId())
				.orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + producto.getId()));
		if (!encontrado.estadoDisponible()) {
			throw new IllegalArgumentException("El producto no esta disponible");
		}
		List<OpcionProducto> seleccion = opciones == null ? List.of() : opciones.stream()
				.map(OpcionSeleccionada::getOpcion).toList();
		Variante variante = seleccion.stream().filter(Variante.class::isInstance)
				.map(Variante.class::cast).findFirst().orElse(null);
		List<Complemento> complementos = seleccion.stream().filter(Complemento.class::isInstance)
				.map(Complemento.class::cast).toList();
		List<OpcionSeleccionada> opcionesDelCatalogo = encontrado.resolverOpciones(variante, complementos).stream()
				.map(opcion -> {
					OpcionSeleccionada aplicada = new OpcionSeleccionada();
					aplicada.setOpcion(opcion);
					aplicada.setPrecioAplicado(opcion.getPrecioAdicional());
					return aplicada;
				}).toList();
		carrito.agregarProducto(encontrado, cantidad, opcionesDelCatalogo);
		carrito.getItems().stream()
				.filter(i -> i.getId() == null)
				.forEach(i -> i.setId(generadorSecuencia.siguiente("itemPedido")));
		return carrito;
	}

	public Carrito modificarCantidad(ItemPedido item, int cantidad) {
		if (cantidad <= 0) {
			throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
		}
		carrito.modificarCantidad(item, cantidad);
		return carrito;
	}

	public Carrito quitarItem(ItemPedido item) {
		carrito.quitarItem(item);
		return carrito;
	}

	public Mesa indicarMesa(Mesa mesa) {
		if (mesa == null || mesa.getNumero() == null) {
			throw new IllegalArgumentException("El numero de mesa es obligatorio");
		}
		Mesa encontrada = mesaRepository.findAll().stream()
				.filter(m -> mesa.getNumero().equals(m.getNumero()))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Mesa no registrada: " + mesa.getNumero()));
		if (!encontrada.estaHabilitada()) {
			throw new IllegalArgumentException("Mesa no habilitada: " + mesa.getNumero());
		}
		this.mesaSeleccionada = encontrada;
		return encontrada;
	}

	public Carrito verResumen(Carrito carrito) {
		Carrito actual = carrito == null ? this.carrito : carrito;
		actual.recalcularTotal();
		return actual;
	}

	public Pedido cancelarPedido(Pedido pedido) {
		if (pedido == null || pedido.getId() == null) {
			throw new IllegalArgumentException("El pedido es obligatorio");
		}
		Pedido encontrado = pedidoRepository.findById(pedido.getId())
				.orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado: " + pedido.getId()));
		if (!encontrado.puedeCancelarse()) {
			throw new IllegalArgumentException("El pedido ya no puede cancelarse");
		}
		encontrado.cancelar();
		return pedidoRepository.save(encontrado);
	}

	public Pedido confirmarPedido(Carrito carrito, Mesa mesa) {
		Carrito actual = carrito == null ? this.carrito : carrito;
		Mesa mesaFinal = mesa != null ? mesa : this.mesaSeleccionada;
		if (mesaFinal == null) {
			throw new IllegalArgumentException("Debe indicarse una mesa");
		}
		if (actual == null || actual.getItems() == null || actual.getItems().isEmpty()) {
			throw new IllegalArgumentException("El carrito esta vacio: agrega productos antes de pagar");
		}
		Pedido pedido = actual.confirmarPedido(mesaFinal);
		pedido.setId(generadorSecuencia.siguiente("pedido"));
		pedido.calcularTotal();
		Pedido guardado = pedidoRepository.save(pedido);
		this.carrito = nuevoCarrito();
		this.mesaSeleccionada = null;
		return guardado;
	}

	private Carrito nuevoCarrito() {
		Carrito nuevo = new Carrito();
		nuevo.setSesionId(UUID.randomUUID().toString());
		return nuevo;
	}
}
