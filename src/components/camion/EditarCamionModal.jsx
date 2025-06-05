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

const EditarCamionModal = ({ open, onClose, camion, onSuccess }) => {
  const dispatch = useDispatch();
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
      if (onSuccess) {
        onSuccess();
      }
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
        sx: (theme) => ({
          borderRadius: 4,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f9fbfd",
          boxShadow: theme.shadows[12],
        }),
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary"
          component="div"
          letterSpacing={0.4}
          sx={{ mb: 0.5 }}
        >
          Editar Camión
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Puedes modificar la información básica del camión.
        </Typography>
      </DialogTitle>

      <Divider sx={{ my: 1.5 }} />

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
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[50],
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
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[50],
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
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[50],
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

      <DialogActions
        sx={{
          pt: 2,
          pb: 1.5,
          px: { xs: 2, sm: 4 },
          justifyContent: "space-between",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#f5f7fb",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            px: 2,
            boxShadow: "none",
            letterSpacing: 0.2,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            letterSpacing: 0.2,
            boxShadow: "none",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.primary.main
                  : theme.palette.primary.dark,
            },
            transition: "all 0.18s",
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
  onSuccess: PropTypes.func,
};

export default EditarCamionModal;
