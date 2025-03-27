import { List, ListItem, ListItemText, Typography, Paper } from "@mui/material";
import PropTypes from "prop-types";

const PedidoListaProductos = ({ productos }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 2,
        bgcolor: "background.default",
        width: "100%",
      }}
    >
      <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
        🛒 Productos del Pedido
      </Typography>

      <List dense disablePadding>
        {productos.map((detalle) => (
          <ListItem
            key={detalle.id_detalle_pedido}
            sx={{
              px: 1,
              py: 0.5,
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="bold">
                  {detalle.Producto.nombre_producto}{" "}
                  <span style={{ color: "#1976d2" }}>
                    (x{detalle.cantidad})
                  </span>
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="textSecondary">
                  Subtotal: <strong>${Number(detalle.subtotal)}</strong>{" "}
                  {/* 🔹 Convertimos a número */}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

PedidoListaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id_detalle_pedido: PropTypes.number.isRequired,
      Producto: PropTypes.shape({
        nombre_producto: PropTypes.string.isRequired,
      }).isRequired,
      cantidad: PropTypes.number.isRequired,
      subtotal: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PedidoListaProductos;
