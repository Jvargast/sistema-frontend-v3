import { Box, Typography, Paper, useMediaQuery, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
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
    vacios,
    lista,
  } = inventarioData;

  console.log(inventarioData);

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

  /*   let bloques = [
    ...Array(reservados_retornables).fill({ tipo: "ReservadoRetornable" }),
    ...Array(reservados_no_retornables).fill({ tipo: "ReservadoNoRetornable" }),
    ...Array(retornablesACargarAhora).fill({ tipo: "ACargarAhora" }),
    ...Array(disponibles).fill({ tipo: "Disponible" }),
    ...Array(retorno).fill({ tipo: "Retorno" }),
    ...arrayReservadosCarga,
  ]; */

  let bloques = [];

  if (modo === "visual" && Array.isArray(inventarioData.lista)) {
    bloques = [...inventarioData.lista];
  } else {
    bloques = [
      ...Array(reservados_retornables).fill({ tipo: "ReservadoRetornable" }),
      ...Array(reservados_no_retornables).fill({
        tipo: "ReservadoNoRetornable",
      }),
      ...Array(retornablesACargarAhora).fill({ tipo: "ACargarAhora" }),
      ...Array(disponibles).fill({ tipo: "Disponible" }),
      ...Array(retorno).fill({ tipo: "Retorno" }),
      ...arrayReservadosCarga,
    ];
  }

  bloques = bloques.slice(0, capacidad_total);

  const faltantes = capacidad_total - bloques.length;
  if (faltantes > 0) {
    bloques = [...bloques, ...Array(faltantes).fill({ tipo: "Vacío" })];
  }

  /*   let espaciosCamion =
    modo === "visual" && Array.isArray(inventarioData.lista)
      ? inventarioData.lista
      : bloques.slice(0, capacidad_total); */

  let espaciosCamion = [];

  if (modo === "visual" && Array.isArray(lista)) {
    const bloquesExpandibles = lista.flatMap((item) =>
      Array.from({ length: item.cantidad }, (_, i) => ({
        tipo: item.tipo,
        nombre_producto: item.nombre_producto,
        orden: i + 1,
      }))
    );

    const usados = bloquesExpandibles.length;
    const faltantes = Math.max(capacidad_total - usados, 0);
    espaciosCamion = [
      ...bloquesExpandibles,
      ...Array(faltantes).fill({ tipo: "Vacío" }),
    ];
  } else {
    const bloquesExpandibles = bloques.flatMap((item, i) =>
      item.tipo === "ReservadoParaCarga" || item.tipo === "ACargarAhora"
        ? [{ ...item, orden: i + 1 }]
        : [item]
    );
    const usados = bloquesExpandibles.length;
    const faltantes = Math.max(capacidad_total - usados, 0);
    espaciosCamion = [
      ...bloquesExpandibles,
      ...Array(faltantes).fill({ tipo: "Vacío" }),
    ];
  }

  /*   const faltantes = capacidad_total - espaciosCamion.length; */
  /*   if (faltantes > 0) {
    espaciosCamion = [
      ...espaciosCamion,
      ...Array(faltantes).fill({ tipo: "Vacío" }),
    ];
  } */

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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
        px={1}
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

        <Typography
          variant="body2"
          sx={{
            mt: { xs: 1, sm: 0 },
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
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${columnas}, 1fr)`}
        gap={1}
        justifyContent="center"
      >
        {espaciosCamion.map((item, index) => (
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
              {item.tipo === "Vacío"
                ? ""
                : `${(
                    item.nombre_producto?.slice(0, 2) || item.tipo.charAt(0)
                  ).toUpperCase()}${item.orden || ""}`}
            </MotionBox>
          </Tooltip>
        ))}
      </Box>

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
          <strong style={{ color: "lightgray" }}>■ Vacío: {vacios}</strong>
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
