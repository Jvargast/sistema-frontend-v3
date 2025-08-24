import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import BackButton from "../../components/common/BackButton";
import InfoVenta from "../../components/venta/ver_venta/InfoVenta";
import DetallesVenta from "../../components/venta/ver_venta/DetallesVenta";
import DocumentosVenta from "../../components/venta/ver_venta/DocumentosVenta";
import PagosVenta from "../../components/venta/ver_venta/PagosVenta";
import { useGetVentaByIdQuery } from "../../store/services/ventasApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const VerVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const { venta, detalles, documentos, pagos, factura, pedido } = data;

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

      {(String(venta?.tipo_entrega) === "despacho_a_domicilio" ||
        String(venta?.tipo_entrega) === "pedido_pagado_anticipado") &&
        pedido?.id_pedido && (
          <Box mb={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => navigate(`/admin/pedidos/ver/${pedido.id_pedido}`)}
              startIcon={<LocalShippingIcon />}
              endIcon={<ArrowOutwardIcon />}
              sx={{
                borderRadius: 999,
                px: 2.4,
                py: 1.1,
                fontWeight: 700,
                textTransform: "none",
                letterSpacing: 0.2,
                color: "#fff",
                background: "linear-gradient(90deg, #2563eb, #06b6d4)",
                boxShadow: "0 6px 18px rgba(0,0,0,.12)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1d4ed8, #0891b2)",
                  boxShadow: "0 10px 24px rgba(0,0,0,.18)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Ver pedido #{pedido.id_pedido}
            </Button>
          </Box>
        )}

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
            <DocumentosVenta
              documentos={documentos}
              id_factura={factura?.id_cxc}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <PagosVenta
              pagos={pagos.map((pago) => ({
                ...pago,
                rows: pago.rows.map((row) => ({
                  ...row,
                  referencia: row.referencia ?? "",
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
