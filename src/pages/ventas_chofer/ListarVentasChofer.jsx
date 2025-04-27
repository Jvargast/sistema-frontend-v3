import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetVentasChoferQuery } from "../../store/services/ventasChoferApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useSelector } from "react-redux";

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

const formatFecha = (fecha) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fecha));

const ListarVentasChofer = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetVentasChoferQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const ventas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);
  const rol = useSelector((state) => state?.auth?.rol);

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
        row.fechaHoraVenta ? formatFecha(row.fechaHoraVenta) : "Sin fecha",
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
        const estado = row.estadoPago;
        const color = estadoColores[estado] || "default";
        return (
          <Chip
            label={estado.charAt(0).toUpperCase() + estado.slice(1)}
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
        title="Aún no hay ventas chofer registradas"
        subtitle="Comienza a registrar ventas durante los viajes."
        buttonText="Ir a mis Agenda Carga"
        onAction={() => navigate("/agenda")}
      />
    );
  }

  return (
    <DataTable
      title={rol === "chofer" ? "🧾 Listado de Mis Ventas" : "🧾 Ventas Chofer"}
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

export default ListarVentasChofer;
