import { Box, TextField, MenuItem, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { useGetAllChoferesQuery } from "../../store/services/usuariosApi";

const ChoferSelector = ({ selectedChofer, setSelectedChofer }) => {
  const { data: choferes, isLoading, error } = useGetAllChoferesQuery();

  if (isLoading) return <Typography>Cargando choferes...</Typography>;
  if (error) return <Typography color="error">Error al obtener choferes</Typography>;

  return (
    <Box mb={3}>
      <TextField
        select
        fullWidth
        label="Seleccionar Chofer"
        value={selectedChofer || ""}
        onChange={(e) => setSelectedChofer(e.target.value)}
        variant="outlined"
      >
        {choferes?.map((chofer) => (
          <MenuItem key={chofer.rut} value={chofer.rut}>
            {chofer.nombre}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
ChoferSelector.propTypes = {
  selectedChofer: PropTypes.string,
  setSelectedChofer: PropTypes.func.isRequired,
};

export default ChoferSelector;
