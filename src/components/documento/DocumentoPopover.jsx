import {
  Popover,
  Paper,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import InfoIcon from "@mui/icons-material/Info";
import { useGetDocumentoByIdQuery } from "../../store/services/documentoApi";

const DocumentoPopover = ({ anchorEl, onClose, idDocumento }) => {
  const open = Boolean(anchorEl);
  const {
    data: documento,
    isLoading,
    isError,
  } = useGetDocumentoByIdQuery(idDocumento, {
    skip: !open, 
  });

  const colorChip =
    documento?.estadoPago?.nombre === "Pagado"
      ? "success"
      : documento?.estadoPago?.nombre === "Pendiente"
      ? "warning"
      : "default";

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, maxWidth: 350 } }}
    >
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <CircularProgress size={20} />
        </Box>
      ) : isError || !documento ? (
        <Typography color="error">Error al cargar documento.</Typography>
      ) : (
        <Paper elevation={0}>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={1}
            color="primary"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <ReceiptLongIcon fontSize="small" />
            {documento.tipo_documento.toUpperCase()} #{documento.numero}
          </Typography>

          <Divider sx={{ mb: 1 }} />

          <Typography variant="body2" gutterBottom>
            <strong>Fecha:</strong>{" "}
            {new Date(documento.fecha_emision).toLocaleString()}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Cliente:</strong> {documento.cliente?.nombre || "N/A"}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Emitido por:</strong> {documento.creador?.nombre} (
            {documento.creador?.rut})
          </Typography>

          <Typography variant="body2" component="div" gutterBottom>
            <strong>Estado:</strong>{" "}
            <Chip
              label={documento.estadoPago?.nombre}
              color={colorChip}
              size="small"
              sx={{ fontWeight: "bold", ml: 1 }}
            />
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="body2" gutterBottom>
            <PaidIcon fontSize="small" sx={{ mr: 1 }} />
            Subtotal: ${documento.subtotal}
          </Typography>
          <Typography variant="body2" mb={1}>
            Total: ${documento.total}
          </Typography>

          {documento.observaciones && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <InfoIcon fontSize="small" />
                <strong>Observaciones:</strong> {documento.observaciones}
              </Typography>
            </>
          )}
        </Paper>
      )}
    </Popover>
  );
};

DocumentoPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  idDocumento: PropTypes.number.isRequired,
};

export default DocumentoPopover;
