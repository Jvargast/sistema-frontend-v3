import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, CircularProgress, IconButton
} from "@mui/material";
import PropTypes from "prop-types";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import LoaderComponent from "../common/LoaderComponent";

const SelectClienteModal = ({ open, onClose, selectedCliente, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [clientes, setClientes] = useState([]); 
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 

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
      if (page === 1) {
        setClientes(data.clientes);
      } else {
        setClientes((prev) => [...prev, ...data.clientes]);
      }
      setHasMore(data?.paginacion?.totalPages > page);
    }
  }, [data, page]);


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

        {selectedCliente && (
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
            <Box>
              <Typography fontWeight="bold">Cliente Seleccionado</Typography>
              <Typography fontSize="0.9rem" color="textSecondary">
                {clientes.find(c => c.id_cliente === selectedCliente)?.nombre || "Desconocido"}
              </Typography>
            </Box>
            <IconButton onClick={() => onSelect(null)} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ maxHeight: "300px", overflowY: "auto", p: 1 }}>
          {clientes.map((cliente, index) => (
            <Box
              key={cliente.id_cliente}
              ref={index === clientes.length - 1 ? lastClienteRef : null}
              onClick={() => onSelect(cliente.id_cliente)}
              sx={{
                p: 2,
                mb: 1,
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: selectedCliente === cliente.id_cliente ? "#D1E9FF" : "#F9F9F9",
                transition: "background 0.2s",
                "&:hover": { backgroundColor: "#D1E9FF" },
              }}
            >
              <Typography fontWeight="bold">{cliente.nombre}</Typography>
              {cliente.telefono && (
                <Box display="flex" alignItems="center">
                  <PhoneIcon sx={{ fontSize: 16, color: "#4CAF50", mr: 1 }} />
                  <Typography fontSize="0.9rem">{cliente.telefono}</Typography>
                </Box>
              )}
              {cliente.direccion && (
                <Box display="flex" alignItems="center">
                  <HomeIcon sx={{ fontSize: 16, color: "#FF9800", mr: 1 }} />
                  <Typography fontSize="0.9rem">{cliente.direccion}</Typography>
                </Box>
              )}
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
          onClick={() => onClose()} 
          variant="contained" 
          sx={{
            backgroundColor: "#007AFF",
            color: "white",
            fontWeight: "bold",
            px: 3,
            "&:hover": { backgroundColor: "#005BB5" },
          }}
          disabled={!selectedCliente}
        >
          Confirmar Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SelectClienteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCliente: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

export default SelectClienteModal;
