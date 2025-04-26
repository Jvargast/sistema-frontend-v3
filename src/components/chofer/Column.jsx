import PropTypes from "prop-types";
import { Droppable } from "@hello-pangea/dnd";
import { Paper, Typography, Box } from "@mui/material";
import PedidoCard from "./PedidoCard";

const Column = ({ droppableId, title, pedidos }) => {
  const EMPTY_SLOT_COUNT = 4; // o más si deseas
  const showEmptySlots = pedidos.length < EMPTY_SLOT_COUNT;

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <Paper
          component="div"
          elevation={1}
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={
            "min-w-[280px] max-w-[320px] w-full sm:w-72 " +
            "max-h-[80vh] overflow-y-auto rounded-lg " +
            "p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col " +
            "border border-gray-400 hover:border-rose-400 transition-colors duration-300 " +
            (snapshot.isDraggingOver ? "bg-pink-50" : "bg-white")
          }
          
        >
          {/* Título */}
          <div className="text-center mb-4">
            <Typography
              variant="h6"
              className="font-bold text-black tracking-wide uppercase"
            >
              {title}
            </Typography>
            <div className="mx-auto mt-1 mb-2 h-[2px] w-16 bg-indigo-200"></div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col gap-3 min-h-[240px]">
            {pedidos.map((pedido, index) => (
              <PedidoCard
                key={pedido.id_pedido}
                pedido={pedido}
                index={index}
              />
            ))}

            {/* Slots visuales vacíos */}
            {showEmptySlots &&
              Array.from({
                length: EMPTY_SLOT_COUNT - pedidos.length,
              }).map((_, idx) => (
                <Box
                  key={`slot-${idx}`}
                  sx={{
                    height: 130,
                    borderRadius: 2,
                    backgroundColor: "#F5F5F5",
                    border: "1px dashed #E0E0E0",
                    opacity: 0.6,
                  }}
                />
              ))}

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
