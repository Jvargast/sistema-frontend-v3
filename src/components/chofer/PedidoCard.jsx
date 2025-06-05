import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import {
  Box,
  Typography,
  ClickAwayListener,
  Popper,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import PedidoTooltip from "./PedidoToolTip";
import { obtenerFechaChile, obtenerHoraChile } from "../../utils/formatearHora";

const estadoColors = (theme) => ({
  "Pendiente de Confirmación":
    theme.palette.mode === "dark" ? "#666A75" : "#D7DBDD",
  Confirmado: theme.palette.success.light,
  "En Preparación": theme.palette.warning.light,
  "En Entrega": theme.palette.info.light,
  Default: theme.palette.secondary.light,
});

const PedidoCard = ({ pedido, index }) => {
  const theme = useTheme();
  const coloresEstado = estadoColors(theme);

  const borderColor = pedido?.id_chofer
    ? coloresEstado[pedido.EstadoPedido?.nombre_estado] || coloresEstado.Default
    : theme.palette.error.main;

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
              borderLeft: `5px solid ${borderColor}`,
              border: `1.2px solid ${theme.palette.divider}`,
              backgroundColor: snapshot.isDragging
                ? theme.palette.mode === "dark"
                  ? theme.palette.primary.dark + "10"
                  : theme.palette.primary.light + "10"
                : theme.palette.background.paper,
              borderRadius: 3,
              px: 2.2,
              py: 2,
              boxSizing: "border-box",
              boxShadow: snapshot.isDragging
                ? theme.shadows[8]
                : theme.shadows[1],
              cursor: "grab",
              transition: "all 0.18s",
              "&:hover": {
                boxShadow: theme.shadows[6],
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.dark + "16"
                    : theme.palette.grey[50],
              },
              width: "100%",
              margin: "0 auto",
              overflow: "visible",
              wordBreak: "break-word",

              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                  color: theme.palette.error.main,
                  letterSpacing: 0.5,
                  whiteSpace: "nowrap",
                  mr: 1,
                }}
              >
                #{pedido.id_pedido}
              </Typography>

              <Box
                sx={{
                  fontSize: "0.90rem",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#18203a" : "#e8f1fc",
                  color:
                    theme.palette.mode === "dark"
                      ? "#d7e2fa"
                      : theme.palette.primary.dark,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  minWidth: 90,
                  textAlign: "right",
                  lineHeight: 1.1,
                  overflowWrap: "break-word",
                }}
              >
                <div>{obtenerFechaChile(pedido.fecha_pedido)}</div>
                <div>{obtenerHoraChile(pedido.fecha_pedido)}</div>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.info.light,
                  fontWeight: 700,
                  display: "block",
                }}
              >
                Cliente:{" "}
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  {pedido?.Cliente?.nombre ?? "Desconocido"}
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.success.main,
                  fontWeight: 700,
                  display: "block",
                }}
              >
                Estado:{" "}
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  {pedido?.EstadoPedido?.nombre_estado}
                </Box>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.warning.main,
                  fontWeight: 700,
                  display: "block",
                }}
              >
                Dirección:
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    ml: 1,
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    display: "inline",
                  }}
                >
                  {pedido.direccion_entrega}
                </Box>
              </Typography>
            </Box>
          </Box>
        )}
      </Draggable>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
        sx={{
          zIndex: 1301,
          "& .MuiPaper-root": {
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.light}`,
            p: 2,
          },
        }}
      >
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
