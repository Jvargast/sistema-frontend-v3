import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import BackButton from "../../components/common/BackButton";
import { useGetPedidoByIdQuery } from "../../store/services/pedidosApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import DetallesPedido from "../../components/pedido/DetallesPedido";
import InfoPedido from "../../components/pedido/PedidoInfo";
import { useState } from "react";
import ModalPagoPedido from "../../components/pedido/ModalPago";
import { useGetVentaByIdQuery } from "../../store/services/ventasApi";
import { useGetCuentaPorCobrarByVentaIdQuery } from "../../store/services/cuentasPorCobrarApi";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { PointOfSale, ReceiptLong, OpenInNew } from "@mui/icons-material";

const VerPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data, error, isLoading } = useGetPedidoByIdQuery(id);
  const { data: ventaData } = useGetVentaByIdQuery(data?.id_venta, {
    skip: !data?.id_venta,
  });

  const [openPago, setOpenPago] = useState(false);
  const tipoDocumento = ventaData?.documentos[0]?.tipo_documento || "boleta";

  const mostrarBotonPago = data?.pagado !== true && tipoDocumento !== "factura";

  const { data: facturaData } = useGetCuentaPorCobrarByVentaIdQuery(
    data?.id_venta,
    {
      skip: !data?.id_venta || tipoDocumento !== "factura",
    }
  );

  const hasVenta = Boolean(data?.id_venta);
  const ventaResumen = hasVenta
    ? {
        id: data.id_venta,
        numeroDoc: ventaData?.documentos?.[0]?.numero ?? null,
        fecha: ventaData?.venta?.fecha
          ? new Date(ventaData.venta.fecha).toLocaleString()
          : null,
        total:
          ventaData?.venta?.total != null
            ? Number(ventaData.venta.total)
            : null,
      }
    : null;

  if (isLoading) return <LoaderComponent />;

  if (error || !data) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error" fontWeight="bold" fontSize={18}>
          ❌ Error al cargar el pedido.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 3 },
        maxWidth: "1200px",
        mx: "auto",
        width: "100%",
      }}
    >
      <BackButton to="/admin/pedidos" label="Volver a Pedidos" />

      {hasVenta && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 2.5,
            borderRadius: 2,
            border: `1px dashed ${theme.palette.primary.main}`,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(25,118,210,0.15), rgba(25,118,210,0.05))"
                : "linear-gradient(135deg, #F0F7FF, #FFFFFF)",
          }}
        >
          <Box
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={1.25}
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1.25} flexWrap="wrap">
              <Chip
                icon={<PointOfSale />}
                label={`Venta asociada #${ventaResumen?.id}`}
                color="primary"
                variant="filled"
                sx={{ fontWeight: 700 }}
              />
              {ventaResumen?.numeroDoc && (
                <Chip
                  icon={<ReceiptLong />}
                  label={ventaResumen.numeroDoc}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {ventaResumen?.fecha && (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {ventaResumen.fecha}
                </Typography>
              )}
              {ventaResumen?.total != null && (
                <Typography variant="body2" fontWeight={700} color="primary">
                  Total: ${ventaResumen.total.toLocaleString()}
                </Typography>
              )}

              {tipoDocumento === "factura" &&
                facturaData?.estado === "pendiente" && (
                  <Chip
                    label="Factura pendiente"
                    color="warning"
                    sx={{ fontWeight: 700 }}
                  />
                )}
            </Box>

            <Box display="flex" gap={1}>
              {tipoDocumento === "factura" &&
                facturaData?.estado === "pendiente" && (
                  <Button
                    variant="contained"
                    endIcon={<OpenInNew />}
                    onClick={() =>
                      navigate(`/facturas/ver/${facturaData.id_cxc}`)
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    Ir a factura
                  </Button>
                )}
              <Button
                variant="outlined"
                endIcon={<OpenInNew />}
                onClick={() => navigate(`/admin/ventas/ver/${ventaResumen.id}`)}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                Ver venta
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          mb: 3,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0b1020 0%, #111827 100%)"
              : "linear-gradient(135deg, #f6f9fc 0%, #eef5ff 100%)",
          color:
            theme.palette.mode === "dark"
              ? theme.palette.grey[100]
              : theme.palette.text.primary,

          boxShadow: theme.shadows[5],
        }}
      >
        <Chip
          label={`Estado: ${data.estado_pago || "Desconocido"}`}
          color={data.pagado ? "success" : "warning"}
          sx={{
            fontWeight: "bold",
            mb: 2,
            bgcolor: data.pagado
              ? theme.palette.success.main
              : theme.palette.warning.main,
            color: theme.palette.getContrastText(
              data.pagado
                ? theme.palette.success.main
                : theme.palette.warning.main
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.25,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(45, 32, 32, 0.009)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(2px)",
            }}
          >
            <LocalShippingIcon fontSize="small" />
          </Box>

          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: 0.2, color: "inherit" }}
          >
            Pedido{" "}
            <Box component="span" sx={{ fontWeight: 900 }}>
              #{data.id_pedido}
            </Box>
          </Typography>
        </Box>

        {mostrarBotonPago && (
          <Box display="flex" justifyContent="center" mb={1}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenPago(true)}
              sx={{
                fontWeight: "bold",
                px: 3,
                py: 1.2,
                fontSize: "1.04rem",
                boxShadow: theme.shadows[2],
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Registrar Pago
            </Button>
          </Box>
        )}

        <ModalPagoPedido
          open={openPago}
          onClose={() => setOpenPago(false)}
          pedido={data}
        />
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <InfoPedido pedido={data} />
        </Grid>

        <Grid item xs={12} md={7}>
          <DetallesPedido detalles={data.DetallesPedido} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VerPedido;
