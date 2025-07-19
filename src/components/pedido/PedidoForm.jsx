import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  TextField,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PedidoClienteSelector from "./PedidoClienteSelector";
import PropTypes from "prop-types";
import AutocompleteDireccion from "./AutocompleteDireccion";
import MapSelector from "../maps/MapSelector";

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
  setCoords,
  coords,
}) => {
  const theme = useTheme();
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [useClientAddress, setUseClientAddress] = useState(true);

  const isEmpresa = selectedCliente?.tipo_cliente === "empresa";

  useEffect(() => {
    if (useClientAddress) {
      if (selectedCliente) {
        setDireccionEntrega(selectedCliente.direccion || "");
      } else {
        setDireccionEntrega("");
      }
    }
  }, [useClientAddress, selectedCliente]);

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
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        mb: 3,
        /*         backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.background.paper, */
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Datos del Pedido
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setOpenClienteModal(true)}
          sx={{ textTransform: "none", fontSize: 16, boxShadow: "none" }}
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
              setTipoDocumento?.("boleta");
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
          if (
            cliente?.tipo_cliente === "empresa" &&
            cliente?.rut &&
            cliente?.razon_social
          ) {
            setTipoDocumento?.("factura");
          } else {
            setTipoDocumento?.("boleta");
          }
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

      {useClientAddress ? (
        <TextField
          fullWidth
          label="Dirección de Entrega"
          value={direccionEntrega}
          variant="outlined"
          disabled
          sx={{
            mb: 3,
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
          }}
        />
      ) : (
        <>
          <AutocompleteDireccion
            direccion={direccionEntrega}
            setDireccion={setDireccionEntrega}
            setCoords={setCoords}
          />
          <MapSelector
            coords={coords}
            setCoords={setCoords}
            direccion={direccionEntrega}
            setDireccion={setDireccionEntrega}
          />
        </>
      )}

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
    </Box>
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
  setCoords: PropTypes.func,
  coords: PropTypes.object,
};

export default PedidoForm;
