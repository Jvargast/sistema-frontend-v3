import {
  Box,
  Typography,

  CircularProgress,
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";
import ProductCard from "../ProductCard";

const ProductosGrid = ({
  productos,
  loading,
  isSearching,
  page,
  totalPages,
  onPageChange,
  onAddToCart,
}) => (
  <Box width="100%" maxHeight="100%">
    {isSearching && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={3}
        fontSize="1rem"
      >
        <CircularProgress />
        <Typography ml={2} fontSize="1rem">
          Buscando productos...
        </Typography>
      </Box>
    )}

    {!loading && productos?.length > 0 ? (
      <>
        <Box
          sx={{
            display: { xs: "flex", md: "grid" },
            flexDirection: { xs: "column", md: "unset" },
            alignItems: { xs: "center", md: "unset" },
            gap: 2,
            gridTemplateColumns: { md: "repeat(4, 1fr)" }, 
            width: "100%",
            mb: 3,
          }}
        >
          {productos.map((product) => (
            <ProductCard
              key={product.id_producto}
              product={{
                ...product,
                precio: parseFloat(product.precio || 0),
              }}
              onAddToCart={onAddToCart}
              sx={{
                width: { xs: "90%", md: "100%" },
                maxWidth: 320,
              }}
            />
          ))}
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
          />
        </Box>
      </>
    ) : (
      !loading && <Typography>No se encontraron productos.</Typography>
    )}
  </Box>
);

ProductosGrid.propTypes = {
  productos: PropTypes.array,
  loading: PropTypes.bool,
  isSearching: PropTypes.bool,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductosGrid;
