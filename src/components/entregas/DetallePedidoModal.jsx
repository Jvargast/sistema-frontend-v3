import Dialog from "../common/CompatDialog";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  List,
  ListItem,
  useMediaQuery,
  Chip,
  IconButton,
  Paper,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PropTypes from "prop-types";
import { formatCLP } from "../../utils/formatUtils";
import Box from "../common/CompatBox";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";

const DetallePedidoModal = ({ open, onClose, pedido, loading }) => {
  const theme = useTheme();
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
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 24,
        },
      }}>

      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            color: "#fff",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #020617 0%, #1f2937 100%)"
                : "linear-gradient(135deg, #0F172A 0%, #1F2937 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <ReceiptLongIcon sx={{ fontSize: 28, flex: "0 0 auto" }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                Detalle del pedido
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.88, display: "block", fontWeight: 600 }}
              >
                Pedido #{pedido.id_pedido}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,.2)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
        <Stack spacing={2}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? alpha("#0F172A", 0.18)
                  : alpha("#0F172A", 0.04),
              borderColor:
                theme.palette.mode === "dark"
                  ? alpha("#FFFFFF", 0.12)
                  : alpha("#0F172A", 0.12),
            }}
          >
            <Stack spacing={1.25}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                  <PersonOutlineOutlinedIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", flex: "0 0 auto" }}
                  />
                  <Typography variant="subtitle1" fontWeight={800} noWrap>
                    {pedido?.Cliente?.nombre} {pedido?.Cliente?.apellido}
                  </Typography>
                </Box>
                <Chip
                  label={
                    pedido?.pagado
                      ? `Pagado (${pedido?.estado_pago})`
                      : "Pendiente de pago"
                  }
                  color={pedido.pagado ? "success" : "warning"}
                  variant={pedido.pagado ? "filled" : "outlined"}
                  size="small"
                  sx={{ fontWeight: 800, borderRadius: 1 }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOnOutlinedIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", mt: 0.2, flex: "0 0 auto" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {pedido?.direccion_entrega || "Sin dirección registrada"}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {pedido.notas &&
          <Typography variant="body2" color="text.secondary">
              Notas: {pedido.notas}
            </Typography>
          }

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.25 }}>
              Ítems del pedido
            </Typography>

            {detalles.length === 0 ?
            <Typography color="text.secondary">
                Sin productos ni insumos registrados.
              </Typography> :

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
                      alignItems: "stretch",
                      mb: 1,
                      p: 1.25,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    }}>

                      <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        width: "100%",
                        mb: 0.75,
                      }}>

                        <Typography variant="body1" fontWeight={800}>
                          {nombre}
                        </Typography>
                        <Chip
                        label={tipo}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 800,
                          borderRadius: 1,
                          color: "text.secondary",
                          borderColor: "divider",
                          flex: "0 0 auto",
                        }} />

                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(3, minmax(0, 1fr))",
                          },
                          gap: 0.75,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Cantidad: {detalle.cantidad}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unitario: {formatCLP(detalle.precio_unitario)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Subtotal: {formatCLP(detalle.subtotal)}
                        </Typography>
                      </Box>
                    </ListItem>);

              })}
              </List>
            }
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 1.5,
          px: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          sx={(theme) => ({
            fontWeight: 800,
            textTransform: "none",
            bgcolor: "#0F172A",
            color: theme.palette.common.white,
            boxShadow: "none",
            "&:hover": {
              bgcolor: theme.palette.common.black,
              boxShadow: "none",
            },
          })}>

          Cerrar
        </Button>
      </DialogActions>
    </Dialog>);

};

DetallePedidoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.shape({
    id_pedido: PropTypes.number.isRequired,
    Cliente: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string
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
        Insumo: PropTypes.object
      })
    ),
    pagado: PropTypes.bool,
    estado_pago: PropTypes.string
  })
};

export default DetallePedidoModal;
