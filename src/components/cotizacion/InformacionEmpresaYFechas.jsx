import { Grid, Typography, TextField, Button, Stack } from "@mui/material";
import PropTypes from "prop-types";

const InformacionEmpresaYFechas = ({
  empresa,
  fecha,
  fecha_vencimiento,
  modoEdicion,
  onChangeFechaVencimiento,
}) => {
  const aplazarDias = (dias) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    const fechaFormateada = nuevaFecha.toISOString().split("T")[0];
    onChangeFechaVencimiento(fechaFormateada);
  };

  return (
    <>
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" color="primary" gutterBottom>
          Empresa
        </Typography>
        <Typography>Nombre: {empresa?.nombre}</Typography>
        <Typography>Dirección: {empresa?.direccion}</Typography>
        <Typography>Teléfono: {empresa?.telefono}</Typography>
        <Typography>Email: {empresa?.email}</Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography variant="h6" color="primary" gutterBottom>
          Fechas
        </Typography>
        <Typography>Emisión: {new Date(fecha).toLocaleDateString()}</Typography>

        {modoEdicion ? (
          <>
            <TextField
              label="Fecha de vencimiento"
              type="date"
              value={fecha_vencimiento?.split("T")[0] || ""}
              onChange={(e) => onChangeFechaVencimiento(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 1, mb: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Aplazar desde fecha de emisión
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="small"
                onClick={() => aplazarDias(15)}
              >
                +15 días
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => aplazarDias(30)}
              >
                +30 días
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => aplazarDias(60)}
              >
                +60 días
              </Button>
            </Stack>
          </>
        ) : (
          <Typography>
            Vencimiento: {new Date(fecha_vencimiento).toLocaleDateString()}
          </Typography>
        )}
      </Grid>
    </>
  );
};

InformacionEmpresaYFechas.propTypes = {
  empresa: PropTypes.shape({
    nombre: PropTypes.string,
    direccion: PropTypes.string,
    telefono: PropTypes.string,
    email: PropTypes.string,
  }),
  fecha: PropTypes.string.isRequired,
  fecha_vencimiento: PropTypes.string.isRequired,
  modoEdicion: PropTypes.bool,
  onChangeFechaVencimiento: PropTypes.func,
};

export default InformacionEmpresaYFechas;
