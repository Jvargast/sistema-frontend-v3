import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import PropTypes from "prop-types";
import { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const precio = Number(product.precio || 0);
  const stock = product?.inventario?.cantidad || 0;

  const tipoLabel = product.tipo === "insumo" ? "Insumo" : "Producto";
  const tipoColor = product.tipo === "insumo" ? "default" : "primary";

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
        transition: "transform 0.25s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        width: "100%",
        maxWidth: 300,
        position: "relative",
        overflow: "hidden",
        minHeight: 340,
        background: theme.palette.background.paper,
      }}
    >
      <Box position="absolute" top={10} left={10} zIndex={1}>
        <Chip
          label={tipoLabel}
          size="small"
          color={tipoColor}
          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
        />
      </Box>

      {imageError ? (
        <Box
          height={160}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "#e0e0e0",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 48, color: "#9e9e9e" }} />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 1, opacity: 0.7 }}
          >
            No image
          </Typography>
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

      <CardContent sx={{ p: 2.4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
          <Tooltip title={product.nombre_producto} arrow>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                color: theme.palette.text.primary,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.92rem",
                maxWidth: 210,
                minHeight: "2.6em",
              }}
            >
              {product.nombre_producto}
            </Typography>
          </Tooltip>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              color: theme.palette.success.main,
              fontSize: "1.04rem",
              ml: 1,
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            ${precio.toLocaleString("es-CL")}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color={stock > 0 ? "textSecondary" : "error"}
          fontWeight={stock > 0 ? 400 : 600}
          sx={{ mb: 1 }}
        >
          {stock > 0 ? `Stock: ${stock}` : "Sin stock"}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() => onAddToCart(product)}
          disabled={stock === 0}
          sx={{
            fontWeight: "bold",
            borderRadius: 2,
            py: 1,
            backgroundColor: stock > 0 ? theme.palette.primary.main : "#bdbdbd",
            "&:hover": {
              backgroundColor:
                stock > 0 ? theme.palette.primary.dark : "#9e9e9e",
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
