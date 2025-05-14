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
  Chip,
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
        sx={{
          fontSize: isMobile ? "1.1rem" : "1.5rem",
          fontWeight: 700,
          color: "primary.main",
        }}
      >
        🧾 Detalles del Pedido #{pedido.id_pedido}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Cliente: {pedido?.Cliente?.nombre} {pedido?.Cliente?.apellido}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={
                pedido?.pagado
                  ? `Pagado (${pedido?.estado_pago})`
                  : "Pendiente de Pago"
              }
              color={pedido.pagado ? "success" : "warning"}
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Dirección: {pedido?.direccion_entrega}
          </Typography>

          {pedido.notas && (
            <Typography variant="body2" color="text.secondary">
              Notas: {pedido.notas}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={600}>
            Ítems del pedido:
          </Typography>

          {detalles.length === 0 ? (
            <Typography color="text.secondary">
              Sin productos ni insumos registrados.
            </Typography>
          ) : (
            <List dense disablePadding>
              {detalles.map((detalle) => {
                const { Producto: producto, Insumo: insumo } = detalle;
                const nombre =
                  producto?.nombre_producto ||
                  insumo?.nombre_insumo ||
                  "Sin nombre";
                const tipo = producto ? "Producto" : "Insumo";

                return (
                  <ListItem
                    key={detalle.id_detalle_pedido}
                    disableGutters
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      mb: 2,
                      px: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {nombre}
                      </Typography>
                      <Chip
                        label={tipo}
                        size="small"
                        color={tipo === "Producto" ? "primary" : "secondary"}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Cantidad: {detalle.cantidad}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio Unitario: {formatCLP(detalle.precio_unitario)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal: {formatCLP(detalle.subtotal)}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          sx={{ fontWeight: 600, textTransform: "none" }}
        >
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
    }).isRequired,
    direccion_entrega: PropTypes.string,
    notas: PropTypes.string,
    DetallesPedido: PropTypes.arrayOf(
      PropTypes.shape({
        id_detalle_pedido: PropTypes.number,
        cantidad: PropTypes.number,
        precio_unitario: PropTypes.string,
        subtotal: PropTypes.string,
        Producto: PropTypes.object,
        Insumo: PropTypes.object,
      })
    ),
    pagado: PropTypes.bool,
    estado_pago: PropTypes.string,
  }),
};

export default DetallePedidoModal;
