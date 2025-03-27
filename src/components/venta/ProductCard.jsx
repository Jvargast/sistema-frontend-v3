import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";

const ProductCard = ({ product, onAddToCart }) => {
  const precio = Number(product.precio || 0);
  const stock = product?.inventario?.cantidad || 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 5,
        },
        width: "100%",
        maxWidth: 250, // Evita que los elementos sean demasiado anchos
        margin: "auto",
      }}
    >
      {/* Imagen del producto */}
      <CardMedia
        component="img"
        image={product.image_url || "/placeholder.png"} // Imagen predeterminada si no hay URL
        alt={product.nombre_producto}
        sx={{
          height: 160, // Tamaño uniforme para todas las imágenes
          width: "100%",
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      <CardContent sx={{ p: 2 }}>
        {/* Nombre y precio */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body1" fontWeight="bold" sx={{ color: "#424242" }} noWrap>
            {product.nombre_producto}
          </Typography>
          <Typography color="primary" fontWeight="bold">
            ${precio.toFixed(2)}
          </Typography>
        </Box>

        {/* Stock */}
        <Typography
          color={stock > 0 ? "textSecondary" : "error"}
          fontWeight={stock > 0 ? "normal" : "bold"}
          sx={{ fontSize: "0.9rem", mb: 1 }}
        >
          {stock > 0 ? `Stock: ${stock}` : "Sin stock"}
        </Typography>

        {/* Botón agregar */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onAddToCart(product)}
          disabled={stock === 0}
          sx={{
            backgroundColor: stock > 0 ? "#4CAF50" : "#BDBDBD",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: stock > 0 ? "#388E3C" : "#9E9E9E",
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
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
