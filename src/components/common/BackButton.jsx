import PropTypes from "prop-types";
import { Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, label }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Color negro en light, gris claro en dark
  const borderColor =
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#191919";

  const textColor = theme.palette.mode === "dark" ? "#fff" : "#191919";

  return (
    <Button
      startIcon={<ArrowBackIcon sx={{ color: textColor }} />}
      variant="outlined"
      onClick={() => navigate(to)}
      sx={{
        mb: 2,
        textTransform: "none",
        fontSize: "1.03rem",
        fontWeight: 500,
        borderRadius: "8px",
        padding: "0.37rem 1.15rem",
        border: `1.5px solid ${borderColor}`,
        color: textColor,
        background: "transparent",
        boxShadow: "none",
        letterSpacing: 0.1,
        minWidth: 0,
        "&:hover": {
          background:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#f6f6f6",
          color: textColor,
          borderColor:
            theme.palette.mode === "dark" ? theme.palette.grey[600] : "#111",
          boxShadow: "0 1px 6px 0 #1111",
        },
      }}
    >
      {label}
    </Button>
  );
};

BackButton.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default BackButton;
