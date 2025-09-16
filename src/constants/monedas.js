import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import EuroOutlined from "@mui/icons-material/EuroOutlined";

export const MONEDAS = [
  {
    value: "CLP",
    label: "Peso chileno",
    symbol: "$",
    locale: "es-CL",
    decimals: 0,
    icon: PaymentsOutlined,
  },
  {
    value: "USD",
    label: "Dólar ee.uu",
    symbol: "US$",
    locale: "en-US",
    decimals: 2,
    icon: AttachMoneyOutlined,
  },
  {
    value: "EUR",
    label: "Euro",
    symbol: "€",
    locale: "de-DE",
    decimals: 2,
    icon: EuroOutlined,
  },
];

export const getMoneda = (v) =>
  MONEDAS.find((m) => m.value === v) || MONEDAS[0];
export const getMonedaLabel = (v) => getMoneda(v)?.label || v || "—";
export const getMonedaSymbol = (v) => getMoneda(v)?.symbol || "";
