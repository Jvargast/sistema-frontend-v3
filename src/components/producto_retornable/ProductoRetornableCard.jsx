import {
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
  Alert,
  Button,
} from "@mui/material";
import {
  AddCircleOutline,
  DeleteOutline,
  InfoOutlined,
  Add,
  Remove,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const ProductoRetornableCard = ({ grupo, onUpdate }) => {
  const theme = useTheme();
  const fechaHeader = (() => {
    if (!grupo.items?.length) return null;
    const maxMillis = Math.max(
      ...grupo.items.map((it) => new Date(it.fecha_retorno).getTime())
    );
    return new Date(maxMillis).toLocaleDateString();
  })();
  const QuantityStepper = ({
    value = 0,
    min = 0,
    max = Infinity,
    onChange,
    disabled,
    ariaLabel,
  }) => {
    const v = Number.isFinite(value) ? value : 0;
    const dec = () => onChange(Math.max(min, v - 1));
    const inc = () => onChange(Math.min(max, v + 1));
    const handleInput = (e) => {
      const n = parseInt(e.target.value || 0, 10);
      if (Number.isNaN(n)) return onChange(min);
      onChange(Math.max(min, Math.min(max, n)));
    };
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          onClick={dec}
          disabled={disabled || v <= min}
          size="large"
          sx={{
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
          aria-label={`${ariaLabel} disminuir`}
        >
          <Remove />
        </IconButton>
        <TextField
          value={v}
          onChange={handleInput}
          size="medium"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            style: { textAlign: "center", fontWeight: 700 },
          }}
          sx={{ width: 96 }}
        />
        <IconButton
          onClick={inc}
          disabled={disabled || v >= max}
          size="large"
          sx={{
            width: 48,
            height: 48,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
          aria-label={`${ariaLabel} aumentar`}
        >
          <Add />
        </IconButton>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2.5,
        mb: 4,
        backgroundColor: theme.palette.action.hover,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: theme.palette.mode === "dark" ? "none" : "0 2px 10px rgba(0,0,0,0.04)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          Producto: {grupo.nombreProducto} (
          {grupo.items.reduce((total, item) => total + (item.cantidad || 0), 0)}{" "}
          unidades)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          {fechaHeader ? `Fecha: ${fechaHeader}` : "—"}
        </Typography>
      </Box>
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
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  border: "1px dashed",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ lineHeight: 1.2 }}
                >
                  Cantidad total
                </Typography>
                <Typography variant="subtitle1" fontWeight={800}>
                  {item.cantidad}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ mb: 1, letterSpacing: 0.2 }}
            >
              ♻️ Reutilizables
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 96,
                gap: 1,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <QuantityStepper
                ariaLabel="Reutilizables"
                value={item.reutilizable || 0}
                min={0}
                max={
                  item.cantidad -
                  (item.fallas || []).reduce((s, f) => s + (f.cantidad || 0), 0)
                }
                disabled={!item._insumoDestinoFijo}
                onChange={(val) => onUpdate(grupo.id, idx, "reutilizable", val)}
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {item._insumoDestinoFijo ? (
                  <Chip
                    size="small"
                    color="default"
                    label={
                      item._insumoDestinoNombre
                        ? `Destino: ${item._insumoDestinoNombre}`
                        : `Destino ID: ${item.id_insumo_destino}`
                    }
                    sx={{ alignSelf: "flex-start" }}
                  />
                ) : (
                  <Alert
                    icon={<InfoOutlined fontSize="inherit" />}
                    severity="info"
                    sx={{ py: 0.5 }}
                  >
                    Configura <strong>id_insumo_retorno</strong> en el producto
                    para habilitar reutilizables.
                  </Alert>
                )}
              </Box>
            </Box>

            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ mb: 1, letterSpacing: 0.2 }}
            >
              ⚠️ Defectuosos
            </Typography>

            {(item.fallas || []).map((falla, fallaIdx) => (
              <Box
                key={fallaIdx}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <QuantityStepper
                  ariaLabel="Defectuosos"
                  value={falla.cantidad || 0}
                  min={0}
                  max={
                    item.cantidad -
                    (item.reutilizable || 0) -
                    (item.fallas || []).reduce(
                      (s, f, i) => s + (i === fallaIdx ? 0 : f.cantidad || 0),
                      0
                    )
                  }
                  onChange={(val) =>
                    handleFallaChange(fallaIdx, "cantidad", val)
                  }
                />

                <TextField
                  label="Descripción del defecto (ej: roto, sucio, sin tapa...)"
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Button
                  onClick={handleAgregarFalla}
                  size="small"
                  variant="outlined"
                  startIcon={<AddCircleOutline />}
                >
                  Agregar defecto
                </Button>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Restante: ${restante}`}
                  sx={{ fontWeight: 600 }}
                  color={restante < 0 ? "error" : "default"}
                />
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
};

export default ProductoRetornableCard;
