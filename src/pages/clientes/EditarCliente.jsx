import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  useGetClienteByIdQuery,
  useUpdateClienteMutation,
} from "../../store/services/clientesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import InfoFieldGroup from "../../components/common/InfoFieldGroup";

const EditarCliente = () => {
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
  const [updateCliente, { isLoading: isUpdating }] = useUpdateClienteMutation();

  const [formData, setFormData] = useState({
    rut: "",
    tipo_cliente: "",
    razon_social: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "+56 ",
    email: "",
    activo: true,
  });

  useEffect(() => {
    if (clienteData) {
      setFormData({
        rut: clienteData?.rut || "",
        tipo_cliente: clienteData.tipo_cliente || "",
        razon_social: clienteData?.razon_social || "",
        nombre: clienteData?.nombre || "",
        apellido: clienteData?.apellido || "",
        direccion: clienteData?.direccion || "",
        telefono: clienteData?.telefono || "",
        email: clienteData?.email || "",
        activo: clienteData?.activo,
      });
    }
  }, [clienteData]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/clientes/editar/${id}`, { replace: true });
    } else {
      refetch();
    }
  }, [location.state, refetch, navigate, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateCliente({ id, formData }).unwrap();
      dispatch(
        showNotification({
          message: "Cliente actualizado exitosamente.",
          severity: "success",
        })
      );
      navigate("/clientes");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar el cliente: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        borderRadius: 3,
        p: { xs: 1, sm: 3 },
        maxWidth: 950,
        margin: "0 auto",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, gap: 2 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          sx={{ letterSpacing: 0.3 }}
        >
          Editar Cliente
        </Typography>
      </Box>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ letterSpacing: 0.2 }}
          >
            Información del Cliente
          </Typography>
        </Box>
        <Divider sx={{ mb: { xs: 2, sm: 3 } }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <InfoFieldGroup
            fields={[
              {
                label: "RUT",
                name: "rut",
                value: formData.rut,
                onChange: handleInputChange,
                disabled: false,
              },
              {
                label: "Nombre",
                name: "nombre",
                value: formData.nombre,
                onChange: handleInputChange,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                value: formData.email,
                onChange: handleInputChange,
              },
              {
                label: "Estado",
                name: "activo",
                type: "select",
                value: formData.activo ?? true,
                onChange: handleInputChange,
                options: [
                  { value: true, label: "Activo" },
                  { value: false, label: "Inactivo" },
                ],
              },
            ]}
          />
          <InfoFieldGroup
            fields={[
              {
                label: "Teléfono",
                name: "telefono",
                value: formData.telefono,
                onChange: handleInputChange,
              },
              {
                label: "Dirección",
                name: "direccion",
                value: formData.direccion,
                onChange: handleInputChange,
              },
              {
                label: "Tipo de Cliente",
                name: "tipo_cliente",
                type: "select",
                value: formData.tipo_cliente,
                onChange: handleInputChange,
                options: [
                  { value: "persona", label: "Persona" },
                  { value: "empresa", label: "Empresa" },
                ],
              },
              ...(formData.tipo_cliente === "empresa"
                ? [
                    {
                      label: "Razón Social",
                      name: "razon_social",
                      value: formData.razon_social,
                      onChange: handleInputChange,
                    },
                  ]
                : []),
            ]}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: { xs: 3, sm: 4 },
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/clientes")}
            sx={{
              height: "3rem",
              minWidth: "130px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              borderColor: (theme) => theme.palette.grey[400],
              color: (theme) => theme.palette.text.secondary,
              "&:hover": {
                borderColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.main,
                background: (theme) => theme.palette.primary.light + "11",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isUpdating}
            sx={{
              height: "3rem",
              minWidth: "150px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              background: (theme) => theme.palette.primary.main,
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarCliente;
