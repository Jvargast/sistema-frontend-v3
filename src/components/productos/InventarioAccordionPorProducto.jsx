import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";

const InventarioAccordionPorProducto = ({ productos, sucursales }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, md: 3 },
        borderRadius: 3,
        background: theme.palette.background.paper,
        boxShadow: "0 2px 20px 0 #1976d21a",
        mt: 2,
      }}
    >
      {productos.length === 0 ? (
        <Typography
          align="center"
          color="text.secondary"
          sx={{ py: 6, fontSize: 18 }}
        >
          No hay productos registrados.
        </Typography>
      ) : (
        productos.map((prod) => {
          const critical = sucursales.some((s) => {
            const inv = prod.inventario?.find(
              (i) => i.id_sucursal === s.id_sucursal
            );
            return !inv || inv.cantidad === 0;
          });

          return (
            <Accordion
              key={prod.id_producto}
              sx={{
                mb: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.default,
                boxShadow: theme.shadows[1],
                "&:before": { display: "none" },
              }}
              disableGutters
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: 56,
                  background:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[900]
                      : theme.palette.grey[50],
                  borderRadius: 2,
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  <Typography fontWeight={700} fontSize={17}>
                    {prod.nombre_producto}
                  </Typography>
                  {critical && (
                    <Chip
                      label="Stock crítico"
                      color="error"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        ml: 1,
                        letterSpacing: 0.1,
                      }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 0.5, md: 2 }, py: 1.5 }}>
                <Table size="small" sx={{ minWidth: 350 }}>
                  <TableBody>
                    {sucursales.map((s) => {
                      const inv = prod.inventario?.find(
                        (i) => i.id_sucursal === s.id_sucursal
                      );
                      const stock = inv ? inv.cantidad : 0;
                      return (
                        <TableRow key={s.id_sucursal}>
                          <TableCell
                            sx={{
                              fontWeight: 500,
                              fontSize: 15,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {s.nombre}
                          </TableCell>
                          <TableCell align="center" sx={{ width: 120 }}>
                            <Chip
                              label={stock === 0 ? "Sin stock" : stock}
                              size="small"
                              color={
                                stock === 0
                                  ? "error"
                                  : stock < 10
                                  ? "warning"
                                  : "success"
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: 15,
                                bgcolor:
                                  stock === 0
                                    ? theme.palette.error.light
                                    : stock < 10
                                    ? theme.palette.warning.light
                                    : theme.palette.success.light,
                                color: theme.palette.getContrastText(
                                  stock === 0
                                    ? theme.palette.error.light
                                    : stock < 10
                                    ? theme.palette.warning.light
                                    : theme.palette.success.light
                                ),
                                borderRadius: 1,
                                px: 1.2,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Paper>
  );
};
InventarioAccordionPorProducto.propTypes = {
  productos: PropTypes.array.isRequired,
  sucursales: PropTypes.array.isRequired,
};

export default InventarioAccordionPorProducto;
