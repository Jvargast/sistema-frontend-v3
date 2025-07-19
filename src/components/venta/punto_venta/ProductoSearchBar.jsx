import { TextField, InputAdornment } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import PropTypes from "prop-types";

const ProductoSearchBar = ({ value, onChange }) => (
  <TextField
    label="Buscar producto"
    variant="outlined"
    size="small"
    sx={{ fontSize: "1rem", mb: 3 }}
    value={value}
    onChange={onChange}
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchOutlined />
        </InputAdornment>
      ),
    }}
  />
);

ProductoSearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProductoSearchBar;
