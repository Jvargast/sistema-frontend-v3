import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import PropTypes from "prop-types";
import { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const precio = Number(product.precio || 0);
  const stock = product?.inventario?.cantidad || 0;

  const tipoLabel = product.tipo === "insumo" ? "Insumo" : "Producto";
  const tipoColor = product.tipo === "insumo" ? "default" : "primary";

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        transition: "transform 0.25s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        width: "100%",
        maxWidth: 260,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* Chip tipo */}
      <Box position="absolute" top={10} left={10} zIndex={1}>
        <Chip
          label={tipoLabel}
          size="small"
          color={tipoColor}
          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
        />
      </Box>

      {/* Imagen del producto o fallback si falla */}
      {imageError ? (
        <Box
          height={160}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "#e0e0e0",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 48, color: "#9e9e9e" }} />
        </Box>
      ) : (
        <CardMedia
          component="img"
          image={product.image_url || "/placeholder.png"}
          alt={product.nombre_producto}
          onError={() => setImageError(true)}
          sx={{
            height: 160,
            width: "100%",
            objectFit: "cover",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
      )}

      <CardContent sx={{ p: 2.5 }}>
        {/* Nombre y precio */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="subtitle1"
            fontWeight="600"
            sx={{ color: "#37474f" }}
            noWrap
          >
            {product.nombre_producto}
          </Typography>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ color: "#2e7d32" }}
          >
            ${precio.toFixed(0)}
          </Typography>
        </Box>

        {/* Stock */}
        <Typography
          variant="body2"
          color={stock > 0 ? "textSecondary" : "error"}
          fontWeight={stock > 0 ? 400 : 600}
          sx={{ mb: 1 }}
        >
          {stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}
        </Typography>

        {/* Botón agregar */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onAddToCart(product)}
          disabled={stock === 0}
          sx={{
            fontWeight: "bold",
            borderRadius: 2,
            py: 1,
            backgroundColor: stock > 0 ? "#1976d2" : "#bdbdbd",
            "&:hover": {
              backgroundColor: stock > 0 ? "#1565c0" : "#9e9e9e",
            },
          }}
        >
          {stock > 0 ? "Agregar" : "Agotado"}
        </Button>
      </CardContent>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    image_url: PropTypes.string,
    nombre_producto: PropTypes.string.isRequired,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    inventario: PropTypes.shape({
      cantidad: PropTypes.number,
    }),
    tipo: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
