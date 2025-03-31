import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ResumenCotizacion = ({ totalNeto, iva, totalFinal, impuesto }) => (
  <Box textAlign="right" pr={1}>
    <Typography>
      <strong>Subtotal:</strong> ${totalNeto.toLocaleString()}
    </Typography>
    <Typography>
      <strong>IVA ({impuesto * 100}%):</strong> ${iva.toLocaleString()}
    </Typography>
    <Typography variant="h6" sx={{ mt: 1 }}>
      <strong>Total:</strong> ${totalFinal.toLocaleString()}
    </Typography>
  </Box>
);
ResumenCotizacion.propTypes = {
  totalNeto: PropTypes.number.isRequired,
  iva: PropTypes.number.isRequired,
  totalFinal: PropTypes.number.isRequired,
  impuesto: PropTypes.number.isRequired,
};

export default ResumenCotizacion;
