import { Box, Typography, Avatar, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const Boxkpi = ({
  title,
  value,
  icon: Icon = TrendingUpIcon,
  color = "primary",
  subtitle,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: theme.palette[color].light,
          color: theme.palette[color].dark,
          width: 44,
          height: 44,
          fontSize: 24,
        }}
      >
        <Icon />
      </Avatar>

      <Box>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: "1.25rem",
            mt: 0.5,
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

Boxkpi.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
  ]),
  subtitle: PropTypes.string,
};

export default Boxkpi;
