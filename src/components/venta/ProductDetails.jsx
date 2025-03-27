import { useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AsyncSelect from "react-select/async";

const ProductDetails = ({ value, onChange, productos, setSearchTerm }) => {
  const [details, setDetails] = useState(value || []);

  const handleAddProduct = () => {

    const newDetails = [
      ...details,
      { id_producto: "", cantidad: "", nombre_producto: "" },
    ];
    setDetails(newDetails);
    onChange(newDetails);
  };

  const handleRemoveProduct = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
    onChange(updatedDetails);
  };

  const handleInputChange = (index, field, newValue) => {
    const updatedDetails = [...details]; 
    const detailToUpdate = updatedDetails[index]; 

    if (!detailToUpdate) {

      console.error(`No existe un detalle en el índice ${index}`);
      return;
    }

    detailToUpdate[field] = newValue;

    setDetails(updatedDetails);
    onChange(updatedDetails);
  };

  const loadProductOptions = async (inputValue) => {
    setSearchTerm(inputValue); 
    const options = productos.map((product) => ({
      value: String(product.id_producto),
      label: product.nombre_producto,
    }));
    
    return options;
  };

  return (
    <Box>
      <Typography variant="h6">Detalles de Productos</Typography>
      {details.map((detail, index) => (
        <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
          <Box style={{ flex: 2 }}>
            <AsyncSelect
              placeholder="Buscar producto..."
              cacheOptions
              defaultOptions
              loadOptions={loadProductOptions}
              value={
                detail.id_producto
                  ? {
                      value: String(detail.id_producto), 
                      label: detail.nombre_producto || "",
                    }
                  : null
              }
              onChange={(selectedOption) => {
                console.log("Opción seleccionada:", selectedOption); 
                handleInputChange(index, "id_producto", selectedOption.value);
                handleInputChange(
                  index,
                  "nombre_producto",
                  selectedOption.label
                );
              }}
            />
          </Box>
          <TextField
            label="Cantidad"
            type="number"
            value={detail.cantidad || ""}
            onChange={(e) =>
              handleInputChange(index, "cantidad", e.target.value)
            }
            style={{ flex: 1 }}
          />
          <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
      >
        Agregar Producto
      </Button>
    </Box>
  );
};
ProductDetails.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  productos: PropTypes.array.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default ProductDetails;
