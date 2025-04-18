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

const NoCajaAsignadaDialog = ({ open, handleClose, choferName }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="no-caja-dialog-title"
    >
      <DialogTitle
        id="no-caja-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1.5,
          px: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ color: "error.main", fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{ color: "error.main", fontWeight: "bold" }}
        >
          Sin caja asignada
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2, px: 2.5 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {choferName
            ? `El usuario ${choferName} no tiene caja asignada.`
            : "El usuario seleccionado no tiene caja asignada."}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor, asígnale una caja antes de continuar.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ py: 1.5, px: 2.5 }}>
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

NoCajaAsignadaDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  choferName: PropTypes.string,
};

export default NoCajaAsignadaDialog;
