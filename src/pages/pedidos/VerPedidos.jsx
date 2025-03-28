import { useState, useEffect } from "react";

// CAMBIO: Importar desde "@hello-pangea/dnd"
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
  // 1. Obtenemos TODOS los pedidos (asignados y sin asignar)
  const { data: allPedidosData, isLoading: allPedidosLoading } =
    useGetAllPedidosQuery();

  // 2. Obtenemos la lista de choferes
  const { data: choferesData, isLoading: choferesLoading } =
    useGetAllChoferesQuery();

  // 3. Mutations para asignar/desasignar pedidos
  const [asignarPedido] = useAsignarPedidoMutation();
  const [desasignarPedido] = useDesasignarPedidoMutation();

  // 4. Estado local para agrupar pedidos por columna
  const [columnsState, setColumnsState] = useState({
    // Empezamos con la columna sinAsignar para que exista su droppable de inmediato
    sinAsignar: [],
  });

  const dispatch = useDispatch();
  // 5. Efecto: cuando tenemos datos, llenamos las columnas
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
        "Pendiente"
      ];

      // Agrupar pedidos según id_chofer
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

        /* else {
          const rutChofer = pedido.Chofer?.rut;
          if (rutChofer && newColumns[rutChofer]) {
            newColumns[rutChofer].push(pedido);
          }
        } */
      });

      setColumnsState(newColumns);
    }
  }, [allPedidosLoading, choferesLoading, allPedidosData, choferesData]);

  // 6. Función que se dispara al soltar un item
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    console.log("Destino droppableId:", destination.droppableId);

    // Si se suelta en la misma posición, no hacemos nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Copias de las columnas
    const newColumns = { ...columnsState };
    const sourceItems = Array.from(newColumns[source.droppableId]);
    const destItems = Array.from(newColumns[destination.droppableId]);

    // Sacar el item de la columna de origen
    const [movedItem] = sourceItems.splice(source.index, 1);
    // Ahora sí, podemos hacer el console.log
    console.log("Pedido que se mueve:", movedItem);
    // Insertar en la columna de destino
    destItems.splice(destination.index, 0, movedItem);

    newColumns[source.droppableId] = sourceItems;
    newColumns[destination.droppableId] = destItems;

    // Actualizar el estado para reflejar el cambio inmediato en la UI
    setColumnsState(newColumns);

    // Llamar a la API para asignar/desasignar en el backend
    try {
      if (destination.droppableId === "sinAsignar") {
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
          id_chofer: destination.droppableId,
        }).unwrap();
        dispatch(
          showNotification({
            message: `Pedido #${movedItem.id_pedido} asignado a chofer: ${destination.droppableId}`,
            severity: "success",
            duration: 3000,
          })
        );
      }
    } catch (error) {
      console.error("Error asignando/desasignando pedido:", error);
      dispatch(
        showNotification({
          message: "Ocurrió un error al asignar/desasignar el pedido",
          severity: "error",
          duration: 4000,
        })
      );
      // Opcional: revertir en caso de error
    }
  };

  // 7. Render
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
        {/* Columna sin asignar (siempre presente) */}
        <Column
          droppableId="sinAsignar"
          title="Sin Asignar"
          pedidos={columnsState.sinAsignar || []}
        />

        {/* Si estamos cargando, mostramos un spinner/indicador */}
        {(allPedidosLoading || choferesLoading) && (
          <div className="flex items-center justify-center text-gray-600">
            Cargando datos...
          </div>
        )}

        {/* Columna para cada chofer */}
        {/* {!choferesLoading &&
          choferesData?.map((chofer) => (
            <Column
              key={chofer.rut}
              droppableId={chofer.rut}
              title={chofer.nombre}
              pedidos={columnsState[chofer.rut] || []}
            />
          ))} */}
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
