import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useGenerarVentasEstadisticasMutation } from "../../store/services/ventasEstadisticasApi";
import { useGenerarPedidosEstadisticasMutation } from "../../store/services/pedidosEstadisticasApi";
import { useGenerarProductoEstadisticasMutation } from "../../store/services/productosEstadisticasApi";
import { useGetReporteDiarioQuery } from "../../store/services/reportesAnalisisApi";
import { convertirChileAUtc, obtenerFechaChile } from "../../utils/fechaUtils";
import { exportarReporteDiarioExcel } from "../../utils/exportarAnalisisExcel";

const Analisis = () => {
  const hoyChile = obtenerFechaChile();
  const fechaReporte = hoyChile.format("YYYY-MM-DD"); 
  const fechaLabel = hoyChile.format("DD-MM-YYYY");
  const hoyUtc = convertirChileAUtc(fechaReporte);

  const dispatch = useDispatch();
  const { activeSucursalId, sucursales } = useSelector((s) => s.scope);

  const sucursal = sucursales?.find(
    (s) => Number(s.id_sucursal) === Number(activeSucursalId)
  );
  const sucursalNombre = sucursal?.nombre || "Todas";

  const [generarVentas, { isLoading: loadingVentas }] =
    useGenerarVentasEstadisticasMutation();
  const [generarPedidos, { isLoading: loadingPedidos }] =
    useGenerarPedidosEstadisticasMutation();
  const [generarProductos, { isLoading: loadingProductos }] =
    useGenerarProductoEstadisticasMutation();

  const {
    data: reporte,
    isLoading: loadingReporte,
    isFetching: fetchingReporte,
  } = useGetReporteDiarioQuery({
    fecha: fechaReporte,
    id_sucursal: activeSucursalId ?? undefined,
  });

  const handleGenerar = async (trigger, tipo) => {
    try {
      const resp = await trigger({ fecha: hoyUtc }).unwrap();

      const detalle =
        typeof resp === "object" && resp
          ? resp.count != null
            ? ` (${resp.count} registro(s))`
            : ""
          : "";

      dispatch(
        showNotification({
          message: `Estadísticas de ${tipo} generadas para ${fechaLabel}${detalle}`,
          severity: "success",
        })
      );
    } catch (err) {
      console.error(err);
      const msg =
        err?.data?.error ||
        err?.error ||
        `Error al generar estadísticas de ${tipo}`;
      dispatch(showNotification({ message: `❌ ${msg}`, severity: "error" }));
    }
  };

  const anyLoading = loadingVentas || loadingPedidos || loadingProductos;

  const handleExportarReporte = () => {
    if (!reporte) {
      dispatch(
        showNotification({
          message: "No hay datos de reporte para exportar.",
          severity: "warning",
        })
      );
      return;
    }

    exportarReporteDiarioExcel({
      fecha: reporte.fecha,
      sucursalNombre,
      ventasEst: reporte.detalle.ventasPorTipoEntrega,
      pedidosEst: reporte.detalle.pedidos,
      productosEst: reporte.detalle.productos,
      pagosEst: reporte.detalle.pagos,
      ventasChoferEst: reporte.detalle.ventasPorChofer,
      entregasEst: reporte.detalle.entregasPorChofer,
      onExportSuccess: (fileName) =>
        dispatch(
          showNotification({
            message: `Reporte diario exportado: ${fileName}`,
            severity: "success",
          })
        ),
    });
  };

  const reporteCargando = loadingReporte || fetchingReporte;

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ alignSelf: "flex-start" }}>
        <BackButton to="/admin" label="Volver al menú" />
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          <AnalyticsIcon fontSize="large" sx={{ mr: 1 }} />
          Generar Estadísticas
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Ejecuta procesos manuales para generar estadísticas del día{" "}
          <strong>{fechaLabel}</strong>.
        </Typography>

        <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 3, px: 4, fontSize: "1rem" }}
            startIcon={<PointOfSaleIcon fontSize="large" />}
            disabled={anyLoading}
            onClick={() => handleGenerar(generarVentas, "ventas")}
          >
            {loadingVentas ? "Generando…" : "Ventas"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ py: 3, px: 4, fontSize: "1rem" }}
            startIcon={<ShoppingCartIcon fontSize="large" />}
            disabled={anyLoading}
            onClick={() => handleGenerar(generarPedidos, "pedidos")}
          >
            {loadingPedidos ? "Generando…" : "Pedidos"}
          </Button>

          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ py: 3, px: 4, fontSize: "1rem" }}
            startIcon={<InventoryIcon fontSize="large" />}
            disabled={anyLoading}
            onClick={() => handleGenerar(generarProductos, "productos")}
          >
            {loadingProductos ? "Generando…" : "Productos"}
          </Button>
        </Stack>
      </Paper>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography variant="h5" gutterBottom>
          <AssessmentIcon sx={{ mr: 1 }} />
          Reporte diario ejecutivo
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Fecha: <strong>{fechaLabel}</strong> · Sucursal:{" "}
          <strong>{sucursalNombre}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Descarga un Excel con el resumen de ventas, pedidos, productos, pagos
          y desempeño de choferes para el día seleccionado.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AssessmentIcon />}
            disabled={reporteCargando || !reporte}
            onClick={handleExportarReporte}
            sx={{ textTransform: "none" }}
          >
            {reporteCargando
              ? "Preparando reporte…"
              : "Exportar reporte diario (Excel)"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analisis;
