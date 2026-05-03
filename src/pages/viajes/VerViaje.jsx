import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import PropTypes from "prop-types";
import { convertirFechaLocal } from "../../utils/fechaUtils";
import { useGetViajeByIdQuery } from "../../store/services/agendaViajesApi";
import { useGetEntregasByAgendaIdQuery } from "../../store/services/entregasApi";
import DestinosWithGoogle from "../../components/viaje/DestinosWithGoogle";
import { useUbicacionChoferTiempoReal } from "../../hooks/useUbicacionChoferSocket";
import BackButton from "../../components/common/BackButton";
import { useSelector } from "react-redux";
import Box from "../../components/common/CompatBox";
import Stack from "../../components/common/CompatStack";
import Typography from "../../components/common/CompatTypography";

const panelSx = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.07)",
  bgcolor: "background.paper",
};

const estadoColor = {
  Pendiente: "default",
  "En Tránsito": "info",
  Finalizado: "success",
  Cancelado: "error",
};

function formatDate(value) {
  if (!value) return "Sin registro";
  return convertirFechaLocal(value, "DD-MM-YYYY HH:mm");
}

function getChoferName(viaje) {
  const nombre = `${viaje?.chofer?.nombre || ""} ${
    viaje?.chofer?.apellido || ""
  }`.trim();
  const nombreAlternativo =
    viaje?.chofer?.nombre_completo ||
    viaje?.chofer?.nombreCompleto ||
    viaje?.chofer_nombre ||
    viaje?.nombre_chofer ||
    "";
  return nombre || nombreAlternativo || "Sin nombre";
}

function getChoferRut(viaje) {
  return viaje?.chofer?.rut || viaje?.id_chofer || "Sin RUT";
}

function getChoferDisplay(viaje) {
  const nombre = getChoferName(viaje);
  const rut = getChoferRut(viaje);

  if (!rut || rut === "Sin RUT") return `Chofer: ${nombre}`;
  if (!nombre || nombre === "Sin nombre" || nombre === rut) {
    return `Chofer RUT ${rut}`;
  }
  return `Chofer: ${nombre} · RUT ${rut}`;
}

function getCamionLabel(viaje) {
  const placa = viaje?.camion?.placa;
  const id = viaje?.id_camion;
  if (placa && id) return `${placa} · ID ${id}`;
  return placa || (id ? `Camión ${id}` : "Sin camión");
}

function getErrorMessage(error) {
  if (!error) return "Error desconocido";
  if (typeof error === "string") return error;
  return (
    error?.data?.error ||
    error?.data?.message ||
    error?.message ||
    "Error desconocido"
  );
}

