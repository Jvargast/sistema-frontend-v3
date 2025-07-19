import { Typography, Box, useTheme, Divider } from "@mui/material";
import PropTypes from "prop-types";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.text.primary}
        gutterBottom
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "inline-block", position: "relative", mb: 2 }}>
        <Typography
          variant="subtitle1"
          color={theme.palette.text.secondary}
          sx={{ fontWeight: 400 }}
        >
          {subtitle}
        </Typography>

        <Divider
          sx={{
            position: "absolute",
            bottom: -2,
            left: 0,
            width: "100%",
            height: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
          }}
        />
      </Box>
    </Box>
  );
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Header;
