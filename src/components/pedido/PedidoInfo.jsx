import { Paper, Typography, Divider, Box, Chip } from "@mui/material";
import { Person, Event, LocalShipping, Payments, LocationOn } from "@mui/icons-material";
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Función reutilizable para formatear moneda CLP
const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);

const InfoPedido = ({ pedido }) => (
  <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: "#f9fafb" }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      📋 Información del Pedido
    </Typography>

    <Divider sx={{ mb: 2 }} />

    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Person color="primary" />
        <Typography>
          <strong>Cliente:</strong> {pedido.Cliente?.nombre || "N/A"}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Event color="info" />
        <Typography>
          <strong>Fecha del Pedido:</strong> {dayjs(pedido.fecha_pedido).format("DD/MM/YYYY HH:mm")}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <LocalShipping color="secondary" />
        <Typography>
          <strong>Chofer:</strong> {pedido.Chofer?.nombre || "Sin asignar"}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Payments color="success" />
        <Typography>
          <strong>Método Pago:</strong> {pedido.MetodoPago?.nombre || "N/A"}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <LocationOn color="error" />
        <Typography>
          <strong>Dirección Entrega:</strong> {pedido.direccion_entrega || "N/A"}
        </Typography>
      </Box>

      <Chip
        label={pedido.EstadoPedido?.nombre_estado || "Desconocido"}
        color={pedido.EstadoPedido?.nombre_estado === "Pendiente" ? "warning" : "success"}
        sx={{ alignSelf: "start", fontWeight: "bold" }}
      />

      <Typography fontWeight="bold" variant="h6" color="primary" textAlign="right">
        Total: {formatoCLP(pedido.total)}
      </Typography>
    </Box>
  </Paper>
);

InfoPedido.propTypes = {
  pedido: PropTypes.object.isRequired,
};

export default InfoPedido;
