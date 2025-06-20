import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { useSelector, useDispatch } from "react-redux";
import { useCreatePedidoMutation } from "../../store/services/pedidosApi";
import { addItem, clearCart } from "../../store/reducers/cartSlice";
import { showNotification } from "../../store/reducers/notificacionSlice";

import PedidoForm from "../../components/pedido/PedidoForm";
import PedidoResumen from "../../components/pedido/PedidoResumen";
import PedidoProductos from "../../components/pedido/PedidoProductos";
import PedidoCategorias from "../../components/pedido/PedidoCategorias";
import PedidoCarrito from "../../components/pedido/PedidoCarrito";
import { useGetCajaAsignadaQuery } from "../../store/services/cajaApi";
import NoCajaAsignadaDialog from "../../components/chofer/NoCajaAsignadaMessage";

const StyledConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 12,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.divider,
    borderTopWidth: 2,
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
}));

const StepIconRoot = styled(Box)(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active || ownerState.completed
    ? theme.palette.primary.main
    : theme.palette.grey[400],
  color: theme.palette.common.white,
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  fontWeight: 600,
}));

const StepIconComponent = (props) => {
  const { active, completed, className, icon } = props;
  return (
    <StepIconRoot className={className} ownerState={{ active, completed }}>
      {icon}
    </StepIconRoot>
  );
};

const CrearPedido = () => {
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("boleta");
  const [openNoCajaModal, setOpenNoCajaModal] = useState(false);

  const [metodoPago, setMetodoPago] = useState(null);
  const [notas, setNotas] = useState("");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const auth = useSelector((state) => state.auth.user);

  const { data: cajaAsignada, isLoading: loadingCaja } =
    useGetCajaAsignadaQuery({ rutUsuario: auth.id }, { skip: !auth.id });

  const [createPedido, { isLoading, error }] = useCreatePedidoMutation();

  const [category, setCategory] = useState("all");
  const steps = ["Datos", "Productos", "Carrito", "Resumen"];
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setActiveStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    if (!loadingCaja && cajaAsignada?.asignada === false) {
      setOpenNoCajaModal(true);
    } else {
      setOpenNoCajaModal(false);
    }
  }, [loadingCaja, cajaAsignada]);

  useEffect(() => {
    if (selectedCliente && selectedCliente.direccion) {
      setDireccionEntrega(selectedCliente.direccion);
    }
  }, [selectedCliente]);

  const handleAddToCart = (product) => {
    const isInsumo = product.tipo === "insumo";
    const idInsumo = isInsumo
      ? parseInt(
          typeof product.id_producto === "string"
            ? product.id_producto.replace("insumo_", "")
            : product.id_producto
        )
      : undefined;
    dispatch(
      addItem({
        id_producto: product.id_producto,
        nombre: product.nombre_producto,
        precio_unitario: parseFloat(product.precio),
        cantidad: 1,
        tipo: product.tipo || "producto",
        ...(isInsumo && { id_insumo: idInsumo }),
      })
    );
  };

  const handleCreatePedido = async () => {
    if (!selectedCliente) {
      dispatch(
        showNotification({
          message: "Selecciona un cliente antes de continuar.",
          severity: "warning",
        })
      );
      return;
    }

    if (tipoDocumento === "factura") {
      if (!selectedCliente?.razon_social || !selectedCliente?.rut) {
        dispatch(
          showNotification({
            message:
              "El cliente no tiene RUT o razón social. No se puede emitir factura.",
            severity: "error",
          })
        );
        return;
      }
    }

    const pedidoData = {
      id_cliente: selectedCliente.id_cliente,
      direccion_entrega: direccionEntrega,
      metodo_pago: metodoPago,
      productos: cart.map((item) => ({
        cantidad: item.cantidad,
        tipo: item.tipo,
        precio_unitario: item.precio_unitario,
        ...(item.tipo === "insumo"
          ? { id_insumo: item.id_insumo }
          : { id_producto: item.id_producto }),
      })),
      notas,
      tipo_documento: tipoDocumento,
    };

    try {
      await createPedido(pedidoData).unwrap();
      dispatch(clearCart());
      setSelectedCliente(null);
      setDireccionEntrega("");
      setMetodoPago(null);
      setNotas("");
      dispatch(
        showNotification({
          message: "Éxito al crear pedido",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("Error al crear el pedido:", err);
      dispatch(
        showNotification({
          message: `Error al crear pedido: ${
            err?.data?.message || err.message
          }`,
          severity: "error",
        })
      );
    }
  };

  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4, borderRadius: 2 }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        Crear Pedido
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<StyledConnector />}
        sx={{
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          p: 2,
          borderRadius: 2,
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIconComponent}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <PedidoForm
            selectedCliente={selectedCliente}
            setSelectedCliente={setSelectedCliente}
            direccionEntrega={direccionEntrega}
            setDireccionEntrega={setDireccionEntrega}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            notas={notas}
            setNotas={setNotas}
            mostrarMetodoPago={tipoDocumento !== "factura"}
            tipoDocumento={tipoDocumento}
            setTipoDocumento={setTipoDocumento}
          />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={nextStep}>
              Siguiente
            </Button>
          </Stack>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <PedidoCategorias onSelectCategory={setCategory} />
          <PedidoProductos
            selectedCategory={category}
            onAddToCart={handleAddToCart}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={prevStep}>
              Atrás
            </Button>
            <Button variant="contained" onClick={nextStep}>
              Siguiente
            </Button>
          </Stack>
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <PedidoCarrito />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={prevStep}>
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={cart.length === 0}
            >
              Siguiente
            </Button>
          </Stack>
        </Box>
      )}

      {activeStep === 3 && (
        <Box>
          <PedidoResumen
            total={total}
            isLoading={isLoading}
            error={error}
            onSubmit={handleCreatePedido}
            submitLabel="Generar Pedido"
          />
          <Stack direction="row" justifyContent="flex-start" mt={2}>
            <Button variant="outlined" onClick={prevStep} disabled={isLoading}>
              Atrás
            </Button>
          </Stack>
        </Box>
      )}

      <NoCajaAsignadaDialog
        open={openNoCajaModal}
        handleClose={() => setOpenNoCajaModal(false)}
        choferName={auth.nombre}
      />
    </Box>
  );
};

export default CrearPedido;
