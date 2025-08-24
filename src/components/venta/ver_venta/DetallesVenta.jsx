import {
  Typography,
  Divider,
  Box,
  Avatar,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { ShoppingBag, MonetizationOn } from "@mui/icons-material";
import { mdiBarcode } from "@mdi/js";
import Icon from "@mdi/react";
import PropTypes from "prop-types";
import { getImageUrl } from "../../../store/services/apiBase";

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
        {detalles.map((item) => {
          const esProducto = !!item.producto;
          const nombre = esProducto
            ? item.producto?.nombre_producto
            : item.insumo?.nombre_insumo;
          const rawImagen = esProducto
            ? item.producto?.image_url
            : item.insumo?.image_url;
          const imagen = getImageUrl(rawImagen);
          const codigo = esProducto
            ? item.producto?.codigo_barra
            : item.insumo?.codigo;
          const marca = esProducto ? item.producto?.marca : null;
          const tipo = esProducto ? "Producto" : "Insumo";

          return (
            <ListItem
              key={item.id_detalle}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: 2,
              }}
            >
              <Avatar
                src={imagen || undefined}
                alt={nombre}
                variant="rounded"
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: imagen ? "transparent" : "#f0f0f0",
                  border: "1px solid black"
                }}
                imgProps={{
                  onError: (e) => {
                    e.currentTarget.src = "";
                  },
                  loading: "lazy",
                  crossOrigin: "anonymous",
                  referrerPolicy: "no-referrer",
                }}
              >
                {!imagen && <ShoppingBag sx={{ color: "#757575" }} />}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight="bold" variant="body1" color="primary">
                    {nombre || "Ítem desconocido"}
                  </Typography>
                  <Chip
                    label={tipo}
                    color={esProducto ? "primary" : "secondary"}
                    size="small"
                    sx={{ fontWeight: "bold", height: "20px" }}
                  />
                </Box>

                {esProducto && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShoppingBag sx={{ color: "#4caf50", fontSize: "20px" }} />
                    <Typography variant="body2" color="text.secondary">
                      Marca: {marca || "Sin marca"}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={1}>
                  <Icon path={mdiBarcode} size={0.9} />
                  <Typography variant="body2" color="text.secondary">
                    Código: {codigo || "No disponible"}
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
          );
        })}
      </List>
    </Box>
  );
};

DetallesVenta.propTypes = {
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      id_detalle: PropTypes.number.isRequired,
      id_producto: PropTypes.number,
      id_insumo: PropTypes.number,
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
      insumo: PropTypes.shape({
        nombre_insumo: PropTypes.string,
        codigo: PropTypes.string,
        image_url: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default DetallesVenta;
