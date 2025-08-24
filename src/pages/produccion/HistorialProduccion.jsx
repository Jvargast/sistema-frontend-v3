import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllProduccionQuery } from "../../store/services/produccionApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useSelector } from "react-redux";

const getProdSucursalId = (p) =>
  Number(
    p?.id_sucursal ??
      p?.Sucursal?.id_sucursal ??
      p?.sucursal?.id_sucursal ??
      NaN
  );

const HistorialProduccion = () => {
  const navigate = useNavigate();

  const {
    mode,
    activeSucursalId,
    sucursales = [],
  } = useSelector((s) => s.scope);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sucursalFiltro, setSucursalFiltro] = useState("");

  useEffect(() => {
    if (mode === "global") {
      setSucursalFiltro(""); 
    } else {
      setSucursalFiltro(String(activeSucursalId ?? ""));
    }
  }, [mode, activeSucursalId]);

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId, sucursalFiltro]);

  const { data, isLoading, refetch, error } = useGetAllProduccionQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const producciones = useMemo(() => data?.producciones || [], [data]);
  const totalItems = useMemo(() => data?.paginacion?.totalItems || 0, [data]);

  const produccionesFiltradas = producciones.filter((p) => {
    const pSuc = getProdSucursalId(p);
    if (mode === "global") {
      if (sucursalFiltro && Number(pSuc) !== Number(sucursalFiltro))
        return false;
    } else {
      if (activeSucursalId && Number(pSuc) !== Number(activeSucursalId))
        return false;
    }
    return true;
  });

  const columns = [
    { id: "id_produccion", label: "ID", render: (row) => row.id_produccion },
    {
      id: "sucursal",
      label: "Sucursal",
      render: (row) => {
        const sid = getProdSucursalId(row);
        const nombre =
          row?.Sucursal?.nombre ||
          sucursales.find((s) => Number(s.id_sucursal) === Number(sid))
            ?.nombre ||
          (sid ? `Sucursal ${sid}` : "—");
        return <Chip label={nombre} size="small" sx={{ fontWeight: "bold" }} />;
      },
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
    { id: "cantidad_lote", label: "Lotes", render: (row) => row.cantidad_lote },
    {
      id: "operario",
      label: "Operario",
      render: (row) =>
        row.operario?.nombre || row.Usuarios?.nombre || row.rut_usuario,
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
          onClick={() => navigate(`/admin/produccion/ver/${row.id_produccion}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && produccionesFiltradas.length === 0) {
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
      title="Listado de Producción"
      subtitle="Gestión de Producción"
      columns={columns}
      rows={produccionesFiltradas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage={error?.message || "No se pudieron cargar las producciones."}
    />
  );
};

export default HistorialProduccion;
