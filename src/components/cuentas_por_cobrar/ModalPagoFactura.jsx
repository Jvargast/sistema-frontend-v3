import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Grid,
  InputAdornment,
  Divider,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import NotesIcon from "@mui/icons-material/Notes";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useRegistrarPagoMutation } from "../../store/services/cuentasPorCobrarApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { formatCLP } from "../../utils/formatUtils";

const metodos = [
  { value: 1, label: "Efectivo" },
  { value: 2, label: "Tarjeta crédito" },
  { value: 3, label: "Tarjeta débito" },
  { value: 4, label: "Transferencia" },
];

const ModalPagoFactura = ({ open, onClose, idCxc, montoPorDefecto }) => {
  const dispatch = useDispatch();
  const [monto, setMonto] = useState(montoPorDefecto || "");
  const [metodoPago, setMetodoPago] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [referencia, setReferencia] = useState("");
  const [registrarPago, { isLoading }] = useRegistrarPagoMutation();
  const saldoPendiente = Number(montoPorDefecto); 
  const montoNumerico = Number(monto);
  const montoValido =
    !isNaN(montoNumerico) &&
    montoNumerico > 0 &&
    montoNumerico <= saldoPendiente;

  useEffect(() => {
    if (open && montoPorDefecto) {
      setMonto(montoPorDefecto.toString());
    }
  }, [open, montoPorDefecto]);

  const handleSubmit = async () => {
    try {
      await registrarPago({
        id_cxc: idCxc,
        monto: parseFloat(monto),
        metodo_pago: metodoPago,
        observaciones,
        referencia,
      }).unwrap();
      onClose();
      dispatch(
        showNotification({
          message: "Se ha registrado el pago correctamente.",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("Error al registrar pago:", err);
      dispatch(
        showNotification({
          message: `Error al registrar el pago: ${err?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        💳 Registrar Pago de Factura
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <TextField
              label="Monto a Pagar"
              type="text"
              inputMode="numeric"
              value={formatCLP(monto)}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setMonto(raw);
              }}
              fullWidth
              required
              variant="outlined"
              error={!montoValido}
              helperText={
                !montoValido
                  ? "El monto debe ser mayor a 0 y no exceder el saldo pendiente"
                  : ""
              }
              sx={{
                "& .MuiInputAdornment-root": {
                  alignSelf: "center",
                  mt: 0.5,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Método de Pago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PaymentIcon />
                  </InputAdornment>
                ),
              }}
            >
              {metodos.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Referencia (voucher, transferencia, etc.)"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ReceiptIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observaciones"
              multiline
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider sx={{ my: 2 }} />

      <DialogActions sx={{ px: 4, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading || !montoValido || !metodoPago}
          sx={{ fontWeight: "bold", textTransform: "none" }}
        >
          {isLoading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} color="inherit" /> Registrando...
            </Box>
          ) : (
            "Registrar Pago"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalPagoFactura.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  idCxc: PropTypes.number.isRequired,
  montoPorDefecto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ModalPagoFactura;
