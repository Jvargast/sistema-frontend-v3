import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TextField, MenuItem } from "@mui/material";

dayjs.extend(utc);
dayjs.extend(timezone);
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useGetAllViajesQuery } from "../../store/services/agendaViajesApi";
import ViajeCard from "../../components/viaje/ViajeCard";
import BackButton from "../../components/common/BackButton";
import Header from "../../components/common/Header";

const EstadosViaje = ["Todos", "Pendiente", "En Tránsito", "Finalizado"];

function getIdSucursalFromViaje(viaje) {
  return (
    Number(viaje?.id_sucursal) ||
    Number(viaje?.Sucursal?.id_sucursal) ||
    Number(viaje?.sucursal_id) ||
    null
  );
}
const TZ = "America/Santiago";
const toChileYMD = (d) => {
  if (!d) return null;
  const m = dayjs(d);
  if (!m.isValid()) return null;
  return dayjs.tz(d, TZ).format("YYYY-MM-DD");
};

export default function AdminHistorialViajes() {
  const { data: viajes, isLoading, isError } = useGetAllViajesQuery();

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

  const targetSucursalId =
    mode === "global"
      ? sucursalFiltro
        ? Number(sucursalFiltro)
        : null
      : activeSucursalId
      ? Number(activeSucursalId)
      : null;

  const opcionesSucursales = useMemo(() => {
    const byId = new Map();

    (Array.isArray(sucursales) ? sucursales : []).forEach((s) => {
      const id = Number(s?.id_sucursal);
      if (!id) return;
      byId.set(id, {
        id_sucursal: id,
        nombre: String(s?.nombre || `Sucursal ${id}`),
      });
    });

    (Array.isArray(viajes) ? viajes : []).forEach((v) => {
      const id = getIdSucursalFromViaje(v);
      if (!id || byId.has(id)) return;
      byId.set(id, {
        id_sucursal: id,
        nombre: String(v?.Sucursal?.nombre || `Sucursal ${id}`),
      });
    });

    const ensureId = (raw) => {
      if (!raw) return;
      const id = Number(raw);
      if (!id) return;
      if (!byId.has(id))
        byId.set(id, { id_sucursal: id, nombre: `Sucursal ${id}` });
    };
    ensureId(activeSucursalId);
    ensureId(sucursalFiltro);

    return [...byId.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [sucursales, viajes, activeSucursalId, sucursalFiltro]);

  useEffect(() => {
    if (mode !== "global") return;
    if (!sucursalFiltro) return;
    const existe = opcionesSucursales.some(
      (s) => String(s.id_sucursal) === String(sucursalFiltro)
    );
    if (!existe) setSucursalFiltro("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, opcionesSucursales]);

  // \-\-\- Filtros existentes
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroChofer, setFiltroChofer] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const viajesEnScope = useMemo(() => {
    if (!Array.isArray(viajes)) return [];

    if (mode === "global") {
      if (!targetSucursalId) return [];
      return viajes.filter(
        (v) => Number(getIdSucursalFromViaje(v)) === Number(targetSucursalId)
      );
    }

    return viajes.filter(
      (v) => Number(getIdSucursalFromViaje(v)) === Number(activeSucursalId)
    );
  }, [viajes, mode, targetSucursalId, activeSucursalId]);

  const viajesFiltrados = useMemo(() => {
    if (!viajesEnScope.length) return [];

    return viajesEnScope.filter((viaje) => {
      const coincideEstado =
        filtroEstado === "Todos" ||
        String(viaje.estado) === String(filtroEstado);

      const nombre = `${viaje?.chofer?.nombre || ""} ${
        viaje?.chofer?.apellido || ""
      }`
        .trim()
        .toLowerCase();
      const coincideChofer = !filtroChofer
        ? true
        : nombre.includes(String(filtroChofer).toLowerCase());

      const coincideFecha = !filtroFecha
        ? true
        : toChileYMD(
            viaje?.fecha_inicio || viaje?.fecha_hora || viaje?.inicio
          ) === filtroFecha;

      return coincideEstado && coincideChofer && coincideFecha;
    });
  }, [viajesEnScope, filtroEstado, filtroChofer, filtroFecha]);

  return (
    <Box px={2} py={4}>
      <BackButton to="/admin" label="Volver al menú" />
      <Header title="Listado de Viajes" subtitle="Gestión de Viajes Choferes" />

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={2}>
          {mode === "global" && (
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Sucursal"
                value={String(sucursalFiltro)}
                onChange={(e) => setSucursalFiltro(e.target.value)}
              >
                <MenuItem value="">Selecciona una sucursal…</MenuItem>
                {opcionesSucursales.map((s) => (
                  <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                    {s.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12} md={mode === "global" ? 3 : 4}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                label="Estado"
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                {EstadosViaje.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={mode === "global" ? 3 : 4}>
            <TextField
              fullWidth
              size="small"
              label="Buscar chofer"
              value={filtroChofer}
              onChange={(e) => setFiltroChofer(e.target.value)}
              placeholder="Nombre o apellido"
            />
          </Grid>

          <Grid item xs={12} md={mode === "global" ? 3 : 4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Fecha del viaje"
              InputLabelProps={{ shrink: true }}
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                setFiltroEstado("Todos");
                setFiltroChofer("");
                setFiltroFecha("");
              }}
            >
              Reiniciar filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Typography textAlign="center">Cargando viajes...</Typography>
      ) : isError ? (
        <Typography color="error" textAlign="center">
          Error al cargar los viajes.
        </Typography>
      ) : mode === "global" && !targetSucursalId ? (
        <Typography textAlign="center" color="text.secondary">
          Selecciona una sucursal para ver los viajes.
        </Typography>
      ) : viajesFiltrados.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No se encontraron viajes con los filtros aplicados.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {viajesFiltrados.map((viaje) => (
            <Grid item key={viaje.id_agenda_viaje} xs={12} sm={6} md={4}>
              <ViajeCard viaje={viaje} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
