import Dialog from "../../components/common/CompatDialog";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  IconButton,
  DialogTitle,
  Container,
  Fab,
  Portal,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CloseIcon from "@mui/icons-material/Close";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";

import InventarioCargado from "../../components/viaje/InventarioCargado";
import ListaDestinos from "../../components/viaje/ListaDestinos";
import InfoGeneral from "../../components/viaje/InfoGeneral";
import ResumenDelDia from "../../components/viaje/ResumenDelDia";
import FormularioEntregaModal from "../../components/entregas/FormularioEntregaModal";
import ModalVentaRapida from "../../components/venta_rapida_chofer/ModalVentaRapida";
import DetallePedidoModal from "../../components/entregas/DetallePedidoModal";

import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import {
  emitRefetchAgendaViajes,
  onRefetchAgendaViajes } from
"../../utils/eventBus";
import { useGetPedidoByIdQuery } from "../../store/services/pedidosApi";
import { useGetEntregasByAgendaIdQuery } from "../../store/services/entregasApi";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import { useFinalizarViajeMutation } from "../../store/services/agendaViajesApi";
import { useErrorChecker } from "../../utils/useErrorChecker";
import PermissionMessage from "../../components/common/PermissionMessage";
import InventarioCamion from "../../components/inventario/InventarioCamion";
import DialogFinalizarViaje from "../../components/viaje/DialogFinalizarViaje";
import { useChoferTracking } from "../../hooks/useChoferTracking";
import { useSelector } from "react-redux";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const blurActiveElement = () => {
  if (typeof document === "undefined") return;
  const activeElement = document.activeElement;
  if (activeElement && typeof activeElement.blur === "function") {
    activeElement.blur();
  }
};

const FLOATING_FAB_SIZE = 58;
const FLOATING_FAB_MARGIN = 12;
const FLOATING_FAB_DRAG_THRESHOLD = 2;
const FLOATING_FAB_EDGE_RESISTANCE = 0.34;
const FLOATING_FAB_MAX_EDGE_PULL = 30;
const FLOATING_FAB_SETTLE_MS = 180;
const FLOATING_FAB_STORAGE_KEY = "viajeChoferFloatingFabPosition";

const getFloatingBounds = (isMobile) => {
  if (typeof window === "undefined") {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  const bottomClearance = isMobile ? 92 : 16;
  return {
    minX: FLOATING_FAB_MARGIN,
    maxX: Math.max(
      FLOATING_FAB_MARGIN,
      window.innerWidth - FLOATING_FAB_SIZE - FLOATING_FAB_MARGIN
    ),
    minY: FLOATING_FAB_MARGIN,
    maxY: Math.max(
      FLOATING_FAB_MARGIN,
      window.innerHeight - FLOATING_FAB_SIZE - bottomClearance
    ),
  };
};

const clampFloatingPosition = (position, isMobile) => {
  const bounds = getFloatingBounds(isMobile);
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, position.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, position.y)),
  };
};

const applyEdgeResistance = (value, min, max) => {
  if (value < min) {
    return (
      min -
      Math.min(
        (min - value) * FLOATING_FAB_EDGE_RESISTANCE,
        FLOATING_FAB_MAX_EDGE_PULL
      )
    );
  }

  if (value > max) {
    return (
      max +
      Math.min(
        (value - max) * FLOATING_FAB_EDGE_RESISTANCE,
        FLOATING_FAB_MAX_EDGE_PULL
      )
    );
  }

  return value;
};

const getResistedFloatingPosition = (position, isMobile) => {
  const bounds = getFloatingBounds(isMobile);
  return {
    x: applyEdgeResistance(position.x, bounds.minX, bounds.maxX),
    y: applyEdgeResistance(position.y, bounds.minY, bounds.maxY),
  };
};

const getDefaultFloatingPosition = (isMobile) => {
  const bounds = getFloatingBounds(isMobile);
  return { x: bounds.maxX, y: bounds.maxY };
};

