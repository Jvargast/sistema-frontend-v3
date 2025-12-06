import PropTypes from "prop-types";
import { Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, label }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const textColor = isDark
    ? theme.palette.grey[100]
    : theme.palette.text.primary;

  const borderColor = isDark
    ? theme.palette.grey[700]
    : theme.palette.grey[300];

  const hoverBorderColor = isDark
    ? theme.palette.grey[500]
    : theme.palette.primary.main;

  const bgColor = isDark ? "transparent" : "#f9fafb"; // gris muy suave
  const hoverBgColor = isDark ? theme.palette.grey[900] : "#eef2ff";

  return (
    <Button
      startIcon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
      variant="outlined"
      onClick={() => navigate(to)}
      disableElevation
      sx={{
        mb: 2,
        textTransform: "none",
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 999, // pill
        px: 1.8,
        py: 0.6,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor,
        color: textColor,
        backgroundColor: bgColor,
        letterSpacing: 0.2,
        display: "inline-flex",
        gap: 0.5,
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, transform 0.16s ease, box-shadow 0.16s ease",
        boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
        "& .MuiButton-startIcon": {
          mr: 0.5,
        },
        "&:hover": {
          backgroundColor: hoverBgColor,
          borderColor: hoverBorderColor,
          transform: "translateY(-1px)",
          boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
        },
        "&:active": {
          transform: "translateY(0)",
          boxShadow: "0 2px 8px rgba(15,23,42,0.16)",
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
