import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { useGetHistorialViajesQuery } from "../../store/services/agendaViajesApi";
import TarjetaViaje from "./TarjetaViaje";

const HistorialViajes = ({ usuario }) => {
  const { data, isLoading } = useGetHistorialViajesQuery({
    id_chofer: usuario?.id,
  });

  const viajes = data?.data || [];

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (viajes.length === 0) {
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        No hay viajes anteriores registrados.
      </Typography>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        🗂 Historial de Viajes
      </Typography>

      <Grid container spacing={3}>
        {viajes.map((viaje) => (
          <TarjetaViaje key={viaje.id_agenda_viaje} viaje={viaje} />
        ))}
      </Grid>
    </Box>
  );
};

HistorialViajes.propTypes = {
  usuario: PropTypes.object.isRequired,
};

export default HistorialViajes;
