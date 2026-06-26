import { MenuItem, Divider, Paper } from "@mui/material";
import PropTypes from "prop-types";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";
import { formatCLP } from "../../utils/formatUtils";

const EntregaPagoStep = ({ register, errors, detallePedido, watch }) => {
  const montoTotal = Number(detallePedido?.monto_total) || 0;
  const metodoPagoSeleccionado = Number(watch("id_metodo_pago") || 1);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={2} color="primary">
        Información de Pago
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          select
          label="Método de Pago"
          fullWidth
          variant="outlined"
          {...register("id_metodo_pago", {
            required: "Este campo es obligatorio",
          })}
          error={!!errors.id_metodo_pago}
          helperText={errors.id_metodo_pago?.message}
          defaultValue={1}
        >
          <MenuItem value={1}>💵 Efectivo</MenuItem>
          <MenuItem value={2}>💳 Transferencia</MenuItem>
          <MenuItem value={3}>💳 Tarjeta Crédito</MenuItem>
          <MenuItem value={4}>💳 Tarjeta Débito</MenuItem>
        </TextField>
        {metodoPagoSeleccionado === 1 && (
          <TextField
            label="Pago recibido"
            type="number"
            variant="outlined"
            fullWidth
            defaultValue={montoTotal}
            {...register("pago_recibido", {
              required: "Debe ingresar el monto recibido",
              min: {
                value: montoTotal || 1,
                message: "El monto recibido no puede ser menor al total",
              },
            })}
            error={!!errors.pago_recibido}
            helperText={errors.pago_recibido?.message}
          />
        )}

        <TextField
          label="Referencia de Pago"
          variant="outlined"
          fullWidth
          {...register("payment_reference")}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Documento Tributario
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Tipo de Documento"
          fullWidth
          variant="outlined"
          value="boleta"
          InputProps={{ readOnly: true }}
        />
        <input
          type="hidden"
          value="boleta"
          {...register("tipo_documento", {
            required: "Seleccione un tipo de documento",
          })}
        />

        <TextField
          label="Notas (opcional)"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          {...register("notas")}
        />
      </Box>

      {montoTotal > 0 && (
        <Box mt={4} textAlign="right">
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="text.primary"
          >
            Total del Pedido:{" "}
            <span style={{ color: "#007AFF", fontSize: "1.25rem" }}>
              {formatCLP(montoTotal)}
            </span>
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

EntregaPagoStep.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  detallePedido: PropTypes.object,
  watch: PropTypes.func.isRequired,
};

export default EntregaPagoStep;
