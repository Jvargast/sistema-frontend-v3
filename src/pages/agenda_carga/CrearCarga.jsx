import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useGetAllChoferesQuery } from "../../store/services/usuariosApi";
import { useGetAllCamionesQuery } from "../../store/services/camionesApi";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";
import {
  useCreateAgendaMutation,
  useGetAgendaCargaDelDiaQuery,
} from "../../store/services/agendaCargaApi";
import AgendaCargaFormInputs from "../../components/agenda_carga/AgendaCargaInputs";
import AgendaCargaProductsSection from "../../components/agenda_carga/AgendaCargaProductsSection";
import InventarioCamion from "../../components/inventario/InventarioCamion";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import PedidosConfirmadosList from "../../components/pedido/PedidosConfirmados";
import { useSelector } from "react-redux";
import ConfirmarCargaModal from "../../components/agenda_carga/ConfirmarCargaModal";
import { useGetCajaAsignadaQuery } from "../../store/services/cajaApi";
import NoCajaAsignadaDialog from "../../components/chofer/NoCajaAsignadaMessage";
import NoUsuarioCamionDialog from "../../components/chofer/NoUsuarioCamionDialog";
import { emitRefetchAgendaViajes } from "../../utils/eventBus";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import { convertirFechaLocal } from "../../utils/fechaUtils";
import CapacidadCargaCamion from "../../components/agenda_carga/CapacidadCargaCamion";

