import {
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import PedidoListaProductos from "./PedidoListaProductos";
import PropTypes from "prop-types";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

const PedidoCard = ({
  pedido,
  confirmado = false,
  isConfirming,
  onConfirmar,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4} display="flex">
      <Paper
        elevation={4}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          minHeight: 350,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: confirmado ? "lightgray" : "white",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: 10, transform: "translateY(-5px)" },
        }}
      >
        {/* Estado del pedido */}
        <Box mb={2} display="flex" justifyContent="center">
          <Chip label={pedido.EstadoPedido.nombre_estado} color="warning" />
        </Box>

        {/* Información del pedido */}
        <Typography variant="h6" fontWeight="bold">
          Pedido #{pedido.id_pedido}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📍 <strong>{pedido.direccion_entrega}</strong>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" fontWeight="bold" color="primary">
          Total: {formatCLP(pedido.total)}
        </Typography>
        <Typography variant="body2" color={pedido.pagado ? "green" : "red"}>
          Pago: {pedido.estado_pago}
        </Typography>

        {/* Lista de productos */}
        <PedidoListaProductos
          productos={pedido.DetallesPedido.map((detalle) => ({
            ...detalle,
            subtotal: Number(detalle.subtotal), // 🔹 Convertir subtotal a número
          }))}
        />

        <Divider sx={{ my: 2 }} />

        {/* Botón de confirmación */}
        {confirmado ? (
          <Typography
            mt={2}
            color="green"
            fontWeight="bold"
            disabled
            sx={{ cursor: "default" }}
          >
            ✅ Pedido Confirmado
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2, fontSize: "1rem", py: 1.2, borderRadius: 2 }}
            onClick={() => onConfirmar(pedido.id_pedido)}
            disabled={isConfirming}
          >
            {isConfirming ? "Confirmando..." : "✔ Confirmar Pedido"}
          </Button>
        )}
      </Paper>
    </Grid>
  );
};

PedidoCard.propTypes = {
  pedido: PropTypes.object.isRequired,
  confirmado: PropTypes.bool, // Ahora no es requerido
  isConfirming: PropTypes.bool.isRequired,
  onConfirmar: PropTypes.func.isRequired,
};

export default PedidoCard;
