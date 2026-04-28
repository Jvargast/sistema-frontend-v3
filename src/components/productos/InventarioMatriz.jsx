import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme, Paper } from "@mui/material";
import Typography from "../common/CompatTypography";
import {
  getStandardTablePaperSx,
  getStandardTableSx
} from "../common/tableStyles";

const InventarioMatriz = ({ productos, sucursales }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={getStandardTablePaperSx(theme, {
        overflowX: "auto",
        mt: 2,
      })}
    >
      <Typography
        variant="h6"
        mb={2}
        sx={{
          fontWeight: 700,
          letterSpacing: 0.5,
          color: theme.palette.text.primary,
        }}
      >
        Inventario Global (Matriz)
      </Typography>
      <TableContainer sx={{ borderRadius: 1, boxShadow: "none" }}>
        <Table size="small" stickyHeader sx={getStandardTableSx(theme)}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  background:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 0.2,
                  borderRight: `2px solid ${theme.palette.divider}`,
                }}
              >
                Producto
              </TableCell>
              {sucursales.map((s) => (
                <TableCell
                  key={s.id_sucursal}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {s.nombre}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow
                key={prod.id_producto}
                sx={{
                  transition: "background 0.15s",
                  "&:hover": {
                    background: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    background: theme.palette.background.paper,
                    fontWeight: 500,
                    fontSize: 15,
                    color: theme.palette.text.primary,
                    borderRight: `2px solid ${theme.palette.divider}`,
                  }}
                >
                  {prod.nombre_producto}
                </TableCell>
                {sucursales.map((s) => {
                  const inv = prod.inventario?.find(
                    (i) => i.id_sucursal === s.id_sucursal
                  );
                  const stock = inv ? inv.cantidad : 0;
                  return (
                    <TableCell key={s.id_sucursal} align="center">
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
                          minWidth: 44,
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
                  );
                })}
              </TableRow>
            ))}
            {productos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={sucursales.length + 1}
                  align="center"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  No hay productos registrados en el sistema.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventarioMatriz;
