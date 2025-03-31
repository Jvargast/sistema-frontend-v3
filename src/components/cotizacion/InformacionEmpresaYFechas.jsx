import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";

const InformacionEmpresaYFechas = ({ empresa, fecha, fecha_vencimiento }) => {
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
        <Typography>
          Vencimiento: {new Date(fecha_vencimiento).toLocaleDateString()}
        </Typography>
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
};

export default InformacionEmpresaYFechas;
