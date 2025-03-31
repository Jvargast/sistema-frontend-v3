import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { motion } from "framer-motion";

const estadoColor = {
  Pendiente: "default",
  "En Tránsito": "info",
  Finalizado: "success",
  Cancelado: "error",
};

const ViajeCard = ({ viaje }) => {
  const { id_agenda_viaje, fecha_inicio, fecha_fin, estado, camion, chofer } =
    viaje;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Grid container spacing={1} alignItems="center" mb={1}>
            <Grid item>
              <Chip
                label={estado}
                color={estadoColor[estado] || "default"}
                variant="filled"
                size="small"
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" color="text.secondary">
                ID: {id_agenda_viaje}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" mb={1}>
            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight="bold">
              {chofer?.nombre} {chofer?.apellido}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <DirectionsBusIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Camión: {camion?.placa} - Capacidad: {camion?.capacidad}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={0.5}>
            <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Inicio: {new Date(fecha_inicio).toLocaleString()}
            </Typography>
          </Box>

          {fecha_fin && (
            <Box display="flex" alignItems="center">
              <CalendarMonthIcon fontSize="small" sx={{ mr: 1, opacity: 0 }} />
              <Typography variant="body2" color="text.secondary">
                Fin: {new Date(fecha_fin).toLocaleString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

ViajeCard.propTypes = {
  viaje: PropTypes.shape({
    id_agenda_viaje: PropTypes.number.isRequired,
    fecha_inicio: PropTypes.string.isRequired,
    fecha_fin: PropTypes.string,
    estado: PropTypes.string.isRequired,
    camion: PropTypes.shape({
      placa: PropTypes.string,
      capacidad: PropTypes.number,
    }),
    chofer: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string,
    }),
  }).isRequired,
};

export default ViajeCard;
