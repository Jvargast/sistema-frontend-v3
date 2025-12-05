import {
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Box,
  Divider,
  useTheme,
  Tooltip,
} from "@mui/material";
import PedidoListaProductos from "./PedidoListaProductos";
import PropTypes from "prop-types";
import { formatCLP } from "../../utils/formatUtils";

const getEstadoColor = (estado, theme) => {
  if (!estado) return "default";
  if (["Entregado", "Finalizado", "Completado"].includes(estado))
    return "success";
  if (["En Entrega", "En Preparación", "Confirmado"].includes(estado))
    return "info";
  if (estado === "Pendiente" || estado === "Pendiente de Confirmación")
    return "warning";
  if (["Cancelado", "Anulado"].includes(estado)) return "error";
  return theme.palette.mode === "dark" ? "info" : "primary";
};

const PedidoCard = ({
  pedido,
  confirmado = false,
  isConfirming,
  onConfirmar,
  onRechazar,
}) => {
  const theme = useTheme();
  const estado = pedido?.EstadoPedido?.nombre_estado || "Desconocido";
  const pagado = pedido?.pagado;
  const estadoPago = pedido?.estado_pago;

  return (
    <Grid item xs={12} sm={6} md={4} display="flex">
      <Paper
        elevation={theme.palette.mode === "dark" ? 5 : 3}
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          minHeight: 370,
          textAlign: "left",
          borderRadius: 3,
          bgcolor: confirmado
            ? theme.palette.action.selected
            : theme.palette.background.paper,
          transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
          "&:hover": {
            boxShadow: theme.shadows[10],
            transform: "translateY(-6px) scale(1.015)",
          },
          border: confirmado
            ? `2.5px solid ${theme.palette.success.main}40`
            : `1.5px solid ${theme.palette.divider}`,
          position: "relative",
        }}
      >
        <Box mb={2} display="flex" justifyContent="center">
          <Chip
            label={estado}
            color={getEstadoColor(estado, theme)}
            sx={{
              fontWeight: "bold",
              letterSpacing: 0.3,
              textTransform: "capitalize",
              px: 1.2,
              fontSize: { xs: "0.91rem", sm: "1rem" },
            }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: "1.15rem",
          }}
        >
          Pedido #{pedido.id_pedido}
        </Typography>
        {(pedido?.Cliente?.nombre || pedido?.nombre_cliente) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 0.8,
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              👤 Cliente:
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: "bold" }}
            >
              {pedido?.Cliente?.nombre || pedido?.nombre_cliente}
            </Typography>
          </Box>
        )}

        {pedido?.notas && (
          <Tooltip title={pedido.notas}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                mt: 0.5,
                maxHeight: 40,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              📝 {pedido.notas}
            </Typography>
          </Tooltip>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 400, display: "flex", alignItems: "center" }}
          >
            📍Dirección:
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: "bold", wordBreak: "break-word" }}
          >
            {pedido?.direccion_entrega}
          </Typography>
        </Box>
        {pedido?.prioridad && (
          <Chip
            label={`🎯 Prioridad: ${pedido.prioridad}`}
            color={
              pedido.prioridad === "alta"
                ? "error"
                : pedido.prioridad === "media"
                ? "warning"
                : "default"
            }
            size="small"
            sx={{
              mb: 1,
              fontWeight: "bold",
              textTransform: "capitalize",
              bgcolor:
                pedido.prioridad === "alta"
                  ? "#d32f2f"
                  : pedido.prioridad === "media"
                  ? "#f9a825"
                  : "#9e9e9e",
              color: "#fff",
            }}
          />
        )}

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            mb: 1.2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            color="primary"
            sx={{ fontSize: "1.11rem" }}
          >
            Total: {formatCLP(pedido.total)}
          </Typography>
          <Chip
            size="small"
            label={`${pagado ? "Pagado" : "Pago Pendiente"}${
              estadoPago ? ` (${estadoPago})` : ""
            }`}
            color={pagado ? "success" : "warning"}
            variant={pagado ? "filled" : "outlined"}
            sx={{ fontWeight: "bold", mt: 0.5 }}
          />
        </Box>

        <PedidoListaProductos
          productos={pedido.DetallesPedido.map((detalle) => ({
            ...detalle,
            subtotal: Number(detalle.subtotal),
          }))}
        />

        <Divider sx={{ my: 2 }} />

        {confirmado ? (
          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            <Chip
              icon={<span style={{ fontSize: 18, marginRight: 2 }}>✅</span>}
              label="Pedido Confirmado"
              color="success"
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                px: 2,
                letterSpacing: 0.3,
              }}
            />
          </Box>
        ) : (
          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{
                fontSize: "1rem",
                py: 1.1,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                borderWidth: 2,
              }}
              onClick={() => onRechazar(pedido.id_pedido)}
              disabled={isConfirming}
            >
              ✖ Rechazar
            </Button>

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{
                fontSize: "1rem",
                py: 1.1,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: theme.shadows[2],
                transition: "background 0.15s",
              }}
              onClick={() => onConfirmar(pedido.id_pedido)}
              disabled={isConfirming}
            >
              {isConfirming ? "Confirmando..." : "✔ Confirmar"}
            </Button>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

PedidoCard.propTypes = {
  pedido: PropTypes.object.isRequired,
  confirmado: PropTypes.bool,
  isConfirming: PropTypes.bool.isRequired,
  onConfirmar: PropTypes.func.isRequired,
  onRechazar: PropTypes.func.isRequired,
};

export default PedidoCard;
