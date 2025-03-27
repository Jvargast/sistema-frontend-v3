import { TextField, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const EntregaFormFields = ({ register, errors }) => {
  return (
    <>
      <TextField
        label="Monto Total"
        fullWidth
        type="number"
        {...register("monto_total", { required: true })}
        error={!!errors.monto_total}
        helperText={errors.monto_total && "Requerido"}
        sx={{ my: 2 }}
      />

      <TextField
        label="Método de Pago"
        select
        fullWidth
        defaultValue={1}
        {...register("id_metodo_pago", { required: true })}
        error={!!errors.id_metodo_pago}
        helperText={errors.id_metodo_pago && "Selecciona un método"}
        sx={{ mb: 2 }}
      >
        <MenuItem value={1}>Efectivo</MenuItem>
        <MenuItem value={2}>Tarjeta crédito</MenuItem>
        <MenuItem value={3}>Tarjeta débito</MenuItem>
        <MenuItem value={4}>Transferencia</MenuItem>
      </TextField>

      <TextField
        label="Referencia de Pago"
        fullWidth
        {...register("payment_reference")}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Tipo de Documento"
        select
        fullWidth
        defaultValue="boleta"
        {...register("tipo_documento", { required: true })}
        error={!!errors.tipo_documento}
        helperText={errors.tipo_documento && "Selecciona un tipo"}
        sx={{ mb: 2 }}
      >
        <MenuItem value="boleta">Boleta</MenuItem>
        <MenuItem value="factura">Factura</MenuItem>
      </TextField>

      <TextField
        label="Notas (opcional)"
        multiline
        rows={2}
        fullWidth
        {...register("notas")}
        sx={{ mb: 2 }}
      />
    </>
  );
};

EntregaFormFields.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EntregaFormFields;
