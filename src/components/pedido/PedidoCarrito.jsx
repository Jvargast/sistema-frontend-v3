import { Box, Typography, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  updateItemPrice,
  updateItemQuantity,
} from "../../store/reducers/cartSlice";
import ShoppingCartItem from "../venta/ShoppingCartItem";
import { useState } from "react";

const PedidoCarrito = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  const handleQuantityChange = (id_producto, tipo, cantidad) => {
    if (cantidad < 1) return;
    dispatch(updateItemQuantity({ id_producto, tipo, cantidad }));
  };

  const handlePriceChange = (id_producto, tipo, nuevoPrecio) => {
    dispatch(updateItemPrice({ id_producto, tipo, nuevoPrecio }));
  };

  const handleRemoveFromCart = (id_producto, tipo) => {
    dispatch(removeItem({ id_producto, tipo }));
  };

  // Estado para el scroll del contenedor
  const [scrollPos, setScrollPos] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  const handleScroll = (e) => {
    setScrollPos(e.target.scrollTop);
    setContainerHeight(e.target.clientHeight);
    setScrollHeight(e.target.scrollHeight);
  };

  // Determina si hay scroll "arriba" o "abajo"
  const topFadeActive = scrollPos > 10; 
  const bottomDistance = scrollHeight - containerHeight - scrollPos;
  const bottomFadeActive = bottomDistance > 10; 

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "100%",
        position: "relative",
      }}
    >
      {cart.length > 0 ? (
        <>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            textAlign="center"
          >
            Carrito de Compras
          </Typography>
          <Box
            onScroll={handleScroll}
            sx={{
              mt: 2,
              maxHeight: "400px",
              overflowY: "auto",
              /* position: "relative", */
              // Estilos del scrollbar (para navegadores webkit)
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: "4px",
              },
            }}
          >
            <Grid container spacing={2}>
              {cart.map((item) => (
                <Grid item xs={12} key={`${item.id_producto}-${item.tipo}`}>
                  <ShoppingCartItem
                    item={item}
                    onRemove={handleRemoveFromCart}
                    onQuantityChange={handleQuantityChange}
                    onPriceChange={handlePriceChange}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Overlay superior (se muestra si hay scroll arriba) */}
            {topFadeActive && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "20px",
                  background: "linear-gradient(to bottom, #fff, transparent)",
                  pointerEvents: "none",
                  transition: "background 0.2s ease",
                }}
              />
            )}

            {/* Overlay inferior (se muestra si hay scroll abajo) */}
            {bottomFadeActive && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "20px",
                  background: "linear-gradient(to top, #fff, transparent)",
                  pointerEvents: "none",
                  transition: "background 0.2s ease",
                }}
              />
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" color="textSecondary" textAlign="center" component="div" >
            No hay productos en el carrito.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PedidoCarrito;
