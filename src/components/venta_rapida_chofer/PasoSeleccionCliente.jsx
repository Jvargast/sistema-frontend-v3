import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import ModalCrearClienteRapido from "./ModalCrearClienteRapido";

const PasoSeleccionCliente = ({
  clienteSeleccionado,
  setClienteSeleccionado,
}) => {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState([]);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const { data: clientes, isLoading } = useGetAllClientesQuery();

  useEffect(() => {
    if (clientes?.clientes) {
      const texto = search.toLowerCase();
      const filtrados = clientes.clientes
        .filter((c) => c.tipo_cliente !== "empresa")
        .filter((c) => {
          const nombre = c.nombre?.toLowerCase() || "";
          const rut = c.rut?.toLowerCase() || "";
          return nombre.includes(texto) || rut.includes(texto);
        });
      setFiltro(filtrados);
    }
  }, [search, clientes]);

  const handleSeleccion = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleClienteCreado = (nuevoCliente) => {
    setClienteSeleccionado(nuevoCliente);
    setSearch("");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Selecciona un Cliente
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}>
          <TextField
            label="Buscar por nombre o RUT"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setModalCrearOpen(true)}
          >
            + Nuevo
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          <List dense disablePadding>
            {filtro.map((cliente) => (
              <ListItem disablePadding key={cliente.id_cliente}>
                <ListItemButton
                  selected={
                    clienteSeleccionado?.id_cliente === cliente.id_cliente
                  }
                  onClick={() => handleSeleccion(cliente)}
                >
                  <ListItemText
                    primary={cliente.nombre}
                    secondary={`RUT: ${cliente.rut || "No especificado"}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {clienteSeleccionado && (
        <Box mt={2}>
          <Typography variant="body2" fontWeight="medium">
            Cliente seleccionado: <strong>{clienteSeleccionado.nombre}</strong>
          </Typography>
        </Box>
      )}

      {/* Modal para crear cliente rápido */}
      <ModalCrearClienteRapido
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onClienteCreado={handleClienteCreado}
      />
    </Box>
  );
};

PasoSeleccionCliente.propTypes = {
  clienteSeleccionado: PropTypes.object,
  setClienteSeleccionado: PropTypes.func.isRequired,
};

export default PasoSeleccionCliente;
