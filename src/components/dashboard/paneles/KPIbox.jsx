import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

const KPIBox = ({ title, value }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        textAlign: "center",
        borderRadius: 2,
        backgroundColor: "transparent", 
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <Typography variant="h6" sx={{ color: "#555", fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{ color: "#1976D2", fontWeight: "bold", mt: 1 }}
      >
        {value}
      </Typography>
    </Box>
  );
};

KPIBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default KPIBox;
