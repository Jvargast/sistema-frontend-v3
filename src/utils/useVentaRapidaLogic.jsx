import { useState } from "react";

const useVentaRapidaFormLogic = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [retornablesRecibidos, setRetornablesRecibidos] = useState([]);
  const [metodoPago, setMetodoPago] = useState(null);
  const [montoRecibido, setMontoRecibido] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const resetForm = () => {
    setActiveStep(0);
    setClienteSeleccionado(null);
    setProductosSeleccionados([]);
    setRetornablesRecibidos([]);
    setMetodoPago(null);
    setMontoRecibido(0);
  };

  const getTotal = () => {
    return productosSeleccionados.reduce(
      (acc, item) => acc + item.precioUnitario * item.cantidad,
      0
    );
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return !!clienteSeleccionado;
      case 1:
        return productosSeleccionados.length > 0;
      case 2:
        return true; // retornables son opcionales
      case 3:
        return metodoPago !== null && getTotal() > 0;
      default:
        return false;
    }
  };

  return {
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
  };
};

export default useVentaRapidaFormLogic;
