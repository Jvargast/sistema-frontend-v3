import PropTypes from "prop-types";
import {
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  InputAdornment,
  useTheme,
  Tooltip,
  Box,
} from "@mui/material";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { parseCLP } from "../../utils/currency";
import { formatCLP } from "../../utils/formatUtils";

export default function MontoIvaInput({
  value,
  ivaIncluido,
  onChangeMonto,
  onToggleIva,
  netoIvaTotal,
}) {
  const theme = useTheme();

  return (
    <Stack spacing={1.25}>
      <TextField
        label="Monto"
        value={value}
        onChange={(e) => {
          const raw = parseCLP(e.target.value);
          onChangeMonto(formatCLP(raw));
        }}
        placeholder="$ 0"
        fullWidth
        inputProps={{ inputMode: "numeric" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PaidOutlined sx={{ opacity: 0.8 }} />
            </InputAdornment>
          ),
        }}
        helperText={
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: 13,
              color: theme.palette.text.secondary,
            }}
          >
            <span>Neto: {formatCLP(netoIvaTotal.neto)}</span>
            <span>IVA (19%): {formatCLP(netoIvaTotal.iva)}</span>
            <span>Total: {formatCLP(netoIvaTotal.total)}</span>
            <Tooltip
              title={
                ivaIncluido
                  ? "El monto ingresado ya trae IVA"
                  : "El monto ingresado es neto (sin IVA)"
              }
            >
              <InfoOutlined fontSize="small" sx={{ opacity: 0.7 }} />
            </Tooltip>
          </Box>
        }
        FormHelperTextProps={{ component: "div" }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={ivaIncluido}
            onChange={(_, v) => onToggleIva(v)}
            size="small"
          />
        }
        label={ivaIncluido ? "Incluye IVA (19%)" : "Monto sin IVA"}
      />
    </Stack>
  );
}

MontoIvaInput.propTypes = {
  value: PropTypes.string.isRequired,
  ivaIncluido: PropTypes.bool.isRequired,
  onChangeMonto: PropTypes.func.isRequired,
  onToggleIva: PropTypes.func.isRequired,
  netoIvaTotal: PropTypes.shape({
    neto: PropTypes.number,
    iva: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
};
