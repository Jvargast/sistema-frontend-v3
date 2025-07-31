import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCreateClienteMutation } from "../../store/services/clientesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useIsMobile } from "../../utils/useIsMobile";
import AutocompleteDireccion from "../../components/pedido/AutocompleteDireccion";
import MapSelectorGoogle from "../../components/maps/MapSelector";

const CrearCliente = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation();
  const [formData, setFormData] = useState({
    tipo_cliente: "persona",
    nombre: "",
    direccion: "",
    telefono: "",
    apellido: "",
    razon_social: "",
    email: "",
    activo: true,
    lat: null,
    lng: null,
  });

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

  const handleDireccionChange = (direccion) => {
    setFormData((prev) => ({ ...prev, direccion }));
  };
  const handleCoordsChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      lat: coords.lat,
      lng: coords.lng,
    }));
  };

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Crear Cliente
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          Información del Cliente
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            fullWidth
            id="nombre"
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            variant="outlined"
          />
          <AutocompleteDireccion
            direccion={formData.direccion}
            setDireccion={handleDireccionChange}
            setCoords={handleCoordsChange}
          />
          <MapSelectorGoogle
            coords={{ lat: formData.lat, lng: formData.lng }}
            setCoords={handleCoordsChange}
            direccion={formData.direccion}
            setDireccion={handleDireccionChange}
          />
          <TextField
            fullWidth
            id="telefono"
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
            variant="outlined"
          />
        </Box>
        <TextField
          id="tipo_cliente"
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
        {formData.tipo_cliente === "empresa" && (
          <Box display="flex" flexDirection="column" gap={3} mt={3}>
            <TextField
              fullWidth
              label="Razón Social"
              name="razon_social"
              value={formData.razon_social}
              onChange={handleInputChange}
              variant="outlined"
              id="razon_social"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
              id="email"
            />
          </Box>
        )}
        <Box
          display="flex"
          justifyContent={isMobile ? "center" : "space-between"}
          alignItems="center"
          mt={4}
          gap={isMobile ? 3 : 0}
          sx={{ width: "100%" }}
        >
          {isMobile ? (
            <>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: theme.palette.grey[100],
                  boxShadow: "0 2px 8px 0 #0001",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.15s all",
                  cursor: "pointer",
                  "&:hover": {
                    background: theme.palette.grey[300],
                    transform: "scale(1.07)",
                  },
                }}
                onClick={() => navigate("/clientes")}
                title="Cancelar"
              >
                <ArrowBackIcon
                  sx={{ color: theme.palette.text.primary, fontSize: 32 }}
                />
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `linear-gradient(120deg, ${theme.palette.primary.light} 60%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}22, 0 1.5px 8px 0 #0001`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.15s all",
                  cursor: isCreating ? "not-allowed" : "pointer",
                  opacity: isCreating ? 0.6 : 1,
                  "&:hover": {
                    background: `linear-gradient(120deg, ${theme.palette.primary.main} 70%, ${theme.palette.primary.dark} 100%)`,
                    transform: "scale(1.07)",
                  },
                }}
                onClick={isCreating ? undefined : handleSubmit}
                title="Crear Cliente"
              >
                <PersonAddAlt1Icon sx={{ color: "#fff", fontSize: 32 }} />
              </Box>
            </>
          ) : (
            <>
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
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CrearCliente;
