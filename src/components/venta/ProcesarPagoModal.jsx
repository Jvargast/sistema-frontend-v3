import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import PaymentIcon from "@mui/icons-material/Payment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NoteAltIcon from "@mui/icons-material/NoteAlt"; // Icono para notas
import LinkIcon from "@mui/icons-material/Link";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const ProcesarPagoModal = ({
  open,
  onClose,
  onConfirm,
  total,
  metodosPago,
  isLoading,
}) => {
  const [montoPago, setMontoPago] = useState(total);
  const [metodoPago, setMetodoPago] = useState(metodosPago[0]?.id || "");
  const [notas, setNotas] = useState("");
  const [referencia, setReferencia] = useState("");
  const dispatch = useDispatch();

  const handleConfirm = () => {
    if (montoPago < total) {
      dispatch(
        showNotification({
          message: "El monto recibido no puede ser inferior al total",
          severity: "info",
        })
      );
      return;
    }
    onConfirm({ montoPago, metodoPago, notas, referencia });
  };

  let vuelto = montoPago - total;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
      disableAutoFocus
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
          background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
          color: "white",
          padding: "16px 24px",
        }}
      >
        <PaymentIcon sx={{ fontSize: 30 }} /> Confirmar Pago
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" fontWeight="bold">
            Total a pagar:
          </Typography>
          <Typography variant="h4" color="primary" fontWeight="bold">
            ${total.toFixed(0)}
          </Typography>
        </Box>
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" fontWeight="bold">
            Vuelto:
          </Typography>
          <Typography variant="h4" color="primary" fontWeight="bold">
            ${vuelto}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, backgroundColor: "#BDBDBD" }} />

        {/* Monto recibido */}
        <Box mb={3} display="flex" alignItems="center">
          <AttachMoneyIcon sx={{ color: "#2E7D32", mr: 1, fontSize: 28 }} />
          <TextField
            label="Monto Recibido"
            type="number"
            fullWidth
            value={montoPago}
            onChange={(e) => setMontoPago(parseFloat(e.target.value) || 0)}
            margin="dense"
            sx={{
              "& input": {
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#2E7D32",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#2E7D32",
                },
                "&:hover fieldset": {
                  borderColor: "#1B5E20",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1B5E20",
                },
              },
            }}
          />
        </Box>

        {/* Método de pago */}
        <Box mb={3} display="flex" alignItems="center">
          <ReceiptLongIcon sx={{ color: "#673AB7", mr: 1, fontSize: 28 }} />
          <Select
            fullWidth
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            sx={{
              "& .MuiSelect-select": { fontSize: "1.1rem", fontWeight: "bold" },
              "& fieldset": {
                borderColor: "#673AB7",
              },
              "&:hover fieldset": {
                borderColor: "#5E35B1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#5E35B1",
              },
            }}
          >
            {metodosPago.map((metodo) => (
              <MenuItem key={metodo.id} value={metodo.id}>
                {metodo.nombre}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* Campo de referencia: solo se muestra si el método de pago no es Efectivo (id: 1) */}
        {metodoPago !== 1 && (
          <Box mb={3} display="flex" alignItems="center">
            <LinkIcon sx={{ color: "#1976d2", mr: 1, fontSize: 28 }} />
            <TextField
              label="Referencia"
              fullWidth
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              margin="dense"
              sx={{
                "& input": {
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&:hover fieldset": {
                    borderColor: "#115293",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#115293",
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Notas */}
        <Box mb={3} display="flex" alignItems="center">
          <NoteAltIcon sx={{ color: "#FF9800", mr: 1, fontSize: 28 }} />
          <TextField
            label="Notas"
            fullWidth
            multiline
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            margin="dense"
            sx={{
              "& textarea": { fontSize: "1rem" },
              "& fieldset": {
                borderColor: "#FF9800",
              },
              "&:hover fieldset": {
                borderColor: "#F57C00",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#F57C00",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#FF5252",
            color: "white",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#D32F2F" },
          }}
        >
          Cancelar
        </Button>
        {!isLoading && (
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#00C853",
              color: "white",
              fontWeight: "bold",
              px: 3,
              "&:hover": { backgroundColor: "#00A344" },
            }}
          >
            Confirmar Pago
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ProcesarPagoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  metodosPago: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ProcesarPagoModal;
