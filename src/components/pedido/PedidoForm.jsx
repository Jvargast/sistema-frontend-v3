import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  TextField,
  MenuItem,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PedidoClienteSelector from "./PedidoClienteSelector";
import PropTypes from "prop-types";

const PedidoForm = ({
  selectedCliente,
  setSelectedCliente,
  direccionEntrega,
  setDireccionEntrega,
  metodoPago,
  setMetodoPago,
  mostrarMetodoPago = true,
  notas,
  setNotas,
  extraFields,
}) => {
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [useClientAddress, setUseClientAddress] = useState(true);

  // Cuando se deselecciona el cliente, se limpia la dirección.
  useEffect(() => {
    if (!selectedCliente) {
      setDireccionEntrega("");
      setUseClientAddress(true);
    } else if (selectedCliente && useClientAddress) {
      setDireccionEntrega(selectedCliente.direccion || "");
    }
  }, [selectedCliente, useClientAddress, setDireccionEntrega]);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        mb: 3,
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
      >
        Datos del Pedido
      </Typography>

      {/* Botón para seleccionar cliente */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setOpenClienteModal(true)}
          sx={{ textTransform: "none", fontSize: 16, boxShadow: 2 }}
        >
          {selectedCliente
            ? `Cliente: ${selectedCliente.nombre}`
            : "Seleccionar Cliente"}
        </Button>
        {selectedCliente && (
          <IconButton
            onClick={() => {
              setSelectedCliente(null);
              setDireccionEntrega("");
            }}
            color="error"
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <PedidoClienteSelector
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        onSelect={setSelectedCliente}
      />

      {/* Checkbox para usar la dirección del cliente */}
      <FormControlLabel
        control={
          <Checkbox
            checked={useClientAddress}
            onChange={(e) => setUseClientAddress(e.target.checked)}
            color="primary"
          />
        }
        label="Usar dirección del cliente"
        sx={{ mb: 3, color: "#555" }}
      />

      {/* Dirección de entrega (editable solo si NO se usa la del cliente) */}
      <TextField
        fullWidth
        label="Dirección de Entrega"
        value={direccionEntrega}
        onChange={(e) => setDireccionEntrega(e.target.value)}
        variant="outlined"
        disabled={useClientAddress && !!selectedCliente}
        sx={{
          mb: 3,
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />

      {/* Método de pago: usar IDs numéricos */}
      {mostrarMetodoPago && (
        <TextField
          select
          fullWidth
          label="Método de Pago"
          value={metodoPago || ""}
          onChange={(e) => setMetodoPago(Number(e.target.value))}
          variant="outlined"
          sx={{
            mb: 3,
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
        >
          <MenuItem value={1}>Efectivo</MenuItem>
          <MenuItem value={2}>Tarjeta crédito</MenuItem>
          <MenuItem value={3}>Tarjeta débito</MenuItem>
          <MenuItem value={4}>Transferencia</MenuItem>
        </TextField>
      )}

      {/* Notas del pedido */}
      <TextField
        fullWidth
        label="Notas"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        variant="outlined"
        multiline
        rows={3}
        sx={{
          mb: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />
      {extraFields && <Box mt={2}>{extraFields}</Box>}
    </Paper>
  );
};

PedidoForm.propTypes = {
  selectedCliente: PropTypes.object,
  setSelectedCliente: PropTypes.func,
  direccionEntrega: PropTypes.string,
  setDireccionEntrega: PropTypes.func.isRequired,
  metodoPago: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mostrarMetodoPago: PropTypes.bool,
  setMetodoPago: PropTypes.func.isRequired,
  notas: PropTypes.string,
  setNotas: PropTypes.func.isRequired,
  extraFields: PropTypes.node,
};

export default PedidoForm;
