import { Box, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

export const Info = ({ label, value, children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.default
            : theme.palette.grey[900],
        borderRadius: 3, // 12px
        boxShadow: theme.shadows[1],
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        transition: "all 0.3s ease",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.secondary,
          textTransform: "uppercase",
          fontSize: "0.7rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          mt: 0.5,
          wordBreak: "break-word",
        }}
      >
        {children ?? value ?? "No especificado"}
      </Typography>
    </Box>
  );
};

Info.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};
