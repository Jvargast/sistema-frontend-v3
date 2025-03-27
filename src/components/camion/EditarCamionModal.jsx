import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUpdateCamionMutation } from "../../store/services/camionesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";

const estadosCamion = [
  { value: "Disponible", label: "Disponible" },
  { value: "En Ruta", label: "En Ruta" },
  { value: "Mantenimiento", label: "Mantenimiento" },
];

const EditarCamionModal = ({ open, onClose, camion }) => {
  const dispatch= useDispatch();
  const [formData, setFormData] = useState({
    placa: "",
    capacidad: 0,
    estado: "",
  });

  const [updateCamion, { isLoading }] = useUpdateCamionMutation();

  useEffect(() => {
    if (camion) {
      setFormData({
        placa: camion.placa,
        capacidad: camion.capacidad,
        estado: camion.estado,
      });
    }
  }, [camion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateCamion({
        id: camion.id_camion,
        updatedCamion: formData,
      }).unwrap();
      dispatch(
        showNotification({
          message: "Se ha cambiado con éxito",
          severity: "success",
        })
      );
      onClose();
    } catch (error) {
      console.error("Error al actualizar camión:", error);
      dispatch(
        showNotification({
          message: `Error al actualizar camión: ${error}`,
          severity: "success",
        })
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: { xs: 2, sm: 4 },
          py: 3,
          backgroundColor: "#fefefe",
          boxShadow: 10,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary"
          component="div"
        >
          Editar Camión
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Puedes modificar la información básica del camión.
        </Typography>
      </DialogTitle>

      <Divider sx={{ my: 1 }} />

      <DialogContent>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={3}
          mt={1}
        >
          <TextField
            label="Patente"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Capacidad de carga"
            name="capacidad"
            type="number"
            value={formData.capacidad}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            select
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          >
            {estadosCamion.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ pt: 2, pb: 1.5, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
            backgroundColor: "#1565C0",
            "&:hover": { backgroundColor: "#0D47A1" },
          }}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditarCamionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  camion: PropTypes.shape({
    id_camion: PropTypes.number.isRequired,
    placa: PropTypes.string.isRequired,
    capacidad: PropTypes.number.isRequired,
    estado: PropTypes.string.isRequired,
  }),
};

export default EditarCamionModal;
