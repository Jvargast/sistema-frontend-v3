import Dialog from "../../components/common/CompatDialog";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  IconButton,
  DialogTitle,
  Button,
  Container,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CloseIcon from "@mui/icons-material/Close";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import Box from "../../components/common/CompatBox";
import Stack from "../../components/common/CompatStack";
import Typography from "../../components/common/CompatTypography";

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

const driverActionButtonSx = (theme, variant = "primary") => ({
  flex: 1,
  minWidth: 0,
  minHeight: 48,
  px: 1,
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  boxShadow: "none",
  ...(variant === "primary"
    ? {
        bgcolor: "#0F172A",
        color: theme.palette.common.white,
        border: "1px solid #0F172A",
        "&:hover": {
          bgcolor: theme.palette.common.black,
          borderColor: theme.palette.common.black,
          boxShadow: "none",
        },
      }
    : {
        color: "#0F172A",
        bgcolor: alpha("#0F172A", 0.03),
        borderColor: alpha("#0F172A", 0.28),
        "&:hover": {
          borderColor: "#0F172A",
          bgcolor: alpha("#0F172A", 0.07),
          boxShadow: "none",
        },
      }),
});

const blurActiveElement = () => {
  if (typeof document === "undefined") return;
  const activeElement = document.activeElement;
  if (activeElement && typeof activeElement.blur === "function") {
    activeElement.blur();
  }
};

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

  const [origenInicial, setOrigenInicial] = useState(null);
  const [origenActual, setOrigenActual] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useChoferTracking({
    viajeActivo: viaje?.estado === "En Tránsito",
    rut: user?.id
  });

  useEffect(() => {
    if (viaje?.origen_inicial) {
      setOrigenInicial(viaje.origen_inicial);
      setOrigenActual(viaje.origen_inicial);
    }
  }, [viaje]);

  const handleAbrirDialogoFinalizar = () => {
    blurActiveElement();
    setFabOpen(false);
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
        sx={(theme) => ({
          "& .MuiSpeedDialAction-fab": {
            borderRadius: 1.25,
            color: "#0F172A",
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${alpha("#0F172A", 0.24)}`,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 20px rgba(15, 23, 42, 0.12)"
                : "0 8px 20px rgba(0, 0, 0, 0.32)",
            "&:hover": {
              bgcolor: alpha("#0F172A", 0.06),
              borderColor: "#0F172A",
              boxShadow: "none",
            },
          },
        })}
        slotProps={{
          tooltip: { title: titulo },
          fab: {
            onClick: () => {
              blurActiveElement();
              onClick();
            },
            tabIndex: 0,
            "aria-label": titulo
          }
        }} />);


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
    error: errorPedido
  } = useGetPedidoByIdQuery(pedidoSeleccionadoId, {
    skip: !pedidoSeleccionadoId
  });

  useEffect(() => {
    if (viaje?.destinos) {
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

      const estadoInicial = viaje.destinos.reduce((acc, destino) => {
        acc[destino.id_pedido] = entregasMap[destino.id_pedido] || {
          entregado: false,
          entrega: null
        };
        return acc;
      }, {});

      setEntregas(estadoInicial);
    }
  }, [viaje, entregasData, errorEntregas]);

  const handleOpenEntrega = (destino) => {
    blurActiveElement();
    setDestinoSeleccionado(destino);
    setModalOpen(true);
  };
  const handleEntregaExitosa = (idPedido, entregaData) => {
    setEntregas((prev) => ({
      ...prev,
      [idPedido]: { entregado: true, entrega: entregaData }
    }));

    const destinoEntregado = viaje.destinos.find(
      (d) => d.id_pedido === idPedido
    );
    if (destinoEntregado) {
      setOrigenActual({ lat: destinoEntregado.lat, lng: destinoEntregado.lng });
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
        pb: { xs: 14, md: 8 },
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

      <SpeedDial
        ref={fabRef}
        ariaLabel="Acciones del viaje"
        sx={(theme) => ({
          display: { xs: "none", md: "flex" },
          position: "fixed",
          bottom: 60,
          right: 24,
          zIndex: 1200,
          "& .MuiSpeedDial-fab": {
            borderRadius: 1.5,
            bgcolor: "#0F172A",
            color: theme.palette.common.white,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 10px 24px rgba(15, 23, 42, 0.2)"
                : "0 10px 24px rgba(0, 0, 0, 0.36)",
            "&:hover": {
              bgcolor: theme.palette.common.black,
              boxShadow: "none",
            },
          },
          "& .MuiSpeedDialAction-fab": {
            transition: "none !important"
          }
        })}
        icon={<SpeedDialIcon onClick={toggleFab} />}
        direction="up"
        open={fabOpen}
        onClose={() => setFabOpen(false)}
        onOpen={() => setFabOpen(true)}>

        {renderSpeedDialAction(
          fabOpen,
          <Inventory2Icon />,
          "Ver Inventario",
          () => {
            setFabOpen(false);
            setOpenInventarioModal(true);
          }
        )}

        {renderSpeedDialAction(
          fabOpen && viaje?.estado === "En Tránsito",
          <PointOfSaleIcon />,
          "Venta Rápida",
          () => {
            setFabOpen(false);
            setModalVentaRapidaOpen(true);
          }
        )}

        {renderSpeedDialAction(
          fabOpen && (
          viaje?.destinos?.length === 0 || todasEntregasCompletadas),
          <DoneIcon />,
          "Finalizar Viaje",
          handleAbrirDialogoFinalizar
        )}
      </SpeedDial>

      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          p: 1,
          pb: "calc(8px + env(safe-area-inset-bottom))",
          bgcolor: "background.paper",
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 1,
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 24px rgba(15, 23, 42, 0.12)"
                : "0 8px 24px rgba(0, 0, 0, 0.32)",
          })}
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Inventory2Icon />}
              onClick={() => {
                blurActiveElement();
                setOpenInventarioModal(true);
              }}
              sx={(theme) => driverActionButtonSx(theme, "primary")}
            >
              Inventario
            </Button>
            {viaje?.estado === "En Tránsito" && (
              <Button
                variant="outlined"
                startIcon={<PointOfSaleIcon />}
                onClick={() => {
                  blurActiveElement();
                  setModalVentaRapidaOpen(true);
                }}
                sx={(theme) => driverActionButtonSx(theme, "secondary")}
              >
                Venta
              </Button>
            )}
            {(viaje?.destinos?.length === 0 || todasEntregasCompletadas) && (
              <Button
                variant="contained"
                color="success"
                startIcon={<DoneIcon />}
                onClick={handleAbrirDialogoFinalizar}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 48,
                  px: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 800,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Finalizar
              </Button>
            )}
          </Stack>
        </Paper>
      </Box>

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
          setFabOpen(false);
        }}
        keepMounted={false}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: isTabletOrMobile ? 0 : 2,
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.18)",
            overflow: "hidden",
          }),
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
              setFabOpen(false);
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
