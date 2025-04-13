import { Dialog, DialogTitle, DialogContent, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import InventarioCamion from "./InventarioCamion";

const Transition = Slide;

const ModalInventarioCamion = ({ open, onClose, idCamion }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#E3F2FD",
          fontWeight: "bold",
        }}
      >
        Detalle Visual del Inventario del Camión
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <InventarioCamion
          idCamion={idCamion}
          modo="visual"
          productos={[]} // puedes pasarlos si estás dentro de un contexto de carga
          productosReservados={[]}
          onValidezCambio={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};

ModalInventarioCamion.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  idCamion: PropTypes.number.isRequired,
};

export default ModalInventarioCamion;
