import { Typography, Divider, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const TituloStepper = ({ texto }) => {
  const theme = useTheme();
  return (
    <div>
      <Typography
        variant="h6"
        fontWeight={800}
        mb={1}
        textAlign="center"
        sx={{
          color:
            theme.palette.mode === "dark" ? theme.palette.grey[100] : "#111", // Negro para light, gris claro para dark
          letterSpacing: 1.2,
        }}
      >
        {texto}
      </Typography>
      <Divider
        sx={{
          width: 48,
          mx: "auto",
          my: 1,
          borderColor:
            theme.palette.mode === "dark"
              ? theme.palette.primary.light
              : theme.palette.primary.main,
          borderWidth: 2,
          borderRadius: 2,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 2px 6px rgba(0,0,0,0.12)"
              : "0 2px 8px rgba(100,100,100,0.05)",
        }}
      />
    </div>
  );
};
TituloStepper.propTypes = {
  texto: PropTypes.string.isRequired,
};

export default TituloStepper;
