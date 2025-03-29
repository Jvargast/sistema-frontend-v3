import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useCreateCotizacionMutation } from "../../store/services/cotizacionesApi";
import { addItem, clearCart } from "../../store/reducers/cartSlice";
import { showNotification } from "../../store/reducers/notificacionSlice";
import PedidoForm from "../../components/pedido/PedidoForm";
import PedidoCategorias from "../../components/pedido/PedidoCategorias";
import PedidoProductos from "../../components/pedido/PedidoProductos";
import PedidoCarrito from "../../components/pedido/PedidoCarrito";
import PedidoResumen from "../../components/pedido/PedidoResumen";


const CrearCotizacion = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");

  const [createCotizacion, { isLoading, error }] =
    useCreateCotizacionMutation();

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

  const handleCreateCotizacion = async () => {
    if (!selectedCliente || cart.length === 0 || !fechaVencimiento) {
      dispatch(
        showNotification({
          message:
            "Cliente, productos y fecha de vencimiento son obligatorios.",
          severity: "warning",
        })
      );
      return;
    }

    const cotizacionData = {
      id_cliente: selectedCliente.id_cliente,
      fecha_vencimiento: fechaVencimiento,
      productos: cart.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        descuento_porcentaje: 0,
      })),
      notas,
      impuesto: 0.19, // podrías dejarlo fijo o permitir configurarlo
      descuento_total_porcentaje: 0,
    };

    try {
      await createCotizacion(cotizacionData).unwrap();
      dispatch(clearCart());
      dispatch(
        showNotification({
          message: "Cotización creada con éxito",
          severity: "success",
        })
      );
    } catch (err) {
      dispatch(
        showNotification({
          message: `Error al crear cotización: ${
            err?.data?.message || err.message
          }`,
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
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: 4,
        minHeight: "80vh",
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
          Crear Cotización
        </Typography>

        <PedidoForm
          selectedCliente={selectedCliente}
          setSelectedCliente={setSelectedCliente}
          direccionEntrega={null}
          setDireccionEntrega={() => {}}
          metodoPago={null}
          setMetodoPago={() => {}}
          notas={notas}
          setNotas={setNotas}
          extraFields={
            <>
              {/* Campo fecha vencimiento */}
              <label style={{ fontWeight: "bold", marginTop: "1rem" }}>
                Fecha de vencimiento:
              </label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                style={{ display: "block", marginTop: 8, marginBottom: 16 }}
              />
            </>
          }
        />
      </Box>

      <Box>
        <PedidoCategorias onSelectCategory={setCategoriaSeleccionada} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 4,
        }}
      >
        <PedidoProductos
          selectedCategory={categoriaSeleccionada}
          onAddToCart={handleAddToCart}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <PedidoCarrito />
          <PedidoResumen
            total={total}
            isLoading={isLoading}
            error={error}
            onSubmit={handleCreateCotizacion}
            submitLabel="Generar Cotización"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CrearCotizacion;
