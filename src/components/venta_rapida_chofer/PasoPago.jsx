import Select from "../common/CompatSelect";
import { FormControl, InputLabel, MenuItem, Alert } from "@mui/material";
import PropTypes from "prop-types";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const metodosDePago = [
{ id: 1, nombre: "Efectivo" },
{ id: 2, nombre: "Transferencia" },
{ id: 3, nombre: "Tarjeta Débito" },
{ id: 4, nombre: "Tarjeta Crédito" }];


const PasoPago = ({
  metodoPago,
  setMetodoPago,
  montoRecibido,
  setMontoRecibido,
  total
}) => {
  const esEfectivo = metodoPago === 1;
  const montoRecibidoSeguro = Math.max(0, Number(montoRecibido) || 0);
  const vuelto = esEfectivo ? montoRecibidoSeguro - total : 0;
  const esMontoInsuficiente = esEfectivo && montoRecibidoSeguro < total;

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
          onChange={(e) => setMetodoPago(Number(e.target.value))}>

          {metodosDePago.map((m) =>
          <MenuItem key={m.id} value={m.id}>
              {m.nombre}
            </MenuItem>
          )}
        </Select>
      </FormControl>

      <TextField
        label="Total a pagar"
        value={`$${total.toLocaleString("es-CL")}`}
        fullWidth
        disabled
        sx={{ mb: 2 }} />


      {esEfectivo &&
      <>
          <TextField
          label="Monto recibido"
          type="number"
          value={montoRecibido}
          onChange={(e) =>
          setMontoRecibido(Math.max(0, Number(e.target.value) || 0))
          }
          inputProps={{ min: 0 }}
          fullWidth
          sx={{ mb: 2 }} />


          {esMontoInsuficiente &&
        <Alert
          severity="error"
          sx={{ mt: -1, mb: 2 }}>

              {montoRecibidoSeguro > 0 ?
          `Monto insuficiente, faltan $${(
          total - montoRecibidoSeguro).
          toLocaleString("es-CL")}` :
          `Ingresa al menos $${total.toLocaleString("es-CL")} para continuar`}
            </Alert>
        }

          {!esMontoInsuficiente &&
        <Alert
          severity="success"
          sx={{ mt: -1, mb: 2 }}>

              {vuelto > 0 ?
          `Vuelto: $${vuelto.toLocaleString("es-CL")}` :
          "Pago exacto: sin vuelto"}
            </Alert>
        }
        </>
      }
    </Box>);

};

PasoPago.propTypes = {
  metodoPago: PropTypes.number,
  setMetodoPago: PropTypes.func.isRequired,
  montoRecibido: PropTypes.number.isRequired,
  setMontoRecibido: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
};

export default PasoPago;
