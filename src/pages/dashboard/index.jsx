import { useState } from "react";
import FlexBetween from "../../components/layout/FlexBetween";
import Header from "../../components/common/Header";
import {
  DownloadOutlined,
  Email,
  /* PointOfSale, */
} from "@mui/icons-material";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import LoaderComponent from "../../components/common/LoaderComponent";
import StatBox from "../../components/dashboard/StatBox";
import BreakdownChart from "../../components/dashboard/BreakdownChart";
import MonthlySalesChart from "../../components/dashboard/MonthlySalesChart";
import { useObtenerPorAnoQuery } from "../../store/services/ventasEstadisticasApi";
import { useGetPorcentajeClientesNuevosQuery } from "../../store/services/clientesApi";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: estadisticas, isLoading } = useObtenerPorAnoQuery(selectedYear);
  const formattedEstadisticas = Array.isArray(estadisticas)
    ? { datos_mensuales: estadisticas }
    : estadisticas;

  const handleDownloadReport = () => {
    alert("Descarga de reportes no implementada aún.");
  };

  // Constantes reutilizables para estilos
  const boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.15)";
  const borderRadius = "12px";

  // Datos para StatBoxes
  const statBoxData = [
    {
      title: "Clientes Nuevos",
      description: "Desde el mes pasado",
      icon: <Email sx={{ color: "#4DD0E1", fontSize: "26px" }} />,
      hook: useGetPorcentajeClientesNuevosQuery,
    },
    /* {
      title: "Ventas del Día",
      description: "Desde ayer",
      icon: <PointOfSale sx={{ color: "#4DD0E1", fontSize: "26px" }} />,
      hook: useGetPorcentajesYCantidadVentasNuevasQuery,
    },
    {
      title: "Ventas del Mes",
      description: "Desde el mes pasado",
      icon: <PointOfSale sx={{ color: "#4DD0E1", fontSize: "26px" }} />,
      hook: useGetPorcentajesYCantidadVentasNuevasMesQuery,
    },
    {
      title: "Ventas Anuales",
      description: "Desde el año pasado",
      icon: <PointOfSale sx={{ color: "#4DD0E1", fontSize: "26px" }} />,
      hook: useGetPorcentajesYCantidadVentasNuevasAnoQuery,
    }, */
  ];

  return (
    <Box m="2rem 3rem">
      {/* Header */}
      <FlexBetween>
        <Header title="Dashboard" subtitle="Bienvenido al dashboard" />
        <Button
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            boxShadow,
          }}
          onClick={handleDownloadReport}
          aria-label="Descargar reportes"
        >
          <DownloadOutlined sx={{ mr: "10px" }} />
          Descargar Reportes
        </Button>
      </FlexBetween>

      {/* Ventas Anuales */}
      <Box
        mt="30px"
        p="1.5rem"
        backgroundColor={theme.palette.background.paper}
        borderRadius={borderRadius}
        boxShadow={boxShadow}
      >
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <MonthlySalesChart data={formattedEstadisticas || {}} />
        )}
      </Box>

      {/* Estadísticas y Ventas por Producto */}
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="auto"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Box
          gridColumn="span 6"
          backgroundColor={theme.palette.background.default}
          borderRadius={borderRadius}
          p="20px"
          boxShadow={boxShadow}
          sx={{
            minHeight: "300px",
            maxHeight: "400px",
            overflow: "hidden",
          }}
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gridTemplateRows="repeat(2, 1fr)"
            gap="20px"
            sx={{
              flex: 1, // Asegura que el contenido interno se expanda dentro del contenedor padre
              overflowY: "auto", // Permitir desplazamiento vertical si el contenido supera la altura máxima
            }}
          >
            {statBoxData.map((stat, index) => (
              <StatBox
                key={index}
                title={stat.title}
                description={stat.description}
                icon={stat.icon}
                useQueryHook={stat.hook}
              />
            ))}
          </Box>
        </Box>

        <Box
          gridColumn="span 6"
          backgroundColor={theme.palette.background.paper}
          borderRadius={borderRadius}
          boxShadow={boxShadow}
          p="2rem"
          display="flexx"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            height: "100%", // Ajusta la altura dinámica al contenedor padre
            minHeight: "500px",
            overflow: "hidden",
          }}
        >
          <BreakdownChart isDashboard={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