const CreateAgendaCargaForm = () => {
  const {
    data: agendaCarga,
    isLoading: loadingAgenda,
    isError,
    error,
  } = useGetAgendaCargaDelDiaQuery();
  const dispatch = useDispatch();
  const {
    data: choferes,
    isLoading: loadingChoferes,
    isError: errorChoferes,
  } = useGetAllChoferesQuery();

  const {
    data: camiones,
    isLoading: loadingCamiones,
    isError: errorCamiones,
  } = useGetAllCamionesQuery();

  const {
    data: productosDisponibles,
    isLoading: loadingProductos,
    isError: errorProductos,
  } = useGetAvailabreProductosQuery();

  const [createAgenda, { isLoading: loadingCreate }] =
    useCreateAgendaMutation();

  const user = useSelector((state) => state.auth);

  const [idChofer, setIdChofer] = useState("");
  const [idCamion, setIdCamion] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [notas, setNotas] = useState("");
  const [descargarRetornables, setDescargarRetornables] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosReservados, setProductosReservados] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [puedeCrearAgenda, setPuedeCrearAgenda] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);
  const {
    data: inventarioData,
    isLoading: loadingInventario,
    error: errorInventario,
  } = useGetEstadoInventarioCamionQuery(Number(idCamion), { skip: !idCamion });

  const [openNoCajaModal, setOpenNoCajaModal] = useState(false);
  const [openNoUsuarioCamionModal, setOpenNoUsuarioCamionModal] =
    useState(false);

  const choferSeleccionado = useMemo(() => {
    if (!choferes) return null;
    return choferes.find((c) => c.rut === idChofer) || null;
  }, [choferes, idChofer]);

  const camionesDisponibles = useMemo(() => {
    if (!camiones) return [];
    return camiones.filter(
      (c) => c.estado !== "En Ruta" && c.estado !== "En Tránsito"
    );
  }, [camiones]);

  const camionSeleccionado = useMemo(() => {
    if (!camionesDisponibles) return null;
    return (
      camionesDisponibles.find((cam) => cam.id_camion === Number(idCamion)) ||
      null
    );
  }, [camionesDisponibles, idCamion]);

  const { data: cajaAsignada, isLoading: loadingCaja } =
    useGetCajaAsignadaQuery(
      { rutUsuario: idChofer },
      {
        skip: !idChofer,
      }
    );

  /*   const { refetch: refetchInventarioCamion } =
    useGetEstadoInventarioCamionQuery(Number(idCamion), {
      skip: !idCamion,
    }); */

  useEffect(() => {
    if (idChofer && !loadingCaja && cajaAsignada?.asignada === false) {
      setOpenNoCajaModal(true);
    } else {
      setOpenNoCajaModal(false);
    }
  }, [idChofer, loadingCaja, cajaAsignada]);

  useEffect(() => {
    if (
      idCamion &&
      camionSeleccionado &&
      !camionSeleccionado.id_chofer_asignado
    ) {
      setOpenNoUsuarioCamionModal(true);
    } else {
      setOpenNoUsuarioCamionModal(false);
    }
  }, [idCamion, camionSeleccionado]);

  const handleAddProductRow = () => {
    setProductos((prev) => [
      ...prev,
      { id_producto: "", cantidad: 0, notas: "", es_retornable: false },
    ]);
  };

  const handleChangeProduct = (index, newProductId) => {
    const selectedProduct = productosDisponibles?.productos.find(
      (prod) => prod.id_producto === Number(newProductId)
    );
    setProductos((prev) =>
      prev.map((prod, i) =>
        i === index
          ? {
              ...prod,
              id_producto: Number(newProductId),
              es_retornable: selectedProduct
                ? selectedProduct.es_retornable
                : false,
            }
          : prod
      )
    );
  };

  const handleChangeCantidad = (index, newCantidad) => {
    const cantidadNumerica = Number(newCantidad);

    if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
      return;
    }
    setProductos((prev) =>
      prev.map((prod, i) =>
        i === index ? { ...prod, cantidad: Number(newCantidad) } : prod
      )
    );
  };

  const handleChangeNotas = (index, newNotas) => {
    setProductos((prev) =>
      prev.map((prod, i) => (i === index ? { ...prod, notas: newNotas } : prod))
    );
  };

  const handleRemoveRow = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loadingCaja && cajaAsignada?.asignada === false) {
      dispatch(
        showNotification({
          message: "El chofer seleccionado no tiene caja asignada.",
          severity: "warning",
        })
      );
      return;
    }

    if (camionSeleccionado && !camionSeleccionado.id_chofer_asignado) {
      dispatch(
        showNotification({
          message: "El camión seleccionado no tiene un usuario asignado.",
          severity: "warning",
        })
      );
      return;
    }

    const payload = {
      id_usuario_chofer: idChofer,
      id_camion: Number(idCamion),
      prioridad,
      notas,
      descargarRetornables,
      productos: productos.map((p) => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        notas: p.notas,
        unidad_medida: "unidad",
        es_retornable: p.es_retornable,
      })),
    };

    try {
      await createAgenda(payload).unwrap();
      dispatch(
        showNotification({
          message: "Se ha creado agenda de carga con éxito",
          severity: "success",
        })
      );
      if (refetchInventarioCamion && idCamion) {
        await refetchInventarioCamion();
      }
      emitRefetchAgendaViajes();
      setIdChofer("");
      setIdCamion("");
      setPrioridad("Media");
      setNotas("");
      setDescargarRetornables(false);
      setProductos([]);
    } catch (error) {
      console.error("Error al crear agenda:", error);
      dispatch(
        showNotification({
          message: `Error al crear agenda: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  if (loadingChoferes || loadingCamiones || loadingProductos) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorChoferes || errorCamiones || errorProductos) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Alert severity="error">
          Error al cargar datos. Intenta nuevamente.
        </Alert>
      </Box>
    );
  }

  const { productos: listaProductosOriginal = [] } = productosDisponibles || {};
  const listaProductos = listaProductosOriginal.filter((p) => p.es_retornable);

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" p={4}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 800,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mb={2}
          pb={1}
          borderBottom={(theme) => `1.5px solid ${theme.palette.divider}`}
        >
          <CalendarTodayIcon
            fontSize="medium"
            sx={{ color: (theme) => theme.palette.primary.main }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            letterSpacing={0.5}
            sx={{
              color: (theme) => theme.palette.text.primary,
              textTransform: "uppercase",
              fontSize: { xs: "1rem", sm: "1.15rem" },
              fontFamily: "inherit",
            }}
          >
            Crear Agenda de Carga
          </Typography>
        </Box>

        {!loadingAgenda &&
          user.rol === "chofer" &&
          !isError &&
          agendaCarga &&
          agendaCarga?.data?.validada_por_chofer === false && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
              mb={3}
              px={1}
              py={1}
              sx={(theme) => ({
                backgroundColor: "transparent",
                borderBottom: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
              })}
            >
              <Button
                onClick={() => setOpenModal(true)}
                size="medium"
                variant="outlined"
                sx={(theme) => ({
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2.5,
                  py: 1.2,
                  mb: 1,
                  borderRadius: 2,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  borderColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[900]
                      : "#fff",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[800]
                        : theme.palette.grey[50],
                    borderColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[400],
                  },
                })}
              >
                Ver mi Agenda de Hoy
              </Button>

              {agendaCarga?.data?.fecha_hora && (
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[400]
                        : theme.palette.grey[700],
                    fontStyle: "italic",
                  })}
                >
                  Agenda del día:&nbsp;
                  <Typography
                    component="span"
                    fontWeight="medium"
                    color="text.primary"
                    sx={{ fontStyle: "normal" }}
                  >
                    {convertirFechaLocal(agendaCarga.data.fecha_hora)}
                  </Typography>
                </Typography>
              )}
            </Box>
          )}

        {!loadingAgenda && isError && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {error?.data?.error || "No hay agenda de carga pendiente para hoy."}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <AgendaCargaFormInputs
              choferes={choferes}
              camiones={camionesDisponibles}
              idChofer={idChofer}
              setIdChofer={setIdChofer}
              idCamion={idCamion === "" ? "" : Number(idCamion)}
              setIdCamion={(value) =>
                setIdCamion(value === "" ? "" : Number(value))
              }
              prioridad={prioridad}
              setPrioridad={setPrioridad}
              notas={notas}
              setNotas={setNotas}
              descargarRetornables={descargarRetornables}
              setDescargarRetornables={setDescargarRetornables}
            />
          </Grid>
          {camionSeleccionado?.estado === "En Ruta" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Este camión está en ruta. No puedes crear una agenda hasta que
              finalice su viaje.
            </Alert>
          )}
          {idChofer && (
            <PedidosConfirmadosList
              idChofer={idChofer}
              setProductosReservados={setProductosReservados}
            />
          )}
          <Divider sx={{ my: 3 }} />
          {idCamion && inventarioData && (
            <Box mt={3}>
              <Tabs
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="Vista Gráfica" />
                <Tab label="Detalle Capacidad" />
              </Tabs>
              {tabIndex === 0 && (
                <InventarioCamion
                  inventarioData={inventarioData.data}
                  productos={productos}
                  productosReservados={productosReservados}
                  modo="simulacion"
                />
              )}
              {tabIndex === 1 && (
                <CapacidadCargaCamion
                  capacidadTotal={inventarioData.data.capacidad_total}
                  reservadosRetornables={
                    inventarioData.data.reservados_retornables
                  }
                  disponibles={inventarioData.data.disponibles}
                  retorno={inventarioData.data.retorno}
                  productos={productos}
                  productosReservados={productosReservados}
                  onValidezCambio={setPuedeCrearAgenda}
                />
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Sección de productos */}
          <AgendaCargaProductsSection
            productos={productos}
            productosDisponibles={listaProductos}
            handleAddProductRow={handleAddProductRow}
            handleChangeProduct={handleChangeProduct}
            handleChangeCantidad={handleChangeCantidad}
            handleChangeNotas={handleChangeNotas}
            handleRemoveRow={handleRemoveRow}
          />

          {/* Botón SUBMIT */}
          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              disabled={
                loadingCreate ||
                !puedeCrearAgenda ||
                !idChofer ||
                !idCamion ||
                productos.length === 0 ||
                productos.some((p) => !p.id_producto || p.cantidad <= 0) ||
                camionSeleccionado?.estado === "En Ruta"
              }
              sx={{ textTransform: "none" }}
            >
              {loadingCreate ? "Creando..." : "Crear Agenda"}
            </Button>
          </Box>
        </form>
      </Paper>
      <ConfirmarCargaModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        agendaCarga={agendaCarga}
      />
      <NoCajaAsignadaDialog
        open={openNoCajaModal}
        handleClose={() => setOpenNoCajaModal(false)}
        choferName={choferSeleccionado?.nombre}
      />
      <NoUsuarioCamionDialog
        open={openNoUsuarioCamionModal}
        handleClose={() => setOpenNoUsuarioCamionModal(false)}
        camionLabel={
          camionSeleccionado
            ? `${camionSeleccionado.id_camion} - ${camionSeleccionado.placa}`
            : undefined
        }
      />
    </Box>
  );
};

export default CreateAgendaCargaForm;
