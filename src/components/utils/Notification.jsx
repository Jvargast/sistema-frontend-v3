import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, Slide } from "@mui/material";
import { closeNotification } from "../../store/reducers/notificacionSlice";
import { useIsMobile } from "../../utils/useIsMobile";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Notification = () => {
  const dispatch = useDispatch();
  const { open, message, severity, duration } = useSelector(
    (state) => state.notificacion
  );

  const isMobile = useIsMobile();

  const handleClose = () => {
    dispatch(closeNotification());
  };

  const mobileBg =
    "linear-gradient(90deg, rgba(36,198,220,0.85) 0%, rgba(81,74,157,0.88) 100%)";

  const pastelColors = {
    success: "linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 100%)",
    error: "linear-gradient(135deg, #ffe3e3 0%, #ffbdbd 100%)",
    warning: "linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%)",
    info: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  };

  const textColors = {
    success: "#2d6a4f",
    error: "#9b2226",
    warning: "#7f5700",
    info: "#1e3a8a",
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={
        isMobile
          ? { vertical: "top", horizontal: "center" }
          : { vertical: "bottom", horizontal: "right" }
      }
      TransitionComponent={SlideTransition}
      sx={{
        "& .MuiSnackbarContent-root": {
          px: isMobile ? 1 : 0,
          borderRadius: isMobile ? 3 : 2,
          width: isMobile ? "calc(100vw - 36px)" : "auto",
          maxWidth: isMobile ? "600px" : "450px",
          marginTop: isMobile ? "15px !important" : 0,
          left: isMobile ? "50%" : undefined,
          transform: isMobile ? "translateX(-50%)" : undefined,
          boxShadow: isMobile
            ? "0 8px 36px 0 rgba(36,198,220,0.22)"
            : "0 4px 12px rgba(0,0,0,0.2)",
          background: isMobile ? mobileBg : undefined,
          backdropFilter: isMobile ? "blur(6px)" : undefined,
          zIndex: 20000,
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
          fontWeight: 500,
          fontSize: isMobile ? "1rem" : "0.95rem",
          background: isMobile
            ? pastelColors[severity] || pastelColors.info
            : undefined,
          color: isMobile ? textColors[severity] || "#111" : undefined,
          border: isMobile
            ? `1px solid ${textColors[severity] || "#ccc"}40`
            : undefined,
          boxShadow: isMobile ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "none",
          backdropFilter: isMobile ? "blur(10px)" : undefined,
          letterSpacing: 0.2,
          textShadow: "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
