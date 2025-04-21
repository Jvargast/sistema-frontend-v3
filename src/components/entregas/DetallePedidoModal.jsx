import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  Box,
  useMediaQuery,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { formatCLP } from "../../utils/formatUtils";

const DetallePedidoModal = ({ open, onClose, pedido, loading }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const detalles = pedido?.DetallesPedido || [];

  if (loading || !pedido) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll={isMobile ? "paper" : "body"}
    >
      <DialogTitle
        sx={{ fontSize: isMobile ? "1.1rem" : "1.5rem", fontWeight: 600 }}
      >
        Detalles del Pedido #{pedido.id_pedido}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Cliente: {pedido?.Cliente?.nombre} {pedido?.Cliente?.apellido}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Dirección: {pedido.direccion_entrega}
          </Typography>

          {pedido.notas && (
            <Typography variant="body2" color="text.secondary">
              Notas: {pedido.notas}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={600}>
            Productos:
          </Typography>

          {detalles.length === 0 ? (
            <Typography color="text.secondary">
              Sin productos registrados.
            </Typography>
          ) : (
            <List dense>
              {detalles.map((detalle) => {
                const producto = detalle.Producto;
                return (
                  <ListItem
                    key={detalle.id_detalle_pedido}
                    disableGutters
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "flex-start" : "center",
                      gap: 1,
                      py: 1,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {producto?.nombre_producto || "Producto sin nombre"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {detalle.cantidad}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Precio Unitario: {formatCLP(detalle.precio_unitario)}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" fullWidth={isMobile}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DetallePedidoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.shape({
    id_pedido: PropTypes.number.isRequired,
    Cliente: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string,
    }),
    direccion_entrega: PropTypes.string,
    notas: PropTypes.string,
    DetallesPedido: PropTypes.arrayOf(
      PropTypes.shape({
        id_detalle_pedido: PropTypes.number,
        cantidad: PropTypes.number,
        precio_unitario: PropTypes.string,
        Producto: PropTypes.shape({
          nombre_producto: PropTypes.string,
        }),
      })
    ),
  }),
};

export default DetallePedidoModal;
