import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
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
import {
  CheckCircleOutlineOutlined,
  InfoOutlined,
  Inventory2Outlined,
  StorefrontOutlined,
} from "@mui/icons-material";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";

const inspectionGridSx = (isSingle) => ({
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 900px)",
    lg: isSingle ? "minmax(0, 900px)" : "repeat(2, minmax(0, 1fr))",
  },
  gap: 1.5,
  alignItems: "stretch",
  justifyContent: "center",
});

const toolbarSx = {
  p: 1.5,
  borderRadius: 1,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "stretch", md: "center" },
  justifyContent: "space-between",
  gap: 1.5,
};

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

  useRegisterRefresh(
    "inventario-camion",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
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

      console.log({ id_sucursal_inspeccion: idSucursal, items });

      await inspeccionar({
        id_sucursal_inspeccion: idSucursal,
        items,
      }).unwrap();

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

  const resumenInspeccion = useMemo(() => {
    const totalRegistros = agrupados.reduce(
      (total, grupo) => total + (grupo.items?.length || 0),
      0
    );
    const totalUnidades = agrupados.reduce(
      (total, grupo) =>
        total +
        (grupo.items || []).reduce(
          (subtotal, item) => subtotal + (Number(item.cantidad) || 0),
          0
        ),
      0
    );

    return {
      grupos: agrupados.length,
      registros: totalRegistros,
      unidades: totalUnidades,
    };
  }, [agrupados]);

  const faltanInsumosRetorno = useMemo(
    () =>
      agrupados.some((grupo) =>
        (grupo.items || []).some((item) => !item._insumoDestinoFijo)
      ),
    [agrupados]
  );

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
    <Box sx={{ ...toolbarSx, mb: 2 }}>
      <Box>
        <Typography variant="subtitle2" fontWeight={900}>
          Origen de retorno
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Filtra la bandeja según el origen operativo.
        </Typography>
      </Box>
      <ToggleButtonGroup
        value={origen}
        exclusive
        onChange={(_, v) => v && setOrigen(v)}
        size="small"
        sx={{
          "& .MuiToggleButton-root": {
            px: 1.5,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 800,
            whiteSpace: "nowrap",
            "&.Mui-selected": {
              bgcolor: "#0F172A",
              color: "#fff",
              "&:hover": {
                bgcolor: "#111827",
              },
            },
          },
        }}
      >
        <ToggleButton value="ventas">Ventas</ToggleButton>
        <ToggleButton value="entregas">Entregas</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  if (!idSucursal && !canChooseSucursal) {
    return (
      <Box sx={{ p: 3 }}>
        <Box
          component="div"
          sx={{
            p: 3,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <StorefrontOutlined
            sx={{ fontSize: 42, color: "action.disabled", mb: 1 }}
          />
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{ fontWeight: 600 }}
          >
            Sin sucursal activa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tu sesión no tiene una sucursal asignada actualmente.
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <InfoOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Contacta a un administrador para que te asigne una sucursal.
            </Typography>
          </Box>
        </Box>
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
    <Box sx={{ p: { xs: 2, md: 3 }, mx: "auto", maxWidth: 1240 }}>
      <Box
        display="flex"
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
        mb={2}
      >
        <Header
          title="Gestión de retorno"
          subtitle="Inspección de productos retornables"
        />
        <Chip
          icon={<Inventory2Outlined />}
          label={`${resumenInspeccion.unidades} unidades pendientes`}
          variant="outlined"
          sx={{ borderRadius: 1, fontWeight: 900, bgcolor: "background.paper" }}
        />
      </Box>

      {sucursalBar}
      {filtrosBar}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        {[
          { label: "Productos", value: resumenInspeccion.grupos },
          { label: "Registros", value: resumenInspeccion.registros },
          { label: "Unidades", value: resumenInspeccion.unidades },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              p: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={800}>
              {item.label}
            </Typography>
            <Typography variant="h5" fontWeight={900} sx={{ lineHeight: 1.15 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {isFetching && (
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Actualizando pendientes...
          </Typography>
        </Box>
      )}

      {agrupados.length === 0 ? (
        <Box
          sx={{
            p: 3,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
            textAlign: "center",
          }}
        >
          <CheckCircleOutlineOutlined
            sx={{ fontSize: 38, color: "text.secondary", mb: 1 }}
          />
          <Typography variant="subtitle2" fontWeight={900}>
            No hay productos por inspeccionar
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            La bandeja de retorno está al día para el filtro seleccionado.
          </Typography>
        </Box>
      ) : (
        <Fade in>
          <Box sx={inspectionGridSx(isSingle)}>
            {agrupados.map((grupo) => (
              <ProductoRetornableCard
                key={grupo.id}
                grupo={grupo}
                onUpdate={handleUpdate}
              />
            ))}
          </Box>
        </Fade>
      )}

      <Box
        mt={2}
        sx={{
          p: 1.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={900}>
            {faltanInsumosRetorno
              ? "Falta configurar el insumo de retorno"
              : "Registrar inspección"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {faltanInsumosRetorno
              ? "Completa la configuración del producto antes de guardar esta inspección."
              : "Asigna reutilizables y defectuosos antes de guardar."}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={enviando || agrupados.length === 0 || faltanInsumosRetorno}
          sx={{
            borderRadius: 1,
            minWidth: { xs: "100%", sm: 190 },
            fontWeight: 900,
            bgcolor: "#0F172A",
            "&:hover": {
              bgcolor: "#111827",
            },
          }}
        >
          {enviando ? "Guardando..." : "Guardar inspección"}
        </Button>
      </Box>
    </Box>
  );
};

export default InspeccionRetornables;
