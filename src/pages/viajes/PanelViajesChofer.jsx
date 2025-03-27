import { useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetAgendaViajeChoferQuery } from "../../store/services/agendaViajesApi";
import ViajeChofer from "./ViajeChofer";
import HistorialViajes from "../../components/viaje/HistorialViajes";

const PanelViajeChofer = () => {
  const usuario = useSelector((state) => state.auth.user);
  const {
    data: viaje,
    isLoading,
    error,
  } = useGetAgendaViajeChoferQuery({ id_chofer: usuario?.id });

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Cargando agenda del día...</Typography>
      </Box>
    );
  }

  if (error || !viaje) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          No tienes un viaje asignado por el momento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Puedes revisar tus viajes anteriores y estar atento a nuevas
          asignaciones.
        </Typography>
        <HistorialViajes usuario={usuario}/>
      </Box>
    );
  }

  return <ViajeChofer viaje={viaje} />;
};

export default PanelViajeChofer;
