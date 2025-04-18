import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DirectionsBus, History } from "@mui/icons-material";
import {
  agendaViajesApi,
  useGetAgendaViajeChoferQuery,
} from "../../store/services/agendaViajesApi";
import ViajeChofer from "./ViajeChofer";
import HistorialViajes from "../../components/viaje/HistorialViajes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../socket";
import { useDispatch } from "react-redux";

const PanelViajeChofer = () => {
  const usuario = useSelector((state) => state.auth.user);
  const [verHistorial, setVerHistorial] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: viaje,
    isLoading,
    error,
  } = useGetAgendaViajeChoferQuery(
    { id_chofer: usuario?.id },
    {
      skip: !usuario?.id,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const handleActualizarAgenda = () => {
      console.log("📡 Invalidando tag AgendaViajes desde WebSocket");
      dispatch(agendaViajesApi.util.invalidateTags(["AgendaViajes"]));
    };

    socket.on("actualizar_agenda_chofer", handleActualizarAgenda);

    return () => {
      socket.off("actualizar_agenda_chofer", handleActualizarAgenda);
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography mt={2}>Cargando agenda del día...</Typography>
      </Box>
    );
  }

  if (error || !viaje) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="start"
        flexDirection="column"
        minHeight="80vh"
        px={isMobile ? 2 : 6}
        pt={4}
        width="100%"
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 1000,
            mx: "auto",
            p: isMobile ? 3 : 5,
            borderRadius: 4,
            backgroundColor: "#fdfdfd",
            textAlign: "center",
          }}
        >
          <DirectionsBus color="disabled" sx={{ fontSize: 64, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            No tienes un viaje asignado
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Aún no se ha asignado un viaje para hoy. Puedes revisar tu historial
            mientras tanto o mantenerte atento a nuevas asignaciones.
          </Typography>
          <Button
            variant="contained"
            startIcon={<History />}
            onClick={() => setVerHistorial(true)}
          >
            Ver Historial de Viajes
          </Button>
        </Paper>

        <AnimatePresence>
          {verHistorial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              style={{ width: "100%", marginTop: "2rem" }}
            >
              <HistorialViajes usuario={usuario} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  }

  return <ViajeChofer viaje={viaje} />;
};

export default PanelViajeChofer;
