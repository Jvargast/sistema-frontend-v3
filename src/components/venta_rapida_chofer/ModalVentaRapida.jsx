import Dialog from "../common/CompatDialog";
import StepLabel from "../common/CompatStepLabel";
import { DialogContent, DialogTitle, Stepper, Step, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useSelector } from "react-redux";
import useVentaRapidaFormLogic from "../../utils/useVentaRapidaLogic";
import { useRealizarVentaRapidaMutation } from "../../store/services/ventasChoferApi";
import PasoSeleccionCliente from "./PasoSeleccionCliente";
import PasoSeleccionProductos from "./PasoSeleccionProductos";
import PasoRetornables from "./PasoRetornables";
import PasoPago from "./PasoPago";
import PasoResumenFinal from "./PagoResumenFinal";
import { useState } from "react";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const pasos = [
"Seleccionar Cliente",
"Seleccionar Productos",
"Botellones Retornables",
"Pago",
"Resumen y Confirmación"];


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
    isStepValid
  } = useVentaRapidaFormLogic();

  const [ventaRapida, { isLoading }] = useRealizarVentaRapidaMutation();
  const totalVenta = getTotal();
  const ventaConPagoValido =
  metodoPago !== null &&
  totalVenta > 0 &&
  (Number(metodoPago) !== 1 || Number(montoRecibido) >= totalVenta);

  const handleCerrar = () => {
    resetForm();
    onClose();
  };

  const handleConfirmarVenta = async () => {
    if (!ventaConPagoValido) return;

    try {
      const cantidadVendidaPorProducto = new Map(
        productosSeleccionados.map((producto) => [
          producto.id_producto,
          Math.max(0, Number(producto.cantidad) || 0)
        ])
      );
      const retornablesNormalizados = retornablesRecibidos
        .map((retornable) => ({
          ...retornable,
          cantidad: Math.min(
            Math.max(0, Number(retornable.cantidad) || 0),
            cantidadVendidaPorProducto.get(retornable.id_producto) || 0
          )
        }))
        .filter((retornable) => retornable.cantidad > 0);

      const payload = {
        id_chofer: usuario.id,
        id_cliente: clienteSeleccionado?.id_cliente ?? null,
        id_sucursal: sucursalId,
        id_metodo_pago: metodoPago,
        productos: productosSeleccionados.map((p) => ({
          id_producto: p.id_producto,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario
        })),
        retornables_recibidos: retornablesNormalizados,
        estadoPago: "pagado",
        monto_recibido: montoRecibido
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
          borderRadius: fullScreen ? 0 : 3,
          overflow: "hidden",
          boxShadow: 24
        }
      }}>

      <DialogTitle sx={{ m: 0, p: 0 }}>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            color: "#fff",
            background:
            theme.palette.mode === "dark" ?
            "linear-gradient(135deg, #020617 0%, #1f2937 100%)" :
            "linear-gradient(135deg, #0F172A 0%, #1F2937 100%)"
          }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <PointOfSaleIcon sx={{ fontSize: 28, flex: "0 0 auto" }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                Venta rápida
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.88, display: "block", fontWeight: 600 }}>

                Registro directo desde el viaje
              </Typography>
            </Box>
          </Box>

        <IconButton
          aria-label="close"
          onClick={handleCerrar}
          size="small"
          sx={{
            color: "#fff",
            bgcolor: "rgba(255,255,255,.12)",
            "&:hover": { bgcolor: "rgba(255,255,255,.2)" }
          }}>

          <CloseIcon fontSize="small" />
        </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 4 }, pt: 2, pb: 3 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            flexWrap: "wrap",
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#0F172A"
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "#0F172A"
            },
            "& .MuiStepConnector-line": {
              borderColor: alpha("#0F172A", 0.18)
            }
          }}>

          {pasos.map((label) =>
          <Step key={label}>
              <StepLabel>
                <Typography
                variant="caption"
                sx={{ fontSize: { xs: 11, sm: 13 }, color: "text.secondary" }}>

                  {label}
                </Typography>
              </StepLabel>
            </Step>
          )}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {activeStep === 0 &&
          <PasoSeleccionCliente
            clienteSeleccionado={clienteSeleccionado}
            setClienteSeleccionado={setClienteSeleccionado}
            idChofer={usuario?.id}
            idSucursal={sucursalId}
            allowSinCliente
            ventaSinCliente={ventaSinCliente}
            setVentaSinCliente={setVentaSinCliente} />

          }
          {activeStep === 1 &&
          <PasoSeleccionProductos
            idCamion={viaje?.id_camion}
            productosSeleccionados={productosSeleccionados}
            setProductosSeleccionados={setProductosSeleccionados} />

          }
          {activeStep === 2 &&
          <PasoRetornables
            productosSeleccionados={productosSeleccionados}
            retornablesRecibidos={retornablesRecibidos}
            setRetornablesRecibidos={setRetornablesRecibidos} />

          }
          {activeStep === 3 &&
          <PasoPago
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            montoRecibido={montoRecibido}
            setMontoRecibido={setMontoRecibido}
            total={totalVenta} />

          }
          {activeStep === 4 &&
          <PasoResumenFinal
            cliente={clienteSeleccionado}
            productos={productosSeleccionados}
            total={totalVenta}
            metodoPago={metodoPago}
            montoRecibido={montoRecibido}
            onConfirmar={handleConfirmarVenta}
            loading={isLoading}
            disabled={!ventaConPagoValido} />

          }
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            gap: 2,
            flexDirection: { xs: "column-reverse", sm: "row" }
          }}>

          <Button
            fullWidth={fullScreen}
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={(theme) => ({
              borderColor: alpha("#0F172A", 0.28),
              color: theme.palette.text.primary,
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 1,
              "&:hover": {
                borderColor: "#0F172A",
                backgroundColor: alpha("#0F172A", 0.04)
              }
            })}>

            Atrás
          </Button>
          {activeStep < pasos.length - 1 &&
          <Button
            fullWidth={fullScreen}
            onClick={handleNext}
            variant="contained"
            disabled={
            activeStep === 0 ?
            !(ventaSinCliente || clienteSeleccionado) :
            !isStepValid()
            }
            sx={(theme) => ({
              bgcolor: "#0F172A",
              color: theme.palette.common.white,
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 1,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.common.black,
                boxShadow: "none"
              }
            })}>

              Siguiente
            </Button>
          }
        </Box>
      </DialogContent>
    </Dialog>);

};
ModalVentaRapida.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  viaje: PropTypes.object.isRequired
};

export default ModalVentaRapida;
