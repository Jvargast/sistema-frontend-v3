import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
import { useGetKpiPedidosPorFechaQuery } from "../../store/services/pedidosEstadisticasApi";
import { formatCLP } from "../../utils/formatUtils";
import { useGetKpiProductoPorFechaQuery } from "../../store/services/productosEstadisticasApi";

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
  const { data: ventas } = useGetKpiVentasPorFechaQuery();
  const { data: pedidos } = useGetKpiPedidosPorFechaQuery();
  const { data: producto } = useGetKpiProductoPorFechaQuery();

  const { t } = useTranslation();

  const containerRef = useRef(null);
  const swapyRef = useRef(null);
  const originalOrderRef = useRef([]);

  const kpiData = [
    ventas?.total_ventas !== undefined && {
      id: "ingresos",
      title: t(getKpiConfig("ingresos").labelKey),
      value: `${formatCLP(ventas.total_ventas)}`,
      subtitle: t("dashboard.total_sales_today"),
      icon: getKpiConfig("ingresos").icon,
      color: getKpiConfig("ingresos").color,
    },

    pedidos?.total_pedidos !== undefined && {
      id: "pedidos",
      title: t(getKpiConfig("pedidos").labelKey),
      value: `${pedidos.total_pedidos} ${t("dashboard.orders")}`,
      subtitle: `${t("dashboard.total_amount")}: ${formatCLP(
        pedidos.detalles.reduce((acc, p) => acc + p.monto_total, 0)
      )}`,
      icon: getKpiConfig("pedidos").icon,
      color: getKpiConfig("pedidos").color,
    },

    {
      id: "producto",
      title: t(getKpiConfig("producto_destacado").labelKey),
      value:
        producto?.producto_destacado?.nombre ||
        t("dashboard.no_sales_recorded"),
      subtitle:
        producto?.producto_destacado?.cantidad !== undefined
          ? `${producto.producto_destacado.cantidad} ${t(
              "dashboard.units"
            )} · ${formatCLP(producto.producto_destacado.monto_total)}`
          : t("dashboard.no_product_sales"),
      icon: getKpiConfig("producto_destacado").icon,
      color: getKpiConfig("producto_destacado").color,
    },
  ].filter(Boolean);

  useEffect(() => {
    if (containerRef.current) {
      if (swapyRef.current) swapyRef.current.destroy();

      swapyRef.current = createSwapy(containerRef.current);
      originalOrderRef.current = Array.from(
        containerRef.current.querySelectorAll("[data-swapy-item]")
      ).map((item) => item.getAttribute("data-swapy-item"));
    }

    return () => {
      swapyRef.current?.destroy();
    };
  }, [kpiData.length, ventas, pedidos, producto]);

  const resetLayout = () => {
    if (!originalOrderRef.current.length || !containerRef.current) return;

    const slots = containerRef.current.querySelectorAll("[data-swapy-slot]");
    const items = Array.from(
      containerRef.current.querySelectorAll("[data-swapy-item]")
    );

    originalOrderRef.current.forEach((itemId, index) => {
      const slot = slots[index];
      const item = items.find(
        (el) => el.getAttribute("data-swapy-item") === itemId
      );
      if (item && slot) {
        slot.appendChild(item);
      }
    });

    swapyRef.current?.destroy();
    swapyRef.current = createSwapy(containerRef.current);
  };

  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 {t("general.dashboard")}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={resetLayout}
      >
        🔄 {t("buttons.reset_order")}
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
                  subtitle={kpi.subtitle}
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
