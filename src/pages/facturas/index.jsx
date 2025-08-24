import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllCuentasPorCobrarQuery } from "../../store/services/cuentasPorCobrarApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useSelector } from "react-redux";
import useSucursalActiva from "../../hooks/useSucursalActiva";

const estadoColores = {
  pendiente: "warning",
  pagado: "success",
  vencido: "error",
};

const getProdSucursalId = (p) =>
  Number(
    p?.id_sucursal ??
      p?.Sucursal?.id_sucursal ??
      p?.sucursal?.id_sucursal ??
      NaN
  );

const ListarCuentasPorCobrar = () => {
  const navigate = useNavigate();

  const {
    mode,
    activeSucursalId: scopeSucursalId,
    sucursales = [],
  } = useSelector((s) => s.scope || {});
  const sucursalActiva = useSucursalActiva();
  const fallbackSucursalId =
    sucursalActiva?.id_sucursal ?? sucursalActiva?.id ?? null;
  const effectiveSucursalId = scopeSucursalId ?? fallbackSucursalId;

  const [idSucursalFiltro, setIdSucursalFiltro] = useState(
    mode === "global" ? null : effectiveSucursalId
  );

  useEffect(() => {
    setIdSucursalFiltro(mode === "global" ? null : effectiveSucursalId || null);
  }, [mode, effectiveSucursalId]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [idSucursalFiltro, mode]);

  const { data, isLoading, refetch } = useGetAllCuentasPorCobrarQuery(
    {
      page: page + 1,
      limit: rowsPerPage,
      ...(idSucursalFiltro ? { id_sucursal: idSucursalFiltro } : {}),
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, idSucursalFiltro, refetch]);

  const cuentas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    { id: "id_cxc", label: "ID", render: (row) => row.id_cxc },
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
      title="Cuentas por Cobrar"
      subtitle="Gestión de facturas"
      columns={columns}
      rows={cuentas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar las cuentas por cobrar o no existen datos disponibles."
      showBackButton={false}
      header
    />
  );
};

export default ListarCuentasPorCobrar;
