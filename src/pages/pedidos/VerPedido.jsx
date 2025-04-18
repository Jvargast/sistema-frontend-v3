import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import BackButton from "../../components/common/BackButton";
import { useGetPedidoByIdQuery } from "../../store/services/pedidosApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import DetallesPedido from "../../components/pedido/DetallesPedido";
import InfoPedido from "../../components/pedido/PedidoInfo";
import { useState } from "react";
import ModalPagoPedido from "../../components/pedido/ModalPago";
import { useGetVentaByIdQuery } from "../../store/services/ventasApi";

const VerPedido = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetPedidoByIdQuery(id);
  const { data: ventaData } = useGetVentaByIdQuery(data?.id_venta, {
    skip: !data?.id_venta,
  });
  const [openPago, setOpenPago] = useState(false);
  const tipoDocumento = ventaData?.documentos[0]?.tipo_documento || "boleta"


  const mostrarBotonPago =
  data?.pagado !== true && tipoDocumento !== "factura";

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
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      <BackButton to="/pedidos" label="Volver a Pedidos" />

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          background: "linear-gradient(135deg, #3f51b5, #2196f3)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
          📦 Detalles del Pedido #{data.id_pedido}
        </Typography>

        {mostrarBotonPago && (
          <Box display="flex" justifyContent="center" mb={1}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenPago(true)}
              sx={{ fontWeight: "bold", px: 3 }}
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
