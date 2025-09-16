import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import MoneyOutlined from "@mui/icons-material/MoneyOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";

export const METODOS_PAGO = [
  { value: "efectivo", label: "Efectivo", icon: MoneyOutlined },
  {
    value: "transferencia",
    label: "Transferencia",
    icon: AccountBalanceOutlined,
  },
  {
    value: "tarjeta_credito",
    label: "Tarjeta de crédito",
    icon: CreditCardOutlined,
  },
  {
    value: "tarjeta_debito",
    label: "Tarjeta de débito",
    icon: CreditCardOutlined,
  },
  { value: "cheque", label: "Cheque", icon: ReceiptLongOutlined },
  { value: "otros", label: "Otros", icon: PaymentsOutlined },
];

export const getMetodoPagoLabel = (value) =>
  METODOS_PAGO.find((m) => m.value === value)?.label || value || "—";