const getInitialFloatingPosition = () => {
  if (typeof window === "undefined") return { x: 0, y: 0 };

  const isMobile = window.matchMedia("(max-width:899.95px)").matches;
  let saved = null;

  try {
    saved = localStorage.getItem(FLOATING_FAB_STORAGE_KEY);
  } catch {
    saved = null;
  }

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
        return clampFloatingPosition(parsed, isMobile);
      }
    } catch {
      try {
        localStorage.removeItem(FLOATING_FAB_STORAGE_KEY);
      } catch {
        // Ignore storage failures; the default position is enough.
      }
    }
  }

  return getDefaultFloatingPosition(isMobile);
};

const saveFloatingPosition = (position) => {
  try {
    localStorage.setItem(FLOATING_FAB_STORAGE_KEY, JSON.stringify(position));
  } catch {
    // Ignore storage failures; dragging should still work for the current session.
  }
};

const getFloatingTransform = (position) =>
  `translate3d(${position.x}px, ${position.y}px, 0)`;

const stopNativeFloatingEvent = (event) => {
  event.stopPropagation?.();
  event.stopImmediatePropagation?.();
  if (event.cancelable) event.preventDefault();
};

const stopReactFloatingEvent = (event) => {
  event.stopPropagation();
};

const blockReactFloatingGesture = (event) => {
  stopReactFloatingEvent(event);
  event.nativeEvent?.stopImmediatePropagation?.();
  if (event.cancelable || event.nativeEvent?.cancelable) {
    event.preventDefault();
  }
};

