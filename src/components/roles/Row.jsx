import PropTypes from "prop-types";
import { Box, Switch, Typography } from "@mui/material";

const Row = ({ index, style, group, selectedPermisos, onTogglePermiso }) => {
  const permiso = group[index];
  if (!permiso) return null;

  return (
    <Box
      style={style}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* ID del permiso */}
      <Typography sx={{ fontSize: "1rem", width: "50px", color: "#888" }}>
        {permiso.id}
      </Typography>
      {/* Nombre del permiso */}
      <Typography sx={{ fontSize: "1rem", flex: 1 }}>{permiso.nombre}</Typography>
      {/* Descripción del permiso */}
      <Typography sx={{ fontSize: "1rem", flex: 2, color: "#666" }}>
        {permiso.descripcion}
      </Typography>
      {/* Switch para seleccionar/deseleccionar el permiso */}
      <Switch
        checked={selectedPermisos.includes(permiso.id)}
        onChange={() => onTogglePermiso(permiso.id)}
      />
    </Box>
  );
};

Row.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  group: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedPermisos: PropTypes.arrayOf(PropTypes.number).isRequired,
  onTogglePermiso: PropTypes.func.isRequired,
};

export default Row;
