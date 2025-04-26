import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useGetPedidosConfirmadosQuery } from "../../store/services/pedidosApi";

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
    <Box mt={3}>
      <Typography variant="h6" fontWeight="bold" textAlign="center">
        📋 Pedidos Confirmados para el Chofer
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          ❌ Error al cargar pedidos confirmados.
        </Alert>
      )}

      {!isLoading && pedidosConfirmados.length === 0 && (
        <Typography textAlign="center" color="gray" mt={2}>
          No hay pedidos confirmados para este chofer.
        </Typography>
      )}

      <Grid container spacing={2} justifyContent="center" mt={2}>
        {pedidosConfirmados.map((pedido) => (
          <Grid item xs={12} sm={6} md={4} key={pedido.id_pedido}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                bgcolor: "background.paper",
                height: "100%", // 🔹 Hace que todas las tarjetas tengan la misma altura
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // 🔹 Asegura que el contenido esté bien distribuido
                minHeight: "250px", // 🔹 Altura mínima para evitar colapsos en diferentes pantallas
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Pedido #{pedido.id_pedido}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {pedido.cliente.direccion}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body1" fontWeight="bold" color="primary">
                  🛒 Productos:
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
                      - {nombre} (x{prod.cantidad})
                    </Typography>
                  );
                })}

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" color="text.secondary">
                  📅 Fecha Pedido:{" "}
                  {new Date(pedido.fecha_pedido).toLocaleDateString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  sx={{
                    textTransform: "none",
                    width: "90%",
                    cursor: "default",
                  }}
                >
                  Confirmado
                </Button>
              </CardActions>
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
