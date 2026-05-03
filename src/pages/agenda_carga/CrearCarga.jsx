import Tabs from "../../components/common/CompatTabs";
import Select from "../../components/common/CompatSelect";
import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, CircularProgress, Alert, Tab, MenuItem, FormControl, InputLabel, ListItemIcon, ListItemText, FormHelperText, Chip } from "@mui/material";
import PropTypes from "prop-types";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useGetAllChoferesQuery } from "../../store/services/usuariosApi";
import { useGetAllCamionesQuery } from "../../store/services/camionesApi";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";
import {
  useCreateAgendaMutation,
  useGetAgendaCargaDelDiaQuery } from
"../../store/services/agendaCargaApi";
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
import Box from "../../components/common/CompatBox";
import Grid from "../../components/common/CompatGrid";
import Typography from "../../components/common/CompatTypography";

const agendaSectionSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  boxShadow: "0 1px 2px rgba(2,6,23,0.04)",
};

const AgendaSection = ({ icon, title, subtitle, action, children }) =>
  <Box component="section" sx={agendaSectionSx}>
    <Box
      display="flex"
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      gap={2}
      flexWrap="wrap"
      mb={2}>

      <Box display="flex" alignItems="flex-start" gap={1.5} minWidth={0}>
        {icon &&
        <Box
          sx={(theme) => ({
            width: 34,
            height: 34,
            borderRadius: 1.5,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color:
            theme.palette.mode === "dark" ?
            theme.palette.primary.light :
            theme.palette.primary.main,
            bgcolor:
            theme.palette.mode === "dark" ?
            "rgba(90,141,213,0.14)" :
            "rgba(90,141,213,0.1)",
            flex: "0 0 auto"
          })}>

            {icon}
          </Box>
        }
        <Box minWidth={0}>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0 }}>
            {title}
          </Typography>
          {subtitle &&
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {subtitle}
            </Typography>
          }
        </Box>
      </Box>
      {action}
    </Box>
    {children}
  </Box>;

AgendaSection.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node.isRequired
};

const normalizeRut = (rut) => String(rut ?? "").trim();

