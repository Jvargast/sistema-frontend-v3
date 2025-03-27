import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Fab } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useFinalizarViajeMutation } from "../../store/services/agendaViajesApi";
import InventarioCargado from "../../components/viaje/InventarioCargado";
import ListaDestinos from "../../components/viaje/ListaDestinos";
import InfoGeneral from "../../components/viaje/InfoGeneral";
import ResumenDelDia from "../../components/viaje/ResumenDelDia";
import FormularioEntregaModal from "../../components/entregas/FormularioEntregaModal";
import { useGetEntregasByAgendaIdQuery } from "../../store/services/entregasApi";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ModalVentaRapida from "../../components/venta_rapida_chofer/ModalVentaRapida";
import { useLayout } from "../../context/LayoutContext";
import PropTypes from "prop-types";

const ViajeChofer = ({ viaje }) => {
  const dispatch = useDispatch();
  const { drawerWidth } = useLayout();
  /*   const {
    data: viaje,
    isLoading,
    error,
  } = useGetAgendaViajeChoferQuery({ id_chofer: usuario?.id }); */
  const {
    data: inventarioCamion,
    isLoading: cargandoInventario,
    refetch: refetchInventario,
  } = useGetEstadoInventarioCamionQuery(viaje?.id_camion, {
    skip: !viaje?.id_camion,
  });
  const {
    data: entregasData,
/*     isLoading: cargandoEntregas, */
    isError: errorEntregas,
  } = useGetEntregasByAgendaIdQuery({
    id_agenda_viaje: viaje?.id_agenda_viaje,
  });
  const [finalizarViaje] = useFinalizarViajeMutation();
  const [entregas, setEntregas] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const [modalVentaRapidaOpen, setModalVentaRapidaOpen] = useState(false);

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

  const entregasCompletadas = Object.values(entregas).filter(
    (e) => e.entregado
  ).length;

  /*   if (isLoading)
    return <Typography textAlign="center">Cargando viaje...</Typography>;
  if (error)
    return (
      <Typography color="error">Error al cargar la agenda de viaje.</Typography>
    );
  if (!viaje) return <SinAgendaAsignada />; */

  const todasEntregasCompletadas =
    viaje?.destinos?.length > 0 &&
    entregasCompletadas === viaje.destinos.length;

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
      <InfoGeneral viaje={viaje} />
      <ResumenDelDia
        totalDestinos={viaje.destinos.length}
        entregasCompletadas={entregasCompletadas}
      />

      <ListaDestinos
        destinos={viaje.destinos}
        entregas={entregas}
        onOpenEntrega={handleOpenEntrega}
      />
      <InventarioCargado
        inventario={inventarioCamion?.data}
        isLoading={cargandoInventario}
      />

      {todasEntregasCompletadas && (
        <Fab
          color="success"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={handleFinalizarViaje}
        >
          <DoneIcon />
        </Fab>
      )}
      {modalOpen && destinoSeleccionado && (
        <FormularioEntregaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          destino={destinoSeleccionado}
          id_agenda_viaje={viaje.id_agenda_viaje}
          onSuccess={handleEntregaExitosa}
        />
      )}

      {viaje?.estado === "En Tránsito" && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            left: `${drawerWidth + 20}px`,
            zIndex: 1000,
          }}
          onClick={() => setModalVentaRapidaOpen(true)}
        >
          <PointOfSaleIcon />
        </Fab>
      )}

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
