import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Chip } from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import { useGetAllPedidosQuery } from "../../store/services/pedidosApi";
import DataTable from "../../components/common/DataTable";

const ListarPedidos = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllPedidosQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const pedidos = useMemo(() => data?.pedidos || [], [data]);
  const totalItems = useMemo(() => data?.paginacion?.totalItems || 0, [data]);

  const estadoColores = {
    Pendiente: "default",
    "Pendiente de Pago": "warning",
    Pagada: "success",
    "Pendiente de Confirmación": "info",
    Confirmado: "primary",
    Rechazado: "error",
    "En Preparación": "secondary",
    "En Entrega": "info",
    Completada: "success",
    Cancelada: "error",
    Reembolsada: "default",
    Rechazada: "error",
    "Completada y Entregada": "success",
  };

  const columns = [
    {
      id: "id_pedido",
      label: "ID",
      render: (row) => Number(row.id_pedido),
    },
    {
      id: "cliente",
      label: "Cliente",
      render: (row) => row.Cliente?.nombre || "N/A",
    },
    {
      id: "fecha",
      label: "Fecha",
      render: (row) => new Date(row.fecha_pedido).toLocaleDateString(),
    },
    {
      id: "total",
      label: "Total",
      format: "currency",
      render: (row) => Number(row.total),
    },
    {
      id: "estadoPedido",
      label: "Estado",
      render: (row) => {
        const estado = row.EstadoPedido?.nombre_estado || "Desconocido";
        const colorChip = estadoColores[estado] || "default";
        return (
          <Chip label={estado} color={colorChip} sx={{ fontWeight: "bold" }} />
        );
      },
    },
    {
      id: "pagado",
      label: "¿Pagado?",
      render: (row) => (
        <Chip
          label={row.pagado ? "Sí" : "No"}
          color={row.pagado ? "success" : "default"}
          sx={{ fontWeight: "bold" }}
        />
      ),
    },

    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <>
          <IconButton
            color="primary"
            onClick={() => navigate(`/pedidos/ver/${row.id_pedido}`)}
          >
            <Visibility />
          </IconButton>
          <IconButton color="inherit">
            <Edit />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DataTable
      title="🗒️ Listado de Pedidos"
      columns={columns}
      rows={pedidos}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar los pedidos o no existen datos disponibles."
    />
  );
};

export default ListarPedidos;
