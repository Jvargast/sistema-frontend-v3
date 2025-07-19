import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Typography,
  Box,
  IconButton,
  Dialog,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Container } from "@mui/material";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CloseIcon from "@mui/icons-material/Close";

import InventarioCargado from "../../components/viaje/InventarioCargado";
import ListaDestinos from "../../components/viaje/ListaDestinos";
import InfoGeneral from "../../components/viaje/InfoGeneral";
import ResumenDelDia from "../../components/viaje/ResumenDelDia";
import FormularioEntregaModal from "../../components/entregas/FormularioEntregaModal";
import ModalVentaRapida from "../../components/venta_rapida_chofer/ModalVentaRapida";
import DetallePedidoModal from "../../components/entregas/DetallePedidoModal";

import DoneIcon from "@mui/icons-material/Done";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import {
  emitRefetchAgendaViajes,
  onRefetchAgendaViajes,
} from "../../utils/eventBus";
import { useGetPedidoByIdQuery } from "../../store/services/pedidosApi";
import { useGetEntregasByAgendaIdQuery } from "../../store/services/entregasApi";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import { useFinalizarViajeMutation } from "../../store/services/agendaViajesApi";
import { useErrorChecker } from "../../utils/useErrorChecker";
import PermissionMessage from "../../components/common/PermissionMessage";
import InventarioCamion from "../../components/inventario/InventarioCamion";
import DialogFinalizarViaje from "../../components/viaje/DialogFinalizarViaje";
import DialogSeleccionarOrigen from "../../components/viaje/DialogSeleccionarOrigen";

