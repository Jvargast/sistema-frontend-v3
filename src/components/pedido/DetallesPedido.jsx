import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import Icon from "@mdi/react";
import { mdiBarcode } from "@mdi/js";

// Función reutilizable para formatear moneda CLP
const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);

const DetallesPedido = ({ detalles }) => (
  <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: "#f9fafb" }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      📦 Detalles del Pedido
    </Typography>

    <Divider sx={{ mb: 2 }} />

    <List>
      {detalles.map((item) => {
        const producto = item.Producto;
        const insumo = item.Insumo;
        const esProducto = !!producto;
        const nombre =
          producto?.nombre_producto ||
          insumo?.nombre_insumo ||
          "Ítem sin nombre";
        const codigo = producto?.codigo_barra || insumo?.codigo || "Sin código";
        const imageUrl = producto?.image_url || insumo?.image_url || "";
        const tipo = esProducto ? "Producto" : "Insumo";

        return (
          <Box key={item.id_detalle_pedido}>
            <ListItem sx={{ alignItems: "center", gap: 2 }}>
              <Avatar
                variant="rounded"
                src={imageUrl}
                alt={nombre}
                sx={{ width: 56, height: 56, bgcolor: "#e0e0e0" }}
              >
                {nombre[0] || "?"}
              </Avatar>

              <Box flex={1}>
                <Typography fontWeight="bold" color="primary">
                  {nombre}
                </Typography>

                <Chip
                  label={tipo}
                  color={esProducto ? "primary" : "secondary"}
                  size="small"
                  sx={{ mt: 0.5 }}
                />

                <Typography variant="body2" color="text.secondary">
                  Cantidad: <strong>{item.cantidad}</strong>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Precio Unitario: {formatoCLP(item.precio_unitario)}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Icon path={mdiBarcode} size={0.9} />
                  <Typography variant="body2" color="text.secondary">
                    {codigo}
                  </Typography>
                </Box>
              </Box>

              <Typography fontWeight="bold" color="textPrimary">
                {formatoCLP(item.subtotal)}
              </Typography>
            </ListItem>
            <Divider sx={{ my: 1 }} />
          </Box>
        );
      })}
    </List>
  </Paper>
);

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
