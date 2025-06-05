import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllProduccionQuery } from "../../store/services/produccionApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";


const HistorialProduccion = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch, error } = useGetAllProduccionQuery(
    {
      page: page + 1,
      limit: rowsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const producciones = useMemo(() => data?.producciones || [], [data]);
  const totalItems = useMemo(() => data?.paginacion?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_produccion",
      label: "ID",
      render: (row) => row.id_produccion,
    },
    {
      id: "fecha_produccion",
      label: "Fecha",
      render: (row) =>
        new Date(row.fecha_produccion).toLocaleString("es-CL", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      id: "producto_final",
      label: "Producto Final",
      render: (row) => row.formula?.Producto?.nombre_producto || "—",
    },
    {
      id: "unidades_fabricadas",
      label: "Fabricadas",
      render: (row) => parseInt(row.unidades_fabricadas, 10),
    },
    {
      id: "cantidad_lote",
      label: "Lotes",
      render: (row) => row.cantidad_lote,
    },
    {
      id: "operario",
      label: "Operario",
      render: (row) => row.Usuarios?.nombre || row.rut_usuario,
    },
    {
      id: "estado",
      label: "Activo",
      render: (row) => (
        <Chip
          label={row.activo ? "Activo" : "Inactivo"}
          color={row.activo ? "success" : "default"}
          sx={{ fontWeight: "bold", minWidth: 90 }}
        />
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <IconButton
          color="info"
          onClick={() => navigate(`/produccion/historial/ver/${row.id_produccion}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && producciones.length === 0) {
    return (
      <EmptyState
        title="No hay registros de producción"
        subtitle="Aún no se ha registrado ninguna producción."
        buttonText="Registrar producción"
        onAction={() => navigate("/produccion/nuevo")}
      />
    );
  }

  return (
    <DataTable
      title="📦 Historial de Producción"
      columns={columns}
      rows={producciones}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage={error?.message || "No se pudieron cargar las producciones."}
    />
  );
};

export default HistorialProduccion;
