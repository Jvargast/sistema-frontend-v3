import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import PropTypes from 'prop-types';
import FlexBetween from "../layout/FlexBetween";

const StatBox = ({ title, icon, useQueryHook, description }) => {
  const theme = useTheme();

  // Ejecutar el hook que trae los datos
  const { data, isLoading, isError } = useQueryHook();

  // Mostrar un indicador de carga
  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={theme.palette.background.default}
        borderRadius="0.55rem"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        height="100%" // Mantener responsividad
        width="100%" // Mantener responsividad
      >
        <CircularProgress />
      </Box>
    );
  }
  // Mostrar un mensaje de error si ocurre
  if (isError) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        backgroundColor={theme.palette.background.default}
        borderRadius="0.55rem"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        width="100%" // Mantener responsividad
      >
        <Typography color={theme.palette.error.main}>
          Error al cargar datos
        </Typography>
      </Box>
    );
  }

  // Renderizar los datos una vez cargados
  const value = data?.cantidad || 0;
  const increase = `${data?.porcentaje || 0}%`;
  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.default}
      borderRadius="0.55rem"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      height="100%"
      width="100%" // Ajustar ancho responsivo
      maxWidth="300px" // Limitar el ancho máximo
      maxHeight="200px" // Limitar el alto máximo
    >
      <FlexBetween>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.secondary[100],
            fontWeight: 800,
            fontSize: "1.2rem",
          }}
        >
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[100] }}
      >
        {value} +
      </Typography>
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: theme.palette.secondary[100] }}
        >
          {increase}
        </Typography>
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
  );
};
StatBox.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  useQueryHook: PropTypes.func.isRequired,
  description: PropTypes.string,
};

export default StatBox;
