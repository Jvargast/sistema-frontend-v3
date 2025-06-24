import {
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import PropTypes from "prop-types";

const ProductoRetornableCard = ({ grupo, onUpdate, insumos }) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        px: 3,
        py: 2,
        mb: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {grupo.nombreProducto} ({grupo.totalCantidad} unidades)
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {grupo.items.map((item, idx) => {
        const totalDefectuosos = (item.fallas || []).reduce(
          (sum, f) => sum + (f.cantidad || 0),
          0
        );
        const restante =
          item.cantidad - (item.reutilizable || 0) - totalDefectuosos;

        const handleFallaChange = (fallaIdx, field, value) => {
          const nuevasFallas = [...(item.fallas || [])];
          nuevasFallas[fallaIdx][field] =
            field === "cantidad" ? Number(value) : value;
          onUpdate(grupo.id, idx, "fallas", nuevasFallas);
        };

        const handleAgregarFalla = () => {
          const nuevasFallas = [...(item.fallas || [])];
          nuevasFallas.push({ cantidad: 0, tipo_defecto: "" });
          onUpdate(grupo.id, idx, "fallas", nuevasFallas);
        };

        const handleEliminarFalla = (fallaIdx) => {
          const nuevasFallas = [...(item.fallas || [])];
          nuevasFallas.splice(fallaIdx, 1);
          onUpdate(grupo.id, idx, "fallas", nuevasFallas);
        };

        return (
          <Box
            key={idx}
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Fecha retorno: {new Date(item.fecha_retorno).toLocaleDateString()}{" "}
              — Cantidad: {item.cantidad}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 2,
              }}
            >
              <TextField
                label="Cantidad reutilizable"
                type="number"
                inputProps={{ min: 0, max: item.cantidad }}
                value={item.reutilizable || ""}
                onChange={(e) =>
                  onUpdate(
                    grupo.id,
                    idx,
                    "reutilizable",
                    parseInt(e.target.value || 0, 10)
                  )
                }
                size="small"
                fullWidth
              />
              <Select
                fullWidth
                size="small"
                value={item.id_insumo_destino || ""}
                onChange={(e) =>
                  onUpdate(grupo.id, idx, "id_insumo_destino", e.target.value)
                }
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Seleccionar insumo de destino
                </MenuItem>
                {Object.values(insumos?.items || {}).map((insumo) => (
                  <MenuItem key={insumo?.id_insumo} value={insumo?.id_insumo}>
                    {insumo?.nombre_insumo}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Typography variant="subtitle2" fontWeight="medium" mb={1}>
              Defectuosos
            </Typography>

            {(item.fallas || []).map((falla, fallaIdx) => (
              <Box
                key={fallaIdx}
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <TextField
                  label="Cantidad"
                  type="number"
                  inputProps={{ min: 0, max: item.cantidad }}
                  value={falla.cantidad}
                  onChange={(e) =>
                    handleFallaChange(
                      fallaIdx,
                      "cantidad",
                      parseInt(e.target.value || 0, 10)
                    )
                  }
                  size="small"
                  sx={{ width: { xs: "100%", sm: "140px" } }}
                />

                <TextField
                  label="Tipo de defecto"
                  value={falla.tipo_defecto}
                  onChange={(e) =>
                    handleFallaChange(fallaIdx, "tipo_defecto", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1, minWidth: 180 }}
                />

                <Tooltip title="Eliminar este defecto">
                  <IconButton
                    onClick={() => handleEliminarFalla(fallaIdx)}
                    color="error"
                    size="small"
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}

            <Box
              mt={1}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Agregar nuevo tipo de defecto">
                  <IconButton
                    onClick={handleAgregarFalla}
                    color="primary"
                    size="small"
                  >
                    <AddCircleOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" color="text.secondary">
                  Restante:{" "}
                  <strong
                    style={{ color: restante < 0 ? "#d32f2f" : "#2e7d32" }}
                  >
                    {restante}
                  </strong>
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 5 }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ℹ️ Reutilizables + defectuosos no deben exceder{" "}
                  {item.cantidad}
                </Typography>
              </Box>
            </Box>

            {restante < 0 && (
              <Typography color="error" fontSize={13} mt={1}>
                ⚠️ Se excede la cantidad total permitida.
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

ProductoRetornableCard.propTypes = {
  grupo: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  insumos: PropTypes.object.isRequired,
};

export default ProductoRetornableCard;
