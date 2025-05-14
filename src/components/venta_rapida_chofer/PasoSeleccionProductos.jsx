import {
  Box,
  Typography,
  Stack,
  IconButton,
  TextField,
  Paper,
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

  const getCantidadSeleccionada = (id_producto) =>
    productosSeleccionados.find((p) => p.id_producto === id_producto)
      ?.cantidad || 0;

  const getPrecioUnitario = (producto) =>
    productosSeleccionados.find((p) => p.id_producto === producto.id_producto)
      ?.precioUnitario ?? producto.precio;

  const getSubtotal = (producto) => {
    const cantidad = getCantidadSeleccionada(producto.id_producto);
    const precio = getPrecioUnitario(producto);
    return cantidad * precio;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Selección de Productos
      </Typography>

      {isLoading ? (
        <Typography>Cargando productos disponibles...</Typography>
      ) : inventario.length === 0 ? (
        <Typography>No hay productos disponibles en el camión.</Typography>
      ) : (
        <Stack spacing={2}>
          {inventario.map((producto) => {
            const cantidad = getCantidadSeleccionada(producto.id_producto);
            const precioActual = getPrecioUnitario(producto);
            const precioOriginal = producto.precio;
            const precioModificado = precioActual !== precioOriginal;

            return (
              <Paper
                key={producto.id_producto}
                elevation={1}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {producto.nombre_producto} ({producto.cantidad}{" "}
                      disponibles)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal: ${getSubtotal(producto).toLocaleString("es-CL")}
                    </Typography>
                    {precioModificado && (
                      <Typography
                        variant="caption"
                        color="warning.main"
                        sx={{ mt: 0.5 }}
                      >
                        ⚠️ Precio modificado (original: $
                        {Math.round(precioOriginal).toLocaleString("es-CL")})
                      </Typography>
                    )}
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* Botón RESTAR con rojo sutil */}
                    <IconButton
                      size="small"
                      onClick={() => actualizarCantidad(producto, -1)}
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "grey.100",
                        color: "error.main",
                        border: "1px solid",
                        borderColor: "grey.300",
                        "&:hover": {
                          backgroundColor: "grey.200",
                        },
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    {/* Campo de cantidad */}
                    <TextField
                      size="small"
                      value={cantidad}
                      inputProps={{
                        readOnly: true,
                        style: {
                          width: 35,
                          textAlign: "center",
                          fontWeight: "bold",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          px: 1,
                          py: 0.5,
                          backgroundColor: "white",
                          fontSize: "1rem",
                        },
                      }}
                    />

                    {/* Botón SUMAR con azul sutil */}
                    <IconButton
                      size="small"
                      onClick={() => actualizarCantidad(producto, 1)}
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "grey.100",
                        color: "primary.main",
                        border: "1px solid",
                        borderColor: "grey.300",
                        "&:hover": {
                          backgroundColor: "grey.200",
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <TextField
                    label="Precio unitario"
                    type="text"
                    size="small"
                    value={`$${Number(precioActual).toLocaleString("es-CL")}`}
                    onChange={(e) => {
                      const soloNumeros = e.target.value.replace(/\D/g, "");
                      actualizarPrecio(producto, Number(soloNumeros));
                    }}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    sx={{
                      width: 140,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "white",
                      },
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Paper>
            );
          })}
        </Stack>
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
