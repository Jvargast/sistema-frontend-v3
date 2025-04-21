import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { useGetVentasTendenciaMensualQuery } from "../../../store/services/ventasEstadisticasApi";

const RevenueTrendChart = () => {
  const currentYear = new Date().getFullYear();
  const [anio, setAnio] = useState(currentYear);

  const { data, isLoading, isError } = useGetVentasTendenciaMensualQuery({
    anio,
  });

  const handleChange = (event) => {
    setAnio(event.target.value);
  };

  return (
    <Box sx={{ height: 320, px: 3, py: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          📈 Tendencia de Ingresos Mensuales
        </Typography>

        <FormControl size="small">
          <InputLabel>Año</InputLabel>
          <Select
            value={anio}
            onChange={handleChange}
            label="Año"
            sx={{ minWidth: 100 }}
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : isError ? (
        <Typography variant="body2" color="error">
          Error al cargar los datos.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
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
      )}
    </Box>
  );
};

export default RevenueTrendChart;
