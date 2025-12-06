import PropTypes from "prop-types";
import { Button, useMediaQuery, useTheme } from "@mui/material";

const DangerActionButton = ({
  label,
  startIcon,
  onClick,
  disabled = false,
  loading = false,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const bg = theme.palette.error.main;
  const hoverBg = theme.palette.error.dark;
  const activeBg = isDark ? theme.palette.error.main : theme.palette.error.dark;

  const lightShadow = "0 3px 10px rgba(185,28,28,0.25)";
  const darkShadow = "0 3px 10px rgba(0,0,0,0.7)";

  const isDisabled = disabled || loading;

  return (
    <Button
      variant="contained"
      color="error"
      onClick={onClick}
      startIcon={startIcon}
      disableElevation
      disabled={isDisabled}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: isMobile ? 13 : 14,
        borderRadius: 1.2,
        px: isMobile ? 2 : 2.4,
        py: isMobile ? 0.7 : 0.85,
        letterSpacing: 0.2,
        backgroundColor: bg,
        color: theme.palette.common.white,
        boxShadow: isDisabled ? "none" : isDark ? darkShadow : lightShadow,
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
          backgroundColor: isDisabled ? bg : hoverBg,
          boxShadow: isDisabled
            ? "none"
            : isDark
            ? "0 5px 14px rgba(0,0,0,0.75)"
            : "0 5px 16px rgba(185,28,28,0.32)",
          transform: isDisabled ? "none" : "translateY(-1px)",
        },
        "&:active": {
          backgroundColor: activeBg,
          transform: "translateY(0)",
          boxShadow: isDisabled ? "none" : isDark ? darkShadow : lightShadow,
        },
        "&.Mui-disabled": {
          backgroundColor: isDark
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
          color: isDark ? theme.palette.grey[500] : theme.palette.grey[600],
        },
      }}
      {...props}
    >
      {loading ? "Eliminando..." : label}
    </Button>
  );
};

DangerActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  startIcon: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default DangerActionButton;
