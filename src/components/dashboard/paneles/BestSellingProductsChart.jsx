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

// 🎨 Paleta de colores pastel profesional
const colors = ["#A3C4F3", "#BFD8AF", "#FCD5CE", "#FFE5B4", "#D5AAFF"];

const BestSellingProductsChart = () => {
  const theme = useTheme();
  const hoy = dayjs().format("YYYY-MM-DD");
  const { data, isLoading, isError } = useGetResumenProductosPorFechaQuery(hoy);

  const chartData = Array.isArray(data)
    ? data
        .filter((item) => item.value > 0)
        .map((item) => ({
          product: item.name,
          sales: item.value,
        }))
    : [];

  return (
    <Box
      sx={{
        px: 3,
        py: 3,
        height: 320,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        🏆 Productos Más Vendidos
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
              Error al cargar los datos.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay datos disponibles para hoy.
            </Typography>
          )}
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="product" type="category" width={140} />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("es-CL", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Bar dataKey="sales" barSize={30}>
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
