import { useState, useEffect, useMemo } from "react";
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

const AsignarChoferModal = ({ open, onClose, camionId, sucursalId }) => {
  const dispatch = useDispatch();
  const {
    data: choferes = [],
    isLoading: loadingChoferes,
    isError,
  } = useGetAllChoferesQuery();
  const [choferSeleccionado, setChoferSeleccionado] = useState(null);

  const choferesFiltrados = useMemo(() => {
    const sid = Number(sucursalId);
    if (!sid) return [];

    const list = Array.isArray(choferes) ? choferes : [];
    return list.filter((c) => {
      const plano = c?.id_sucursal;
      const anidado = c?.Sucursal?.id_sucursal;
      const idDelChofer = Number(plano ?? anidado ?? 0);
      return idDelChofer === sid;
    });
  }, [choferes, sucursalId]);

  const [asignarChofer, { isLoading }] = useAsignarChoferMutation();

  useEffect(() => {
    if (open) setChoferSeleccionado("");
  }, [open, sucursalId]);

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
      const msg =
        error?.data?.error || error?.error || "No se pudo asignar el chofer.";
      dispatch(showNotification({ message: msg, severity: "error" }));
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
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          textAlign: "center",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        Asignar Chofer
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "20px",
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
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
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <InputLabel
              id="chofer-label"
              sx={{ color: (theme) => theme.palette.text.primary }}
              shrink={true}
            >
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
                  borderColor: (theme) => theme.palette.primary.main,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) => theme.palette.primary.dark,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              <MenuItem value="">Ninguno</MenuItem>{" "}
              {choferesFiltrados.map((chofer) => (
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
      <DialogActions
        sx={{
          padding: "16px",
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.error.main,
            fontWeight: "bold",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAsignar}
          variant="contained"
          color="primary"
          disabled={!choferSeleccionado || isLoading}
          sx={{
            fontWeight: "bold",
            backgroundColor: (theme) => theme.palette.primary.main,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
          }}
        >
          {isLoading ? (
            <CircularProgress
              size={24}
              sx={{ color: (theme) => theme.palette.primary.contrastText }}
            />
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
  sucursalId: PropTypes.number.isRequired,
};

export default AsignarChoferModal;
