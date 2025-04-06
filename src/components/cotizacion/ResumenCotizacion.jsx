import { Box, Typography, TextField } from "@mui/material";
import PropTypes from "prop-types";

const ResumenCotizacion = ({
  totalNeto,
  iva,
  totalFinal,
  impuesto,
  descuento,
  notas,
  onChange,
  modoEdicion,
}) => {
  const currencyFormat = (valor) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);

  const estiloEditable = {
    variant: "standard",
    fullWidth: true,
    InputProps: {
      disableUnderline: true,
      sx: {
        color: "error.main",
        fontWeight: "bold",
        fontSize: "1rem",
        backgroundColor: "transparent",
      },
    },
    sx: {
      maxWidth: 200,
      "& input": {
        color: "error.main",
      },
      "& textarea": {
        color: "error.main",
      },
    },
  };

  return (
    <Box textAlign="right" pr={1}>
      <Typography sx={{ mb: 1 }}>
        <strong>Subtotal:</strong> {currencyFormat(totalNeto)}
      </Typography>

      {modoEdicion ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap={2}
          mt={2}
        >
          <TextField
            label="Impuesto (%)"
            type="number"
            value={isNaN(impuesto) ? "" : impuesto * 100}
            onChange={(e) =>
              onChange(
                "impuesto",
                e.target.value === "" ? "" : parseFloat(e.target.value) / 100
              )
            }
            {...estiloEditable}
          />

          <TextField
            label="Descuento total (%)"
            type="number"
            value={isNaN(descuento) ? "" : descuento * 100}
            onChange={(e) =>
              onChange(
                "descuento",
                e.target.value === "" ? "" : parseFloat(e.target.value) / 100
              )
            }
            {...estiloEditable}
          />

          <TextField
            label="Notas"
            value={notas}
            onChange={(e) => onChange("notas", e.target.value)}
            multiline
            minRows={2}
            {...estiloEditable}
            sx={{ maxWidth: 400, ...estiloEditable.sx }}
          />
        </Box>
      ) : (
        <>
          <Typography>
            <strong>IVA ({impuesto * 100}%):</strong> {currencyFormat(iva)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            <strong>Total:</strong> {currencyFormat(totalFinal)}
          </Typography>
        </>
      )}
    </Box>
  );
};

ResumenCotizacion.propTypes = {
  totalNeto: PropTypes.number.isRequired,
  iva: PropTypes.number.isRequired,
  totalFinal: PropTypes.number.isRequired,
  impuesto: PropTypes.number.isRequired,
  descuento: PropTypes.number,
  notas: PropTypes.string,
  onChange: PropTypes.func,
  modoEdicion: PropTypes.bool,
};

export default ResumenCotizacion;
