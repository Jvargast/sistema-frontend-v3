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
  useTheme,
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
  mostrarTipoDocumento = true,
  notas,
  setNotas,
  tipoDocumento,
  setTipoDocumento,
  extraFields,
}) => {
  const theme = useTheme();
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [useClientAddress, setUseClientAddress] = useState(true);

  const isEmpresa = selectedCliente?.tipo_cliente === "empresa";

  useEffect(() => {
    if (!selectedCliente) {
      setDireccionEntrega("");
      setUseClientAddress(true);
    } else if (selectedCliente && useClientAddress) {
      setDireccionEntrega(selectedCliente.direccion || "");
    }
  }, [selectedCliente, useClientAddress, setDireccionEntrega]);

  useEffect(() => {
    if (
      selectedCliente?.tipo_cliente === "empresa" &&
      selectedCliente?.rut &&
      selectedCliente?.razon_social
    ) {
      if (tipoDocumento !== "factura") setTipoDocumento("factura");
    } else {
      if (tipoDocumento !== "boleta") setTipoDocumento("boleta");
    }
  }, [selectedCliente, tipoDocumento, setTipoDocumento]);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        mb: 3,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: theme.palette.text.primary,
        }}
      >
        Datos del Pedido
      </Typography>

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
        onSelect={(cliente) => {
          setSelectedCliente(cliente);
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={useClientAddress}
            onChange={(e) => setUseClientAddress(e.target.checked)}
            color="primary"
          />
        }
        label="Usar dirección del cliente"
        sx={{ mb: 3, color: theme.palette.text.secondary }}
      />

      <TextField
        fullWidth
        label="Dirección de Entrega"
        value={direccionEntrega}
        onChange={(e) => setDireccionEntrega(e.target.value)}
        variant="outlined"
        disabled={useClientAddress && !!selectedCliente}
        sx={{
          mb: 3,
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
        }}
      />

      {mostrarTipoDocumento && (
        <TextField
          select
          fullWidth
          id="tipo-documento"
          name="tipoDocumento"
          label="Tipo de Documento"
          value={tipoDocumento || ""}
          onChange={(e) => setTipoDocumento?.(e.target.value)}
          variant="outlined"
          sx={{
            mb: 3,
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
            input: { color: theme.palette.text.primary },
            label: { color: theme.palette.text.secondary },
          }}
        >
          {isEmpresa &&
          selectedCliente?.rut &&
          selectedCliente?.razon_social ? (
            <MenuItem value="factura">Factura</MenuItem>
          ) : (
            <MenuItem value="boleta">Boleta</MenuItem>
          )}
        </TextField>
      )}

      {(mostrarMetodoPago ||
        (mostrarTipoDocumento && tipoDocumento !== "factura")) && (
        <TextField
          select
          fullWidth
          label="Método de Pago"
          value={metodoPago || ""}
          onChange={(e) => setMetodoPago(Number(e.target.value))}
          variant="outlined"
          sx={{
            mb: 3,
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
            input: { color: theme.palette.text.primary },
            label: { color: theme.palette.text.secondary },
          }}
        >
          <MenuItem value={1}>Efectivo</MenuItem>
          <MenuItem value={2}>Tarjeta crédito</MenuItem>
          <MenuItem value={3}>Tarjeta débito</MenuItem>
          <MenuItem value={4}>Transferencia</MenuItem>
        </TextField>
      )}

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
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          input: { color: theme.palette.text.primary },
          label: { color: theme.palette.text.secondary },
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
  tipoDocumento: PropTypes.string,
  mostrarTipoDocumento: PropTypes.bool,
  setTipoDocumento: PropTypes.func,
  extraFields: PropTypes.node,
};

export default PedidoForm;
