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
import { Box, Typography } from "@mui/material";

// 🎨 Paleta de colores personalizada
const colors = ["#FF9800", "#FFB74D", "#FFCC80", "#FFE0B2"];

// 📊 Datos mockeados (puedes reemplazar con datos reales del backend)
const data = [
  { product: "Botellón 20L", sales: 320 },
  { product: "Botellón 12L", sales: 220 },
  { product: "Botellón 10L", sales: 180 },
  { product: "Bolsa 5L", sales: 90 },
];

const BestSellingProductsChart = () => {
  return (
    <Box sx={{ px: 1, height: 300 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        🏆 Productos Más Vendidos
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
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
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BestSellingProductsChart;
