import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import { Box, Typography, ClickAwayListener, Popper } from "@mui/material";
import { useState } from "react";
import PedidoTooltip from "./PedidoToolTip";
import { obtenerFechaChile, obtenerHoraChile } from "../../utils/formatearHora";

const PedidoCard = ({ pedido, index }) => {
  const coloresEstado = {
    "Pendiente de Confirmación": "#BDBDBD",
    Confirmado: "#42A5F5",
    "En Preparación": "#FFA726",
    "En Entrega": "#FFEB3B",
  };

  const borderColor = pedido?.id_chofer
    ? coloresEstado[pedido.EstadoPedido.nombre_estado] || "#81C784"
    : "#EF5350";

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
  const handleMouseLeave = () => setAnchorEl(null);
  const handleClick = (event) =>
    setAnchorEl(anchorEl ? null : event.currentTarget);

  const open = Boolean(anchorEl);

  return (
    <>
      <Draggable draggableId={String(pedido.id_pedido)} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            sx={{
              borderLeft: `4px solid ${borderColor}`,
              border: "1px solid #E0E0E0",
              backgroundColor: "#FAFAFA",
              borderRadius: 2,
              px: 2,
              py: 1.5,
/*               mb: 1.5, */
              transition: "box-shadow 0.2s ease",
              boxShadow: snapshot.isDragging
                ? "0 4px 12px rgba(0,0,0,0.12)"
                : "none",
              cursor: "pointer",
            }}
          >
            {/* ID y fecha */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" color="error">
                ID Pedido: {pedido.id_pedido}
              </Typography>

              <Box
                sx={{
                  fontSize: "0.75rem",
                  backgroundColor: "#EDE7F6",
                  color: "#5E35B1",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  textAlign: "right",
                  fontWeight: "500",
                }}
              >
                <div>{obtenerFechaChile(pedido.fecha_pedido)}</div>
                <div>{obtenerHoraChile(pedido.fecha_pedido)}</div>
              </Box>
            </Box>

            {/* Info adicional */}
            <Typography variant="body2" color="text.secondary">
              <strong className="text-pink-500">Cliente:</strong>{" "}
              {pedido?.Cliente?.nombre ?? "Desconocido"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <strong className="text-pink-500">Estado:</strong>{" "}
              {pedido?.EstadoPedido?.nombre_estado}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <strong className="text-pink-500">Dirección:</strong>{" "}
              {pedido.direccion_entrega}
            </Typography>
          </Box>
        )}
      </Draggable>

      {/* Popper para tooltip */}
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
    fecha_pedido: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default PedidoCard;
