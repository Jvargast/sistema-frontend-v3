import { MenuItem } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import {
  KeyboardArrowDownRounded,
  StorefrontRounded,
} from "@mui/icons-material";
import Box from "./CompatBox";
import Select from "./CompatSelect";
import Stack from "./CompatStack";
import Typography from "./CompatTypography";

export default function SucursalPickerHeader({
  sucursales = [],
  idSucursal,
  canChoose,
  onChange,
  nombreSucursal,
}) {
  const theme = useTheme();
  const sucursalesDisponibles = Array.isArray(sucursales) ? sucursales : [];
  const selectedSucursal = sucursalesDisponibles.find(
    (s) => Number(s.id_sucursal) === Number(idSucursal)
  );
  const selectedValue = selectedSucursal ? Number(idSucursal) : "";
  const displayName = selectedSucursal?.nombre || nombreSucursal || "";
  const isMissing = !displayName;
  const statusText = canChoose
    ? "Pendiente de selección"
    : "No seleccionada";
  const controlWidth = { xs: "100%", sm: "auto" };
  const controlBaseSx = {
    minWidth: { xs: "100%", sm: 260 },
    maxWidth: { xs: "100%", sm: 340 },
    height: 36,
    borderRadius: 1,
    color:
      isMissing && theme.palette.mode === "light"
        ? theme.palette.warning.dark
        : "text.primary",
    bgcolor:
      theme.palette.mode === "light"
        ? alpha("#0F172A", 0.035)
        : alpha(theme.palette.common.white, 0.06),
    transition: "border-color 140ms ease, background-color 140ms ease",
  };
  const borderColor = isMissing
    ? alpha(theme.palette.warning.main, 0.52)
    : alpha("#0F172A", theme.palette.mode === "light" ? 0.14 : 0.26);
  const hoverBorderColor = isMissing
    ? theme.palette.warning.main
    : alpha("#0F172A", theme.palette.mode === "light" ? 0.34 : 0.46);
  const selectSx = {
    ...controlBaseSx,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: hoverBorderColor,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: 1,
      borderColor:
        theme.palette.mode === "light" ? "#0F172A" : theme.palette.grey[300],
    },
    "& .MuiSelect-select": {
      py: 0,
      pl: 1,
      pr: "32px !important",
      height: 34,
      display: "flex",
      alignItems: "center",
    },
    "& .MuiSelect-icon": {
      color: "text.secondary",
      right: 7,
      fontSize: 21,
    },
  };
  const readonlySx = {
    ...controlBaseSx,
    border: "1px solid",
    borderColor,
  };
  const content = (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      sx={{ minWidth: 0, width: "100%" }}
    >
      <StorefrontRounded sx={{ fontSize: 17, color: "text.secondary" }} />
      <Typography
        component="span"
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: 800,
          flex: "0 0 auto",
        }}
      >
        Sucursal
      </Typography>
      <Box
        component="span"
        sx={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          flex: "0 0 auto",
        }}
      />
      <Typography
        component="span"
        variant="body2"
        noWrap
        sx={{
          minWidth: 0,
          fontWeight: 800,
          color: isMissing ? theme.palette.warning.dark : "text.primary",
        }}
      >
        {displayName || statusText}
      </Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: { xs: "stretch", sm: "flex-end" },
        mb: 1.25,
      }}
    >
      {canChoose ? (
        <Select
          size="small"
          value={selectedValue}
          displayEmpty
          IconComponent={KeyboardArrowDownRounded}
          renderValue={() => content}
          onChange={(e) => {
            const v = e.target.value;
            onChange?.(v === "" ? null : Number(v));
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 0.75,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 18px 42px rgba(15, 23, 42, 0.16)",
                "& .MuiMenuItem-root": {
                  fontSize: "0.9rem",
                  minHeight: 38,
                },
              },
            },
          }}
          sx={{
            ...selectSx,
            width: controlWidth,
            cursor: "pointer",
          }}
        >
          <MenuItem disabled value="">
            Seleccionar sucursal
          </MenuItem>
          {sucursalesDisponibles.map((s) => (
            <MenuItem key={s.id_sucursal} value={Number(s.id_sucursal)}>
              {s.nombre}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Box
          sx={{
            ...readonlySx,
            width: controlWidth,
            display: "flex",
            alignItems: "center",
            px: 1,
          }}
        >
          {content}
        </Box>
      )}
    </Box>
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
