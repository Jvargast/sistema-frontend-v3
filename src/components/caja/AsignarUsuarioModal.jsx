import { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Backdrop,
  Fade,
} from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useAssignCajaMutation } from "../../store/services/cajaApi";

const AsignarUsuarioModal = ({ caja, onClose }) => {
  const [rutUsuario, setRutUsuario] = useState("");
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
          <TextField
            label="RUT Usuario"
            variant="outlined"
            fullWidth
            value={rutUsuario}
            onChange={(e) => setRutUsuario(e.target.value)}
            sx={{ mb: 2 }}
          />
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
