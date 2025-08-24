import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  InputAdornment,
  Box,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useCreateClienteMutation } from "../../store/services/clientesApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useSelector } from "react-redux";

const ModalCrearClienteRapido = ({
  open,
  onClose,
  onClienteCreado,
  defaultSucursalId,
  defaultSucursalName,
}) => {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });
  const [touched, setTouched] = useState({});
  const nombreRef = useRef(null);

  const [createCliente, { isLoading }] = useCreateClienteMutation();

  useEffect(() => {
    if (open) setTimeout(() => nombreRef.current?.focus(), 50);
  }, [open]);

  const errors = useMemo(() => {
    const e = {};
    if (touched.nombre && !form.nombre.trim()) e.nombre = "Requerido";
    if (touched.direccion && !form.direccion.trim()) e.direccion = "Requerido";
    if (touched.telefono && !form.telefono.trim()) e.telefono = "Requerido";
    return e;
  }, [form, touched]);

  const isValid =
    form.nombre.trim() && form.direccion.trim() && form.telefono.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const handleGuardar = async () => {
    try {
      if (!isValid) {
        setTouched({ nombre: true, direccion: true, telefono: true });
        return;
      }

      const nuevoCliente = {
        ...form,
        tipo_cliente: "persona",
        creado_por: usuario?.rut || null,
        id_sucursal:
          defaultSucursalId != null ? Number(defaultSucursalId) : null,
      };

      const resp = await createCliente(nuevoCliente).unwrap();
      const cliente = resp?.cliente || resp?.data?.cliente || resp;

      onClienteCreado(cliente);
      dispatch(
        showNotification({
          message: "Cliente creado con éxito",
          severity: "success",
        })
      );
      onClose();
      setForm({ nombre: "", direccion: "", telefono: "" });
      setTouched({});
    } catch (error) {
      console.error("Error al crear cliente:", error);
      dispatch(
        showNotification({
          message: `Error al crear cliente: ${
            error?.data?.error || error?.message || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGuardar();
    }
  };

  const sucursalLabel =
    defaultSucursalName ||
    (defaultSucursalId != null ? `Sucursal ${defaultSucursalId}` : "—");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: (t) => `0 12px 32px ${t.palette.primary.main}22`,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          background:
            "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(21,101,192,1) 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <PersonAddAlt1Icon />
        Nuevo Cliente Rápido
        <Box sx={{ flex: 1 }} />
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        onKeyDown={handleKeyDown}
        sx={{
          p: 3,
          mt: 1,
          backgroundColor: (t) => t.palette.background.default,
        }}
      >
        <Box
          sx={{
            mb: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <StorefrontRoundedIcon color="primary" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Se registrará en:
          </Typography>
          <Chip
            size="small"
            color={defaultSucursalId != null ? "primary" : "warning"}
            label={sucursalLabel}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Stack
          spacing={2}
          mt={1}
          sx={{
            p: 2,
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            backgroundColor: (t) =>
              t.palette.mode === "light" ? "#fff" : t.palette.background.paper,
          }}
        >
          <TextField
            inputRef={nombreRef}
            label="Nombre"
            name="nombre"
            fullWidth
            required
            value={form.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.nombre}
            helperText={errors.nombre ? "Ingresa el nombre del cliente" : " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Dirección"
            name="direccion"
            fullWidth
            required
            value={form.direccion}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.direccion}
            helperText={errors.direccion ? "Ingresa una dirección válida" : " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            fullWidth
            required
            value={form.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.telefono}
            helperText={errors.telefono ? "Ingresa un teléfono válido" : " "}
            inputProps={{ inputMode: "tel" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          gap: 1,
          backgroundColor: (t) => t.palette.background.default,
        }}
      >
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleGuardar}
          disabled={isLoading || !isValid}
          startIcon={
            isLoading ? <CircularProgress size={18} color="inherit" /> : null
          }
          sx={{ fontWeight: 700 }}
        >
          {isLoading ? "Creando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalCrearClienteRapido.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClienteCreado: PropTypes.func.isRequired,
  defaultSucursalId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultSucursalName: PropTypes.string,
};

export default ModalCrearClienteRapido;
