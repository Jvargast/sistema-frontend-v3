import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Grid,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const EntregaBotellonesStep = ({
  productos,
  onChange,
  clienteTrae,
  setClienteTrae,
  detallePedido,
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (clienteTrae) {
      // Solo setear si el arreglo está vacío (primera vez)
      if (items.length === 0) {
        const inicial = productos.map((p) => ({
          id_producto: p.id_producto,
          nombre_producto: p.nombre_producto || p.nombre,
          cantidad: 1,
          estado: "reutilizable",
          tipo_defecto: "",
        }));
        setItems(inicial);
        onChange(inicial);
      }
    } else if (items.length > 0) {
      setItems([]);
      onChange([]);
    }
  }, [clienteTrae, productos]); // 🔁 quitamos 'items' y 'onChange' para evitar loops innecesarios

  const actualizarItem = (index, campo, valor) => {
    const copia = [...items];
    copia[index][campo] = valor;

    if (campo === "estado" && valor === "reutilizable") {
      copia[index]["tipo_defecto"] = "";
    }

    setItems(copia);
    onChange(copia);
  };

  const agregarProducto = () => {
    setItems([
      ...items,
      {
        id_producto: "",
        cantidad: 1,
        estado: "reutilizable",
        tipo_defecto: "",
      },
    ]);
  };

  const eliminarProducto = (index) => {
    const nuevaLista = items.filter((_, i) => i !== index);
    setItems(nuevaLista);
    onChange(nuevaLista);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6" fontWeight="bold">
        Productos Retornables
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

      {clienteTrae && detallePedido?.detalle && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            backgroundColor: "#F0F4FF",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Comparación de Retornables Esperados vs Recibidos
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {productos.map((prod) => {
            const esperado =
              detallePedido.detalle.find(
                (d) => d.id_producto === prod.id_producto
              )?.cantidad || 0;

            const recibido =
              items.find((i) => i.id_producto === prod.id_producto)?.cantidad ||
              0;

            return (
              <Typography
                key={prod.id_producto}
                fontSize="0.95rem"
                sx={{ mb: 0.5 }}
              >
                <strong>{prod.nombre_producto || prod.nombre}</strong> —
                Esperado: <span style={{ color: "#1565c0" }}>{esperado}</span> |
                Recibido:{" "}
                <span
                  style={{
                    color: recibido < esperado ? "#e65100" : "#2e7d32",
                    fontWeight: "bold",
                  }}
                >
                  {recibido}
                </span>
              </Typography>
            );
          })}
        </Paper>
      )}

      {clienteTrae &&
        items.map((item, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            alignItems="center"
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#F4F6F8",
            }}
          >
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                value={item.id_producto}
                onChange={(e) =>
                  actualizarItem(index, "id_producto", e.target.value)
                }
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Seleccione producto
                </MenuItem>
                {productos.map((prod) => (
                  <MenuItem key={prod.id_producto} value={prod.id_producto}>
                    {prod.nombre_producto || prod.nombre}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                type="number"
                label="Cantidad"
                value={item.cantidad}
                inputProps={{
                  min: 0,
                  max:
                    detallePedido?.detalle.find(
                      (d) => d.id_producto === item.id_producto
                    )?.cantidad || 1,
                }}
                onChange={(e) => {
                  const cantidad = parseInt(e.target.value) || 0;
                  const maxCantidad =
                    detallePedido?.detalle.find(
                      (d) => d.id_producto === item.id_producto
                    )?.cantidad || Infinity;
                  actualizarItem(
                    index,
                    "cantidad",
                    Math.min(cantidad, maxCantidad)
                  );
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <Select
                value={item.estado}
                onChange={(e) =>
                  actualizarItem(index, "estado", e.target.value)
                }
                fullWidth
              >
                <MenuItem value="reutilizable">♻️ Reutilizable</MenuItem>
                <MenuItem value="defectuoso">⚠️ Defectuoso</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              {item.estado === "defectuoso" && (
                <TextField
                  label="Tipo defecto"
                  value={item.tipo_defecto}
                  onChange={(e) =>
                    actualizarItem(index, "tipo_defecto", e.target.value)
                  }
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton onClick={() => eliminarProducto(index)} color="error">
                <DeleteOutline />
              </IconButton>
            </Grid>
          </Grid>
        ))}

      {clienteTrae && (
        <Button
          onClick={agregarProducto}
          variant="outlined"
          startIcon={<AddCircleOutline />}
        >
          Agregar otro producto
        </Button>
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
