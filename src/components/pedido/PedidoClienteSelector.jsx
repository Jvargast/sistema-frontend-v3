import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, CircularProgress, IconButton
} from "@mui/material";
import PropTypes from "prop-types";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import LoaderComponent from "../common/LoaderComponent";

const PedidoClienteSelector = ({ open, onClose, selectedCliente, onSelect }) => {
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
  const lastClienteRef = useCallback((node) => {
    if (isFetching || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1); 
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetching, hasMore]);


  

  useEffect(() => {
    if (data?.clientes) {
      setClientes((prev) => (page === 1 ? data.clientes : [...prev, ...data.clientes]));
      setHasMore(data?.paginacion?.totalPages > page);
    }
  }, [data, page]);

  useEffect(() => {
    if (!open) return;
  
    // Reinicia selección al abrir el modal
    setPreSelectedCliente(selectedCliente || null);
    setPage(1); // Reinicia la paginación también
    setSearchTerm(""); // Opcional: limpiar búsqueda al abrir
  }, [open, selectedCliente]);

  useEffect(() => {
    setPage(1);
    refetch();
  }, [searchTerm, refetch]);

  if (isLoading) return <LoaderComponent />;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          fontWeight: "bold",
          background: "linear-gradient(90deg, #4A90E2 0%, #0052D4 100%)",
          color: "white",
          padding: "16px 24px"
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon sx={{ fontSize: 30 }} /> Seleccionar Cliente
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

        {preSelectedCliente && (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            p={2} 
            mb={2}
            borderRadius="8px"
            sx={{ 
              backgroundColor: "#D1E9FF", 
              border: "1px solid #4A90E2",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
            }}
          >
            <Typography fontWeight="bold">
              Cliente Seleccionado: {preSelectedCliente.nombre}
            </Typography>
            <IconButton onClick={() => setPreSelectedCliente(null)} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ maxHeight: "300px", overflowY: "auto", p: 1 }}>
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
                backgroundColor: preSelectedCliente?.id_cliente === cliente.id_cliente ? "#D1E9FF" : "#F9F9F9",
                transition: "background 0.2s",
                "&:hover": { backgroundColor: "#D1E9FF" },
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
