import { Box, Typography } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const SinAgendaAsignada = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{ mt: 10, px: 3 }}
    >
      <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 80, color: "#1976d2", mb: 2 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Aún no tienes un viaje asignado
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Cuando recibas una nueva carga, se activará automáticamente tu agenda de viaje.
      </Typography>
      <LocalShippingOutlinedIcon sx={{ fontSize: 48, color: "#9e9e9e" }} />
    </Box>
  );
};

export default SinAgendaAsignada;
