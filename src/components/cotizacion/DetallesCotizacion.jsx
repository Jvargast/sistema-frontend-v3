import { Box, Divider, Paper, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";

const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);

const DetallesCotizacion = ({ detalles, modoEdicion, onDetalleChange }) => {
  const detallesNumericos = detalles.map((item) => ({
    ...item,
    cantidad: Number(item.cantidad),
    precio_unitario: Number(item.precio_unitario),
  }));

  return (
    <Paper variant="outlined" sx={{ mb: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Detalles de Productos
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        display="flex"
        justifyContent="space-between"
        py={1}
        sx={{
          borderBottom: "2px solid #ddd",
          fontWeight: "bold",
          color: "#555",
        }}
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

      {detallesNumericos.map((item, index) => {
        const subtotal = item.cantidad * item.precio_unitario;

        return (
          <Box
            key={item.id_detalle || index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            sx={{ borderBottom: "1px solid #eee" }}
          >
            <Typography flex={3}>
              {item.producto?.nombre_producto ||
                item.insumo?.nombre_insumo ||
                "—"}
            </Typography>

            <Box flex={1} textAlign="center">
              {modoEdicion ? (
                <TextField
                  type="number"
                  value={item.cantidad}
                  onChange={(e) =>
                    onDetalleChange(
                      index,
                      "cantidad",
                      e.target.value === ""
                        ? ""
                        : Math.max(0, parseFloat(e.target.value))
                    )
                  }
                  variant="standard"
                  inputProps={{
                    min: 0,
                    style: {
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: 0,
                    },
                  }}
                  sx={{
                    width: "60px",
                    color: "error.main",
                    "& .MuiInputBase-root::before": { borderBottom: "none" },
                    "& .MuiInputBase-root:hover::before": {
                      borderBottom: "none",
                    },
                    "& .MuiInputBase-root.Mui-focused::before": {
                      borderBottom: "none",
                    },
                    "& input": {
                      color: "error.main",
                      backgroundColor: "transparent",
                    },
                  }}
                />
              ) : (
                item.cantidad
              )}
            </Box>

            <Box flex={1} textAlign="center">
              {modoEdicion ? (
                <TextField
                  type="number"
                  value={item.precio_unitario}
                  onChange={(e) =>
                    onDetalleChange(
                      index,
                      "precio_unitario",
                      e.target.value === ""
                        ? ""
                        : Math.max(0, parseFloat(e.target.value))
                    )
                  }
                  variant="standard"
                  inputProps={{
                    min: 0,
                    style: {
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: 0,
                    },
                  }}
                  sx={{
                    width: "80px",
                    color: "error.main",
                    "& .MuiInputBase-root::before": { borderBottom: "none" },
                    "& .MuiInputBase-root:hover::before": {
                      borderBottom: "none",
                    },
                    "& .MuiInputBase-root.Mui-focused::before": {
                      borderBottom: "none",
                    },
                    "& input": {
                      color: "error.main",
                      backgroundColor: "transparent",
                    },
                  }}
                />
              ) : (
                formatoCLP(item.precio_unitario)
              )}
            </Box>

            <Typography flex={1} textAlign="right" fontWeight="bold">
              {formatoCLP(subtotal)}
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
};

DetallesCotizacion.propTypes = {
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      producto: PropTypes.shape({
        nombre_producto: PropTypes.string,
      }),
      insumo: PropTypes.shape({
        nombre_insumo: PropTypes.string,
      }),
      cantidad: PropTypes.number.isRequired,
      precio_unitario: PropTypes.number.isRequired,
    })
  ).isRequired,
  modoEdicion: PropTypes.bool,
  onDetalleChange: PropTypes.func,
};

export default DetallesCotizacion;
