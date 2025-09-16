import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  TableContainer,
  Typography,
  Box,
} from "@mui/material";
import PercentOutlined from "@mui/icons-material/PercentOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import { formatCLP } from "../../utils/formatUtils";

const COL = {
  first: { xs: "auto", md: "46%" },
  qty: { xs: 96, md: 120 },
  price: { xs: 128, md: 160 },
  iva: { xs: 96, md: 120 },
  neto: { xs: 128, md: 160 },
  total: { xs: 128, md: 160 },
};

const numericCellSx = {
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum" 1',
};

function EmptyState() {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
      <Typography variant="subtitle1" gutterBottom>
        No hay ítems registrados
      </Typography>
      <Typography variant="body2">
        Esta compra no contiene insumos cargados.
      </Typography>
    </Box>
  );
}

export default function CompraDetailItems({ items }) {
  const hasItems = Array.isArray(items) && items.length > 0;

  console.log(items);

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        title="Ítems de la compra"
        subheader="Detalle de insumos y montos"
      />
      <Divider />
      <CardContent sx={{ pt: 0 }}>
        {!hasItems ? (
          <EmptyState />
        ) : (
          <TableContainer>
            <Table
              size="small"
              sx={{
                tableLayout: { xs: "auto", md: "fixed" },
                "& th": { fontWeight: 600, whiteSpace: "nowrap" },
                "& th, & td": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: COL.first }}>
                    Insumo / Descripción
                  </TableCell>
                  <TableCell align="right" sx={{ width: COL.qty }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="right" sx={{ width: COL.price }}>
                    Precio unit. (neto)
                  </TableCell>
                  <TableCell align="center" sx={{ width: COL.iva }}>
                    IVA
                  </TableCell>
                  <TableCell align="right" sx={{ width: COL.neto }}>
                    Subtotal
                  </TableCell>
                  <TableCell align="right" sx={{ width: COL.total }}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((it, idx) => {
                  const cantidad = Number(it.cantidad || 0);
                  const precio = Number(it.precio_unitario || 0);
                  const descuento = Number(it.descuento || 0);
                  const neto = Number.isFinite(Number(it.subtotal))
                    ? Number(it.subtotal)
                    : Math.max(0, Math.round(cantidad * precio) - descuento);

                  const ivaMonto = Number.isFinite(Number(it.iva_monto))
                    ? Number(it.iva_monto)
                    : it.afecta_iva
                    ? Math.round(neto * 0.19)
                    : 0;
                  const total = Number.isFinite(Number(it.total))
                    ? Number(it.total)
                    : neto + ivaMonto;
                  const isAfecto = it.afecta_iva === true || ivaMonto > 0;

                  const nombre =
                    it.insumo?.nombre_insumo ||
                    it.insumo?.nombre ||
                    it.descripcion ||
                    "—";

                  return (
                    <TableRow
                      key={it.id_compra_item || it._tid || idx}
                      hover
                      sx={{
                        "& > td": {
                          py: 1.25,
                          verticalAlign: "top",
                        },
                      }}
                    >
                      <TableCell sx={{ pr: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "flex-start",
                          }}
                        >
                          <Inventory2Outlined
                            fontSize="small"
                            sx={{ mt: "2px", color: "text.secondary" }}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                              {nombre}
                            </Typography>
                            {it.descripcion && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25, wordBreak: "break-word" }}
                              >
                                {it.descripcion}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell align="right" sx={numericCellSx}>
                        {cantidad}
                      </TableCell>

                      <TableCell align="right" sx={numericCellSx}>
                        {formatCLP(precio)}
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip
                          title={
                            isAfecto
                              ? `Grava IVA • ${formatCLP(ivaMonto)}`
                              : "Exento de IVA"
                          }
                        >
                          <Chip
                            size="small"
                            variant="outlined"
                            color={isAfecto ? "success" : "default"}
                            label={isAfecto ? "Afecto" : "Exento"}
                            icon={
                              isAfecto ? (
                                <PercentOutlined sx={{ fontSize: 16 }} />
                              ) : undefined
                            }
                            sx={!isAfecto ? { opacity: 0.8 } : undefined}
                          />
                        </Tooltip>
                      </TableCell>

                      <TableCell align="right" sx={numericCellSx}>
                        {formatCLP(neto)}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ ...numericCellSx, fontWeight: 700 }}
                      >
                        {formatCLP(total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

CompraDetailItems.propTypes = {
  items: PropTypes.array.isRequired,
  moneda: PropTypes.string,
};
