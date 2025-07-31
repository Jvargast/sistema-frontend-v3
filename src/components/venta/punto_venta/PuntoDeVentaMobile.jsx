import { useRef, useState } from "react";
import {
  Box,
  MobileStepper,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import usePuntoDeVentaLogic from "../../../utils/usePuntoDeVentaLogic";
import ProductosGrid from "./ProductosGrid";
import CarritoDeCompras from "./CarritoDeCompras";
import SelectClienteModal from "../SelectedClienteModal";
import ProductosRetornablesModal from "../ProductosRetornablesModal";
import ProcesarPagoModal from "../ProcesarPagoModal";
import AlertDialog from "../../common/AlertDialog";
import BarraSuperior from "./BarraSuperior";
import AperturaCajaModal from "../../caja/AperturaCajaModal";
import SelectVendedorModal from "../SelectedVendedorModal";
import TituloStepper from "./TituloStepper";
import MiniCartSummary from "../../pedido/MiniCartSummary";

const steps = ["Selecciona productos", "Revisa tu carrito", "Venta realizada"];

export default function PuntoDeVentaMobile() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const logic = usePuntoDeVentaLogic();

  const [modal, setModal] = useState(null);

  const botonRef = useRef(null);

  const {
    productosData,
    loadingProductos,
    isSearching,
    page,
    setPage,
    cart,
    handleAddToCart,
    handleRemoveFromCart,
    handleQuantityChange,
    handlePriceChange,
    subtotal,
    descuento,
    impuestos,
    total,
    discount,
    taxRate,
    handleTaxRateChange,
    handleDiscountChange,
    /* handleProceedToPayment, */
    productosRetornables,
    /*     openRetornablesModal,
    setOpenRetornablesModal,
    handleConfirmRetornables,
    openPagoModal,
    setOpenPagoModal, */
    handleConfirmPayment,
    isCreating,
    selectedCliente,
    setSelectedCliente,
    openClienteModal,
    setOpenClienteModal,
    clientes,
    /*  confirmAlert, */
    openAlert,
    setOpenAlert,
    handleCerrarCaja,
    relevantError,
  } = logic;

  const handleNext = () => {
    if (activeStep === 0 && (!cart || cart.length === 0)) {
      logic.dispatch(
        logic.showNotification({
          message: "Agrega al menos un producto al carrito.",
          severity: "warning",
        })
      );
      return;
    }
    if (activeStep === 0) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const nuevaVenta = () => {
    setActiveStep(0);
    logic.setSelectedCliente(null);
  };
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ProductosGrid
            productos={productosData?.productos}
            loading={loadingProductos}
            isSearching={isSearching}
            page={page}
            totalPages={productosData?.paginacion?.totalPages || 1}
            onPageChange={(_, value) => setPage(value)}
            onAddToCart={handleAddToCart}
          />
        );
      case 1:
        return (
          <CarritoDeCompras
            cart={cart}
            subtotal={subtotal}
            descuento={descuento}
            impuestos={impuestos}
            total={total}
            discount={discount}
            taxRate={taxRate}
            onRemove={handleRemoveFromCart}
            onQuantityChange={handleQuantityChange}
            onPriceChange={handlePriceChange}
            onTaxRateChange={handleTaxRateChange}
            onDiscountChange={handleDiscountChange}
            onProceedToPayment={handleProcederAlPago}
            productosRetornables={productosRetornables}
          />
        );
      case 2:
        return (
          <Box textAlign="center" py={4}>
            <Typography variant="h5" color="success.main" mb={2}>
              ¡Venta realizada con éxito!
            </Typography>
            <Button variant="contained" color="primary" onClick={nuevaVenta}>
              Nueva venta
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  if (relevantError?.type === "permission") {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">
          No tienes permiso para acceder al Punto de Venta.
        </Typography>
      </Box>
    );
  }
  if (relevantError?.type === "generic") {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">{relevantError.message}</Typography>
      </Box>
    );
  }

  const onConfirmRetornables = async (productosSeleccionados) => {
    const tipo = await logic.handleConfirmRetornables(productosSeleccionados);
    setModal(null);
    if (tipo === "factura") {
      setActiveStep(2);
    }
  };

  const handleProcederAlPago = async () => {
    const productosRetornablesEnCarrito = cart.filter(
      (item) => item.es_retornable
    );
    const isFactura = logic.tipoDocumento === "factura";

    if (productosRetornablesEnCarrito.length > 0) {
      logic.setProductosRetornables(productosRetornablesEnCarrito);
      setModal("retornables");
      return;
    }

    if (isFactura) {
      await logic.handleConfirmPayment({
        montoPago: null,
        metodoPago: null,
        notas: "Factura emitida, pago pendiente",
        referencia: null,
      });
      setActiveStep(2);
      return;
    }

    setModal("pago");
  };

  if (logic.usuario?.rol === "administrador" && !logic.selectedVendedor) {
    return (
      <SelectVendedorModal
        open={logic.openModal}
        onClose={() => {}}
        vendedores={logic.vendedores || []}
        selectedVendedor={logic.selectedVendedor}
        onSelect={logic.handleSelectVendedor}
      />
    );
  }

  if (logic.usuario?.rol === "vendedor" && !logic.estado?.cajaAbierta) {
    return (
      <AperturaCajaModal
        caja={logic.estado.asignada}
        onCajaAbierta={() => {}}
        onClose={() => {}}
      />
    );
  }

  if (!["vendedor", "administrador"].includes(logic.usuario?.rol)) {
    return (
      <Typography>No tienes permiso para acceder al Punto de Venta.</Typography>
    );
  }

  if (logic.usuario?.rol === "vendedor" && !logic.estado?.asignada) {
    return <Typography>No tienes una caja asignada.</Typography>;
  }

  if (
    !logic.estado?.isLoading &&
    logic.estado?.asignada &&
    logic.estado?.cajaListaParaAbrir
  ) {
    return (
      <AperturaCajaModal
        caja={logic.estado.asignada}
        onCajaAbierta={() => {}}
        onClose={() => {}}
      />
    );
  }
  return (
    <Box
      sx={{
        maxWidth: 430,
        mx: "auto",
        /* p: { xs: 1, sm: 2 }, */
        minHeight: "100vh",
        background: theme.palette.background.default,
      }}
    >
      <BarraSuperior
        selectedVendedor={logic.selectedVendedor}
        onSelectVendedor={() => logic.setOpenModal(true)}
        selectedCliente={logic.selectedCliente}
        onSelectCliente={() => logic.setOpenClienteModal(true)}
        tipoDocumento={logic.tipoDocumento}
        onChangeTipoDocumento={logic.setTipoDocumento}
        tipoEntrega={logic.tipoEntrega}
        onChangeTipoEntrega={logic.setTipoEntrega}
        direccionEntrega={logic.direccionEntrega}
        onChangeDireccionEntrega={logic.setDireccionEntrega}
        usarDireccionGuardada={logic.usarDireccionGuardada}
        onChangeUsarDireccionGuardada={logic.setUsarDireccionGuardada}
        onCerrarCaja={logic.confirmAlert}
        cajaAbierta={logic.estado?.cajaAbierta}
        cajaAsignada={logic.estado?.asignada}
        clientes={logic.clientes}
        isClosing={logic.isClosing}
        cajaCerrando={logic.cajaCerrando}
        theme={theme}
      />
      <Box
        sx={{
          mb: 2,
          minHeight: "68vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <TituloStepper texto={steps[activeStep]} />

        {renderStepContent()}
      </Box>
      <MobileStepper
        variant="dots"
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        nextButton={
          activeStep === 0 ? (
            <Button size="small" onClick={handleNext} sx={{ fontWeight: 600 }}>
              Siguiente
              <KeyboardArrowRight />
            </Button>
          ) : null
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ fontWeight: 600 }}
          >
            <KeyboardArrowLeft />
            Volver
          </Button>
        }
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          mb: 1,
        }}
      />

      {activeStep === 0 && (
        <MiniCartSummary onOpenCart={() => setActiveStep(1)} />
      )}

      <SelectClienteModal
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        clientes={clientes || []}
        selectedCliente={selectedCliente}
        onSelect={setSelectedCliente}
      />

      <ProductosRetornablesModal
        open={modal === "retornables"}
        onClose={() => {
          setModal(null);
          setTimeout(() => {
            botonRef.current?.focus();
          }, 100);
        }}
        productos={productosRetornables}
        onConfirm={onConfirmRetornables}
      />

      <ProcesarPagoModal
        open={modal === "pago"}
        onClose={() => setModal(null)}
        onConfirm={async (...args) => {
          await handleConfirmPayment(...args);
          setModal(null);
          setActiveStep(2);
        }}
        total={total}
        metodosPago={[
          { id: 1, nombre: "Efectivo" },
          { id: 2, nombre: "Tarjeta crédito" },
          { id: 3, nombre: "Tarjeta débito" },
          { id: 4, nombre: "Transferencia" },
        ]}
        isLoading={isCreating}
      />

      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleCerrarCaja}
        title="Confirmar Cierre de Caja"
        message="¿Estás seguro de que deseas cerrar la caja?"
      />
    </Box>
  );
}