const ViajeChofer = ({ viaje }) => {
  const dispatch = useDispatch();
  const [fabOpen, setFabOpen] = useState(false);
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openInventarioModal, setOpenInventarioModal] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dejaRetornables, setDejaRetornables] = useState(true);
  const [descargarAuto, setDescargarAuto] = useState(true);
  const [descargarDisponibles, setDescargarDisponibles] = useState(false);

  const DEFAULT_ORIGEN = { lat: -27.0675, lng: -70.8189 };
  const [origen, setOrigen] = useState(DEFAULT_ORIGEN);
  const [loadingOrigen, setLoadingOrigen] = useState(true);
  const [ubicacionError, setUbicacionError] = useState(false);
  const [openOrigenModal, setOpenOrigenModal] = useState(false);

  const [origenInicial, setOrigenInicial] = useState(null);
  const origenInicialSetRef = useRef(false);

  useEffect(() => {
    setLoadingOrigen(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigen({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoadingOrigen(false);
          setUbicacionError(false);
        },
        () => {
          setOrigen(DEFAULT_ORIGEN);
          setLoadingOrigen(false);
          setUbicacionError(true);
        }
      );
    } else {
      setOrigen(DEFAULT_ORIGEN);
      setLoadingOrigen(false);
      setUbicacionError(true);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (origen && !origenInicialSetRef.current) {
      setOrigenInicial(origen);
      origenInicialSetRef.current = true;
    }
  }, [origen]);

  const handleAbrirDialogoFinalizar = () => {
    setConfirmDialogOpen(true);
  };

  const toggleFab = () => {
    setFabOpen((prev) => {
      const nextState = !prev;
      return nextState;
    });
  };

  const renderSpeedDialAction = (mostrar, icono, titulo, onClick) => {
    if (!mostrar) return null;
    return (
      <SpeedDialAction
        icon={icono}
        tooltipTitle={titulo}
        onClick={onClick}
        tabIndex={0}
        aria-hidden={false}
      />
    );
  };

  useEffect(() => {
    if (!openInventarioModal) {
      const root = document.getElementById("root");
      if (root?.getAttribute("aria-hidden") === "true") {
        root.setAttribute("aria-hidden", "false");
      }
    }
  }, [openInventarioModal]);

  useEffect(() => {
    if (!openInventarioModal && fabRef.current) {
      fabRef.current.blur();
      setTimeout(() => fabRef.current.focus(), 50);
    }
  }, [openInventarioModal]);

  const {
    data: entregasData,
    refetch: refetchEntregas,
    error: errorEntregas,
  } = useGetEntregasByAgendaIdQuery(
    {
      id_agenda_viaje: viaje?.id_agenda_viaje,
    },
    { skip: !viaje?.id_agenda_viaje }
  );

  const {
    data: inventarioCamion,
    isLoading: cargandoInventario,
    refetch: refetchInventario,
    error: errorInventario,
  } = useGetEstadoInventarioCamionQuery(viaje?.id_camion, {
    skip: !viaje?.id_camion,
  });

  // Refs
  const isMounted = useRef(false);
  const isInventarioReady = useRef(false);
  const isEntregasReady = useRef(false);
  const refetchInventarioRef = useRef(null);
  const refetchEntregasRef = useRef(null);
  const fabRef = useRef(null);

  // Montaje
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Guardar refs
  useEffect(() => {
    if (refetchInventario) {
      refetchInventarioRef.current = refetchInventario;
      isInventarioReady.current = true;
    }
  }, [refetchInventario]);

  useEffect(() => {
    if (refetchEntregas) {
      refetchEntregasRef.current = refetchEntregas;
      isEntregasReady.current = true;
    }
  }, [refetchEntregas]);

  // Listener WebSocket
  useEffect(() => {
    const refrescarDatos = () => {
      console.log("🔄 Refetch ejecutado en ViajeChofer");

      if (
        isMounted.current &&
        isInventarioReady.current &&
        typeof refetchInventarioRef.current === "function"
      ) {
        refetchInventarioRef.current();
      } else {
        console.warn("⚠️ Inventario no listo para refetch.");
      }

      if (
        isMounted.current &&
        isEntregasReady.current &&
        typeof refetchEntregasRef.current === "function"
      ) {
        refetchEntregasRef.current();
      } else {
        console.warn("⚠️ Entregas no listas para refetch.");
      }
    };

    const unsubscribe = onRefetchAgendaViajes(refrescarDatos);
    return () => unsubscribe();
  }, []);

  const [finalizarViaje] = useFinalizarViajeMutation();
  const [entregas, setEntregas] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const [modalVentaRapidaOpen, setModalVentaRapidaOpen] = useState(false);
  const [detallePedidoOpen, setDetallePedidoOpen] = useState(false);
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState(null);
  const {
    data: pedidoCompleto,
    isFetching: loadingPedido,
    isSuccess: successPedido,
    error: errorPedido,
  } = useGetPedidoByIdQuery(pedidoSeleccionadoId, {
    skip: !pedidoSeleccionadoId,
  });

  useEffect(() => {
    if (viaje?.destinos) {
      const entregasMap = {};
      if (!errorEntregas && entregasData?.data?.length > 0) {
        entregasData.data.forEach((entrega) => {
          const idPedido = entrega?.pedido?.id_pedido;
          if (idPedido) {
            entregasMap[idPedido] = {
              entregado: true,
              entrega,
            };
          }
        });
      }

      const estadoInicial = viaje.destinos.reduce((acc, destino) => {
        acc[destino.id_pedido] = entregasMap[destino.id_pedido] || {
          entregado: false,
          entrega: null,
        };
        return acc;
      }, {});

      setEntregas(estadoInicial);
    }
  }, [viaje, entregasData, errorEntregas]);

  const handleOpenEntrega = (destino) => {
    setDestinoSeleccionado(destino);
    setModalOpen(true);
  };
  const handleEntregaExitosa = (idPedido, entregaData) => {
    setEntregas((prev) => ({
      ...prev,
      [idPedido]: { entregado: true, entrega: entregaData },
    }));

    const destinoEntregado = viaje.destinos.find(
      (d) => d.id_pedido === idPedido
    );
    if (destinoEntregado) {
      setOrigen({ lat: destinoEntregado.lat, lng: destinoEntregado.lng });
    }
    refetchInventario();
    emitRefetchAgendaViajes();
  };

  const handleFinalizarViaje = async () => {
    try {
      await finalizarViaje({
        id_agenda_viaje: viaje.id_agenda_viaje,
        descargarAuto,
        descargarDisponibles,
        dejaRetornablesEnPlanta: dejaRetornables,
      }).unwrap();
      dispatch(
        showNotification({
          message: "¡Viaje finalizado con éxito!",
          severity: "success",
        })
      );
    } catch {
      dispatch(
        showNotification({
          message: "Error al finalizar el viaje",
          severity: "error",
        })
      );
    }
  };
  const handleVerDetallePedido = (destino) => {
    setPedidoSeleccionadoId(destino.id_pedido);
    setDetallePedidoOpen(true);
  };

  const entregasCompletadas = Object.values(entregas).filter(
    (e) => e.entregado
  ).length;

  const todasEntregasCompletadas =
    viaje?.destinos?.length > 0 &&
    entregasCompletadas === viaje.destinos.length;

  const relevantError = useErrorChecker(
    errorEntregas,
    errorInventario,
    errorPedido
  );

  if (relevantError.type === "permission") {
    return <PermissionMessage requiredPermission={relevantError.permission} />;
  } else if (relevantError.type === "generic") {
    return <Typography color="error">{relevantError.message}</Typography>;
  }
  return (
    <Container maxWidth="xl" sx={{ mt: 4, pb: 8 }}>
      <InfoGeneral viaje={viaje} />
      <ResumenDelDia
        totalDestinos={viaje.destinos.length}
        entregasCompletadas={entregasCompletadas}
      />

      {loadingOrigen ? (
        <Box textAlign="center" mt={2}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            Obteniendo tu ubicación actual...
          </Typography>
        </Box>
      ) : ubicacionError ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No pudimos obtener tu ubicación actual. Se usará un punto de partida
          por defecto.
        </Alert>
      ) : null}
      {entregasCompletadas === 0 && (
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => setOpenOrigenModal(true)}
        >
          Cambiar punto de origen
        </Button>
      )}
      <ListaDestinos
        destinos={viaje.destinos}
        entregas={entregas}
        origen={origen}
        origenInicial={origenInicial}
        onOpenEntrega={handleOpenEntrega}
        onVerDetallePedido={handleVerDetallePedido}
      />
      <InventarioCargado
        inventario={inventarioCamion?.data}
        isLoading={cargandoInventario}
      />
      {modalOpen && destinoSeleccionado && (
        <FormularioEntregaModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            refetchEntregas();
          }}
          destino={destinoSeleccionado}
          id_agenda_viaje={viaje.id_agenda_viaje}
          onSuccess={handleEntregaExitosa}
        />
      )}

      {detallePedidoOpen && successPedido && (
        <DetallePedidoModal
          open={detallePedidoOpen}
          onClose={() => {
            setDetallePedidoOpen(false);
            setPedidoSeleccionadoId(null);
          }}
          pedido={pedidoCompleto}
          loading={loadingPedido}
        />
      )}

      <SpeedDial
        ref={fabRef}
        ariaLabel="Acciones del viaje"
        sx={{
          position: "fixed",
          bottom: 60,
          right: 24,
          zIndex: 1200,
          "& .MuiSpeedDialAction-fab": {
            transition: "none !important",
          },
        }}
        icon={<SpeedDialIcon onClick={toggleFab} />}
        direction="up"
        open={fabOpen}
        onClose={() => setFabOpen(false)}
        onOpen={() => setFabOpen(true)}
      >
        {renderSpeedDialAction(
          fabOpen,
          <Inventory2Icon />,
          "Ver Inventario",
          () => setOpenInventarioModal(true)
        )}

        {renderSpeedDialAction(
          fabOpen && viaje?.estado === "En Tránsito",
          <PointOfSaleIcon />,
          "Venta Rápida",
          () => setModalVentaRapidaOpen(true)
        )}

        {renderSpeedDialAction(
          fabOpen &&
            (viaje?.destinos?.length === 0 || todasEntregasCompletadas),
          <DoneIcon />,
          "Finalizar Viaje",
          handleAbrirDialogoFinalizar
        )}
      </SpeedDial>

      {modalVentaRapidaOpen && (
        <ModalVentaRapida
          open={modalVentaRapidaOpen}
          onClose={() => setModalVentaRapidaOpen(false)}
          viaje={viaje}
          onSuccess={() => {
            dispatch(
              showNotification({
                message: "¡Venta rápida registrada!",
                severity: "success",
              })
            );
            refetchInventario();
          }}
        />
      )}
      <Dialog
        fullScreen={isTabletOrMobile}
        hideBackdrop
        disableEnforceFocus
        disableRestoreFocus
        disableAutoFocus
        open={openInventarioModal}
        onClose={() => {
          setOpenInventarioModal(false);
          setFabOpen(false);
          document.activeElement.blur();
        }}
        keepMounted={false}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "#fff",
          }}
        >
          <Typography variant="h6">🛻 Inventario del Camión</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              setOpenInventarioModal(false);
              setFabOpen(false);
              document.activeElement.blur();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <InventarioCamion
            idCamion={viaje.id_camion}
            modo="visual"
            inventarioData={inventarioCamion?.data}
          />
        </Box>
      </Dialog>
      <DialogFinalizarViaje
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleFinalizarViaje}
        dejaRetornables={dejaRetornables}
        setDejaRetornables={setDejaRetornables}
        descargarAuto={descargarAuto}
        setDescargarAuto={setDescargarAuto}
        descargarDisponibles={descargarDisponibles}
        setDescargarDisponibles={setDescargarDisponibles}
      />
      <DialogSeleccionarOrigen
        open={openOrigenModal}
        onClose={() => setOpenOrigenModal(false)}
        origen={origen}
        setOrigen={setOrigen}
      />
    </Container>
  );
};

ViajeChofer.propTypes = {
  viaje: PropTypes.object.isRequired,
};

export default ViajeChofer;
