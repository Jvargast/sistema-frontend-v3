import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Modal,
  Paper,
} from "@mui/material";
import {
  CalendarMonth,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import {
  useConfirmarPedidoMutation,
  useGetMisPedidosQuery,
} from "../../store/services/pedidosApi";
import PedidoCard from "../../components/pedido/PedidoCard";
import HistorialPedidos from "../../components/pedido/HistorialPedidos";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const MisPedidos = () => {
  const dispatch = useDispatch();
  // 🔹 Función para formatear la fecha manualmente en YYYY-MM-DD sin UTC
  const formatFecha = (date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  // 🔹 Definir hoy y ayer en un solo estado
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Estado inicial en hoy
  const [fechaSeleccionada, setFechaSeleccionada] = useState(today);

  const fechaHoy = formatFecha(today);
  const fechaAyer = formatFecha(yesterday);

  const {
    data: pedidos,
    isLoading,
    isError,
  } = useGetMisPedidosQuery({
    page: 1,
    limit: 10,
    fecha: formatFecha(fechaSeleccionada), 
  });

  console.log(pedidos)
  console.log(fechaHoy)

  const [confirmarPedido, { isLoading: isConfirming }] =
    useConfirmarPedidoMutation();
  const [confirmado, setConfirmado] = useState({});
  const [openHistorial, setOpenHistorial] = useState(false);

  const cambiarFecha = (dias) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    if (
      formatFecha(nuevaFecha) < fechaAyer ||
      formatFecha(nuevaFecha) > fechaHoy
    )
      return;

    setFechaSeleccionada(nuevaFecha); 
  };

  const handleConfirmar = async (idPedido) => {
    try {
      await confirmarPedido({ id_pedido: idPedido }).unwrap();
      dispatch(
        showNotification({
          message: "Se ha confirmado el pedido con éxito",
          severity: "success",
        })
      );
      setConfirmado((prev) => ({ ...prev, [idPedido]: true }));
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      dispatch(
        showNotification({
          message: `Error al confirmar pedido: ${error.data.error}`,
          severity: "error",
        })
      );
    }
  };

  // 🔹 Filtrar pedidos "Pendiente de Confirmación"
  const pedidosPendientes =
    pedidos?.data?.filter(
      (pedido) =>
        pedido?.EstadoPedido?.nombre_estado === "Pendiente de Confirmación"
    ) || [];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Alert severity="error">Error al cargar los pedidos.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        📦 Pedidos Pendientes de Confirmación
      </Typography>

      {/* 🔹 Selector de fecha (Solo Hoy / Ayer) */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIos />}
          onClick={() => cambiarFecha(-1)}
          disabled={formatFecha(fechaSeleccionada) === fechaAyer} // Bloquea si ya es ayer
        >
          Ayer
        </Button>
        <Typography variant="h6" sx={{ mx: 2, fontWeight: "bold" }}>
          {fechaSeleccionada.toLocaleDateString()}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<ArrowForwardIos />}
          onClick={() => cambiarFecha(1)}
          disabled={formatFecha(fechaSeleccionada) === fechaHoy} // Bloquea si ya es hoy
        >
          Mañana
        </Button>
      </Box>

      {/* 🔹 Botón para abrir el historial */}
      <Box textAlign="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalendarMonth />}
          onClick={() => setOpenHistorial(true)}
        >
          Ver Historial de Pedidos
        </Button>
      </Box>

      {/* 🔹 Listado de pedidos */}
      <Grid container spacing={2} justifyContent="center">
        {pedidosPendientes.length > 0 ? (
          pedidosPendientes.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              confirmado={confirmado[pedido.id_pedido] ?? false} // Valor por defecto
              isConfirming={isConfirming}
              onConfirmar={handleConfirmar}
            />
          ))
        ) : (
          <Typography variant="h6" textAlign="center" color="gray">
            No tienes pedidos pendientes de confirmación en esta fecha.
          </Typography>
        )}
      </Grid>

      {/* 🔹 Modal del historial de pedidos */}
      <Modal open={openHistorial} onClose={() => setOpenHistorial(false)}>
        <Paper
          sx={{
            width: "90%",
            maxWidth: 700,
            p: 3,
            mx: "auto",
            mt: 5,
            borderRadius: 2,
          }}
        >
          <HistorialPedidos
            onClose={() => setOpenHistorial(false)}
            pedidos={pedidos?.data || []}
          />
        </Paper>
      </Modal>
    </Box>
  );
};

export default MisPedidos;
