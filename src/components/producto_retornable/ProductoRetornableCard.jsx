import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Checkbox,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Add,
  ExpandMore,
  InfoOutlined,
  Remove,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const DEFECT_TYPE_OPTIONS = [
  "Rotura",
  "Suciedad",
  "Descolorido",
  "Etiqueta dañada",
];

const toNumber = (value) => Number(value) || 0;

const splitDefectText = (value) =>
  String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const joinDefectParts = (parts) => parts.join(", ");

const getDefectText = (fallas = []) =>
  joinDefectParts(fallas.map((f) => f.tipo_defecto).flatMap(splitDefectText));

const isDefectOptionSelected = (text, option) =>
  splitDefectText(text).some(
    (part) => part.toLocaleLowerCase() === option.toLocaleLowerCase()
  );

const toggleDefectOption = (text, option, checked) => {
  const parts = splitDefectText(text);
  const exists = parts.some(
    (part) => part.toLocaleLowerCase() === option.toLocaleLowerCase()
  );

  if (checked && !exists) return joinDefectParts([...parts, option]);
  if (!checked && exists) {
    return joinDefectParts(
      parts.filter(
        (part) => part.toLocaleLowerCase() !== option.toLocaleLowerCase()
      )
    );
  }

  return joinDefectParts(parts);
};

const metricChipSx = (tone = "default") => (theme) => {
  const tones = {
    default: {
      color: theme.palette.text.secondary,
      bg: "transparent",
      border: theme.palette.divider,
    },
    success: {
      color: "#0F766E",
      bg: alpha("#0F766E", theme.palette.mode === "light" ? 0.07 : 0.14),
      border: alpha("#0F766E", 0.3),
    },
    warning: {
      color: "#92400E",
      bg: alpha("#92400E", theme.palette.mode === "light" ? 0.07 : 0.14),
      border: alpha("#92400E", 0.3),
    },
    error: {
      color: theme.palette.error.main,
      bg: alpha(
        theme.palette.error.main,
        theme.palette.mode === "light" ? 0.07 : 0.14
      ),
      border: alpha(theme.palette.error.main, 0.3),
    },
  };
  const selectedTone = tones[tone] || tones.default;

  return {
    height: 26,
    borderRadius: 1,
    fontWeight: 800,
    color: selectedTone.color,
    bgcolor: selectedTone.bg,
    borderColor: selectedTone.border,
    "& .MuiChip-label": {
      px: 0.75,
    },
  };
};

const panelSx = (theme) => ({
  p: 1.5,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  bgcolor:
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : alpha(theme.palette.common.white, 0.03),
  minWidth: 0,
});

