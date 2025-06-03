import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Button,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import SelectorInsumo from "./SelectorInsumo";

const ListaInsumos = ({ insumos, setInsumos }) => {
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const agregarInsumo = () => {
    if (insumoSeleccionado && cantidad > 0) {
      setInsumos([
        ...insumos,
        {
          ...insumoSeleccionado,
          cantidad,
          unidad_medida: insumoSeleccionado.unidad_de_medida,
        },
      ]);
      setInsumoSeleccionado(null);
      setCantidad(1);
    }
  };

  const eliminarInsumo = (id) => {
    setInsumos(insumos.filter((insumo) => insumo.id_insumo !== id));
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🔧 Insumos
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
          >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <SelectorInsumo
                label="Selecciona Insumo"
                onInsumoSeleccionado={setInsumoSeleccionado}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={agregarInsumo}
              disabled={!insumoSeleccionado}
              sx={{
                px: 4,
                height: 40,
                fontWeight: "bold",
                borderRadius: 2,
                whiteSpace: "nowrap",
              }}
            >
              Añadir
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="flex-start"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setCantidad((prev) => (prev > 1 ? prev - 1 : 1))}
              sx={{ minWidth: 40, minHeight: 40, borderRadius: "50%" }}
            >
              −
            </Button>

            <TextField
              type="number"
              value={cantidad}
              onChange={(e) => {
                const val = Number(e.target.value);
                const max = insumoSeleccionado?.stock || 9999;
                setCantidad(val < 1 ? 1 : val > max ? max : val);
              }}
              inputProps={{
                min: 1,
                max: insumoSeleccionado?.stock || 9999,
                style: { textAlign: "center" },
              }}
              sx={{
                width: 80,
                "& .MuiInputBase-input": { textAlign: "center" },
              }}
              size="small"
            />

            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                const max = insumoSeleccionado?.stock || 9999;
                setCantidad((prev) => (prev < max ? prev + 1 : max));
              }}
              sx={{ minWidth: 40, minHeight: 40, borderRadius: "50%" }}
            >
              +
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            gap={1}
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            {[10, 50, 100].map((quickAdd, idx) => {
              const colors = ["info", "success", "warning"];
              return (
                <Button
                  key={quickAdd}
                  variant="contained"
                  color={colors[idx % colors.length]}
                  size="small"
                  onClick={() => {
                    const max = insumoSeleccionado?.stock || 9999;
                    setCantidad((prev) =>
                      prev + quickAdd <= max ? prev + quickAdd : max
                    );
                  }}
                  disabled={!insumoSeleccionado}
                  sx={{
                    minWidth: 70,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                  }}
                >
                  +{quickAdd}
                </Button>
              );
            })}
          </Box>
        </Grid>
      </Grid>

      <Box mt={3} display="grid" gap={2}>
        {insumos.length === 0 ? (
          <Typography color="text.secondary" fontStyle="italic">
            No has agregado insumos aún.
          </Typography>
        ) : (
          insumos.map((insumo) => (
            <Paper
              key={insumo.id_insumo}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                backgroundColor: "background.paper",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.01)",
                },
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {insumo.nombre_insumo}
                </Typography>
                <Chip
                  label={`Cantidad: ${insumo.cantidad}`}
                  size="small"
                  color="primary"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <IconButton
                color="error"
                onClick={() => eliminarInsumo(insumo.id_insumo)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

ListaInsumos.propTypes = {
  insumos: PropTypes.array.isRequired,
  setInsumos: PropTypes.func.isRequired,
};

export default ListaInsumos;
