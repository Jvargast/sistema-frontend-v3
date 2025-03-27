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

const pasos = [
  "Seleccionar Cliente",
  "Seleccionar Productos",
  "Botellones Retornables",
  "Pago",
  "Resumen y Confirmación",
];

const ModalVentaRapida = ({ open, onClose, onSuccess, viaje }) => {
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

  const usuario = useSelector((state) => state.auth.user);
  const [ventaRapida, { isLoading }] = useRealizarVentaRapidaMutation();

  const handleCerrar = () => {
    resetForm();
    onClose();
  };

  const handleConfirmarVenta = async () => {
    try {
      const payload = {
        id_chofer: usuario.id,
        id_cliente: clienteSeleccionado?.id_cliente,
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
    <Dialog open={open} onClose={handleCerrar} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Venta Rápida
        <IconButton
          aria-label="close"
          onClick={handleCerrar}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel>
          {pasos.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {activeStep === 0 && (
            <PasoSeleccionCliente
              clienteSeleccionado={clienteSeleccionado}
              setClienteSeleccionado={setClienteSeleccionado}
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

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Atrás
          </Button>
          {activeStep < pasos.length - 1 && (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!isStepValid()}
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
  viaje: PropTypes.object.isRequired
};

export default ModalVentaRapida;
