import { useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Grid,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetClienteByIdQuery } from "../../store/services/clientesApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import { useSelector } from "react-redux";

const VerCliente = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const { mode, activeSucursalId } = useSelector((s) => s.scope);

  const {
    data: clienteData,
    isLoading,
    isError,
    refetch,
  } = useGetClienteByIdQuery({
    id,
    id_sucursal:
      mode !== "global" && Number(activeSucursalId)
        ? Number(activeSucursalId)
        : undefined,
  });

  const formData = clienteData
    ? {
        id_cliente: clienteData?.id_cliente || "No hay id",
        rut: clienteData?.rut || "No especificado",
        tipo_cliente: clienteData?.tipo_cliente || "No especificado",
        razon_social: clienteData?.razon_social || "No especificado",
        nombre: clienteData?.nombre || "No especificado",
        apellido: clienteData?.apellido || "No especificado",
        direccion: clienteData?.direccion || "No especificada",
        telefono: clienteData?.telefono || "No especificado",
        email: clienteData?.email || "No especificado",
        fecha_registro: clienteData?.fecha_registro || null,
        activo: clienteData?.activo,
        sucursales: clienteData?.Sucursales ?? [],
      }
    : {};

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/clientes/ver/${id}`, { replace: true });
    } else {
      refetch();
    }
  }, [location.state, refetch, navigate, id, mode, activeSucursalId]);

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el cliente.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el cliente.</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 950, margin: "0 auto" }}>
      <BackButton to="/clientes" label="Volver" />
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          mt: 2,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color={theme.palette.primary.main}
            letterSpacing={0.5}
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
            }}
          >
            Información del Cliente
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/clientes/editar/${formData.id_cliente}`)}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 3,
              px: 3,
              boxShadow: "none",
              transition: "background 0.2s",
              background: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.dark,
              },
            }}
          >
            Editar Cliente
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                RUT
              </Typography>
              <Typography variant="body1">{formData.rut}</Typography>
            </Box>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Nombre
              </Typography>
              <Typography variant="body1">{formData.nombre}</Typography>
            </Box>
            {formData.tipo_cliente?.toLowerCase() === "empresa" && (
              <Box mb={2}>
                <Typography
                  variant="overline"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Razón Social
                </Typography>
                <Typography variant="body1">{formData.razon_social}</Typography>
              </Box>
            )}
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Email
              </Typography>
              <Typography variant="body1">{formData.email}</Typography>
            </Box>
            <Box mb={2} display="flex" alignItems="center" gap={1}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Estado
              </Typography>
              <Chip
                label={formData.activo ? "Activo" : "Inactivo"}
                sx={{
                  backgroundColor: formData.activo
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  color: theme.palette.common.white,
                  fontWeight: "bold",
                  letterSpacing: 0.6,
                  fontSize: "0.85rem",
                  px: 1.2,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Teléfono
              </Typography>
              <Typography variant="body1">{formData.telefono}</Typography>
            </Box>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Dirección
              </Typography>
              <Typography variant="body1">{formData.direccion}</Typography>
            </Box>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Tipo de Cliente
              </Typography>
              <Typography variant="body1">{formData.tipo_cliente}</Typography>
            </Box>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Fecha de Registro
              </Typography>
              <Typography variant="body1">
                {formData.fecha_registro
                  ? format(new Date(formData.fecha_registro), "dd-MM-yyyy", {
                      locale: es,
                    })
                  : "No especificado"}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Sucursales
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {formData.sucursales?.length ? (
                  formData.sucursales.map((s) => (
                    <Chip
                      key={s.id_sucursal}
                      label={s.nombre ?? `Sucursal ${s.id_sucursal}`}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sin sucursales asociadas
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default VerCliente;
