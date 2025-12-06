import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetAllCuentasPorCobrarQuery } from "../../store/services/cuentasPorCobrarApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useSelector } from "react-redux";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import FilterBar from "../../components/common/FilterBar";
import StatusLegend from "../../components/common/StatusLegend";

const estadoColores = {
  pendiente: "warning",
  pagado: "success",
  vencido: "error",
  anulado: "error",
};

const ESTADO_CXC_LEGEND = [
  {
    id: "pendiente",
    label: "Pendiente",
    color: (theme) => theme.palette.warning.main,
    description: "Factura emitida, pendiente de pago.",
  },
  {
    id: "pagado",
    label: "Pagado",
    color: (theme) => theme.palette.success.main,
    description: "Pago registrado y conciliado.",
  },
  {
    id: "vencido",
    label: "Vencido",
    color: (theme) => theme.palette.error.light,
    description: "Factura vencida sin pago.",
  },
  {
    id: "anulado",
    label: "Anulado",
    color: (theme) => theme.palette.error.main,
    description: "Documento anulado, sin efecto.",
  },
];

const FILTER_CONFIG = [
  {
    id: "estado",
    type: "select",
    label: "Estado",
    minWidth: 180,
    options: [
      { value: "", label: "Todos" },
      { value: "pendiente", label: "Pendiente" },
      { value: "pagado", label: "Pagado" },
      { value: "vencido", label: "Vencido" },
      { value: "anulado", label: "Anulado" },
    ],
  },
  {
    id: "cliente",
    type: "text",
    label: "Buscar cliente",
    minWidth: 220,
    adornment: "search",
  },
  {
    id: "rangoEmision",
    type: "daterange",
    fromId: "fechaDesde",
    toId: "fechaHasta",
    labelFrom: "Emisión desde",
    labelTo: "Emisión hasta",
    colSpan: 2,
  },
];

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
  const initialFilters = {
    estado: "",
    cliente: "",
    fechaDesde: "",
    fechaHasta: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setPage(0);
  }, [filters.estado, filters.cliente, filters.fechaDesde, filters.fechaHasta]);

  const handleFilterChange = (id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

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

  useRegisterRefresh(
    "facturas",
    async () => {
      await refetch();
      return true;
    },
    [refetch]
  );

  const cuentas = useMemo(() => data?.data || [], [data]);
  const cuentasFiltradas = useMemo(() => {
    return cuentas.filter((c) => {
      const estado = c.estado?.toLowerCase() || "";

      if (filters.estado && estado !== filters.estado) return false;

      if (filters.cliente.trim()) {
        const nombre = (c?.documento?.cliente?.nombre || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        const buscado = filters.cliente
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        if (!nombre.includes(buscado)) return false;
      }

      const fechaEmision = c.fecha_emision ? new Date(c.fecha_emision) : null;

      if (filters.fechaDesde) {
        const desde = new Date(`${filters.fechaDesde}T00:00:00`);
        if (!fechaEmision || fechaEmision < desde) return false;
      }

      if (filters.fechaHasta) {
        const hasta = new Date(`${filters.fechaHasta}T23:59:59`);
        if (!fechaEmision || fechaEmision > hasta) return false;
      }

      return true;
    });
  }, [cuentas, filters]);

  //const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

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
      rows={cuentasFiltradas}
      totalItems={cuentasFiltradas.length}
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
      headerAction={
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "stretch" },
            gap: 2,
            width: "100%",
            mb: 2,
          }}
        >
          <FilterBar
            config={FILTER_CONFIG}
            values={filters}
            onChange={handleFilterChange}
            columns={2}
            onReset={() => setFilters(initialFilters)}
          />

          <StatusLegend items={ESTADO_CXC_LEGEND} columns={2} maxWidth={520} />
        </Box>
      }
    />
  );
};

export default ListarCuentasPorCobrar;
