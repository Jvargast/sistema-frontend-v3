import { Box, Typography, Button, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const PedidoResumen = ({ total, isLoading, error, onSubmit }) => {
  return (
    <Box
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 2,
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        gutterBottom
        sx={{ fontWeight: "bold", fontSize: "2.5rem", color: "#424242" }}
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
          "Crear Pedido"
        )}
      </Button>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error: {error.message}
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
};

export default PedidoResumen;
