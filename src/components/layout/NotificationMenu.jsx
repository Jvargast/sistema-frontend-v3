import PropTypes from "prop-types";
import {
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  Divider,
  Box,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

/**
 * Componente para mostrar una lista de notificaciones dentro de un menú.
 *
 * @param {HTMLElement} anchorEl - El elemento HTML que ancla el menú.
 * @param {boolean} open - Indica si el menú está abierto.
 * @param {function} onClose - Función para cerrar el menú.
 * @param {Array} notifications - Array de notificaciones, cada una con:
 *   - id, id_notificacion, mensaje, tipo, fecha, etc.
 * @param {function} [onSelectNotification] - Función opcional para manejar click en una notificación.
 */
const NotificationsMenu = ({
  anchorEl,
  open,
  onClose,
  notifications = [], // Usamos default param
  onSelectNotification,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          maxHeight: 320,
          width: 320,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: "0.5rem 0",
        },
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {notifications.length === 0 ? (
        <MenuItem disabled sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="textSecondary">
            No hay notificaciones
          </Typography>
        </MenuItem>
      ) : (
        notifications.map((notif) => (
          <Box key={notif.id_notificacion || notif.id}>
            <MenuItem
              onClick={() => {
                if (onSelectNotification) onSelectNotification(notif);
                onClose(); // Cerrar el menú (si lo deseas)
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              {/* Ícono o indicador de tipo (varía el color si lo deseas) */}
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CircleIcon
                  sx={{
                    fontSize: 12,
                    color:
                      notif.tipo === "pedido_asignado" ? "#f50057" : "#1976d2",
                  }}
                />
              </ListItemIcon>
              <Box display="flex" flexDirection="column" width="100%">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#333" }}
                >
                  {notif.mensaje}
                </Typography>
                {notif.fecha && (
                  <Typography
                    variant="caption"
                    sx={{ color: "gray", marginTop: "2px" }}
                  >
                    {new Date(notif.fecha).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </MenuItem>
            <Divider sx={{ margin: 0 }} />
          </Box>
        ))
      )}
    </Menu>
  );
};

NotificationsMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id_notificacion: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mensaje: PropTypes.string,
      fecha: PropTypes.string,
      tipo: PropTypes.string,
      leida: PropTypes.bool,
    })
  ),
  onSelectNotification: PropTypes.func,
};

export default NotificationsMenu;
