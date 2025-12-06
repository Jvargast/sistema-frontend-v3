import PropTypes from "prop-types";
import { Button, useMediaQuery, useTheme } from "@mui/material";

const PrimaryActionButton = ({ label, startIcon, onClick, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const bg = theme.palette.primary.main;
  const hoverBg = theme.palette.primary.dark;
  const activeBg = isDark
    ? theme.palette.primary.main
    : theme.palette.primary.dark;

  const lightShadow = "0 3px 10px rgba(15,23,42,0.18)";
  const darkShadow = "0 3px 10px rgba(0,0,0,0.65)";

  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={startIcon}
      disableElevation
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: isMobile ? 13 : 14,
        borderRadius: 1.2, // ~10px
        px: isMobile ? 2 : 2.4,
        py: isMobile ? 0.7 : 0.85,
        letterSpacing: 0.2,
        backgroundColor: bg,
        color: theme.palette.common.white,
        boxShadow: isDark ? darkShadow : lightShadow,
        display: "inline-flex",
        alignItems: "center",
        "& .MuiButton-startIcon": {
          marginRight: 0.6, 
          marginLeft: -0.2,
          "& > *:first-of-type": {
            fontSize: 20,
          },
        },
        transition:
          "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
        "&:hover": {
          backgroundColor: hoverBg,
          boxShadow: isDark
            ? "0 5px 14px rgba(0,0,0,0.7)"
            : "0 5px 16px rgba(15,23,42,0.24)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          backgroundColor: activeBg,
          transform: "translateY(0)",
          boxShadow: isDark ? darkShadow : lightShadow,
        },
        "&.Mui-disabled": {
          backgroundColor: isDark
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
          color: isDark ? theme.palette.grey[500] : theme.palette.grey[600],
          boxShadow: "none",
        },
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

PrimaryActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  startIcon: PropTypes.node,
  onClick: PropTypes.func,
};

export default PrimaryActionButton;
