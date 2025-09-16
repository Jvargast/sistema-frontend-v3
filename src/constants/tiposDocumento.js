import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import SummarizeOutlined from "@mui/icons-material/SummarizeOutlined";

export const TIPOS_DOCUMENTO = [
  { value: "boleta", label: "Boleta", icon: ReceiptLongOutlined },
  { value: "factura", label: "Factura", icon: DescriptionOutlined },
  {
    value: "guia_despacho",
    label: "Guía de despacho",
    icon: SummarizeOutlined,
  },
  { value: "nota_credito", label: "Nota de crédito", icon: SummarizeOutlined },
  { value: "nota_debito", label: "Nota de débito", icon: SummarizeOutlined },
  { value: "ticket", label: "Ticket", icon: ReceiptLongOutlined },
  { value: "otro", label: "Otro", icon: DescriptionOutlined },
];

export const getDocTipoLabel = (v) =>
  TIPOS_DOCUMENTO.find((t) => t.value === v)?.label || v || "—";
