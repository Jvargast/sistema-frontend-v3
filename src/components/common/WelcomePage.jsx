import { Box, Typography, Button, Stack } from "@mui/material";
import { HomeOutlined, ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { openTab } from "../../store/reducers/tabSlice";
import { getInitialRoute } from "../../utils/navigationUtils";
import { useNavigate } from "react-router-dom";

const tabMap = {
  "/dashboard": {
    key: "dashboard",
    label: "Dashboard",
    icon: "HomeOutlined",
  },
  "/punto-venta": {
    key: "punto-venta",
    label: "Punto de Venta",
    icon: "PointOfSaleOutlined",
  },
  "/viajes": {
    key: "viajes",
    label: "Viajes",
    icon: "MapOutlined",
  },
  "/produccion": {
    key: "produccion",
    label: "Producción",
    icon: "ProductionQuantityLimitsOutlined",
  },
};

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rol, permisos } = useSelector((state) => state.auth);

  const initialRoute = getInitialRoute(rol, permisos);
  const tabInfo = tabMap[initialRoute] || tabMap["/dashboard"];

  const handleGoToDashboard = () => {
    dispatch(
      openTab({
        key: tabInfo.key,
        label: tabInfo.label,
        icon: tabInfo.icon,
        path: tabInfo.key,
      })
    );
    navigate(initialRoute);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: {
          xs: "calc(100vh - 140px)",
          md: "calc(100vh - 160px)",
        },
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={(theme) => ({
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
          px: { xs: 3, md: 4 },
          py: { xs: 3.5, md: 4.5 },
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 18px 45px rgba(15,23,42,0.10)"
              : "0 20px 48px rgba(0,0,0,0.65)",
          border: `1px solid ${
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800]
          }`,
        })}
      >
        <Box
          sx={(theme) => ({
            width: 72,
            height: 72,
            borderRadius: "50%",
            mx: "auto",
            mb: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
                : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 10px 25px rgba(37,99,235,0.35)"
                : "0 12px 28px rgba(0,0,0,0.7)",
          })}
        >
          <HomeOutlined sx={{ fontSize: 40, color: "#fff" }} />
        </Box>

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            mb: 1,
            fontSize: { xs: 24, md: 28 },
          }}
        >
          ¡Bienvenido a ERP Aguas Valentino!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 0.5, fontSize: { xs: 14.5, md: 15.5 } }}
        >
          Selecciona un módulo en el menú lateral para comenzar.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontSize: { xs: 13.5, md: 14.5 } }}
        >
          También puedes ir directamente a tu módulo principal recomendado.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            component={motion.button}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoToDashboard}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: { xs: 3, md: 3.8 },
              py: 1,
              fontWeight: 600,
              fontSize: { xs: 14, md: 15 },
              boxShadow: "0 10px 26px rgba(37,99,235,0.35)",
            }}
          >
            Ir a {tabInfo.label}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default WelcomePage;
