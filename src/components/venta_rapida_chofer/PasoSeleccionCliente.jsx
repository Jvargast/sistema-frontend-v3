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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import ModalCrearClienteRapido from "./ModalCrearClienteRapido";

const PasoSeleccionCliente = ({
  clienteSeleccionado,
  setClienteSeleccionado,
  idChofer,
  idSucursal,
  allowSinCliente = false,
  ventaSinCliente = false,
  setVentaSinCliente,
}) => {
  const [search, setSearch] = useState("");
  const [modalCrearOpen, setModalCrearOpen] = useState(false);

  const args = useMemo(() => {
    const p = { page: 1, limit: 50, activo: true };
    if (idSucursal != null && idSucursal !== "") {
      const n = Number(idSucursal);
      if (!Number.isNaN(n) && n > 0) p.id_sucursal = n;
    }
    if (idChofer && idChofer.trim()) {
      p.creado_por = idChofer.trim();
    }
    return p;
  }, [idChofer, idSucursal]);

  const shouldSkip = ventaSinCliente;

  const { data: clientesResp, isLoading } = useGetAllClientesQuery(args, {
    skip: shouldSkip,
    refetchOnMountOrArgChange: true,
    keepUnusedDataFor: 30,
  });

  const clientesArr = useMemo(() => {
    if (!clientesResp) return [];
    if (Array.isArray(clientesResp?.data)) return clientesResp.data;
    if (Array.isArray(clientesResp?.data?.rows)) return clientesResp.data.rows;
    if (Array.isArray(clientesResp?.clientes)) return clientesResp.clientes;
    if (Array.isArray(clientesResp)) return clientesResp;
    return [];
  }, [clientesResp]);

  const filtro = useMemo(() => {
    const texto = search.toLowerCase();
    return clientesArr
      .filter((c) => c.tipo_cliente !== "empresa")
      .filter((c) => {
        const nombre = c.nombre?.toLowerCase() || "";
        const rut = c.rut?.toLowerCase() || "";
        return nombre.includes(texto) || rut.includes(texto);
      });
  }, [search, clientesArr]);

  const handleSeleccion = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleClienteCreado = (nuevoCliente) => {
    setClienteSeleccionado(nuevoCliente);
    setSearch("");
  };

  return (
    <Box>
      {allowSinCliente && (
        <FormControlLabel
          control={
            <Switch
              checked={ventaSinCliente}
              onChange={(e) => {
                const checked = e.target.checked;
                setVentaSinCliente(checked);
                if (checked) setClienteSeleccionado(null);
              }}
            />
          }
          label="Venta sin cliente"
          sx={{ mb: 1 }}
        />
      )}

      {!ventaSinCliente && (
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Selecciona un Cliente
        </Typography>
      )}

      {!ventaSinCliente && (
        <>
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
                Cliente seleccionado:{" "}
                <strong>{clienteSeleccionado.nombre}</strong>
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Modal para crear cliente rápido */}
      <ModalCrearClienteRapido
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onClienteCreado={handleClienteCreado}
        defaultSucursalId={idSucursal}
      />
    </Box>
  );
};

PasoSeleccionCliente.propTypes = {
  clienteSeleccionado: PropTypes.object,
  setClienteSeleccionado: PropTypes.func.isRequired,
  idChofer: PropTypes.string,
  idSucursal: PropTypes.number,
  allowSinCliente: PropTypes.bool,
  ventaSinCliente: PropTypes.bool,
  setVentaSinCliente: PropTypes.func,
};

export default PasoSeleccionCliente;
