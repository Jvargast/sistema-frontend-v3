import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import BackButton from "../../components/common/BackButton";
import InfoVenta from "../../components/venta/ver_venta/InfoVenta";
import DetallesVenta from "../../components/venta/ver_venta/DetallesVenta";
import DocumentosVenta from "../../components/venta/ver_venta/DocumentosVenta";
import PagosVenta from "../../components/venta/ver_venta/PagosVenta";
import { useGetVentaByIdQuery } from "../../store/services/ventasApi";
import LoaderComponent from "../../components/common/LoaderComponent";

const VerVenta = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useGetVentaByIdQuery(id);

  if (isLoading) return <LoaderComponent />;
  if (error || !data) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error" fontWeight="bold" fontSize={18}>
          ❌ Error al cargar la venta.
        </Typography>
      </Box>
    );
  }

  const { venta, detalles, documentos, pagos } = data;

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: 3,
        pb: { xs: 10, sm: 4 },
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <BackButton to="/admin/ventas" label="Volver a Ventas" />

      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 3,
          background: "linear-gradient(135deg, #007AFF, #004C8C)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          fontSize={{ xs: 18, sm: 22 }}
        >
          📄 Detalle de la Venta #{venta.id_venta}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <InfoVenta venta={venta} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <DetallesVenta
              detalles={detalles.map((detalle) => ({
                ...detalle,
                subtotal: parseFloat(detalle.subtotal || 0),
              }))}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <DocumentosVenta documentos={documentos} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <PagosVenta
              pagos={pagos.map((pago) => ({
                ...pago,
                rows: pago.rows.map((row) => ({
                  ...row,
                  referencia: row.referencia ?? "", // ⚠️ solución al warning
                })),
              }))}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VerVenta;
