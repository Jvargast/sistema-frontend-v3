import { Box, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import TotalsDisplay from "../TotalDisplay";
import ShoppingCartItem from "../ShoppingCartItem";

const CarritoDeCompras = ({
  cart,
  subtotal,
  descuento,
  impuestos,
  total,
  discount,
  taxRate,
  onRemove,
  onQuantityChange,
  onPriceChange,
  onTaxRateChange,
  onDiscountChange,
  onProceedToPayment,
  productosRetornables,
  refButton
}) => (
  <Paper
    elevation={3}
    sx={{
      borderRadius: 3,
      p: 2,
      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      width: "100%",
    }}
  >
    <Typography variant="h3" fontWeight="bold" mb={2} textAlign="center">
      🛒 Carrito de Compras
    </Typography>
    <Box mb={1} maxHeight="300px" overflow="auto">
      {cart.map((item) => (
        <ShoppingCartItem
          key={item.id_producto}
          item={item}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onPriceChange={onPriceChange}
        />
      ))}
    </Box>
    <Box>
      <TotalsDisplay
        subtotal={subtotal}
        descuento={descuento || 0}
        impuestos={impuestos}
        total={total}
        discount={discount || 0}
        taxRate={taxRate || 0}
        onTaxRateChange={onTaxRateChange}
        onDiscountChange={onDiscountChange}
        onProceedToPayment={onProceedToPayment}
        productosRetornables={productosRetornables}
        refButton={refButton}
      />
    </Box>
  </Paper>
);

CarritoDeCompras.propTypes = {
  cart: PropTypes.array.isRequired,
  subtotal: PropTypes.number,
  descuento: PropTypes.number,
  impuestos: PropTypes.number,
  total: PropTypes.number,
  discount: PropTypes.number,
  taxRate: PropTypes.number,
  onRemove: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onTaxRateChange: PropTypes.func.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
  onProceedToPayment: PropTypes.func.isRequired,
  productosRetornables: PropTypes.array,
  refButton: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.any })
  ]),
};

export default CarritoDeCompras;
