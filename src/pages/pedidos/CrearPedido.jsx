import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useCreatePedidoMutation } from "../../store/services/pedidosApi";
import { addItem, clearCart } from "../../store/reducers/cartSlice";
import { showNotification } from "../../store/reducers/notificacionSlice";

import PedidoForm from "../../components/pedido/PedidoForm";
import PedidoResumen from "../../components/pedido/PedidoResumen";
import PedidoProductos from "../../components/pedido/PedidoProductos";
import PedidoCategorias from "../../components/pedido/PedidoCategorias";
import PedidoCarrito from "../../components/pedido/PedidoCarrito";

const CrearPedido = () => {
  // Estados para los datos del pedido
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [metodoPago, setMetodoPago] = useState(null);
  const [notas, setNotas] = useState("");

  // Redux
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);

  // RTK Query para crear el pedido
  const [createPedido, { isLoading, error }] = useCreatePedidoMutation();

  // Categoría seleccionada (para filtrar productos)
  const [category, setCategory] = useState("all");

  // Si el cliente tiene dirección, se usa por defecto
  useEffect(() => {
    if (selectedCliente && selectedCliente.direccion) {
      setDireccionEntrega(selectedCliente.direccion);
    }
  }, [selectedCliente]);

  // Función para agregar producto al carrito (incluyendo el campo "tipo")
  const handleAddToCart = (product) => {
    dispatch(
      addItem({
        id_producto: product.id_producto,
        nombre: product.nombre_producto,
        precio_unitario: parseFloat(product.precio),
        cantidad: 1,
        tipo: product.tipo || "producto",
      })
    );
  };

  // Función para crear el pedido
  const handleCreatePedido = async () => {
    if (!selectedCliente) {
      dispatch(
        showNotification({
          message: "Selecciona un cliente antes de continuar.",
          severity: "warning",
        })
      );
      return;
    }

    const pedidoData = {
      id_cliente: selectedCliente.id_cliente,
      direccion_entrega: direccionEntrega,
      metodo_pago: metodoPago,
      productos: cart.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        tipo: item.tipo,
      })),
      notas,
    };

    try {
      await createPedido(pedidoData).unwrap();
      dispatch(clearCart());
      setSelectedCliente(null);
      setDireccionEntrega("");
      setMetodoPago(null);
      setNotas("");
      dispatch(
        showNotification({
          message: "Éxito al crear pedido",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("Error al crear el pedido:", err);
      dispatch(
        showNotification({
          message: `Error al crear pedido: ${err?.data?.message || err.message}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 4,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: 4,
        minHeight: "80vh",
      }}
    >
      {/* Fila 1: Formulario completo */}
      <Box>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
          Crear Pedido
        </Typography>
        <PedidoForm
          selectedCliente={selectedCliente}
          setSelectedCliente={setSelectedCliente}
          direccionEntrega={direccionEntrega}
          setDireccionEntrega={setDireccionEntrega}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          notas={notas}
          setNotas={setNotas}
        />
      </Box>

      {/* Fila 2: Selector de Categorías */}
      <Box>
        <PedidoCategorias onSelectCategory={setCategory} />
      </Box>

      {/* Fila 3: Dos columnas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 4,
        }}
      >
        {/* Columna Izquierda: Lista de Productos */}
        <PedidoProductos
          selectedCategory={category}
          onAddToCart={handleAddToCart}
        />

        {/* Columna Derecha: Carrito y Resumen */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Aquí no se aplica un contenedor con scroll, el propio PedidoCarrito se encargará de su contenido */}
          <PedidoCarrito />
          <PedidoResumen
            total={total}
            isLoading={isLoading}
            error={error}
            onSubmit={handleCreatePedido}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CrearPedido;