const FloatingDriverActions = ({ actions }) => {
  const [fabOpen, setFabOpen] = useState(false);
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [floatingFabPosition, setFloatingFabPosition] = useState(
    getInitialFloatingPosition
  );
  const floatingFabRef = useRef(null);
  const floatingFabPositionRef = useRef(floatingFabPosition);
  const floatingFabFrameRef = useRef(null);
  const pendingFloatingFabPositionRef = useRef(null);
  const dragStateRef = useRef(null);
  const removeFloatingDragListenersRef = useRef(null);
  const settleTimerRef = useRef(null);

  const removeFloatingDragListeners = useCallback(() => {
    removeFloatingDragListenersRef.current?.();
    removeFloatingDragListenersRef.current = null;
  }, []);

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current === null) return;
    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = null;
  }, []);

  const setFloatingFabSettling = useCallback((enabled) => {
    if (!floatingFabRef.current) return;
    floatingFabRef.current.style.transition = enabled
      ? `transform ${FLOATING_FAB_SETTLE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : "none";
  }, []);

  const applyFloatingFabTransform = useCallback((position) => {
    floatingFabPositionRef.current = position;
    pendingFloatingFabPositionRef.current = position;

    if (floatingFabFrameRef.current !== null) return;

    const commitTransform = () => {
      floatingFabFrameRef.current = null;
      const nextPosition = pendingFloatingFabPositionRef.current;
      pendingFloatingFabPositionRef.current = null;
      if (!nextPosition || !floatingFabRef.current) return;
      floatingFabRef.current.style.transform =
        getFloatingTransform(nextPosition);
    };

    if (
      typeof window === "undefined" ||
      typeof window.requestAnimationFrame !== "function"
    ) {
      commitTransform();
      return;
    }

    floatingFabFrameRef.current = window.requestAnimationFrame(commitTransform);
  }, []);

  const handleFloatingDragBlocker = useCallback((event) => {
    if (!dragStateRef.current) return;
    stopNativeFloatingEvent(event);
  }, []);

  const handleDocumentFloatingPointerMove = useCallback(
    (event) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      stopNativeFloatingEvent(event);

      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (
        !dragState.moved &&
        Math.hypot(dx, dy) < FLOATING_FAB_DRAG_THRESHOLD
      ) {
        return;
      }

      if (!dragState.moved) {
        dragState.moved = true;
        setFabOpen((prev) => (prev ? false : prev));
        floatingFabRef.current?.setAttribute("data-dragging", "true");
      }

      applyFloatingFabTransform(
        getResistedFloatingPosition(
          {
            x: dragState.origin.x + dx,
            y: dragState.origin.y + dy,
          },
          isTabletOrMobile
        )
      );
    },
    [applyFloatingFabTransform, isTabletOrMobile]
  );

  const handleDocumentFloatingPointerEnd = useCallback(
    (event) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      stopNativeFloatingEvent(event);
      removeFloatingDragListeners();
      dragState.element?.releasePointerCapture?.(event.pointerId);

      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      const finalPosition = clampFloatingPosition(
        {
          x: dragState.origin.x + dx,
          y: dragState.origin.y + dy,
        },
        isTabletOrMobile
      );
      const wasMoved = dragState.moved;
      dragStateRef.current = null;
      floatingFabRef.current?.removeAttribute("data-dragging");

      if (wasMoved) {
        setFloatingFabSettling(true);
      }

      applyFloatingFabTransform(finalPosition);

      if (wasMoved) {
        setFloatingFabPosition(finalPosition);
        saveFloatingPosition(finalPosition);
        clearSettleTimer();
        settleTimerRef.current = window.setTimeout(() => {
          setFloatingFabSettling(false);
          settleTimerRef.current = null;
        }, FLOATING_FAB_SETTLE_MS);
        return;
      }

      setFabOpen((prev) => !prev);
    },
    [
      applyFloatingFabTransform,
      clearSettleTimer,
      isTabletOrMobile,
      removeFloatingDragListeners,
      setFloatingFabSettling,
    ]
  );

  const handleFloatingPointerDown = useCallback(
    (event) => {
      if (event.button != null && event.button !== 0) return;

      blockReactFloatingGesture(event);
      removeFloatingDragListeners();
      clearSettleTimer();
      setFloatingFabSettling(false);

      event.currentTarget.setPointerCapture?.(event.pointerId);
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: floatingFabPositionRef.current,
        moved: false,
        element: event.currentTarget,
      };

      const listenerOptions = { capture: true, passive: false };
      document.addEventListener(
        "pointermove",
        handleDocumentFloatingPointerMove,
        listenerOptions
      );
      document.addEventListener(
        "pointerup",
        handleDocumentFloatingPointerEnd,
        listenerOptions
      );
      document.addEventListener(
        "pointercancel",
        handleDocumentFloatingPointerEnd,
        listenerOptions
      );
      document.addEventListener(
        "touchmove",
        handleFloatingDragBlocker,
        listenerOptions
      );
      document.addEventListener(
        "wheel",
        handleFloatingDragBlocker,
        listenerOptions
      );

      removeFloatingDragListenersRef.current = () => {
        document.removeEventListener(
          "pointermove",
          handleDocumentFloatingPointerMove,
          true
        );
        document.removeEventListener(
          "pointerup",
          handleDocumentFloatingPointerEnd,
          true
        );
        document.removeEventListener(
          "pointercancel",
          handleDocumentFloatingPointerEnd,
          true
        );
        document.removeEventListener(
          "touchmove",
          handleFloatingDragBlocker,
          true
        );
        document.removeEventListener(
          "wheel",
          handleFloatingDragBlocker,
          true
        );
      };
    },
    [
      handleDocumentFloatingPointerEnd,
      handleDocumentFloatingPointerMove,
      handleFloatingDragBlocker,
      removeFloatingDragListeners,
      clearSettleTimer,
      setFloatingFabSettling,
    ]
  );

  const handleFloatingKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    setFabOpen((prev) => !prev);
  };

  useEffect(() => {
    applyFloatingFabTransform(floatingFabPosition);
  }, [applyFloatingFabTransform, floatingFabPosition]);

  useEffect(() => {
    const handleResize = () => {
      setFloatingFabPosition((current) => {
        const nextPosition = clampFloatingPosition(current, isTabletOrMobile);
        applyFloatingFabTransform(nextPosition);
        return nextPosition;
      });
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [applyFloatingFabTransform, isTabletOrMobile]);

  useEffect(
    () => () => {
      removeFloatingDragListeners();
      clearSettleTimer();
      if (
        floatingFabFrameRef.current !== null &&
        typeof window !== "undefined" &&
        typeof window.cancelAnimationFrame === "function"
      ) {
        window.cancelAnimationFrame(floatingFabFrameRef.current);
      }
    },
    [clearSettleTimer, removeFloatingDragListeners]
  );

  useEffect(() => {
    if (!fabOpen) return undefined;

    const handlePointerDown = (event) => {
      if (floatingFabRef.current?.contains(event.target)) return;
      setFabOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [fabOpen]);

  const actionsOpenDown = floatingFabPosition.y < 190;
  const handleFloatingActionClick = (event, action) => {
    event.stopPropagation();
    blurActiveElement();
    setFabOpen(false);
    action.onClick();
  };

  return (
    <Portal>
      <Box
        ref={floatingFabRef}
        sx={(theme) => ({
          position: "fixed",
          left: 0,
          top: 0,
          width: FLOATING_FAB_SIZE,
          height: FLOATING_FAB_SIZE,
          transform: getFloatingTransform(floatingFabPosition),
          willChange: "transform",
          contain: "layout style",
          zIndex: theme.zIndex.tooltip,
          pointerEvents: "auto",
          touchAction: "none",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          "&[data-dragging='true'] .driver-floating-primary": {
            transform: "scale(1.04)",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 18px 34px rgba(15, 23, 42, 0.3)"
                : "0 14px 28px rgba(0, 0, 0, 0.44)",
          },
        })}
      >
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            ...(actionsOpenDown
              ? { top: `calc(100% + 10px)` }
              : { bottom: `calc(100% + 10px)` }),
            display: "flex",
            flexDirection: actionsOpenDown ? "column" : "column-reverse",
            alignItems: "center",
            gap: 1,
            opacity: fabOpen ? 1 : 0,
            pointerEvents: fabOpen ? "auto" : "none",
            transform: fabOpen
              ? "translateX(-50%) translateY(0) scale(1)"
              : `translateX(-50%) translateY(${
                  actionsOpenDown ? "-8px" : "8px"
                }) scale(0.96)`,
            transformOrigin: actionsOpenDown ? "top center" : "bottom center",
            transition: "opacity 140ms ease, transform 140ms ease",
          }}
        >
          {actions.map((action) => (
            <Tooltip key={action.key} title={action.label} placement="left">
              <Fab
                size="small"
                aria-label={action.label}
                onPointerDown={stopReactFloatingEvent}
                onClick={(event) => handleFloatingActionClick(event, action)}
                sx={(theme) => ({
                  width: 44,
                  height: 44,
                  minHeight: 44,
                  borderRadius: 1.25,
                  color: "#0F172A",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${alpha("#0F172A", 0.24)}`,
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 8px 20px rgba(15, 23, 42, 0.14)"
                      : "0 8px 20px rgba(0, 0, 0, 0.32)",
                  "&:hover": {
                    bgcolor: alpha("#0F172A", 0.06),
                    borderColor: "#0F172A",
                    boxShadow: "none",
                  },
                })}
              >
                {action.icon}
              </Fab>
            </Tooltip>
          ))}
        </Box>

        <Fab
          className="driver-floating-primary"
          aria-label={
            fabOpen
              ? "Cerrar acciones del viaje"
              : "Abrir acciones del viaje"
          }
          aria-expanded={fabOpen}
          onPointerDown={handleFloatingPointerDown}
          onPointerMove={blockReactFloatingGesture}
          onPointerUp={blockReactFloatingGesture}
          onPointerCancel={blockReactFloatingGesture}
          onClick={blockReactFloatingGesture}
          onKeyDown={handleFloatingKeyDown}
          sx={(theme) => ({
            width: FLOATING_FAB_SIZE,
            height: FLOATING_FAB_SIZE,
            borderRadius: 1.5,
            bgcolor: "#0F172A",
            color: theme.palette.common.white,
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
            transition:
              "transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 14px 30px rgba(15, 23, 42, 0.26)"
                : "0 10px 24px rgba(0, 0, 0, 0.36)",
            "&:active": {
              cursor: "grabbing",
            },
            "&:hover": {
              bgcolor: theme.palette.common.black,
              boxShadow: "none",
            },
          })}
        >
          {fabOpen ? <CloseIcon /> : <AddIcon />}
        </Fab>
      </Box>
    </Portal>
  );
};

FloatingDriverActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
};

const ViajeChofer = ({ viaje }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openInventarioModal, setOpenInventarioModal] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dejaRetornables, setDejaRetornables] = useState(true);
  const [descargarAuto, setDescargarAuto] = useState(true);
  const [descargarDisponibles, setDescargarDisponibles] = useState(false);

  const viajeId = viaje?.id_agenda_viaje;
  const origenInicial = viaje?.origen_inicial || null;
  const [origenActualOverride, setOrigenActualOverride] = useState(null);
  const origenActual =
    origenActualOverride?.viajeId === viajeId
      ? origenActualOverride.value
      : origenInicial;

  const user = useSelector((state) => state.auth.user);

  useChoferTracking({
    viajeActivo: viaje?.estado === "En Tránsito",
    rut: user?.id
  });

  const handleAbrirDialogoFinalizar = () => {
    blurActiveElement();
    setConfirmDialogOpen(true);
  };

  const {
    data: entregasData,
    refetch: refetchEntregas,
    error: errorEntregas
  } = useGetEntregasByAgendaIdQuery(
    {
      id_agenda_viaje: viaje?.id_agenda_viaje
    },
    { skip: !viaje?.id_agenda_viaje }
  );

  const {
    data: inventarioCamion,
    isLoading: cargandoInventario,
    refetch: refetchInventario,
    error: errorInventario
  } = useGetEstadoInventarioCamionQuery(viaje?.id_camion, {
    skip: !viaje?.id_camion
  });

  useRegisterRefresh(
    "viajes",
    async () => {
      await Promise.all([refetchEntregas(), refetchInventario()]);
      return true;
    },
    [refetchEntregas, refetchInventario]
  );
  const isMounted = useRef(false);
  const isInventarioReady = useRef(false);
  const isEntregasReady = useRef(false);
  const refetchInventarioRef = useRef(null);
  const refetchEntregasRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  useEffect(() => {
    const refrescarDatos = () => {
      console.log("🔄 Refetch ejecutado en ViajeChofer");

      if (
      isMounted.current &&
      isInventarioReady.current &&
      typeof refetchInventarioRef.current === "function")
      {
        refetchInventarioRef.current();
      } else {
        console.warn("⚠️ Inventario no listo para refetch.");
      }

      if (
      isMounted.current &&
      isEntregasReady.current &&
      typeof refetchEntregasRef.current === "function")
      {
        refetchEntregasRef.current();
      } else {
        console.warn("⚠️ Entregas no listas para refetch.");
      }
    };

    const unsubscribe = onRefetchAgendaViajes(refrescarDatos);
    return () => unsubscribe();
  }, []);

  const [finalizarViaje] = useFinalizarViajeMutation();
  const [entregasOverride, setEntregasOverride] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const [modalVentaRapidaOpen, setModalVentaRapidaOpen] = useState(false);
  const [detallePedidoOpen, setDetallePedidoOpen] = useState(false);
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState(null);
  const {
    data: pedidoCompleto,
    isFetching: loadingPedido,
    isSuccess: successPedido,
    error: errorPedido
  } = useGetPedidoByIdQuery(pedidoSeleccionadoId, {
    skip: !pedidoSeleccionadoId
  });

  const entregasBase = useMemo(() => {
    if (!viaje?.destinos) return {};

    const entregasMap = {};
    if (!errorEntregas && entregasData?.data?.length > 0) {
      entregasData.data.forEach((entrega) => {
        if (
        entrega?.estado_entrega &&
        entrega.estado_entrega.toLowerCase() === "anulada")
        {
          return;
        }
        const idPedido = entrega?.pedido?.id_pedido;
        if (idPedido) {
          entregasMap[idPedido] = {
            entregado: true,
            entrega
          };
        }
      });
    }

    return viaje.destinos.reduce((acc, destino) => {
      acc[destino.id_pedido] = entregasMap[destino.id_pedido] || {
        entregado: false,
        entrega: null
      };
      return acc;
    }, {});
  }, [viaje, entregasData, errorEntregas]);

  const entregas =
    entregasOverride?.viajeId === viajeId ? entregasOverride.value : entregasBase;

  const handleOpenEntrega = (destino) => {
    blurActiveElement();
    setDestinoSeleccionado(destino);
    setModalOpen(true);
  };
  const handleEntregaExitosa = (idPedido, entregaData) => {
    setEntregasOverride((prev) => {
      const prevValue = prev?.viajeId === viajeId ? prev.value : entregasBase;
      return {
        viajeId,
        value: {
          ...prevValue,
          [idPedido]: { entregado: true, entrega: entregaData }
        }
      };
    });

    const destinoEntregado = viaje.destinos.find(
      (d) => d.id_pedido === idPedido
    );
    if (destinoEntregado) {
      setOrigenActualOverride({
        viajeId,
        value: { lat: destinoEntregado.lat, lng: destinoEntregado.lng }
      });
    }
    refetchInventario();
    emitRefetchAgendaViajes();
  };

  const handleFinalizarViaje = async () => {
    try {
      console.log({
        id_agenda_viaje: viaje.id_agenda_viaje,
        descargarAuto,
        descargarDisponibles,
        dejaRetornables
      });
      await finalizarViaje({
        id_agenda_viaje: viaje.id_agenda_viaje,
        descargarAuto,
        descargarDisponibles,
        dejaRetornables
      }).unwrap();
      dispatch(
        showNotification({
          message: "¡Viaje finalizado con éxito!",
          severity: "success"
        })
      );
    } catch {
      dispatch(
        showNotification({
          message: "Error al finalizar el viaje",
          severity: "error"
        })
      );
    }
  };
  const handleVerDetallePedido = (destino) => {
    blurActiveElement();
    setPedidoSeleccionadoId(destino.id_pedido);
    setDetallePedidoOpen(true);
  };

  const entregasCompletadas = Object.values(entregas).filter(
    (e) => e.entregado
  ).length;

  const todasEntregasCompletadas =
  viaje?.destinos?.length > 0 &&
  entregasCompletadas === viaje.destinos.length;

  const floatingActions = [
    {
      key: "inventario",
      show: true,
      icon: <Inventory2Icon />,
      label: "Ver Inventario",
      onClick: () => setOpenInventarioModal(true),
    },
    {
      key: "venta-rapida",
      show: viaje?.estado === "En Tránsito",
      icon: <PointOfSaleIcon />,
      label: "Venta Rápida",
      onClick: () => setModalVentaRapidaOpen(true),
    },
    {
      key: "finalizar",
      show: viaje?.destinos?.length === 0 || todasEntregasCompletadas,
      icon: <DoneIcon />,
      label: "Finalizar Viaje",
      onClick: handleAbrirDialogoFinalizar,
    },
  ].filter((action) => action.show);

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
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        px: { xs: 1.25, sm: 2, md: 3 },
        pb: { xs: 2.5, md: 4 },
      }}
    >
      <InfoGeneral viaje={viaje} />
      <ResumenDelDia
        totalDestinos={viaje.destinos.length}
        entregasCompletadas={entregasCompletadas} />

      <ListaDestinos
        destinos={viaje.destinos}
        entregas={entregas}
        origen={origenActual}
        origenInicial={origenInicial}
        onOpenEntrega={handleOpenEntrega}
        onVerDetallePedido={handleVerDetallePedido} />

      <InventarioCargado
        inventario={inventarioCamion?.data}
        isLoading={cargandoInventario} />

      {modalOpen && destinoSeleccionado &&
      <FormularioEntregaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetchEntregas();
        }}
        destino={destinoSeleccionado}
        id_agenda_viaje={viaje.id_agenda_viaje}
        onSuccess={handleEntregaExitosa} />

      }

      {detallePedidoOpen && successPedido &&
      <DetallePedidoModal
        open={detallePedidoOpen}
        onClose={() => {
          setDetallePedidoOpen(false);
          setPedidoSeleccionadoId(null);
        }}
        pedido={pedidoCompleto}
        loading={loadingPedido} />

      }

      <FloatingDriverActions actions={floatingActions} />

      {modalVentaRapidaOpen &&
      <ModalVentaRapida
        open={modalVentaRapidaOpen}
        onClose={() => {
          blurActiveElement();
          setModalVentaRapidaOpen(false);
        }}
        viaje={viaje}
        onSuccess={() => {
          dispatch(
            showNotification({
              message: "¡Venta rápida registrada!",
              severity: "success"
            })
          );
          refetchInventario();
        }} />

      }
      <Dialog
        fullScreen={isTabletOrMobile}
        open={openInventarioModal}
        onClose={() => {
          blurActiveElement();
          setOpenInventarioModal(false);
        }}
        keepMounted={false}
        PaperProps={{
          sx: {
            borderRadius: isTabletOrMobile ? 0 : 2,
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.18)",
            overflow: "hidden",
          },
        }}>

        <DialogTitle
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 1.75 },
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.25 },
              minWidth: 0,
              flex: "1 1 auto",
              flexWrap: "wrap",
              pr: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) =>
                  alpha("#0F172A", theme.palette.mode === "dark" ? 0.28 : 0.08),
                color: (theme) =>
                  theme.palette.mode === "dark" ? theme.palette.common.white : "#0F172A",
                flex: "0 0 auto",
              }}
            >
              <InventoryOutlinedIcon fontSize="small" />
            </Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={900}
              sx={{
                fontSize: { xs: "1.18rem", sm: "1.34rem" },
                lineHeight: 1.15,
                whiteSpace: { xs: "normal", sm: "nowrap" },
              }}
            >
              Detalle visual del inventario
            </Typography>
            <Typography
              variant="body2"
              sx={(theme) => ({
                px: 0.85,
                py: 0.25,
                borderRadius: 1,
                bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.18 : 0.06),
                color: theme.palette.text.secondary,
                fontWeight: 800,
                whiteSpace: "nowrap",
              })}
            >
              Camión #{viaje.id_camion}
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              blurActiveElement();
              setOpenInventarioModal(false);
            }}
            size="small"
            sx={(theme) => ({
              borderRadius: 1,
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.text.primary,
                backgroundColor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.22 : 0.07),
              },
            })}>

            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Box sx={{ p: { xs: 1.25, sm: 2 }, bgcolor: "background.paper" }}>
          <InventarioCamion
            idCamion={viaje.id_camion}
            modo="visual"
            inventarioData={inventarioCamion?.data} />

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
        setDescargarDisponibles={setDescargarDisponibles} />

    </Container>);

};

ViajeChofer.propTypes = {
  viaje: PropTypes.object.isRequired
};

export default ViajeChofer;
