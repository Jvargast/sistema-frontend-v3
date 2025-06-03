import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";

const ResumenLote = ({ productoFinal, cantidadFinal = 0, insumos }) => (
  <Box>
    <Typography variant="h6" fontWeight="bold" mb={2}>
      Resumen de la producción
    </Typography>

    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
      Producto de salida
    </Typography>

    <List dense>
      <ListItem disablePadding>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight={600}>
              {productoFinal || "—"}
            </Typography>
          }
        />
        <ListItemSecondaryAction>
          <Chip
            label={`${cantidadFinal} u.`}
            color="primary"
            sx={{ fontWeight: 700, fontSize: 16 }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>

    <Divider sx={{ my: 2 }} />

    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
      Insumos a consumir
    </Typography>

    <List dense>
      {insumos.map((i) => (
        <ListItem key={i.id} disablePadding>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={500}>
                {i.nombre}
              </Typography>
            }
            secondary={`Requerido: ${i.requerido} ${i.unidad}  —  Stock: ${i.stock}`}
            secondaryTypographyProps={{ component: "span" }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

ResumenLote.propTypes = {
  productoFinal: PropTypes.string.isRequired,
  cantidadFinal: PropTypes.number, 
  insumos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nombre: PropTypes.string,
      requerido: PropTypes.number,
      stock: PropTypes.number,
      unidad: PropTypes.string,
    })
  ).isRequired,
};

export default ResumenLote;
