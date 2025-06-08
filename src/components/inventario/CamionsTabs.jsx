import { Tabs, Tab, Box, Paper } from "@mui/material";
import { useState } from "react";
import PropTypes from 'prop-types';
import InventarioCamion from "./InventarioCamion";
import CapacidadCargaCamion from "../agenda_carga/CapacidadCargaCamion";


function CamionTabs({
  idCamion,
  productos,
  productosReservados,
  capacidadTotal,
  reservadosRetornables,
  disponibles,
  retorno,
  onValidezCambio,
}) {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        borderRadius: 3,
        p: 0,
        overflow: "hidden",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#f8fafc",
      }}
    >
      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f1f5fb",
        }}
      >
        <Tab label="Inventario Visual" />
        <Tab label="Capacidad de Carga" />
      </Tabs>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {tab === 0 && idCamion && (
          <InventarioCamion
            idCamion={Number(idCamion)}
            modo="simulacion"
            productos={productos}
            productosReservados={productosReservados}
            onValidezCambio={onValidezCambio}
          />
        )}
        {tab === 1 && (
          <CapacidadCargaCamion
            capacidadTotal={capacidadTotal}
            reservadosRetornables={reservadosRetornables}
            disponibles={disponibles}
            retorno={retorno}
            productos={productos}
            productosReservados={productosReservados}
            onValidezCambio={onValidezCambio}
          />
        )}
      </Box>
    </Paper>
  );
}
CamionTabs.propTypes = {
  idCamion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  productos: PropTypes.array.isRequired,
  productosReservados: PropTypes.array.isRequired,
  capacidadTotal: PropTypes.number.isRequired,
  reservadosRetornables: PropTypes.number.isRequired,
  disponibles: PropTypes.number.isRequired,
  retorno: PropTypes.number.isRequired,
  onValidezCambio: PropTypes.func.isRequired,
};

export default CamionTabs;
