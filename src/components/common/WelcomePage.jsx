import {
  Box,
  Typography,
  Button,
  Stack,
/*   Modal,
  Card,
  CardContent, */
} from "@mui/material";
import { HomeOutlined, /* TouchApp, */ ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { openTab } from "../../store/reducers/tabSlice";
import { getInitialRoute } from "../../utils/navigationUtils";
import { useNavigate } from "react-router-dom";
/* import { useState } from "react"; */
/* import * as MuiIcons from "@mui/icons-material"; */

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
/* const modulesList = Object.entries(tabMap); */

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rol, permisos } = useSelector((state) => state.auth);

  const initialRoute = getInitialRoute(rol, permisos);
  const tabInfo = tabMap[initialRoute] || tabMap["/dashboard"];

/*   const [openModal, setOpenModal] = useState(false); */

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
{/*         <Button
          variant="outlined"
          startIcon={<TouchApp />}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px 0 #90caf9" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenModal(true)}
        >
          Explorar módulos
        </Button> */}
      </Stack>

     {/*  <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(1.5px)",
          backgroundColor: "rgba(30,30,40,0.18)",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            boxShadow:
              "0 8px 36px 0 rgba(27,41,75,.17), 0 1.5px 6px 0 rgba(0,0,0,0.10)",
            minWidth: 300,
            maxWidth: "92vw",
            width: 390,
            outline: "none",
          }}
        >
          <Typography variant="h5" mb={2} fontWeight="bold">
            Selecciona un módulo
          </Typography>
          <Stack spacing={2}>
            {modulesList.map(([path, info]) => {
              const Icon = MuiIcons[info.icon];
              return (
                <Card
                  key={path}
                  onClick={() => {
                    dispatch(
                      openTab({
                        key: info.key,
                        label: info.label,
                        icon: info.icon,
                        path: info.key,
                      })
                    );
                    navigate(path);
                    setOpenModal(false);
                  }}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2.5,
                    boxShadow: "0 1.5px 8px 0 rgba(27,41,75,.06)",
                    transition: "box-shadow 0.11s, transform 0.11s",
                    "&:hover": {
                      boxShadow: "0 6px 18px 0 #2196f350",
                      transform: "translateY(-2px) scale(1.015)",
                      background: "rgba(33,150,243,0.05)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", py: 1.3 }}
                  >
                    {Icon && (
                      <Icon
                        sx={{ mr: 2, color: "primary.main", fontSize: 26 }}
                      />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {info.label}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </Modal> */}
    </Box>
  );
};

export default WelcomePage;
