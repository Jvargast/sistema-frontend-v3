import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PropTypes from "prop-types";

const NoUsuarioCamionDialog = ({ open, handleClose, camionLabel }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="no-usuario-camion-dialog-title"
    >
      <DialogTitle
        id="no-usuario-camion-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <ErrorOutlineIcon sx={{ color: "error.main", fontSize: 28 }} />
        <Typography
          variant="body1"
          sx={{ color: "error.main", fontWeight: "bold" }}
        >
          Camión sin usuario
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {camionLabel
            ? `El camión ${camionLabel} no tiene usuario asignado.`
            : "El camión seleccionado no tiene usuario asignado."}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor, asigna un usuario antes de continuar.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ py: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NoUsuarioCamionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  camionLabel: PropTypes.string, 
};

export default NoUsuarioCamionDialog;
