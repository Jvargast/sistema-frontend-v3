import PropTypes from "prop-types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
 /*  useTheme, */
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function getCantidadEnSucursal(inventario, id_sucursal) {
  if (!Array.isArray(inventario)) {
    return typeof inventario?.cantidad === "number" ? inventario.cantidad : 0;
  }
  return inventario.find((i) => i.id_sucursal === id_sucursal)?.cantidad || 0;
}

function getTotal(inventario) {
  if (Array.isArray(inventario)) {
    return inventario.reduce((acc, i) => acc + (i.cantidad || 0), 0);
  }
  return typeof inventario?.cantidad === "number" ? inventario.cantidad : 0;
}

export default function InventarioAccordionInsumosPorInsumo({
  insumos = [],
  sucursales = [],
}) {
  /* const theme = useTheme(); */

  const StockChip = ({ value }) => {
    const v = value ?? 0;
    return v === 0 ? (
      <Chip label="0" color="error" size="small" sx={{ fontWeight: 700 }} />
    ) : v < 10 ? (
      <Chip label={v} color="warning" size="small" sx={{ fontWeight: 700 }} />
    ) : (
      <Chip label={v} color="success" size="small" sx={{ fontWeight: 700 }} />
    );
  };

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      {(insumos || []).map((ins) => {
        const total = getTotal(ins.inventario);

        return (
          <Accordion key={ins.id_insumo} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Typography fontWeight={700} sx={{ flex: 1 }}>
                  {ins.nombre_insumo}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <StockChip value={total} />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {sucursales && sucursales.length > 0 ? (
                <List dense disablePadding>
                  {sucursales.map((s, idx) => {
                    const cant = getCantidadEnSucursal(
                      ins.inventario,
                      s.id_sucursal
                    );
                    return (
                      <Box key={s.id_sucursal}>
                        <ListItem
                          secondaryAction={<StockChip value={cant} />}
                          sx={{ py: 1 }}
                        >
                          <ListItemText
                            primary={s.nombre}
                            secondary={cant === 0 ? "Sin stock" : undefined}
                          />
                        </ListItem>
                        {idx < sucursales.length - 1 && (
                          <Divider component="li" />
                        )}
                      </Box>
                    );
                  })}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No hay sucursales disponibles para desglosar. Mostrando el
                  total.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

InventarioAccordionInsumosPorInsumo.propTypes = {
  insumos: PropTypes.array,
  sucursales: PropTypes.array,
};
