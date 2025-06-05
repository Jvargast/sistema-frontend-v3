import { Paper, Typography, Divider, Box, Chip, useTheme } from "@mui/material";
import {
  Person,
  Event,
  LocalShipping,
  Payments,
  LocationOn,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { formatCLP } from "../../utils/formatUtils";

const InfoPedido = ({ pedido }) => {
  const theme = useTheme();
  const estado = pedido.EstadoPedido?.nombre_estado || "Desconocido";
  const colorEstado =
    estado === "Pendiente"
      ? "warning"
      : estado === "Cancelado"
      ? "error"
      : estado === "En Entrega"
      ? "info"
      : "success";

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        transition: "background 0.2s",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color={theme.palette.primary.main}
        gutterBottom
        sx={{ mb: 1.5 }}
      >
        📋 Información del Pedido
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Person sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body1">
            <strong>Cliente:</strong> {pedido.Cliente?.nombre || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Event sx={{ color: theme.palette.info.main }} />
          <Typography variant="body1">
            <strong>Fecha del Pedido:</strong>{" "}
            {dayjs(pedido.fecha_pedido).format("DD/MM/YYYY HH:mm")}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <LocalShipping sx={{ color: theme.palette.secondary.main }} />
          <Typography variant="body1">
            <strong>Chofer:</strong> {pedido.Chofer?.nombre || "Sin asignar"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Payments sx={{ color: theme.palette.success.main }} />
          <Typography variant="body1">
            <strong>Método Pago:</strong> {pedido.MetodoPago?.nombre || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <LocationOn sx={{ color: theme.palette.error.main }} />
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            <strong>Dirección Entrega:</strong>{" "}
            {pedido.direccion_entrega || "N/A"}
          </Typography>
        </Box>
        <Box>
          <Chip
            label={estado}
            color={colorEstado}
            sx={{
              fontWeight: "bold",
              px: 2,
              fontSize: "1rem",
              textTransform: "capitalize",
            }}
          />
        </Box>
        <Typography
          fontWeight="bold"
          variant="h6"
          color={theme.palette.primary.dark}
          textAlign="right"
          sx={{
            mt: 2,
            letterSpacing: 0.3,
          }}
        >
          Total: {formatCLP(pedido.total)}
        </Typography>
      </Box>
    </Paper>
  );
};

InfoPedido.propTypes = {
  pedido: PropTypes.object.isRequired,
};

export default InfoPedido;
