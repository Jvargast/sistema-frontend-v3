import PropTypes from "prop-types";
import { Stack, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import Close from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import CheckCircle from "@mui/icons-material/CheckCircle";

const ProveedorHeader = ({
  proveedor,
  edit,
  saving,
  onBack,
  onToggleEdit,
  onDelete,
}) => {
  const activo = proveedor?.activo === true;
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
      <Tooltip title="Volver">
        <IconButton onClick={onBack} aria-label="Volver">
          <ArrowBack />
        </IconButton>
      </Tooltip>
      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} noWrap>
          {proveedor?.razon_social || "Proveedor"}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          <Chip size="small" label={`ID ${proveedor?.id_proveedor ?? "—"}`} />
          <Chip
            size="small"
            color={activo ? "success" : "default"}
            icon={<CheckCircle />}
            label={activo ? "Activo" : "Inactivo"}
          />
        </Stack>
      </Stack>

      {!edit ? (
        <Tooltip title="Editar">
          <IconButton
            color="primary"
            onClick={onToggleEdit}
            aria-label="Editar proveedor"
          >
            <Edit />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Guardar">
            <span>
              <IconButton
                color="success"
                aria-label="Guardar cambios"
                type="submit"
                form="proveedor-edit-form"
                disabled={saving}
              >
                <Save />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cancelar">
            <IconButton
              color="inherit"
              onClick={onToggleEdit}
              aria-label="Cancelar edición"
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Tooltip title="Eliminar">
        <IconButton
          color="error"
          onClick={onDelete}
          aria-label="Eliminar proveedor"
        >
          <DeleteOutline />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

ProveedorHeader.propTypes = {
  proveedor: PropTypes.object,
  edit: PropTypes.bool.isRequired,
  saving: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onToggleEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProveedorHeader;
