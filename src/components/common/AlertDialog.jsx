import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from "@mui/material";
import { WarningAmber, CheckCircle, Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({
  openAlert,
  onCloseAlert,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseAlert}
      aria-labelledby="confirm-dialog"
      aria-describedby="confirm-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          boxShadow: 6,
          padding: 3,
          minWidth: 400,
        },
      }}
    >
      {/* Encabezado del diálogo */}
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
          fontSize: "1.25rem",
        }}
      >
        <WarningAmber sx={{ color: "#FF9800", fontSize: 30 }} />
        {title}
      </DialogTitle>

      {/* Contenido del diálogo */}
      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: "1rem",
            color: "#424242",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* Acciones (Botones) */}
      <DialogActions sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Button
          onClick={onCloseAlert}
          variant="outlined"
          startIcon={<Close />}
          sx={{
            color: "#D32F2F",
            borderColor: "#D32F2F",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              borderColor: "#B71C1C",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onCloseAlert();
          }}
          variant="contained"
          startIcon={<CheckCircle />}
          sx={{
            backgroundColor: "#388E3C",
            color: "#fff",
            "&:hover": { backgroundColor: "#2E7D32" },
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  openAlert: PropTypes.bool.isRequired,
  onCloseAlert: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default AlertDialog;
