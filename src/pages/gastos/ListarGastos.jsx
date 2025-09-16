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
import { selectScope } from "../../store/reducers/scopeSlice";
import { formatCLP } from "../../utils/formatUtils";
import { useGetAllGastosQuery } from "../../store/services/gastoApi";
import SearchIcon from "@mui/icons-material/Search";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { alpha } from "@mui/material/styles";

const tipoChipColor = (t) =>
  ({
    operativo: "primary",
    personal: "secondary",
    financiero: "info",
    impuestos: "warning",
    logistica: "success",
  }[String(t || "").toLowerCase()] || "default");

const useDebounced = (val, delay = 400) => {
  const [d, setD] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setD(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return d;
};

export default function ListarGastos() {
  const navigate = useNavigate();
  const { mode, activeSucursalId, sucursales = [] } = useSelector(selectScope);

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

  const { data, isLoading, isError } = useGetAllGastosQuery(queryArgs, {
    skip: !ready,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const gastos = useMemo(
    () => (Array.isArray(data) ? data : data?.items || data?.gastos || []),
    [data]
  );
  const totalItems = useMemo(
    () => data?.total || data?.paginacion?.totalItems || gastos.length,
    [data, gastos.length]
  );

  const columns = useMemo(
    () => [
      {
        id: "id_gasto",
        label: "ID",
        render: (row) => Number(row.id_gasto),
      },
      {
        id: "fecha",
        label: "Fecha",
        render: (row) => dayjs(row.fecha).format("DD-MM-YYYY"),
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
            sucursales.find((s) => Number(s.id_sucursal) === Number(id))
              ?.nombre ||
            (id ? `Sucursal ${id}` : "—");
          return <Chip size="small" label={nombre} sx={{ fontWeight: 700 }} />;
        },
      },
      {
        id: "categoria",
        label: "Categoría",
        render: (row) => {
          const nombre =
            row?.categoria?.nombre_categoria ||
            row?.Categoria?.nombre_categoria;
          const tipo =
            row?.categoria?.tipo_categoria || row?.Categoria?.tipo_categoria;
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={nombre || "—"} />
              {tipo && (
                <Chip
                  size="small"
                  label={
                    String(tipo).charAt(0).toUpperCase() + String(tipo).slice(1)
                  }
                  color={tipoChipColor(tipo)}
                  variant="outlined"
                />
              )}
            </Stack>
          );
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
        id: "documento",
        label: "Documento",
        render: (row) => {
          const tipo = row?.tipo_documento || "—";
          const folio = row?.nro_documento || "";
          return folio ? `${tipo} #${folio}` : tipo;
        },
      },
      {
        id: "metodo",
        label: "Método pago",
        render: (row) => row?.metodo_pago || "—",
      },
      {
        id: "total",
        label: "Total",
        render: (row) => formatCLP(Number(row.total || 0)),
        align: "right",
      },
      {
        id: "acciones",
        label: "Acciones",
        render: (row) => (
          <Tooltip title="Ver detalle">
            <IconButton
              color="primary"
              onClick={() => navigate(`/admin/gastos/ver/${row.id_gasto}`)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        ),
        align: "right",
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
            placeholder="Buscar por proveedor, categoría o documento…"
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
        title="Listado de Gastos"
        subtitle="Gestión de gastos registrados"
        columns={columns}
        rows={gastos}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={(_, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        loading={isLoading && ready}
        errorMessage={isError ? "No se pudieron cargar los gastos." : undefined}
      />
    </>
  );
}
