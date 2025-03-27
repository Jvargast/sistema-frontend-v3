import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { getInitialRoute } from "../../utils/navigationUtils";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useHasPermission } from "../../utils/useHasPermission";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const hasPermission = useHasPermission("iniciar_sesion");

  const { rol, permisos } = useSelector((state) => state.auth);

  // Memorizar la ruta inicial
  const initialRoute = useMemo(() => {
    if (!rol || !permisos) return "/unauthorized";
    return getInitialRoute(rol, permisos);
  }, [rol, permisos]);

  const handleNavigation = () => {
    navigate(initialRoute);
  };

  // Manejo de estado no válido
  if (!rol || !permisos) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          Error: No se pudo cargar la información del usuario.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
        animation: "fadeIn 0.5s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "error.main",
          color: "white",
          borderRadius: "50%",
          width: 120,
          height: 120,
          mb: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
          },
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 70 }} />
      </Box>
      <Typography
        variant="h1"
        sx={{ fontSize: "6rem", fontWeight: "bold" }}
        gutterBottom
      >
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        ¡Oops! La página que estás buscando no existe.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleNavigation}
        sx={{
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontSize: "1rem",
          borderRadius: 2,
        }}
      >
        {hasPermission ? "Volver" : "Ir al Login"}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
