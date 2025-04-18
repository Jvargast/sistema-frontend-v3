import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetMisVentasChoferQuery } from "../../store/services/ventasChoferApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";

const estadoColores = {
  pendiente: "warning",
  pagado: "success",
};

const formatCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor));

const ListarMisVentas = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetMisVentasChoferQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const ventas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_venta_chofer",
      label: "ID",
      render: (row) => row.id_venta_chofer,
    },
    {
      id: "fechaHoraVenta",
      label: "Fecha",
      render: (row) =>
        row.fechaHoraVenta
          ? new Date(row.fechaHoraVenta).toLocaleString()
          : "Sin fecha",
    },
    {
      id: "cliente",
      label: "Cliente",
      render: (row) => row.cliente?.nombre || "-",
    },
    {
      id: "total_venta",
      label: "Total",
      render: (row) => formatCLP(row.total_venta),
    },
    {
      id: "metodo_pago",
      label: "Método",
      render: (row) => row.metodoPago?.nombre || "-",
    },
    {
      id: "estadoPago",
      label: "Estado",
      render: (row) => {
        const color = estadoColores[row.estadoPago] || "default";
        return (
          <Chip
            label={row.estadoPago}
            color={color}
            sx={{ fontWeight: "bold", minWidth: 100 }}
          />
        );
      },
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/ventas-chofer/ver/${row.id_venta_chofer}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && ventas.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes ventas"
        subtitle="Comienza a registrar ventas durante tus viajes."
        buttonText="Ir a Viaje"
        onAction={() => navigate("/viajes")}
      />
    );
  }

  return (
    <DataTable
      title="🧾 Mis Ventas"
      columns={columns}
      rows={ventas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar tus ventas."
    />
  );
};

export default ListarMisVentas;
