import { Box, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import ChoferColumn from "./ChoferColumn";
import InventarioCamion from "../inventario/InventarioCamion";
import { useGetPedidosAsignadosQuery } from "../../store/services/pedidosApi";

const PanelPedidos = ({ idChofer }) => {
  if (!idChofer) return null; // ✅ No mostrar nada si no hay chofer seleccionado

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Pedidos del Chofer {idChofer}
      </Typography>
      <PedidosEInventario idChofer={idChofer} />
    </Box>
  );
};

// 📌 Subcomponente que obtiene pedidos e inventario del chofer seleccionado
const PedidosEInventario = ({ idChofer }) => {
  const {
    data: pedidos,
    isLoading,
    error,
  } = useGetPedidosAsignadosQuery(idChofer);

  if (isLoading) return <Typography>Cargando pedidos...</Typography>;
  if (error)
    return <Typography color="error">Error al obtener pedidos</Typography>;

  return (
    <Grid container spacing={3} mt={3}>
      <Grid item xs={9}>
        <ChoferColumn idChofer={idChofer} pedidos={pedidos} />
      </Grid>
      <Grid item xs={3}>
        <InventarioCamion idChofer={idChofer} />
      </Grid>
    </Grid>
  );
};

PanelPedidos.propTypes = {
  idChofer: PropTypes.string,
};

PedidosEInventario.propTypes = {
  idChofer: PropTypes.string.isRequired,
};

export default PanelPedidos;
