import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd"; // <-- Cambio aquí
import { Card, CardContent, ClickAwayListener, Popper, Typography } from "@mui/material";
import { useState } from "react";
import PedidoTooltip from "./PedidoToolTip";

const PedidoCard = ({ pedido, index }) => {
  const coloresEstado = {
    "Pendiente de Confirmación": "border-gray-400",
    Confirmado: "border-blue-400",
    "En Preparación": "border-orange-400",
    "En Entrega": "border-yellow-400",
  };
  const estiloBorde = pedido?.id_chofer
    ? coloresEstado[pedido.EstadoPedido.nombre_estado] || "border-green-400"
    : "border-rose-500";

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);

  return (
    <>
      <Draggable draggableId={String(pedido.id_pedido)} index={index}>
        {(provided, snapshot) => (
          <Card
            elevation={3}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={
              "relative border-l-4 rounded-md shadow-sm hover:shadow-md " +
              "transition-all duration-300 mb-2 " +
              estiloBorde +
              (snapshot.isDragging ? " opacity-75" : "")
            }
            style={{
              ...provided.draggableProps.style,
              // Opcionalmente, más estilos inline
            }}
          >
            <CardContent className="p-4">
              <Typography
                variant="subtitle1"
                className="font-bold text-pink-600 tracking-wide"
              >
                ID Pedido: {pedido.id_pedido}
              </Typography>

              <Typography variant="body2" className="mt-2 text-gray-700">
                <span className="text-pink-500 font-semibold">Cliente:</span>{" "}
                {pedido?.Cliente?.nombre ?? "Desconocido"}
              </Typography>
              <Typography variant="body2" className="mt-2 text-gray-700">
                <span className="text-pink-500 font-semibold">Estado:</span>{" "}
                {pedido?.EstadoPedido?.nombre_estado}
              </Typography>

              <Typography variant="body2" className="mt-1 text-gray-700">
                <span className="text-pink-500 font-semibold">Dirección:</span>{" "}
                {pedido.direccion_entrega}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Draggable>
      <Popper open={open} anchorEl={anchorEl} placement="right-start">
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <div>
            <PedidoTooltip idPedido={pedido?.id_pedido} />
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

PedidoCard.propTypes = {
  pedido: PropTypes.shape({
    id_pedido: PropTypes.number.isRequired,
    id_chofer: PropTypes.string,
    Cliente: PropTypes.shape({
      nombre: PropTypes.string,
    }),
    EstadoPedido: PropTypes.shape({
      nombre_estado: PropTypes.string,
    }),
    direccion_entrega: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default PedidoCard;
