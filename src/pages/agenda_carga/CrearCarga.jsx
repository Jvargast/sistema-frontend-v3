import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ListItemIcon,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
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
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const CreateAgendaCargaForm = () => {
  const auth = useSelector((s) => s.auth);
  const roleName = auth?.rol?.nombre || auth?.rol;
  const rutAuth = String(auth?.user?.id ?? auth?.user?.id ?? "");
  const userSucursalId = auth?.id_sucursal ?? auth?.user?.id_sucursal ?? null;
  const isChofer = roleName === "chofer";
  const isAdmin = roleName === "administrador";
  const { mode, activeSucursalId } = useSelector((s) => s.scope);

  const [sucursalFiltro, setSucursalFiltro] = useState("");

  const shouldFetchSucursales = isAdmin && mode === "global";

  const {
    data: sucursalesApi,
    isLoading: loadingSucursales,
    isError: errorSucursales,
  } = useGetAllSucursalsQuery(undefined, {
    skip: !shouldFetchSucursales,
    refetchOnMountOrArgChange: true,
  });

  const [sucursalId, setSucursalId] = useState(
    isChofer ? userSucursalId : activeSucursalId
  );
  const [idChofer, setIdChofer] = useState(isChofer ? rutAuth : "");

  const sucursalReady = Number.isFinite(Number(sucursalId));
  const choferReady = isChofer ? Boolean(rutAuth) : Boolean(idChofer);

  const agendaArgs = sucursalReady
    ? {
        id_sucursal: Number(sucursalId),
        rutChofer: isChofer ? rutAuth : idChofer,
      }
    : skipToken;
  const {
    data: agendaCarga,
    isLoading: loadingAgenda,
    isError,
    error,
  } = useGetAgendaCargaDelDiaQuery(agendaArgs, {
    skip: !sucursalReady || !choferReady,
  });
  const dispatch = useDispatch();
  const choferesArg =
    !isChofer && sucursalReady
      ? { id_sucursal: Number(sucursalId) }
      : skipToken;

  const {
    data: choferesRaw,
    isLoading: loadingChoferes,
    isError: errorChoferes,
    refetch: refetchChoferes,
  } = useGetAllChoferesQuery(choferesArg, { refetchOnMountOrArgChange: true });

  const choferes = useMemo(() => {
    if (Array.isArray(choferesRaw)) return choferesRaw;
    return choferesRaw?.data ?? choferesRaw?.usuarios ?? [];
  }, [choferesRaw]);

  const {
    data: camiones,
    isLoading: loadingCamiones,
    isError: errorCamiones,
    refetch: refetchCamiones,
  } = useGetAllCamionesQuery(
    sucursalReady ? { id_sucursal: Number(sucursalId) } : skipToken,
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: productosDisponibles,
    isLoading: loadingProductos,
    isError: errorProductos,
    refetch: refetchProductos,
  } = useGetAvailabreProductosQuery(
    sucursalReady ? { id_sucursal: Number(sucursalId) } : skipToken,
    { refetchOnMountOrArgChange: true }
  );

  const [createAgenda, { isLoading: loadingCreate }] =
    useCreateAgendaMutation();

  const user = useSelector((state) => state.auth);

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
    refetch: refetchInventario,
  } = useGetEstadoInventarioCamionQuery(Number(idCamion), { skip: !idCamion });

  const [openNoCajaModal, setOpenNoCajaModal] = useState(false);
  const [openNoUsuarioCamionModal, setOpenNoUsuarioCamionModal] =
    useState(false);
  const { data: cajaAsignada, isLoading: loadingCaja } =
    useGetCajaAsignadaQuery(
      { rutUsuario: idChofer, id_sucursal: sucursalId },
      { skip: !idChofer }
    );

  useRegisterRefresh(
    "agenda-carga",
    async () => {
      await Promise.all([
        refetchCamiones(),
        refetchChoferes(),
        refetchProductos(),
        refetchInventario(),
      ]);
      return true;
    },
    [refetchCamiones, refetchChoferes, refetchProductos, refetchInventario]
  );

  const opcionesSucursales = useMemo(() => {
    const rawApi = shouldFetchSucursales
      ? Array.isArray(sucursalesApi?.data)
        ? sucursalesApi.data
        : sucursalesApi ?? []
      : [];

    if (!shouldFetchSucursales) {
      const id = Number(userSucursalId);
      if (Number.isFinite(id) && id > 0) {
        const nombre =
          auth?.user?.sucursal_nombre ?? auth?.sucursal_nombre ?? "Mi sucursal";
        return [{ id_sucursal: id, nombre }];
      }
      return [];
    }

    return (rawApi ?? [])
      .map((s) => {
        const id = Number(s?.id_sucursal ?? s?.id ?? s?.Sucursal?.id_sucursal);
        if (!Number.isFinite(id) || id <= 0) return null;
        const nombre = String(
          s?.nombre ?? s?.Sucursal?.nombre ?? `Sucursal ${id}`
        ).trim();
        return { id_sucursal: id, nombre };
      })
      .filter(Boolean)
      .sort((a, b) => a.id_sucursal - b.id_sucursal);
  }, [shouldFetchSucursales, sucursalesApi, userSucursalId, auth]);

  const choferesFiltrados = useMemo(() => {
    const sid = Number(sucursalId);
    let list = (choferes ?? []).filter(
      (c) => Number(c?.id_sucursal ?? c?.Sucursal?.id_sucursal) === sid
    );
    if (isChofer && !list.some((c) => c.rut === rutAuth)) {
      list = [
        ...list,
        {
          rut: rutAuth,
          nombre: user?.nombre ?? "Mi usuario",
          apellido: user?.apellido ?? "",
          id_sucursal: sid,
        },
      ];
    }
    return list;
  }, [choferes, sucursalId, isChofer, rutAuth, user]);

  const safeIdChofer = useMemo(
    () =>
      choferesFiltrados.some((c) => String(c.rut) === String(idChofer))
        ? idChofer
        : "",
    [choferesFiltrados, idChofer]
  );

  const choferDisplay = useMemo(() => {
    if (isChofer) {
      const nombre =
        `${auth?.user?.nombre ?? auth?.nombre ?? ""} ${
          auth?.user?.apellido ?? auth?.apellido ?? ""
        }`.trim() || "Mi usuario";
      return { nombre, rut: rutAuth };
    }
    const ch = choferesFiltrados.find((c) => c.rut === idChofer);
    const nombre = `${ch?.nombre ?? ch?.nombres ?? ""} ${
      ch?.apellido ?? ch?.apellidos ?? ""
    }`.trim();
    return { nombre: nombre || ch?.rut || "", rut: ch?.rut || idChofer };
  }, [isChofer, auth, rutAuth, choferesFiltrados, idChofer]);

  const camionesFiltrados = useMemo(
    () =>
      (camiones ?? []).filter(
        (c) => Number(c.id_sucursal) === Number(sucursalId)
      ),
    [camiones, sucursalId]
  );

  const choferSeleccionado = useMemo(() => {
    return choferesFiltrados.find((c) => c.rut === idChofer) || null;
  }, [choferesFiltrados, idChofer]);

  const camionesDisponibles = useMemo(() => {
    const base = camionesFiltrados;
    if (!base.length) return [];
    const visibles = isChofer
      ? base.filter((c) => c.id_chofer_asignado === rutAuth)
      : base;
    return visibles
      .filter((c) => c.estado !== "En Ruta" && c.estado !== "En Tránsito")
      .map((c) => ({
        ...c,
        tieneAgenda:
          agendaCarga?.data?.id_camion &&
          agendaCarga.data.id_camion === c.id_camion,
      }));
  }, [camionesFiltrados, agendaCarga, isChofer, rutAuth]);

  const camionSeleccionado = useMemo(() => {
    if (!camionesDisponibles) return null;
    return (
      camionesDisponibles.find((cam) => cam.id_camion === Number(idCamion)) ||
      null
    );
  }, [camionesDisponibles, idCamion]);

  useEffect(() => {
    if (shouldFetchSucursales && !sucursalFiltro && opcionesSucursales.length) {
      setSucursalFiltro(String(opcionesSucursales[0].id_sucursal));
    }
  }, [shouldFetchSucursales, opcionesSucursales, sucursalFiltro]);

  useEffect(() => {
    const next = isChofer
      ? userSucursalId
      : mode === "global"
      ? sucursalFiltro
        ? Number(sucursalFiltro)
        : null
      : activeSucursalId;

    setSucursalId((prev) => (prev === next ? prev : next));
  }, [isChofer, userSucursalId, mode, sucursalFiltro, activeSucursalId]);

  useEffect(() => {
    if (isChofer) setIdChofer(rutAuth);
  }, [isChofer, rutAuth]);

  useEffect(() => {
    setIdCamion("");
    setProductos([]);
    setProductosReservados([]);
    setTabIndex(0);
    setIdChofer(isChofer ? rutAuth : "");
  }, [sucursalId, isChofer, rutAuth]);

  useEffect(() => {
    if (idChofer && !loadingCaja && cajaAsignada?.asignada === false) {
      setOpenNoCajaModal(true);
      setIdChofer("");
    }
  }, [idChofer, loadingCaja, cajaAsignada]);

  useEffect(() => {
    /* if (
      idCamion &&
      camionSeleccionado &&
      !camionSeleccionado.id_chofer_asignado
    ) {
      setOpenNoUsuarioCamionModal(true);
      setIdCamion("");
    } */
    if (!idCamion || !camionSeleccionado) return;
    if (isChofer && !camionSeleccionado.id_chofer_asignado) {
      setOpenNoUsuarioCamionModal(true);
      setIdCamion("");
    }
  }, [idCamion, camionSeleccionado, isChofer]);

  useEffect(() => {
    if (
      !isChofer &&
      idChofer &&
      !choferesFiltrados.some((c) => String(c.rut) === String(idChofer))
    ) {
      setIdChofer("");
    }
  }, [isChofer, idChofer, choferesFiltrados]);

  useEffect(() => {
    if (
      idCamion &&
      !camionesDisponibles.some((c) => Number(c.id_camion) === Number(idCamion))
    ) {
      setIdCamion("");
    }
  }, [idCamion, camionesDisponibles]);

  useEffect(() => {
    if (!inventarioData?.data) return;

    const cantidadTotalProductosReservados = productosReservados.reduce(
      (total, prod) => total + prod.cantidad,
      0
    );

    const espacioUsadoActual =
      inventarioData.data.reservados_retornables +
      inventarioData.data.disponibles +
      inventarioData.data.retorno;

    const espaciosDisponiblesParaRetornables =
      inventarioData.data.capacidad_total -
      espacioUsadoActual -
      cantidadTotalProductosReservados;

    const productosRetornables = productos.filter(
      (p) => p.es_retornable && Number(p.cantidad) > 0
    );

    const cantidadProductosRetornables = productosRetornables.reduce(
      (total, p) => total + (Number(p.cantidad) || 0),
      0
    );

    const cantidadNegativa = productosRetornables.some(
      (p) => Number(p.cantidad) < 0
    );

    const excedeEspaciosDisponibles =
      cantidadProductosRetornables > espaciosDisponiblesParaRetornables;

    const sinEspacio = espaciosDisponiblesParaRetornables <= 0;

    const esValido =
      !cantidadNegativa && !excedeEspaciosDisponibles && !sinEspacio;

    setPuedeCrearAgenda(esValido);
  }, [productos, productosReservados, inventarioData]);

  const hayPedidosConfirmados = useMemo(() => {
    if (Array.isArray(productosReservados) && productosReservados.length > 0)
      return true;
    const total = (productosReservados ?? []).reduce(
      (acc, it) => acc + (Number(it.cantidad) || 0),
      0
    );
    return total > 0;
  }, [productosReservados]);

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
      id_sucursal: sucursalId,
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
      console.log(payload);
      await createAgenda(payload).unwrap();
      dispatch(
        showNotification({
          message: "Se ha creado agenda de carga con éxito",
          severity: "success",
        })
      );
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

  if (idCamion && loadingInventario) {
    return (
      <Box
        mt={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={140}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (idCamion && errorInventario) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        Error al cargar el inventario del camión.
      </Alert>
    );
  }

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

        {shouldFetchSucursales && (
          <Box sx={{ px: 1, mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: (t) => t.palette.text.secondary,
              }}
            >
              <StorefrontIcon fontSize="small" sx={{ color: "primary.main" }} />
              Sucursal
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? t.palette.background.default
                    : t.palette.background.paper,
                borderColor: (t) =>
                  t.palette.mode === "dark"
                    ? t.palette.grey[800]
                    : t.palette.grey[200],
              }}
            >
              <FormControl
                fullWidth
                size="small"
                error={Boolean(errorSucursales)}
                disabled={loadingSucursales}
              >
                <InputLabel id="sucursal-label">
                  {loadingSucursales
                    ? "Cargando sucursales..."
                    : "Selecciona una sucursal"}
                </InputLabel>

                <Select
                  labelId="sucursal-label"
                  label={
                    loadingSucursales
                      ? "Cargando sucursales..."
                      : "Selecciona una sucursal"
                  }
                  value={String(sucursalFiltro)}
                  onChange={(e) => setSucursalFiltro(e.target.value)}
                  sx={{
                    borderRadius: 1.5,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 1,
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected)
                      return <span style={{ opacity: 0.6 }}>-- Elegir --</span>;
                    const s = opcionesSucursales.find(
                      (x) => String(x.id_sucursal) === String(selected)
                    );
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <StorefrontIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {s?.nombre ?? selected}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>-- Elegir --</em>
                  </MenuItem>

                  {opcionesSucursales.map((s) => (
                    <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                      <ListItemIcon>
                        <StorefrontIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={s.nombre}
                        secondary={`ID: ${s.id_sucursal}`}
                      />
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>
                  {errorSucursales
                    ? "No se pudieron cargar las sucursales."
                    : "Esto filtra choferes, camiones y productos por la sucursal seleccionada."}
                </FormHelperText>
              </FormControl>
            </Paper>
          </Box>
        )}

        {!loadingAgenda &&
          (isChofer || (!isChofer && idChofer)) &&
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
              isChofer={isChofer}
              choferes={choferesFiltrados}
              camiones={camionesDisponibles}
              idChofer={safeIdChofer}
              /* choferes={choferes}
              camiones={camionesDisponibles} */
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
              choferDisplay={choferDisplay}
            />
          </Grid>
          {camionSeleccionado?.estado === "En Ruta" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Este camión está en ruta. No puedes crear una agenda hasta que
              finalice su viaje.
            </Alert>
          )}
          {safeIdChofer && (
            <PedidosConfirmadosList
              idChofer={safeIdChofer}
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
                (productos.length === 0 && !hayPedidosConfirmados) ||
                productos.some((p) => !p.id_producto || p.cantidad <= 0) ||
                camionSeleccionado?.estado === "En Ruta" ||
                (isChofer &&
                  camionSeleccionado &&
                  camionSeleccionado.id_chofer_asignado !== rutAuth) ||
                (!isChofer &&
                  camionSeleccionado?.id_chofer_asignado &&
                  camionSeleccionado.id_chofer_asignado !== idChofer)
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
