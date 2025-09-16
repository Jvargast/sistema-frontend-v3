import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { formatCLP } from "../../utils/formatUtils";

const Row = ({ label, value, strong }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant={strong ? "h6" : "body2"}
      fontWeight={strong ? 700 : 500}
    >
      {value}
    </Typography>
  </Stack>
);

Row.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  strong: PropTypes.bool,
};

const CompraTotals = ({ resumen }) => {
  return (
    <Card>
      <CardHeader title="Resumen" subheader="Totales calculados" />
      <Divider />
      <CardContent>
        <Row label="Subtotal" value={formatCLP(resumen.subtotal)} />
        <Row label="IVA (19%)" value={formatCLP(resumen.iva)} />
        <Divider sx={{ my: 1 }} />
        <Row label="Total" value={formatCLP(resumen.total)} strong />
      </CardContent>
    </Card>
  );
};

CompraTotals.propTypes = { resumen: PropTypes.object.isRequired };
export default CompraTotals;
