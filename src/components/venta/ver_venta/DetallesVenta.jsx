import {
  Typography,
  Divider,
  Box,
  Avatar,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ShoppingBag, MonetizationOn } from "@mui/icons-material";
import { mdiBarcode } from "@mdi/js";
import Icon from "@mdi/react";
import PropTypes from "prop-types";

const DetallesVenta = ({ detalles }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      >
        Detalles de la Venta
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {detalles.map((item) => (
          <ListItem
            key={item.id_detalle}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: 2,
            }}
          >
            {/* Imagen */}
            <Avatar
              src={item.producto?.image_url || ""}
              alt={item.producto?.nombre_producto || "Producto"}
              variant="rounded"
              sx={{
                width: 60,
                height: 60,
                backgroundColor: item.producto?.image_url
                  ? "transparent"
                  : "#f0f0f0",
              }}
            >
              {!item.producto?.image_url && (
                <ShoppingBag sx={{ color: "#757575" }} />
              )}
            </Avatar>

            {/* Info del producto */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography fontWeight="bold" variant="body1" color="primary">
                {item.producto?.nombre_producto || "Producto desconocido"}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <ShoppingBag sx={{ color: "#4caf50", fontSize: "20px" }} />
                <Typography variant="body2" color="text.secondary">
                  Marca: {item.producto?.marca || "Sin marca"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Icon path={mdiBarcode} size={0.9} />
                <Typography variant="body2" color="text.secondary">
                  Código de barras:{" "}
                  {item.producto?.codigo_barra || "No disponible"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                📦
                <Typography variant="body2" color="text.secondary">
                  Cantidad: {item.cantidad} | 💲 Precio Unitario: $
                  {parseFloat(item.precio_unitario).toLocaleString()}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <MonetizationOn sx={{ color: "#ff9800" }} />
                <Typography fontWeight="bold" variant="body2" color="primary">
                  Subtotal: ${parseFloat(item.subtotal).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

DetallesVenta.propTypes = {
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      id_detalle: PropTypes.number.isRequired,
      id_producto: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
      subtotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      precio_unitario: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      producto: PropTypes.shape({
        nombre_producto: PropTypes.string,
        marca: PropTypes.string,
        codigo_barra: PropTypes.string,
        image_url: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default DetallesVenta;
