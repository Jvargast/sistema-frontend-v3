import { Paper, Divider, Chip, useTheme } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { formatCLP } from "../../utils/formatUtils";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const InfoPedido = ({ pedido }) => {
  const theme = useTheme();
  const estado = pedido.EstadoPedido?.nombre_estado || "Desconocido";
  const colorEstado =
    estado === "Pendiente"
      ? "warning"
      : estado === "Pendiente de Confirmación"
      ? "info"
      : estado === "Confirmado"
      ? "primary"
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
        {pedido.Cliente ? (
          <Box
            display="flex"
            flexDirection="column"
            gap={0.3}
            sx={{ mb: 1, pl: 0 }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <PersonIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body1" fontWeight="bold" whiteSpace="nowrap">
                Cliente:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="normal"
                sx={{ flexShrink: 1 }}
              >
                {pedido.Cliente.razon_social || pedido.Cliente.nombre || "N/A"}
              </Typography>
            </Box>

            {pedido.Cliente.tipo_cliente && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", ml: 5, mt: 0.2 }}
              >
                {pedido.Cliente.tipo_cliente}
              </Typography>
            )}

            {pedido.Cliente.rut && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
                RUT: {pedido.Cliente.rut}
              </Typography>
            )}

            {pedido.Cliente.direccion && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 5, wordBreak: "break-word" }}
              >
                Dirección: {pedido.Cliente.direccion}
              </Typography>
            )}

            {pedido.Cliente.email && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
                Email: {pedido.Cliente.email}
              </Typography>
            )}
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1.5}>
            <PersonIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="body1">Cliente: N/A</Typography>
          </Box>
        )}

        <Box display="flex" alignItems="center" gap={1.5}>
          <EventIcon sx={{ color: theme.palette.info.main }} />
          <Typography variant="body1">
            <strong>Fecha del Pedido:</strong>{" "}
            {dayjs(pedido.fecha_pedido).format("DD/MM/YYYY HH:mm")}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <LocalShippingIcon sx={{ color: theme.palette.secondary.main }} />
          <Typography variant="body1">
            <strong>Chofer:</strong> {pedido.Chofer?.nombre || "Sin asignar"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <PaymentsIcon sx={{ color: theme.palette.success.main }} />
          <Typography variant="body1">
            <strong>Método Pago:</strong> {pedido.MetodoPago?.nombre || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <LocationOnIcon sx={{ color: theme.palette.error.main }} />
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
