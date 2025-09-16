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
  IconButton,
  TextField,
  Stack,
  Button,
  Tooltip,
  TableContainer,
  Typography,
  Box,
  Switch,
} from "@mui/material";
import {
  Add,
  DeleteOutline,
  RemoveCircleOutline,
  AddCircleOutline,
  InfoOutlined,
} from "@mui/icons-material";
import InsumoCell from "./InsumoCell";
import { alpha } from "@mui/material/styles";
import { formatCLP } from "../../utils/formatUtils";

const onlyDigits = (s) => (s || "").toString().replace(/[^\d]/g, "");
const toInt = (s, def = 0) => {
  const n = parseInt(onlyDigits(s), 10);
  return Number.isFinite(n) ? n : def;
};

const COL = {
  first: { xs: "auto", md: 320 },
  qty: { xs: 112, md: 160 },
  price: { xs: 144, md: 200 },
  iva: { xs: 88, md: 110 },
  subtotal: { xs: 120, md: 100 },
  actions: { xs: 48, md: 64 },
};

const filledInputSx = {
  "& .MuiFilledInput-root": {
    borderRadius: 10,
    backgroundColor: (t) => alpha(t.palette.primary.main, 0.04),
    boxShadow: "none",
    ":hover": { backgroundColor: (t) => alpha(t.palette.primary.main, 0.06) },
    "&.Mui-focused": {
      backgroundColor: (t) => alpha(t.palette.primary.main, 0.08),
      boxShadow: (t) =>
        `0 0 0 2px ${alpha(t.palette.primary.main, 0.15)} inset`,
    },
  },
};

function QtyStepper({ value, onChange }) {
  const v = Math.max(0, Number(value || 0));
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      justifyContent="flex-end"
    >
      <Tooltip title="Restar 1">
        <span>
          <IconButton
            size="small"
            onClick={() => onChange(Math.max(0, v - 1))}
            disabled={v <= 0}
          >
            <RemoveCircleOutline fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <TextField
        value={v}
        variant="filled"
        onChange={(e) => onChange(toInt(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(v + 1);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, v - 1));
          }
        }}
        size="small"
        inputProps={{
          inputMode: "numeric",
          min: 0,
          style: { textAlign: "right", width: 64 },
        }}
        InputProps={{ disableUnderline: true }}
        sx={filledInputSx}
      />
      <Tooltip title="Sumar 1">
        <IconButton size="small" onClick={() => onChange(v + 1)}>
          <AddCircleOutline fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

QtyStepper.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const EmptyState = () => (
  <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
    <Typography variant="subtitle1" gutterBottom>
      No hay ítems en la compra
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Agrega insumos, cantidades y precios netos.
    </Typography>
  </Box>
);

