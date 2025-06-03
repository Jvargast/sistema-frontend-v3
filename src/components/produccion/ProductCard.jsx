import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Chip,
} from "@mui/material";
import { useState } from "react";

const ProductCard = ({ producto, onAdd }) => {
  const [cantidad, setCantidad] = useState(1);

  const handleQuickAdd = () => {
    onAdd(producto, 1);
  };

  const handleCustomAdd = () => {
    if (cantidad > 0) {
      onAdd(producto, cantidad);
      setCantidad(1);
    }
  };

  const isInsumo = producto.tipo === "insumo";
  const unidad = isInsumo ? "litros" : "unidades";

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 3,
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        width: "100%",
        maxWidth: 300,
        backgroundColor: "background.paper",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {producto.nombre}
          </Typography>
          <Chip
            label={isInsumo ? "Insumo" : "Producto"}
            color={isInsumo ? "default" : "primary"}
            size="small"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
          noWrap
        >
          {producto.descripcion || "Sin descripción"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 1 }}
          color={producto.stock > 0 ? "text.secondary" : "error"}
        >
          Stock: {producto.stock} {unidad}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleQuickAdd}
            disabled={producto.stock <= 0}
          >
            +1
          </Button>
          <TextField
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            size="small"
            sx={{ width: "70px" }}
            inputProps={{ min: 1 }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={handleCustomAdd}
            disabled={producto.stock <= 0}
          >
            Agregar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
