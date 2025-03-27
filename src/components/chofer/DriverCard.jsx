import PropTypes from "prop-types";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

// Tarjeta individual para cada chofer
const DriverCard = ({ driver, isSelected, onSelect }) => {
  return (
    <Card
      sx={{
        border: isSelected ? "2px solid #1976d2" : "1px solid #ccc",
        boxShadow: isSelected ? 6 : 1,
        transition: "all 0.3s",
      }}
    >
      <CardActionArea onClick={() => onSelect(driver)}>
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Avatar
            src={driver.fotoUrl}
            alt={driver.nombre}
            sx={{ width: 56, height: 56, mb: 1 }}
          />
          <CardContent sx={{ textAlign: "center", p: 0 }}>
            <Typography variant="h6">{driver.nombre}</Typography>
            {/* Si no cuentas con pedidos o inventario en el objeto, puedes omitir o mostrar valores predeterminados */}
            <Typography variant="body2">
              Pedidos: {driver.pedidosCount || 0}
            </Typography>
            <Typography variant="body2">
              Inventario: {driver.inventarioResumen || "Sin datos"}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

DriverCard.propTypes = {
  driver: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

// Componente para mostrar la lista de choferes en forma de cuadrícula
const DriverSelector = ({ drivers, selectedChofer, onSelectDriver }) => {
  return (
    <Box mb={3}>
      <Typography variant="h5" mb={2}>
        Selecciona un Chofer
      </Typography>
      <Grid container spacing={2}>
        {drivers.map((driver) => (
          <Grid item xs={12} sm={6} md={4} key={driver.rut}>
            <DriverCard
              driver={driver}
              isSelected={selectedChofer && selectedChofer.rut === driver.rut}
              onSelect={onSelectDriver}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

DriverSelector.propTypes = {
  drivers: PropTypes.array.isRequired,
  selectedChofer: PropTypes.object,
  onSelectDriver: PropTypes.func.isRequired,
};

export default DriverSelector;
