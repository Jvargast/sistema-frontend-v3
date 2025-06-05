import { Box, Typography, Button, CircularProgress, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const PedidoResumen = ({ total, isLoading, error, onSubmit, submitLabel }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
      }}
    >
      <Typography
        gutterBottom
        sx={{ fontWeight: "bold", fontSize: "2.5rem", color: theme.palette.text.primary, }}
      >
        Total: ${total.toFixed(0)}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onSubmit}
        disabled={isLoading}
        sx={{
          mt: 2,
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: 2,
          py: 1.5,
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          submitLabel
        )}
      </Button>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error: {error?.data?.message }
        </Typography>
      )}
    </Box>
  );
};

PedidoResumen.propTypes = {
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
};

export default PedidoResumen;
