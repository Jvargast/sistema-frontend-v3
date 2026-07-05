import { List, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const PasoRetornables = ({
  productosSeleccionados,
  retornablesRecibidos,
  setRetornablesRecibidos,
}) => {
  const retornablesPosibles = productosSeleccionados.filter(
    (prod) => prod.es_retornable !== false
  );

  const getCantidadVendida = (producto) => {
    const cantidad = Number(producto?.cantidad);
    return Number.isFinite(cantidad) ? Math.max(0, cantidad) : 0;
  };

  const getCantidadRetornada = (producto) => {
    const cantidadGuardada =
      retornablesRecibidos.find((r) => r.id_producto === producto.id_producto)
        ?.cantidad || 0;
    return Math.min(Number(cantidadGuardada) || 0, getCantidadVendida(producto));
  };

  const actualizarCantidadRetorno = (producto, cambio) => {
    const cantidadVendida = getCantidadVendida(producto);
    const cantidadActual = getCantidadRetornada(producto);
    const nuevaCantidad = Math.min(
      cantidadVendida,
      Math.max(0, cantidadActual + cambio)
    );
    if (nuevaCantidad === cantidadActual) return;

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
              {retornablesPosibles.map((producto) => {
                const cantidadVendida = getCantidadVendida(producto);
                const cantidadRetornada = getCantidadRetornada(producto);
                const sinRetorno = cantidadVendida <= 0;
                const estaEnMaximo = cantidadRetornada >= cantidadVendida;

                return (
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
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {producto.nombre_producto}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Máximo permitido: {cantidadVendida} vendidos
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() => actualizarCantidadRetorno(producto, -1)}
                        size="small"
                        disabled={cantidadRetornada <= 0}
                        sx={{
                          borderRadius: "50%",
                          backgroundColor: "grey.100",
                          color: "error.main",
                          "&.Mui-disabled": {
                            color: "text.disabled",
                          },
                          "&:hover": {
                            backgroundColor: "grey.200",
                          },
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <TextField
                        size="small"
                        value={cantidadRetornada}
                        inputProps={{
                          readOnly: true,
                          "aria-label": `Botellones retornados de ${producto.nombre_producto}`,
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
                            backgroundColor: (theme) =>
                              theme.palette.background.paper,
                          },
                        }}
                      />
                      <IconButton
                        onClick={() => actualizarCantidadRetorno(producto, 1)}
                        size="small"
                        disabled={sinRetorno || estaEnMaximo}
                        sx={(theme) => ({
                          borderRadius: "50%",
                          backgroundColor: theme.palette.background.paper,
                          color: "#0F172A",
                          border: "1px solid",
                          borderColor: alpha("#0F172A", 0.28),
                          "&.Mui-disabled": {
                            color: theme.palette.text.disabled,
                            borderColor: theme.palette.divider,
                          },
                          "&:hover": {
                            backgroundColor: alpha("#0F172A", 0.06),
                            borderColor: "#0F172A",
                          },
                        })}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
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
