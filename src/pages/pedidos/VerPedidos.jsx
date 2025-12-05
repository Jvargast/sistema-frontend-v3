import { useState, useEffect, useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetAllPedidosQuery,
  useAsignarPedidoMutation,
  useDesasignarPedidoMutation,
  useToggleMostrarEnTableroMutation,
} from "../../store/services/pedidosApi";
import { useGetAllChoferesQuery } from "../../store/services/usuariosApi";
import Column from "../../components/chofer/Column";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import EmptyColumn from "../../components/chofer/EmptyColumn";
import { useIsMobile } from "../../utils/useIsMobile";
import MobilePedidosBoard from "./MobilePedidosBoard";
import { useSelector } from "react-redux";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import { useNavigate } from "react-router";

const getPedidoSucursalId = (p) =>
  Number(
    p?.id_sucursal ??
      p?.Sucursal?.id_sucursal ??
      p?.sucursal?.id_sucursal ??
      NaN
  );

const userOperaEnSucursal = (u, targetId) =>
  Number(
    u?.Sucursal?.id_sucursal ??
      u?.id_sucursal ??
      u?.SucursalAsignada?.id_sucursal ??
      NaN
  ) === Number(targetId) ||
  (u?.cajasAsignadas ?? []).some(
    (c) => Number(c.id_sucursal) === Number(targetId)
  );

