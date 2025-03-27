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
} from "@mui/material";
import { DeleteOutline, AddCircleOutline } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ProductosRetornablesModal = ({ open, onClose, productos, onConfirm }) => {
  const [productosRetornables, setProductosRetornables] = useState([]);
  const [clienteTraeRetornable, setClienteTraeRetornable] = useState(true);

  useEffect(() => {
    if (open && productos.length > 0) {
      setProductosRetornables((prev) =>
        prev.length > 0
          ? prev.map((prod) => ({
              ...prod,
              cantidad: clienteTraeRetornable ? prod.cantidad : 0,
            }))
          : productos.map((prod) => ({
              id_producto: prod.id_producto,
              nombre_producto: prod.nombre_producto || prod.nombre,
              cantidad: clienteTraeRetornable ? 1 : 0, 
              estado: "reutilizable",
              tipo_defecto: "",
            }))
      );
    }
  }, [open, productos, clienteTraeRetornable]);

  const handleAgregarProducto = () => {
    setProductosRetornables([
      ...productosRetornables,
      {
        id_producto: "",
        cantidad: 1,
        estado: "reutilizable",
        tipo_defecto: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const nuevosProductos = [...productosRetornables];
    
    if (field === "cantidad" && !clienteTraeRetornable) {
      nuevosProductos[index][field] = 0;
    } else {
      nuevosProductos[index][field] = value;
    }
  
    if (field === "estado" && value === "reutilizable") {
      nuevosProductos[index]["tipo_defecto"] = "";
    }
  
    setProductosRetornables(nuevosProductos);
  };

  const handleEliminarProducto = (index) => {
    setProductosRetornables(productosRetornables.filter((_, i) => i !== index));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#F9FAFB",
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
            label="¿Cliente trae retornable?"
          />
        </Box>
        {clienteTraeRetornable &&
          productosRetornables.map((producto, index) => (
            <Box
              key={index}
              display="flex"
              gap={2}
              alignItems="center"
              mb={2}
              sx={{
                backgroundColor: "#fff",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Select de Productos */}
              <Select
                fullWidth
                value={producto.id_producto || ""}
                onChange={(e) =>
                  handleChange(index, "id_producto", e.target.value)
                }
                displayEmpty
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="" disabled>
                  Selecciona un producto
                </MenuItem>
                {productos.map((prod) => (
                  <MenuItem key={prod.id_producto} value={prod.id_producto}>
                    {prod.nombre_producto || prod.nombre}
                  </MenuItem>
                ))}
              </Select>

              {/* Cantidad */}
              <TextField
                type="number"
                label="Cantidad"
                value={producto.cantidad}
                onChange={(e) =>
                  handleChange(index, "cantidad", parseInt(e.target.value))
                }
                sx={{ width: "100px", textAlign: "center" }}
              />

              {/* Estado */}
              <Select
                value={producto.estado}
                onChange={(e) => handleChange(index, "estado", e.target.value)}
                sx={{ width: "180px", fontSize: "1rem", fontWeight: "bold" }}
              >
                <MenuItem value="reutilizable">♻️ Reutilizable</MenuItem>
                <MenuItem value="defectuoso">⚠️ Defectuoso</MenuItem>
              </Select>

              {/* Tipo de defecto (solo si es defectuoso) */}
              {producto.estado === "defectuoso" && (
                <TextField
                  label="Tipo de defecto"
                  value={producto.tipo_defecto}
                  onChange={(e) =>
                    handleChange(index, "tipo_defecto", e.target.value)
                  }
                  sx={{ width: "200px" }}
                />
              )}

              {/* Botón de eliminación */}
              <IconButton
                onClick={() => handleEliminarProducto(index)}
                color="error"
                sx={{
                  backgroundColor: "#FDECEC",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#FCC0C0" },
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Box>
          ))}

        {/* Botón para agregar nuevo producto */}
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
          disabled={!clienteTraeRetornable}
        >
          Agregar Producto Retornable
        </Button>
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
          onClick={() => onConfirm(productosRetornables)}
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
          Confirmar
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
};

export default ProductosRetornablesModal;
