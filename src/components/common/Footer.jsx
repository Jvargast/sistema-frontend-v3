import { Box, Typography, Link, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

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
    </Box>
  );
};

export default Footer;
