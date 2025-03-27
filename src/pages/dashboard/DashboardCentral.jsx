import { useEffect, useRef } from "react";
import { createSwapy } from "swapy";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import SalesChart from "../../components/dashboard/paneles/SalesChart";
import OrdersPieChart from "../../components/dashboard/paneles/OrdersPieChart";
import RevenueTrendChart from "../../components/dashboard/paneles/RevenueTrendChart";
import BestSellingProductsChart from "../../components/dashboard/paneles/BestSellingProductsChart";
import { useGetKpiVentasPorFechaQuery } from "../../store/services/ventasEstadisticasApi";
import dayjs from "dayjs";
import Boxkpi from "../../components/dashboard/paneles/Boxkpi";

// 📌 Definición de KPIs

// 📊 Definición de gráficos
const chartsData = [
  { id: "chart1", component: <SalesChart /> },
  { id: "chart2", component: <OrdersPieChart /> },
  {
    id: "chart3",
    component: <RevenueTrendChart />,
  },
  {
    id: "chart4",
    component: <BestSellingProductsChart />,
  },
];

const DashboardCentral = () => {
  const hoy = dayjs().format("YYYY-MM-DD");
  const { data } = useGetKpiVentasPorFechaQuery(hoy);
  // 🔢 KPIs base
  const kpiData = [
    {
      id: "kpi1",
      title: "Ingresos Totales",
      value: data
        ? `$${parseFloat(data.total_ventas).toLocaleString()}`
        : "Cargando...",
    },
  ];

  // 🔁 Agregar KPIs dinámicos por tipo_entrega si existen
  if (data?.detalles) {
    Object.entries(data.detalles).forEach(([tipo, valores], index) => {
      let label = tipo
        .replace(/_/g, " ") // reemplaza guiones bajos por espacios
        .replace(/\b\w/g, (l) => l.toUpperCase()); // capitaliza cada palabra

      kpiData.push({
        id: `kpi${index + 2}`,
        title: `Ventas: ${label}`,
        value: `${
          valores.cantidad
        } pedidos / $${valores.total.toLocaleString()}`,
      });
    });
  }

  const containerRef = useRef(null);
  const swapyRef = useRef(null);

  // 📌 Inicializar Swapy correctamente
  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current);

      // Listener para el evento de intercambio
      swapyRef.current.onSwap((event) => {
        console.log("Intercambio realizado:", event);
      });
    }

    return () => {
      // 🔄 Destruir la instancia de Swapy al desmontar el componente
      swapyRef.current?.destroy();
    };
  }, []);

  // 🔄 Restablecer el orden original
  const resetLayout = () => {
    setTimeout(() => {
      if (swapyRef.current) {
        swapyRef.current.destroy();
        swapyRef.current = createSwapy(containerRef.current);
      }
    }, 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Panel de Control
      </Typography>

      {/* 🔄 Botón para reiniciar el orden */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={resetLayout}
      >
        🔄 Reiniciar Orden
      </Button>

      {/* 📌 Contenedor de Swapy */}
      <div ref={containerRef}>
        <Grid container spacing={2}>
          {/* 🔢 KPIs */}
          {kpiData.map((kpi, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={kpi.id}
              data-swapy-slot={`slotKPI${index}`}
            >
              <div data-swapy-item={`itemKPI${index}`} className="swapy-handle">
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    backgroundColor: "#F4F6F8",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Boxkpi title={kpi.title} value={kpi.value} />
                  </CardContent>
                </Card>
              </div>
            </Grid>
          ))}

          {/* 📊 Gráficos */}
          {chartsData.map((chart, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={chart.id}
              data-swapy-slot={`slotChart${index}`}
            >
              <div
                data-swapy-item={`itemChart${index}`}
                className="swapy-handle"
              >
                <Card
                  sx={{ borderRadius: 3, boxShadow: 2, minHeight: "280px" }}
                >
                  <CardContent>
                    {chart.component}
                  </CardContent>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
};

export default DashboardCentral;
