import { Box, Button, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useGenerarVentasEstadisticasMutation } from "../../store/services/ventasEstadisticasApi";
import { useGenerarPedidosEstadisticasMutation } from "../../store/services/pedidosEstadisticasApi";
import { useGenerarProductoEstadisticasMutation } from "../../store/services/productosEstadisticasApi";
import { convertirChileAUtc, obtenerFechaChile } from "../../utils/fechaUtils";

const Analisis = () => {
  const hoy = convertirChileAUtc(obtenerFechaChile().format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  const [generarVentas, { isLoading: loadingVentas }] =
    useGenerarVentasEstadisticasMutation();
  const [generarPedidos, { isLoading: loadingPedidos }] =
    useGenerarPedidosEstadisticasMutation();
  const [generarProductos, { isLoading: loadingProductos }] =
    useGenerarProductoEstadisticasMutation();

  const handleGenerar = async (callback, tipo) => {
    try {
      await callback({ fecha: hoy });
      dispatch(
        showNotification({
          message: `✅ Estadísticas de ${tipo} generadas para ${hoy}`,
          severity: "success",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        showNotification({
          message: `❌ Error al generar estadísticas de ${tipo}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <BackButton to="/admin" label="Volver al menú" />

      <Typography variant="h4" gutterBottom>
        <AnalyticsIcon fontSize="large" sx={{ mr: 1 }} />
        Generar Estadísticas
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Ejecuta procesos manuales para generar estadísticas del día.
      </Typography>

      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ py: 3, px: 4, fontSize: "1rem" }}
          startIcon={<PointOfSaleIcon fontSize="large" />}
          disabled={loadingVentas}
          onClick={() => handleGenerar(generarVentas, "ventas")}
        >
          Ventas
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ py: 3, px: 4, fontSize: "1rem" }}
          startIcon={<ShoppingCartIcon fontSize="large" />}
          disabled={loadingPedidos}
          onClick={() => handleGenerar(generarPedidos, "pedidos")}
        >
          Pedidos
        </Button>

        <Button
          variant="contained"
          color="success"
          size="large"
          sx={{ py: 3, px: 4, fontSize: "1rem" }}
          startIcon={<InventoryIcon fontSize="large" />}
          disabled={loadingProductos}
          onClick={() => handleGenerar(generarProductos, "productos")}
        >
          Productos
        </Button>
      </Stack>
    </Box>
  );
};

export default Analisis;
0