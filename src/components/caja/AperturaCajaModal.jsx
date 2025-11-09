import { useRef, useState } from "react";
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

function normalizeCajaForView(raw = {}, fallback = {}) {
  const r = { ...fallback, ...raw };

  const id_caja = Number(
    r.id_caja ?? r.id ?? r.caja_id ?? r.idCaja ?? r.cajaId ?? NaN
  );

  const id_sucursal = Number(
    r.id_sucursal ??
      r.sucursal_id ??
      r.idSucursal ??
      r.sucursal?.id_sucursal ??
      NaN
  );

  const sucursal =
    r.sucursal ||
    (Number.isFinite(id_sucursal)
      ? { id_sucursal, nombre: r.sucursal_nombre ?? r.sucursalName ?? null }
      : undefined);

  const usuario_asignado =
    r.usuario_asignado ?? r._vendedor?.rut ?? r.vendedor_rut ?? null;

  const saldo_inicial =
    r.saldo_inicial == null ? null : Number(r.saldo_inicial);
  const saldo_final = r.saldo_final == null ? null : Number(r.saldo_final);

  const estado =
    r.estado ??
    (r.fecha_cierre ? "cerrada" : r.fecha_apertura ? "abierta" : undefined);

  const vendedor = r._vendedor ?? r.vendedor ?? null;

  const vendedor_nombre =
    r.vendedor_nombre ?? vendedor?.nombre ?? r.usuario_nombre ?? null;

  const vendedor_rol = r.vendedor_rol ?? vendedor?.rol ?? r.usuario_rol ?? null;

  return {
    ...r,
    id_caja,
    id_sucursal,
    sucursal,
    usuario_asignado,
    saldo_inicial,
    saldo_final,
    estado,
    fecha_apertura: r.fecha_apertura ?? r.fechaApertura ?? null,
    fecha_cierre: r.fecha_cierre ?? r.fechaCierre ?? null,
    vendedor_nombre,
    vendedor_rol,
  };
}

const AperturaCajaModal = ({ open, caja, onCajaAbierta, onClose }) => {
  const dispatch = useDispatch();
  const [montoInicial, setMontoInicial] = useState("");
  const [error, setError] = useState(null);
  const [openCaja, { isLoading }] = useOpenCajaMutation();

  const openLockRef = useRef(false);

  const viewCaja = normalizeCajaForView(caja);

  const handleAbrirCaja = async () => {
    if (!viewCaja?.id_caja) {
      setError("Caja inválida.");
      return;
    }
    if (viewCaja?.estado === "abierta") {
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

    if (openLockRef.current) return;
    openLockRef.current = true;

    try {
      const resp = await openCaja({
        idCaja: caja.id_caja,
        saldoInicial: monto,
      }).unwrap();

      console.log("ABRIENDO CAJA:", resp);
      const apiCaja = resp?.caja ?? resp;
      const merged = normalizeCajaForView(
        {
          ...viewCaja,
          ...apiCaja,
          estado: "abierta",
          fecha_apertura: apiCaja?.fecha_apertura ?? new Date().toISOString(),
          saldo_inicial:
            apiCaja?.saldo_inicial != null ? apiCaja.saldo_inicial : monto,
        },
        viewCaja
      );

      setError(null);
      dispatch(cajaApi.util.invalidateTags(["Caja", "CajaUsuario"]));
      onCajaAbierta?.(merged);
      dispatch(
        showNotification({
          message: "Se ha abierto la caja correctamente",
          severity: "success",
        })
      );
      setMontoInicial("");
      onClose?.();
    } catch (e) {
      console.error("Error al abrir la caja:", e);
      const msg =
        e?.data?.error ||
        e?.data?.message ||
        e?.message ||
        "No se pudo abrir la caja. Intente nuevamente.";
      setError(msg);
      dispatch(showNotification({ message: msg, severity: "error" }));
    } finally {
      openLockRef.current = false;
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
                <strong>ID Caja:</strong> {viewCaja.id_caja ?? "—"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Store sx={{ color: "#0288d1" }} />
              <Typography>
                <strong>Sucursal:</strong>{" "}
                {viewCaja?.sucursal?.nombre ??
                  (Number.isFinite(viewCaja?.id_sucursal)
                    ? `ID - ${viewCaja.id_sucursal}`
                    : "Sin sucursal")}
              </Typography>
            </Box>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <Person sx={{ color: "#673AB7", mt: 0.5 }} />
              <Box>
                <Typography>
                  <strong>Usuario asignado:</strong>{" "}
                  {viewCaja?.usuario_asignado
                    ? `${viewCaja?.vendedor_nombre || "Usuario"}${
                        viewCaja?.vendedor_rol
                          ? ` (${viewCaja.vendedor_rol})`
                          : ""
                      }`
                    : "No asignado"}
                </Typography>

                {viewCaja?.usuario_asignado && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: "1.45em" }}
                  >
                    RUT: {viewCaja.usuario_asignado}
                  </Typography>
                )}
              </Box>
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
