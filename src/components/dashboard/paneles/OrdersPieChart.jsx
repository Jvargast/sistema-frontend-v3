import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { useGetResumenVentasPorTipoEntregaQuery } from "../../../store/services/ventasEstadisticasApi";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const COLORS = ["#A3C4F3", "#BFD8AF", "#FCD5CE", "#FFE5B4", "#D5AAFF"];

const OrdersPieChart = () => {
  const theme = useTheme();
  const hoy = dayjs().format("YYYY-MM-DD");
  const { data, isLoading, isError } =
    useGetResumenVentasPorTipoEntregaQuery(hoy);
  const { t } = useTranslation();

  const chartData = Array.isArray(data)
    ? data.filter((item) => item.value > 0)
    : [];

  return (
    <Box
      sx={{
        height: 320,
        px: 3,
        py: 3,
        borderRadius: 3,
        
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        outline: "none",
        userSelect: "none",
        "& .recharts-sector:focus": {
          outline: "none !important",
        },
        "& .recharts-pie-sector:focus": {
          outline: "none !important",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        🚚 {t("dashboard.sales_by_delivery_type")}
      </Typography>

      {isLoading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      ) : isError ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="error">
            {t("dashboard.error_loading_data")}
          </Typography>
        </Box>
      ) : chartData.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            💤 {t("dashboard.no_data_today")}
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="#fff"
              strokeWidth={1}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 18, fontWeight: 600, fill: "#334155" }}
            >
              {(() => {
                const total = chartData.reduce(
                  (acc, item) => acc + item.value,
                  0
                );
                if (chartData.length === 1) return `100%`;
                return `${total} pedidos`;
              })()}
            </text>

            <Tooltip
              formatter={(value, name) => [
                `${value} ${t("dashboard.orders")}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
                color: "#111827",
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                fontSize: 13,
                marginTop: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default OrdersPieChart;
