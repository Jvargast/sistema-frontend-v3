import { Box, Typography, TextField, Button } from "@mui/material";
import PropTypes from "prop-types";

const TotalsDisplay = ({
  subtotal,
  descuento,
  impuestos,
  total,
  discount,
  taxRate,
  onDiscountChange,
  onProceedToPayment,
  onTaxRateChange,
  productosRetornables,
}) => {
  return (
    <Box>
      {/* Totales */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Subtotal:</Typography>
        <Typography variant="h4">${subtotal.toFixed(2)}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        alignItems={"center"}
      >
        {/* <Typography variant="h6">Descuento ({discount}%):</Typography> */}
        <TextField
          label="Descuento (%)"
          type="number"
          value={discount}
          onChange={(e) => onDiscountChange(e)}
          sx={{ width: "100px", fontSize: "1rem" }}
        />
        <Typography variant="h4" color="error">
          -${descuento.toFixed(2)}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        alignItems={"center"}
      >
        <TextField
          label="Impuesto (%)"
          type="number"
          value={taxRate}
          onChange={(e) => onTaxRateChange(e)}
          sx={{ width: "100px" }}
        />
        <Typography variant="h4">${impuestos.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Total:</Typography>
        <Typography variant="h4">${total.toFixed(2)}</Typography>
      </Box>

      {productosRetornables && productosRetornables.length > 0 && (
        <Box mt={3} p={2} borderRadius={2} sx={{ backgroundColor: "#F3F4F6" }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Productos Retornables
          </Typography>
          {productosRetornables
            .filter((producto) => producto.cantidad > 0) // 🔹 Solo mostrar si cantidad > 0
            .map((producto, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                mb={1}
                p={1}
                sx={{ borderBottom: "1px solid #ddd" }}
              >
                <Typography>{producto.nombre}</Typography>
                <Typography>
                  {producto.cantidad}{" "}
                  {producto.estado === "defectuoso" ? "(Defectuoso)" : ""}
                </Typography>
              </Box>
            ))}
        </Box>
      )}

      {/* Controles */}
      <Box mt={2} display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onProceedToPayment}
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#388E3C" },
          }}
        >
          Proceder al pago
        </Button>
      </Box>
    </Box>
  );
};
TotalsDisplay.propTypes = {
  subtotal: PropTypes.number.isRequired,
  descuento: PropTypes.number.isRequired,
  impuestos: PropTypes.number.isRequired,
  taxRate: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
  onTaxRateChange: PropTypes.func.isRequired,
  onProceedToPayment: PropTypes.func.isRequired,
  productosRetornables: PropTypes.array,
};

export default TotalsDisplay;
