import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Modal,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Grid,
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
      const id = detalle.producto?.id_producto;
      const nombre = detalle.producto?.nombre_producto;
      const cantidad = detalle.cantidad;

      if (!agrupados[id]) {
        const inventarios = detalle.producto?.inventariosProducto || [];
        const reservados = inventarios
          .filter((inv) => inv.estado === "En Camión - Reservado")
          .reduce((sum, inv) => sum + inv.cantidad, 0);
        const disponibles = inventarios
          .filter((inv) => inv.estado === "En Camión - Disponible")
          .reduce((sum, inv) => sum + inv.cantidad, 0);

        agrupados[id] = {
          id_producto: id,
          nombre_producto: nombre,
          cantidadTotal: 0,
          cantidadReservada: reservados,
          cantidadDisponible: disponibles,
        };
      }

      agrupados[id].cantidadTotal += cantidad;
    });

    return Object.values(agrupados);
  }, [agendaCarga]);

  const productosCargadosInicial = useMemo(() => {
    const inicial = {};
    productosAgrupados.forEach((prod) => {
      inicial[prod.id_producto] = prod.cantidadTotal; // Usar la cantidad planificada en la agenda
    });
    return inicial;
  }, [productosAgrupados]);

  useEffect(() => {
    setProductosCargados(productosCargadosInicial);
  }, [productosCargadosInicial]);

  const handleChangeCantidad = (idProducto, cantidad) => {
    setProductosCargados((prev) => ({
      ...prev,
      [idProducto]: cantidad,
    }));
  };

  const handleConfirmar = async () => {
    try {
      const payload = {
        id_agenda_carga: agendaCarga.data.id_agenda_carga,
        productosCargados: Object.entries(productosCargados).map(
          ([id, cantidad]) => ({
            id_producto: Number(id),
            cantidad: Number(cantidad),
          })
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
          width: { xs: "95%", md: "70%" }, // Más ancho en tablets
          maxWidth: 800,
          p: { xs: 2, md: 4 }, // Ajuste de padding
          mx: "auto",
          mt: { xs: 3, md: 5 },
          borderRadius: 3,
          bgcolor: "#f9f9f9", // Color de fondo más suave
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

        {productosAgrupados.map((producto) => {
          const yaEnCamion =
            producto.cantidadReservada + producto.cantidadDisponible;
          const restante = Math.max(producto.cantidadTotal - yaEnCamion, 0);
          const deshabilitado = restante === 0;

          return (
            <Paper
              key={producto.id_producto}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {producto.nombre_producto.toUpperCase()}
              </Typography>
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
                value={
                  productosCargados[producto.id_producto] !== undefined
                    ? productosCargados[producto.id_producto]
                    : ""
                }
                onChange={(e) =>
                  handleChangeCantidad(producto.id_producto, e.target.value)
                }
              />
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
