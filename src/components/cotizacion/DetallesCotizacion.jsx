import { Box, Divider, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";

const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(valor);

const DetallesCotizacion = ({ detalles }) => (
  <Paper variant="outlined" sx={{ mb: 4, p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Detalles de Productos
    </Typography>
    <Divider sx={{ mb: 2 }} />

    {/* Encabezado de columnas */}
    <Box
      display="flex"
      justifyContent="space-between"
      py={1}
      sx={{ borderBottom: "2px solid #ddd", fontWeight: "bold", color: "#555" }}
    >
      <Typography flex={3}>Producto</Typography>
      <Typography flex={1} textAlign="center">
        Cantidad
      </Typography>
      <Typography flex={1} textAlign="center">
        P/U
      </Typography>
      <Typography flex={1} textAlign="right">
        Total
      </Typography>
    </Box>

    {/* Detalles de productos */}
    {detalles.map((item, index) => {
      const subtotal = item.cantidad * item.precio_unitario;
      return (
        <Box
          key={index}
          display="flex"
          justifyContent="space-between"
          py={1}
          sx={{ borderBottom: "1px solid #eee" }}
        >
          <Typography flex={3}>{item.producto.nombre_producto}</Typography>
          <Typography flex={1} textAlign="center">
            {item.cantidad}
          </Typography>
          <Typography flex={1} textAlign="center">
            {formatoCLP(item.precio_unitario)}
          </Typography>
          <Typography flex={1} textAlign="right" fontWeight="bold">
            {formatoCLP(subtotal)}
          </Typography>
        </Box>
      );
    })}
  </Paper>
);

DetallesCotizacion.propTypes = {
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      producto: PropTypes.shape({
        nombre_producto: PropTypes.string.isRequired,
      }).isRequired,
      cantidad: PropTypes.number.isRequired,
      precio_unitario: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DetallesCotizacion;
