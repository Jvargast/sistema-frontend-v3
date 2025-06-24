import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const DialogFinalizarViaje = ({
  open,
  onClose,
  onConfirm,
  dejaRetornables,
  setDejaRetornables,
  descargarAuto,
  setDescargarAuto,
  descargarDisponibles,
  setDescargarDisponibles,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile}>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Confirmar Finalización del Viaje
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Indica las siguientes opciones antes de finalizar:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={descargarAuto}
                onChange={(e) => setDescargarAuto(e.target.checked)}
              />
            }
            label="¿Descargar automáticamente el camión?"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={descargarDisponibles}
                onChange={(e) => setDescargarDisponibles(e.target.checked)}
                disabled={!descargarAuto}
              />
            }
            label="Descargar productos disponibles (stock)"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dejaRetornables}
                onChange={(e) => setDejaRetornables(e.target.checked)}
              />
            }
            label="Dejé los botellones retornables en planta"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          Finalizar Viaje
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogFinalizarViaje.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  dejaRetornables: PropTypes.bool.isRequired,
  setDejaRetornables: PropTypes.func.isRequired,
  descargarAuto: PropTypes.bool.isRequired,
  setDescargarAuto: PropTypes.func.isRequired,
  descargarDisponibles: PropTypes.bool.isRequired,
  setDescargarDisponibles: PropTypes.func.isRequired,
};

export default DialogFinalizarViaje;
