import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Chip,
  Avatar,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetProductoByIdQuery } from "../../store/services/productoApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import { Info } from "../../components/productos/Info";

const VerProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  const {
    data: productoData,
    isLoading,
    isError,
    refetch,
  } = useGetProductoByIdQuery(id);

  const formData = useMemo(() => {
    if (!productoData) return {};

    const {
      id_producto,
      nombre_producto,
      marca,
      codigo_barra,
      precio,
      descripcion,
      fecha_de_creacion,
      tipo,
      activo,
      categoria,
      estadoProducto,
      inventario,
      image_url,
      es_para_venta,
      es_retornable,
    } = productoData;

    return {
      id_producto,
      nombre_producto,
      marca: marca || "No especificada",
      codigo_barra: codigo_barra || "No especificado",
      precio:
        precio !== null
          ? `$ ${Number(precio).toLocaleString("es-CL")}`
          : "No especificado",
      descripcion: descripcion || "No disponible",
      fecha_de_creacion,
      tipo,
      activo,
      categoria: categoria?.nombre_categoria || "No especificada",
      estado: estadoProducto?.nombre_estado || "No especificado",
      inventario_cantidad: inventario?.cantidad ?? "—",
      inventario_actualizado: inventario?.fecha_actualizacion ?? null,
      image_url,
      es_para_venta,
      es_retornable,
    };
  }, [productoData]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/productos/ver/${id}`, { replace: true });
    }
  }, [location.state, refetch, navigate, id]);

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el producto.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el producto.</Typography>;
  }

  return (
    <Box m={3}>
      <BackButton to="/productos" label="Volver" />

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 4,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              variant="rounded"
              src={
                formData.image_url ||
                "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
              }
              alt={formData.nombre_producto}
              sx={{
                width: 72,
                height: 72,
                bgcolor: theme.palette.grey[300],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!formData.image_url && (
                <ImageNotSupportedIcon
                  sx={{ fontSize: 36, color: theme.palette.grey[700] }}
                />
              )}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight="bold">
                {formData.nombre_producto}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                ID #{formData.id_producto}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`/productos/editar/${formData.id_producto}`)
            }
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
          >
            Editar Producto
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Info label="Marca" value={formData.marca} />
            <Info label="Código de Barra" value={formData.codigo_barra} />
            <Info label="Precio" value={formData.precio} />
            <Info label="Tipo" value={formData.tipo} />
            <Info label="Fecha de Creación">
              {formData.fecha_de_creacion
                ? format(new Date(formData.fecha_de_creacion), "dd-MM-yyyy", {
                    locale: es,
                  })
                : "No especificada"}
            </Info>
          </Grid>

          <Grid item xs={12} md={6}>
            <Info label="Categoría" value={formData.categoria} />
            <Info label="Estado" value={formData.estado} />
            <Info
              label="Inventario Disponible"
              value={formData.inventario_cantidad}
            />
            <Info label="Última Actualización Inventario">
              {formData.inventario_actualizado
                ? format(
                    new Date(formData.inventario_actualizado),
                    "dd-MM-yyyy HH:mm",
                    {
                      locale: es,
                    }
                  )
                : "—"}
            </Info>

            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={formData.activo ? "Activo" : "Inactivo"}
                color={formData.activo ? "success" : "error"}
              />
              <Chip
                label={formData.es_para_venta ? "Para Venta" : "Uso Interno"}
                color={formData.es_para_venta ? "primary" : "default"}
              />
              <Chip
                label={formData.es_retornable ? "Retornable" : "No Retornable"}
                color={formData.es_retornable ? "secondary" : "default"}
              />
            </Box>
          </Grid>
        </Grid>

        <Box
          mt={4}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            boxShadow: theme.shadows[1],
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              mb: 1,
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              display: "inline-block",
              paddingBottom: 0.5,
            }}
          >
            Descripción
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              whiteSpace: "pre-line",
              color: theme.palette.text.primary,
              lineHeight: 1.6,
              textAlign: "justify",
            }}
          >
            {formData.descripcion}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerProducto;
