import { Box, Typography, Button, Stack } from "@mui/material";
import { HomeOutlined, TouchApp, ArrowForward } from "@mui/icons-material";
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        p: 4,
      }}
    >
      <HomeOutlined sx={{ fontSize: 64, mb: 2, color: "primary.main" }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ¡Bienvenido a ERP Aguas Valentino!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Selecciona un módulo en el menú lateral para comenzar.
        <br />
        Disfruta una experiencia moderna y productiva.
      </Typography>
      <Stack direction="row" spacing={2} mt={4}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          component={motion.button}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px 0 #2196f3" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoToDashboard}
        >
          Ir a {tabInfo.label}
        </Button>
        <Button
          variant="outlined"
          startIcon={<TouchApp />}
          component={motion.button}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px 0 #90caf9" }}
          whileTap={{ scale: 0.98 }}
        >
          Explorar módulos
        </Button>
      </Stack>
    </Box>
  );
};

export default WelcomePage;
