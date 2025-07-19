import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import LoaderComponent from "../common/LoaderComponent";

const PedidoClienteSelector = ({
  open,
  onClose,
  selectedCliente,
  onSelect,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [preSelectedCliente, setPreSelectedCliente] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetAllClientesQuery({
    page,
    search: searchTerm,
  });

  const observer = useRef();
  const lastClienteRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  useEffect(() => {
    if (data?.clientes) {
      setClientes((prev) =>
        page === 1 ? data.clientes : [...prev, ...data.clientes]
      );
      setHasMore(data?.paginacion?.totalPages > page);
    }
  }, [data, page]);

  useEffect(() => {
    if (!open) return;
    setPreSelectedCliente(selectedCliente || null);
    setPage(1);
    setSearchTerm("");
  }, [open, selectedCliente]);

  useEffect(() => {
    setPage(1);
    refetch();
  }, [searchTerm, refetch]);

  if (isLoading) return <LoaderComponent />;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: "bold",
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          padding: "16px 24px",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon
            sx={{ fontSize: 30, color: theme.palette.primary.contrastText }}
          />{" "}
          Seleccionar Cliente
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box mb={2} display="flex" alignItems="center">
          <SearchIcon sx={{ color: "#666", mr: 1 }} />
          <TextField
            label="Buscar cliente por nombre, teléfono o dirección"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="dense"
            sx={{ "& input": { fontSize: "1rem" } }}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={1} mb={2}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              onClose(); // Cierra el modal antes de redirigir
              navigate("/clientes/crear");
            }}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.dark,
              },
            }}
          >
            Crear nuevo cliente
          </Button>
        </Box>

        {preSelectedCliente && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            mb={2}
            borderRadius="8px"
            sx={{
              backgroundColor: theme.palette.primary.light,
              border: `1px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography fontWeight="bold">
              Cliente Seleccionado: {preSelectedCliente.nombre}
            </Typography>
            <IconButton
              onClick={() => setPreSelectedCliente(null)}
              color="error"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            p: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cfd8dc",
              borderRadius: "4px",
            },
          }}
        >
          {clientes.map((cliente, index) => (
            <Box
              key={cliente.id_cliente}
              ref={index === clientes.length - 1 ? lastClienteRef : null}
              onClick={() => setPreSelectedCliente(cliente)}
              sx={{
                p: 2,
                mb: 1,
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor:
                  preSelectedCliente?.id_cliente === cliente.id_cliente
                    ? theme.palette.action.selected
                    : theme.palette.background.default,
                transition: "background 0.2s",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                border:
                  preSelectedCliente?.id_cliente === cliente.id_cliente
                    ? `1.5px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography fontWeight="bold">{cliente.nombre}</Typography>
              <Typography fontSize="0.9rem" color="textSecondary">
                {cliente.telefono} | {cliente.direccion}
              </Typography>
            </Box>
          ))}

          {isFetching && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={30} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#FF5252",
            color: "white",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#D32F2F" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onSelect(preSelectedCliente);
            requestAnimationFrame(() => {
              document.body.focus(); 
            });
            onClose();
          }}
          variant="contained"
          sx={{
            backgroundColor: "#007AFF",
            color: "white",
            fontWeight: "bold",
            px: 3,
            "&:hover": { backgroundColor: "#005BB5" },
          }}
          disabled={!preSelectedCliente}
        >
          Confirmar Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PedidoClienteSelector.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCliente: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

export default PedidoClienteSelector;
