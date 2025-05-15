import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 2,
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
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
