import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";

const PasoRetornables = ({
  productosSeleccionados,
  retornablesRecibidos,
  setRetornablesRecibidos,
}) => {
  const retornablesPosibles = productosSeleccionados.filter(
    (prod) => prod.es_retornable !== false
  );

  const actualizarCantidadRetorno = (producto, cambio) => {
    const existente = retornablesRecibidos.find(
      (r) => r.id_producto === producto.id_producto
    );

    const nuevaCantidad = (existente?.cantidad || 0) + cambio;
    if (nuevaCantidad < 0) return;

    const nuevos = retornablesRecibidos.filter(
      (r) => r.id_producto !== producto.id_producto
    );

    if (nuevaCantidad > 0) {
      nuevos.push({
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        cantidad: nuevaCantidad,
      });
    }

    setRetornablesRecibidos(nuevos);
  };

  const getCantidadRetornada = (id_producto) => {
    return (
      retornablesRecibidos.find((r) => r.id_producto === id_producto)
        ?.cantidad || 0
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Registro de Botellones Retornados
      </Typography>

      {retornablesPosibles.length === 0 ? (
        <Typography>No hay productos retornables en esta venta.</Typography>
      ) : (
        <List>
          {retornablesPosibles.map((producto) => (
            <ListItem key={producto.id_producto}>
              <ListItemText
                primary={producto.nombre_producto}
                secondary="Cantidad retornada por el cliente"
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => actualizarCantidadRetorno(producto, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  size="small"
                  value={getCantidadRetornada(producto.id_producto)}
                  inputProps={{
                    readOnly: true,
                    style: { width: 30, textAlign: "center" },
                  }}
                />
                <IconButton
                  onClick={() => actualizarCantidadRetorno(producto, 1)}
                >
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

PasoRetornables.propTypes = {
  productosSeleccionados: PropTypes.array.isRequired,
  retornablesRecibidos: PropTypes.array.isRequired,
  setRetornablesRecibidos: PropTypes.func.isRequired,
};

export default PasoRetornables;
