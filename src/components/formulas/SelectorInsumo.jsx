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
import { useEffect, useMemo } from "react";
import { useGetAllInsumosAllQuery } from "../../store/services/insumoApi";
import useSucursalActiva from "../../hooks/useSucursalActiva";

const getStockFromInventarios = (inventario, idSucursal) => {
  if (Array.isArray(inventario)) {
    if (idSucursal != null) {
      const m = inventario.find(
        (iv) => Number(iv?.id_sucursal) === Number(idSucursal)
      );
      return Number(m?.cantidad) || 0;
    }
    return inventario.reduce((acc, iv) => acc + (Number(iv?.cantidad) || 0), 0);
  }
  return Number(inventario?.cantidad) || 0;
};

const SelectorInsumo = ({
  label,
  onInsumoSeleccionado,
  insumoSeleccionado = null,
  idSucursal,
  size = "medium",
}) => {
  const theme = useTheme();
  const sucursalActiva = useSucursalActiva();

  const resolvedSucursalId = useMemo(() => {
    const fromHook = sucursalActiva?.id_sucursal ?? sucursalActiva?.id ?? null;
    return idSucursal ?? fromHook ?? null;
  }, [idSucursal, sucursalActiva?.id_sucursal, sucursalActiva?.id]);

  const {
    data: dataAll = [],
    isFetching,
    refetch,
  } = useGetAllInsumosAllQuery(
    {
      limit: 1000,
      includeInventario: true,
      ...(resolvedSucursalId ? { id_sucursal: resolvedSucursalId } : {}),
    },
    { refetchOnMountOrArgChange: true }
  );

  const insumos = dataAll;
  const insumosFiltrados = useMemo(() => {
    if (!resolvedSucursalId) return insumos;
    return insumos.map((i) => ({
      ...i,
      inventario: Array.isArray(i.inventario)
        ? i.inventario.filter(
            (iv) => Number(iv?.id_sucursal) === Number(resolvedSucursalId)
          )
        : i.inventario,
    }));
  }, [insumos, resolvedSucursalId]);

  useEffect(() => {
    refetch();
  }, [resolvedSucursalId, refetch]);

  const selectedValue = useMemo(() => {
    if (!insumoSeleccionado) return null;
    return (
      insumosFiltrados.find(
        (i) => i.id_insumo === insumoSeleccionado.id_insumo
      ) ?? null
    );
  }, [insumosFiltrados, insumoSeleccionado]);

  useEffect(() => {
    if (
      insumoSeleccionado &&
      !insumosFiltrados.some(
        (i) => i.id_insumo === insumoSeleccionado.id_insumo
      )
    ) {
      onInsumoSeleccionado(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedSucursalId, insumosFiltrados]);

  return (
    <Autocomplete
      key={`insumo-${resolvedSucursalId ?? "all"}`}
      options={insumosFiltrados}
      value={selectedValue}
      size={size}
      loading={isFetching}
      getOptionLabel={(o) => o?.nombre_insumo || ""}
      onChange={(_, nuevo) => onInsumoSeleccionado(nuevo)}
      isOptionEqualToValue={(opt, val) => opt?.id_insumo === val?.id_insumo}
      renderOption={(props, option) => {
        const stock = getStockFromInventarios(
          option?.inventario,
          resolvedSucursalId
        );
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
                {isFetching && <CircularProgress size={18} />}
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
  idSucursal: PropTypes.number,
};

export default SelectorInsumo;
