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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useConfirmarCargaCamionMutation } from "../../store/services/agendaCargaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import reverseGeocode from "../../utils/reverseGeocode";
import AutocompleteDireccion from "../pedido/AutocompleteDireccion";
import GoogleOrigenSelector from "../viaje/GoogleOrigenSelector";

const ConfirmarCargaModal = ({ open, handleClose, agendaCarga }) => {
  const dispatch = useDispatch();
  const [confirmarCarga, { isLoading }] = useConfirmarCargaCamionMutation();
  const [productosCargados, setProductosCargados] = useState({});
  const [notasChofer, setNotasChofer] = useState("");
  const DEFAULT_ORIGEN = { lat: -27.0675, lng: -70.8189 };
  const [origen, setOrigen] = useState(DEFAULT_ORIGEN);
  const [direccion, setDireccion] = useState("");

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

  useEffect(() => {
    if (origen?.lat && origen?.lng) {
      reverseGeocode(origen).then(setDireccion);
    }
  }, [origen]);

  const handleConfirmar = async () => {
    if (!origen?.lat || !origen?.lng) {
      dispatch(
        showNotification({
          message:
            "Debes seleccionar el punto de origen en el mapa o buscar una dirección.",
          severity: "warning",
        })
      );
      return;
    }

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
        origen_inicial: {
          lat: origen.lat,
          lng: origen.lng,
          direccion: direccion || "",
        },
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
      dispatch(
        showNotification({
          message: `Error al confirmar la carga: ${
            error.data?.error || error.message
          }`,
          severity: "error",
        })
      );
    }
  };

  if (!agendaCarga) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 500, md: 640 },
          maxWidth: "98vw",
          maxHeight: { xs: "99vh", sm: "90vh" },
          mx: "auto",
          my: { xs: 1, sm: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          p: 0,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 640,
            maxHeight: { xs: "99vh", sm: "90vh" },
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: 6,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              color="text.primary"
            >
              Confirmar Carga del Camión
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              px: { xs: 1.5, sm: 3 },
              pt: 2,
              pb: 2,
            }}
          >
            <AutocompleteDireccion
              direccion={direccion}
              setDireccion={setDireccion}
              setCoords={setOrigen}
            />
            <Box
              sx={{
                height: 250,
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
                position: "relative",
              }}
            >
              {origen ? (
                <GoogleOrigenSelector origen={origen} setOrigen={setOrigen} />
              ) : (
                <Box
                  sx={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <CircularProgress />
                  <Typography ml={2}>Cargando mapa...</Typography>
                </Box>
              )}
            </Box>
            <Typography variant="body2" mt={1} color="text.secondary">
              Dirección seleccionada: {direccion}
            </Typography>
            {/*             <Box
              sx={{
                px: { xs: 1.5, sm: 3 },
                pt: 2,
                pb: 0,
                overflowY: "hidden",
                flex: "1 1 auto",
                minHeight: 0,
              }}
            > */}
            <Box>
              {productosAgrupados.map((producto) => {
                const key = producto.id_producto
                  ? `producto_${producto.id_producto}`
                  : `insumo_${producto.id_insumo}`;
                const cantidadMaxima = producto.cantidadTotal;
                const deshabilitado = cantidadMaxima === 0;

                return (
                  <Paper
                    key={key}
                    sx={{
                      p: 2,
                      mb: 2.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: (theme) => theme.palette.background.paper,
                      backgroundColor: (theme) =>
                        theme.palette.background.paper,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color="text.primary"
                      >
                        {producto.nombre_producto || producto.nombre_insumo}
                      </Typography>
                      <Chip
                        label={producto.id_producto ? "Producto" : "Insumo"}
                        color={producto.id_producto ? "primary" : "secondary"}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                    <Grid
                      container
                      spacing={2}
                      sx={{ mt: 1.5, px: 1, py: 1, margin: 0 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <Typography variant="inherit" sx={{ fontWeight: 500 }}>
                          Planificado
                        </Typography>
                        <Typography variant="inherit" fontWeight="bold">
                          {producto.cantidadTotal}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="inherit" sx={{ fontWeight: 500 }}>
                          En camión (reservado)
                        </Typography>
                        <Typography variant="inherit" color="text.primary">
                          {producto.cantidadReservada}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 500 }}
                        >
                          Disponible
                        </Typography>
                        <Typography variant="inherit" fontWeight="bold">
                          {producto.cantidadDisponible}
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
                        productosCargados[key] !== undefined
                          ? productosCargados[key]
                          : producto.cantidadTotal
                      }
                      inputProps={{
                        min: 0,
                        max: cantidadMaxima,
                      }}
                      onChange={(e) =>
                        handleChangeCantidad(key, e.target.value)
                      }
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Máximo permitido: {cantidadMaxima}
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

            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                left: 0,
                width: "100%",
                p: { xs: 1.5, sm: 2 },
                bgcolor: "background.paper",
                borderTop: "1px solid #eee",
                zIndex: 10,
              }}
            >
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                }}
                onClick={handleConfirmar}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={22} /> : "Confirmar Carga"}
              </Button>
            </Box>
            {/* </Box> */}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

ConfirmarCargaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  agendaCarga: PropTypes.object,
};

export default ConfirmarCargaModal;
