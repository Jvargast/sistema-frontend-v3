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
  /* const hoy = dayjs().format("YYYY-MM-DD"); */
  const { data: ventas } = useGetKpiVentasPorFechaQuery();
  const { data: pedidos } = useGetKpiPedidosPorFechaQuery();
  const { data: producto } = useGetKpiProductoPorFechaQuery();

  const containerRef = useRef(null);
  const swapyRef = useRef(null);
  const originalOrderRef = useRef([]);

  const kpiData = [
    ventas?.total_ventas !== undefined && {
      id: "ingresos",
      title: getKpiConfig("ingresos").label,
      value: `${formatCLP(ventas.total_ventas)}`,
      icon: getKpiConfig("ingresos").icon,
      color: getKpiConfig("ingresos").color,
    },
    pedidos?.total_pedidos !== undefined && {
      id: "pedidos",
      title: getKpiConfig("pedidos").label,
      value: `${pedidos.total_pedidos} pedidos / ${formatCLP(
        pedidos.detalles.reduce((acc, p) => acc + p.monto_total, 0)
      )}`,
      icon: getKpiConfig("pedidos").icon,
      color: getKpiConfig("pedidos").color,
    },
    producto?.producto_destacado && {
      id: "producto",
      title: "Producto Más Vendido",
      value: producto.producto_destacado.nombre,
      subtitle: `${producto.producto_destacado.cantidad} unidades · ${formatCLP(
        producto.producto_destacado.monto_total
      )}`,
      icon: getKpiConfig("producto_destacado").icon,
      color: getKpiConfig("producto_destacado").color,
    },
  ].filter(Boolean);

  /* if (ventas) {
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
  if (pedidos && typeof pedidos.total_pedidos !== "undefined") {
    const { label, icon, color } = getKpiConfig("pedidos");

    const montoTotal = pedidos?.detalles?.reduce(
      (acc, item) => acc + (parseFloat(item.monto_total) || 0),
      0
    );

    kpiData.push({
      id: "kpi-p-1",
      title: label || "Pedidos del día",
      value: `${pedidos.total_pedidos} pedidos / ${formatCLP(montoTotal)}`,
      icon,
      color,
    });
  }
  if (producto?.producto_destacado) {
    const { icon, color } = getKpiConfig("producto_destacado");

    const { nombre, cantidad, monto_total } = producto.producto_destacado;

    kpiData.push({
      id: "kpi-prod-1",
      title: "Producto Más Vendido",
      value: nombre,
      subtitle: `${cantidad} unidades · ${formatCLP(monto_total)}`,
      icon,
      color,
    });
  } */

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
    <Box sx={{ p: 3, mb: 3 }}>
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
