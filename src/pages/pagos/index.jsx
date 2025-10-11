// ListarPagos.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Chip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllPagosQuery } from "../../store/services/pagosApi";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { useSelector } from "react-redux";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const estadoColores = {
  Pendiente: "warning",
  Pagado: "success",
  Anulado: "default",
  Rechazado: "error",
};

const getPagoSucursalId = (p) =>
  Number(
    p?.id_sucursal ??
      p?.Sucursal?.id_sucursal ??
      p?.sucursal?.id_sucursal ??
      NaN
  );

const formatCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor));

const ListarPagos = () => {
  const navigate = useNavigate();

  const { mode } = useSelector((s) => s.scope);
  const sucursalActiva = useSucursalActiva();
  const { data: sucursales = [] } = useGetAllSucursalsQuery();

  const activeSucursalId =
    sucursalActiva?.id_sucursal ?? sucursalActiva?.id ?? null;

  const [idSucursalFiltro, setIdSucursalFiltro] = useState(
    mode === "global" ? null : activeSucursalId
  );

  useEffect(() => {
    if (mode === "global") {
      setIdSucursalFiltro(null);
    } else {
      setIdSucursalFiltro(activeSucursalId || null);
    }
  }, [mode, activeSucursalId]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [idSucursalFiltro, mode]);

  const { data, isLoading, refetch } = useGetAllPagosQuery(
    {
      page: page + 1,
      limit: rowsPerPage,
      ...(idSucursalFiltro ? { id_sucursal: idSucursalFiltro } : {}),
    },
    { refetchOnMountOrArgChange: true }
  );

  useRegisterRefresh(
    "pagos",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, idSucursalFiltro, refetch]);

  const pagos = useMemo(() => data?.data || [], [data]);

  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    { id: "id_pago", label: "ID", render: (row) => row.id_pago },
    {
      id: "sucursal",
      label: "Sucursal",
      render: (row) => {
        const sid = getPagoSucursalId(row);
        const nombre =
          row?.venta?.Sucursal?.nombre ||
          row?.Venta?.Sucursal?.nombre ||
          row?.Sucursal?.nombre ||
          sucursales.find((s) => Number(s.id_sucursal) === Number(sid))
            ?.nombre ||
          (sid ? `Sucursal ${sid}` : "—");
        return <Chip label={nombre} size="small" sx={{ fontWeight: "bold" }} />;
      },
    },
    {
      id: "fecha_pago",
      label: "Fecha de Pago",
      render: (row) =>
        row.fecha_pago
          ? new Date(row.fecha_pago).toLocaleDateString("es-CL")
          : "Sin fecha",
    },
    {
      id: "monto",
      label: "Monto",
      format: "currency",
      render: (row) => formatCLP(row.monto),
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
          ? `${row.documento.tipo_documento?.toUpperCase?.() || ""} Nº ${
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
        <IconButton
          color="primary"
          onClick={() => navigate(`/pagos/ver/${row.id_pago}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && totalItems === 0) {
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
      title="Listado de Pagos"
      subtitle="Gestión de Pagos"
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
      showBackButton={false}
    />
  );
};

export default ListarPagos;
