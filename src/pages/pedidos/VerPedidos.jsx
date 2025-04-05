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
import { Typography } from "@mui/material";
import EmptyColumn from "../../components/chofer/EmptyColumn";

const PedidosBoard = () => {
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col items-start justify-between mb-4 px-4">
        <Typography variant="h4" className="font-semibold text-gray-700">
          Administración de Pedidos
        </Typography>
        <Typography variant="subtitle1" className="text-gray-500">
          Gestiona claramente la asignación de pedidos a cada chofer.
        </Typography>
      </div>
      <div
        className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
          gap-4 
          p-4 
          bg-gray-50
          min-h-screen
        "
      >
        <Column
          droppableId="sinAsignar"
          title={
            <>
              <span className="font-semibold text-black">Chofer</span>
              <br />
              <span className="text-sm font-normal text-gray-500">
                Sin Asignar
              </span>
            </>
          }
          pedidos={columnsState.sinAsignar || []}
        />

        {(allPedidosLoading || choferesLoading) && (
          <div className="flex items-center justify-center text-gray-600">
            Cargando datos...
          </div>
        )}
        {!choferesLoading &&
          choferesData?.map((chofer) => (
            <Column
              key={chofer.rut}
              droppableId={chofer.rut}
              title={
                <>
                  <span>Chofer: {chofer.nombre}</span>
                  <br />
                  <span className="text-sm font-normal text-gray-500">
                    RUT: {chofer.rut}
                  </span>
                </>
              }
              pedidos={columnsState[chofer.rut] || []}
            />
          ))}
        {/* Columnas adicionales vacías para completar */}
        {!choferesLoading &&
          Array.from({ length: Math.max(0, 3 - choferesData.length) }).map(
            (_, idx) => <EmptyColumn key={`empty-column-${idx}`} />
          )}
      </div>
    </DragDropContext>
  );
};

export default PedidosBoard;
