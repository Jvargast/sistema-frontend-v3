import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PropTypes from "prop-types";

const InventarioCargado = ({ inventario, isLoading }) => {
  if (isLoading) return <Typography>Cargando inventario...</Typography>;
  if (!inventario) return <Typography>Inventario no disponible</Typography>;

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
          📦 Inventario Actual del Camión
        </Typography>
        <List disablePadding>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Capacidad Total"
              secondary={`${inventario.capacidad_total} unidades`}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Disponible para venta"
              secondary={`${inventario.disponible} unidades`}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Reservados para entregas"
              secondary={`${inventario.reservados} unidades`}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="En retorno"
              secondary={`${inventario.retorno} unidades`}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

InventarioCargado.propTypes = {
  inventario: PropTypes.shape({
    capacidad_total: PropTypes.number,
    disponible: PropTypes.number,
    reservados: PropTypes.number,
    retorno: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
};

export default InventarioCargado;
