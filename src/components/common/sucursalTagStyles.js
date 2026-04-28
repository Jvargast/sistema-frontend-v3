import { alpha } from "@mui/material/styles";

const SUCURSAL_TAG_COLORS = [
  { color: "#0F172A", bg: "#E8ECF3", border: "#CBD5E1" },
  { color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD" },
  { color: "#047857", bg: "#D1FAE5", border: "#6EE7B7" },
  { color: "#B45309", bg: "#FEF3C7", border: "#FCD34D" },
  { color: "#BE123C", bg: "#FFE4E6", border: "#FDA4AF" },
  { color: "#0F766E", bg: "#CCFBF1", border: "#5EEAD4" },
  { color: "#6D28D9", bg: "#EDE9FE", border: "#C4B5FD" },
  { color: "#334155", bg: "#F1F5F9", border: "#CBD5E1" },
];

const getTagColor = (index = 0) =>
  SUCURSAL_TAG_COLORS[Math.abs(Number(index) || 0) % SUCURSAL_TAG_COLORS.length];

export const getSucursalTagSx = (theme, index = 0, sx = {}) => {
  const token = getTagColor(index);
  const isLight = theme.palette.mode === "light";
  const color = isLight ? token.color : theme.palette.common.white;
  const bgcolor = isLight ? token.bg : alpha(token.color, 0.3);
  const borderColor = isLight ? token.border : alpha(token.border, 0.48);

  return {
    borderRadius: 1,
    border: "1px solid",
    borderColor,
    bgcolor,
    color,
    fontWeight: 800,
    maxWidth: 170,
    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "& .MuiChip-deleteIcon": {
      color: alpha(color, 0.58),
      "&:hover": { color },
    },
    ...sx,
  };
};

export const getSucursalDotSx = (theme, index = 0, sx = {}) => {
  const token = getTagColor(index);

  return {
    width: 8,
    height: 8,
    borderRadius: "50%",
    bgcolor:
      theme.palette.mode === "light"
        ? token.color
        : alpha(token.border, 0.86),
    flex: "0 0 auto",
    ...sx,
  };
};
