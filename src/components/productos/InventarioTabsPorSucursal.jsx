import {
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

const InventarioTabsPorSucursal = ({ productos, sucursales }) => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const sucursalActual = sucursales?.[tab];

  if (!sucursalActual) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, md: 3 },
        borderRadius: 3,
        background: theme.palette.background.paper,
        boxShadow: "0 2px 20px 0 #1976d21a",
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          mb: 2,
          ".MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: 16,
          },
        }}
      >
        {sucursales.map((s) => (
          <Tab key={s.id_sucursal} label={s.nombre} />
        ))}
      </Tabs>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 420 }}>
          <TableHead>
            <TableRow
              sx={{
                background: theme.palette.background.paper,
                "& th": {
                  borderBottom: `2px solid ${theme.palette.divider}`,
                  fontWeight: 700,
                  fontSize: 15,
                },
              }}
            >
              <TableCell>Producto</TableCell>
              <TableCell align="center">Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => {
              const inv = prod.inventario?.find(
                (i) => i.id_sucursal === sucursalActual.id_sucursal
              );
              const stock = inv ? inv.cantidad : 0;

              return (
                <TableRow
                  key={prod.id_producto}
                  sx={{
                    "&:hover": {
                      background: theme.palette.action.hover,
                      transition: "background 0.15s",
                    },
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: 500, color: theme.palette.text.primary }}
                  >
                    {prod.nombre_producto}
                  </TableCell>
                  <TableCell align="center">
                    {stock === 0 ? (
                      <Chip
                        label="Sin stock"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 600, fontSize: 13 }}
                      />
                    ) : stock < 10 ? (
                      <Chip
                        label={stock}
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 600, fontSize: 13 }}
                      />
                    ) : (
                      <Typography fontWeight={600} fontSize={14}>
                        {stock}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {productos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  No hay productos registrados en esta sucursal.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

InventarioTabsPorSucursal.propTypes = {
  productos: PropTypes.array.isRequired,
  sucursales: PropTypes.array.isRequired,
};

export default InventarioTabsPorSucursal;
