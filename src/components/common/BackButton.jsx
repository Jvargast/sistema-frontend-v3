import PropTypes from "prop-types";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, label }) => {
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      color="primary"
      onClick={() => navigate(to)}
      sx={{
        marginBottom: "1rem",
        textTransform: "none",
        fontSize: "1rem",
        borderRadius: 50,
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