function MetricItem({ icon, label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "rgba(15, 23, 42, 0.025)",
        minWidth: 0,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0F172A",
            bgcolor: "rgba(15, 23, 42, 0.06)",
            flex: "0 0 auto",
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography fontWeight={800} noWrap>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

MetricItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function StopMarker({ index, delivered, showTopConnector, showBottomConnector }) {
  const showConnector = showTopConnector || showBottomConnector;

  return (
    <Box
      sx={{
        position: "relative",
        flex: "0 0 32px",
        width: 32,
        minHeight: 58,
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {showConnector && (
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: showTopConnector ? 0 : 34,
            bottom: showBottomConnector ? 0 : "calc(100% - 16px)",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "2px dashed",
            borderColor: "rgba(100, 116, 139, 0.34)",
          }}
        />
      )}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: delivered ? "#fff" : "#0F172A",
          bgcolor: delivered ? "#16a34a" : "#f8fafc",
          border: delivered ? "2px solid #fff" : "1px solid #cbd5e1",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.14)",
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {delivered ? "✓" : index + 1}
      </Box>
    </Box>
  );
}

StopMarker.propTypes = {
  index: PropTypes.number.isRequired,
  delivered: PropTypes.bool.isRequired,
  showTopConnector: PropTypes.bool.isRequired,
  showBottomConnector: PropTypes.bool.isRequired,
};

function StopRow({ destino, index, total, entregas }) {
  const infoEntrega = entregas[destino.id_pedido] || {};
  const entregado = Boolean(infoEntrega.entregado);
  const horaEntrega = infoEntrega.hora;

  return (
    <Box sx={{ display: "flex", gap: 1.25, alignItems: "stretch" }}>
      <StopMarker
        index={index}
        delivered={entregado}
        showTopConnector={index > 0}
        showBottomConnector={index < total - 1}
      />
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          minWidth: 0,
          p: 1.25,
          borderRadius: 1,
          bgcolor: entregado
            ? alpha("#16a34a", 0.045)
            : "rgba(15, 23, 42, 0.025)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "minmax(0, 1fr) 132px",
            },
            columnGap: 1.5,
            rowGap: 1,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} noWrap>
              {destino.nombre_cliente || "Cliente sin nombre"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pedido #{destino.id_pedido}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {destino.direccion}
            </Typography>
            {destino.notas && (
              <Typography variant="caption" color="text.secondary">
                {destino.notas}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: { xs: "auto", sm: 132 },
              justifySelf: { xs: "start", sm: "end" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              gap: 0.5,
              pt: 0.25,
            }}
          >
            <Chip
              size="small"
              label={entregado ? "Entregado" : "Pendiente"}
              color={entregado ? "success" : "warning"}
              variant={entregado ? "filled" : "outlined"}
              sx={{ fontWeight: 700 }}
            />
            {entregado && (
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign={{ xs: "left", sm: "right" }}
                sx={{ lineHeight: 1.2 }}
              >
                {formatDate(horaEntrega)}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

StopRow.propTypes = {
  destino: PropTypes.shape({
    id_pedido: PropTypes.number.isRequired,
    nombre_cliente: PropTypes.string,
    direccion: PropTypes.string,
    notas: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  entregas: PropTypes.object.isRequired,
};

const VerViaje = () => {
  const { id } = useParams();

  const {
    data: viaje,
    isLoading,
    error,
    refetch: refetchViaje,
  } = useGetViajeByIdQuery(id);
  const {
    data: entregasData,
    refetch: refetchEntregas,
    isLoading: loadingEntregas,
    error: errorEntregas,
  } = useGetEntregasByAgendaIdQuery({ id_agenda_viaje: id }, { skip: !id });

  const [ruta, setRuta] = useState(null);
  const [recorridoReal, setRecorridoReal] = useState(null);
  const [dataListos, setDataListos] = useState(false);
  const [entregas, setEntregas] = useState({});

  const rol = useSelector((state) => state?.auth?.rol);

  useEffect(() => {
    if (!viaje || !entregasData?.data) return;
    const destinos = Array.isArray(viaje.destinos) ? viaje.destinos : [];
    const entregasPorPedido = {};
    entregasData.data.forEach((entrega) => {
      const idPedido = entrega?.pedido?.id_pedido;
      if (idPedido) entregasPorPedido[idPedido] = entrega;
    });

    const entregasObj = {};
    destinos.forEach((destino) => {
      const entrega = entregasPorPedido[destino.id_pedido];
      entregasObj[destino.id_pedido] = {
        entregado: Boolean(entrega),
        hora: entrega?.fecha_hora || null,
        notas: destino.notas,
        nombre_cliente: destino.nombre_cliente,
        direccion: destino.direccion,
      };
    });

    setEntregas(entregasObj);

    const destinosEntregadosConCoords = destinos
      .filter(
        (d) =>
          entregasPorPedido[d.id_pedido] &&
          typeof d.lat === "number" &&
          typeof d.lng === "number"
      )
      .sort((a, b) => {
        const entregaA = entregasPorPedido[a.id_pedido];
        const entregaB = entregasPorPedido[b.id_pedido];
        return (
          new Date(entregaA.fecha_hora).getTime() -
          new Date(entregaB.fecha_hora).getTime()
        );
      })
      .map((d) => ({
        lat: d.lat,
        lng: d.lng,
        nombre_cliente: d.nombre_cliente,
        direccion: d.direccion,
        hora: entregasPorPedido[d.id_pedido]?.fecha_hora || null,
        id_pedido: d.id_pedido,
      }));

    const origenValido =
      viaje.origen_inicial &&
      typeof viaje.origen_inicial.lat === "number" &&
      typeof viaje.origen_inicial.lng === "number"
        ? {
            lat: viaje.origen_inicial.lat,
            lng: viaje.origen_inicial.lng,
            nombre_cliente: "Origen",
            direccion: viaje.origen_inicial.direccion,
            hora: null,
          }
        : null;

    const newRecorridoReal = [
      ...(origenValido ? [origenValido] : []),
      ...destinosEntregadosConCoords,
    ];

    const newRuta = [
      ...(origenValido ? [origenValido] : []),
      ...destinos
        .filter((d) => typeof d.lat === "number" && typeof d.lng === "number")
        .map((d) => ({
          lat: d.lat,
          lng: d.lng,
          nombre_cliente: d.nombre_cliente,
          direccion: d.direccion,
          id_pedido: d.id_pedido,
        })),
    ];

    setRuta(newRuta);
    setRecorridoReal(newRecorridoReal);
    setDataListos(true);
  }, [viaje, entregasData]);

  useEffect(() => {
    function onEntregaRegistrada(data) {
      if (`${data.id_agenda_viaje}` === `${id}`) {
        if (typeof refetchEntregas === "function") {
          refetchEntregas();
        }
      }
    }

    socket.on("entrega_registrada", onEntregaRegistrada);
    return () => socket.off("entrega_registrada", onEntregaRegistrada);
  }, [id, refetchEntregas]);

  useEffect(() => {
    const onNoti = (evt) => {
      if (evt?.tipo === "pedido_confirmado") {
        if (
          !evt?.datos_adicionales?.id_agenda_viaje ||
          `${evt.datos_adicionales.id_agenda_viaje}` === `${id}`
        ) {
          refetchViaje?.();
        }
      }
      if (
        evt?.tipo === "pedido_entregado" &&
        `${evt?.datos_adicionales?.id_agenda_viaje}` === `${id}`
      ) {
        refetchEntregas?.();
      }
    };
    socket.on("nueva_notificacion", onNoti);
    return () => socket.off("nueva_notificacion", onNoti);
  }, [id, refetchViaje, refetchEntregas]);

  const rutChofer = viaje?.id_chofer || viaje?.chofer?.rut;
  const ubicacionEnVivo = useUbicacionChoferTiempoReal(rutChofer);

  if (isLoading || loadingEntregas || !dataListos)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress size={36} />
        <Typography mt={2}>Cargando información del viaje...</Typography>
      </Box>
    );

  if (error || !viaje || errorEntregas)
    return (
      <Box p={4} textAlign="center">
        <Typography color="error" variant="h6">
          Error al cargar: {getErrorMessage(error || errorEntregas)}
        </Typography>
      </Box>
    );

  const destinosViaje = Array.isArray(viaje.destinos) ? viaje.destinos : [];
  const totalDestinos = destinosViaje.length;
  const entregasCompletadas = Object.values(entregas).filter(
    (e) => e.entregado
  ).length;
  const pendientes = Math.max(totalDestinos - entregasCompletadas, 0);
  const progreso = totalDestinos
    ? Math.round((entregasCompletadas / totalDestinos) * 100)
    : 0;
  const viajeFinalizado = viaje?.estado === "Finalizado";
  const tieneSenalChofer = Boolean(ubicacionEnVivo && !viajeFinalizado);

  return (
    <Box maxWidth="xl" mx="auto" px={{ xs: 1.25, md: 3 }} py={{ xs: 2, md: 3 }}>
      <BackButton
        to={rol === "administrador" ? "/admin/viajes" : "/viajes"}
        label="Volver"
      />

      <Paper elevation={0} sx={{ ...panelSx, p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.5}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="h5" fontWeight={900}>
                Viaje #{viaje.id_agenda_viaje}
              </Typography>
              <Chip
                label={viaje.estado}
                color={estadoColor[viaje.estado] || "default"}
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <Chip
                label={
                  viajeFinalizado
                    ? "Tracking finalizado"
                    : tieneSenalChofer
                    ? "Chofer en vivo"
                    : "Esperando ubicación"
                }
                color={tieneSenalChofer ? "success" : "default"}
                variant={tieneSenalChofer ? "filled" : "outlined"}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {getChoferDisplay(viaje)}
            </Typography>
          </Box>

          <Box sx={{ width: { xs: "100%", md: 280 } }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Avance de entregas
              </Typography>
              <Typography variant="caption" fontWeight={800}>
                {progreso}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progreso}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: "rgba(15, 23, 42, 0.08)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 1,
                  bgcolor: "#0F172A",
                },
              }}
            />
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1,
            mt: 1.5,
          }}
        >
          <MetricItem
            icon={<LocalShippingIcon fontSize="small" />}
            label="Camión"
            value={getCamionLabel(viaje)}
          />
          <MetricItem
            icon={<RouteOutlinedIcon fontSize="small" />}
            label="Ruta"
            value={`${totalDestinos} destinos`}
          />
          <MetricItem
            icon={<PlaceOutlinedIcon fontSize="small" />}
            label="Entregas"
            value={`${entregasCompletadas}/${totalDestinos}`}
          />
          <MetricItem
            icon={<AccessTimeIcon fontSize="small" />}
            label="Inicio"
            value={formatDate(viaje.fecha_inicio)}
          />
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.45fr) minmax(340px, 0.75fr)",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Paper elevation={0} sx={{ ...panelSx, p: { xs: 1.25, md: 1.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
            sx={{ mb: 1.25 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Mapa del recorrido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ruta, entregas y posición en tiempo real del chofer
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<RouteOutlinedIcon />}
                label={`${totalDestinos} destinos`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label={`${pendientes} pendientes`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          </Stack>

          {dataListos && ruta.length > 0 ? (
            <DestinosWithGoogle
              ruta={ruta}
              recorridoReal={recorridoReal}
              terminado={viajeFinalizado}
              ubicacionActualChofer={ubicacionEnVivo}
            />
          ) : (
            <Box
              sx={{
                height: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(15, 23, 42, 0.025)",
                borderRadius: 1.5,
                color: "text.secondary",
                fontWeight: 700,
              }}
            >
              Cargando mapa y destinos...
            </Box>
          )}
        </Paper>

        <Card elevation={0} sx={{ ...panelSx }}>
          <CardContent
            sx={{
              p: { xs: 1.25, md: 1.5 },
              "&:last-child": { pb: { xs: 1.25, md: 1.5 } },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  Paradas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado operativo del viaje
                </Typography>
              </Box>
              <Chip
                icon={<CheckCircleOutlineOutlinedIcon />}
                label={`${entregasCompletadas} listas`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Divider sx={{ mb: 1.25 }} />

            {totalDestinos === 0 ? (
              <Typography color="text.secondary">
                No hay destinos registrados para este viaje.
              </Typography>
            ) : (
              <Box
                sx={{
                  maxHeight: { xs: 440, lg: 610 },
                  overflowY: "auto",
                  pr: 0.5,
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <Stack spacing={1}>
                  {destinosViaje.map((destino, index) => (
                    <StopRow
                      key={destino.id_pedido}
                      destino={destino}
                      index={index}
                      total={totalDestinos}
                      entregas={entregas}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {viaje.notas && (
        <Paper elevation={0} sx={{ ...panelSx, p: 1.5, mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={800}>
            Notas del viaje
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {viaje.notas}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VerViaje;
