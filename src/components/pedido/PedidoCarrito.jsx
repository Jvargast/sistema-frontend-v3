import { Box, Typography, Grid, useTheme } from "@mui/material";
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
  const theme = useTheme();

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

  const [scrollPos, setScrollPos] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  const handleScroll = (e) => {
    setScrollPos(e.target.scrollTop);
    setContainerHeight(e.target.clientHeight);
    setScrollHeight(e.target.scrollHeight);
  };

  const topFadeActive = scrollPos > 10;
  const bottomDistance = scrollHeight - containerHeight - scrollPos;
  const bottomFadeActive = bottomDistance > 10;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        width: "100%",
        maxWidth: "100%",
        position: "relative",
      }}
    >
      {cart.length > 0 ? (
        <>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Carrito de Compras
          </Typography>
          <Box
            onScroll={handleScroll}
            sx={{
              mt: 2,
              maxHeight: "400px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: theme.palette.background.default,
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.action.selected,
                borderRadius: "4px",
              },
              position: "relative",
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

            {topFadeActive && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "20px",
                  background: `linear-gradient(to bottom, ${theme.palette.background.paper}, transparent)`,
                  pointerEvents: "none",
                  transition: "background 0.2s ease",
                }}
              />
            )}

            {bottomFadeActive && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "20px",
                  background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
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
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            component="div"
          >
            No hay productos en el carrito.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PedidoCarrito;
