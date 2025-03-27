import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import LoaderComponent from "../common/LoaderComponent";
import { useGetAllEstadisticasQuery } from "../../store/services/ventasEstadisticasApi";

const colors = [
  "#E57373", "#81C784", "#64B5F6", "#FFD54F", "#4DD0E1",
  "#BA68C8", "#FF8A65", "#A1887F", "#90A4AE", "#DCE775",
];

const BreakdownChart = () => {
  const { data, isLoading } = useGetAllEstadisticasQuery({ page: 1, limit: 10 });

  const [radius, setRadius] = useState(50);
  const [itemNb, setItemNb] = useState(10);
  const [skipAnimation, setSkipAnimation] = useState(false);

  if (isLoading) return <LoaderComponent />;

  // Transformar datos del endpoint al formato requerido por PieChart
  const formattedData = data?.data?.map((item, index) => ({
    label: item.nombre_producto || "Desconocido",
    value: parseFloat(item.ventas_anuales) || 0,
    color: colors[index % colors.length],
    unidades: item.unidades_vendidas_anuales,
  })) || [];

  const visibleData = formattedData.slice(0, itemNb);

  const totalValue = formattedData.reduce((sum, item) => sum + item.value, 0);

  const valueFormatter = (item) => 
    `$${item.value.toLocaleString()} (${((item.value / totalValue) * 100).toFixed(2)}%)`;



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: "400px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{ marginBottom: "1rem", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Ventas por Productos
      </Typography>

      <PieChart
        height={400}
        series={[
          {
            data: visibleData.map((item) => ({
              ...item,
              valueFormatter,
            })),
            innerRadius: radius,
            arcLabel: (params) => `${params.label}`,
            arcLabelMinAngle: 20,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        colors={(d, i) => d.color || colors[i % colors.length]}
        skipAnimation={skipAnimation}
        sx={{
          "& .MuiChartsLegend-root": {
            display: "none !important",
          },
          fontSize: "1.2rem",
        }}
      />

      {/* Leyenda */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {visibleData.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "0 10px",
            }}
          >
            <Box
              sx={{
                width: "16px",
                height: "16px",
                backgroundColor: item.color,
                marginRight: "8px",
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BreakdownChart;
