import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import logo from "../../assets/images/logoLogin.png";

const EncabezadoCotizacion = ({ id }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
    <img src={logo} alt="Logo" width={120} />
    <Box textAlign="right">
      <Typography variant="h5" fontWeight={700} color="primary">
        Documento Previsualización
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Cotización #{id}
      </Typography>
    </Box>
  </Box>
);
EncabezadoCotizacion.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EncabezadoCotizacion;
