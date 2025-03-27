import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Typography } from "@mui/material";

const data = [
  { month: "Ene", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Abr", revenue: 22000 },
  { month: "May", revenue: 26000 },
];

const RevenueTrendChart = () => {
  return (
    <Box sx={{ height: 300, px: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        📈 Tendencia de Ingresos
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
                maximumFractionDigits: 0,
              }).format(value)
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
                maximumFractionDigits: 0,
              }).format(value)
            }
            labelFormatter={(label) => `Mes: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="url(#colorRevenue)"
            strokeWidth={3}
            dot={{ r: 5, fill: "#3f51b5", strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 8, fill: "#303f9f" }}
          />
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f51b5" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#303f9f" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueTrendChart;
