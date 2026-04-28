import { Avatar, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Box from "../../common/CompatBox";
import Typography from "../../common/CompatTypography";

// 📍 Datos de desempeño de los conductores
const drivers = [
  { id: 1, name: "Juan Pérez", deliveries: 30, delays: 2, rating: 4.8, status: "En Ruta" },
  { id: 2, name: "María Gómez", deliveries: 25, delays: 1, rating: 4.9, status: "Disponible" },
  { id: 3, name: "Carlos Ramírez", deliveries: 18, delays: 5, rating: 4.3, status: "Retrasado" },
];

// 🎨 Definir colores según el estado
const statusColors = {
  "En Ruta": "primary",
  Disponible: "success",
  Retrasado: "error",
};

// 📊 Datos para el gráfico de barras
const chartData = drivers.map(driver => ({
  name: driver.name,
  deliveries: driver.deliveries,
  delays: driver.delays,
}));

const DriversPerformance = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        🚛 Desempeño de Conductores
      </Typography>

      {/* 📊 Gráfico de barras */}
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="deliveries" fill="#1976d2" name="Entregas Completadas" />
            <Bar dataKey="delays" fill="#e53935" name="Retrasos" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* 📋 Tabla de Conductores */}
      <Box sx={{ height: 300, mt: 2 }}>
        <DataGrid
          rows={drivers}
          columns={[
            { field: "id", headerName: "ID", width: 70 },
            {
              field: "name",
              headerName: "Conductor",
              width: 200,
              renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ mr: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  {params.value}
                </Box>
              ),
            },
            {
              field: "deliveries",
              headerName: "Entregas",
              width: 120,
              renderCell: (params) => (
                <Chip label={params.value} icon={<CheckCircleIcon />} color="primary" />
              ),
            },
            {
              field: "delays",
              headerName: "Retrasos",
              width: 120,
              renderCell: (params) => (
                <Chip label={params.value} icon={<WarningIcon />} color="error" />
              ),
            },
            {
              field: "rating",
              headerName: "Calificación",
              width: 120,
              renderCell: (params) => (
                <Chip label={`${params.value} ⭐`} color="success" />
              ),
            },
            {
              field: "status",
              headerName: "Estado",
              width: 150,
              renderCell: (params) => (
                <Chip
                  label={params.value}
                  icon={<LocalShippingIcon />}
                  color={statusColors[params.value]}
                />
              ),
            },
          ]}
          pageSize={3}
          rowsPerPageOptions={[3]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default DriversPerformance;
