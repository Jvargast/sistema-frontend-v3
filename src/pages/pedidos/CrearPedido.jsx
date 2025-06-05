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
import { useGetCajaAsignadaQuery } from "../../store/services/cajaApi";
import NoCajaAsignadaDialog from "../../components/chofer/NoCajaAsignadaMessage";

const CrearPedido = () => {
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("boleta");
  const [openNoCajaModal, setOpenNoCajaModal] = useState(false);

  const [metodoPago, setMetodoPago] = useState(null);
  const [notas, setNotas] = useState("");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const auth = useSelector((state) => state.auth.user);

  const { data: cajaAsignada, isLoading: loadingCaja } =
    useGetCajaAsignadaQuery({ rutUsuario: auth.id }, { skip: !auth.id });

  const [createPedido, { isLoading, error }] = useCreatePedidoMutation();

  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (!loadingCaja && cajaAsignada?.asignada === false) {
      setOpenNoCajaModal(true);
    } else {
      setOpenNoCajaModal(false);
    }
  }, [loadingCaja, cajaAsignada]);

  useEffect(() => {
    if (selectedCliente && selectedCliente.direccion) {
      setDireccionEntrega(selectedCliente.direccion);
    }
  }, [selectedCliente]);

  const handleAddToCart = (product) => {
    const isInsumo = product.tipo === "insumo";
    const idInsumo = isInsumo
      ? parseInt(
          typeof product.id_producto === "string"
            ? product.id_producto.replace("insumo_", "")
            : product.id_producto
        )
      : undefined;
    dispatch(
      addItem({
        id_producto: product.id_producto,
        nombre: product.nombre_producto,
        precio_unitario: parseFloat(product.precio),
        cantidad: 1,
        tipo: product.tipo || "producto",
        ...(isInsumo && { id_insumo: idInsumo }),
      })
    );
  };

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

    if (tipoDocumento === "factura") {
      if (!selectedCliente?.razon_social || !selectedCliente?.rut) {
        dispatch(
          showNotification({
            message:
              "El cliente no tiene RUT o razón social. No se puede emitir factura.",
            severity: "error",
          })
        );
        return;
      }
    }

    const pedidoData = {
      id_cliente: selectedCliente.id_cliente,
      direccion_entrega: direccionEntrega,
      metodo_pago: metodoPago,
      productos: cart.map((item) => ({
        cantidad: item.cantidad,
        tipo: item.tipo,
        precio_unitario: item.precio_unitario,
        ...(item.tipo === "insumo"
          ? { id_insumo: item.id_insumo }
          : { id_producto: item.id_producto }),
      })),
      notas,
      tipo_documento: tipoDocumento,
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
          message: `Error al crear pedido: ${
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
        borderRadius: 2,
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: 4,
        minHeight: "80vh",
      }}
    >
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
          mostrarMetodoPago={tipoDocumento !== "factura"}
          tipoDocumento={tipoDocumento}
          setTipoDocumento={setTipoDocumento}
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
        <PedidoProductos
          selectedCategory={category}
          onAddToCart={handleAddToCart}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <PedidoCarrito />
          <PedidoResumen
            total={total}
            isLoading={isLoading}
            error={error}
            onSubmit={handleCreatePedido}
            submitLabel="Generar Pedido"
          />
        </Box>
      </Box>
      <NoCajaAsignadaDialog
        open={openNoCajaModal}
        handleClose={() => setOpenNoCajaModal(false)}
        choferName={auth.nombre}
      />
    </Box>
  );
};

export default CrearPedido;
