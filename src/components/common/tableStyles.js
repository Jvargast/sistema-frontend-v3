import { alpha } from "@mui/material/styles";

const getHeaderBg = (theme) =>
  theme.palette.mode === "light"
    ? theme.palette.grey[100]
    : theme.palette.grey[900];

const getFooterBg = (theme) =>
  theme.palette.mode === "light"
    ? theme.palette.grey[50]
    : theme.palette.grey[900];

export const getStandardDataGridSx = (theme, sx = {}) => ({
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  overflow: "hidden",
  bgcolor: "background.paper",
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 30px rgba(15, 23, 42, 0.06)"
      : "0 10px 30px rgba(0, 0, 0, 0.24)",
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: getHeaderBg(theme),
    color: "text.primary",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-columnHeader": {
    "&:focus, &:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: "text.primary",
    display: "flex",
    alignItems: "center",
    "&:not(:last-child)": {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    "&:focus, &:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-row": {
    bgcolor: "background.paper",
    transition: "background-color 0.15s ease",
  },
  "& .MuiDataGrid-row:hover": {
    bgcolor: alpha(theme.palette.primary.main, 0.04),
  },
  "& .MuiDataGrid-footerContainer": {
    bgcolor: getFooterBg(theme),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-toolbarContainer": {
    p: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiIconButton-root:focus, & .MuiIconButton-root:focus-visible": {
    outline: "none",
  },
  ...sx,
});

export const getStandardTablePaperSx = (theme, sx = {}) => ({
  p: { xs: 1.5, md: 2 },
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "background.paper",
  boxShadow:
    theme.palette.mode === "light"
      ? "0 10px 30px rgba(15, 23, 42, 0.06)"
      : "0 10px 30px rgba(0, 0, 0, 0.24)",
  overflow: "hidden",
  ...sx,
});

export const getStandardTableSx = (theme, sx = {}) => ({
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    bgcolor: getHeaderBg(theme),
    color: "text.primary",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  "& .MuiTableBody-root .MuiTableRow-root": {
    transition: "background-color 0.15s ease",
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover": {
    bgcolor: alpha(theme.palette.primary.main, 0.04),
  },
  "& .MuiTableBody-root .MuiTableCell-root": {
    color: "text.primary",
  },
  ...sx,
});

export const getActionIconButtonSx = (theme, color = "primary", sx = {}) => {
  const actionPalette = {
    default: "#0F172A",
    primary: "#0F172A",
    edit: "#0F172A",
    secondary: "#475569",
    info: "#475569",
    view: "#475569",
    error: theme.palette.error.main,
    delete: theme.palette.error.main,
  };

  const main =
    actionPalette[color] ||
    theme.palette[color]?.main ||
    theme.palette.primary.main;
  const hoverPalette = {
    default: theme.palette.common.black,
    primary: theme.palette.common.black,
    edit: theme.palette.common.black,
    secondary: "#334155",
    info: "#334155",
    view: "#334155",
    error: theme.palette.error.dark,
    delete: theme.palette.error.dark,
  };
  const hover = hoverPalette[color] || theme.palette[color]?.dark || main;

  return {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: "50%",
    border: 0,
    color: theme.palette.common.white,
    bgcolor: main,
    boxShadow: `0 5px 12px ${alpha(main, 0.22)}`,
    transition:
      "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
    "&:hover": {
      bgcolor: hover,
      boxShadow: `0 7px 16px ${alpha(hover, 0.26)}`,
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      bgcolor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      boxShadow: "none",
    },
    ...sx,
  };
};