const isCamionDisponible = (camion) =>
  String(camion?.estado ?? "").trim().toLowerCase() === "disponible";

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
    isError: errorSucursales
  } = useGetAllSucursalsQuery(undefined, {
    skip: !shouldFetchSucursales,
    refetchOnMountOrArgChange: true
  });

  const [sucursalId, setSucursalId] = useState(
    isChofer ? userSucursalId : activeSucursalId
  );
  const [idChofer, setIdChofer] = useState(isChofer ? rutAuth : "");

  const sucursalReady = Number.isFinite(Number(sucursalId));
  const choferReady = isChofer ? Boolean(rutAuth) : Boolean(idChofer);

  const agendaArgs = sucursalReady ?
  {
    id_sucursal: Number(sucursalId),
    rutChofer: isChofer ? rutAuth : idChofer
  } :
  skipToken;
  const {
    data: agendaCarga,
    isLoading: loadingAgenda,
    isError,
    error
  } = useGetAgendaCargaDelDiaQuery(agendaArgs, {
    skip: !sucursalReady || !choferReady
  });
  const dispatch = useDispatch();
  const choferesArg =
  !isChofer && sucursalReady ?
  { id_sucursal: Number(sucursalId) } :
  skipToken;

  const {
    data: choferesRaw,
    isLoading: loadingChoferes,
    isError: errorChoferes,
    refetch: refetchChoferes
  } = useGetAllChoferesQuery(choferesArg, { refetchOnMountOrArgChange: true });

  const choferes = useMemo(() => {
    if (Array.isArray(choferesRaw)) return choferesRaw;
    return choferesRaw?.data ?? choferesRaw?.usuarios ?? [];
  }, [choferesRaw]);

  const {
    data: camiones,
    isLoading: loadingCamiones,
    isError: errorCamiones,
    refetch: refetchCamiones
  } = useGetAllCamionesQuery(
    sucursalReady ? { id_sucursal: Number(sucursalId) } : skipToken,
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: productosDisponibles,
    isLoading: loadingProductos,
    isError: errorProductos,
    refetch: refetchProductos
  } = useGetAvailabreProductosQuery(
    sucursalReady ?
    {
      id_sucursal: Number(sucursalId),
      page: 1,
      limit: 1000
    } :
    skipToken,
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
    refetch: refetchInventario
  } = useGetEstadoInventarioCamionQuery(Number(idCamion), { skip: !idCamion });

  const [openNoCajaModal, setOpenNoCajaModal] = useState(false);
  const [openNoUsuarioCamionModal, setOpenNoUsuarioCamionModal] =
  useState(false);
  const { data: cajaAsignada, isLoading: loadingCaja } =
  useGetCajaAsignadaQuery(
    { rutUsuario: idChofer, id_sucursal: sucursalId },
    { skip: !idChofer || !sucursalReady }
  );

  useRegisterRefresh(
    "agenda-carga",
    async () => {
      await Promise.all([
      refetchCamiones(),
      refetchChoferes(),
      refetchProductos(),
      refetchInventario()]
      );
      return true;
    },
    [refetchCamiones, refetchChoferes, refetchProductos, refetchInventario]
  );

  const capacidadAdicionales = useMemo(() => {
    const inventario = inventarioData?.data;
    if (!inventario) {
      return {
        maxProductosAdicionales: null,
        cantidadProductosAdicionales: 0,
        espaciosRestantes: 0,
        cantidadProductosReservados: 0,
        espacioUsadoActual: 0
      };
    }

    const cantidadProductosReservados = (productosReservados ?? []).reduce(
      (total, prod) => total + (Number(prod.cantidad) || 0),
      0
    );

    const espacioUsadoActual =
    (Number(inventario.reservados_retornables) || 0) +
    (Number(inventario.disponibles) || 0) +
    (Number(inventario.retorno) || 0);

    const maxProductosAdicionales = Math.max(
      0,
      (Number(inventario.capacidad_total) || 0) -
      espacioUsadoActual -
      cantidadProductosReservados
    );

    const cantidadProductosAdicionales = (productos ?? []).reduce(
      (total, prod) =>
      prod.es_retornable ?
      total + (Number(prod.cantidad) || 0) :
      total,
      0
    );

    return {
      maxProductosAdicionales,
      cantidadProductosAdicionales,
      espaciosRestantes: Math.max(
        0,
        maxProductosAdicionales - cantidadProductosAdicionales
      ),
      cantidadProductosReservados,
      espacioUsadoActual
    };
  }, [inventarioData, productosReservados, productos]);

  const cantidadMaximaPorFila = useMemo(() => {
    const { maxProductosAdicionales } = capacidadAdicionales;
    if (maxProductosAdicionales === null) return productos.map(() => null);

    return productos.map((prod, index) => {
      if (!prod.es_retornable) return null;

      const totalOtrasFilas = productos.reduce((total, item, itemIndex) => {
        if (itemIndex === index || !item.es_retornable) return total;
        return total + (Number(item.cantidad) || 0);
      }, 0);

      return Math.max(0, maxProductosAdicionales - totalOtrasFilas);
    });
  }, [capacidadAdicionales, productos]);

  const limitarCantidadProducto = (listaProductos, index, cantidad, esRetornable) => {
    const cantidadNumerica = Number(cantidad);
    if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0) return null;

    const { maxProductosAdicionales } = capacidadAdicionales;
    if (!esRetornable || maxProductosAdicionales === null) {
      return cantidadNumerica;
    }

    const cantidadOtrasFilas = listaProductos.reduce((total, prod, i) => {
      if (i === index || !prod.es_retornable) return total;
      return total + (Number(prod.cantidad) || 0);
    }, 0);

    const maximoFila = Math.max(0, maxProductosAdicionales - cantidadOtrasFilas);
    return Math.min(cantidadNumerica, maximoFila);
  };

  const opcionesSucursales = useMemo(() => {
    const rawApi = shouldFetchSucursales ?
    Array.isArray(sucursalesApi?.data) ?
    sucursalesApi.data :
    sucursalesApi ?? [] :
    [];

    if (!shouldFetchSucursales) {
      const id = Number(userSucursalId);
      if (Number.isFinite(id) && id > 0) {
        const nombre =
        auth?.user?.sucursal_nombre ?? auth?.sucursal_nombre ?? "Mi sucursal";
        return [{ id_sucursal: id, nombre }];
      }
      return [];
    }

    return (rawApi ?? []).
    map((s) => {
      const id = Number(s?.id_sucursal ?? s?.id ?? s?.Sucursal?.id_sucursal);
      if (!Number.isFinite(id) || id <= 0) return null;
      const nombre = String(
        s?.nombre ?? s?.Sucursal?.nombre ?? `Sucursal ${id}`
      ).trim();
      return { id_sucursal: id, nombre };
    }).
    filter(Boolean).
    sort((a, b) => a.id_sucursal - b.id_sucursal);
  }, [shouldFetchSucursales, sucursalesApi, userSucursalId, auth]);

  const camionesFiltrados = useMemo(
    () =>
    (camiones ?? []).filter(
      (c) => Number(c.id_sucursal) === Number(sucursalId)
    ),
    [camiones, sucursalId]
  );

  const rutsChoferesConCamionDisponible = useMemo(() => {
    const disponibles = camionesFiltrados.filter(isCamionDisponible);
    return new Set(
      disponibles.
      map((camion) => normalizeRut(camion.id_chofer_asignado)).
      filter(Boolean)
    );
  }, [camionesFiltrados]);

  const choferesFiltrados = useMemo(() => {
    const sid = Number(sucursalId);
    let list = (choferes ?? []).filter((c) => {
      const rutChofer = normalizeRut(c?.rut);
      const perteneceSucursal =
      Number(c?.id_sucursal ?? c?.Sucursal?.id_sucursal) === sid;
      return perteneceSucursal && rutsChoferesConCamionDisponible.has(rutChofer);
    });

    if (
    isChofer &&
    rutsChoferesConCamionDisponible.has(normalizeRut(rutAuth)) &&
    !list.some((c) => normalizeRut(c.rut) === normalizeRut(rutAuth)))
    {
      list = [
      ...list,
      {
        rut: rutAuth,
        nombre: user?.nombre ?? "Mi usuario",
        apellido: user?.apellido ?? "",
        id_sucursal: sid
      }];

    }
    return list;
  }, [
    choferes,
    sucursalId,
    isChofer,
    rutAuth,
    user,
    rutsChoferesConCamionDisponible
  ]);

  const safeIdChofer = useMemo(
    () =>
    choferesFiltrados.some((c) => normalizeRut(c.rut) === normalizeRut(idChofer)) ?
    idChofer :
    "",
    [choferesFiltrados, idChofer]
  );

  const choferDisplay = useMemo(() => {
    if (isChofer) {
      const nombre =
      `${auth?.user?.nombre ?? auth?.nombre ?? ""} ${
      auth?.user?.apellido ?? auth?.apellido ?? ""}`.
      trim() || "Mi usuario";
      return { nombre, rut: rutAuth };
    }
    const ch = choferesFiltrados.find(
      (c) => normalizeRut(c.rut) === normalizeRut(idChofer)
    );
    const nombre = `${ch?.nombre ?? ch?.nombres ?? ""} ${
    ch?.apellido ?? ch?.apellidos ?? ""}`.
    trim();
    return { nombre: nombre || ch?.rut || "", rut: ch?.rut || idChofer };
  }, [isChofer, auth, rutAuth, choferesFiltrados, idChofer]);

  const choferSeleccionado = useMemo(() => {
    return (
      choferesFiltrados.find(
        (c) => normalizeRut(c.rut) === normalizeRut(idChofer)
      ) || null
    );
  }, [choferesFiltrados, idChofer]);

  const camionesDisponibles = useMemo(() => {
    const base = camionesFiltrados;
    if (!base.length) return [];
    const rutSeleccionado = normalizeRut(isChofer ? rutAuth : idChofer);
    if (!rutSeleccionado) return [];
    const visibles = base.filter(
      (c) => normalizeRut(c.id_chofer_asignado) === rutSeleccionado
    );
    return visibles.
    filter(isCamionDisponible).
    map((c) => ({
      ...c,
      tieneAgenda:
      agendaCarga?.data?.id_camion &&
      agendaCarga.data.id_camion === c.id_camion
    }));
  }, [camionesFiltrados, agendaCarga, isChofer, rutAuth, idChofer]);

  const camionSeleccionado = useMemo(() => {
    if (!camionesDisponibles) return null;
    return (
      camionesDisponibles.find((cam) => cam.id_camion === Number(idCamion)) ||
      null);

  }, [camionesDisponibles, idCamion]);

  useEffect(() => {
    if (shouldFetchSucursales && !sucursalFiltro && opcionesSucursales.length) {
      setSucursalFiltro(String(opcionesSucursales[0].id_sucursal));
    }
  }, [shouldFetchSucursales, opcionesSucursales, sucursalFiltro]);

  useEffect(() => {
    const next = isChofer ?
    userSucursalId :
    mode === "global" ?
    sucursalFiltro ?
    Number(sucursalFiltro) :
    null :
    activeSucursalId;

    setSucursalId((prev) => prev === next ? prev : next);
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
    setIdCamion("");
    setProductos([]);
    setProductosReservados([]);
    setTabIndex(0);
    setPrioridad("Media");
    setNotas("");
    setDescargarRetornables(false);
  }, [idChofer]);

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
    !choferesFiltrados.some(
      (c) => normalizeRut(c.rut) === normalizeRut(idChofer)
    ))
    {
      setIdChofer("");
    }
  }, [isChofer, idChofer, choferesFiltrados]);

  useEffect(() => {
    if (
    idCamion &&
    !camionesDisponibles.some((c) => Number(c.id_camion) === Number(idCamion)))
    {
      setIdCamion("");
    }
  }, [idCamion, camionesDisponibles]);

  useEffect(() => {
    const { maxProductosAdicionales, cantidadProductosAdicionales } =
    capacidadAdicionales;
    if (maxProductosAdicionales === null) return;

    const cantidadNegativa = productos.some((p) => Number(p.cantidad) < 0);
    const excedeEspaciosDisponibles =
    cantidadProductosAdicionales > maxProductosAdicionales;

    const esValido = !cantidadNegativa && !excedeEspaciosDisponibles;

    setPuedeCrearAgenda(esValido);
  }, [productos, capacidadAdicionales]);

  useEffect(() => {
    const { maxProductosAdicionales } = capacidadAdicionales;
    if (maxProductosAdicionales === null) return;

    setProductos((prev) => {
      let restante = maxProductosAdicionales;
      let changed = false;

      const next = prev.map((prod) => {
        if (!prod.es_retornable) return prod;

        const cantidadActual = Number(prod.cantidad) || 0;
        const cantidadPermitida = Math.min(cantidadActual, Math.max(0, restante));
        restante -= cantidadPermitida;

        if (cantidadPermitida !== cantidadActual) {
          changed = true;
          return { ...prod, cantidad: cantidadPermitida };
        }

        return prod;
      });

      return changed ? next : prev;
    });
  }, [capacidadAdicionales.maxProductosAdicionales]);

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
    if (!idCamion || capacidadAdicionales.maxProductosAdicionales === null) {
      dispatch(
        showNotification({
          message: "Selecciona un camión para calcular la capacidad disponible.",
          severity: "warning"
        })
      );
      return;
    }

    if (capacidadAdicionales.espaciosRestantes <= 0) {
      dispatch(
        showNotification({
          message:
          "No quedan espacios disponibles para productos adicionales en este camión.",
          severity: "warning"
        })
      );
      return;
    }

    setProductos((prev) => [
    ...prev,
    { id_producto: "", cantidad: 0, notas: "", es_retornable: false }]
    );
  };

  const handleChangeProduct = (index, newProductId) => {
    const selectedProduct = productosDisponibles?.productos?.find(
      (prod) => prod.id_producto === Number(newProductId)
    );
    setProductos((prev) =>
    prev.map((prod, i) => {
      if (i !== index) return prod;

      const esRetornable = selectedProduct ?
      selectedProduct.es_retornable :
      false;
      const cantidadLimitada = limitarCantidadProducto(
        prev,
        index,
        prod.cantidad,
        esRetornable
      );

      return {
        ...prod,
        id_producto: Number(newProductId),
        cantidad: cantidadLimitada === null ? prod.cantidad : cantidadLimitada,
        es_retornable: esRetornable
      };
    })
    );
  };

  const handleChangeCantidad = (index, newCantidad) => {
    const cantidadNumerica = Number(newCantidad);

    if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
      return;
    }
    setProductos((prev) => {
      const prodActual = prev[index];
      const cantidadLimitada = limitarCantidadProducto(
        prev,
        index,
        cantidadNumerica,
        prodActual?.es_retornable
      );

      if (cantidadLimitada === null) return prev;

      return prev.map((prod, i) =>
      i === index ? { ...prod, cantidad: cantidadLimitada } : prod
      );
    });
  };

  const handleChangeNotas = (index, newNotas) => {
    setProductos((prev) =>
    prev.map((prod, i) => i === index ? { ...prod, notas: newNotas } : prod)
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
          severity: "warning"
        })
      );
      return;
    }

    if (camionSeleccionado && !camionSeleccionado.id_chofer_asignado) {
      dispatch(
        showNotification({
          message: "El camión seleccionado no tiene un usuario asignado.",
          severity: "warning"
        })
      );
      return;
    }

    if (
    capacidadAdicionales.maxProductosAdicionales !== null &&
    capacidadAdicionales.cantidadProductosAdicionales >
    capacidadAdicionales.maxProductosAdicionales
    ) {
      dispatch(
        showNotification({
          message:
          `La carga adicional supera la capacidad disponible del camión. ` +
          `Máximo permitido: ${capacidadAdicionales.maxProductosAdicionales}.`,
          severity: "warning"
        })
      );
      setPuedeCrearAgenda(false);
      return;
    }

    const payload = {
      id_sucursal: sucursalId,
      id_usuario_chofer: safeIdChofer,
      id_camion: Number(idCamion),
      prioridad,
      notas,
      descargarRetornables,
      productos: productos.map((p) => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        notas: p.notas,
        unidad_medida: "unidad",
        es_retornable: p.es_retornable
      }))
    };

    try {
      console.log(payload);
      await createAgenda(payload).unwrap();
      dispatch(
        showNotification({
          message: "Se ha creado agenda de carga con éxito",
          severity: "success"
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
          severity: "error"
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
        minHeight="60vh">

        <CircularProgress />
      </Box>);

  }

  if (errorChoferes || errorCamiones || errorProductos) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh">

        <Alert severity="error">
          Error al cargar datos. Intenta nuevamente.
        </Alert>
      </Box>);

  }

  const { productos: listaProductosOriginal = [] } = productosDisponibles || {};
  const listaProductos = listaProductosOriginal.filter((p) => p.es_retornable);

  const hayAgendaPendiente =
  !loadingAgenda &&
  (isChofer || !isChofer && idChofer) &&
  !isError &&
  agendaCarga &&
  agendaCarga?.data?.validada_por_chofer === false;

  const submitDisabled =
  loadingCreate ||
  !puedeCrearAgenda ||
  !safeIdChofer ||
  !idCamion ||
  productos.length === 0 && !hayPedidosConfirmados ||
  productos.some((p) => !p.id_producto || p.cantidad <= 0) ||
  camionSeleccionado?.estado === "En Ruta" ||
  isChofer &&
  camionSeleccionado &&
  camionSeleccionado.id_chofer_asignado !== rutAuth ||
              !isChofer &&
              camionSeleccionado?.id_chofer_asignado &&
              normalizeRut(camionSeleccionado.id_chofer_asignado) !==
              normalizeRut(safeIdChofer);

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}>

        <Box
          display="flex"
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          sx={{
            pb: 1,
            borderBottom: "1px solid",
            borderColor: "divider"
          }}>

          <Box display="flex" alignItems="center" gap={1.5} minWidth={0}>
            <Box
              sx={(theme) => ({
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                theme.palette.mode === "dark" ?
                theme.palette.primary.light :
                theme.palette.primary.main,
                bgcolor:
                theme.palette.mode === "dark" ?
                "rgba(90,141,213,0.14)" :
                "rgba(90,141,213,0.1)",
                flex: "0 0 auto"
              })}>

              <CalendarTodayIcon fontSize="small" />
            </Box>
            <Box minWidth={0}>
              <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 0 }}>
                Crear agenda de carga
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Planifica chofer, camión, pedidos confirmados y productos adicionales.
              </Typography>
            </Box>
          </Box>

          <Chip
            label={isChofer ? "Vista chofer" : "Planificación"}
            size="small"
            color="primary"
            variant="outlined" />
        </Box>

        {shouldFetchSucursales &&
        <AgendaSection
          icon={<StorefrontIcon fontSize="small" />}
          title="Sucursal"
          subtitle="Filtra choferes, camiones y productos antes de armar la carga.">

          <FormControl
            fullWidth
            size="small"
            error={Boolean(errorSucursales)}
            disabled={loadingSucursales}>

            <InputLabel id="sucursal-label">
              {loadingSucursales ?
              "Cargando sucursales..." :
              "Selecciona una sucursal"}
            </InputLabel>

            <Select
              labelId="sucursal-label"
              label={
              loadingSucursales ?
              "Cargando sucursales..." :
              "Selecciona una sucursal"
              }
              value={String(sucursalFiltro)}
              onChange={(e) => setSucursalFiltro(e.target.value)}
              sx={{
                borderRadius: 1.5,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1
                }
              }}
              renderValue={(selected) => {
                if (!selected)
                return <span style={{ opacity: 0.6 }}>-- Elegir --</span>;
                const s = opcionesSucursales.find(
                  (x) => String(x.id_sucursal) === String(selected)
                );
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StorefrontIcon fontSize="small" sx={{ color: "primary.main" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {s?.nombre ?? selected}
                    </Typography>
                  </Box>);

              }}>

              <MenuItem value="">
                <em>-- Elegir --</em>
              </MenuItem>

              {opcionesSucursales.map((s) =>
              <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                  <ListItemIcon>
                    <StorefrontIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={s.nombre}
                    secondary={`ID: ${s.id_sucursal}`} />

                </MenuItem>
              )}
            </Select>

            <FormHelperText>
              {errorSucursales ?
              "No se pudieron cargar las sucursales." :
              "La selección actual define el universo de datos disponibles."}
            </FormHelperText>
          </FormControl>
        </AgendaSection>
        }

        {hayAgendaPendiente &&
        <Box
          display="flex"
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          sx={(theme) => ({
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor:
            theme.palette.mode === "dark" ?
            theme.palette.primary.main :
            "rgba(90,141,213,0.28)",
            bgcolor:
            theme.palette.mode === "dark" ?
            "rgba(90,141,213,0.1)" :
            "rgba(90,141,213,0.06)"
          })}>

          <Box>
            <Typography variant="subtitle2" fontWeight={800}>
              Hay una agenda pendiente para hoy
            </Typography>
            {agendaCarga?.data?.fecha_hora &&
            <Typography variant="body2" color="text.secondary">
                Agenda del día: {convertirFechaLocal(agendaCarga.data.fecha_hora)}
              </Typography>
            }
          </Box>
          <Button
            onClick={() => setOpenModal(true)}
            size="small"
            variant="outlined"
            startIcon={<CheckCircleOutlineOutlinedIcon fontSize="small" />}>

            Ver agenda
          </Button>
        </Box>
        }

        {!loadingAgenda && isError &&
        <Alert severity="info">
            {error?.data?.error || "No hay agenda de carga pendiente para hoy."}
          </Alert>
        }

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <AgendaSection
              icon={<AssignmentTurnedInOutlinedIcon fontSize="small" />}
              title="Datos principales"
              subtitle="Elige responsable, camión y prioridad antes de revisar capacidad.">

              {sucursalReady && choferesFiltrados.length === 0 &&
              <Alert severity="warning" sx={{ mb: 2 }}>
                  No hay choferes con camión disponible para esta sucursal.
                </Alert>
              }

              {safeIdChofer && camionesDisponibles.length === 0 &&
              <Alert severity="warning" sx={{ mb: 2 }}>
                  El chofer seleccionado no tiene camiones disponibles asociados.
                </Alert>
              }

              <Grid container spacing={2}>
                <AgendaCargaFormInputs
                  isChofer={isChofer}
                  choferes={choferesFiltrados}
                  camiones={camionesDisponibles}
                  idChofer={isChofer ? idChofer : safeIdChofer}
                  disableChofer={!sucursalReady || choferesFiltrados.length === 0}
                  disableCamion={!safeIdChofer || camionesDisponibles.length === 0}
                  disableCargaFields={!idCamion}
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
                  choferDisplay={choferDisplay} />

              </Grid>

              {camionSeleccionado?.estado === "En Ruta" &&
              <Alert severity="warning" sx={{ mt: 2 }}>
                  Este camión está en ruta. No puedes crear una agenda hasta que
                  finalice su viaje.
                </Alert>
              }
            </AgendaSection>

            {safeIdChofer &&
            <AgendaSection
              icon={<CheckCircleOutlineOutlinedIcon fontSize="small" />}
              title="Pedidos confirmados"
              subtitle="Estos productos reservados se consideran en la capacidad del camión.">

              <PedidosConfirmadosList
                idChofer={safeIdChofer}
                setProductosReservados={setProductosReservados} />
            </AgendaSection>
            }

            <AgendaSection
              icon={<LocalShippingOutlinedIcon fontSize="small" />}
              title="Inventario y capacidad"
              subtitle={
              idCamion ?
              "Revisa el estado actual del camión antes de agregar productos." :
              "Selecciona un camión para ver la simulación de carga."
              }>

              {!idCamion &&
              <Alert severity="info">
                  Selecciona un camión para visualizar inventario y disponibilidad.
                </Alert>
              }

              {idCamion && loadingInventario &&
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1.5}
                minHeight={140}>

                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  Cargando inventario del camión...
                </Typography>
              </Box>
              }

              {idCamion && errorInventario &&
              <Alert severity="error">
                  Error al cargar el inventario del camión.
                </Alert>
              }

              {idCamion && inventarioData && !loadingInventario && !errorInventario &&
              <>
                  <Tabs
                  value={tabIndex}
                  onChange={(_, newValue) => setTabIndex(newValue)}
                  sx={{
                    mb: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    minHeight: 40
                  }}>

                    <Tab label="Vista gráfica" />
                    <Tab label="Detalle capacidad" />
                  </Tabs>
                  {tabIndex === 0 &&
                <InventarioCamion
                  inventarioData={inventarioData.data}
                  productos={productos}
                  productosReservados={productosReservados}
                  modo="simulacion" />

                }
                  {tabIndex === 1 &&
                <CapacidadCargaCamion
                  capacidadTotal={inventarioData.data.capacidad_total}
                  reservadosRetornables={
                  inventarioData.data.reservados_retornables
                  }
                  disponibles={inventarioData.data.disponibles}
                  retorno={inventarioData.data.retorno}
                  productos={productos}
                  productosReservados={productosReservados}
                  onValidezCambio={setPuedeCrearAgenda} />

                }
                </>
              }
            </AgendaSection>

            <AgendaCargaProductsSection
              productos={productos}
              productosDisponibles={listaProductos}
              maxProductosAdicionales={capacidadAdicionales.maxProductosAdicionales}
              cantidadProductosAdicionales={
              capacidadAdicionales.cantidadProductosAdicionales
              }
              espaciosRestantes={capacidadAdicionales.espaciosRestantes}
              cantidadMaximaPorFila={cantidadMaximaPorFila}
              puedeAgregarProducto={
              Boolean(idCamion) &&
              capacidadAdicionales.maxProductosAdicionales !== null &&
              capacidadAdicionales.espaciosRestantes > 0
              }
              handleAddProductRow={handleAddProductRow}
              handleChangeProduct={handleChangeProduct}
              handleChangeCantidad={handleChangeCantidad}
              handleChangeNotas={handleChangeNotas}
              handleRemoveRow={handleRemoveRow} />

            <Box
              display="flex"
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              sx={(theme) => ({
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor:
                theme.palette.mode === "dark" ?
                theme.palette.grey[900] :
                "#f8fafc"
              })}>

              <Box>
                <Typography variant="subtitle2" fontWeight={800}>
                  Crear agenda
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revisa chofer, camión, pedidos y productos antes de confirmar.
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={submitDisabled}
                startIcon={
                loadingCreate ?
                undefined :
                <CheckCircleOutlineOutlinedIcon fontSize="small" />
                }
                sx={{
                  textTransform: "none",
                  minWidth: { xs: "100%", sm: 180 }
                }}>

                {loadingCreate ? "Creando..." : "Crear agenda"}
              </Button>
            </Box>
          </Box>
        </form>

      <ConfirmarCargaModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        agendaCarga={agendaCarga} />

      <NoCajaAsignadaDialog
        open={openNoCajaModal}
        handleClose={() => setOpenNoCajaModal(false)}
        choferName={choferSeleccionado?.nombre} />

      <NoUsuarioCamionDialog
        open={openNoUsuarioCamionModal}
        handleClose={() => setOpenNoUsuarioCamionModal(false)}
        camionLabel={
        camionSeleccionado ?
        `${camionSeleccionado.id_camion} - ${camionSeleccionado.placa}` :
        undefined
        } />

      </Box>
    </Box>);

};

export default CreateAgendaCargaForm;
