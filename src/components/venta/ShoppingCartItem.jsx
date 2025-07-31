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
        borderRadius: 3,
        border: `1px solid`,
        borderColor: (theme) => theme.palette.divider,
        boxShadow: "0 2px 8px rgba(36,198,220,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        backgroundColor: (theme) => theme.palette.background.paper,
        transition: "background .2s,border .2s,box-shadow .2s",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ color: (theme) => theme.palette.text.primary }}
      >
        {item.nombre}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={1.5}
      >
        <IconButton
          onClick={() => onRemove(item.id_producto, item.tipo)}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#442227" : "#fce4ec",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#ff6f60" : "#c62828",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#6e3037" : "#f8bbd0",
            },
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
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#232323" : "#f5f5f5",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#353535" : "#e0e0e0",
            },
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
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#164e27" : "#C8E6C9",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#5ce692" : "#2E7D32",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1b5e20" : "#A5D6A7",
            },
            width: 36,
            height: 36,
          }}
        >
          <Add />
        </IconButton>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1 }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
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

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          ${total.toLocaleString("es-CL")}
        </Typography>
      </Stack>
    </Box>
  );
};

ShoppingCartItem.propTypes = {
  item: PropTypes.shape({
    id_producto: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
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
