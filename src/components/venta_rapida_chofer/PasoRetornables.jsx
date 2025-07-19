import { Box, Typography, List, IconButton, TextField } from "@mui/material";
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

  const botellonesEsperados = productosSeleccionados
    .filter((prod) => prod.es_retornable !== false)
    .reduce((total, prod) => total + prod.cantidad, 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Registro de Botellones Retornados
      </Typography>

      {retornablesPosibles.length === 0 ? (
        <Typography>No hay productos retornables en esta venta.</Typography>
      ) : (
        <>
          <Typography
            variant="body2"
            sx={{ mb: 2, fontStyle: "italic", color: "text.secondary" }}
          >
            Botellones esperados: <strong>{botellonesEsperados}</strong>
          </Typography>

          <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {retornablesPosibles.map((producto) => (
                <Box
                  key={producto.id_producto}
                  sx={{
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: (theme) => theme.palette.background.paper,
                    boxShadow: 1,
                  }}
                >
                  {/* Información del producto */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {producto.nombre_producto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cantidad retornada por el cliente
                    </Typography>
                  </Box>

                  {/* Controles de cantidad */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      onClick={() => actualizarCantidadRetorno(producto, -1)}
                      size="small"
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "grey.100",
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "grey.200",
                        },
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <TextField
                      size="small"
                      value={getCantidadRetornada(producto.id_producto)}
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
                          fontSize: "1rem",
                          px: 1,
                          py: 0.5,
                           backgroundColor: (theme) => theme.palette.background.paper,
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => actualizarCantidadRetorno(producto, 1)}
                      size="small"
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "grey.100",
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "grey.200",
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </List>
        </>
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
