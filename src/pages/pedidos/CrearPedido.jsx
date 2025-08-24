import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Stack,
  useTheme,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
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
import { obtenerCoordsDesdeDireccion } from "../../utils/obtenerCords";
import MiniCartSummary from "../../components/pedido/MiniCartSummary";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { getStockForSucursal } from "../../utils/inventoryUtils";
import SucursalPickerHeader from "../../components/common/SucursalPickerHeader";

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
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${
    ownerState.active || ownerState.completed
      ? theme.palette.primary.main
      : theme.palette.divider
  }`,
  color:
    ownerState.active || ownerState.completed
      ? theme.palette.primary.main
      : theme.palette.text.disabled,
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
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

StepIconComponent.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
};

const initialFormState = {
  selectedCliente: null,
  direccionEntrega: "",
  tipoDocumento: "",
  metodoPago: null,
  notas: "",
  coords: { lat: null, lng: null },
  prioridad: "normal",
  id_sucursal: null,
};

const CrearPedido = () => {
  const [formState, setFormState] = useState(initialFormState);
  const { rol } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.scope);
  const sucursalActiva = useSucursalActiva();
  const { data: sucursales } = useGetAllSucursalsQuery();

  const isAdmin = rol === "administrador" || rol?.nombre === "administrador";
  const canChooseSucursal =
    mode === "global" || (!sucursalActiva?.id_sucursal && isAdmin);

  const sucursalActual = useMemo(() => {
    const id = canChooseSucursal
      ? formState.id_sucursal
      : sucursalActiva?.id_sucursal || formState.id_sucursal || null;
    if (!id) return null;
    return (
      (sucursales || []).find((s) => Number(s.id_sucursal) === Number(id)) ||
      null
    );
  }, [
    canChooseSucursal,
    sucursalActiva?.id_sucursal,
    formState.id_sucursal,
    sucursales,
  ]);

  const [openNoCajaModal, setOpenNoCajaModal] = useState(false);
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

  const nextStep = () =>
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setActiveStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    if (!loadingCaja && cajaAsignada?.asignada === false) {
      setOpenNoCajaModal(true);
    } else {
      setOpenNoCajaModal(false);
    }
  }, [loadingCaja, cajaAsignada]);

  useEffect(() => {
    if (mode !== "global") {
      const idFromHook = sucursalActiva?.id_sucursal || null;
      if (idFromHook && formState.id_sucursal !== idFromHook) {
        setFormState((prev) => ({ ...prev, id_sucursal: idFromHook }));
        return;
      }
    }
    if (mode === "global") {
      const idFromCaja =
        cajaAsignada?.cajas?.[0]?.id_sucursal ??
        cajaAsignada?.caja?.id_sucursal ??
        null;
      if (!formState.id_sucursal && idFromCaja) {
        setFormState((prev) => ({ ...prev, id_sucursal: idFromCaja }));
      }
    }
  }, [mode, sucursalActiva?.id_sucursal, cajaAsignada, formState.id_sucursal]);

  useEffect(() => {
    const cliente = formState.selectedCliente;
    if (!cliente?.direccion) return;

    const mismaDireccion = cliente.direccion === formState.direccionEntrega;
    const sinCoords = !formState.coords.lat || !formState.coords.lng;

    if (!mismaDireccion) {
      setFormState((prev) => ({
        ...prev,
        direccionEntrega: cliente.direccion,
      }));
    }

    if (sinCoords) {
      obtenerCoordsDesdeDireccion(cliente.direccion)
        .then((coords) => {
          if (coords) {
            setFormState((prev) => ({
              ...prev,
              coords,
            }));
          }
        })
        .catch(() => {});
    }
    //eslint-disable-next-line
  }, [formState.selectedCliente]);

  useEffect(() => {
    if (!formState.id_sucursal) return;
    const otraSucursal = cart.some(
      (i) =>
        i.id_sucursal_origen && i.id_sucursal_origen !== formState.id_sucursal
    );
    if (otraSucursal) {
      dispatch(clearCart());
      dispatch(
        showNotification({
          message:
            "La sucursal cambió. Se vació el carrito para evitar mezclar.",
          severity: "info",
        })
      );
    }
    setFormState((prev) => ({
      ...prev,
      selectedCliente: null,
      direccionEntrega: "",
      tipoDocumento: "boleta",
    }));
  }, [formState.id_sucursal, cart, dispatch]);

  const handleAddToCart = (product) => {
    const idSucursal = formState.id_sucursal;
    if (!idSucursal) {
      dispatch(
        showNotification({
          message: "Selecciona una sucursal para ver/añadir productos.",
          severity: "info",
        })
      );
      return;
    }

    const stockDisponible = getStockForSucursal(product.inventario, idSucursal);

    const qtyEnCarrito = cart
      .filter(
        (i) =>
          i.id_producto === product.id_producto &&
          i.id_sucursal_origen === idSucursal
      )
      .reduce((s, i) => s + i.cantidad, 0);

    if (qtyEnCarrito + 1 > stockDisponible) {
      dispatch(
        showNotification({
          message: "No hay stock suficiente en la sucursal seleccionada.",
          severity: "warning",
        })
      );
      return;
    }
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
        id_sucursal_origen: idSucursal,
      })
    );
  };

  const handleCreatePedido = async () => {
    const { selectedCliente, tipoDocumento, id_sucursal } = formState;

    if (!selectedCliente) {
      dispatch(
        showNotification({
          message: "Selecciona un cliente antes de continuar.",
          severity: "warning",
        })
      );
      return;
    }

    if (!id_sucursal) {
      dispatch(
        showNotification({
          message: "Debes seleccionar una sucursal para el pedido.",
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
      id_sucursal,
      id_cliente: formState.selectedCliente?.id_cliente,
      direccion_entrega: formState.direccionEntrega,
      lat: formState.coords.lat,
      lng: formState.coords.lng,
      metodo_pago: formState.metodoPago,
      notas: formState.notas,
      tipo_documento: formState.tipoDocumento,
      prioridad: formState.prioridad,
      productos: cart.map((item) => ({
        cantidad: item.cantidad,
        tipo: item.tipo,
        precio_unitario: item.precio_unitario,
        ...(item.tipo === "insumo"
          ? { id_insumo: item.id_insumo }
          : { id_producto: item.id_producto }),
      })),
    };

    try {
      await createPedido(pedidoData).unwrap();
      dispatch(clearCart());
      setFormState(initialFormState);
      setActiveStep(0);
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
      <SucursalPickerHeader
        sucursales={sucursales || []}
        idSucursal={formState.id_sucursal}
        canChoose={canChooseSucursal}
        onChange={(id) => setFormState((p) => ({ ...p, id_sucursal: id }))}
        nombreSucursal={sucursalActual?.nombre}
      />
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<StyledConnector />}
        sx={{
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
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
            formState={formState}
            setFormState={setFormState}
            mostrarMetodoPago={formState.tipoDocumento !== "factura"}
            idSucursalFiltro={formState.id_sucursal}
            extraFields={
              <>
                <TextField
                  select
                  fullWidth
                  label="Prioridad del Pedido"
                  value={formState.prioridad}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      prioridad: e.target.value,
                    }))
                  }
                  variant="outlined"
                  sx={{
                    mt: 3,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                    input: { color: theme.palette.text.primary },
                    label: { color: theme.palette.text.secondary },
                  }}
                >
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="normal">Media</MenuItem>
                  <MenuItem value="baja">Baja</MenuItem>
                </TextField>
              </>
            }
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
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Productos
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <PedidoCategorias onSelectCategory={setCategory} />
          <PedidoProductos
            selectedCategory={category}
            onAddToCart={handleAddToCart}
            sucursalId={formState.id_sucursal}
          />
          <MiniCartSummary onOpenCart={() => setActiveStep(2)} />
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
