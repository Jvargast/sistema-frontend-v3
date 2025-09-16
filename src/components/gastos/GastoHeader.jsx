import {
  Card,
  CardHeader,
  Chip,
  Stack,
  Typography,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import EditOutlined from "@mui/icons-material/EditOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import PropTypes from "prop-types";
import dayjs from "dayjs";

export default function GastoHeader({
  gasto,
  edit,
  onToggleEdit,
  onSave,
  onDelete,
  saving,
}) {
  const theme = useTheme();
  const chipSoftSx = {
    fontWeight: 700,
    borderRadius: 999,
    bgcolor: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.16 : 0.08
    ),
    color: theme.palette.text.primary,
    borderColor: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.28 : 0.18
    ),
    "& .MuiChip-icon": { fontSize: 18 },
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 6px 30px rgba(0,0,0,.08)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        title={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            flexWrap="wrap"
            useFlexGap
          >
            <Typography variant="h5" fontWeight={800} sx={{ mr: 0.5 }}>
              Gasto #{gasto.id_gasto}
            </Typography>

            <Chip
              icon={<CalendarMonthOutlined sx={{ fontSize: 18 }} />}
              label={dayjs(gasto.fecha).format("DD-MM-YYYY")}
              size="small"
              variant="outlined"
              sx={chipSoftSx}
            />

            {gasto?.sucursal?.nombre && (
              <Tooltip title={gasto.sucursal.nombre} disableInteractive>
                <Chip
                  icon={<StorefrontOutlined sx={{ fontSize: 18 }} />}
                  label={gasto.sucursal.nombre}
                  size="small"
                  variant="outlined"
                  sx={chipSoftSx}
                />
              </Tooltip>
            )}
          </Stack>
        }
        action={
          !edit ? (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Editar">
                <span>
                  <Button
                    onClick={onToggleEdit}
                    variant="outlined"
                    size="small"
                    startIcon={<EditOutlined />}
                    sx={{ fontWeight: 700 }}
                  >
                    Editar
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Eliminar">
                <span>
                  <Button
                    color="error"
                    variant="text"
                    size="small"
                    startIcon={<DeleteOutline />}
                    onClick={onDelete}
                    sx={{ fontWeight: 700 }}
                  >
                    Eliminar
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloseOutlined />}
                onClick={onToggleEdit}
                sx={{ fontWeight: 700 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={
                  saving ? <CircularProgress size={16} /> : <SaveOutlined />
                }
                disabled={saving}
                onClick={onSave}
                sx={{ fontWeight: 700 }}
              >
                {saving ? "Guardando…" : "Guardar"}
              </Button>
            </Stack>
          )
        }
        sx={{
          py: 1.5,
          px: { xs: 2, sm: 3 },
          "& .MuiCardHeader-content": { overflow: "hidden" },
          "& .MuiCardHeader-action": { alignSelf: "center", m: 0 },
        }}
      />
    </Card>
  );
}

GastoHeader.propTypes = {
  gasto: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
  onToggleEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
