import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Typography,
  Slide,
  Box,
  IconButton,
  Dialog,
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
import { onRefetchAgendaViajes } from "../../utils/eventBus";
import { useGetPedidoByIdQuery } from "../../store/services/pedidosApi";
import { useGetEntregasByAgendaIdQuery } from "../../store/services/entregasApi";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import { useFinalizarViajeMutation } from "../../store/services/agendaViajesApi";
import { useErrorChecker } from "../../utils/useErrorChecker";
import PermissionMessage from "../../components/common/PermissionMessage";
import InventarioCamion from "../../components/inventario/InventarioCamion";

const ViajeChofer = ({ viaje }) => {
  const dispatch = useDispatch();
  const [fabOpen, setFabOpen] = useState(false);
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openInventarioModal, setOpenInventarioModal] = useState(false);

  const SlideTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const toggleFab = () => {
    setFabOpen((prev) => !prev);
  };

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
    refetchInventario();
  };

  const handleFinalizarViaje = async () => {
    try {
      await finalizarViaje({ id_agenda_viaje: viaje.id_agenda_viaje }).unwrap();
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
    <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
      <InfoGeneral viaje={viaje} />
      <ResumenDelDia
        totalDestinos={viaje.destinos.length}
        entregasCompletadas={entregasCompletadas}
      />
      <Dialog
        fullScreen={isTabletOrMobile}
        open={openInventarioModal}
        onClose={() => setOpenInventarioModal(false)}
        TransitionComponent={SlideTransition}
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
            onClick={() => setOpenInventarioModal(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <InventarioCamion idCamion={viaje.id_camion} modo="visual" />
        </Box>
      </Dialog>

      <ListaDestinos
        destinos={viaje.destinos}
        entregas={entregas}
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
          onClose={() => setModalOpen(false)}
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
        ariaLabel="Acciones del viaje"
        sx={{
          position: "fixed",
          bottom: 60,
          right: 24,
          zIndex: 1200,
        }}
        icon={<SpeedDialIcon onClick={toggleFab} />}
        direction="up"
        open={fabOpen}
        onClose={() => setFabOpen(false)}
        onOpen={() => setFabOpen(true)}
      >
        <SpeedDialAction
          icon={<Inventory2Icon />}
          tooltipTitle="Ver Inventario"
          onClick={() => setOpenInventarioModal(true)}
        />

        {viaje?.estado === "En Tránsito" && (
          <SpeedDialAction
            icon={<PointOfSaleIcon />}
            tooltipTitle="Venta Rápida"
            onClick={() => setModalVentaRapidaOpen(true)}
          />
        )}

        {todasEntregasCompletadas && (
          <SpeedDialAction
            icon={<DoneIcon />}
            tooltipTitle="Finalizar Viaje"
            onClick={handleFinalizarViaje}
          />
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
    </Container>
  );
};

ViajeChofer.propTypes = {
  viaje: PropTypes.object.isRequired,
};

export default ViajeChofer;
