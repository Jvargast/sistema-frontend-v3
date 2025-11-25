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
import MapSelectorGoogle from "../maps/MapSelector";

const PedidoForm = ({
  formState,
  setFormState,
  mostrarMetodoPago = true,
  mostrarTipoDocumento = true,
  extraFields,
  idSucursalFiltro,
  onValidationChange,
}) => {
  const theme = useTheme();
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [useClientAddress, setUseClientAddress] = useState(true);

  const {
    selectedCliente,
    direccionEntrega,
    metodoPago,
    notas,
    tipoDocumento,
    coords,
  } = formState;

  const isEmpresa = selectedCliente?.tipo_cliente === "empresa";
  const empresaInvalida =
    isEmpresa && (!selectedCliente?.rut || !selectedCliente?.razon_social);
  useEffect(() => {
    if (useClientAddress) {
      if (selectedCliente) {
        setFormState((prev) => ({
          ...prev,
          direccionEntrega: selectedCliente.direccion || "",
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          direccionEntrega: "",
        }));
      }
    }
  }, [useClientAddress, selectedCliente, setFormState]);

  useEffect(() => {
    if (
      selectedCliente?.tipo_cliente === "empresa" &&
      selectedCliente?.rut &&
      selectedCliente?.razon_social
    ) {
      if (tipoDocumento !== "factura") {
        setFormState((prev) => ({ ...prev, tipoDocumento: "factura" }));
      }
    } else {
      if (tipoDocumento !== "boleta") {
        setFormState((prev) => ({ ...prev, tipoDocumento: "boleta" }));
      }
    }
  }, [selectedCliente, tipoDocumento, setFormState]);

  useEffect(() => {
    if (typeof onValidationChange === "function") {
      onValidationChange(!empresaInvalida);
    }
  }, [empresaInvalida, onValidationChange]);

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        mb: 3,
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
          disabled={!idSucursalFiltro}
        >
          {selectedCliente
            ? `Cliente: ${selectedCliente.nombre}`
            : "Seleccionar Cliente"}
        </Button>
        {selectedCliente && (
          <IconButton
            onClick={() => {
              setFormState((prev) => ({
                ...prev,
                selectedCliente: null,
                direccionEntrega: "",
                tipoDocumento: "boleta",
              }));
            }}
            color="error"
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {openClienteModal && (
        <PedidoClienteSelector
          key={`selector-${String(idSucursalFiltro || "global")}`}
          open={openClienteModal}
          onClose={() => setOpenClienteModal(false)}
          onSelect={(cliente) => {
            setFormState((prev) => ({
              ...prev,
              selectedCliente: cliente,
              tipoDocumento:
                cliente?.tipo_cliente === "empresa" &&
                cliente?.rut &&
                cliente?.razon_social
                  ? "factura"
                  : "boleta",
            }));
          }}
          idSucursal={idSucursalFiltro}
        />
      )}
      {empresaInvalida && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          El cliente seleccionado es una empresa y no tiene RUT y Razón Social
          registrados. No puedes continuar hasta que esos datos estén completos.
        </Typography>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={useClientAddress}
            onChange={(e) => setUseClientAddress(e.target.checked)}
            color="primary"
            disabled={!selectedCliente}
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
            setDireccion={(dir) =>
              setFormState((prev) => ({ ...prev, direccionEntrega: dir }))
            }
            setCoords={(coords) =>
              setFormState((prev) => ({ ...prev, coords }))
            }
          />
          <MapSelectorGoogle
            coords={coords}
            setCoords={(coords) =>
              setFormState((prev) => ({ ...prev, coords }))
            }
            setDireccion={(dir) =>
              setFormState((prev) => ({ ...prev, direccionEntrega: dir }))
            }
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
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              tipoDocumento: e.target.value,
            }))
          }
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
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              metodoPago: Number(e.target.value),
            }))
          }
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
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, notas: e.target.value }))
        }
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

      {extraFields && <Box mt={1}>{extraFields}</Box>}
    </Box>
  );
};

PedidoForm.propTypes = {
  formState: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired,
  mostrarMetodoPago: PropTypes.bool,
  mostrarTipoDocumento: PropTypes.bool,
  extraFields: PropTypes.node,
  idSucursalFiltro: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onValidationChange: PropTypes.func,
};

export default PedidoForm;
