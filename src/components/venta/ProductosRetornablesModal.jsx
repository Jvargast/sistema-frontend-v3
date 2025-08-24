import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import {
  DeleteOutline,
  AddCircleOutline,
  RemoveCircleOutline,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const ProductosRetornablesModal = ({
  open,
  onClose,
  productos,
  onConfirm,
  isFactura,
}) => {
  const [productosRet, setProductosRet] = useState([]);
  const [inspeccionarAhora, setInspeccionarAhora] = useState(true);
  const [clienteTraeRetornable, setClienteTraeRetornable] = useState(true);

  const [opciones, setOpciones] = useState([]);
  useEffect(() => {
    if (Array.isArray(productos) && productos.length > 0) {
      setOpciones(productos);
    }
  }, [productos]);

  const toId = (v) =>
    v === undefined || v === null || v === "" ? "" : String(v);

  useEffect(() => {
    if (!open) return;
    const base = (productos || []).map((prod) => {
      const esperado = Math.max(1, Number(prod.cantidad) || 1);
      const initialCantidad = clienteTraeRetornable ? esperado : 1;
      return {
        id_producto: toId(prod.id_producto),
        nombre_producto: prod.nombre_producto || prod.nombre,
        esperado,
        cantidad: initialCantidad,
        estado: "reutilizable",
        tipo_defecto: "",
        id_insumo_destino: prod.id_insumo_retorno || "",
      };
    });

    setProductosRet((prev) => {
      if (!prev?.length) return base;
      const merged = base.map((b) => {
        const old = prev.find((p) => p.id_producto === b.id_producto);
        if (!old) return b;
        const cantidad = clamp(Number(old.cantidad) || 1, 1, b.esperado);
        return {
          ...b,
          cantidad,
          estado: old.estado || "reutilizable",
          tipo_defecto: old.tipo_defecto || "",
        };
      });
      return merged;
    });
  }, [open, productos, clienteTraeRetornable]);

  useEffect(() => {
    if (!open) return;
    setProductosRet((prev) =>
      prev.map((p) => ({
        ...p,
        cantidad: clienteTraeRetornable ? p.esperado : 1,
      }))
    );
  }, [clienteTraeRetornable, open]);

  useEffect(() => {
    if (!open) return;
    if (!clienteTraeRetornable) {
      setProductosRet([]);
      setInspeccionarAhora(false);
    } else {
      setInspeccionarAhora(true);
    }
  }, [clienteTraeRetornable, open]);

  const handleAgregarProducto = () => {
    setProductosRet((curr) => [
      ...curr,
      {
        id_producto: "",
        nombre_producto: "",
        esperado: 1,
        cantidad: 1,
        estado: "reutilizable",
        tipo_defecto: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    setProductosRet((curr) => {
      const next = [...curr];
      const item = { ...next[index] };

      if (field === "cantidad") {
        const raw = parseInt(value, 10);
        const safe = clamp(isNaN(raw) ? 1 : raw, 1, item.esperado || 1);
        item.cantidad = safe;
      } else if (field === "estado") {
        item.estado = value;
        if (value === "reutilizable") item.tipo_defecto = "";
        if (value !== "reutilizable") item.id_insumo_destino = "";
      } else if (field === "id_producto") {
        item.id_producto = value;
      } else if (field === "tipo_defecto") {
        item.tipo_defecto = value;
      } else if (field === "id_insumo_destino") {
        item.id_insumo_destino = value;
      }

      next[index] = item;
      return next;
    });
  };

  const stepCantidad = (index, dir) => {
    setProductosRet((curr) => {
      const next = [...curr];
      const item = { ...next[index] };
      const max = item.esperado || 1;
      const current = Number(item.cantidad) || 1;
      item.cantidad =
        dir === "up" ? clamp(current + 1, 1, max) : clamp(current - 1, 1, max);
      next[index] = item;
      return next;
    });
  };

  const handleEliminarProducto = (index) => {
    setProductosRet((curr) => curr.filter((_, i) => i !== index));
  };

  /*   const handleConfirm = () => {
    if (!clienteTraeRetornable) {
      onConfirm([]);
      return;
    }
    const normalizados = productosRet
      .filter((p) => p.id_producto)
      .map((p) => ({
        id_producto: toId(p.id_producto),
        cantidad: clamp(Number(p.cantidad) || 1, 1, p.esperado || 1),
        estado: p.estado || "reutilizable",
        tipo_defecto: p.estado === "defectuoso" ? p.tipo_defecto || "" : "",
      }));

    onConfirm(normalizados);
  }; */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.6rem",
          fontWeight: "bold",
          textAlign: "center",
          background: "linear-gradient(90deg, #007AFF, #0052D4)",
          color: "white",
          padding: "16px",
          borderRadius: "10px 10px 0 0",
        }}
      >
        Productos Retornables
      </DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Switch
                checked={clienteTraeRetornable}
                onChange={() => setClienteTraeRetornable((prev) => !prev)}
              />
            }
            label="¿Cliente trae retornable? (prefijar cantidades)"
          />
        </Box>
        {clienteTraeRetornable ? (
          <>
            <Box mb={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={inspeccionarAhora}
                    onChange={() => setInspeccionarAhora((prev) => !prev)}
                  />
                }
                label="Inspeccionar ahora en POS (si lo apagas, se registran como pendientes)"
              />
            </Box>

            {productosRet.map((producto, index) => (
              <Box
                key={`${producto.id_producto || "nuevo"}-${index}`}
                display="flex"
                gap={2}
                alignItems="center"
                mb={2}
                sx={{
                  padding: "10px 8px",
                  borderRadius: "16px",
                  boxShadow: "0 1px 4px 0 rgba(36,198,220,0.06)",
                  border: "1px solid #E5E7EB",
                  minHeight: 60,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                {/* Producto */}
                <Select
                  fullWidth
                  value={opciones.length ? toId(producto.id_producto) : ""}
                  onChange={(e) =>
                    handleChange(index, "id_producto", toId(e.target.value))
                  }
                  displayEmpty
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    minWidth: { xs: "100%", sm: 220 },
                    flex: 1,
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecciona un producto
                  </MenuItem>
                  {(opciones || []).map((prod) => (
                    <MenuItem
                      key={prod.id_producto}
                      value={toId(prod.id_producto)}
                    >
                      {prod.nombre_producto || prod.nombre}
                    </MenuItem>
                  ))}
                </Select>

                {/* Cantidad con stepper */}
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    onClick={() => stepCantidad(index, "down")}
                    disabled={Number(producto.cantidad) <= 1}
                    sx={{ borderRadius: 2 }}
                  >
                    <RemoveCircleOutline />
                  </IconButton>

                  <TextField
                    type="number"
                    label="Cantidad"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleChange(index, "cantidad", e.target.value)
                    }
                    onBlur={(e) =>
                      handleChange(index, "cantidad", e.target.value)
                    }
                    inputProps={{ min: 1, max: producto.esperado }}
                    sx={{
                      width: 110,
                      "& input": { textAlign: "center", fontWeight: 700 },
                    }}
                  />

                  <IconButton
                    onClick={() => stepCantidad(index, "up")}
                    disabled={
                      Number(producto.cantidad) >= Number(producto.esperado)
                    }
                    sx={{ borderRadius: 2 }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, minWidth: 120 }}
                >
                  Esperados: <b>{producto.esperado}</b>
                </Typography>

                {/* Estado */}
                <Select
                  value={producto.estado}
                  onChange={(e) =>
                    handleChange(index, "estado", e.target.value)
                  }
                  sx={{
                    minWidth: { xs: "100%", sm: 160 },
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  }}
                  disabled={!inspeccionarAhora}
                >
                  <MenuItem value="reutilizable">♻️ Reutilizable</MenuItem>
                  <MenuItem value="defectuoso">⚠️ Defectuoso</MenuItem>
                  <MenuItem value="pendiente_inspeccion">🕒 Pendiente</MenuItem>
                </Select>

                {producto.estado === "defectuoso" && (
                  <TextField
                    label="Tipo de defecto"
                    value={producto.tipo_defecto}
                    onChange={(e) =>
                      handleChange(index, "tipo_defecto", e.target.value)
                    }
                    sx={{
                      minWidth: { xs: "100%", sm: 180 },
                      width: { xs: "100%", sm: 200 },
                    }}
                  />
                )}

                {producto.estado === "reutilizable" &&
                  inspeccionarAhora &&
                  (producto.id_insumo_destino ? (
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Destino: #{producto.id_insumo_destino}
                    </Typography>
                  ) : (
                    <TextField
                      label="ID insumo destino (si no está configurado)"
                      value={producto.id_insumo_destino}
                      onChange={(e) =>
                        handleChange(index, "id_insumo_destino", e.target.value)
                      }
                    />
                  ))}

                <IconButton
                  onClick={() => handleEliminarProducto(index)}
                  color="error"
                  sx={{
                    borderRadius: "8px",
                    alignSelf: { xs: "flex-end", sm: "center" },
                    "&:hover": { backgroundColor: "#FCC0C0" },
                  }}
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
            ))}

            <Button
              onClick={handleAgregarProducto}
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#28A745",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px",
                "&:hover": { backgroundColor: "#218838" },
              }}
              startIcon={<AddCircleOutline />}
            >
              Agregar Producto Retornable
            </Button>
          </>
        ) : (
          <Typography sx={{ mb: 2, opacity: 0.8 }}>
            El cliente <b>no</b> trae retornables. La venta continuará sin
            retornos.
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "16px",
        }}
      >
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          sx={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={() => {
            if (!clienteTraeRetornable) {
              onConfirm([]);
              return;
            }
            if (inspeccionarAhora) {
              const faltanDefectos = productosRet.some(
                (p) =>
                  p.estado === "defectuoso" &&
                  !String(p.tipo_defecto || "").trim()
              );
              if (faltanDefectos) {
                alert("Indica el tipo de defecto en los items defectuosos.");
                return;
              }
            }
            const normalizados = productosRet
              .filter((p) => p.id_producto)
              .map((p) => {
                const base = {
                  id_producto: Number(p.id_producto), // <- NUMÉRICO
                  cantidad: clamp(Number(p.cantidad) || 1, 1, p.esperado || 1),
                };

                if (!inspeccionarAhora) {
                  return { ...base, estado: "pendiente_inspeccion" };
                }

                if (p.estado === "reutilizable") {
                  return {
                    ...base,
                    estado: "reutilizable",
                    ...(p.id_insumo_destino
                      ? { id_insumo_destino: Number(p.id_insumo_destino) }
                      : {}),
                  };
                }

                if (p.estado === "defectuoso") {
                  return {
                    ...base,
                    estado: "defectuoso",
                    tipo_defecto: (p.tipo_defecto || "").trim(),
                  };
                }

                return { ...base, estado: "pendiente_inspeccion" };
              });

            onConfirm(normalizados);
          }}
          color="primary"
          variant="contained"
          sx={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#007AFF",
            "&:hover": { backgroundColor: "#005BB5" },
          }}
        >
          {isFactura ? "Confirmar venta" : "Continuar al pago"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductosRetornablesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productos: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isFactura: PropTypes.bool,
};

export default ProductosRetornablesModal;
