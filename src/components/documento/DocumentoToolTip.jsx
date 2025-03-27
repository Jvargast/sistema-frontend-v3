import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InfoIcon from "@mui/icons-material/Info";
import PaidIcon from "@mui/icons-material/Paid";
import { useGetDocumentoByIdQuery } from "../../store/services/documentoApi";

const DocumentoTooltip = ({ idDocumento }) => {
  const {
    data: documento,
    isLoading,
    isError,
  } = useGetDocumentoByIdQuery(idDocumento);

  if (isLoading)
    return (
      <Paper className="p-4 shadow-md flex justify-center items-center">
        <CircularProgress size={20} />
      </Paper>
    );

  if (isError || !documento)
    return (
      <Paper className="p-4 shadow-md">
        <Typography variant="body2" color="error">
          Error al cargar documento.
        </Typography>
      </Paper>
    );

  const colorChip =
    documento.estadoPago?.nombre === "Pagado"
      ? "success"
      : documento.estadoPago?.nombre === "Pendiente"
      ? "warning"
      : "default";

  return (
    <Paper className="p-4 shadow-lg max-w-sm">
      <Typography
        variant="h6"
        className="font-bold mb-2 text-teal-600 flex items-center gap-2"
      >
        <ReceiptLongIcon /> {documento.tipo_documento.toUpperCase()} #
        {documento.numero}
      </Typography>

      <Divider className="mb-2" />

      <Typography variant="body2" className="mb-1">
        <strong>Fecha Emisión:</strong>{" "}
        {new Date(documento.fecha_emision).toLocaleString()}
      </Typography>

      <Typography variant="body2" className="mb-1">
        <strong>Cliente:</strong> {documento.cliente?.nombre ?? "Sin nombre"}
      </Typography>

      <Typography variant="body2" className="mb-1">
        <strong>Emitido por:</strong> {documento.creador?.nombre} (
        {documento.creador?.rut})
      </Typography>

      <Typography variant="body2" component="div" className="mb-2">
        <strong>Estado de Pago:</strong>{" "}
        <Chip
          label={documento.estadoPago?.nombre}
          color={colorChip}
          size="small"
        />
      </Typography>

      <Divider className="my-2" />

      <Typography variant="body2" className="mb-1 flex items-center gap-1">
        <PaidIcon fontSize="small" /> <strong>Subtotal:</strong> $
        {documento.subtotal}
      </Typography>
      <Typography variant="body2" className="mb-1">
        <strong>IVA:</strong> ${documento.iva}
      </Typography>
      <Typography variant="body2" className="mb-2">
        <strong>Total:</strong> ${documento.total}
      </Typography>

      {documento.observaciones && (
        <>
          <Divider className="my-2" />
          <Typography
            variant="body2"
            className="flex items-center gap-1 text-indigo-700"
          >
            <InfoIcon fontSize="small" /> <strong>Observaciones:</strong>{" "}
            {documento.observaciones}
          </Typography>
        </>
      )}
    </Paper>
  );
};

DocumentoTooltip.propTypes = {
  idDocumento: PropTypes.number.isRequired,
};

export default DocumentoTooltip;
