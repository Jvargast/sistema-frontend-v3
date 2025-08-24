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
  InputAdornment,
} from "@mui/material";
import {
  Close,
  AttachMoney,
  Person,
  Store,
  Assignment,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { cajaApi, useOpenCajaMutation } from "../../store/services/cajaApi";
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

const AperturaCajaModal = ({ open, caja, onCajaAbierta, onClose }) => {
  const dispatch = useDispatch();
  const [montoInicial, setMontoInicial] = useState("");
  const [error, setError] = useState(null);
  const [openCaja, { isLoading }] = useOpenCajaMutation();

  const handleAbrirCaja = async () => {
    if (!caja?.id_caja) {
      setError("Caja inválida.");
      return;
    }
    if (caja?.estado === "abierta") {
      dispatch(
        showNotification({
          message: "Esta caja ya está abierta.",
          severity: "info",
        })
      );
      onClose?.();
      return;
    }

    const monto = Number(montoInicial);
    if (!Number.isFinite(monto) || monto <= 0) {
      setError("Ingrese un monto inicial válido.");
      return;
    }

    try {
      const resp = await openCaja({
        idCaja: caja.id_caja,
        saldoInicial: monto,
      }).unwrap();

      console.log("ABRIENDO CAJA:", resp);
      const apiCaja = resp?.caja ?? resp;

      const cajaNormalizada = {
        ...caja,
        ...apiCaja,
        estado: "abierta",
        fecha_apertura: apiCaja.fecha_apertura ?? new Date().toISOString(),
        saldo_inicial: Number(apiCaja.saldo_inicial ?? monto),
        saldo_final:
          apiCaja.saldo_final == null ? null : Number(apiCaja.saldo_final),
        sucursal:
          apiCaja.sucursal ??
          caja.sucursal ??
          (apiCaja.id_sucursal
            ? {
                id_sucursal: apiCaja.id_sucursal,
                nombre: `Sucursal ${apiCaja.id_sucursal}`,
              }
            : undefined),
      };
      setError(null);
      dispatch(
        showNotification({
          message: "Se ha abierto la caja correctamente",
          severity: "success",
        })
      );
      onCajaAbierta?.(cajaNormalizada);
      setMontoInicial("");
      dispatch(cajaApi.util.invalidateTags?.(["Caja"]));
      onClose?.();
    } catch (e) {
      console.error("Error al abrir la caja:", e);
      setError("No se pudo abrir la caja. Intente nuevamente.");
      dispatch(
        showNotification({
          message: "No se pudo abrir la caja. Intente nuevamente.",
          severity: "error",
        })
      );
    }
  };

  if (!caja) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={!!open}>
        <Box sx={modalStyle}>
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              minWidth: 32,
              borderRadius: "50%",
            }}
          >
            <Close />
          </Button>

          <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
            Apertura de Caja
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment sx={{ color: "#1976d2" }} />
              <Typography>
                <strong>ID Caja:</strong> {caja.id_caja}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Store sx={{ color: "#0288d1" }} />
              <Typography>
                <strong>Sucursal:</strong>{" "}
                {caja?.sucursal?.nombre || "Sin sucursal"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Person sx={{ color: "#673AB7" }} />
              <Typography>
                <strong>Usuario Asignado:</strong>{" "}
                {caja?.usuario_asignado || "No asignado"}
              </Typography>
            </Box>
          </Box>

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
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={handleAbrirCaja}
            disabled={
              isLoading ||
              !Number.isFinite(Number(montoInicial)) ||
              Number(montoInicial) <= 0
            }
          >
            {isLoading ? "Abriendo..." : "Abrir Caja"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

AperturaCajaModal.propTypes = {
  open: PropTypes.bool,
  caja: PropTypes.object,
  onCajaAbierta: PropTypes.func,
  onClose: PropTypes.func,
};

export default AperturaCajaModal;
