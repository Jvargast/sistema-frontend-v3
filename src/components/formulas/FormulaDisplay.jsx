import React from "react";
import PropTypes from "prop-types";
import { Stack, Box, Divider, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ElementoDetalle from "./ElementoDetalle";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const FormulaDisplay = ({
  insumos = [],
  productoFinal,
  cantidadFinal,
  editable = false,
  onInsumoChange = () => {},
  onInsumoDelete = () => {},
  onProductoChange = () => {},
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: 0, md: 320 },
        px: { xs: 0.5, md: 4 },
        py: { xs: 2, md: 4 },
        borderRadius: 4,
        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        boxShadow: 2,
        overflowX: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          gap: 0,
          p: { xs: 0, md: 1 },
          mb: { xs: 2, md: 0 },
        }}
      >
        <Box display="flex" justifyContent="center" mb={1}>
          <Inventory2RoundedIcon sx={{ color: "#8bc34a", fontSize: 28 }} />
        </Box>
        {insumos.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={120}
          >
            <span style={{ color: "#888" }}>No hay insumos</span>
          </Box>
        ) : (
          <Stack
            direction="column"
            spacing={0}
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            {insumos.map((insumo, idx) => (
              <React.Fragment key={insumo.id_formula_detalle ?? idx}>
                <ElementoDetalle
                  editable={editable}
                  tipo="Insumo"
                  nombre={insumo.nombre}
                  cantidad={insumo.cantidad}
                  descripcion={insumo.descripcion}
                  objetoSeleccionado={insumo.objetoSeleccionado}
                  onChange={(nuevo) => onInsumoChange(idx, nuevo)}
                  onDelete={() => onInsumoDelete(idx)}
                  sx={{
                    mb: 0,
                    width: { xs: "95%", md: 250 },
                    mx: "auto",
                  }}
                />
                {idx < insumos.length - 1 && (
                  <AddIcon
                    sx={{
                      color: "#bdbdbd",
                      fontSize: 28,
                      my: { xs: 0.5, md: 1.2 },
                      mx: "auto",
                      display: "block",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Stack>
        )}
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          display: { xs: "none", md: "block" },
          mx: 0,
          borderColor: "#ededed",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1,
        }}
      >
        <DragHandleIcon sx={{ color: "primary.main", fontSize: 38 }} />
      </Box>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{
          display: { xs: "block", md: "none" },
          my: 1,
          borderColor: "#ededed",
        }}
      />

      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 2, md: 0 },
        }}
      >
        <EmojiEventsIcon
          sx={{
            color: "#4189e3",
            fontSize: 36,
            mb: 1,
          }}
        />
        <ElementoDetalle
          editable={editable}
          tipo="Producto"
          nombre={productoFinal?.nombre_producto || ""}
          cantidad={cantidadFinal}
          descripcion="unidad"
          objetoSeleccionado={productoFinal}
          onChange={onProductoChange}
          sx={{
            background: "#eaf3fd",
            border: "2px solid #4189e3",
            color: "#4189e3",
            boxShadow: "0 2px 8px 0 rgba(66,138,225,0.04)",
            width: { xs: "95%", md: 270 },
            mx: "auto",
          }}
        />
      </Box>
    </Box>
  );
};

FormulaDisplay.propTypes = {
  insumos: PropTypes.arrayOf(
    PropTypes.shape({
      id_formula_detalle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      nombre: PropTypes.string,
      cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      descripcion: PropTypes.string,
      objetoSeleccionado: PropTypes.object,
    })
  ),
  productoFinal: PropTypes.object,
  cantidadFinal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editable: PropTypes.bool,
  onInsumoChange: PropTypes.func,
  onInsumoDelete: PropTypes.func,
  onProductoChange: PropTypes.func,
};

export default FormulaDisplay;
