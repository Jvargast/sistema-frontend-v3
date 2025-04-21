import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; 

export const getKpiConfig = (tipo) => {
  const map = {
    ingresos: {
      label: "Ingresos Hoy",
      icon: AttachMoneyIcon,
      color: "success",
    },
    pedidos: {
      label: "Pedidos Creados Hoy",
      icon: PlaylistAddCheckIcon,
      color: "info",
    },
    producto_destacado: {
      label: "Producto Más Vendido",
      icon: ShoppingCartIcon,
      color: "warning",
    },
  };

  return (
    map[tipo] || {
      label: tipo,
      icon: AttachMoneyIcon,
      color: "primary",
    }
  );
};
