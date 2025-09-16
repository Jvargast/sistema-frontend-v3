import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";

export const iconForMime = (m) => {
  if (!m) return DescriptionOutlined;
  if (m.includes("pdf")) return PictureAsPdf;
  if (m.startsWith("image/")) return ImageOutlined;
  return DescriptionOutlined;
};

export const tipoChipColor = (t) =>
  ({
    operativo: "primary",
    personal: "secondary",
    financiero: "info",
    impuestos: "warning",
    logistica: "success",
  }[String(t || "").toLowerCase()] || "default");

export const diff = (prev, next) => {
  const patch = {};
  Object.keys(next).forEach((k) => {
    if (next[k] !== prev[k]) patch[k] = next[k];
  });
  return patch;
};
