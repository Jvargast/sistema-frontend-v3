import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CircularProgress, Alert, Divider, Chip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useGetPedidosConfirmadosQuery } from "../../store/services/pedidosApi";
import Box from "../common/CompatBox";
import Grid from "../common/CompatGrid";
import Typography from "../common/CompatTypography";

const PedidosConfirmadosList = ({ idChofer, setProductosReservados }) => {
  const {
    data: pedidos,
    isLoading,
    isError,
  } = useGetPedidosConfirmadosQuery(idChofer, {
    skip: !idChofer,
  });

  const [pedidosConfirmados, setPedidosConfirmados] = useState([]);

  useEffect(() => {
    if (pedidos) {
      setPedidosConfirmados(pedidos);
      const productosReservadosDetalle = pedidos.flatMap((pedido) =>
        pedido.productos
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
    }
  }, [pedidos, setProductosReservados]);

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
                  <Chip
                    icon={<CheckCircle />}
                    label="Confirmado"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 800 }} />
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

                  {pedido.cliente.direccion}
                </Typography>

                <Divider sx={{ my: 1.2 }} />

                <Typography variant="caption" fontWeight={800} color="text.secondary">
                  Productos
                </Typography>
                {pedido.productos.map((prod, index) => {
                  const nombre =
                    prod.nombre_producto ||
                    prod.nombre_insumo ||
                    "Ítem desconocido";
                  return (
                    <Typography
                      variant="body2"
                      key={index}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {nombre} (x{prod.cantidad})
                    </Typography>
                  );
                })}

                <Divider sx={{ my: 1.2 }} />

                <Typography variant="body2" color="text.secondary">
                  Fecha pedido: {new Date(pedido.fecha_pedido).toLocaleDateString()}
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
