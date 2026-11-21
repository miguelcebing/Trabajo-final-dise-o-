package com.restsmart.negocio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.restsmart.datos.secuencia.GeneradorSecuencia;
import com.restsmart.datos.repository.MesaRepository;
import com.restsmart.datos.repository.PedidoRepository;
import com.restsmart.datos.repository.ProductoRepository;
import com.restsmart.modelo.dominio.Carrito;
import com.restsmart.modelo.dominio.ItemPedido;
import com.restsmart.modelo.dominio.Mesa;
import com.restsmart.modelo.dominio.OpcionSeleccionada;
import com.restsmart.modelo.dominio.Pedido;
import com.restsmart.modelo.dominio.Producto;

@Service
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
		carrito.agregarProducto(encontrado, cantidad, opciones);
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
		nuevo.setSesionId("kiosco");
		return nuevo;
	}
}
