import { Box, Typography, TextField, Button } from "@mui/material";
import PropTypes from "prop-types";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

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
  refButton,
  ctaLabel
}) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Subtotal:</Typography>
        <Typography variant="h4">{formatCLP(subtotal)}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        alignItems={"center"}
      >
        <TextField
          label="Descuento (%)"
          type="number"
          value={discount}
          onChange={(e) => onDiscountChange(e)}
          sx={{ width: "100px", fontSize: "1rem" }}
        />
        <Typography variant="h4" color="error">
          -{formatCLP(descuento)}
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
        <Typography variant="h4">{formatCLP(impuestos)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Total:</Typography>
        <Typography variant="h4">{formatCLP(total)}</Typography>
      </Box>

      {productosRetornables && productosRetornables.length > 0 && (
        <Box mt={3} p={2} borderRadius={2}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Productos Retornables
          </Typography>
          {productosRetornables
            .filter((producto) => producto.cantidad > 0) 
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

      <Box mt={2} display="flex" justifyContent="space-between" gap={2}>
        <Button
          ref={refButton}
          variant="contained"
          color="primary"
          fullWidth
          onClick={onProceedToPayment}
          sx={{
            backgroundColor: "#4CAF50",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#388E3C" },
          }}
        >
          {ctaLabel}
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
  refButton: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  ctaLabel: PropTypes.string
};

export default TotalsDisplay;
