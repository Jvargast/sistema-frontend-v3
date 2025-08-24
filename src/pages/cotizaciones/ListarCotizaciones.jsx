import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllCotizacionesQuery } from "../../store/services/cotizacionesApi";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { useSelector } from "react-redux";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";

const ListarCotizaciones = () => {
  const navigate = useNavigate();
  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const isSucursalScope = mode !== "global" && Number(activeSucursalId);

  const { data: sucursalesData } = useGetAllSucursalsQuery();
  const sucursalesArr = useMemo(
    () =>
      Array.isArray(sucursalesData?.sucursales)
        ? sucursalesData.sucursales
        : Array.isArray(sucursalesData)
        ? sucursalesData
        : [],
    [sucursalesData]
  );
  const sucMap = useMemo(
    () => new Map(sucursalesArr.map((s) => [Number(s.id_sucursal), s.nombre])),
    [sucursalesArr]
  );

  const getCotSucursalId = (c) =>
    Number(
      c?.id_sucursal ??
        c?.Sucursal?.id_sucursal ??
        c?.sucursal?.id_sucursal ??
        NaN
    );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllCotizacionesQuery({
    page: page + 1,
    limit: rowsPerPage,
    ...(isSucursalScope ? { id_sucursal: Number(activeSucursalId) } : {}),
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId]);

  const cotizaciones = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_cotizacion",
      label: "ID",
      render: (row) => row.id_cotizacion,
    },
    {
      id: "sucursal",
      label: "Sucursal",
      render: (row) => {
        const id = getCotSucursalId(row);
        const nombre =
          row?.Sucursal?.nombre ||
          sucMap.get(Number(id)) ||
          (id ? `Sucursal ${id}` : "—");
        const isActive =
          typeof activeSucursalId !== "undefined" &&
          activeSucursalId !== null &&
          Number(id) === Number(activeSucursalId) &&
          mode !== "global";

        return (
          <Chip
            label={nombre}
            size="small"
            color={isActive ? "primary" : "default"}
            sx={{ fontWeight: "bold" }}
          />
        );
      },
    },

    {
      id: "cliente",
      label: "Cliente",
      render: (row) => row.cliente?.nombre || "N/A",
    },
    {
      id: "fecha",
      label: "Fecha",
      render: (row) => new Date(row.fecha).toLocaleDateString("es-CL"),
    },
    {
      id: "vencimiento",
      label: "Vence",
      render: (row) =>
        new Date(row.fecha_vencimiento).toLocaleDateString("es-CL"),
    },
    {
      id: "total",
      label: "Total",
      render: (row) =>
        new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(row.total || 0),
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <IconButton
          color="primary"
          onClick={() =>
            navigate(`/admin/cotizaciones/ver/${row.id_cotizacion}`)
          }
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && totalItems === 0 && mode === "global") {
    return (
      <EmptyState
        title="Aún no tienes cotizaciones"
        subtitle="Puedes comenzar creando una cotización para tus clientes."
        buttonText="Crear Cotización"
        onAction={() => navigate("/punto-cotizacion")}
      />
    );
  }

  return (
    <DataTable
      title="Cotizaciones Emitidas"
      subtitle="Gestión cotizaciones"
      columns={columns}
      rows={cotizaciones}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar las cotizaciones o no existen datos disponibles."
    />
  );
};

export default ListarCotizaciones;
