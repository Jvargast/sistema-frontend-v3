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
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const NoCajaAsignadaDialog = ({ open, handleClose, choferName }) => {
  const navigate = useNavigate();

  const rol = useSelector((state) => state?.auth?.rol);

  const handleIrACajas = () => {
    handleClose();
    navigate("/cajas");
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="no-caja-dialog-title"
      disableEnforceFocus
      
    >
      <DialogTitle
        id="no-caja-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1.5,
          px: 2,
          displayPrint: "none",
        }}
      >
        <ErrorOutlineIcon sx={{ color: "error.main", fontSize: 28 }} />
        Sin caja asignada
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

      <DialogActions sx={{ py: 1.5, px: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="primary"
          sx={{ textTransform: "none" }}
          autoFocus
        >
          Cerrar
        </Button>
        {rol === "administrador" && (
          <Button
            onClick={handleIrACajas}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Ir a Cajas
          </Button>
        )}
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
