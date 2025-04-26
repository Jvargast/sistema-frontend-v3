import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Modal,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Chip,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useConfirmarCargaCamionMutation } from "../../store/services/agendaCargaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";

const ConfirmarCargaModal = ({ open, handleClose, agendaCarga }) => {
  const dispatch = useDispatch();
  const [confirmarCarga, { isLoading }] = useConfirmarCargaCamionMutation();
  const [productosCargados, setProductosCargados] = useState({});
  const [notasChofer, setNotasChofer] = useState("");

  const productosAgrupados = useMemo(() => {
    if (!agendaCarga) return [];

    const agrupados = {};

    agendaCarga.data.detallesCarga.forEach((detalle) => {
      const isProducto = detalle.producto?.id_producto !== undefined;
      const id = isProducto
        ? detalle.producto.id_producto
        : detalle.insumo.id_insumo;
      const nombre = isProducto
        ? detalle.producto.nombre_producto
        : detalle.insumo.nombre_insumo;
      const inventarios = isProducto
        ? detalle.producto.inventariosProducto || []
        : detalle.insumo.inventariosInsumo || [];

      const key = isProducto ? `producto_${id}` : `insumo_${id}`;

      if (!agrupados[key]) {
        const reservados = inventarios
          .filter(
            (inv) =>
              inv.estado === "En Camión - Reservado" ||
              inv.estado === "En Camión - Reservado - Entrega"
          )
          .reduce((sum, inv) => sum + inv.cantidad, 0);

        const disponibles = inventarios
          .filter((inv) => inv.estado === "En Camión - Disponible")
          .reduce((sum, inv) => sum + inv.cantidad, 0);

        agrupados[key] = {
          id_producto: isProducto ? id : null,
          id_insumo: !isProducto ? id : null,
          nombre_producto: isProducto ? nombre : null,
          nombre_insumo: !isProducto ? nombre : null,
          cantidadTotal: 0,
          cantidadReservada: reservados,
          cantidadDisponible: disponibles,
        };
      }

      agrupados[key].cantidadTotal += detalle.cantidad;
    });

    return Object.values(agrupados);
  }, [agendaCarga]);

  const productosCargadosInicial = useMemo(() => {
    const inicial = {};
    productosAgrupados.forEach((prod) => {
      const key = prod.id_producto
        ? `producto_${prod.id_producto}`
        : `insumo_${prod.id_insumo}`;
      inicial[key] = prod.cantidadTotal;
    });
    return inicial;
  }, [productosAgrupados]);

  useEffect(() => {
    setProductosCargados(productosCargadosInicial);
  }, [productosCargadosInicial]);

  const handleChangeCantidad = (key, cantidad) => {
    setProductosCargados((prev) => ({
      ...prev,
      [key]: cantidad,
    }));
  };

  const handleConfirmar = async () => {
    try {
      const payload = {
        id_agenda_carga: agendaCarga.data.id_agenda_carga,
        productosCargados: Object.entries(productosCargados).map(
          ([key, cantidad]) => {
            const item = productosAgrupados.find(
              (p) =>
                `producto_${p.id_producto}` === key ||
                `insumo_${p.id_insumo}` === key
            );
            return {
              id_producto: item?.id_producto || null,
              id_insumo: item?.id_insumo || null,
              cantidad: Number(cantidad),
            };
          }
        ),
        notasChofer,
      };

      await confirmarCarga(payload).unwrap();
      dispatch(
        showNotification({
          message: "Carga confirmada con éxito.",
          severity: "success",
        })
      );
      handleClose();
      setNotasChofer("");
      setProductosCargados({});
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: `"Error al confirmar la carga: ${error.data.error}`,
          severity: "error",
        })
      );
    }
  };

  if (!agendaCarga) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          width: { xs: "95%", md: "70%" },
          maxWidth: 800,
          p: { xs: 2, md: 4 },
          mx: "auto",
          mt: { xs: 3, md: 5 },
          borderRadius: 3,
          bgcolor: "#f9f9f9",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          textAlign="center"
          color="primary"
        >
          ✅ Confirmar Carga del Camión
        </Typography>

        {/* Aquí está el ajuste importante */}
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", px: 1 }}>
          {productosAgrupados.map((producto) => {
            const yaEnCamion =
              producto.cantidadReservada + producto.cantidadDisponible;
            const restante = Math.max(producto.cantidadTotal - yaEnCamion, 0);
            const deshabilitado = restante === 0;

            return (
              <Paper
                key={
                  producto.id_producto
                    ? `producto_${producto.id_producto}`
                    : `insumo_${producto.id_insumo}`
                }
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid #ccc",
                  backgroundColor: "#ffffff",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {(
                      producto.nombre_producto ||
                      producto.nombre_insumo ||
                      "Sin nombre"
                    ).toUpperCase()}
                    <Chip
                      label={producto.id_producto ? "Producto" : "Insumo"}
                      color={producto.id_producto ? "primary" : "secondary"}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Typography>
                </Box>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} md={4}>
                    <Typography variant="body1">
                      🧾 Planificado: <strong>{producto.cantidadTotal}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="body1">
                      📦 En camión (Reservado):{" "}
                      <strong>{producto.cantidadReservada}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      ✅ Disponible:{" "}
                      <strong>{producto.cantidadDisponible}</strong>
                    </Typography>
                  </Grid>
                </Grid>

                <TextField
                  type="number"
                  label="Cantidad a confirmar"
                  size="medium"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={deshabilitado}
                  value={productosCargados[producto.id_producto] ?? ""}
                  inputProps={{
                    min: 0,
                    max: restante,
                  }}
                  onChange={(e) =>
                    handleChangeCantidad(
                      producto.id_producto
                        ? `producto_${producto.id_producto}`
                        : `insumo_${producto.id_insumo}`,
                      e.target.value
                    )
                  }
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Máximo permitido: {restante}
                </Typography>

                {deshabilitado && (
                  <Typography
                    variant="caption"
                    color="success"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Ya se encuentra completamente cargado.
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Box>

        <TextField
          label="Notas del Chofer"
          multiline
          rows={3}
          fullWidth
          sx={{ mt: 3 }}
          value={notasChofer}
          onChange={(e) => setNotasChofer(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          sx={{
            mt: 3,
            width: "100%",
            py: 1.5,
            fontSize: "1rem",
            borderRadius: 2,
          }}
          onClick={handleConfirmar}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Confirmar Carga"}
        </Button>
      </Paper>
    </Modal>
  );
};

ConfirmarCargaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  agendaCarga: PropTypes.object,
};

export default ConfirmarCargaModal;
