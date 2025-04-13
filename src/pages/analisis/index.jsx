import { Box, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useGenerarVentasEstadisticasMutation } from "../../store/services/ventasEstadisticasApi";
import { useGenerarPedidosEstadisticasMutation } from "../../store/services/pedidosEstadisticasApi";
import { useGenerarProductoEstadisticasMutation } from "../../store/services/productosEstadisticasApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";

const Analisis = () => {
  dayjs.extend(utc);
  const hoy = dayjs().utc().format("YYYY-MM-DD");
  const dispatch = useDispatch();
  console.log("Enviando request con fecha:", hoy);

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
      //alert(`✅ Estadísticas de ${tipo} generadas para ${hoy}`);
    } catch (err) {
      console.error(err);
      dispatch(
        showNotification({
          message: `❌ Error al generar estadísticas de ${tipo}`,
          severity: "error",
        })
      );
      //alert(`❌ Error al generar estadísticas de ${tipo}`);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <BackButton to="/admin" label="Volver al menú" />

      <Typography variant="h4" gutterBottom>
        🧠 Generar Estadísticas Manuales
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Esta sección te permite ejecutar los procesos de análisis por fecha.
      </Typography>

      <Stack direction="column" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={loadingVentas}
          onClick={() => handleGenerar(generarVentas, "ventas")}
        >
          Generar estadísticas de ventas (hoy)
        </Button>

        <Button
          variant="contained"
          color="secondary"
          disabled={loadingPedidos}
          onClick={() => handleGenerar(generarPedidos, "pedidos")}
        >
          Generar estadísticas de pedidos (hoy)
        </Button>

        <Button
          variant="contained"
          color="success"
          disabled={loadingProductos}
          onClick={() => handleGenerar(generarProductos, "productos")}
        >
          Generar estadísticas de productos (hoy)
        </Button>
      </Stack>
    </Box>
  );
};

export default Analisis;
