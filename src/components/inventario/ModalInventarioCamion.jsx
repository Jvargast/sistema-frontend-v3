import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Slide,
  CircularProgress,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import InventarioCamion from "./InventarioCamion";
import { useVaciarCamionMutation } from "../../store/services/inventarioCamionApi";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { showNotification } from "../../store/reducers/notificacionSlice";

const Transition = Slide;

const ModalInventarioCamion = ({
  open,
  onClose,
  inventarioData,
  isLoading,
  error,
  id_camion,
}) => {
  const dispatch = useDispatch();
  const [descargarDisponibles, setDescargarDisponibles] = useState(true);
  const [descargarRetorno, setDescargarRetorno] = useState(true);
  const [vaciarCamion, { isLoading: vaciando }] = useVaciarCamionMutation();

  const handleVaciar = async () => {
    try {
      await vaciarCamion({
        id_camion,
        descargarDisponibles,
        descargarRetorno,
      }).unwrap();
      dispatch(
        showNotification({
          message: "Camión vaciado correctamente",
          severity: "success",
        })
      );
      onClose();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "Error al vaciar camión",
          severity: "error",
        })
      );
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: (theme) => ({
          borderRadius: 4,
          boxShadow: theme.shadows[10],
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.background.paper,
        }),
      }}
    >
      <DialogTitle
        sx={(theme) => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark + "22"
              : theme.palette.primary.light + "44",
          color: theme.palette.primary.main,
          fontWeight: "bold",
          fontSize: { xs: 18, sm: 22 },
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          px: { xs: 2, sm: 4 },
          py: { xs: 1.5, sm: 2 },
          borderBottom: `1.5px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.light
          }`,
        })}
      >
        Detalle Visual del Inventario del Camión
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: (theme) => theme.palette.primary.main,
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.primary.dark + "1A"
                  : theme.palette.primary.light + "1A",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={(theme) => ({
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#F9FBFF",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        })}
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={180}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">
            Error al obtener el inventario del camión
          </Alert>
        ) : (
          inventarioData && (
            <InventarioCamion
              inventarioData={inventarioData.data}
              modo="visual"
              productos={[]}
              productosReservados={[]}
              onValidezCambio={() => {}}
            />
          )
        )}

        {inventarioData && (
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={descargarDisponibles}
                  onChange={(e) => setDescargarDisponibles(e.target.checked)}
                />
              }
              label="Descargar disponibles"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={descargarRetorno}
                  onChange={(e) => setDescargarRetorno(e.target.checked)}
                />
              }
              label="Descargar retorno"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={handleVaciar}
                disabled={vaciando}
              >
                {vaciando ? "Vaciando..." : "Vaciar Camión"}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

ModalInventarioCamion.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  inventarioData: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  id_camion: PropTypes.number.isRequired,
};

export default ModalInventarioCamion;
