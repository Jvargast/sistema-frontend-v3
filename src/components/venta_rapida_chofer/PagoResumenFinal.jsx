import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";

const PasoResumenFinal = ({
  cliente,
  productos,
  total,
  metodoPago,
  montoRecibido,
  onConfirmar,
  loading,
}) => {
  const metodosDePago = {
    1: "Efectivo",
    2: "Transferencia",
    3: "Tarjeta Débito",
    4: "Tarjeta Crédito",
  };

  const vuelto = metodoPago === 1 && montoRecibido ? montoRecibido - total : 0;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🧾 Resumen de la Venta
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Cliente
        </Typography>
        <Typography variant="body1">
          {cliente?.nombre || "No especificado"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" color="text.secondary">
        Productos seleccionados
      </Typography>
      <List dense>
        {productos.map((prod, idx) => (
          <ListItem key={idx} disableGutters>
            <ListItemText
              primary={`${prod.nombre_producto} x${prod.cantidad}`}
              secondary={`$${prod.precioUnitario.toLocaleString("es-CL")} c/u`}
            />
            <Typography variant="body2" fontWeight={600}>
              ${(prod.precioUnitario * prod.cantidad).toLocaleString("es-CL")}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body1">Método de Pago:</Typography>
        <Chip label={metodosDePago[metodoPago] || "Desconocido"} />
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body1">Total:</Typography>
        <Typography fontWeight="bold">
          ${total.toLocaleString("es-CL")}
        </Typography>
      </Stack>

      {metodoPago === 1 && (
        <>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body1">Monto recibido:</Typography>
            <Typography>${montoRecibido.toLocaleString("es-CL")}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body1">Vuelto:</Typography>
            <Typography
              fontWeight="bold"
              color={vuelto < 0 ? "error.main" : "success.main"}
            >
              ${vuelto.toLocaleString("es-CL")}
            </Typography>
          </Stack>
        </>
      )}

      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={onConfirmar}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Confirmar Venta"}
        </Button>
      </Box>
    </Box>
  );
};

PasoResumenFinal.propTypes = {
  cliente: PropTypes.object,
  productos: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  metodoPago: PropTypes.number.isRequired,
  montoRecibido: PropTypes.number.isRequired,
  onConfirmar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PasoResumenFinal;
