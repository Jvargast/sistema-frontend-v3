import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Grid, Typography, Pagination } from "@mui/material";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";
import ProductCard from "../venta/ProductCard";
import { getStockForSucursal } from "../../utils/inventoryUtils";

const PedidoProductos = ({ selectedCategory, onAddToCart, sucursalId }) => {
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const {
    data: productosData,
    isLoading,
    error,
    refetch,
  } = useGetAvailabreProductosQuery(
    {
      categoria: selectedCategory === "all" ? undefined : selectedCategory,
      page,
      limit: pageSize,
      id_sucursal: sucursalId ? Number(sucursalId) : undefined,
    },
    { skip: !sucursalId }
  );

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sucursalId]);
  useEffect(() => {
    if (sucursalId) refetch();
  }, [selectedCategory, page, sucursalId, refetch]);

  if (!sucursalId)
    return (
      <Typography>Selecciona una sucursal para ver el inventario.</Typography>
    );
  if (isLoading) return <Typography>Cargando productos...</Typography>;
  if (error)
    return <Typography color="error">Error al cargar productos</Typography>;

  return (
    <Box>
      {productosData?.productos.length > 0 ? (
        <>
          <Grid container spacing={1} mb={3}>
            {productosData?.productos?.map((product) => {
              const stockSucursal = getStockForSucursal(
                product.inventario,
                sucursalId
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
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={
                productosData?.paginacion?.totalPages ||
                Math.ceil(productosData?.paginacion.totalItems / pageSize)
              }
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
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
