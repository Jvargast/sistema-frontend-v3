import PropTypes from "prop-types";
import { Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, label }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      color="primary"
      onClick={() => navigate(to)}
      sx={{
        mb: 2,
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 500,
        borderRadius: "50px",
        padding: "0.4rem 1.2rem",
        borderWidth: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
          color:
            theme.palette.mode === "light"
              ? theme.palette.primary.contrastText
              : theme.palette.primary.contrastText,
          boxShadow: theme.shadows[3],
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
