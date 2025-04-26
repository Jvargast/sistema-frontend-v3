import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
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
    .format(); // ISO completo
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

  const [createCotizacion, { isLoading, error }] =
    useCreateCotizacionMutation();

  /*   const calcularFechaVencimiento = (dias) => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + dias);
    return hoy.toISOString().split("T")[0];
  }; */

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

    try {
      const result = await createCotizacion(cotizacionData).unwrap();
      dispatch(clearCart());
      navigate(`/cotizaciones/ver/${result.cotizacion.id_cotizacion}`);
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
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 4,
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        gap: 4,
        minHeight: "80vh",
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
          Crear Cotización
        </Typography>

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
      </Box>

      <Box>
        <PedidoCategorias onSelectCategory={setCategoriaSeleccionada} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 4,
        }}
      >
        <PedidoProductos
          selectedCategory={categoriaSeleccionada}
          onAddToCart={handleAddToCart}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <PedidoCarrito />
          <PedidoResumen
            total={total}
            isLoading={isLoading}
            error={error}
            onSubmit={handleCreateAndRedirect}
            submitLabel="Ver Cotización"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CrearCotizacion;
