import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import BackButton from "../../components/common/BackButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useGetPagoByIdQuery } from "../../store/services/pagosApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import DocumentoPopover from "../../components/documento/DocumentoPopover";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";

const CLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor));

const VerPago = () => {
  const { id } = useParams();
  const { data: pago, error, isLoading } = useGetPagoByIdQuery(id);
  const [anchorEl, setAnchorEl] = useState(null);

  if (isLoading) return <LoaderComponent />;

  if (error || !pago) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error" fontWeight="bold" fontSize={18}>
          ❌ Error al cargar el pago.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
      <BackButton to="/pagos" label="Volver a Pagos" />

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #4caf50, #81c784)",
          color: "#fff",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          💳 Detalle del Pago #{pago.id_pago}
        </Typography>
        <Typography textAlign="center" fontSize={16}>
          Fecha: {new Date(pago.fecha_pago).toLocaleString()}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Monto
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              display="flex"
              alignItems="center"
            >
              <MonetizationOnIcon sx={{ mr: 1 }} /> {CLP(pago.monto)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Método de Pago
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              display="flex"
              alignItems="center"
            >
              <AccountBalanceIcon sx={{ mr: 1 }} /> {pago.metodoPago?.nombre}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Estado del Pago
            </Typography>
            <Chip
              label={pago.estadoPago?.nombre}
              color={
                pago.estadoPago?.nombre === "Pagado"
                  ? "success"
                  : pago.estadoPago?.nombre === "Pendiente"
                  ? "warning"
                  : "default"
              }
              sx={{ fontWeight: "bold", fontSize: 15 }}
            />
            {pago.estadoPago?.nombre === "Pendiente" && (
              <Typography
                variant="caption"
                color="text.secondary"
                mt={1}
                sx={{ display: "block" }}
              >
                Este pago es parte de una factura que aún no ha sido saldada por
                completo.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Documento Asociado
            </Typography>
            {pago.documento ? (
              <Box display="flex" alignItems="center" gap={1}>
                <ReceiptIcon />
                <Box component="span" sx={{ fontSize: 14, fontWeight: "bold" }}>
                  {`${pago.documento.tipo_documento.toUpperCase()} N° ${
                    pago.documento.numero
                  }`}
                </Box>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <DocumentoPopover
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  idDocumento={pago.documento.id_documento}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay documento asociado.
              </Typography>
            )}
          </Grid>

          {pago.referencia && (
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Referencia
              </Typography>
              <Typography>{pago.referencia}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" textAlign="right">
          ID de Venta: {pago.id_venta}
        </Typography>
      </Paper>
    </Box>
  );
};

export default VerPago;
