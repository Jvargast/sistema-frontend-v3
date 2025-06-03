import PropTypes from "prop-types";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Avatar,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetAllInsumosQuery } from "../../store/services/insumoApi";
import { useMemo } from "react";

const SelectorInsumo = ({
  label,
  onInsumoSeleccionado,
  insumoSeleccionado = null,
  size = "medium",
}) => {
  const { data, isLoading } = useGetAllInsumosQuery({ limit: 1000 });
  const insumos = useMemo(() => data?.data?.items || [], [data]);
  const theme = useTheme();

  const selectedValue = useMemo(() => {
    if (!insumoSeleccionado) return null;
    return (
      insumos.find((i) => i.id_insumo === insumoSeleccionado.id_insumo) ||
      insumoSeleccionado
    );
  }, [insumos, insumoSeleccionado]);

  return (
    <Autocomplete
      options={insumos}
      value={selectedValue}
      size={size}
      loading={isLoading}
      getOptionLabel={(o) => o?.nombre_insumo || ""}
      onChange={(_, nuevo) => onInsumoSeleccionado(nuevo)}
      isOptionEqualToValue={(opt, val) => opt?.id_insumo === val?.id_insumo}
      renderOption={(props, option) => {
        const stock = option?.inventario?.cantidad ?? 0;
        const stockColor =
          stock > 20
            ? theme.palette.success.main
            : stock > 0
            ? theme.palette.warning.main
            : theme.palette.error.main;

        return (
          <Box
            component="li"
            {...props}
            key={option.id_insumo}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 1,
              borderRadius: 2,
              transition: "background-color .2s",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <Avatar
              src={option.image_url || "/placeholder-insumo.png"}
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                mr: 1.25,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {option.nombre_insumo}
              </Typography>
              <Typography variant="caption" sx={{ color: stockColor }}>
                {option.unidad_de_medida || "Unidad"} — Stock: {stock}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Buscar insumos…"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress size={18} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

SelectorInsumo.propTypes = {
  label: PropTypes.string.isRequired,
  onInsumoSeleccionado: PropTypes.func.isRequired,
  insumoSeleccionado: PropTypes.object,
  size: PropTypes.oneOf(["small", "medium"]),
};

export default SelectorInsumo;
