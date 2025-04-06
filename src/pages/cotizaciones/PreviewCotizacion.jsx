import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  useGetCotizacionByIdQuery,
  useUpdateCotizacionMutation,
} from "../../store/services/cotizacionesApi";
import EncabezadoCotizacion from "../../components/cotizacion/EncabezadoCotizacion";
import InformacionEmpresaYFechas from "../../components/cotizacion/InformacionEmpresaYFechas";
import InformacionVendedorYCliente from "../../components/cotizacion/InformacionVendedorYCliente";
import DetallesCotizacion from "../../components/cotizacion/DetallesCotizacion";
import ResumenCotizacion from "../../components/cotizacion/ResumenCotizacion";
import { useEffect, useState } from "react";
import { Close, Edit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";

const PreviewCotizacion = () => {
  const { id } = useParams();
  const {
    data: cotizacionData,
    isLoading,
    error,
  } = useGetCotizacionByIdQuery(id);

  const dispatch = useDispatch();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [notas, setNotas] = useState("");
  const [impuesto, setImpuesto] = useState(0.19);
  const [descuento, setDescuento] = useState(0);
  const [detallesEditables, setDetallesEditables] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const [updateCotizacion, { isLoading: isUpdating }] =
    useUpdateCotizacionMutation();

  useEffect(() => {
    if (cotizacionData?.cotizacion && cotizacionData?.detalles) {
      const { cotizacion, detalles } = cotizacionData;

      const totalNeto = detalles.reduce(
        (acc, item) => acc + (item.cantidad || 0) * (item.precio_unitario || 0),
        0
      );

      setNotas(cotizacion.notas || "");
      setImpuesto(cotizacion.impuesto || 0.19);
      setDescuento(
        cotizacion.total
          ? 1 - (cotizacion.total - cotizacion.impuestos_totales) / totalNeto
          : 0
      );
      setDetallesEditables(
        detalles.map((d) => ({
          ...d,
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio_unitario),
        }))
      );
      setFechaVencimiento(cotizacion.fecha_vencimiento || "");
    }
  }, [cotizacionData]);

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

  if (error || !cotizacionData?.cotizacion || !cotizacionData?.detalles) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="error">
          Error al cargar la cotización.
        </Typography>
      </Box>
    );
  }

  const { cotizacion } = cotizacionData;
  const detalles = modoEdicion ? detallesEditables : cotizacionData.detalles;

  const totalNeto = detalles.reduce(
    (acc, item) => acc + (item.cantidad || 0) * (item.precio_unitario || 0),
    0
  );

  const iva = totalNeto * (isNaN(impuesto) ? 0 : impuesto);
  const totalFinal = totalNeto + iva;

  const handlerUpdateCotizacion = async () => {
    try {
      await updateCotizacion({
        id: cotizacion.id_cotizacion,
        body: {
          impuesto: isNaN(impuesto) || impuesto === "" ? 0 : impuesto,
          descuento_total_porcentaje:
            isNaN(descuento) || descuento === "" ? 0 : descuento,
          notas,
          fecha_vencimiento: fechaVencimiento,
          detalles_actualizados: detallesEditables.map((d) => ({
            id_detalle: d.id_detalle,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
          })),
        },
      });
      setModoEdicion(false);
      dispatch(
        showNotification({
          message: "Se ha actualizado correctamente",
          severity: "success",
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: `Error al actualizar cotización: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" py={6}>
      <BackButton to="/cotizaciones" label="Volver a Cotizaciones"/>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 5 }}>
          <EncabezadoCotizacion id={cotizacion.id_cotizacion} />

          <Grid container spacing={4} mb={4}>
            <InformacionEmpresaYFechas
              empresa={cotizacion.vendedor.Empresa}
              fecha={cotizacion.fecha}
              fecha_vencimiento={fechaVencimiento}
              modoEdicion={modoEdicion}
              onChangeFechaVencimiento={(value) => setFechaVencimiento(value)}
            />

            <InformacionVendedorYCliente
              vendedor={cotizacion.vendedor}
              cliente={cotizacion.cliente}
            />
          </Grid>

          <DetallesCotizacion
            detalles={detalles.map((d) => ({
              ...d,
              cantidad: Number(d.cantidad),
              precio_unitario: Number(d.precio_unitario),
            }))}
            modoEdicion={modoEdicion}
            onDetalleChange={(index, field, value) => {
              const nuevos = [...detallesEditables];
              nuevos[index][field] = value;
              setDetallesEditables(nuevos);
            }}
          />

          <ResumenCotizacion
            totalNeto={Number(totalNeto)}
            iva={iva}
            totalFinal={totalFinal}
            impuesto={Number(impuesto)}
            descuento={Number(descuento)}
            notas={notas}
            modoEdicion={modoEdicion}
            onChange={(campo, valor) => {
              if (campo === "impuesto") setImpuesto(valor);
              if (campo === "descuento") setDescuento(valor);
              if (campo === "notas") setNotas(valor);
            }}
          />
          <Box mt={4} textAlign="center">
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Button
                variant={modoEdicion ? "contained" : "outlined"}
                color={modoEdicion ? "error" : "info"}
                startIcon={modoEdicion ? <Close /> : <Edit />}
                onClick={() => setModoEdicion((prev) => !prev)}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: modoEdicion ? 3 : 1,
                  minWidth: 200,
                }}
              >
                {modoEdicion ? "Cancelar edición" : "Editar Cotización"}
              </Button>

              {modoEdicion && (
                <Button
                  variant="contained"
                  color="success"
                  size="medium"
                  onClick={handlerUpdateCotizacion}
                  disabled={isUpdating}
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: 3,
                    minWidth: 200,
                  }}
                >
                  Guardar cambios
                </Button>
              )}
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            mt={4}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PictureAsPdfIcon />}
              href={`${import.meta.env.VITE_API_URL}/cotizaciones/${
                cotizacion.id_cotizacion
              }/pdf?mostrar_impuestos=true`}
              target="_blank"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: 3,
                minWidth: 220,
                bgcolor: "#1e88e5",
                "&:hover": {
                  bgcolor: "#b9cee6",
                },
              }}
            >
              Descargar con impuestos
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<PictureAsPdfIcon />}
              href={`${import.meta.env.VITE_API_URL}/cotizaciones/${
                cotizacion.id_cotizacion
              }/pdf?mostrar_impuestos=false`}
              target="_blank"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: 2,
                minWidth: 220,
                bgcolor: "#546e7a",
                "&:hover": {
                  bgcolor: "#455a64",
                },
              }}
            >
              Descargar sin impuestos
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreviewCotizacion;
