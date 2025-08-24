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
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { getImageUrl } from "../../store/services/apiBase";

const ProductCard = ({
  product,
  onAddToCart,
  stock = 0,
  disableAdd = false,
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const precio = Number(product.precio || 0);
  const stockInv = Number(stock ?? 0);
  const sinStock = stockInv <= 0;

  const tipoLabel = product.tipo === "insumo" ? "Insumo" : "Producto";
  const tipoColor = product.tipo === "insumo" ? "default" : "primary";

  const imageSrc = useMemo(() => {
    const raw = product.image_url || "";
    return raw ? getImageUrl(raw) : "";
  }, [product.image_url]);

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
      <Box
        position="absolute"
        top={10}
        left={10}
        zIndex={1}
        display="flex"
        gap={1}
      >
        <Chip
          label={tipoLabel}
          size="small"
          color={tipoColor}
          sx={{ fontSize: "0.72rem", fontWeight: 700 }}
        />
      </Box>

      {!imageSrc || imageError ? (
        <Box
          height={160}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            gap: 0.5,
          }}
        >
          {imageError ? (
            <BrokenImageIcon
              sx={{ fontSize: 46, color: theme.palette.text.disabled }}
            />
          ) : (
            <ImageOutlinedIcon
              sx={{ fontSize: 46, color: theme.palette.text.disabled }}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            Sin imagen
          </Typography>
        </Box>
      ) : (
        <CardMedia
          component="img"
          image={imageSrc}
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
          color={stockInv > 0 ? "textSecondary" : "error"}
          fontWeight={stockInv > 0 ? 400 : 600}
          sx={{ mb: 1 }}
        >
          {stockInv > 0 ? `Stock: ${stockInv}` : "Sin stock"}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() => onAddToCart(product)}
          disabled={sinStock || disableAdd}
          sx={{
            fontWeight: "bold",
            borderRadius: 2,
            py: 1,
            backgroundColor:
              stockInv > 0 ? theme.palette.primary.main : "#bdbdbd",
            "&:hover": {
              backgroundColor:
                stockInv > 0 ? theme.palette.primary.dark : "#9e9e9e",
            },
          }}
        >
          {stockInv > 0 ? "Agregar" : "Agotado"}
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
    inventario: PropTypes.arrayOf(
      PropTypes.shape({
        cantidad: PropTypes.number,
        id_sucursal: PropTypes.number,
      })
    ),
    tipo: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  stock: PropTypes.number,
  disableAdd: PropTypes.bool,
};

export default ProductCard;
