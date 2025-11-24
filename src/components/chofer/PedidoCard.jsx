import PropTypes from "prop-types";
import { Draggable } from "@hello-pangea/dnd";
import {
  Box,
  Typography,
  ClickAwayListener,
  Popper,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useState } from "react";
import PedidoTooltip from "./PedidoToolTip";
import { obtenerFechaChile, obtenerHoraChile } from "../../utils/formatearHora";

const estadoColors = (theme) => ({
  Pendiente: theme.palette.warning.main,
  "Pendiente de Confirmación":
    theme.palette.mode === "dark"
      ? theme.palette.grey[500]
      : theme.palette.grey[400],
  Confirmado: theme.palette.success.main,
  Default: theme.palette.grey[400],
});
const PedidoCard = ({ pedido, index, onSacarDeTablero, onVerDetalle }) => {
  const theme = useTheme();
  const coloresEstado = estadoColors(theme);

  const estadoNombre = pedido?.EstadoPedido?.nombre_estado || "Desconocido";
  const borderColor = coloresEstado[estadoNombre] || coloresEstado.Default;

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
  const handleMouseLeave = () => setAnchorEl(null);
  const handleClick = (event) =>
    setAnchorEl(anchorEl ? null : event.currentTarget);

  const openTooltip = Boolean(anchorEl);

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    setMenuAnchor(e.currentTarget);
  };
  const handleCloseMenu = () => setMenuAnchor(null);
  const openMenu = Boolean(menuAnchor);

  return (
    <>
      <Draggable draggableId={String(pedido.id_pedido)} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
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
              cursor: snapshot.isDragging ? "grabbing" : "grab",
              transition: snapshot.isDragging ? "none" : "all 0.18s",
              "&:hover": {
                boxShadow: theme.shadows[6],
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.dark + "16"
                    : theme.palette.grey[50],
              },
              width: "100%",
              overflow: "visible",
              wordBreak: "break-word",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ mb: 0.75 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: borderColor,
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      color: theme.palette.text.primary,
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    #{pedido.id_pedido}
                  </Typography>
                </Box>

                <IconButton size="small" onClick={handleOpenMenu}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.2,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {obtenerFechaChile(pedido.fecha_pedido)} ·{" "}
                  {obtenerHoraChile(pedido.fecha_pedido)}
                </Typography>
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

      {openMenu && (
        <Menu
          anchorEl={menuAnchor}
          open
          onClose={handleCloseMenu}
          elevation={3}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          MenuListProps={{
            autoFocusItem: false,
          }}
        >
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onVerDetalle?.(pedido);
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Ver detalle" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onSacarDeTablero?.(pedido);
            }}
          >
            <ListItemIcon>
              <RemoveCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sacar del tablero" />
          </MenuItem>
        </Menu>
      )}

      <Popper
        open={openTooltip}
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
  onSacarDeTablero: PropTypes.func,
  onVerDetalle: PropTypes.func,
};

export default PedidoCard;
