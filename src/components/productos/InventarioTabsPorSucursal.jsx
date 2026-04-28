import Tabs from "../common/CompatTabs";
import { Tab, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, useTheme } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";
import {
  getStandardTablePaperSx,
  getStandardTableSx
} from "../common/tableStyles";

const InventarioTabsPorSucursal = ({ productos, sucursales }) => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const sucursalActual = sucursales?.[tab];

  if (!sucursalActual) return null;

  return (
    <Paper
      elevation={0}
      sx={getStandardTablePaperSx(theme)}>

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
            fontSize: 16
          }
        }}>

        {sucursales.map((s) =>
        <Tab key={s.id_sucursal} label={s.nombre} />
        )}
      </Tabs>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={getStandardTableSx(theme, { minWidth: 420 })}>
          <TableHead>
            <TableRow>

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
                <TableRow key={prod.id_producto}>

                  <TableCell
                    sx={{ fontWeight: 500, color: theme.palette.text.primary }}>

                    {prod.nombre_producto}
                  </TableCell>
                  <TableCell align="center">
                    {stock === 0 ?
                    <Chip
                      label="Sin stock"
                      color="error"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 13 }} /> :

                    stock < 10 ?
                    <Chip
                      label={stock}
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 13 }} /> :


                    <Typography fontWeight={600} fontSize={14}>
                        {stock}
                      </Typography>
                    }
                  </TableCell>
                </TableRow>);

            })}
            {productos.length === 0 &&
            <TableRow>
                <TableCell
                colSpan={2}
                align="center"
                sx={{ color: theme.palette.text.secondary }}>

                  No hay productos registrados en esta sucursal.
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Box>
    </Paper>);

};

InventarioTabsPorSucursal.propTypes = {
  productos: PropTypes.array.isRequired,
  sucursales: PropTypes.array.isRequired
};

export default InventarioTabsPorSucursal;
