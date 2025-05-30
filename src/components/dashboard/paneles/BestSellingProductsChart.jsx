import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { useGetResumenProductosPorFechaQuery } from "../../../store/services/productosEstadisticasApi";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const colors = [
  "#A3C4F3",
  "#BFD8AF",
  "#FCD5CE",
  "#FFE5B4",
  "#D5AAFF",
  "#B5EAEA",
  "#FFB5E8",
];

const BestSellingProductsChart = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const hoy = dayjs().format("YYYY-MM-DD");
  const { data, isLoading, isError } = useGetResumenProductosPorFechaQuery(hoy);

  const chartData = Array.isArray(data)
    ? data
        .filter((item) => item.value > 0)
        .map((item) => ({
          nombre:
            item.name.length > 30 ? `${item.name.slice(0, 30)}...` : item.name,
          cantidad: item.value,
        }))
    : [];

  const numberFormatter = new Intl.NumberFormat(
    i18n.language === "es" ? "es-CL" : "en-US",
    {
      style: "decimal",
      maximumFractionDigits: 0,
    }
  );

  return (
    <Box
      sx={{
        px: 3,
        py: 3,
        height: 320,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        🏆 {t("dashboard.best_selling_products")}
      </Typography>

      {isLoading || isError || chartData.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <CircularProgress size={28} />
          ) : isError ? (
            <Typography variant="body2" color="error">
              {t("dashboard.error_loading_data")}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.no_data_available_today")}
            </Typography>
          )}
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="nombre"
              type="category"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => numberFormatter.format(value)}
              labelFormatter={(label) =>
                `${t("dashboard.product_or_supply")}: ${label}`
              }
            />
            <Bar dataKey="cantidad" barSize={30}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default BestSellingProductsChart;
