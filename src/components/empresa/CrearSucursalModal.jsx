import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

export default function CrearSucursalModal({
  open,
  onClose,
  onCrearSucursal,
  idEmpresa,
}) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!direccion.trim()) errs.direccion = "La dirección es obligatoria";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await onCrearSucursal({
        id_empresa: idEmpresa,
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim() || null,
      });
      setNombre("");
      setDireccion("");
      setTelefono("");
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error al crear sucursal", error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 22, pb: 1 }}>
        Crear Nueva Sucursal
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
        >
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={!!errors.nombre}
            helperText={errors.nombre}
            required
            autoFocus
            fullWidth
          />
          <TextField
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            error={!!errors.direccion}
            helperText={errors.direccion}
            required
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
            placeholder="Opcional"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ textTransform: "none", minWidth: 120 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{ textTransform: "none", minWidth: 120, position: "relative" }}
        >
          {loading ? (
            <>
              Creando...
              <CircularProgress
                size={20}
                sx={{
                  color: "inherit",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-10px",
                  marginLeft: "-10px",
                }}
              />
            </>
          ) : (
            "Crear"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
