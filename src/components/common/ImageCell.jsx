import { useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

const ImageCell = ({ url, size = 50, radius = 8 }) => {
  const [error, setError] = useState(false);
  const showIcon = !url || error;

  return showIcon ? (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: radius,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Sin imagen"
    >
      <ImageNotSupportedOutlinedIcon sx={{ color: "text.secondary" }} />
    </Box>
  ) : (
    <Box
      component="img"
      src={url}
      alt="Producto"
      onError={() => setError(true)}
      sx={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "cover",
        border: "1px solid",
        borderColor: "divider",
      }}
    />
  );
};
ImageCell.propTypes = {
  url: PropTypes.string,
  size: PropTypes.number,
  radius: PropTypes.number,
};

export default ImageCell;
