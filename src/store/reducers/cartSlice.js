import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array de productos en el carrito
  subtotal: 0, // Subtotal sin impuestos ni descuentos
  total: 0, // Total después de aplicar impuestos y descuentos
  descuento: 0, // Descuento aplicado en porcentaje o monto fijo
  impuestos: 0, // Impuestos aplicados
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const producto = action.payload;
      const itemExistente = state.items.find(
        (item) => item.id_producto === producto.id_producto && item.tipo === producto.tipo
      );

      if (itemExistente) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        itemExistente.cantidad += producto.cantidad;
        itemExistente.subtotal += producto.cantidad * producto.precio_unitario;
      } else {
        // Si el producto no está en el carrito, agrégalo
        state.items.push({
          ...producto,
          subtotal: producto.cantidad * producto.precio_unitario,
        });
      }

      // Actualiza los totales
      state.subtotal += producto.cantidad * producto.precio_unitario;
      state.total = state.subtotal + state.impuestos - state.descuento;
    },
    removeItem: (state, action) => {
      const {id_producto, tipo} = action.payload;

      const itemIndex = state.items.findIndex(
        (item) => item.id_producto === id_producto &&
        item.tipo === tipo
      );

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];

        // Actualiza los totales antes de eliminar el producto
        state.subtotal -= item.subtotal;
        state.total = state.subtotal + state.impuestos - state.descuento;

        // Elimina el producto del carrito
        state.items.splice(itemIndex, 1);
      }
    },
    updateItemQuantity: (state, action) => {
      const { id_producto, cantidad, tipo } = action.payload;

      const item = state.items.find((item) => item.id_producto === id_producto && item.tipo === tipo);

      if (item) {
        const diferencia = cantidad - item.cantidad;
        item.cantidad = cantidad;
        item.subtotal = item.precio_unitario * cantidad;

        // Actualiza los totales
        state.subtotal += diferencia * item.precio_unitario;
        state.total = state.subtotal + state.impuestos - state.descuento;
      }
    },
    updateItemPrice: (state, action) => {
      const { id_producto, nuevoPrecio, tipo } = action.payload;

      const item = state.items.find((item) => item.id_producto === id_producto && item.tipo === tipo);

      if (item) {
        const diferencia = (nuevoPrecio - item.precio_unitario) * item.cantidad;
        item.precio_unitario = nuevoPrecio;
        item.subtotal = nuevoPrecio * item.cantidad;

        // Actualiza los totales
        state.subtotal += diferencia;
        state.total = state.subtotal + state.impuestos - state.descuento;
      }
    },
    applyDiscount: (state, action) => {
      const descuento = action.payload || 0; 
      state.descuento = (state.subtotal) * (descuento/100);
      state.total = state.subtotal + state.impuestos - state.descuento;
    },
    calculateTaxes: (state, action) => {
      const tasaImpuesto = action.payload || 0; 
      state.impuestos = (state.subtotal - state.descuento) * (tasaImpuesto / 100);
      state.total = state.subtotal + state.impuestos - state.descuento;
    },
    clearCart: (state) => {
      // Resetea el carrito
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      state.descuento = 0;
      state.impuestos = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  updateItemPrice, // Nueva acción para actualizar el precio
  applyDiscount,
  calculateTaxes,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

