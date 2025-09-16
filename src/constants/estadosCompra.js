import EditNoteOutlined from "@mui/icons-material/EditNoteOutlined";
import HowToRegOutlined from "@mui/icons-material/HowToRegOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";

export const ESTADOS_COMPRA = [
  {
    value: "borrador",
    label: "Borrador",
    color: "default",
    icon: EditNoteOutlined,
    order: 1,
  },
  {
    value: "aprobada",
    label: "Aprobada",
    color: "info",
    icon: HowToRegOutlined,
    order: 2,
  },
  {
    value: "recibida",
    label: "Recibida",
    color: "primary",
    icon: LocalShippingOutlined,
    order: 3,
  },
  {
    value: "facturada",
    label: "Facturada",
    color: "warning",
    icon: DescriptionOutlined,
    order: 4,
  },
  {
    value: "pagada",
    label: "Pagada",
    color: "success",
    icon: PaidOutlined,
    order: 5,
  },
  {
    value: "anulada",
    label: "Anulada",
    color: "error",
    icon: CancelOutlined,
    order: 6,
  },
];

export const getEstadoCompra = (v) =>
  ESTADOS_COMPRA.find((e) => e.value === v) || ESTADOS_COMPRA[0];
export const getEstadoCompraLabel = (v) =>
  getEstadoCompra(v)?.label || v || "—";
export const getEstadoCompraColor = (v) =>
  getEstadoCompra(v)?.color || "default";
