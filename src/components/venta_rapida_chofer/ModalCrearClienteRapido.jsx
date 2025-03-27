import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useCreateClienteMutation } from "../../store/services/clientesApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const ModalCrearClienteRapido = ({ open, onClose, onClienteCreado }) => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const [createCliente, { isLoading }] = useCreateClienteMutation();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGuardar = async () => {
    try {
      const nuevoCliente = {
        ...form,
        tipo_cliente: "persona",
        creado_por: usuario?.rut || null,
      };

      const { data } = await createCliente(nuevoCliente);
      onClienteCreado(data?.cliente || nuevoCliente);
      dispatch(
        showNotification({
          message: "Cliete creado con éxito",
          severity: "success",
        })
      );
      onClose();
      setForm({ nombre: "", direccion: "", telefono: "" });
    } catch (error) {
      console.error("Error al crear cliente:", error);
      dispatch(
        showNotification({
          message: `Error al crear cliente: ${error}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nuevo Cliente Rápido</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            required
            value={form.nombre}
            onChange={handleChange}
          />
          <TextField
            label="Dirección"
            name="direccion"
            fullWidth
            required
            value={form.direccion}
            onChange={handleChange}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            fullWidth
            required
            value={form.telefono}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={
            isLoading || !form.nombre || !form.direccion || !form.telefono
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalCrearClienteRapido.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClienteCreado: PropTypes.func.isRequired,
};

export default ModalCrearClienteRapido;
