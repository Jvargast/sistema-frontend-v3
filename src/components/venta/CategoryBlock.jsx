import { Box, Typography } from "@mui/material";
import PropTypes from 'prop-types';

const CategoryBlock = ({ category, isSelected, onClick }) => {
  return (
    <Box
      onClick={() => onClick(category)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        borderRadius: 2,
        border: isSelected ? "2px solid #7c4dff" : "1px solid #e0e0e0",
        backgroundColor: isSelected ? "#f3e5f5" : "#fff",
        cursor: "pointer",
        boxShadow: isSelected ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
        ":hover": {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        width: 100,
        height: 100,
        textAlign: "center",
      }}
    >
      <Typography
        noWrap
        variant="body2"
        sx={{ fontWeight: "bold", color: "#4a4a4a" }}
      >
        {category}
      </Typography>
    </Box>
  );
};
CategoryBlock.propTypes = {
  category: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CategoryBlock;
