import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";

const metodosDePago = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Transferencia" },
  { id: 3, nombre: "Tarjeta Débito" },
  { id: 4, nombre: "Tarjeta Crédito" },
];

const PasoPago = ({
  metodoPago,
  setMetodoPago,
  montoRecibido,
  setMontoRecibido,
  total,
}) => {
  const esEfectivo = metodoPago === 1;
  const vuelto = esEfectivo && montoRecibido ? montoRecibido - total : 0;
  const esMontoInsuficiente = esEfectivo && montoRecibido < total;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Método de Pago
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Método</InputLabel>
        <Select
          value={metodoPago || ""}
          label="Método"
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          {metodosDePago.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Total a pagar"
        value={`$${total.toLocaleString("es-CL")}`}
        fullWidth
        disabled
        sx={{ mb: 2 }}
      />

      {esEfectivo && (
        <>
          <TextField
            label="Monto recibido"
            type="number"
            value={montoRecibido}
            onChange={(e) => setMontoRecibido(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />

          {montoRecibido > 0 && (
            <Alert
              severity={esMontoInsuficiente ? "error" : "info"}
              sx={{ mt: -1, mb: 2 }}
            >
              {esMontoInsuficiente
                ? `Monto insuficiente, faltan $${(
                    total - montoRecibido
                  ).toLocaleString("es-CL")}`
                : `Vuelto: $${vuelto.toLocaleString("es-CL")}`}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

PasoPago.propTypes = {
  metodoPago: PropTypes.number,
  setMetodoPago: PropTypes.func.isRequired,
  montoRecibido: PropTypes.number.isRequired,
  setMontoRecibido: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default PasoPago;
