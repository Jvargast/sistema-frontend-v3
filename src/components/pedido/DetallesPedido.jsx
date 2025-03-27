import {
    Paper,
    Typography,
    Divider,
    List,
    ListItem,
    Avatar,
    Box,
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
        📦 Productos del Pedido
      </Typography>
  
      <Divider sx={{ mb: 2 }} />
  
      <List>
        {detalles.map((item) => (
          <Box key={item.id_detalle_pedido}>
            <ListItem sx={{ alignItems: "center", gap: 2 }}>
              <Avatar
                variant="rounded"
                src={item.Producto?.image_url || ""}
                alt={item.Producto?.nombre_producto || "Producto"}
                sx={{ width: 56, height: 56, bgcolor: "#e0e0e0" }}
              >
                {item.Producto?.nombre_producto?.[0] || "P"}
              </Avatar>
  
              <Box flex={1}>
                <Typography fontWeight="bold" color="primary">
                  {item.Producto?.nombre_producto || "Producto desconocido"}
                </Typography>
  
                <Typography variant="body2" color="text.secondary">
                  Cantidad: <strong>{item.cantidad}</strong>
                </Typography>
  
                <Typography variant="body2" color="text.secondary">
                  Precio Unitario: {formatoCLP(item.precio_unitario)}
                </Typography>
  
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Icon path={mdiBarcode} size={0.9} />
                  <Typography variant="body2" color="text.secondary">
                    {item.Producto?.codigo_barra || "Sin código"}
                  </Typography>
                </Box>
              </Box>
  
              <Typography fontWeight="bold" color="textPrimary">
                {formatoCLP(item.subtotal)}
              </Typography>
            </ListItem>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
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
      })
    ).isRequired,
  };
  
  export default DetallesPedido;
  