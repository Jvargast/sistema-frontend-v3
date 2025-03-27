import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetClienteByIdQuery, useUpdateClienteMutation } from "../../store/services/clientesApi";
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
        m: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        p: 3,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Editar Cliente
        </Typography>
      </Box>
  
      {/* Información del Cliente */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Título de la Sección */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="textPrimary"
          >
            Información del Cliente
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
  
        {/* Campos del Formulario */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
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
  
        {/* Botones */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/clientes")}
            sx={{
              height: "3rem",
              minWidth: "150px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
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
              borderRadius: "8px",
              textTransform: "none",
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
