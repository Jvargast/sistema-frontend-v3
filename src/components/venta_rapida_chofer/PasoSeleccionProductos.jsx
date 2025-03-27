import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";
import { useGetInventarioDisponibleQuery } from "../../store/services/inventarioCamionApi";

const PasoSeleccionProductos = ({
  idCamion,
  productosSeleccionados,
  setProductosSeleccionados,
}) => {
  const { data, isLoading } = useGetInventarioDisponibleQuery(idCamion);
  const inventario = data?.data || [];

  const actualizarCantidad = (producto, cambio) => {
    const existente = productosSeleccionados.find(
      (p) => p.id_producto === producto.id_producto
    );
    const nuevaCantidad = (existente?.cantidad || 0) + cambio;

    if (nuevaCantidad < 0 || nuevaCantidad > producto.cantidad) return;

    const nuevos = productosSeleccionados.filter(
      (p) => p.id_producto !== producto.id_producto
    );

    if (nuevaCantidad > 0) {
      nuevos.push({
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        precioUnitario: existente?.precioUnitario ?? producto.precio,
        cantidad: nuevaCantidad,
        es_retornable: producto.es_retornable,
      });
    }

    setProductosSeleccionados(nuevos);
  };

  const actualizarPrecio = (producto, nuevoPrecio) => {
    const existente = productosSeleccionados.find(
      (p) => p.id_producto === producto.id_producto
    );
    const cantidad = existente?.cantidad || 1;

    const nuevos = productosSeleccionados.filter(
      (p) => p.id_producto !== producto.id_producto
    );

    nuevos.push({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precioUnitario: nuevoPrecio,
      cantidad,
      es_retornable: producto.es_retornable,
    });

    setProductosSeleccionados(nuevos);
  };

  const getCantidadSeleccionada = (id_producto) => {
    return (
      productosSeleccionados.find((p) => p.id_producto === id_producto)
        ?.cantidad || 0
    );
  };

  const getPrecioUnitario = (producto) => {
    return (
      productosSeleccionados.find((p) => p.id_producto === producto.id_producto)
        ?.precioUnitario ?? producto.precio
    );
  };

  const getSubtotal = (producto) => {
    const cantidad = getCantidadSeleccionada(producto.id_producto);
    const precio = getPrecioUnitario(producto);
    return cantidad * precio;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Selección de Productos
      </Typography>

      {isLoading ? (
        <Typography>Cargando productos disponibles...</Typography>
      ) : inventario.length === 0 ? (
        <Typography>No hay productos disponibles en el camión.</Typography>
      ) : (
        <List>
          {inventario.map((producto) => {
            const cantidad = getCantidadSeleccionada(producto.id_producto);
            const precioActual = getPrecioUnitario(producto);
            const precioOriginal = producto.precio;
            const precioModificado = precioActual !== precioOriginal;

            return (
              <ListItem
                key={producto.id_producto}
                alignItems="flex-start"
                divider
              >
                <ListItemText
                  primary={`${producto.nombre_producto} (${producto.cantidad} disponibles)`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        Subtotal: $
                        {getSubtotal(producto).toLocaleString("es-CL")}
                      </Typography>
                      {precioModificado && (
                        <Typography variant="caption" color="warning.main">
                          ⚠️ Precio modificado (original: $
                          {precioOriginal.toLocaleString("es-CL")})
                        </Typography>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Stack spacing={1} alignItems="center">
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        onClick={() => actualizarCantidad(producto, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={cantidad}
                        inputProps={{
                          readOnly: true,
                          style: { width: 30, textAlign: "center" },
                        }}
                      />
                      <IconButton
                        onClick={() => actualizarCantidad(producto, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>

                    <TextField
                      label="Precio unitario"
                      type="number"
                      size="small"
                      value={precioActual}
                      onChange={(e) =>
                        actualizarPrecio(producto, Number(e.target.value))
                      }
                      inputProps={{ min: 0 }}
                      sx={{ width: 120 }}
                    />
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

PasoSeleccionProductos.propTypes = {
  idCamion: PropTypes.number.isRequired,
  productosSeleccionados: PropTypes.array.isRequired,
  setProductosSeleccionados: PropTypes.func.isRequired,
};

export default PasoSeleccionProductos;
