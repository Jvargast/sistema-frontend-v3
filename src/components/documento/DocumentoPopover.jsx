import {
  Popover,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import InfoIcon from "@mui/icons-material/Info";
import { useGetDocumentoByIdQuery } from "../../store/services/documentoApi";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import { useGetCuentaPorCobrarByDocumentoIdQuery } from "../../store/services/cuentasPorCobrarApi";

const DocumentoPopover = ({ anchorEl, onClose, idDocumento }) => {
  const open = Boolean(anchorEl);
  const {
    data: documento,
    isLoading,
    isError,
  } = useGetDocumentoByIdQuery(idDocumento, {
    skip: !open,
  });
  const navigate = useNavigate();
  const {
    data: factura,
    isLoading: isLoadingFactura,
    isError: isErrorFactura,
  } = useGetCuentaPorCobrarByDocumentoIdQuery(idDocumento, {
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
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          p: 2,
          maxWidth: 360,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <CircularProgress size={20} />
        </Box>
      ) : isError || !documento ? (
        <Typography color="error">Error al cargar documento.</Typography>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" fontWeight="bold" color="primary">
              {documento.tipo_documento.toUpperCase()} #{documento.numero}
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Typography variant="body2" mb={0.5}>
            <strong>Fecha:</strong>{" "}
            {new Date(documento.fecha_emision).toLocaleDateString("es-CL")}
          </Typography>
          <Typography variant="body2" mb={0.5}>
            <strong>Cliente:</strong> {documento.cliente?.nombre || "N/A"}
          </Typography>
          <Typography variant="body2" mb={0.5}>
            <strong>Emitido por:</strong> {documento.creador?.nombre} (
            {documento.creador?.rut})
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="body2">
              <strong>Estado:</strong>
            </Typography>
            <Chip
              label={documento.estadoPago?.nombre}
              color={colorChip}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" alignItems="center" mb={0.5}>
            <PaidIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Subtotal:{" "}
              <strong>
                ${Number(documento.subtotal).toLocaleString("es-CL")}
              </strong>
            </Typography>
          </Box>
          <Typography variant="body2" mb={1}>
            Total:{" "}
            <strong>${Number(documento.total).toLocaleString("es-CL")}</strong>
          </Typography>

          {documento.observaciones && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" alignItems="flex-start" gap={1}>
                <InfoIcon fontSize="small" sx={{ mt: 0.5 }} />
                <Typography variant="body2">
                  <strong>Observaciones:</strong> {documento.observaciones}
                </Typography>
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="center">
            {isLoadingFactura ? (
              <CircularProgress size={18} />
            ) : isErrorFactura ? (
              <Typography
                variant="caption"
                color="error"
                textAlign="center"
                display="block"
              >
                ❌ No se pudo obtener la factura asociada.
              </Typography>
            ) : factura?.id_cxc ? (
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 2,
                  backgroundColor: "#1e88e5",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
                onClick={() => {
                  onClose();
                  navigate(`/facturas/ver/${factura.id_cxc}`);
                }}
              >
                Ir a Factura
              </Button>
            ) : null}
          </Box>
        </Box>
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
