import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import { alpha } from "@mui/material/styles";

export default function CentroCostoCard({
  centro,
  sucursalNombre,
  onEdit,
  onDelete,
  onClick,
}) {
  const theme = useTheme();
  const activo = centro?.activo !== false;

  const tipoKey = String(centro?.tipo || "").toLowerCase();
  const typeAccent =
    {
      operativo: theme.palette.info.main,
      producción: theme.palette.success.main,
      produccion: theme.palette.success.main,
      ventas: theme.palette.warning.main,
      administración: theme.palette.secondary.main,
      administracion: theme.palette.secondary.main,
      logística: theme.palette.primary.main,
      logistica: theme.palette.primary.main,
      finanzas: theme.palette.success.dark,
      otros: theme.palette.text.secondary,
    }[tipoKey] || theme.palette.text.secondary;

  const accent = activo ? typeAccent : theme.palette.action.disabled;
  const softBg = alpha(accent, 0.08);
  const softBorder = alpha(accent, 0.35);

  const Body = (
    <>
      <Box
        sx={{
          height: 3,
          width: "100%",
          background: `linear-gradient(90deg, ${alpha(
            accent,
            0.25
          )} 0%, ${accent} 100%)`,
        }}
      />

      <CardContent sx={{ py: 2, flexGrow: 1  }}>
        <Stack direction="row" alignItems="center" spacing={1.25} mb={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: activo
                ? theme.palette.success.main
                : theme.palette.error.main,
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
          <Typography
            variant="h6"
            fontWeight={700}
            noWrap
            title={centro?.nombre || `Centro #${centro?.id_centro_costo}`}
            sx={{ flex: 1 }}
          >
            {centro?.nombre || `Centro #${centro?.id_centro_costo}`}
          </Typography>

          <Chip
            size="small"
            label={activo ? "Activo" : "Inactivo"}
            color={activo ? "success" : "default"}
            variant={activo ? "filled" : "outlined"}
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={1.2}
          useFlexGap
          flexWrap="wrap"
          sx={{ mt: 0.5 }}
        >
          {centro?.tipo && (
            <Chip
              size="small"
              icon={<CategoryOutlined sx={{ fontSize: 16 }} />}
              label={centro.tipo}
              variant="outlined"
              sx={{
                bgcolor: softBg,
                borderColor: softBorder,
                color: accent,
                "& .MuiChip-icon": { color: accent },
              }}
            />
          )}
          {sucursalNombre && (
            <Chip
              size="small"
              icon={<BusinessOutlined sx={{ fontSize: 16 }} />}
              label={sucursalNombre}
              variant="outlined"
            />
          )}
          {centro?.id_centro_costo != null && (
            <Chip
              size="small"
              label={`ID ${centro.id_centro_costo}`}
              variant="outlined"
              sx={{ opacity: 0.8 }}
            />
          )}
        </Stack>
      </CardContent>

      <Divider />

      <CardActions
        sx={{
          justifyContent: "flex-end",
          py: 1,
          px: 1,
        }}
      >
        <Tooltip title="Editar">
          <IconButton
            aria-label="Editar centro de costo"
            onClick={(e) => onEdit?.(e)}
            size="small"
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton
            aria-label="Eliminar centro de costo"
            onClick={(e) => onDelete?.(e)}
            color="error"
            size="small"
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </>
  );

  return (
    <Card
      sx={{
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 184, 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        transition:
          "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[3],
          borderColor: accent,
        },
        ...(activo
          ? {}
          : {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
            }),
      }}
      elevation={0}
      role={onClick ? "button" : "group"}
      tabIndex={onClick ? 0 : -1}
    >
      {onClick ? (
        <CardActionArea
          onClick={onClick}
          sx={{
            alignItems: "stretch",
          }}
        >
          {Body}
        </CardActionArea>
      ) : (
        Body
      )}
    </Card>
  );
}

CentroCostoCard.propTypes = {
  centro: PropTypes.object.isRequired,
  sucursalNombre: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};
