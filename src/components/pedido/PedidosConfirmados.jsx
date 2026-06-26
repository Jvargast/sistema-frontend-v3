import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CircularProgress, Alert, Divider, Chip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useGetPedidosConfirmadosQuery } from "../../store/services/pedidosApi";
import Box from "../common/CompatBox";
import Grid from "../common/CompatGrid";
import Typography from "../common/CompatTypography";
import { formatCLP } from "../../utils/formatUtils";

const getSubtotalItem = (item) => {
  const cantidad = Number(item?.cantidad) || 0;
  const precioUnitario = Number(item?.precio_unitario) || 0;
  return Number(item?.subtotal) || cantidad * precioUnitario;
};

const getTotalPedido = (pedido) => {
  const total = Number(pedido?.total);
  if (Number.isFinite(total)) return total;

  return (pedido?.productos ?? []).reduce(
    (sum, item) => sum + getSubtotalItem(item),
    0
  );
};

const PedidosConfirmadosList = ({ idChofer, setProductosReservados }) => {
  const {
    currentData: pedidosData,
    isLoading,
    isError,
  } = useGetPedidosConfirmadosQuery(idChofer, {
    skip: !idChofer,
  });

  const pedidosConfirmados = useMemo(() => {
    if (Array.isArray(pedidosData)) return pedidosData;
    return pedidosData?.data ?? [];
  }, [pedidosData]);

  useEffect(() => {
    const productosReservadosDetalle = pedidosConfirmados.flatMap((pedido) =>
      (pedido.productos ?? [])
        .filter((prod) => prod.es_retornable)
        .map((prod) => ({
          id_pedido: pedido.id_pedido,
          id_producto: prod.id_producto,
          nombre_producto: prod.nombre_producto,
          cantidad: prod.cantidad,
          es_retornable: prod.es_retornable,
        }))
    );

    setProductosReservados(productosReservadosDetalle);
  }, [pedidosConfirmados, setProductosReservados]);

  if (!idChofer) return null;

  return (
    <Box>
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
          <CircularProgress size={24} />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          Error al cargar pedidos confirmados.
        </Alert>
      )}

      {!isLoading && pedidosConfirmados.length === 0 && (
        <Box
          sx={{
            py: 3,
            px: 2,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1.5,
            textAlign: "center"
          }}>

          <Typography variant="body2" color="text.secondary">
            No hay pedidos confirmados para este chofer.
          </Typography>
        </Box>
      )}

      <Grid container spacing={1.5}>
        {pedidosConfirmados.map((pedido) => (
          <Grid item xs={12} sm={6} md={4} key={pedido.id_pedido}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 1.5,
                bgcolor: "background.default",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ flex: 1, p: 2 }}>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  gap={1}
                  mb={1}>

                  <Typography variant="subtitle2" fontWeight={800}>
                    Pedido #{pedido.id_pedido}
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    gap={0.5}
                  >
                    <Chip
                      icon={<CheckCircle />}
                      label="Confirmado"
                      size="small"
                      color="success"
                      sx={{ fontWeight: 800 }} />
                    <Typography variant="subtitle2" fontWeight={900}>
                      {formatCLP(getTotalPedido(pedido))}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>

                  {pedido.cliente?.direccion ||
                    pedido.Cliente?.direccion ||
                    "Dirección no registrada"}
                </Typography>

                <Divider sx={{ my: 1.2 }} />

                <Typography variant="caption" fontWeight={800} color="text.secondary">
                  Productos
                </Typography>
                {(pedido.productos ?? []).map((prod, index) => {
                  const nombre =
                    prod.nombre_producto ||
                    prod.nombre_insumo ||
                    "Ítem desconocido";
                  const subtotal = getSubtotalItem(prod);
                  const precioUnitario = Number(prod.precio_unitario) || 0;
                  return (
                    <Box
                      key={index}
                      sx={{
                        py: 0.35,
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={1}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            minWidth: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {nombre} (x{prod.cantidad})
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          sx={{ flexShrink: 0 }}
                        >
                          {formatCLP(subtotal)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        P/U {formatCLP(precioUnitario)}
                      </Typography>
                    </Box>
                  );
                })}

                <Divider sx={{ my: 1.2 }} />

                <Typography variant="body2" color="text.secondary">
                  Fecha pedido:{" "}
                  {pedido.fecha_pedido
                    ? new Date(pedido.fecha_pedido).toLocaleDateString()
                    : "Sin fecha"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

PedidosConfirmadosList.propTypes = {
  idChofer: PropTypes.string.isRequired,
  setProductosReservados: PropTypes.func.isRequired,
};

export default PedidosConfirmadosList;
