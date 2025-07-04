import { Typography, Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.text.primary}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="subtitle1" color={theme.palette.text.secondary}>
        {subtitle}
      </Typography>
    </Box>
  );
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Header;
