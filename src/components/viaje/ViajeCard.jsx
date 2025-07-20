import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Box,
  Divider,
  Button,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";

const estadoColor = {
  Pendiente: "default",
  "En Tránsito": "info",
  Finalizado: "success",
  Cancelado: "error",
};
const CARD_HEIGHT = 250;

const ViajeCard = ({ viaje }) => {
  const { id_agenda_viaje, fecha_inicio, fecha_fin, estado, camion, chofer } =
    viaje;

  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ height: CARD_HEIGHT }}
    >
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 2px 16px 0 #e3e3ee55",
          transition: "box-shadow 0.25s",
          "&:hover": {
            boxShadow: "0 4px 32px 0 #b8b8e055",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
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
        <Box sx={{ px: 0, pb: 0 }}>
          <Button
            variant="contained"
            color="info"
            startIcon={<VisibilityIcon />}
            fullWidth
            onClick={() => navigate(`/admin/viajes/ver/${id_agenda_viaje}`)}
            sx={{
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              background: "linear-gradient(90deg, #4f8cfb 0%, #235fa7 100%)",
              fontWeight: 800,
              fontSize: "1.06rem",
              py: 1.2,
              letterSpacing: "0.5px",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(90deg, #235fa7 0%, #4f8cfb 100%)",
                boxShadow: "0 2px 8px 0 #4f8cfb33",
              },
            }}
          >
            Ver Viaje
          </Button>
        </Box>
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
