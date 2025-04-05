import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllCuentasPorCobrarQuery } from "../../store/services/cuentasPorCobrarApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";


const estadoColores = {
  pendiente: "warning",
  pagado: "success",
  vencido: "error",
};

const ListarCuentasPorCobrar = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllCuentasPorCobrarQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const cuentas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_cxc",
      label: "ID",
      render: (row) => row.id_cxc,
    },
    {
      id: "fecha_emision",
      label: "Fecha Emisión",
      render: (row) =>
        row.fecha_emision
          ? new Date(row.fecha_emision).toLocaleDateString()
          : "-",
    },
    {
      id: "fecha_vencimiento",
      label: "Vencimiento",
      render: (row) =>
        row.fecha_vencimiento
          ? new Date(row.fecha_vencimiento).toLocaleDateString()
          : "-",
    },
    {
      id: "cliente",
      label: "Cliente",
      render: (row) => row?.documento?.cliente?.nombre || "Sin cliente",
    },
    {
      id: "total",
      label: "Total",
      render: (row) => `$${Number(row.monto_total).toLocaleString("es-CL")}`,
    },
    {
      id: "estado",
      label: "Estado",
      render: (row) => (
        <Chip
          label={row.estado || "Sin estado"}
          color={estadoColores[row.estado?.toLowerCase()] || "default"}
          sx={{ fontWeight: "bold", minWidth: 110 }}
        />
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/facturas/ver/${row.id_cxc}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && cuentas.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes cuentas por cobrar"
        subtitle="Genera una venta con factura para comenzar."
        buttonText="Ir al Punto de Venta"
        onAction={() => navigate("/punto-venta")}
      />
    );
  }

  return (
    <DataTable
      title="📄 Cuentas por Cobrar"
      columns={columns}
      rows={cuentas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar las cuentas por cobrar o no existen datos disponibles."
    />
  );
};

export default ListarCuentasPorCobrar;