const PedidosBoard = () => {
  const navigate = useNavigate();
  const {
    mode,
    activeSucursalId,
    sucursales = [],
  } = useSelector((s) => s.scope);
  const [sucursalFiltro, setSucursalFiltro] = useState("");

  useEffect(() => {
    const next = mode === "global" ? "" : String(activeSucursalId ?? "");
    setSucursalFiltro((prev) => (prev === next ? prev : next));
  }, [mode, activeSucursalId]);

  //eslint-disable-next-line
  const sucursalesList = sucursales ?? [];

  const targetSucursalId =
    mode === "global"
      ? sucursalFiltro
        ? Number(sucursalFiltro)
        : null
      : activeSucursalId
      ? Number(activeSucursalId)
      : null;

  const queryArgs = useMemo(() => {
    if (targetSucursalId)
      return {
        id_sucursal: targetSucursalId,
        page: 1,
        limit: 200,
        soloTablero: true,
      };
    if (mode === "global") return { page: 1, limit: 200, soloTablero: true };
    return skipToken;
  }, [targetSucursalId, mode]);

  const choferesArgs = useMemo(
    () => (targetSucursalId ? { id_sucursal: targetSucursalId } : skipToken),
    [targetSucursalId]
  );
  const [toggleMostrarEnTablero] = useToggleMostrarEnTableroMutation();

  const isMobile = useIsMobile();
  const {
    data: allPedidosData,
    isLoading: allPedidosLoading,
    refetch: refetchPedidos,
  } = useGetAllPedidosQuery(queryArgs, { refetchOnMountOrArgChange: true });

  const {
    data: choferesData = [],
    isLoading: choferesLoading,
    refetch: refetchChoferes,
  } = useGetAllChoferesQuery(choferesArgs, { refetchOnMountOrArgChange: true });

  const handleVerDetalle = (pedido) => {
    navigate(`/admin/pedidos/ver/${pedido.id_pedido}`);
  };

  const handleSacarDeTablero = async (pedido) => {
    try {
      await toggleMostrarEnTablero({
        id_pedido: pedido.id_pedido,
        mostrar_en_tablero: false,
      }).unwrap();
      dispatch(
        showNotification({
          message: `Pedido #${pedido.id_pedido} sacado del tablero`,
          severity: "success",
        })
      );
    } catch (e) {
      dispatch(
        showNotification({
          message: `No se pudo sacar del tablero: ${e}`,
          severity: "error",
        })
      );
    }
  };

  useRegisterRefresh(
    "",
    async () => {
      await Promise.all([refetchPedidos(), refetchChoferes()]);
      return true;
    },
    [refetchPedidos, refetchChoferes]
  );

  const derivedSucursales = useMemo(() => {
    const map = new Map();
    (allPedidosData?.pedidos ?? []).forEach((p) => {
      const id = getPedidoSucursalId(p);
      if (!id) return;
      const nombre = p?.Sucursal?.nombre ?? `Sucursal ${id}`;
      if (!map.has(id)) map.set(id, nombre);
    });
    return Array.from(map, ([id_sucursal, nombre]) => ({
      id_sucursal,
      nombre,
    }));
  }, [allPedidosData]);

  const opcionesSucursales = useMemo(() => {
    const map = new Map();

    (Array.isArray(sucursales) ? sucursales : []).forEach((s) => {
      const id = Number(s?.id_sucursal);
      if (!id) return;
      map.set(id, {
        id_sucursal: id,
        nombre: (s?.nombre || `Sucursal ${id}`).trim(),
      });
    });

    (Array.isArray(derivedSucursales) ? derivedSucursales : []).forEach((s) => {
      const id = Number(s?.id_sucursal);
      if (!id || map.has(id)) return;
      map.set(id, {
        id_sucursal: id,
        nombre: (s?.nombre || `Sucursal ${id}`).trim(),
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.nombre).localeCompare(String(b.nombre))
    );
  }, [sucursales, derivedSucursales]);

  const [asignarPedido] = useAsignarPedidoMutation();
  const [desasignarPedido] = useDesasignarPedidoMutation();

  const [columnsState, setColumnsState] = useState({
    sinAsignar: [],
  });

  const dispatch = useDispatch();

  const choferesFiltrados = useMemo(() => {
    const base = Array.isArray(choferesData) ? choferesData : [];
    if (!targetSucursalId) return [];
    return base.filter((u) => userOperaEnSucursal(u, targetSucursalId));
  }, [choferesData, targetSucursalId]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const prevColumnsState = columnsState;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId && source.index === destination.index) {
      return;
    }

    const original = columnsState[sourceId][source.index];

    const movedItem = {
      ...original,
      EstadoPedido: original.EstadoPedido ? { ...original.EstadoPedido } : null,
    };

    if (
      sourceId === destId &&
      columnsState[destId].some((p) => p.id_pedido === movedItem.id_pedido)
    ) {
      console.warn("🔁 Intento de soltar en el mismo lugar, se cancela");
      return;
    }

    const newColumns = { ...columnsState };
    const sourceItems = Array.from(newColumns[sourceId]);
    const destItems = Array.from(newColumns[destId]);

    sourceItems.splice(source.index, 1);

    if (destId === "sinAsignar") {
      movedItem.id_chofer = null;
      if (movedItem.EstadoPedido) {
        movedItem.EstadoPedido.nombre_estado = "Pendiente";
      }
    } else {
      movedItem.id_chofer = destId;
      if (movedItem.EstadoPedido) {
        movedItem.EstadoPedido.nombre_estado = "Pendiente de Confirmación";
      }
    }

    destItems.splice(destination.index, 0, movedItem);

    newColumns[sourceId] = sourceItems;
    newColumns[destId] = destItems;

    setColumnsState(newColumns);

    try {
      if (destId === "sinAsignar") {
        await desasignarPedido(movedItem.id_pedido).unwrap();
        dispatch(
          showNotification({
            message: `Pedido #${movedItem.id_pedido} desasignado`,
            severity: "success",
            duration: 3000,
          })
        );
      } else {
        await asignarPedido({
          id_pedido: movedItem.id_pedido,
          id_chofer: destId,
        }).unwrap();
        dispatch(
          showNotification({
            message: `Pedido #${movedItem.id_pedido} asignado a chofer: ${destId}`,
            severity: "success",
            duration: 3000,
          })
        );
      }
    } catch (error) {
      console.error("❌ Error asignando/desasignando pedido:", error);
      setColumnsState(prevColumnsState);
      dispatch(
        showNotification({
          message: "Ocurrió un error al asignar/desasignar el pedido",
          severity: "error",
          duration: 4000,
        })
      );
    }
  };

  const buildColumns = useMemo(() => {
    if (!targetSucursalId || allPedidosLoading || choferesLoading) return null;

    const allPedidos = allPedidosData?.pedidos || [];
    const allChoferes = Array.isArray(choferesData) ? choferesData : [];

    const choferesFiltrados = targetSucursalId
      ? allChoferes.filter((u) => userOperaEnSucursal(u, targetSucursalId))
      : mode === "global"
      ? []
      : allChoferes;

    const next = { sinAsignar: [] };
    choferesFiltrados.forEach((ch) => {
      next[ch.rut] = [];
    });

    const estadosPermitidos = [
      "Pendiente de Confirmación",
      "Confirmado",
      "Pendiente",
    ];

    const pedidosFiltradosScope = allPedidos.filter(
      (p) => Number(getPedidoSucursalId(p)) === Number(targetSucursalId)
    );

    pedidosFiltradosScope.forEach((pedido) => {
      const estadoNombre = pedido?.EstadoPedido?.nombre_estado;
      if (!estadosPermitidos.includes(estadoNombre)) return;

      const rutChofer = pedido?.Chofer?.rut;

      if (!pedido.id_chofer) {
        next.sinAsignar.push(pedido);
        return;
      }
      if (rutChofer && next[rutChofer]) {
        next[rutChofer].push(pedido);
        return;
      }
      next.sinAsignar.push(pedido);
    });

    return next;
  }, [
    targetSucursalId,
    mode,
    allPedidosLoading,
    choferesLoading,
    allPedidosData,
    choferesData,
  ]);

  useEffect(() => {
    if (!targetSucursalId) {
      setColumnsState((prev) =>
        prev.sinAsignar.length ? { sinAsignar: [] } : prev
      );
      return;
    }
    if (!buildColumns) return;

    const equalColumns = (a, b) => {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;
      for (const k of aKeys) {
        const A = a[k] || [];
        const B = b[k] || [];
        if (A.length !== B.length) return false;
        for (let i = 0; i < A.length; i++) {
          if (A[i]?.id_pedido !== B[i]?.id_pedido) return false;
        }
      }
      return true;
    };

    setColumnsState((prev) =>
      equalColumns(prev, buildColumns) ? prev : buildColumns
    );
  }, [buildColumns, targetSucursalId]);

  useEffect(() => {
    if (mode !== "global") return;
    if (!sucursalFiltro) return;
    const existe = opcionesSucursales.some(
      (s) => String(s.id_sucursal) === String(sucursalFiltro)
    );
    if (!existe) setSucursalFiltro("");
    //eslint-disable-next-line
  }, [mode, opcionesSucursales]);

  if (isMobile) {
    return (
      <MobilePedidosBoard
        columnsState={columnsState}
        choferes={choferesFiltrados}
        asignarPedido={asignarPedido}
        desasignarPedido={desasignarPedido}
        allPedidosLoading={allPedidosLoading}
        choferesLoading={choferesLoading}
        mode={mode}
        sucursales={opcionesSucursales}
        sucursalFiltro={String(sucursalFiltro)}
        onChangeSucursal={setSucursalFiltro}
        onSacarDeTablero={handleSacarDeTablero}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box pb={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2.5,
            pt: 2,
            mb: 4,
            px: 4,
          }}
        >
          {/* TÍTULO + SUBTÍTULO */}
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[100]
                    : theme.palette.text.primary,
                letterSpacing: 0.2,
              }}
            >
              Administración de Pedidos
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600],
              }}
            >
              Gestiona claramente la asignación de pedidos a cada chofer.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "#F5F7FB",
              border: "1px dashed",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[300],
              mt: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[300]
                    : theme.palette.grey[700],
                mb: 0.5,
              }}
            >
              Leyenda estados
            </Typography>

            {/* Pendiente */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.warning.main,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Pendiente
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    ml: 0.5,
                    fontSize: 11,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[600],
                  }}
                >
                  · Pedido creado, sin avanzar.
                </Typography>
              </Typography>
            </Box>

            {/* Pendiente de Confirmación */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#666A75" : "#D7DBDD",
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Pend. de confirmación
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    ml: 0.5,
                    fontSize: 11,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[600],
                  }}
                >
                  · Chofer debe aceptar o rechazar.
                </Typography>
              </Typography>
            </Box>

            {/* Confirmado */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: (theme) => theme.palette.success.light,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Confirmado
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    ml: 0.5,
                    fontSize: 11,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[600],
                  }}
                >
                  · Chofer aceptó el pedido.
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>

        {mode === "global" && (
          <Box sx={{ px: 4, mt: -2, mb: 2, display: "flex", gap: 2 }}>
            <TextField
              select
              size="small"
              label="Sucursal"
              value={String(sucursalFiltro)}
              onChange={(e) => setSucursalFiltro(e.target.value)}
              sx={{ minWidth: 240 }}
            >
              <MenuItem value="">Selecciona una sucursal…</MenuItem>
              {opcionesSucursales.map((s) => (
                <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {mode === "global" && !targetSucursalId && (
          <Box sx={{ px: 4, color: (t) => t.palette.text.secondary, mb: 2 }}>
            Selecciona una sucursal para gestionar la asignación de pedidos.
          </Box>
        )}

        <Box
          sx={
            {
              /* overflowX: "auto" */
            }
          }
        >
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              alignItems: "stretch",
              width: "100%",
              mt: 2,
              mb: 4,
              p: 1,
            }}
          >
            <Column
              droppableId="sinAsignar"
              title={
                <Box>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.text.primary
                          : "#222",
                    }}
                  >
                    Chofer
                  </Typography>
                  <Typography
                    fontSize={13}
                    fontWeight={400}
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[400]
                          : theme.palette.grey[600],
                    }}
                  >
                    Sin Asignar
                  </Typography>
                </Box>
              }
              pedidos={columnsState.sinAsignar || []}
              onVerDetalle={handleVerDetalle}
              onSacarDeTablero={handleSacarDeTablero}
            />

            {(allPedidosLoading || choferesLoading) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[400]
                      : theme.palette.grey[600],
                }}
              >
                Cargando datos...
              </Box>
            )}

            {!choferesLoading &&
              choferesFiltrados?.map((chofer) => (
                <Column
                  key={chofer.rut}
                  droppableId={chofer.rut}
                  title={
                    <Box>
                      <Typography fontWeight="bold">
                        Chofer: {chofer.nombre}
                      </Typography>
                      <Typography
                        fontSize={13}
                        fontWeight={400}
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[400]
                              : theme.palette.grey[600],
                        }}
                      >
                        RUT: {chofer.rut}
                      </Typography>
                    </Box>
                  }
                  pedidos={columnsState[chofer.rut] || []}
                  onVerDetalle={handleVerDetalle}
                  onSacarDeTablero={handleSacarDeTablero}
                />
              ))}
            {!choferesLoading &&
              Array.from({
                length: Math.max(0, 3 - choferesFiltrados.length),
              }).map((_, idx) => <EmptyColumn key={`empty-column-${idx}`} />)}
          </Box>
        </Box>
      </Box>
    </DragDropContext>
  );
};

export default PedidosBoard;
