import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetPendientesQuery,
  useInspeccionarMutation,
} from "../../store/services/productoRetornableApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import ProductoRetornableCard from "../../components/producto_retornable/ProductoRetornableCard";
import Header from "../../components/common/Header";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import SucursalPickerHeader from "../../components/common/SucursalPickerHeader";

const InspeccionRetornables = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.scope);
  const sucursalActiva = useSucursalActiva();
  const canChooseSucursal = mode === "global";

  const { data: sucursales } = useGetAllSucursalsQuery();

  const [idSucursal, setIdSucursal] = useState(
    sucursalActiva?.id_sucursal ?? null
  );
  useEffect(() => {
    if (!canChooseSucursal) {
      setIdSucursal(sucursalActiva?.id_sucursal ?? null);
    }
  }, [canChooseSucursal, sucursalActiva?.id_sucursal]);

  const [origen, setOrigen] = useState("ventas");

  const {
    data: pendientes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPendientesQuery(
    { id_sucursal_recepcion: idSucursal, origen },
    { skip: !idSucursal }
  );

  const [inspeccionar, { isLoading: enviando }] = useInspeccionarMutation();

  const pendientesList = useMemo(() => {
    if (!pendientes) return [];
    return Array.isArray(pendientes) ? pendientes : pendientes?.data || [];
  }, [pendientes]);

  const filteredPendientes = useMemo(() => {
    const list = pendientesList || [];
    return list
      .filter((it) =>
        idSucursal
          ? Number(it.id_sucursal_recepcion) === Number(idSucursal)
          : true
      )
      .filter((it) =>
        origen === "ventas" ? it?.id_venta != null : it?.id_venta == null
      );
  }, [pendientesList, idSucursal, origen]);

  const [agrupados, setAgrupados] = useState([]);
  useEffect(() => {
    if (isFetching) return;
    if (!filteredPendientes.length) {
      setAgrupados([]);
      return;
    }

    const map = new Map();
    filteredPendientes.forEach((raw) => {
      const isProducto = Boolean(raw?.Producto?.id_producto);
      const key = isProducto
        ? String(raw.Producto.id_producto)
        : `insumo-${raw?.Insumo?.id_insumo}`;

      const nombre =
        raw?.Producto?.nombre_producto || raw?.Insumo?.nombre || "Retornable";

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nombreProducto: nombre,
          items: [],
        });
      }
      const grupo = map.get(key);

      const idInsumoDestinoDefault = raw?.Producto?.id_insumo_retorno || null;
      const insumoDestinoNombre =
        raw?.Producto?.insumo_retorno?.nombre_insumo || null;

      const cacheKey = `${idSucursal}:${origen}:${raw.id_producto_retornable}`;
      const saved = editsRef.current.get(cacheKey) || {};

      grupo.items.push({
        ...raw,
        reutilizable: saved.reutilizable ?? 0,
        fallas: saved.fallas ?? [],
        id_insumo_destino: saved.id_insumo_destino ?? idInsumoDestinoDefault,
        _insumoDestinoFijo: Boolean(idInsumoDestinoDefault),
        _insumoDestinoNombre: insumoDestinoNombre,
      });
    });

    setAgrupados(Array.from(map.values()));
  }, [filteredPendientes, isFetching, idSucursal, origen]);

  const editsRef = useRef(new Map());

  const handleUpdate = (grupoId, idx, field, value) => {
    setAgrupados((prev) => {
      const gIdx = prev.findIndex((g) => g.id === grupoId);
      const itemId =
        gIdx >= 0 ? prev[gIdx]?.items?.[idx]?.id_producto_retornable : null;
      const next = prev.map((g) =>
        g.id === grupoId
          ? {
              ...g,
              items: g.items.map((it, i) =>
                i === idx
                  ? {
                      ...it,
                      [field]:
                        field === "reutilizable" ? Number(value) || 0 : value,
                    }
                  : it
              ),
            }
          : g
      );

      if (itemId) {
        const cacheKey = `${idSucursal}:${origen}:${itemId}`;
        const prevEdit = editsRef.current.get(cacheKey) || {};
        editsRef.current.set(cacheKey, {
          ...prevEdit,
          [field]: field === "reutilizable" ? Number(value) || 0 : value,
        });
      }
      return next;
    });
  };

  const validarAntesDeEnviar = () => {
    for (const g of agrupados) {
      for (const it of g.items) {
        const reutil = Number(it.reutilizable) || 0;
        if (reutil > 0 && !it.id_insumo_destino) {
          const nombre = it?.Producto?.nombre_producto || g.nombreProducto;
          dispatch(
            showNotification({
              message: `El producto "${nombre}" no tiene insumo de retorno configurado (id_insumo_retorno) y tiene cantidad reutilizable > 0.`,
              severity: "warning",
            })
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validarAntesDeEnviar()) return;

      const items = [];

      agrupados.forEach((g) => {
        g.items.forEach((it) => {
          const defectuosos = (it.fallas || []).filter((f) => f.cantidad > 0);
          const reutilizable = Number(it.reutilizable) || 0;
          const totalDef = defectuosos.reduce(
            (s, f) => s + (Number(f.cantidad) || 0),
            0
          );
          const total = reutilizable + totalDef;

          if (total > 0) {
            items.push({
              id_producto_retornable: it.id_producto_retornable,
              reutilizable,
              id_insumo_destino: it.id_insumo_destino || null,
              defectuosos,
            });
          }
        });
      });

      if (items.length === 0) {
        dispatch(
          showNotification({
            message: "Debes asignar cantidades a inspeccionar.",
            severity: "info",
          })
        );
        return;
      }

      console.log({ id_sucursal_inspeccion: idSucursal, items })

      await inspeccionar({ id_sucursal_inspeccion: idSucursal, items }).unwrap();

      dispatch(
        showNotification({
          message: "Inspección registrada correctamente",
          severity: "success",
        })
      );
      refetch();
      setAgrupados([]);
    } catch (err) {
      dispatch(
        showNotification({
          message:
            err?.data?.error || err?.message || "Error al registrar inspección",
          severity: "error",
        })
      );
    }
  };

  const sucursalActual = useMemo(() => {
    if (!idSucursal) return null;
    return (sucursales || []).find(
      (s) => Number(s.id_sucursal) === Number(idSucursal)
    );
  }, [sucursales, idSucursal]);

  const sucursalBar = (
    <Box sx={{ mb: 2 }}>
      <SucursalPickerHeader
        sucursales={sucursales || []}
        idSucursal={idSucursal}
        canChoose={canChooseSucursal}
        onChange={(id) => setIdSucursal(id)}
        nombreSucursal={sucursalActual?.nombre}
      />
    </Box>
  );

  const filtrosBar = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="flex-start"
      sx={{ mb: 3 }}
    >
      <ToggleButtonGroup
        value={origen}
        exclusive
        onChange={(_, v) => v && setOrigen(v)}
        size="small"
      >
        <ToggleButton value="ventas">Por Ventas</ToggleButton>
        <ToggleButton value="entregas">Por Entregas</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  if (!idSucursal && !canChooseSucursal) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">
          No hay sucursal activa seleccionada.
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress size={40} />
        <Typography mt={2} fontSize={14} color="text.secondary">
          Cargando productos retornables...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        {filtrosBar}
        <Typography color="error">
          Error al cargar productos retornables pendientes.
        </Typography>
      </Box>
    );
  }

  const isSingle = agrupados.length === 1;

  return (
    <Box sx={{ p: 3, mx: "auto" }}>
      <Header
        title="Inspección de Productos Retornables"
        subtitle="Gestión de Productos Retornables"
      />
      {sucursalBar}
      {filtrosBar}

      {agrupados.length === 0 ? (
        <Typography color="text.secondary">
          No hay productos por inspeccionar.
        </Typography>
      ) : (
        <Fade in>
          {isSingle ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: { xs: "100%", sm: 560, md: 680 } }}>
                <ProductoRetornableCard
                  grupo={agrupados[0]}
                  onUpdate={handleUpdate}
                  useProductoDestino
                />
              </Box>
            </Box>
          ) : (
            <Grid
              container
              spacing={2}
              alignItems="stretch"
              justifyContent="center"
            >
              {agrupados.map((grupo) => (
                <Grid item key={grupo.id} xs={12} md={6} xl={4}>
                  <ProductoRetornableCard
                    grupo={grupo}
                    onUpdate={handleUpdate}
                    useProductoDestino
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Fade>
      )}
      <Box mt={2} textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={enviando}
        >
          {enviando ? "Guardando..." : "Guardar Inspección"}
        </Button>
      </Box>
    </Box>
  );
};

export default InspeccionRetornables;
