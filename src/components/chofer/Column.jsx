import PropTypes from "prop-types";
import { Droppable } from "@hello-pangea/dnd"; // <-- Cambio principal
import { Paper, Typography } from "@mui/material";
import PedidoCard from "./PedidoCard";

const Column = ({ droppableId, title, pedidos }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <Paper
          component="div"
          elevation={2}
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={
            "w-72 max-h-[80vh] overflow-y-auto rounded-lg " +
            "p-4 shadow-md flex flex-col " +
            // Cambia el color de fondo si algo se arrastra encima
            (snapshot.isDraggingOver ? "bg-pink-50" : "bg-white")
          }
        >
          <div className="text-center mb-4">
            <Typography
              variant="h6"
              className="font-bold text-black tracking-wide uppercase"
            >
              {title}
            </Typography>
            {/* Pequeña “barra” debajo del título a modo de divider */}
            <div className="mx-auto mt-1 mb-2 h-[2px] w-16 bg-indigo-200"></div>
          </div>

          <div className="flex flex-col gap-3">
            {pedidos.map((pedido, index) => (
              <PedidoCard
                key={pedido.id_pedido}
                pedido={pedido}
                index={index}
              />
            ))}

            {/* Placeholder para el espacio dinámico al arrastrar */}
            {provided.placeholder}
          </div>
        </Paper>
      )}
    </Droppable>
  );
};

Column.propTypes = {
  droppableId: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  pedidos: PropTypes.array.isRequired,
};

export default Column;
