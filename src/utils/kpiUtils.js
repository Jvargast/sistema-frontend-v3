import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const getKpiConfig = (tipo) => {
  const map = {
    ingresos: {
      labelKey: "dashboard.income_today",
      icon: AttachMoneyIcon,
      color: "success",
    },
    pedidos: {
      labelKey: "dashboard.orders_created_today",
      icon: PlaylistAddCheckIcon,
      color: "info",
    },
    producto_destacado: {
      labelKey: "dashboard.top_selling_product",
      icon: ShoppingCartIcon,
      color: "warning",
    },
  };

  return (
    map[tipo] || {
      labelKey: tipo,
      icon: AttachMoneyIcon,
      color: "primary",
    }
  );
};
