import {
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PropTypes from "prop-types";

const InfoGeneral = ({ viaje }) => {
  const fechaFormateada = new Date(viaje.fecha_inicio).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "En Tránsito":
        return "primary";
      case "Finalizado":
        return "success";
      case "Pendiente":
      default:
        return "default";
    }
  };
  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Stack spacing={1.2}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Agenda de Viaje
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1" fontWeight={500}>
                  Estado:
                </Typography>
                <Chip
                  label={viaje.estado}
                  color={getEstadoColor(viaje.estado)}
                  variant="filled"
                  size="small"
                />
              </Box>
              <Box display="flex" gap={1}>
                <Typography variant="body2" fontWeight={500}>
                  Camión asignado:
                </Typography>
                <Typography variant="body2">{viaje.id_camion}</Typography>
              </Box>

              <Box display="flex" gap={1}>
                <Typography variant="body2" fontWeight={500}>
                  Fecha de inicio:
                </Typography>
                <Typography variant="body2">{fechaFormateada}</Typography>
              </Box>

              {viaje.notas && (
                <Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontWeight={500}>
                    Notas adicionales:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viaje.notas}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Icono decorativo */}
          <Grid item xs={12} sm={3} textAlign="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: "auto",
                backgroundColor: "primary.light",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
InfoGeneral.propTypes = {
  viaje: PropTypes.shape({
    estado: PropTypes.string.isRequired,
    id_camion: PropTypes.number.isRequired,
    fecha_inicio: PropTypes.string.isRequired,
    notas: PropTypes.string,
  }).isRequired,
};

export default InfoGeneral;