const CompraItemsTable = ({ items, addItem, updateItem, removeItem }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <Card>
      <CardHeader
        title="Ítems de la compra"
        subheader="Registra insumos, cantidades y precio neto (CLP)"
        action={
          <Button
            variant="text"
            startIcon={<Add />}
            onClick={() => addItem()}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Agregar ítem
          </Button>
        }
      />
      <Divider />
      <CardContent sx={{ pt: 0 }}>
        {!hasItems ? (
          <EmptyState />
        ) : (
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table
              size="small"
              stickyHeader
              sx={{
                tableLayout: { xs: "auto", md: "fixed" },
                width: "100%",
                "& th, & td": { borderBottom: "none" },
                "& thead th": { bgcolor: "transparent", fontWeight: 700 },
                "& tbody tr": {
                  "&:hover": {
                    backgroundColor: (t) => alpha(t.palette.primary.main, 0.03),
                  },
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: COL.first, wordBreak: "break-word" }}>
                    Insumo / Descripción
                  </TableCell>
                  <TableCell align="center" sx={{ width: COL.qty }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" sx={{ width: COL.price }}>
                    Precio unit. (neto)
                    <Tooltip title="Ingresa precios netos (sin IVA). El IVA se calcula aparte.">
                      <IconButton
                        size="small"
                        sx={{ ml: 0.5 }}
                        aria-label="Ayuda precio"
                      >
                        <InfoOutlined fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ width: COL.iva }}>
                    Afecta IVA
                  </TableCell>
                  <TableCell align="center" sx={{ width: COL.subtotal }}>
                    Subtotal
                  </TableCell>
                  <TableCell align="center" sx={{ width: COL.actions }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((it, idx) => {
                  const cantidad = Number(it.cantidad || 0);
                  const precio = Number(it.precio_unitario || 0);
                  const subtotal = cantidad * precio;
                  const invalid = !(
                    it?.insumo ||
                    it?.producto ||
                    (it?.descripcion || "").trim()
                  );

                  return (
                    <TableRow
                      key={it._tid || idx}
                      hover
                      sx={{
                        "& > td": { verticalAlign: "top", pt: 1.5 },
                        ...(invalid && {
                          bgcolor: (t) =>
                            t.palette.mode === "light"
                              ? "rgba(255, 193, 7, 0.06)"
                              : "rgba(255, 193, 7, 0.12)",
                        }),
                      }}
                    >
                      <TableCell sx={{ width: COL.first }}>
                        <Stack spacing={1} alignItems="stretch">
                          <InsumoCell
                            value={it.insumo || it.producto || null}
                            onChange={(ins) =>
                              updateItem(it._tid, {
                                insumo: ins,
                                id_insumo: ins?.id_insumo ?? ins?.id ?? null,
                                producto: ins,
                                id_producto:
                                  ins?.id_producto ?? ins?.id ?? null,
                                descripcion:
                                  ins?.nombre_insumo ||
                                  ins?.nombre ||
                                  ins?.descripcion ||
                                  it.descripcion,
                              })
                            }
                          />
                          <TextField
                            variant="filled"
                            value={it.descripcion || ""}
                            onChange={(e) =>
                              updateItem(it._tid, {
                                descripcion: e.target.value,
                              })
                            }
                            InputProps={{ disableUnderline: true }}
                            sx={filledInputSx}
                            size="small"
                            placeholder="Descripción (opcional si seleccionaste un insumo)"
                            error={invalid}
                            helperText={
                              invalid
                                ? "Ingresa un insumo o una descripción."
                                : " "
                            }
                            fullWidth
                          />
                        </Stack>
                      </TableCell>

                      {/* Cantidad */}
                      <TableCell align="right" sx={{ width: COL.qty }}>
                        <QtyStepper
                          value={cantidad}
                          onChange={(val) =>
                            updateItem(it._tid, {
                              cantidad: Math.max(0, Number(val || 0)),
                            })
                          }
                        />
                      </TableCell>

                      {/* Precio */}
                      <TableCell align="right" sx={{ width: COL.price }}>
                        <TextField
                          variant="filled"
                          value={precio}
                          onChange={(e) =>
                            updateItem(it._tid, {
                              precio_unitario: toInt(e.target.value),
                            })
                          }
                          size="small"
                          InputProps={{ disableUnderline: true }}
                          sx={filledInputSx}
                          placeholder="0"
                          fullWidth
                        />
                      </TableCell>

                      {/* IVA */}
                      <TableCell align="center" sx={{ width: COL.iva }}>
                        <Tooltip
                          title={it.afecta_iva ? "Grava IVA" : "Exento de IVA"}
                        >
                          <Switch
                            size="small"
                            checked={Boolean(it.afecta_iva)}
                            onChange={(e) =>
                              updateItem(it._tid, {
                                afecta_iva: e.target.checked,
                              })
                            }
                          />
                        </Tooltip>
                      </TableCell>

                      {/* Subtotal */}
                      <TableCell align="right" sx={{ width: COL.subtotal }}>
                        {formatCLP(subtotal)}
                      </TableCell>

                      <TableCell align="center" sx={{ width: COL.actions }}>
                        <Tooltip title="Eliminar fila">
                          <IconButton
                            color="error"
                            onClick={() => removeItem(it._tid)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
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
};

CompraItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default CompraItemsTable;
