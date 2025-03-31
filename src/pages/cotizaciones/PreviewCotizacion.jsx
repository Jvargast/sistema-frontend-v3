import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";
import { useGetCotizacionByIdQuery } from "../../store/services/cotizacionesApi";
import EncabezadoCotizacion from "../../components/cotizacion/EncabezadoCotizacion";
import InformacionEmpresaYFechas from "../../components/cotizacion/InformacionEmpresaYFechas";
import InformacionVendedorYCliente from "../../components/cotizacion/InformacionVendedorYCliente";
import DetallesCotizacion from "../../components/cotizacion/DetallesCotizacion";
import ResumenCotizacion from "../../components/cotizacion/ResumenCotizacion";


const PreviewCotizacion = () => {
  const { id } = useParams();
  const {
    data: cotizacionData,
    isLoading,
    error,
  } = useGetCotizacionByIdQuery(id);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !cotizacionData) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="error">
          Error al cargar la cotización.
        </Typography>
      </Box>
    );
  }

  const { cotizacion, detalles } = cotizacionData;
  const totalNeto = detalles.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );
  const iva = totalNeto * cotizacion.impuesto;
  const totalFinal = totalNeto + iva;

  return (
    <Box maxWidth="lg" mx="auto" py={6}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 5 }}>
          <EncabezadoCotizacion id={cotizacion.id_cotizacion} />

          <Grid container spacing={4} mb={4}>
            <InformacionEmpresaYFechas
              empresa={cotizacion.empresa}
              fecha={cotizacion.fecha}
              fecha_vencimiento={cotizacion.fecha_vencimiento}
            />
            <InformacionVendedorYCliente
              vendedor={cotizacion.vendedor}
              cliente={cotizacion.cliente}
            />
          </Grid>

          <DetallesCotizacion detalles={detalles} />

          <ResumenCotizacion
            totalNeto={totalNeto}
            iva={iva}
            totalFinal={totalFinal}
            impuesto={cotizacion.impuesto}
          />

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={`${import.meta.env.VITE_API_URL}/cotizaciones/${
                cotizacion.id_cotizacion
              }/pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar PDF
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreviewCotizacion;
