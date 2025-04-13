import PropTypes from "prop-types";
import { Box, Switch, Typography, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const Row = ({ index, style, group, selectedPermisos, onTogglePermiso }) => {
  const permiso = group[index];

  if (!permiso) return null;

  const hasDependencias =
    permiso.Dependencias && permiso.Dependencias.length > 0;

  return (
    <Box
      style={style}
      sx={{
        boxSizing: "border-box",
        padding: 2,
        borderBottom: "1px solid #eee",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            #{permiso.id}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              overflowWrap: "break-word",
              lineHeight: "1.2",
              mb: 0.5,
            }}
          >
            {permiso.nombre}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflowWrap: "break-word", lineHeight: "1.2" }}
          >
            {permiso.descripcion}
          </Typography>
        </Box>

        <Box
          sx={{
            ml: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {hasDependencias && (
            <Tooltip
              title={
                <Box>
                  <Typography variant="subtitle2">Requiere:</Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {permiso.Dependencias.map((dep) => (
                      <li key={dep.id}>{dep.nombre}</li>
                    ))}
                  </ul>
                </Box>
              }
            >
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Switch
            checked={selectedPermisos.includes(permiso.id)}
            onChange={() => onTogglePermiso(permiso.id)}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

Row.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  group: PropTypes.array.isRequired,
  selectedPermisos: PropTypes.arrayOf(PropTypes.number).isRequired,
  onTogglePermiso: PropTypes.func.isRequired,
};

export default Row;
