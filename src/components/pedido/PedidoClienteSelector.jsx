import Dialog from "../common/CompatDialog";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useNavigate } from "react-router-dom";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import LoaderComponent from "../common/LoaderComponent";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const PedidoClienteSelector = ({
  open,
  onClose,
  selectedCliente,
  onSelect,
  idSucursal
}) => {
  const limit = 10;
  const theme = useTheme();
  const navigate = useNavigate();
  const ink =
    theme.palette.mode === "light" ? "#0F172A" : theme.palette.common.white;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [preSelectedCliente, setPreSelectedCliente] = useState(null);
  const [ready, setReady] = useState(false);

  const params = useMemo(() => {
    const p = { page, limit, activo: true };
    if (debouncedSearch?.trim()) p.search = debouncedSearch.trim();
    const n = Number(idSucursal);
    if (!Number.isNaN(n) && !!n) p.id_sucursal = n;
    return p;
  }, [page, limit, debouncedSearch, idSucursal]);

  const skip = !open;

  const { data, isLoading, isFetching, isError, isSuccess } =
  useGetAllClientesQuery(params, {
    skip,
    keepUnusedDataFor: 30,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  useEffect(() => {
    if (!data) return;
    const raw = Array.isArray(data?.clientes) ?
    data.clientes :
    Array.isArray(data) ?
    data :
    [];

    const pageItems = raw.filter((c) => c?.activo !== false);
    setItems((prev) => page === 1 ? pageItems : [...prev, ...pageItems]);

    const totalPages = Number(data?.paginacion?.totalPages) || 1;
    setHasMore(page < totalPages && pageItems.length > 0);

    if (page === 1) setReady(true);
  }, [data, page]);

  useEffect(() => {
    if (!open) return;
    setPreSelectedCliente(selectedCliente || null);
  }, [open, selectedCliente]);

  const prevSucursalRef = useRef(idSucursal);

  useEffect(() => {
    if (prevSucursalRef.current === idSucursal) return;
    setPage(1);
    setHasMore(true);
    setReady(false);
    prevSucursalRef.current = idSucursal;
  }, [idSucursal]);

  const prevSearchRef = useRef(debouncedSearch);

  useEffect(() => {
    if (prevSearchRef.current === debouncedSearch) return;
    setPage(1);
    setHasMore(true);
    setReady(false);
    prevSearchRef.current = debouncedSearch;
  }, [debouncedSearch]);

  const observer = useRef(null);
  useEffect(() => {
    if (!open && observer.current) observer.current.disconnect();
  }, [open]);

  const lastClienteRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  if (open && isLoading && page === 1) return <LoaderComponent />;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      PaperProps={{
        sx: {
          width: { xs: "calc(100vw - 20px)", sm: 640 },
          maxWidth: "calc(100vw - 20px)",
          maxHeight: { xs: "calc(100dvh - 20px)", sm: "calc(100vh - 64px)" },
          display: "flex",
          flexDirection: "column",
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 24px 60px rgba(15, 23, 42, 0.18)"
              : "0 24px 60px rgba(0, 0, 0, 0.42)",
        },
      }}>

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "text.primary",
          px: 2.5,
          py: 2,
        }}>

        <Box display="flex" alignItems="center" gap={1.25} minWidth={0}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: "#0F172A",
              color: theme.palette.common.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <PersonIcon fontSize="small" />
          </Box>
          <Box minWidth={0}>
            <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
              Seleccionar cliente
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Elige el cliente para continuar el pedido
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: alpha("#0F172A", 0.06) },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 1.75, sm: 2.25 },
          pb: { xs: 1.75, sm: 2.25 },
          pt: { xs: 2.25, sm: 2.5 },
          "&&": {
            pt: { xs: 2.25, sm: 2.5 },
          },
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
            gap: { xs: 1, sm: 1.25 },
            alignItems: "center",
            mb: { xs: 1.5, sm: 1.75 },
          }}
        >
          <TextField
            label="Buscar cliente por nombre, teléfono o dirección"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper",
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => {
              onClose();
              navigate("/clientes/crear");
            }}
            sx={{
              borderRadius: 1,
              bgcolor: "#0F172A",
              color: theme.palette.common.white,
              boxShadow: "none",
              fontWeight: 800,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: theme.palette.common.black,
                boxShadow: "none",
              },
            }}>

            Nuevo cliente
          </Button>
        </Box>

        {preSelectedCliente &&
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          p={1.25}
          mb={2}
          sx={{
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === "light"
                ? alpha("#0F172A", 0.06)
                : alpha(theme.palette.common.white, 0.08),
            border: "1px solid",
            borderColor: alpha("#0F172A", 0.16),
          }}>

            <Box display="flex" alignItems="center" gap={1} minWidth={0}>
              <CheckCircleRoundedIcon sx={{ color: ink }} />
              <Typography fontWeight={800} noWrap>
                {preSelectedCliente.nombre}
              </Typography>
            </Box>
            <IconButton
              aria-label="Quitar selección"
              onClick={() => setPreSelectedCliente(null)}
              sx={{
                width: 32,
                height: 32,
                color: theme.palette.error.main,
                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.08) },
              }}>
              <CloseIcon />
            </IconButton>
          </Box>
        }

        <Box
          sx={{
            flex: "1 1 auto",
            height: { xs: "38dvh", sm: 330 },
            minHeight: { xs: 210, sm: 260 },
            maxHeight: { xs: "46dvh", sm: 360 },
            overflowY: "auto",
            p: 0.5,
            pr: 1,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha("#0F172A", 0.18),
              borderRadius: 4,
            }
          }}>

          {items.map((cliente, index) => {
            const selected =
              preSelectedCliente?.id_cliente === cliente.id_cliente;

            return (
              <Box
                key={cliente.id_cliente}
                ref={index === items.length - 1 ? lastClienteRef : null}
                onClick={() => setPreSelectedCliente(cliente)}
                sx={{
                  p: 1.35,
                  mb: 1,
                  cursor: "pointer",
                  borderRadius: 1,
                  backgroundColor: selected
                    ? alpha("#0F172A", 0.065)
                    : theme.palette.background.paper,
                  transition:
                    "background-color 0.16s ease, border-color 0.16s ease",
                  "&:hover": {
                    backgroundColor: selected
                      ? alpha("#0F172A", 0.085)
                      : alpha("#0F172A", 0.035),
                  },
                  border: "1px solid",
                  borderColor: selected ? ink : "divider",
                }}
              >
                <Box display="flex" justifyContent="space-between" gap={1}>
                  <Typography fontWeight={800} noWrap>
                    {cliente.nombre}
                  </Typography>
                  {selected && (
                    <CheckCircleRoundedIcon
                      sx={{ color: ink, fontSize: 20, flex: "0 0 auto" }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "auto 1fr" },
                    gap: { xs: 0.25, sm: 1.5 },
                    mt: 0.75,
                    color: "text.secondary",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                    <PhoneOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" noWrap>
                      {cliente.telefono || "Sin teléfono"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" noWrap>
                      {cliente.direccion || "Sin dirección"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {isFetching &&
          <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={30} />
            </Box>
          }

          {open &&
          ready &&
          !isFetching &&
          !isLoading &&
          isSuccess &&
          items.length === 0 &&
          <Box p={2} textAlign="center" color="text.secondary">
                {isError ? "Error al cargar clientes." : "Sin resultados."}
              </Box>
          }

          {!ready && items.length === 0 &&
          <Box p={2} textAlign="center" color="text.secondary">
              Cargando…
            </Box>
          }
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          flex: "0 0 auto",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 800,
            color: theme.palette.error.main,
            borderColor: alpha(theme.palette.error.main, 0.42),
            "&:hover": {
              borderColor: theme.palette.error.main,
              bgcolor: alpha(theme.palette.error.main, 0.08),
            },
          }}>

          Cancelar
        </Button>
        <Button
          onClick={() => {
            onSelect(preSelectedCliente);
            onClose();
          }}
          variant="contained"
          sx={{
            borderRadius: 1,
            backgroundColor: "#0F172A",
            color: theme.palette.common.white,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "none",
            px: 3,
            "&:hover": {
              backgroundColor: theme.palette.common.black,
              boxShadow: "none",
            },
          }}
          disabled={!preSelectedCliente}>

          Confirmar Cliente
        </Button>
      </DialogActions>
    </Dialog>);

};

PedidoClienteSelector.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCliente: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  idSucursal: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default PedidoClienteSelector;
