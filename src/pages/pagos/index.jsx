import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Chip } from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import { useGetAllPagosQuery } from "../../store/services/pagosApi";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";

const estadoColores = {
  Pendiente: "warning",
  Pagado: "success",
  Anulado: "default",
  Rechazado: "error",
};

const ListarPagos = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllPagosQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const pagos = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_pago",
      label: "ID",
      render: (row) => row.id_pago,
    },
    {
      id: "fecha_pago",
      label: "Fecha de Pago",
      render: (row) =>
        row.fecha_pago
          ? new Date(row.fecha_pago).toLocaleDateString()
          : "Sin fecha",
    },
    {
      id: "monto",
      label: "Monto",
      format: "currency",
      render: (row) => `$${Number(row.monto).toFixed(2)}`,
    },
    {
      id: "metodo_pago",
      label: "Método de Pago",
      render: (row) => row.metodoPago?.nombre || "No definido",
    },
    {
      id: "estado_pago",
      label: "Estado",
      render: (row) => {
        const estado = row.estadoPago?.nombre || "Sin estado";
        const colorChip = estadoColores[estado] || "default";
        return (
          <Chip
            label={estado}
            color={colorChip}
            sx={{ fontWeight: "bold", minWidth: 110 }}
          />
        );
      },
    },
    {
      id: "documento",
      label: "Documento",
      render: (row) =>
        row.documento
          ? `${row.documento.tipo_documento.toUpperCase()} Nº ${
              row.documento.numero
            }`
          : "N/A",
    },
    {
      id: "referencia",
      label: "Referencia",
      render: (row) => row.referencia || "-",
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <>
          <IconButton
            color="primary"
            onClick={() => navigate(`/pagos/ver/${row.id_pago}`)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate(`/pagos/editar/${row.id_pago}`)}
          >
            <Edit />
          </IconButton>
        </>
      ),
    },
  ];

  if (!isLoading && pagos.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes pagos"
        subtitle="Puedes comenzar esperando ventas."
        buttonText="Crear Venta"
        onAction={() => navigate("/punto-venta")}
      />
    );
  }

  return (
    <DataTable
      title="💵 Listado de Pagos"
      columns={columns}
      rows={pagos}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar los pagos o no existen datos disponibles."
    />
  );
};

export default ListarPagos;
