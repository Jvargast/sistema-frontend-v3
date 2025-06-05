import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Slide,
} from "@mui/material";
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
        <InventarioCamion
          idCamion={idCamion}
          modo="visual"
          productos={[]}
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
