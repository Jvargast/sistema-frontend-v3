import {
  Box,
  Typography,
  Paper,
  useMediaQuery,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion.create(Box);

const InventarioCamion = ({
  inventarioData,
  modo = "visual",
  productos = [],
  productosReservados = [],
}) => {
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const {
    capacidad_total,
    disponibles,
    reservados_retornables,
    reservados_no_retornables,
    retorno,
    lista,
  } = inventarioData;

  // 🔹 NUEVO: toggle de vista
  const [vista, setVista] = useState("slots"); // "slots" | "productos"

  const columnas = isTablet ? 6 : 10;

  const espaciosReservadosProyectados =
    modo === "simulacion"
      ? productosReservados.reduce((total, prod) => total + prod.cantidad, 0)
      : 0;

  const espaciosUsados =
    reservados_retornables +
    disponibles +
    retorno +
    espaciosReservadosProyectados;

  const espacioRestante = Math.max(capacidad_total - espaciosUsados, 0);

  const retornablesACargarAhoraSinLimitar = productos
    .filter((p) => p.es_retornable)
    .reduce((acc, p) => acc + Number(p.cantidad), 0);

  const retornablesACargarAhora =
    modo === "simulacion"
      ? Math.min(retornablesACargarAhoraSinLimitar, espacioRestante)
      : 0;

  const arrayReservadosCarga =
    modo === "simulacion"
      ? Array(espaciosReservadosProyectados).fill({
          tipo: "ReservadoParaCarga",
        })
      : [];

  const listaAgrupable = Array.isArray(lista)
    ? lista.filter(
        (i) =>
          i.tipo === "Disponible" ||
          i.tipo === "Retorno" ||
          i.tipo === "ReservadoRetornable" ||
          i.tipo === "ReservadoNoRetornable"
      )
    : [];

  const agrupadosPorProducto = Object.values(
    listaAgrupable.reduce((acc, item) => {
      const key = item.nombre_producto || "Sin nombre";
      if (!acc[key]) {
        acc[key] = {
          nombre_producto: key,
          disponible: 0,
          retorno: 0,
          reservado: 0,
          reservadoNoRetornable: 0,
        };
      }
      if (item.tipo === "Disponible") acc[key].disponible += item.cantidad;
      if (item.tipo === "Retorno") acc[key].retorno += item.cantidad;
      if (item.tipo === "ReservadoRetornable")
        acc[key].reservado += item.cantidad;
      if (item.tipo === "ReservadoNoRetornable")
        acc[key].reservadoNoRetornable += item.cantidad;
      return acc;
    }, {})
  );

  let bloques = [];

  if (modo === "visual" && Array.isArray(lista)) {
    const bloquesExpandibles = lista
      .filter((item) => item.tipo !== "ReservadoNoRetornable")
      .flatMap((item) =>
        Array.from({ length: item.cantidad }, () => ({
          tipo: item.tipo,
          nombre_producto: item.nombre_producto,
        }))
      );

    const usados = bloquesExpandibles.length;
    const faltantes = Math.max(capacidad_total - usados, 0);

    bloques = [
      ...bloquesExpandibles,
      ...Array(faltantes).fill({ tipo: "Vacío" }),
    ];
  } else {
    const bloquesBase = [
      ...Array(reservados_retornables).fill({ tipo: "ReservadoRetornable" }),
      ...Array(retornablesACargarAhora).fill({ tipo: "ACargarAhora" }),
      ...Array(disponibles).fill({ tipo: "Disponible" }),
      ...Array(retorno).fill({ tipo: "Retorno" }),
      ...arrayReservadosCarga,
    ];

    // 🔁 CAMBIO: tampoco usamos "orden" aquí
    const usados = bloquesBase.length;
    const faltantes = Math.max(capacidad_total - usados, 0);

    bloques = [...bloquesBase, ...Array(faltantes).fill({ tipo: "Vacío" })];
  }

  const espaciosCamion = bloques.slice(0, capacidad_total);

  const vaciosCalculados = espaciosCamion.filter(
    (b) => b.tipo === "Vacío"
  ).length;

  const getColor = (tipo) => {
    switch (tipo) {
      case "ReservadoRetornable":
        return "orange";
      case "ReservadoNoRetornable":
        return "purple";
      case "Disponible":
        return "green";
      case "Retorno":
        return "blue";
      case "ReservadoParaCarga":
        return "#e57373";
      case "Vacío":
        return "lightgray";
      case "ACargarAhora":
        return "#0097a7";
      default:
        return "gray";
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        textAlign: "center",
        mt: 2,
        overflowX: "auto",
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={2}
        px={1}
        gap={1.5}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              boxShadow: 2,
            }}
          >
            🚛
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "text.primary",
              fontSize: { xs: "1.05rem", sm: "1.25rem" },
              letterSpacing: 0.5,
            }}
          >
            Inventario del Camión
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            Capacidad total:{" "}
            <Typography
              component="span"
              color="primary"
              fontWeight="bold"
              sx={{ fontStyle: "normal" }}
            >
              {capacidad_total} espacios
            </Typography>
          </Typography>

          {/* 🔹 NUEVO: Toggle de vista */}
          <ToggleButtonGroup
            value={vista}
            exclusive
            size="small"
            onChange={(_, v) => v && setVista(v)}
          >
            <ToggleButton value="slots">Por espacios</ToggleButton>
            <ToggleButton value="productos">Por producto</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* ========== VISTA POR ESPACIOS (SLOTS) ========== */}
      {vista === "slots" && (
        <Box
          sx={{
            borderRadius: 3,
            border: "2px dashed rgba(0,0,0,0.12)",
            p: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Box
            display="grid"
            gridTemplateColumns={`repeat(${columnas}, 1fr)`}
            gap={1}
            justifyContent="center"
          >
            {espaciosCamion.map((item, index) => {
              // 🔁 CAMBIO: numeración secuencial global
              const slotNumber = index + 1;
              const prefix = (
                item.nombre_producto?.slice(0, 2) || item.tipo.charAt(0)
              ).toUpperCase();

              const label =
                item.tipo === "Vacío" ? "" : `${prefix}${slotNumber}`;

              return (
                <Tooltip key={index} title={item.nombre_producto || item.tipo}>
                  <MotionBox
                    width={40}
                    height={40}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={getColor(item.tipo)}
                    borderRadius={1}
                    fontSize="0.7rem"
                    fontWeight="bold"
                    animate={
                      item.tipo === "ReservadoParaCarga" ||
                      item.tipo === "ACargarAhora"
                        ? { scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }
                        : {}
                    }
                    transition={
                      item.tipo === "ReservadoParaCarga" ||
                      item.tipo === "ACargarAhora"
                        ? { repeat: Infinity, duration: 2 }
                        : {}
                    }
                  >
                    {label}
                  </MotionBox>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      )}

      {vista === "productos" && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {agrupadosPorProducto.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay productos retornables cargados en este camión.
            </Typography>
          ) : (
            agrupadosPorProducto.map((prod) => {
              const totalRetornables =
                prod.disponible + prod.retorno + prod.reservado;

              const esSoloNoRetornable =
                prod.reservadoNoRetornable > 0 && totalRetornables === 0;

              return (
                <Paper
                  key={prod.nombre_producto}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: "0 4px 10px #00000010",
                    border: "1px solid rgba(0,0,0,0.06)",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 0.5, wordBreak: "break-word" }}
                  >
                    {prod.nombre_producto}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    {esSoloNoRetornable ? (
                      <>
                        Total no retornables:{" "}
                        <strong>{prod.reservadoNoRetornable}</strong>
                      </>
                    ) : (
                      <>
                        Total en camión: <strong>{totalRetornables}</strong>
                      </>
                    )}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mt: 0.5,
                    }}
                  >
                    {!esSoloNoRetornable && (
                      <>
                        <Chip
                          label={`Disp: ${prod.disponible}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(76,175,80,0.12)",
                            color: "green",
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={`Retorno: ${prod.retorno}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(33,150,243,0.12)",
                            color: "blue",
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={`Reservado: ${prod.reservado}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,152,0,0.12)",
                            color: "orange",
                            fontWeight: 600,
                          }}
                        />
                      </>
                    )}

                    {prod.reservadoNoRetornable > 0 && (
                      <Chip
                        label={`No Ret.: ${prod.reservadoNoRetornable}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(156,39,176,0.12)",
                          color: "purple",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
      )}

      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="body2">
          <strong style={{ color: "orange" }}>
            ■ Reservado Retornable: {reservados_retornables}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "purple" }}>
            ■ Reservado No Retornable: {reservados_no_retornables}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "green" }}>
            ■ Disponible: {disponibles}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "blue" }}>■ Retorno: {retorno}</strong>
        </Typography>
        {modo === "simulacion" && (
          <Typography variant="body2">
            <strong style={{ color: "#e57373" }}>
              ■ A cargar (Proyectado): {espaciosReservadosProyectados}
            </strong>
          </Typography>
        )}
        <Typography variant="body2">
          <strong style={{ color: "lightgray" }}>
            ■ Vacío: {vaciosCalculados}
          </strong>
        </Typography>
        {modo === "simulacion" && (
          <Typography variant="body2">
            <strong style={{ color: "#0097a7" }}>
              ■ Retornables a Cargar Ahora: {retornablesACargarAhora}
            </strong>
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

InventarioCamion.propTypes = {
  inventarioData: PropTypes.shape({
    capacidad_total: PropTypes.number,
    disponibles: PropTypes.number,
    reservados_retornables: PropTypes.number,
    reservados_no_retornables: PropTypes.number,
    retorno: PropTypes.number,
    vacios: PropTypes.number,
    lista: PropTypes.array,
  }),
  modo: PropTypes.oneOf(["visual", "simulacion"]),
  productos: PropTypes.array,
  productosReservados: PropTypes.arrayOf(
    PropTypes.shape({
      id_pedido: PropTypes.number,
      id_producto: PropTypes.number,
      nombre_producto: PropTypes.string,
      cantidad: PropTypes.number,
      es_retornable: PropTypes.bool,
    })
  ),
};

export default InventarioCamion;
