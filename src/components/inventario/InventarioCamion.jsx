import { Paper, useMediaQuery, Tooltip, ToggleButtonGroup, ToggleButton, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const MotionBox = motion.create(Box);

const inventoryColors = {
  capacidad: "#475569",
  reservadoRetornable: "#F59E0B",
  reservadoNoRetornable: "#8B5CF6",
  disponible: "#16A34A",
  retorno: "#2563EB",
  vacio: "#94A3B8",
  reservadoParaCarga: "#EF4444",
  cargarAhora: "#0097A7",
  default: "#64748B",
};

const statusChipSx = (color) => (theme) => ({
  bgcolor: alpha(color, theme.palette.mode === "dark" ? 0.18 : 0.11),
  color: theme.palette.mode === "dark" ? theme.palette.common.white : color,
  border: 0,
  fontWeight: 800,
  borderRadius: 1,
  boxShadow: "none",
  "& .MuiChip-label": {
    px: 1,
  },
});

const metricChipSx = (color) => (theme) => ({
  ...statusChipSx(color)(theme),
  minWidth: { xs: "auto", sm: 158 },
  justifyContent: "center",
});

const statusDotSx = (color) => (theme) => ({
  width: 9,
  height: 9,
  borderRadius: "50%",
  bgcolor: color,
  boxShadow: `0 0 0 3px ${alpha(color, theme.palette.mode === "dark" ? 0.18 : 0.12)}`,
});

const chipWithDotSx = (color) => (theme) => ({
  ...statusChipSx(color)(theme),
  "& .MuiChip-icon": {
    ml: 1,
    mr: -0.35,
  },
});

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
        return inventoryColors.reservadoRetornable;
      case "ReservadoNoRetornable":
        return inventoryColors.reservadoNoRetornable;
      case "Disponible":
        return inventoryColors.disponible;
      case "Retorno":
        return inventoryColors.retorno;
      case "ReservadoParaCarga":
        return inventoryColors.reservadoParaCarga;
      case "Vacío":
        return inventoryColors.vacio;
      case "ACargarAhora":
        return inventoryColors.cargarAhora;
      default:
        return inventoryColors.default;
    }
  };

  const legendItems = [
    {
      label: "Reservado retornable",
      value: reservados_retornables,
      color: inventoryColors.reservadoRetornable,
    },
    {
      label: "Reservado no retornable",
      value: reservados_no_retornables,
      color: inventoryColors.reservadoNoRetornable,
    },
    {
      label: "Disponible",
      value: disponibles,
      color: inventoryColors.disponible,
    },
    {
      label: "Retorno",
      value: retorno,
      color: inventoryColors.retorno,
    },
    ...(modo === "simulacion"
      ? [
          {
            label: "A cargar proyectado",
            value: espaciosReservadosProyectados,
            color: inventoryColors.reservadoParaCarga,
          },
        ]
      : []),
    {
      label: "Vacío",
      value: vaciosCalculados,
      color: inventoryColors.vacio,
    },
    ...(modo === "simulacion"
      ? [
          {
            label: "Retornables a cargar ahora",
            value: retornablesACargarAhora,
            color: inventoryColors.cargarAhora,
          },
        ]
      : []),
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: 0,
        textAlign: "center",
        mt: 0,
        overflowX: "auto",
        bgcolor: "transparent",
        boxShadow: "none",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        mb={2}
        gap={1}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row" },
            alignItems: "center",
            justifyContent: { xs: "space-between", sm: "flex-end" },
            gap: 1,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Chip
            label={`Capacidad total: ${capacidad_total} espacios`}
            size="small"
            icon={<Box component="span" sx={statusDotSx(inventoryColors.capacidad)} />}
            sx={(theme) => ({
              ...metricChipSx(inventoryColors.capacidad)(theme),
              "& .MuiChip-icon": {
                ml: 1,
                mr: -0.35,
              },
            })}
          />

          <ToggleButtonGroup
            value={vista}
            exclusive
            size="small"
            onChange={(_, v) => v && setVista(v)}
            sx={{
              ml: { sm: "auto" },
              "& .MuiToggleButton-root": {
                textTransform: "none",
                whiteSpace: "nowrap",
              },
            }}
          >
            <ToggleButton value="slots">Por espacios</ToggleButton>
            <ToggleButton value="productos">Por producto</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {vista === "slots" && (
        <Box
          sx={{
            borderRadius: 2,
            border: "2px dashed rgba(100, 116, 139, 0.28)",
            p: { xs: 1.25, sm: 2 },
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
              const slotNumber = index + 1;
              const prefix = (
                item.nombre_producto?.slice(0, 2) || item.tipo.charAt(0)
              ).toUpperCase();

              const label =
                item.tipo === "Vacío" ? "" : `${prefix}${slotNumber}`;

              return (
                <Tooltip key={index} title={item.nombre_producto || item.tipo}>
                  <MotionBox
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: getColor(item.tipo),
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                    }}
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
                          sx={statusChipSx(inventoryColors.disponible)}
                        />
                        <Chip
                          label={`Retorno: ${prod.retorno}`}
                          size="small"
                          sx={statusChipSx(inventoryColors.retorno)}
                        />
                        <Chip
                          label={`Reservado: ${prod.reservado}`}
                          size="small"
                          sx={statusChipSx(inventoryColors.reservadoRetornable)}
                        />
                      </>
                    )}

                    {prod.reservadoNoRetornable > 0 && (
                      <Chip
                        label={`No Ret.: ${prod.reservadoNoRetornable}`}
                        size="small"
                        sx={statusChipSx(inventoryColors.reservadoNoRetornable)}
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
        gap={1}
      >
        {legendItems.map((item) => (
          <Chip
            key={item.label}
            label={`${item.label}: ${item.value}`}
            size="small"
            icon={<Box component="span" sx={statusDotSx(item.color)} />}
            sx={chipWithDotSx(item.color)}
          />
        ))}
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
