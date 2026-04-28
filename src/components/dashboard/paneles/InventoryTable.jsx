import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
import Box from "../../common/CompatBox";
import Typography from "../../common/CompatTypography";

// 📋 Definir columnas de la tabla

// 📋 Definir columnas de la tabla
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "product", headerName: "Producto", width: 200 },
  { field: "stock", headerName: "Stock Disponible", width: 150 },
];

// 📦 Datos de ejemplo (puedes reemplazarlo con datos dinámicos de una API)
const mockData = [
  { id: 1, product: "Botellón 20L", stock: 320 },
  { id: 2, product: "Bolsa 5L", stock: 120 },
  { id: 3, product: "Dispensador", stock: 50 },
];

const InventoryTable = () => {
  const [rows, setRows] = useState(null); // 🔥 Inicializamos con `null` para controlar el estado de carga

  useEffect(() => {
    // Simula la carga de datos desde una API
    setTimeout(() => {
      setRows(mockData);
    }, 500);
  }, []);

  return (
    <Box sx={{ height: 300, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        📦 Inventario Disponible
      </Typography>

      {/* 🚀 Mostrar un indicador de carga si los datos aún no están disponibles */}
      {rows === null ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={3} // ✅ Funciona correctamente sin `rowCount`
          rowsPerPageOptions={[3]}
          pagination
          getRowId={(row) => row.id} // 🔥 Se asegura de que `id` esté bien definido
        />
      )}
    </Box>
  );
};

export default InventoryTable;
