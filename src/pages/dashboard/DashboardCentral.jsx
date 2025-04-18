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
import Boxkpi from "../../components/dashboard/paneles/Boxkpi";
import { getKpiConfig } from "../../utils/kpiUtils";

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
  /* const hoy = dayjs().format("YYYY-MM-DD"); */
  const { data: ventas } = useGetKpiVentasPorFechaQuery();

  let kpiData = [];

  if (ventas) {
    if (typeof ventas.total_ventas !== "undefined") {
      const { label, icon, color } = getKpiConfig("ingresos");
      kpiData.push({
        id: "kpi1",
        title: label,
        value: `$${parseFloat(ventas.total_ventas).toLocaleString()}`,
        icon,
        color,
      });
    }

    if (ventas.detalles) {
      Object.entries(ventas.detalles).forEach(([tipo, valores], index) => {
        const { label, icon, color } = getKpiConfig(tipo);

        kpiData.push({
          id: `kpi${index + 2}`,
          title: label,
          value: `${
            valores.cantidad
          } pedidos / $${valores.total.toLocaleString()}`,
          icon,
          color,
        });
      });
    }
  }

  const containerRef = useRef(null);
  const swapyRef = useRef(null);

  const originalOrderRef = useRef([]);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll("[data-swapy-item]");
      originalOrderRef.current = Array.from(items).map((item) =>
        item.getAttribute("data-swapy-item")
      );

      swapyRef.current = createSwapy(containerRef.current);

      swapyRef.current.onSwap((event) => {
        console.log("Intercambio realizado:", event);
      });
    }

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  // 🔄 Restablecer el orden original
  const resetLayout = () => {
    if (!originalOrderRef.current.length || !containerRef.current) return;

    const slots = containerRef.current.querySelectorAll("[data-swapy-slot]");
    const items = Array.from(
      containerRef.current.querySelectorAll("[data-swapy-item]")
    );

    // 🔄 Restaurar el orden visual del DOM
    originalOrderRef.current.forEach((itemId, index) => {
      const slot = slots[index];
      const item = items.find(
        (el) => el.getAttribute("data-swapy-item") === itemId
      );
      if (item && slot) {
        slot.appendChild(item);
      }
    });

    // 🧼 Resetear Swapy
    swapyRef.current?.destroy();
    swapyRef.current = createSwapy(containerRef.current);
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
                <Boxkpi
                  title={kpi.title}
                  value={kpi.value}
                  icon={kpi.icon}
                  color={kpi.color}
                />
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
                  <CardContent>{chart.component}</CardContent>
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
