// Row.jsx
import { Checkbox, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

function Row({ index, style, group, selectedPermisos, onTogglePermiso }) {
  const permiso = group[index];
  const isSelected = selectedPermisos.includes(permiso.id);

  const dependencias = permiso.Dependencias || [];

  return (
    <div style={{ ...style, display: "flex", alignItems: "center" }}>
      <Checkbox
        checked={isSelected}
        onChange={() => onTogglePermiso(permiso.id)}
      />

      <span style={{ flex: 1 }}>{permiso.nombre}</span>

      {dependencias.length > 0 && (
        <Tooltip
          placement="top"
          title={
            <div>
              <strong>Requiere:</strong>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {dependencias.map((dep) => (
                  <li key={dep.id}>{dep.nombre}</li>
                ))}
              </ul>
            </div>
          }
        >
          <IconButton size="small">
            <InfoIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

export default Row;
