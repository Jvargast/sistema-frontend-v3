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
    success: "linear-gradient(90deg, #A8FFCE 0%, #F9F9D2 100%)",
    error: "linear-gradient(90deg, #FFDEE9 0%, #B5FFFC 100%)",
    warning: "linear-gradient(90deg, #FFF6B7 0%, #F6416C 100%)",
    info: "linear-gradient(90deg, #43C6AC 0%, #F8FFAE 100%)",
  };

  const textColors = {
    success: "#239672",
    error: "#b02646",
    warning: "#ad6700",
    info: "#237c96",
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
          borderRadius: 2.5,
          fontWeight: "bold",
          fontSize: isMobile ? "1.05rem" : "0.95rem",
          background: isMobile
            ? pastelColors[severity] || pastelColors.info
            : undefined,
          color: isMobile ? textColors[severity] || "#333" : undefined,
          boxShadow: "none",
          border: isMobile
            ? `1.5px solid ${textColors[severity] || "#e0e0e0"}`
            : undefined,
          letterSpacing: 0.3,
          textShadow: isMobile ? "0 1px 6px #ffffff80" : undefined,
          transition: "all 0.3s",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
