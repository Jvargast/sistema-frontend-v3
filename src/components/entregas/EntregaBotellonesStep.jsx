import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

const EntregaBotellonesStep = ({
  productos,
  onChange,
  clienteTrae,
  setClienteTrae,
  detallePedido,
}) => {
  const esperadoPorProducto = useMemo(() => {
    const m = new Map();
    (detallePedido?.detalle || [])
      .filter((d) => d.es_retornable)
      .forEach((d) => m.set(d.id_producto, Number(d.cantidad) || 0));
    return m;
  }, [detallePedido]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!productos) return;
    if (clienteTrae) {
      const base = productos.map((p) => ({
        id_producto: p.id_producto,
        nombre: p.nombre_producto || p.nombre,
        cantidad: 0,
      }));
      setItems(base);
      onChange(
        base.map(({ id_producto, cantidad }) => ({ id_producto, cantidad }))
      );
    } else {
      setItems([]);
      onChange([]);
    }
  }, [clienteTrae, productos, onChange]);

  const actualizarCantidad = (id_producto, valor) => {
    const max = esperadoPorProducto.get(id_producto) ?? Infinity;
    const cantidad = Math.max(0, Math.min(Number(valor) || 0, max));

    const nueva = items.map((it) =>
      it.id_producto === id_producto ? { ...it, cantidad } : it
    );
    setItems(nueva);
    onChange(
      nueva.map(({ id_producto, cantidad }) => ({ id_producto, cantidad }))
    );
  };

  const stepCantidad = (id_producto, delta) => {
    const actual =
      items.find((it) => it.id_producto === id_producto)?.cantidad || 0;
    actualizarCantidad(id_producto, actual + delta);
  };

  const totalRecibidos = items.reduce(
    (s, it) => s + (Number(it.cantidad) || 0),
    0
  );

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6" fontWeight="bold">
        Retornables (se registran como <em>pendiente de inspección</em>)
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={clienteTrae}
            onChange={() => setClienteTrae((prev) => !prev)}
          />
        }
        label="¿Cliente entrega productos retornables?"
      />

      {clienteTrae && (
        <>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Esperado vs Recibido
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {items.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay retornables en este pedido.
              </Typography>
            )}

            {items.map((item) => {
              const esperado = esperadoPorProducto.get(item.id_producto) || 0;
              const minusDisabled = item.cantidad <= 0;
              const plusDisabled = item.cantidad >= esperado;

              return (
                <Grid
                  key={item.id_producto}
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontWeight: 600 }} noWrap>
                      {item.nombre || `Producto ${item.id_producto}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Esperado: {esperado}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={1.5}
                    >
                      <IconButton
                        aria-label={`Disminuir recibidos de ${item.nombre}`}
                        size="large"
                        onClick={() => stepCantidad(item.id_producto, -1)}
                        disabled={minusDisabled}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Remove />
                      </IconButton>

                      <Paper
                        variant="outlined"
                        sx={{
                          px: 2.5,
                          py: 1.2,
                          minWidth: 72,
                          textAlign: "center",
                          fontWeight: 800,
                          fontSize: "1.1rem",
                        }}
                      >
                        {item.cantidad}
                      </Paper>

                      <IconButton
                        aria-label={`Aumentar recibidos de ${item.nombre}`}
                        size="large"
                        onClick={() => stepCantidad(item.id_producto, +1)}
                        disabled={plusDisabled}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        opacity: 0.7,
                      }}
                    >
                      Recibido
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Paper>

          <Typography variant="subtitle2" sx={{ textAlign: "right" }}>
            Total recibidos: <strong>{totalRecibidos}</strong>
          </Typography>
        </>
      )}
    </Box>
  );
};

EntregaBotellonesStep.propTypes = {
  productos: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  clienteTrae: PropTypes.bool.isRequired,
  setClienteTrae: PropTypes.func.isRequired,
  detallePedido: PropTypes.object,
};

export default EntregaBotellonesStep;
