import {
  Box,
  TextField,
  IconButton,
  Typography,
  Tooltip,
  Divider,
  Paper,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import PropTypes from "prop-types";

const DefectosList = ({ fallas, onChange, maxCantidad }) => {
  const total = fallas.reduce((sum, f) => sum + (f.cantidad || 0), 0);
  const restante = maxCantidad - total;

  const updateFalla = (idx, field, value) => {
    const nuevaLista = [...fallas];
    nuevaLista[idx][field] = field === "cantidad" ? Number(value) : value;
    onChange(nuevaLista);
  };

  const addFalla = () => {
    onChange([...fallas, { cantidad: 0, tipo_defecto: "" }]);
  };

  const removeFalla = (idx) => {
    const nuevaLista = fallas.filter((_, i) => i !== idx);
    onChange(nuevaLista);
  };

  return (
    <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      {fallas.map((f, idx) => (
        <Paper
          key={idx}
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              label="Cantidad"
              type="number"
              inputProps={{ min: 0, max: maxCantidad }}
              value={f.cantidad}
              onChange={(e) =>
                updateFalla(idx, "cantidad", e.target.value || 0)
              }
              size="small"
              sx={{ width: 100 }}
            />
            <TextField
              label="Tipo de defecto"
              value={f.tipo_defecto}
              onChange={(e) => updateFalla(idx, "tipo_defecto", e.target.value)}
              size="small"
              fullWidth
            />
            <Tooltip title="Eliminar este defecto">
              <IconButton onClick={() => removeFalla(idx)} color="error">
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip
          title={
            restante <= 0
              ? "Sin unidades restantes para asignar"
              : "Agregar nuevo tipo de defecto"
          }
        >
          <span>
            <IconButton
              onClick={addFalla}
              disabled={restante <= 0}
              color="primary"
            >
              <AddCircleOutline />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          Unidades restantes:{" "}
          <strong style={{ color: restante < 0 ? "red" : "#2e7d32" }}>
            {restante}
          </strong>
        </Typography>
      </Box>

      {restante < 0 && (
        <Typography color="error" fontSize={13} mt={-1}>
          ⚠️ Se ha excedido la cantidad total permitida para este grupo.
        </Typography>
      )}

      {fallas.length > 0 && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
};

DefectosList.propTypes = {
  fallas: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  maxCantidad: PropTypes.number.isRequired,
};

export default DefectosList;
