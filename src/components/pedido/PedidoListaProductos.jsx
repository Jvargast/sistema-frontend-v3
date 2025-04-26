import { List, ListItem, ListItemText, Typography, Paper } from "@mui/material";
import PropTypes from "prop-types";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

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
        {productos.map((detalle) => {
          const nombre =
            detalle?.Producto?.nombre_producto ??
            detalle?.Insumo?.nombre_insumo ??
            "Producto desconocido";

          return (
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
                    {nombre}{" "}
                    <span style={{ color: "#1976d2" }}>
                      (x{detalle.cantidad})
                    </span>
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="textSecondary">
                    Subtotal: <strong>{formatCLP(detalle.subtotal)}</strong>
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

PedidoListaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id_detalle_pedido: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
      subtotal: PropTypes.number.isRequired,
      Producto: PropTypes.shape({
        nombre_producto: PropTypes.string,
      }),
      Insumo: PropTypes.shape({
        nombre_insumo: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default PedidoListaProductos;
