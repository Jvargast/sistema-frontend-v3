import { useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCreateClienteMutation } from "../../store/services/clientesApi";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";

const libraries = ["places"];

const CrearCliente = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation();
  const [formData, setFormData] = useState({
    tipo_cliente: "persona", // Predeterminado "persona"
    nombre: "",
    direccion: "",
    telefono: "",
    apellido: "",
    razon_social: "",
    email: "",
    activo: true, // Predeterminado activo
  });
  const autocompleteRef = useRef(null);

  const apiGoogle = import.meta.env.VITE_API_GOOGLE_MAPS;

  // Cargar el script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${apiGoogle}`, 
    libraries,
  });

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setFormData((prev) => ({
        ...prev,
        direccion: place.formatted_address,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createCliente(formData).unwrap();
      dispatch(
        showNotification({
          message: "Cliente creado exitosamente.",
          severity: "success",
        })
      );
      navigate("/clientes");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear el cliente: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  if (loadError) {
    return (
      <Typography color="error">Error al cargar Google Maps API</Typography>
    );
  }

  if (!isLoaded) {
    return <LoaderComponent />;
  }

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Crear Cliente
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          Información del Cliente
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Campos obligatorios */}
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            variant="outlined"
          />

          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceSelect}
          >
            <TextField
              fullWidth
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Ingrese la dirección*"
              required
              variant="outlined"
            />
          </Autocomplete>

          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
            variant="outlined"
          />
        </Box>

        {/* Tipo de cliente */}
        <TextField
          select
          fullWidth
          label="Tipo de Cliente"
          name="tipo_cliente"
          value={formData.tipo_cliente}
          onChange={handleInputChange}
          sx={{ mt: 3 }}
        >
          <MenuItem value="persona">Persona</MenuItem>
          <MenuItem value="empresa">Empresa</MenuItem>
        </TextField>

        {/* Campos adicionales para empresa */}
        {formData.tipo_cliente === "empresa" && (
          <Box display="flex" flexDirection="column" gap={3} mt={3}>
            <TextField
              fullWidth
              label="Razón Social"
              name="razon_social"
              value={formData.razon_social}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>
        )}

        {/* Botones */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/clientes")}
            sx={{
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isCreating}
            sx={{
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            {isCreating ? "Creando..." : "Crear Cliente"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CrearCliente;
