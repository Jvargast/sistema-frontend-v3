import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllCotizacionesQuery } from "../../store/services/cotizacionesApi";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";

const ListarCotizaciones = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllCotizacionesQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const cotizaciones = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_cotizacion",
      label: "ID",
      render: (row) => row.id_cotizacion,
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
          onClick={() => navigate(`/admin/cotizaciones/ver/${row.id_cotizacion}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && cotizaciones.length === 0) {
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
