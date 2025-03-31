import { Typography, Button, Paper } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PropTypes from "prop-types";

const EmptyState = ({ title, subtitle, buttonText, onAction }) => (
  <Paper
    elevation={3}
    sx={{
      maxWidth: 600,
      mx: "auto",
      mt: 8,
      p: 5,
      textAlign: "center",
      borderRadius: 3,
      background: "linear-gradient(135deg, #f7f9fc, #e3ecf9)",
    }}
  >
    <InsertDriveFileIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
    <Typography variant="h5" fontWeight={700} gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {subtitle}
    </Typography>
    <Button variant="contained" color="primary" size="large" onClick={onAction}>
      {buttonText}
    </Button>
  </Paper>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default EmptyState;
