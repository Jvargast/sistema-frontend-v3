import PropTypes from "prop-types";
import { Chip, IconButton, Tooltip, useTheme } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import Close from "@mui/icons-material/Close";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { ESTADOS_COMPRA } from "../../constants/estadosCompra";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";
import { getActionIconButtonSx } from "../common/tableStyles";


const estadoChip = (v) =>
  ESTADOS_COMPRA.find((e) => e.value === String(v || "").toLowerCase()) || {
    label: v || "—",
    color: "default",
  };

export default function CompraViewHeader({
  compra,
  edit,
  saving,
  onToggleEdit,
  onSave,
  onDelete,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const e = estadoChip(compra?.estado);

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
      <Tooltip title="Volver">
        <IconButton
          onClick={() => navigate("/admin/compras")}
          aria-label="Volver"
        >
          <ArrowBack />
        </IconButton>
      </Tooltip>

      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} noWrap>
          Compra #{compra?.id_compra}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          <Chip
            size="small"
            color={e.color}
            icon={<CheckCircle />}
            label={e.label}
            variant="outlined"
          />
          <Chip
            size="small"
            label={compra?.moneda || "CLP"}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      {!edit ? (
        <Tooltip title="Editar">
          <IconButton
            onClick={onToggleEdit}
            aria-label="Editar compra"
            sx={getActionIconButtonSx(theme, "primary")}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Guardar">
            <span>
              <IconButton
                color="success"
                onClick={onSave}
                disabled={saving}
                aria-label="Guardar"
              >
                <Save />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cancelar">
            <IconButton
              color="inherit"
              onClick={onToggleEdit}
              aria-label="Cancelar"
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Tooltip title="Eliminar">
        <IconButton
          onClick={onDelete}
          aria-label="Eliminar compra"
          sx={getActionIconButtonSx(theme, "error")}
        >
          <DeleteOutlineOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

CompraViewHeader.propTypes = {
  compra: PropTypes.object,
  edit: PropTypes.bool.isRequired,
  saving: PropTypes.bool,
  onToggleEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
