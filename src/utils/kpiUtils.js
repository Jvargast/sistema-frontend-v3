// utils/kpiUtils.js
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";

export const getKpiConfig = (tipo) => {
  const map = {
    ingresos: {
      label: "Ingresos Totales",
      icon: AttachMoneyIcon,
      color: "success",
    },
    boleta: {
      label: "Ventas por Boleta",
      icon: ReceiptLongIcon,
      color: "primary",
    },
    factura: {
      label: "Ventas por Factura",
      icon: RequestQuoteIcon,
      color: "warning",
    },
    pedidos: {
      label: "Pedidos Creados",
      icon: PlaylistAddCheckIcon,
      color: "info",
    },
    entregas: {
      label: "Entregas Realizadas",
      icon: LocalShippingIcon,
      color: "secondary",
    },
    stock: {
      label: "Stock Disponible",
      icon: StoreIcon,
      color: "error",
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
