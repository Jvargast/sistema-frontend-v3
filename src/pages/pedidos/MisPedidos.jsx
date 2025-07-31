import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Modal,
  Paper,
  Fade,
  IconButton,
  Backdrop,
} from "@mui/material";
import { useRef } from "react";
import {
  CalendarMonth,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import {
  useConfirmarPedidoMutation,
  useRejectPedidoMutation,
  useGetMisPedidosQuery,
} from "../../store/services/pedidosApi";
import PedidoCard from "../../components/pedido/PedidoCard";
import HistorialPedidos from "../../components/pedido/HistorialPedidos";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { onRefetchMisPedidos } from "../../utils/eventBus";

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

  const [fechaSeleccionada, setFechaSeleccionada] = useState(today);

  const fechaHoy = formatFecha(today);
  const fechaAyer = formatFecha(yesterday);

  const isMounted = useRef(false);
  const isQueryReady = useRef(false);
  const refetchRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const {
    data: pedidos,
    refetch,
    isLoading,
    isError,
  } = useGetMisPedidosQuery(
    {
      page: 1,
      limit: 10,
      fecha: formatFecha(fechaSeleccionada),
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (refetch) {
      refetchRef.current = refetch;
      isQueryReady.current = true;
    }
  }, [refetch]);

  useEffect(() => {
    const unsubscribe = onRefetchMisPedidos(() => {
      console.log("🔄 Refetch ejecutado en MisPedidos.jsx");

      if (typeof refetch === "function") {
        refetch();
      } else {
        console.warn("⛔ refetch no está disponible.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const [confirmarPedido, { isLoading: isConfirming }] =
    useConfirmarPedidoMutation();
  const [confirmado, setConfirmado] = useState({});
  const [openHistorial, setOpenHistorial] = useState(false);

  const [rejectPedido, { isLoading: isRejecting }] = useRejectPedidoMutation();

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

  const handleRechazar = async (idPedido) => {
    try {
      await rejectPedido(idPedido).unwrap();
      dispatch(
        showNotification({
          message: "El pedido fue rechazado y devuelto a estado 'Pendiente'.",
          severity: "info",
        })
      );
      setConfirmado((prev) => ({ ...prev, [idPedido]: false }));
      refetch();
    } catch (error) {
      console.error("Error al rechazar pedido:", error);
      dispatch(
        showNotification({
          message: `Error al rechazar pedido: ${
            error.data?.error || error.message
          }`,
          severity: "error",
        })
      );
    }
  };

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

      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIos />}
          onClick={() => cambiarFecha(-1)}
          disabled={formatFecha(fechaSeleccionada) === fechaAyer}
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
          disabled={formatFecha(fechaSeleccionada) === fechaHoy}
        >
          Mañana
        </Button>
      </Box>

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

      <Grid container spacing={2} justifyContent="center">
        {pedidosPendientes.length > 0 ? (
          pedidosPendientes.map((pedido) => (
            <PedidoCard
              key={pedido.id_pedido}
              pedido={pedido}
              confirmado={confirmado[pedido.id_pedido] ?? false}
              isConfirming={isConfirming || isRejecting}
              onConfirmar={handleConfirmar}
              onRechazar={handleRechazar}
            />
          ))
        ) : (
          <Typography variant="h6" textAlign="center" color="gray">
            No tienes pedidos pendientes de confirmación en esta fecha.
          </Typography>
        )}
      </Grid>

      <Modal
        open={openHistorial}
        onClose={() => setOpenHistorial(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Fade in={openHistorial}>
          <Box
            sx={{
              width: "92%",
              maxWidth: 720,
              mx: "auto",
              mt: { xs: 4, sm: 7 },
              borderRadius: 4,
              outline: "none",
            }}
          >
            <Paper
              elevation={8}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                maxWidth: 740,
                maxHeight: "85vh",
                overflowY: "auto",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.background.default
                    : "#F8FAFC",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2.5,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  📅 Historial de Pedidos
                </Typography>
                <IconButton
                  onClick={() => setOpenHistorial(false)}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "error.main", bgcolor: "transparent" },
                  }}
                >
                  <CloseIcon fontSize="medium" />
                </IconButton>
              </Box>
              <HistorialPedidos
                onClose={() => setOpenHistorial(false)}
                pedidos={pedidos?.data || []}
              />
            </Paper>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MisPedidos;
