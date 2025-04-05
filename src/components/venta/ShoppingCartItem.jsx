import { Box, Typography, IconButton, TextField, Stack } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState } from "react";

const ShoppingCartItem = ({
  item,
  onRemove,
  onQuantityChange,
  onPriceChange,
}) => {
  const [precioEditable, setPrecioEditable] = useState(item.precio_unitario);

  const handlePriceChange = (e) => {
    let newPrice = parseFloat(e.target.value);
    if (isNaN(newPrice) || newPrice < 0) newPrice = 0;
    setPrecioEditable(newPrice);
    onPriceChange(item.id_producto, item.tipo, newPrice);
  };

  const total = item.cantidad * precioEditable;

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: "#FAFAFA", // Cambia el fondo
        border: "1px solid #E0E0E0", // Sutil
        boxShadow: "none", // Quitamos la sombra
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Nombre del producto */}
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ color: "#2E2E2E" }}
      >
        {item.nombre}
      </Typography>

      {/* Controles de cantidad */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={1.5}
      >
        <IconButton
          onClick={() => onRemove(item.id_producto, item.tipo)}
          sx={{
            backgroundColor: "#fce4ec",
            color: "#c62828",
            "&:hover": { backgroundColor: "#f8bbd0" },
            width: 36,
            height: 36,
          }}
        >
          <Delete fontSize="small" />
        </IconButton>

        <IconButton
          onClick={() =>
            onQuantityChange(item.id_producto, item.tipo, item.cantidad - 1)
          }
          disabled={item.cantidad <= 1}
          sx={{
            backgroundColor: "#f5f5f5",
            "&:hover": { backgroundColor: "#e0e0e0" },
            width: 36,
            height: 36,
          }}
        >
          <Remove />
        </IconButton>

        <Typography fontWeight="bold" sx={{ fontSize: "1.2rem", mx: 1 }}>
          {item.cantidad}
        </Typography>

        <IconButton
          onClick={() =>
            onQuantityChange(item.id_producto, item.tipo, item.cantidad + 1)
          }
          sx={{
            backgroundColor: "#C8E6C9",
            color: "#2E7D32",
            "&:hover": { backgroundColor: "#A5D6A7" },
            width: 36,
            height: 36,
          }}
        >
          <Add />
        </IconButton>
      </Stack>

      {/* Precio y total alineados */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1 }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Precio unitario
          <TextField
            type="number"
            value={precioEditable}
            onChange={handlePriceChange}
            variant="standard"
            inputProps={{
              min: 0,
              style: {
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: 0,
              },
            }}
            sx={{
              width: "60px",
              "& .MuiInputBase-root::before": { borderBottom: "none" },
              "& .MuiInputBase-root:hover::before": { borderBottom: "none" },
              "& .MuiInputBase-root.Mui-focused::before": {
                borderBottom: "none",
              },
              "& input": {
                backgroundColor: "transparent",
              },
            }}
          />
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
          ${total.toLocaleString("es-CL")}
        </Typography>
      </Stack>
    </Box>
  );
};

ShoppingCartItem.propTypes = {
  item: PropTypes.shape({
    id_producto: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    cantidad: PropTypes.number.isRequired,
    precio_unitario: PropTypes.number.isRequired,
    tipo: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
};

export default ShoppingCartItem;
