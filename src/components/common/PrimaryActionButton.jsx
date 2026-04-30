import PropTypes from "prop-types";
import { Button, useMediaQuery, useTheme } from "@mui/material";

const PrimaryActionButton = ({ label, startIcon, onClick, sx, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={startIcon}
      disableElevation
      sx={[
        {
          textTransform: "none",
          fontWeight: 800,
          fontSize: isMobile ? 13 : 14,
          borderRadius: 1,
          px: isMobile ? 1.8 : 2.2,
          py: isMobile ? 0.7 : 0.8,
          letterSpacing: 0,
          backgroundColor: "#0F172A",
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
            backgroundColor: theme.palette.common.black,
            boxShadow: "none",
          },
          "&:active": {
            backgroundColor: theme.palette.common.black,
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
            boxShadow: "none",
          },
        },
        sx,
      ]}
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
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

export default PrimaryActionButton;
