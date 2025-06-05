import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const SectionHeader = ({ children }) => {
  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(90deg, #f7fafc 0%, #f1f5f9 100%)"
            : "linear-gradient(90deg, #222 0%, #333 100%)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        px: 2,
        py: 1.2,

        boxShadow: "0 1px 6px 0 #ececec40",
        border: "1.5px solid",
        borderColor: "divider",
        borderBottom: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 54,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        align="center"
        sx={{
          color: "primary.main",
          letterSpacing: 1.2,
          fontSize: { xs: "1.15rem", md: "1.18rem" },
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};
SectionHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionHeader;
