import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Grid, Typography, Pagination } from "@mui/material";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";
import ProductCard from "../venta/ProductCard";
import { getStockForSucursal } from "../../utils/inventoryUtils";

const PedidoProductos = ({ selectedCategory, onAddToCart, sucursalId }) => {
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const queryArgs = useMemo(() => {
    if (!sucursalId) return null;
    return {
      categoria: selectedCategory === "all" ? undefined : selectedCategory,
      page,
      limit: pageSize,
      id_sucursal: Number(sucursalId),
    };
  }, [selectedCategory, page, pageSize, sucursalId]);

  const {
    data: productosData,
    isLoading,
    error,
  } = useGetAvailabreProductosQuery(queryArgs, { skip: !queryArgs });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sucursalId]);

  if (!sucursalId) {
    return (
      <Typography>Selecciona una sucursal para ver el inventario.</Typography>
    );
  }
  if (isLoading) return <Typography>Cargando productos...</Typography>;
  if (error)
    return <Typography color="error">Error al cargar productos</Typography>;

  const productos = productosData?.productos ?? [];
  const totalItems =
    productosData?.paginacion?.totalItems ??
    productosData?.totalItems ?? 
    0;

  const totalPages =
    productosData?.paginacion?.totalPages ??
    (totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0);

  const showPagination = (totalPages ?? 0) > 1;

  return (
    <Box>
      {productos?.length > 0 ? (
        <>
          <Grid container spacing={1} mb={3}>
            {productos.map((product) => {
              const stockSucursal = getStockForSucursal(
                product.inventario,
                Number(sucursalId)
              );
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  key={product.id_producto}
                >
                  <ProductCard
                    product={{
                      ...product,
                      precio: parseFloat(product.precio || 0),
                    }}
                    stock={stockSucursal}
                    onAddToCart={onAddToCart}
                    disableAdd={stockSucursal <= 0}
                  />
                </Grid>
              );
            })}
          </Grid>

          {showPagination && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.max(1, totalPages)} 
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Typography>No se encontraron productos.</Typography>
      )}
    </Box>
  );
};

PedidoProductos.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  sucursalId: PropTypes.number,
};

export default PedidoProductos;
