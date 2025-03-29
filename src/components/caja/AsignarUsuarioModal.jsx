import { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Backdrop,
  Fade,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useAssignCajaMutation } from "../../store/services/cajaApi";
import { useGetAllUsersQuery } from "../../store/services/usuariosApi";
import PersonIcon from "@mui/icons-material/Person";

const AsignarUsuarioModal = ({ caja, onClose }) => {
  const {
    data: usuarios,
    isLoading: cargandoUsuarios,
    isError,
  } = useGetAllUsersQuery();
  const [rutUsuario, setRutUsuario] = useState(caja?.usuario_asignado || "");
  const [updateCaja, { isLoading }] = useAssignCajaMutation();
  const dispatch = useDispatch();

  const handleAsignarUsuario = async () => {
    try {
      await updateCaja({
        id_caja: caja.id_caja,
        usuario_asignado: rutUsuario,
      });
      onClose();
      dispatch(
        showNotification({
          message: "Usuario asignado correctamente",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al asignar usuario.${error}`,
          severity: "success",
        })
      );
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={true}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Asignar Usuario a Caja #{caja.id_caja}
          </Typography>
          {cargandoUsuarios ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100px"
            >
              <CircularProgress />
            </Box>
          ) : isError || usuarios?.usuarios.length === 0 ? (
            <Typography color="error" textAlign="center">
              No hay usuarios disponibles.
            </Typography>
          ) : (
            <FormControl
              fullWidth
              margin="normal"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            >
              <InputLabel
                id="chofer-label"
                sx={{ color: "black" }}
                shrink={true}
              >
                Seleccionar Usuario
              </InputLabel>

              <Select
                value={rutUsuario}
                onChange={(e) => setRutUsuario(e.target.value)}
                labelId="chofer-label"
                label="Seleccionar Chofer"
                id="chofer-asignado-select"
                sx={{ bgcolor: "white", borderRadius: 1 }}
              >
                <MenuItem value="">
                  <ListItemText primary="-- Selecciona Usuario --" />
                </MenuItem>
                {usuarios?.usuarios.map((user) => (
                  <MenuItem key={user.rut} value={user.rut}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${user.nombre} ${user.apellido}`}
                      secondary={`Rol: ${user.rol.nombre}${
                        caja.usuario_asignado === user.rut ? " (Asignado)" : ""
                      }`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAsignarUsuario}
            disabled={isLoading || !rutUsuario}
          >
            {isLoading ? "Asignando..." : "Asignar"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

AsignarUsuarioModal.propTypes = {
  caja: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AsignarUsuarioModal;