const QuantityStepper = ({
  value = 0,
  min = 0,
  max = Infinity,
  onChange,
  disabled,
  ariaLabel,
}) => {
  const theme = useTheme();
  const v = Number.isFinite(Number(value)) ? Number(value) : 0;
  const safeMax = Number.isFinite(max) ? Math.max(min, max) : Infinity;

  const dec = () => onChange(Math.max(min, v - 1));
  const inc = () => onChange(Math.min(safeMax, v + 1));
  const handleInput = (e) => {
    const n = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(n)) return onChange(min);
    onChange(Math.max(min, Math.min(safeMax, n)));
  };

  const buttonSx = {
    width: "100%",
    height: { xs: 62, md: 76 },
    border: "1px solid",
    borderColor: alpha(theme.palette.primary.main, 0.3),
    borderRadius: 1,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === "light"
        ? `0 5px 14px ${alpha(theme.palette.primary.main, 0.12)}`
        : `0 5px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.16),
      borderColor: alpha(theme.palette.primary.main, 0.45),
    },
    "&.Mui-disabled": {
      bgcolor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      borderColor: theme.palette.divider,
      boxShadow: "none",
    },
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          "minmax(72px, 1fr) minmax(92px, 1.45fr) minmax(72px, 1fr)",
        gap: 1,
        width: "100%",
      }}
    >
      <IconButton
        onClick={dec}
        disabled={disabled || v <= min}
        sx={buttonSx}
        aria-label={`${ariaLabel} disminuir`}
      >
        <Remove sx={{ fontSize: { xs: 30, md: 38 } }} />
      </IconButton>
      <TextField
        value={v}
        onChange={handleInput}
        size="small"
        disabled={disabled}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          "aria-label": ariaLabel,
        }}
        sx={{
          "& .MuiInputBase-root": {
            height: { xs: 62, md: 76 },
            borderRadius: 1,
            bgcolor: "background.paper",
            fontWeight: 900,
          },
          "& .MuiInputBase-input": {
            p: 0,
            textAlign: "center",
            fontSize: { xs: 32, md: 42 },
            fontWeight: 900,
            lineHeight: 1,
          },
        }}
      />
      <IconButton
        onClick={inc}
        disabled={disabled || v >= safeMax}
        sx={buttonSx}
        aria-label={`${ariaLabel} aumentar`}
      >
        <Add sx={{ fontSize: { xs: 34, md: 42 } }} />
      </IconButton>
    </Box>
  );
};

QuantityStepper.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
};

const MetricChip = ({ label, value, tone = "default" }) => (
  <Chip
    size="small"
    variant="outlined"
    label={`${label}: ${value}`}
    sx={metricChipSx(tone)}
  />
);

MetricChip.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  tone: PropTypes.oneOf(["default", "error", "success", "warning"]),
};

const ProductoRetornableCard = ({ grupo, onUpdate }) => {
  const theme = useTheme();
  const totalGrupo = (grupo.items || []).reduce(
    (total, item) => total + toNumber(item.cantidad),
    0
  );
  const productoConInsumoPendiente = (grupo.items || []).find(
    (item) => !item._insumoDestinoFijo && item?.Producto?.id_producto
  );
  const editarProductoPath = productoConInsumoPendiente
    ? `/productos/editar/${productoConInsumoPendiente.Producto.id_producto}`
    : null;

  const fechaHeader = (() => {
    if (!grupo.items?.length) return null;
    const maxMillis = Math.max(
      ...grupo.items.map((it) => new Date(it.fecha_retorno).getTime())
    );
    if (!Number.isFinite(maxMillis)) return null;
    return new Date(maxMillis).toLocaleDateString();
  })();

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 6px 18px rgba(15, 23, 42, 0.06)"
            : "0 6px 18px rgba(0,0,0,0.26)",
        height: "100%",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1.35,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor:
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1.5}
        >
          <Box minWidth={0}>
            <Typography
              variant="h6"
              color="text.primary"
              title={grupo.nombreProducto}
              sx={{
                fontSize: { xs: 16, md: 17 },
                fontWeight: 900,
                lineHeight: 1.2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {grupo.nombreProducto}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
              {grupo.items.length} retorno{grupo.items.length === 1 ? "" : "s"}
              {fechaHeader ? ` · Último: ${fechaHeader}` : ""}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={0.75}
            flexWrap="wrap"
            flex="0 0 auto"
          >
            {editarProductoPath && (
              <Chip
                component={RouterLink}
                to={editarProductoPath}
                state={{ focus: "id_insumo_retorno" }}
                clickable
                size="small"
                variant="outlined"
                label="Configurar insumo"
                sx={{
                  borderRadius: 1,
                  fontWeight: 900,
                  textDecoration: "none",
                  color: "#92400E",
                  borderColor: alpha("#92400E", 0.32),
                  bgcolor: alpha("#92400E", 0.06),
                  "&:hover": {
                    bgcolor: alpha("#92400E", 0.1),
                    borderColor: alpha("#92400E", 0.45),
                  },
                }}
              />
            )}
            <Chip
              size="small"
              variant="outlined"
              label={`${totalGrupo} u.`}
              sx={{
                borderRadius: 1,
                fontWeight: 900,
                bgcolor:
                  theme.palette.mode === "light"
                    ? theme.palette.common.white
                    : theme.palette.background.paper,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box>
        {(grupo.items || []).map((item, idx) => {
          const cantidadTotal = toNumber(item.cantidad);
          const totalDefectuosos = (item.fallas || []).reduce(
            (sum, f) => sum + toNumber(f.cantidad),
            0
          );
          const defectText = getDefectText(item.fallas || []);
          const reutilizable = toNumber(item.reutilizable);
          const restante = cantidadTotal - reutilizable - totalDefectuosos;
          const maxDefectuosos = Math.max(0, cantidadTotal - reutilizable);
          const itemEditarProductoPath =
            !item._insumoDestinoFijo && item?.Producto?.id_producto
              ? `/productos/editar/${item.Producto.id_producto}`
              : editarProductoPath;
          const fechaItem = item.fecha_retorno
            ? new Date(item.fecha_retorno).toLocaleDateString()
            : "Sin fecha";

          const updateFallas = (cantidad, tipoDefecto = defectText) => {
            const safeCantidad = Math.max(
              0,
              Math.min(maxDefectuosos, toNumber(cantidad))
            );
            const cleanText = String(tipoDefecto || "").trim();
            const nextFallas =
              safeCantidad > 0 || cleanText
                ? [{ cantidad: safeCantidad, tipo_defecto: cleanText }]
                : [];
            onUpdate(grupo.id, idx, "fallas", nextFallas);
          };

          const handleToggleDefect = (option, checked) => {
            updateFallas(
              totalDefectuosos,
              toggleDefectOption(defectText, option, checked)
            );
          };

          return (
            <Accordion
              key={item.id_producto_retornable ?? idx}
              disableGutters
              square
              elevation={0}
              defaultExpanded={idx === 0}
              sx={{
                borderBottom:
                  idx === grupo.items.length - 1 ? 0 : "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minHeight: 56,
                  "& .MuiAccordionSummary-content": {
                    minWidth: 0,
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    my: 0.75,
                  },
                }}
              >
                <Box minWidth={0} flex="1 1 auto">
                  <Typography variant="subtitle2" fontWeight={900} noWrap>
                    Retorno #{item.id_producto_retornable ?? idx + 1}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fechaItem}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.75}
                  flexWrap="wrap"
                  justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                >
                  <MetricChip label="Total" value={cantidadTotal} />
                  <MetricChip
                    label="Reutil."
                    value={reutilizable}
                    tone="success"
                  />
                  <MetricChip
                    label="Def."
                    value={totalDefectuosos}
                    tone="warning"
                  />
                  <MetricChip
                    label="Rest."
                    value={restante}
                    tone={restante < 0 ? "error" : "default"}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: 1.5,
                  pt: 0,
                  pb: 1.5,
                  bgcolor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[50]
                      : theme.palette.grey[900],
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "minmax(0, 0.96fr) minmax(0, 1.04fr)",
                    },
                    gap: 1.25,
                    alignItems: "stretch",
                  }}
                >
                  <Box sx={panelSx(theme)}>
                    <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1.25 }}>
                      Reutilizables
                    </Typography>
                    <QuantityStepper
                      ariaLabel="Reutilizables"
                      value={reutilizable}
                      min={0}
                      max={cantidadTotal - totalDefectuosos}
                      disabled={!item._insumoDestinoFijo}
                      onChange={(val) =>
                        onUpdate(grupo.id, idx, "reutilizable", val)
                      }
                    />

                    <Box mt={1.25}>
                      {item._insumoDestinoFijo ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={
                            item._insumoDestinoNombre
                              ? `Destino: ${item._insumoDestinoNombre}`
                              : `Destino ID: ${item.id_insumo_destino}`
                          }
                          sx={{
                            maxWidth: "100%",
                            borderRadius: 1,
                            fontWeight: 700,
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      ) : (
                        <Alert
                          icon={<InfoOutlined fontSize="inherit" />}
                          severity="warning"
                          variant="outlined"
                          action={
                            itemEditarProductoPath ? (
                              <Button
                                component={RouterLink}
                                to={itemEditarProductoPath}
                                state={{ focus: "id_insumo_retorno" }}
                                size="small"
                                sx={{
                                  borderRadius: 1,
                                  color: "#92400E",
                                  fontWeight: 900,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Editar producto
                              </Button>
                            ) : null
                          }
                          sx={{
                            py: 0.45,
                            borderRadius: 1,
                            bgcolor: alpha("#92400E", 0.05),
                            "& .MuiAlert-icon": {
                              color: "#92400E",
                            },
                          }}
                        >
                          Falta configurar el insumo de retorno.
                        </Alert>
                      )}
                    </Box>
                  </Box>

                  <Box sx={panelSx(theme)}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                      mb={1.25}
                    >
                      <Typography variant="subtitle2" fontWeight={900}>
                        Tipos de defecto
                      </Typography>
                      <MetricChip
                        label="Cant."
                        value={totalDefectuosos}
                        tone="warning"
                      />
                    </Box>

                    <QuantityStepper
                      ariaLabel="Defectuosos"
                      value={totalDefectuosos}
                      min={0}
                      max={maxDefectuosos}
                      onChange={(val) => updateFallas(val)}
                    />

                    <Box
                      sx={{
                        mt: 1.25,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        bgcolor: "background.paper",
                      }}
                    >
                      {DEFECT_TYPE_OPTIONS.map((option, optionIdx) => {
                        const checked = isDefectOptionSelected(defectText, option);

                        return (
                          <Box
                            key={option}
                            component="label"
                            sx={{
                              minHeight: 42,
                              px: 1,
                              py: 0.75,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              cursor: "pointer",
                              bgcolor: checked
                                ? alpha(theme.palette.primary.main, 0.08)
                                : optionIdx % 2
                                  ? theme.palette.action.hover
                                  : "transparent",
                              borderTop:
                                optionIdx === 0 ? 0 : "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Checkbox
                              checked={checked}
                              onChange={(event) =>
                                handleToggleDefect(option, event.target.checked)
                              }
                              size="small"
                              sx={{
                                p: 0.25,
                                color: "text.secondary",
                                "&.Mui-checked": {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.primary"
                              fontWeight={checked ? 900 : 700}
                            >
                              {option}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    <TextField
                      label="Detalle del defecto"
                      placeholder="Ej: Rotura, Suciedad, otro detalle"
                      value={defectText}
                      onChange={(e) =>
                        updateFallas(totalDefectuosos, e.target.value)
                      }
                      size="small"
                      fullWidth
                      multiline
                      minRows={2}
                      sx={{
                        mt: 1.25,
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          bgcolor: "background.paper",
                        },
                      }}
                    />
                  </Box>
                </Box>

                {restante < 0 && (
                  <Typography color="error" fontSize={13} mt={1}>
                    Se excede la cantidad total permitida.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};

ProductoRetornableCard.propTypes = {
  grupo: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ProductoRetornableCard;
