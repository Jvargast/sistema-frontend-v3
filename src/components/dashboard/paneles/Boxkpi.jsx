import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const MotionBox = motion.create(Box);

const  Boxkpi = ({
  title,
  value,
  icon: Icon = TrendingUpIcon,
  color = "primary",
  subtitle = "",
}) => {
  const theme = useTheme();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 3,
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.roles.border}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          transform: "translateY(-3px)",
          boxShadow: 4,
        },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: theme.palette[color].light,
          color: theme.palette[color].contrastText,
          width: 50,
          height: 50,
          fontSize: 26,
        }}
      >
        <Icon fontSize="inherit" />
      </Avatar>

      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: "1.5rem",
            mt: 0.5,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mt: 0.5,
              fontSize: "0.85rem",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </MotionBox>
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
