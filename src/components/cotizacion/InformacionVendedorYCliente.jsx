import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";

const InformacionVendedorYCliente = ({ vendedor, cliente }) => {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" color="primary" gutterBottom>
          Vendedor
        </Typography>
        <Typography>
          {vendedor?.nombre} {vendedor?.apellido}
        </Typography>
        <Typography>RUT: {vendedor?.rut}</Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography variant="h6" color="primary" gutterBottom>
          Cliente
        </Typography>
        <Typography>Nombre: {cliente.nombre}</Typography>
        <Typography>Dirección: {cliente.direccion}</Typography>
        <Typography>Teléfono: {cliente.telefono}</Typography>
      </Grid>
    </>
  );
};
InformacionVendedorYCliente.propTypes = {
  vendedor: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    rut: PropTypes.string,
  }),
  cliente: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    telefono: PropTypes.string.isRequired,
  }).isRequired,
};

export default InformacionVendedorYCliente;
