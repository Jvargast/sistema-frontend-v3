import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, Fade } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  useGetPendientesQuery,
  useInspeccionarMutation,
} from "../../store/services/productoRetornableApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import ProductoRetornableCard from "../../components/producto_retornable/ProductoRetornableCard";
import { useGetAllInsumosQuery } from "../../store/services/insumoApi";
import Header from "../../components/common/Header";

const InspeccionRetornables = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = useGetPendientesQuery();
  const [inspeccionar, { isLoading: enviando }] = useInspeccionarMutation();
  const [agrupados, setAgrupados] = useState([]);
  const { data: insumos } = useGetAllInsumosQuery();

  useEffect(() => {
    if (!data) return;

    const agrupadosPorProducto = {};

    (Array.isArray(data) ? data : data.data).forEach((item) => {
      const key = item.Producto?.id_producto;
      if (!agrupadosPorProducto[key]) {
        agrupadosPorProducto[key] = {
          id: key,
          nombreProducto: item.Producto?.nombre_producto || "Producto",
          items: [],
        };
      }

      agrupadosPorProducto[key].items.push({
        ...item,
        reutilizable: 0,
        id_insumo_destino: "",
        fallas: [],
      });
    });

    setAgrupados(Object.values(agrupadosPorProducto));
  }, [data]);

  const handleUpdate = (grupoId, idx, field, value) => {
    setAgrupados((prev) =>
      prev.map((grupo) =>
        grupo.id === grupoId
          ? {
              ...grupo,
              items: grupo.items.map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
              ),
            }
          : grupo
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const items = [];

      agrupados.forEach((grupo) => {
        grupo.items.forEach((item) => {
          const defectuosos = (item.fallas || []).filter((f) => f.cantidad > 0);
          const reutilizable = parseInt(item.reutilizable || 0, 10);
          const total =
            reutilizable + defectuosos.reduce((sum, f) => sum + f.cantidad, 0);

          if (total > 0) {
            items.push({
              id_producto_retornable: item.id_producto_retornable,
              reutilizable,
              id_insumo_destino: item.id_insumo_destino || null,
              defectuosos,
            });
          }
        });
      });

      for (const item of items) {
        const totalDefectuosos = item.defectuosos.reduce(
          (sum, f) => sum + (f.cantidad || 0),
          0
        );
        const total = (item.reutilizable || 0) + totalDefectuosos;
        if (!item.id_producto_retornable || total === 0) {
          throw new Error("Hay productos sin asignación de cantidades.");
        }
      }
      console.log(items);

      await inspeccionar({ items }).unwrap();

      dispatch(
        showNotification({
          message: "Inspección registrada correctamente",
          severity: "success",
        })
      );
      refetch();
      setAgrupados([]);
    } catch (err) {
      dispatch(
        showNotification({
          message:
            err?.data?.error || err?.message || "Error al registrar inspección",
          severity: "error",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress size={40} />
        <Typography mt={2} fontSize={14} color="text.secondary">
          Cargando productos retornables...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        Error al cargar productos retornables pendientes.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, mx: "auto" }}>
      <Header
        title="Inspección de Productos Retornables"
        subtitle="Gestión de Productos Retornables"
      />
      {agrupados.length === 0 ? (
        <Typography color="text.secondary">
          No hay productos por inspeccionar.
        </Typography>
      ) : (
        <Fade in>
          <Box>
            {insumos &&
              agrupados.map((grupo) => (
                <ProductoRetornableCard
                  key={grupo.id}
                  grupo={grupo}
                  insumos={insumos?.data}
                  onUpdate={handleUpdate}
                />
              ))}

            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={enviando}
              >
                {enviando ? "Guardando..." : "Guardar Inspección"}
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default InspeccionRetornables;
