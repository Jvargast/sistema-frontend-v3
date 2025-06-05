import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  Avatar,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import Icon from "@mdi/react";
import { mdiBarcode } from "@mdi/js";
import { formatCLP } from "../../utils/formatUtils";

const DetallesPedido = ({ detalles }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        transition: "background 0.2s",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color={theme.palette.primary.main}
        gutterBottom
        sx={{ mb: 1.5 }}
      >
        📦 Detalles del Pedido
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ width: "100%" }}>
        {detalles.map((item) => {
          const producto = item.Producto;
          const insumo = item.Insumo;
          const esProducto = !!producto;
          const nombre =
            producto?.nombre_producto ||
            insumo?.nombre_insumo ||
            "Ítem sin nombre";
          const codigo =
            producto?.codigo_barra || insumo?.codigo || "Sin código";
          const imageUrl = producto?.image_url || insumo?.image_url || "";
          const tipo = esProducto ? "Producto" : "Insumo";

          return (
            <Box key={item.id_detalle_pedido}>
              <ListItem
                sx={{
                  alignItems: "flex-start",
                  gap: 2,
                  pb: 1.2,
                  px: { xs: 0, sm: 1 },
                  borderRadius: 2,
                  "&:hover": {
                    background: theme.palette.action.hover,
                    transition: "background 0.15s",
                  },
                }}
              >
                <Avatar
                  variant="rounded"
                  src={imageUrl}
                  alt={nombre}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.dark
                        : theme.palette.grey[200],
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                  }}
                >
                  {nombre[0]?.toUpperCase() || "?"}
                </Avatar>

                <Box flex={1} minWidth={0}>
                  <Typography
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                    sx={{ fontSize: "1.04rem", wordBreak: "break-word" }}
                  >
                    {nombre}
                  </Typography>
                  <Box
                    display="flex"
                    gap={1}
                    alignItems="center"
                    mt={0.3}
                    mb={0.4}
                  >
                    <Chip
                      label={tipo}
                      color={esProducto ? "primary" : "secondary"}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        letterSpacing: 0.3,
                        px: 1,
                        borderRadius: 1.5,
                        textTransform: "capitalize",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.2 }}
                  >
                    Cantidad: <strong>{item.cantidad}</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.2 }}
                  >
                    Precio Unitario:{" "}
                    <strong>{formatCLP(item.precio_unitario)}</strong>
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.8} mt={0.2}>
                    <Icon
                      path={mdiBarcode}
                      size={0.8}
                      color={theme.palette.text.secondary}
                      style={{ verticalAlign: "middle" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {codigo}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  fontWeight="bold"
                  color={theme.palette.success.dark}
                  sx={{
                    minWidth: 88,
                    textAlign: "right",
                    fontSize: "1.05rem",
                    alignSelf: "center",
                  }}
                >
                  {formatCLP(item.subtotal)}
                </Typography>
              </ListItem>
              <Divider sx={{ my: 1 }} />
            </Box>
          );
        })}
      </List>
    </Paper>
  );
};

DetallesPedido.propTypes = {
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      id_detalle_pedido: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
      subtotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      precio_unitario: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      Producto: PropTypes.shape({
        nombre_producto: PropTypes.string,
        codigo_barra: PropTypes.string,
        image_url: PropTypes.string,
      }),
      Insumo: PropTypes.shape({
        nombre_insumo: PropTypes.string,
        codigo: PropTypes.string,
        image_url: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default DetallesPedido;
