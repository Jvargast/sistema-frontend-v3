import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router";
import { useIsMobile } from "../../utils/useIsMobile";

const TarjetaViaje = ({ viaje }) => {
  const fechaInicio = viaje.fecha_inicio ? new Date(viaje.fecha_inicio) : null;
  const fechaFin = viaje.fecha_fin ? new Date(viaje.fecha_fin) : null;

  const fechaInicioFormatted =
    fechaInicio && !isNaN(fechaInicio)
      ? format(fechaInicio, "PPPp", { locale: es })
      : "No disponible";

  const fechaFinFormatted =
    fechaFin && !isNaN(fechaFin)
      ? format(fechaFin, "PPPp", { locale: es })
      : "No finalizado";

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          transition: "0.3s",
          "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Viaje #{viaje.id_agenda_viaje}
            </Typography>
            <Chip
              label={viaje.estado}
              size="small"
              color={
                viaje.estado === "Finalizado"
                  ? "success"
                  : viaje.estado === "En Tránsito"
                  ? "primary"
                  : "warning"
              }
              sx={{ fontWeight: "bold" }}
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" mb={0.5}>
            <strong>Inicio:</strong> {fechaInicioFormatted}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={0.5}>
            <strong>Fin:</strong> {fechaFinFormatted}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={0.5}>
            <strong>Camión:</strong> {viaje.camion?.placa || "No informado"}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={0.5}>
            <strong>Destinos:</strong> {viaje.destinos?.length || 0}
          </Typography>

          {viaje.notas && (
            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
              sx={{
                fontStyle: "italic",
                p: 1,
                borderRadius: 1,
              }}
            >
              Nota: {viaje.notas}
            </Typography>
          )}

          <Box sx={{ mt: 2, flexGrow: 1, display: "flex", alignItems: "end" }}>
            <Button
              variant="contained"
              fullWidth={isMobile}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(81,74,157,0.07)",
                background: "linear-gradient(90deg, #1976d2 0%, #00c6fb 100%)",
                color: "#fff",
                py: 1.2,
                fontSize: "1rem",
                transition: "background 0.3s",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #115293 0%, #00a0d7 100%)",
                },
              }}
              onClick={() => navigate(`/viajes/ver/${viaje.id_agenda_viaje}`)}
            >
              Ver Viaje
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

TarjetaViaje.propTypes = {
  viaje: PropTypes.object.isRequired,
};

export default TarjetaViaje;
