import { Box, Typography, IconButton, TextField } from "@mui/material";
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

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#F9F9F9",
        borderLeft: "6px solid #4CAF50",
      }}
    >
      {/* Información del producto */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "1 1 40%" },
          minWidth: "150px",
          mb: { xs: 1, md: 0 },
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#424242" }}>
          {item.nombre}
        </Typography>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          value={precioEditable}
          onChange={handlePriceChange}
          sx={{
            width: "80px",
            mt: 1,
            "& input": { textAlign: "center", fontSize: "1rem" },
          }}
        />
      </Box>

      {/* Controles de cantidad */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "1 1 40%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: { xs: 1, md: 0 },
        }}
      >
        <IconButton
          size="medium"
          onClick={() =>
            onQuantityChange(item.id_producto, item.tipo, item.cantidad - 1)
          }
          disabled={item.cantidad <= 1}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <Remove fontSize="medium" />
        </IconButton>

        <Typography
          fontWeight="bold"
          sx={{ width: "40px", textAlign: "center", fontSize: "1.2rem" }}
        >
          {item.cantidad}
        </Typography>

        <IconButton
          size="medium"
          onClick={() =>
            onQuantityChange(item.id_producto, item.tipo, item.cantidad + 1)
          }
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            borderRadius: 1,
            "&:hover": { backgroundColor: "#388E3C" },
          }}
        >
          <Add fontSize="medium" />
        </IconButton>
      </Box>

      {/* Botón de eliminar */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "1 1 15%" },
          display: "flex",
          justifyContent: "flex-end",
          mt: { xs: 1, md: 0 },
        }}
      >
        <IconButton
          color="error"
          onClick={() => onRemove(item.id_producto, item.tipo)}
          sx={{
            backgroundColor: "#FFCDD2",
            borderRadius: 1,
            "&:hover": { backgroundColor: "#E57373" },
            ml: { md: 2 },
          }}
        >
          <Delete />
        </IconButton>
      </Box>
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
