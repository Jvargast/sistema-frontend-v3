import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, Slide } from "@mui/material";
import { closeNotification } from "../../store/reducers/notificacionSlice";

/**
 * Transición personalizada para que el snackbar aparezca desde la derecha.
 */
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Notification = () => {
  const dispatch = useDispatch();
  const { open, message, severity, duration } = useSelector(
    (state) => state.notificacion
  );

  const handleClose = () => {
    dispatch(closeNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionComponent={SlideTransition} // Aplica la transición personalizada
      sx={{
        // Ajusta el margen o posición si deseas separarlo más de los bordes
        "& .MuiSnackbarContent-root": {
          px: 0, // Elimina padding extra del snackbar, el Alert se encarga del padding
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontSize: "0.95rem",
          backgroundColor: severity === "success" ? "#00bfa5" : undefined,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
