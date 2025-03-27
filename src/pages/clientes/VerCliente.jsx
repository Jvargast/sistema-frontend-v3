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
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetClienteByIdQuery } from "../../store/services/clientesApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";

const VerCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: clienteData,
    isLoading,
    isError,
    refetch,
  } = useGetClienteByIdQuery(id);

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
      }
    : {};

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/clientes/ver/${id}`, { replace: true });
    } else {
      refetch();
    }
  }, [location.state, refetch, navigate, id]);

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
    <Box m={3}>
    {/* Back Button */}
    <BackButton to="/clientes" label="Volver" />

    {/* Información del Cliente */}
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: "12px",
        backgroundColor: "#f9fafc",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold" color="textPrimary">
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
            borderRadius: "8px",
          }}
        >
          Editar Cliente
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Primera Columna */}
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography fontWeight="bold">RUT</Typography>
            <Typography variant="body1">{formData.rut}</Typography>
          </Box>
          <Box mb={2}>
            <Typography fontWeight="bold">Nombre</Typography>
            <Typography variant="body1">{formData.nombre}</Typography>
          </Box>
          <Box mb={2}>
            <Typography fontWeight="bold">Email</Typography>
            <Typography variant="body1">{formData.email}</Typography>
          </Box>
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <Typography fontWeight="bold">Estado</Typography>
            <Chip
              label={formData.activo ? "Activo" : "Inactivo"}
              sx={{
                backgroundColor: formData.activo ? "#2ecc71" : "#e74c3c",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>
        </Grid>

        {/* Segunda Columna */}
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography fontWeight="bold">Teléfono</Typography>
            <Typography variant="body1">{formData.telefono}</Typography>
          </Box>
          <Box mb={2}>
            <Typography fontWeight="bold">Dirección</Typography>
            <Typography variant="body1">{formData.direccion}</Typography>
          </Box>
          <Box mb={2}>
            <Typography fontWeight="bold">Tipo de Cliente</Typography>
            <Typography variant="body1">{formData.tipo_cliente}</Typography>
          </Box>
          <Box mb={2}>
            <Typography fontWeight="bold">Fecha de Registro</Typography>
            <Typography variant="body1">
              {formData.fecha_registro
                ? format(new Date(formData.fecha_registro), "dd-MM-yyyy", {
                    locale: es,
                  })
                : "No especificado"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);
};

export default VerCliente;
