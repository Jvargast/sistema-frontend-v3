import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Stack,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import DataTable from "../../components/common/DataTable";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ESTADOS_COMPRA } from "../../constants/estadosCompra";
import { MONEDAS } from "../../constants/monedas";
import { formatCLP } from "../../utils/formatUtils";
import { useGetAllComprasQuery } from "../../store/services/compraApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { selectScope } from "../../store/reducers/scopeSlice";

const estadoChip = (v) =>
  ESTADOS_COMPRA.find((e) => e.value === String(v || "").toLowerCase()) || {
    label: v || "—",
    color: "default",
  };

const useDebounced = (val, delay = 400) => {
  const [d, setD] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setD(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return d;
};

const formatMoney = (amount, currency = "CLP") => {
  const n = Number(amount || 0);
  if (currency === "CLP") return formatCLP(n);
  const m = MONEDAS.find((x) => x.value === currency);
  try {
    return new Intl.NumberFormat(m?.locale || "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: m?.decimals ?? 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(m?.decimals ?? 2)}`;
  }
};

export default function ListarCompras() {
  const navigate = useNavigate();
  const { mode, activeSucursalId } = useSelector(selectScope);

  const { data: sucursales } = useGetAllSucursalsQuery();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId]);

  const idSucursalParam = useMemo(() => {
    if (mode === "global") return undefined;
    return activeSucursalId != null ? Number(activeSucursalId) : undefined;
  }, [mode, activeSucursalId]);

  const ready = mode === "global" || idSucursalParam != null;

  const queryArgs = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(idSucursalParam != null && { id_sucursal: idSucursalParam }),
    }),
    [page, rowsPerPage, debouncedSearch, idSucursalParam]
  );

  const { data, isLoading, isError } = useGetAllComprasQuery(queryArgs, {
    skip: !ready,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const compras = useMemo(
    () => (Array.isArray(data) ? data : data?.items || data?.compras || []),
    [data]
  );
  const totalItems = useMemo(
    () => data?.total || data?.paginacion?.totalItems || compras.length,
    [data, compras.length]
  );

  const columns = useMemo(
    () => [
      {
        id: "id_compra",
        label: "ID",
        render: (row) => Number(row.id_compra),
      },
      {
        id: "fecha",
        label: "Fecha",
        render: (row) =>
          row?.fecha ? dayjs(row.fecha).format("DD-MM-YYYY") : "—",
      },
      {
        id: "sucursal",
        label: "Sucursal",
        render: (row) => {
          const id =
            row?.id_sucursal ??
            row?.sucursal?.id_sucursal ??
            row?.Sucursal?.id_sucursal;
          const nombre =
            row?.sucursal?.nombre ||
            row?.Sucursal?.nombre ||
            (Array.isArray(sucursales)
              ? sucursales.find((s) => Number(s.id_sucursal) === Number(id))
                  ?.nombre
              : undefined) ||
            (id ? `Sucursal ${id}` : "—");
          return <Chip size="small" label={nombre} sx={{ fontWeight: 700 }} />;
        },
      },
      {
        id: "proveedor",
        label: "Proveedor",
        render: (row) =>
          row?.proveedor?.razon_social ||
          row?.Proveedor?.razon_social ||
          row?.proveedor?.nombre ||
          "—",
      },
      {
        id: "estado",
        label: "Estado",
        render: (row) => {
          const e = estadoChip(row?.estado);
          return (
            <Chip
              size="small"
              label={e.label}
              color={e.color}
              variant="outlined"
            />
          );
        },
      },
      {
        id: "nro_doc",
        label: "N° doc.",
        render: (row) => row?.nro_documento || "—",
      },
      {
        id: "total",
        label: "Total",
        align: "right",
        render: (row) => {
          const cur = row?.moneda || "CLP";
          return formatMoney(row?.total ?? 0, cur);
        },
      },
      {
        id: "acciones",
        label: "Acciones",
        align: "right",
        render: (row) => (
          <Tooltip title="Ver detalle">
            <IconButton
              color="primary"
              onClick={() => navigate(`/admin/compras/ver/${row.id_compra}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [navigate, sucursales]
  );

  return (
    <>
      <Paper
        component="section"
        elevation={0}
        sx={(theme) => ({
          mt: { xs: 1, sm: 2 },
          mb: 1,
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: { xs: 8, sm: 0 },
          zIndex: theme.zIndex.appBar + 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: "saturate(180%) blur(6px)",
        })}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            placeholder="Buscar por proveedor, N° documento o estado…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: !!search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                      setSearch("");
                      setPage(0);
                    }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      <DataTable
        title="Listado de Compras"
        subtitle="Compras registradas"
        columns={columns}
        rows={compras}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={(_, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        loading={isLoading && ready}
        errorMessage={
          isError ? "No se pudieron cargar las compras." : undefined
        }
      />
    </>
  );
}
