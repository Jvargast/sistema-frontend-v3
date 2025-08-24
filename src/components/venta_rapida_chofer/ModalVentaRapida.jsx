import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import useVentaRapidaFormLogic from "../../utils/useVentaRapidaLogic";
import { useRealizarVentaRapidaMutation } from "../../store/services/ventasChoferApi";
import PasoSeleccionCliente from "./PasoSeleccionCliente";
import PasoSeleccionProductos from "./PasoSeleccionProductos";
import PasoRetornables from "./PasoRetornables";
import PasoPago from "./PasoPago";
import PasoResumenFinal from "./PagoResumenFinal";
import { useState } from "react";

const pasos = [
  "Seleccionar Cliente",
  "Seleccionar Productos",
  "Botellones Retornables",
  "Pago",
  "Resumen y Confirmación",
];

const ModalVentaRapida = ({ open, onClose, onSuccess, viaje }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const usuario = useSelector((state) => state.auth.user);

  const sucursalId =
    viaje?.id_sucursal_origen ??
    viaje?.id_sucursal ??
    viaje?.origen_inicial?.id_sucursal ??
    usuario?.id_sucursal ??
    null;

  const [ventaSinCliente, setVentaSinCliente] = useState(false);

  const {
    activeStep,
    handleNext,
    handleBack,
    resetForm,
    clienteSeleccionado,
    setClienteSeleccionado,
    productosSeleccionados,
    setProductosSeleccionados,
    retornablesRecibidos,
    setRetornablesRecibidos,
    metodoPago,
    setMetodoPago,
    montoRecibido,
    setMontoRecibido,
    getTotal,
    isStepValid,
  } = useVentaRapidaFormLogic();

  const [ventaRapida, { isLoading }] = useRealizarVentaRapidaMutation();

  const handleCerrar = () => {
    resetForm();
    onClose();
  };

  const handleConfirmarVenta = async () => {
    try {
      const payload = {
        id_chofer: usuario.id,
        id_cliente: clienteSeleccionado?.id_cliente ?? null,
        id_sucursal: sucursalId,
        id_metodo_pago: metodoPago,
        productos: productosSeleccionados.map((p) => ({
          id_producto: p.id_producto,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario,
        })),
        retornables_recibidos: retornablesRecibidos,
        estadoPago: "pagado",
        monto_recibido: montoRecibido,
      };
      await ventaRapida(payload).unwrap();
      onSuccess();
      handleCerrar();
    } catch (error) {
      console.error("Error al registrar venta rápida:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCerrar}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          bgcolor: (theme) => theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: "#1976d2",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Venta Rápida
        <IconButton
          aria-label="close"
          onClick={handleCerrar}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 4 }, pt: 2, pb: 3 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            flexWrap: "wrap",
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#1976d2",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "#1565c0",
            },
          }}
        >
          {pasos.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography
                  variant="caption"
                  sx={{ fontSize: { xs: 11, sm: 13 }, color: "text.secondary" }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {activeStep === 0 && (
            <PasoSeleccionCliente
              clienteSeleccionado={clienteSeleccionado}
              setClienteSeleccionado={setClienteSeleccionado}
              idChofer={usuario?.id}
              idSucursal={sucursalId}
              allowSinCliente
              ventaSinCliente={ventaSinCliente}
              setVentaSinCliente={setVentaSinCliente}
            />
          )}
          {activeStep === 1 && (
            <PasoSeleccionProductos
              idCamion={viaje?.id_camion}
              productosSeleccionados={productosSeleccionados}
              setProductosSeleccionados={setProductosSeleccionados}
            />
          )}
          {activeStep === 2 && (
            <PasoRetornables
              productosSeleccionados={productosSeleccionados}
              retornablesRecibidos={retornablesRecibidos}
              setRetornablesRecibidos={setRetornablesRecibidos}
            />
          )}
          {activeStep === 3 && (
            <PasoPago
              metodoPago={metodoPago}
              setMetodoPago={setMetodoPago}
              montoRecibido={montoRecibido}
              setMontoRecibido={setMontoRecibido}
              total={getTotal()}
            />
          )}
          {activeStep === 4 && (
            <PasoResumenFinal
              cliente={clienteSeleccionado}
              productos={productosSeleccionados}
              total={getTotal()}
              metodoPago={metodoPago}
              montoRecibido={montoRecibido}
              onConfirmar={handleConfirmarVenta}
              loading={isLoading}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            gap: 2,
            flexDirection: { xs: "column-reverse", sm: "row" },
          }}
        >
          <Button
            fullWidth={fullScreen}
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Atrás
          </Button>
          {activeStep < pasos.length - 1 && (
            <Button
              fullWidth={fullScreen}
              onClick={handleNext}
              variant="contained"
              disabled={
                activeStep === 0
                  ? !(ventaSinCliente || clienteSeleccionado)
                  : !isStepValid()
              }
              sx={{
                backgroundColor: "#1976d2",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
ModalVentaRapida.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  viaje: PropTypes.object.isRequired,
};

export default ModalVentaRapida;
