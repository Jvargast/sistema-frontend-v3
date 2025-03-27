import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Paper, Typography } from "@mui/material";

const data = [
  { name: "Botellón 20L", value: 400 },
  { name: "Botellón 12L", value: 300 },
  { name: "Botellón 10L", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const OrdersPieChart = () => {
  return (
    <Box sx={{ height: 300, px: 1 }}>
      <Typography variant="h6">Pedidos por Tipo de Botellón</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default OrdersPieChart;
