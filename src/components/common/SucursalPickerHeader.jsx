import {
  Box,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { LocationCityRounded, StorefrontRounded } from "@mui/icons-material";

export default function SucursalPickerHeader({
  sucursales = [],
  idSucursal,
  canChoose,
  onChange,
  nombreSucursal,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      sx={{
        border: (theme) => `1px solid ${theme.palette.primary.main} `,
        borderRadius: "2rem",
        padding: "1rem",
        marginBottom: "10px",
      }}
      spacing={2}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <StorefrontRounded color="primary" sx={{ fontSize: 28 }} />
        <Box>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: 0.6 }}
          >
            Sucursal actual
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {nombreSucursal ? (
              nombreSucursal
            ) : (
              <Chip
                size="small"
                color="warning"
                label="No seleccionada"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Typography>
        </Box>
      </Stack>

      {canChoose ? (
        <TextField
          select
          label="Elegir sucursal"
          size="small"
          value={
            Array.isArray(sucursales) &&
            sucursales.some((s) => Number(s.id_sucursal) === Number(idSucursal))
              ? Number(idSucursal)
              : ""
          }
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
          helperText="Requerido en vista global"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationCityRounded fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { xs: "100%", sm: 280 } }}
        >
          {sucursales.map((s) => (
            <MenuItem key={s.id_sucursal} value={Number(s.id_sucursal)}>
              {s.nombre}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          label="Sucursal"
          size="small"
          value={nombreSucursal || ""}
          helperText="No editable aquí. Cámbiala desde el selector de sucursal."
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <LocationCityRounded fontSize="small" />
              </InputAdornment>
            ),
          }}
          disabled
          sx={{ minWidth: { xs: "100%", sm: 280 } }}
        />
      )}
    </Stack>
  );
}

SucursalPickerHeader.propTypes = {
  sucursales: PropTypes.arrayOf(
    PropTypes.shape({
      id_sucursal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  idSucursal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canChoose: PropTypes.bool,
  onChange: PropTypes.func,
  nombreSucursal: PropTypes.string,
};
