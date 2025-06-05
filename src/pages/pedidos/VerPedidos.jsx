import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetAllPedidosQuery,
  useAsignarPedidoMutation,
  useDesasignarPedidoMutation,
} from "../../store/services/pedidosApi";
import { useGetAllChoferesQuery } from "../../store/services/usuariosApi";
import Column from "../../components/chofer/Column";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { Box, Typography } from "@mui/material";
import EmptyColumn from "../../components/chofer/EmptyColumn";
import { useIsMobile } from "../../utils/useIsMobile";
import MobilePedidosBoard from "./MobilePedidosBoard";

const PedidosBoard = () => {
  const isMobile = useIsMobile();
  const { data: allPedidosData, isLoading: allPedidosLoading } =
    useGetAllPedidosQuery();

  const { data: choferesData, isLoading: choferesLoading } =
    useGetAllChoferesQuery();

  const [asignarPedido] = useAsignarPedidoMutation();
  const [desasignarPedido] = useDesasignarPedidoMutation();

  const [columnsState, setColumnsState] = useState({
    sinAsignar: [],
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (!allPedidosLoading && !choferesLoading) {
      const allPedidos = allPedidosData?.pedidos || [];
      const choferes = choferesData || [];

      const newColumns = {
        sinAsignar: [],
      };

      choferes.forEach((chofer) => {
        newColumns[chofer.rut] = [];
      });

      const estadosPermitidos = [
        "Pendiente de Confirmación",
        "Confirmado",
        "En Preparación",
        "En Entrega",
        "Pendiente",
      ];

      allPedidos.forEach((pedido) => {
        if (!pedido.id_chofer) {
          newColumns.sinAsignar.push(pedido);
        } else if (
          estadosPermitidos.includes(pedido?.EstadoPedido?.nombre_estado)
        ) {
          const rutChofer = pedido.Chofer?.rut;
          if (rutChofer && newColumns[rutChofer]) {
            newColumns[rutChofer].push(pedido);
          }
        }
      });

      setColumnsState(newColumns);
    }
  }, [allPedidosLoading, choferesLoading, allPedidosData, choferesData]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId && source.index === destination.index) {
      return;
    }

    const movedItem = columnsState[sourceId][source.index];

    if (
      sourceId === destId &&
      columnsState[destId].some((p) => p.id_pedido === movedItem.id_pedido)
    ) {
      console.warn("🔁 Intento de soltar en el mismo lugar, se cancela");
      return;
    }

    const newColumns = { ...columnsState };
    const sourceItems = Array.from(newColumns[sourceId]);
    const destItems = Array.from(newColumns[destId]);
    sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    newColumns[sourceId] = sourceItems;
    newColumns[destId] = destItems;

    setColumnsState(newColumns);
    try {
      if (destId === "sinAsignar") {
        await desasignarPedido(movedItem.id_pedido).unwrap();
        dispatch(
          showNotification({
            message: `Pedido #${movedItem.id_pedido} desasignado`,
            severity: "success",
            duration: 3000,
          })
        );
      } else {
        await asignarPedido({
          id_pedido: movedItem.id_pedido,
          id_chofer: destId,
        }).unwrap();
        dispatch(
          showNotification({
            message: `Pedido #${movedItem.id_pedido} asignado a chofer: ${destId}`,
            severity: "success",
            duration: 3000,
          })
        );
      }
    } catch (error) {
      console.error("❌ Error asignando/desasignando pedido:", error);
      dispatch(
        showNotification({
          message: "Ocurrió un error al asignar/desasignar el pedido",
          severity: "error",
          duration: 4000,
        })
      );
    }
  };

  if (isMobile) {
    return (
      <MobilePedidosBoard
        columnsState={columnsState}
        choferes={choferesData || []}
        asignarPedido={asignarPedido}
        desasignarPedido={desasignarPedido}
        allPedidosLoading={allPedidosLoading}
        choferesLoading={choferesLoading}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box pb={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 4,
            px: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.text.primary,
              letterSpacing: 0.2,
            }}
          >
            Administración de Pedidos
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[400]
                  : theme.palette.grey[600],
            }}
          >
            Gestiona claramente la asignación de pedidos a cada chofer.
          </Typography>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              alignItems: "stretch",
              width: "100%",
              mt: 2,
              mb: 4,
            }}
          >
            <Column
              droppableId="sinAsignar"
              title={
                <Box>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.text.primary
                          : "#222",
                    }}
                  >
                    Chofer
                  </Typography>
                  <Typography
                    fontSize={13}
                    fontWeight={400}
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[400]
                          : theme.palette.grey[600],
                    }}
                  >
                    Sin Asignar
                  </Typography>
                </Box>
              }
              pedidos={columnsState.sinAsignar || []}
            />

            {(allPedidosLoading || choferesLoading) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[400]
                      : theme.palette.grey[600],
                }}
              >
                Cargando datos...
              </Box>
            )}

            {!choferesLoading &&
              choferesData?.map((chofer) => (
                <Column
                  key={chofer.rut}
                  droppableId={chofer.rut}
                  title={
                    <Box>
                      <Typography fontWeight="bold">
                        Chofer: {chofer.nombre}
                      </Typography>
                      <Typography
                        fontSize={13}
                        fontWeight={400}
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[400]
                              : theme.palette.grey[600],
                        }}
                      >
                        RUT: {chofer.rut}
                      </Typography>
                    </Box>
                  }
                  pedidos={columnsState[chofer.rut] || []}
                />
              ))}
            {!choferesLoading &&
              Array.from({ length: Math.max(0, 3 - choferesData.length) }).map(
                (_, idx) => <EmptyColumn key={`empty-column-${idx}`} />
              )}
          </Box>
        </Box>
      </Box>
    </DragDropContext>
  );
};

export default PedidosBoard;
