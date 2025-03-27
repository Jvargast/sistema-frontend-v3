import { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Backdrop,
  Fade,
  Divider,
} from "@mui/material";
import { Close, AttachMoney, Person, Store, Assignment } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useOpenCajaMutation } from "../../store/services/cajaApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 3,
  boxShadow: 24,
};

const AperturaCajaModal = ({ caja, onCajaAbierta, onClose }) => {
  const dispatch = useDispatch();
  const [montoInicial, setMontoInicial] = useState("");
  const [error, setError] = useState(null);
  const [openCaja, { isLoading }] = useOpenCajaMutation();

  const handleAbrirCaja = async () => {
    
    const monto = parseFloat(montoInicial);
    if (!monto || monto <= 0) {
      setError("Ingrese un monto inicial válido.");
      return;
    }

    try {
      await openCaja({
        idCaja: caja?.id_caja,
        saldoInicial: monto,
      });
      setError(null);
      onCajaAbierta();
      dispatch(showNotification({
        message: "Se ha abierto la caja correctamente",
        severity: "success"
      }))
    } catch (error) {
      console.error("Error al abrir la caja:", error);
      setError("No se pudo abrir la caja. Intente nuevamente.");
      dispatch(showNotification({
        message: `No se pudo abrir la caja. Intente nuevamente.${error}`,
        severity: "error"
      }))
    }
  };

  if (!caja) {
    return (
      <Box p={3}>
        <Typography>Cargando datos de la caja...</Typography>
      </Box>
    );
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={true}>
        <Box sx={modalStyle}>
          {/* Botón de cierre */}
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              minWidth: "32px",
              borderRadius: "50%",
              color: "#333",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <Close />
          </Button>

          {/* Título */}
          <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
            Apertura de Caja
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Información de la caja */}
          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment sx={{ color: "#1976d2" }} />
              <Typography variant="body1">
                <strong>ID Caja:</strong> {caja?.id_caja || "No disponible"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Store sx={{ color: "#0288d1" }} />
              <Typography variant="body1">
                <strong>Sucursal:</strong>{" "}
                {caja?.sucursal?.nombre || "Sin sucursal"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Person sx={{ color: "#673AB7" }} />
              <Typography variant="body1">
                <strong>Usuario Asignado:</strong>{" "}
                {caja?.usuario_asignado || "No asignado"}
              </Typography>
            </Box>
          </Box>

          {/* Campo de Monto Inicial */}
          <TextField
            label="Monto Inicial"
            type="number"
            fullWidth
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: <AttachMoney sx={{ color: "#ff9800" }} />,
            }}
          />

          {/* Botón para abrir caja */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              width: "100%",
              "&:hover": { backgroundColor: "#388E3C" },
            }}
            onClick={handleAbrirCaja}
            disabled={isLoading || !montoInicial}
          >
            {isLoading ? "Abriendo..." : "Abrir Caja"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

AperturaCajaModal.propTypes = {
  caja: PropTypes.object, // La caja debe ser pasada como prop
  onCajaAbierta: PropTypes.func, // Callback al abrir la caja
  onClose: PropTypes.func, // Callback para cerrar el modal
};

export default AperturaCajaModal;
