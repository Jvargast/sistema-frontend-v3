import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as LogisticaIcon,
  WorkOutline as OperativoIcon,
  Badge as PersonalIcon,
  RequestQuote as FinancieroIcon,
  ReceiptLong as ImpuestosIcon,
  Category as OtrosIcon,
} from "@mui/icons-material";

function tipoMeta(tipo, theme) {
  const map = {
    operativo: { label: "Operativo", color: "primary", Icon: OperativoIcon },
    personal: { label: "Personal", color: "secondary", Icon: PersonalIcon },
    financiero: { label: "Financiero", color: "info", Icon: FinancieroIcon },
    impuestos: { label: "Impuestos", color: "warning", Icon: ImpuestosIcon },
    logistica: { label: "Logística", color: "success", Icon: LogisticaIcon },
    otros: { label: "Otros", color: "default", Icon: OtrosIcon },
  };
  const def = map[tipo] || map.otros;
  const main =
    def.color === "default"
      ? theme.palette.text.secondary
      : theme.palette[def.color].main;
  const bg = alpha(main, 0.12);
  return { ...def, main, bg };
}

export default function CategoriaGastoCard({
  categoria,
  onEdit,
  onDelete,
  compact = false,
}) {
  const theme = useTheme();
  const tipo = String(categoria?.tipo_categoria || "otros").toLowerCase();
  const meta = tipoMeta(tipo, theme);

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 6px 18px rgba(0,0,0,.35)"
            : "0 6px 16px rgba(0,0,0,.08)",
        transition:
          "transform .18s ease, box-shadow .18s ease, border-color .18s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 26px rgba(0,0,0,.45)"
              : "0 10px 26px rgba(0,0,0,.12)",
          borderColor: meta.main,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          inset: "0 0 auto 0",
          height: 4,
          background: meta.main,
        },
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              bgcolor: meta.bg,
              color: meta.main,
              boxShadow:
                theme.palette.mode === "dark"
                  ? `inset 0 0 0 1px ${alpha(meta.main, 0.35)}`
                  : `inset 0 0 0 1px ${alpha(meta.main, 0.25)}`,
            }}
          >
            <meta.Icon sx={{ fontSize: 22 }} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight={800}
              color="text.primary"
              noWrap
              title={categoria?.nombre_categoria}
              sx={{ letterSpacing: 0.2 }}
            >
              {categoria?.nombre_categoria}
            </Typography>

            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mt: 0.5, flexWrap: "wrap", rowGap: 0.75 }}
            >
              <Chip
                size="small"
                label={meta.label}
                sx={{
                  bgcolor: meta.bg,
                  color: meta.main,
                  borderColor: alpha(meta.main, 0.35),
                }}
                variant="outlined"
              />
              <Chip
                size="small"
                label={categoria?.deducible ? "Deducible" : "No deducible"}
                color={categoria?.deducible ? "success" : "default"}
                variant="outlined"
              />
              <Chip
                size="small"
                label={categoria?.activo ? "Activo" : "Inactivo"}
                color={categoria?.activo ? "success" : "default"}
                variant={categoria?.activo ? "filled" : "outlined"}
              />
            </Stack>

            <Box
              sx={{
                mt: 1.25,
                p: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.text.primary, 0.04),
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: compact ? 2 : 3,
                  WebkitBoxOrient: "vertical",
                  minHeight: compact ? 32 : 48,
                  lineHeight: 1.4,
                }}
                title={categoria?.descripcion}
              >
                {categoria?.descripcion || "Sin descripción"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      <Divider sx={{ opacity: 0.5 }} />

      <CardActions
        sx={{
          px: 1,
          py: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 0.5,
        }}
      >
        <Tooltip title="Editar">
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{
              borderRadius: 2,
              transition: "all .15s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Eliminar">
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{
              borderRadius: 2,
              transition: "all .15s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.12),
                color: theme.palette.error.main,
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

CategoriaGastoCard.propTypes = {
  categoria: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};
