import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import PropTypes from 'prop-types';

// Función para obtener el nombre del mes
const getMonthName = (monthNumber) => {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return months[monthNumber - 1] || "Desconocido";
};

const MonthlySalesChart = ({ data }) => {
  const theme = useTheme();

  // Validación y transformación de datos
  const datosMensuales = data?.datos_mensuales || [];
  const formattedData = datosMensuales.map((item) => ({
    mes: getMonthName(item.mes),
    total: parseFloat(item.total) || 0,
    unidades: parseInt(item.unidades, 10) || 0,
  }));

  // Si no hay datos, mostramos un mensaje
  if (formattedData.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: "10px",
          p: "1rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          No hay datos disponibles para mostrar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: "10px",
        p: "1rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          marginBottom: "1rem",
          color: theme.palette.text.primary,
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Ventas Anuales
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 60, left: 50, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.divider}
          />
          <XAxis
            dataKey="mes"
            stroke={theme.palette.text.primary}
            tickMargin={10}
            tick={{ fill: theme.palette.text.primary }}
            aria-label="Mes"
          />
          <YAxis
            stroke={theme.palette.text.primary}
            tick={{ fill: theme.palette.text.primary, fontSize: "1rem" }}
            domain={[0, "dataMax + 5000"]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
            tickLine={false}
            aria-label="Ventas ($)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            }}
            formatter={(value, name) =>
              name === "Ventas ($)"
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()
            }
            labelStyle={{ color: theme.palette.text.primary }}
          />
          <Legend
            wrapperStyle={{ fontSize: "1rem" }}
            formatter={(value) => (
              <span style={{ color: theme.palette.text.primary }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            name="Ventas ($)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
MonthlySalesChart.propTypes = {
  data: PropTypes.shape({
    datos_mensuales: PropTypes.arrayOf(
      PropTypes.shape({
        mes: PropTypes.number.isRequired,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        unidades: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ),
  }).isRequired,
};

export default MonthlySalesChart;

