import PropTypes from "prop-types";
import { Button, useMediaQuery, useTheme } from "@mui/material";

const DangerActionButton = ({
  label,
  startIcon,
  onClick,
  disabled = false,
  loading = false,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const bg = theme.palette.error.main;
  const hoverBg = theme.palette.error.dark;

  const isDisabled = disabled || loading;

  return (
    <Button
      variant="contained"
      color="error"
      onClick={onClick}
      startIcon={startIcon}
      disableElevation
      disabled={isDisabled}
      sx={[
        {
          textTransform: "none",
          fontWeight: 800,
          fontSize: isMobile ? 13 : 14,
          borderRadius: 1,
          px: isMobile ? 1.8 : 2.2,
          py: isMobile ? 0.7 : 0.8,
          letterSpacing: 0,
          backgroundColor: bg,
          color: theme.palette.common.white,
          boxShadow: "none",
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
            boxShadow: "none",
          },
          "&:active": {
            backgroundColor: hoverBg,
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
          },
        },
        sx,
      ]}
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
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

export default DangerActionButton;
