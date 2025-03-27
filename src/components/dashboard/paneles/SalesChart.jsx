import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetVentasResumenSemanalQuery } from "../../../store/services/ventasEstadisticasApi";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Establecer español como idioma global de dayjs
dayjs.locale("es");

// Formateador CLP
const CLPFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  minimumFractionDigits: 0,
});

const SalesChart = () => {
  const { data, isLoading, isError } = useGetVentasResumenSemanalQuery();

  const formateado =
    data?.map((d) => ({
      name:
        dayjs(d.dia).format("dddd").charAt(0).toUpperCase() +
        dayjs(d.dia).format("dddd").slice(1),
      ventas: parseFloat(d.total),
    })) ?? [];

  // Estado: cargando
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando gráfico de ventas...
        </Typography>
      </Box>
    );
  }

  // Estado: error o sin datos
  if (!formateado.length || isError) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          💤 Aún no hay ventas registradas esta semana.
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Vuelve más tarde para ver el resumen semanal.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, height: 300 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        📅 Ventas Semanales (CLP)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formateado}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => CLPFormatter.format(value)}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => CLPFormatter.format(value)}
            labelFormatter={(label) => `🗓️ ${label}`}
          />
          <Bar dataKey="ventas" fill="#1976d2" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesChart;
