import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  useTheme,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { useSelector, useDispatch } from "react-redux";
import { useCreateCotizacionMutation } from "../../store/services/cotizacionesApi";
import { addItem, clearCart } from "../../store/reducers/cartSlice";
import { showNotification } from "../../store/reducers/notificacionSlice";
import PedidoForm from "../../components/pedido/PedidoForm";
import PedidoCategorias from "../../components/pedido/PedidoCategorias";
import PedidoProductos from "../../components/pedido/PedidoProductos";
import PedidoCarrito from "../../components/pedido/PedidoCarrito";
import PedidoResumen from "../../components/pedido/PedidoResumen";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_HORARIA = "America/Santiago";

const calcularFechaVencimiento = (dias) => {
  return dayjs()
    .tz(ZONA_HORARIA)
    .add(dias, "day")
    .hour(12)
    .minute(0)
    .second(0)
    .format(); 
};

const CrearCotizacion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const user = useSelector((state) => state.auth.user);
  const [impuesto, setImpuesto] = useState(0.19);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");

  const steps = ["Datos", "Productos", "Carrito", "Resumen"];
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setActiveStep((s) => Math.max(s - 1, 0));

  const theme = useTheme();

  const [createCotizacion, { isLoading, error }] =
    useCreateCotizacionMutation();

  useEffect(() => {
    if (selectedCliente && selectedCliente.direccion) {
      setDireccionEntrega(selectedCliente.direccion);
    }
  }, [selectedCliente]);

  const handleAddToCart = (product) => {
    dispatch(
      addItem({
        id_producto: product.id_producto,
        nombre: product.nombre_producto,
        precio_unitario: parseFloat(product.precio),
        cantidad: 1,
        tipo: product.tipo || "producto",
      })
    );
  };

  const handleCreateAndRedirect = async () => {
    if (!selectedCliente || cart.length === 0 || !fechaVencimiento) {
      dispatch(
        showNotification({
          message:
            "Cliente, productos y fecha de vencimiento son obligatorios.",
          severity: "warning",
        })
      );
      return;
    }

    const cotizacionData = {
      id_cliente: selectedCliente.id_cliente,
      id_sucursal: user?.id_sucursal,
      fecha_vencimiento: dayjs(fechaVencimiento)
        .tz(ZONA_HORARIA)
        .hour(12)
        .minute(0)
        .second(0)
        .format(),
      productos: cart.map((item) => {
        if (
          typeof item.id_producto === "string" &&
          item.id_producto.startsWith("insumo_")
        ) {
          return {
            id_insumo: parseInt(item.id_producto.replace("insumo_", "")),
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            descuento_porcentaje: 0,
          };
        }
        return {
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          descuento_porcentaje: 0,
        };
      }),

      notas,
      impuesto,
      descuento_total_porcentaje: descuentoPorcentaje,
    };

    //Cambiar
    try {
      const result = await createCotizacion(cotizacionData).unwrap();
      dispatch(clearCart());
      navigate(`/admin/cotizaciones/ver/${result.cotizacion.id_cotizacion}`);
      setSelectedCliente(null);
      setDireccionEntrega("");
    } catch (err) {
      dispatch(
        showNotification({
          message: `Error al crear cotización: ${
            err?.data?.message || err.message
          }`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4, borderRadius: 2 }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        Crear Cotización
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
            selectedCliente={selectedCliente}
            setSelectedCliente={setSelectedCliente}
            direccionEntrega={direccionEntrega}
            setDireccionEntrega={setDireccionEntrega}
            metodoPago={""}
            setMetodoPago={() => {}}
            notas={notas}
            mostrarMetodoPago={false}
            mostrarTipoDocumento={false}
            tipoDocumento={""}
            setTipoDocumento={() => {}}
            setNotas={setNotas}
            extraFields={
              <>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>
                  Fecha de vencimiento:
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  {[15, 30, 60].map((dias) => (
                    <Button
                      key={dias}
                      variant="outlined"
                      onClick={() =>
                        setFechaVencimiento(calcularFechaVencimiento(dias))
                      }
                    >
                      +{dias} días
                    </Button>
                  ))}
                </Box>
                <TextField
                  type="date"
                  label="Fecha de vencimiento"
                  value={
                    fechaVencimiento
                      ? dayjs(fechaVencimiento)
                          .tz(ZONA_HORARIA)
                          .format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const fecha = dayjs(e.target.value)
                      .tz(ZONA_HORARIA)
                      .hour(12)
                      .minute(0)
                      .second(0)
                      .format();
                    setFechaVencimiento(fecha);
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Impuesto (%)"
                  type="number"
                  value={isNaN(impuesto) ? "" : impuesto * 100}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setImpuesto(isNaN(value) ? 0 : value / 100);
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Descuento total (%)"
                  type="number"
                  value={isNaN(descuentoPorcentaje) ? "" : descuentoPorcentaje}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setDescuentoPorcentaje(isNaN(value) ? 0 : value);
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />
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
          <PedidoCategorias onSelectCategory={setCategoriaSeleccionada} />
          <PedidoProductos
            selectedCategory={categoriaSeleccionada}
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
            onSubmit={handleCreateAndRedirect}
            submitLabel="Ver Cotización"
          />
          <Stack direction="row" justifyContent="flex-start" mt={2}>
            <Button variant="outlined" onClick={prevStep} disabled={isLoading}>
              Atrás
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default CrearCotizacion;
