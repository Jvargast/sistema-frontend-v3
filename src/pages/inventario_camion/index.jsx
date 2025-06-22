import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  useGetPendientesQuery,
  useInspeccionarMutation,
} from "../../store/services/productoRetornableApi";
import { showNotification } from "../../store/reducers/notificacionSlice";

const InspeccionRetornables = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = useGetPendientesQuery();
  const [inspeccionar, { isLoading: enviando }] = useInspeccionarMutation();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      const items = Array.isArray(data) ? data : data.data;
      if (Array.isArray(items)) {
        setRows(
          items.map((item) => ({
            ...item,
            estado: "reutilizable",
            tipo_defecto: "",
          }))
        );
      }
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const grouped = useMemo(() => {
    const g = {};
    rows.forEach((row) => {
      if (!g[row.id_camion]) g[row.id_camion] = [];
      g[row.id_camion].push(row);
    });
    return g;
  }, [rows]);

  const handleSubmit = async () => {
    try {
      await Promise.all(
        Object.entries(grouped).map(([id_camion, items]) =>
          inspeccionar({
            id_camion,
            items: items.map((i) => ({
              id_producto: i.id_producto,
              cantidad: i.cantidad,
              estado: i.estado,
              tipo_defecto: i.estado === "defectuoso" ? i.tipo_defecto : null,
            })),
          }).unwrap()
        )
      );
      dispatch(
        showNotification({
          message: "Inspección registrada correctamente",
          severity: "success",
        })
      );
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "Error al registrar inspección",
          severity: "error",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error al cargar productos retornables pendientes
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Inspección de Productos Retornados
      </Typography>
      {rows.length === 0 ? (
        <Typography>No hay productos por inspeccionar.</Typography>
      ) : (
        rows.map((row, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight="bold">
              Camión {row.id_camion} - Producto {row.id_producto}
            </Typography>
            <Typography sx={{ mb: 1 }}>Cantidad: {row.cantidad}</Typography>
            <Select
              value={row.estado}
              onChange={(e) => handleChange(idx, "estado", e.target.value)}
              size="small"
              sx={{ mr: 2 }}
            >
              <MenuItem value="reutilizable">Reutilizable</MenuItem>
              <MenuItem value="defectuoso">Defectuoso</MenuItem>
            </Select>
            <TextField
              label="Tipo defecto"
              value={row.tipo_defecto}
              disabled={row.estado !== "defectuoso"}
              onChange={(e) => handleChange(idx, "tipo_defecto", e.target.value)}
              size="small"
            />
          </Paper>
        ))
      )}
      {rows.length > 0 && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={enviando}
        >
          {enviando ? "Guardando..." : "Guardar Inspección"}
        </Button>
      )}
    </Box>
  );
};

export default InspeccionRetornables;
