import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { useAsignarChoferMutation } from "../../store/services/camionesApi";
import { useGetAllChoferesQuery } from "../../store/services/usuariosApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const AsignarChoferModal = ({ open, onClose, camionId }) => {
  const dispatch = useDispatch();
  const {
    data: choferes = [],
    isLoading: loadingChoferes,
    isError,
  } = useGetAllChoferesQuery();
  const [choferSeleccionado, setChoferSeleccionado] = useState("");

  const [asignarChofer, { isLoading }] = useAsignarChoferMutation();

  useEffect(() => {
    if (!loadingChoferes && choferes.length > 0) {
      setChoferSeleccionado("");
    }
  }, [loadingChoferes, choferes]);

  const handleAsignar = async () => {
    if (!choferSeleccionado) return;

    try {
      await asignarChofer({
        id: camionId,
        id_chofer: choferSeleccionado,
      }).unwrap();
      onClose();
      dispatch(
        showNotification({
          message: "Se ha asignado correctamente",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al asignar chofer", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="asignar-chofer-titulo"
      aria-describedby="asignar-chofer-descripcion"
    >
      <DialogTitle
        sx={{ backgroundColor: "#1976D2", color: "#fff", textAlign: "center" }}
      >
        Asignar Chofer
      </DialogTitle>
      <DialogContent sx={{ padding: "20px", backgroundColor: "#F5F5F5" }}>
        {loadingChoferes ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100px"
          >
            <CircularProgress />
          </Box>
        ) : isError || choferes.length === 0 ? (
          <Typography color="error" textAlign="center">
            No hay choferes disponibles.
          </Typography>
        ) : (
          <FormControl
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          >
            <InputLabel id="chofer-label" sx={{ color: "black" }} shrink={true}>
              Seleccionar Chofer
            </InputLabel>
            <Select
              value={choferSeleccionado || ""}
              onChange={(e) => setChoferSeleccionado(e.target.value)}
              labelId="chofer-label"
              label="Seleccionar Chofer"
              id="chofer-asignado-select"
              displayEmpty
              sx={{
                padding: "8px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976D2",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#115293",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0D47A1",
                },
              }}
            >
              <MenuItem value="">Ninguno</MenuItem>{" "}
              {choferes.map((chofer) => (
                <MenuItem
                  key={chofer.rut || `chofer-${Math.random()}`}
                  value={chofer.rut}
                >
                  {chofer.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: "16px", backgroundColor: "#F5F5F5" }}>
        <Button onClick={onClose} sx={{ color: "#D32F2F", fontWeight: "bold" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleAsignar}
          variant="contained"
          color="primary"
          disabled={!choferSeleccionado || isLoading}
          sx={{
            fontWeight: "bold",
            backgroundColor: "#1976D2",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Asignar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AsignarChoferModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  camionId: PropTypes.number.isRequired,
};

export default AsignarChoferModal;
