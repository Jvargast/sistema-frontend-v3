import { Box, Typography, Link, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const version = import.meta.env.VITE_APP_VERSION || "v0.0.0";

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Una solución de{" "}
        <Link
          href="https://wou.cl"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="inherit"
          sx={{ fontWeight: 500 }}
        >
          WOU Chile
        </Link>{" "}
        © {new Date().getFullYear()}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          mt: 0.25,
          display: "block",
          color: "text.disabled",
          letterSpacing: 0.2,
        }}
      >
        Versión {version}
      </Typography>
    </Box>
  );
};

export default Footer;
