import {
  Box,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import PaymentIcon from "@mui/icons-material/Payment";
import { useGetPagosByVentaIdQuery } from "../../store/services/pagosApi";
import { formatCLP } from "../../utils/formatUtils";
import { useEffect, useRef } from "react";

const PagosAsociados = ({ idVenta, refetchTrigger }) => {
  const {
    data: pagos,
    isLoading,
    isError,
    refetch,
  } = useGetPagosByVentaIdQuery(idVenta);

  const prevTrigger = useRef();
  useEffect(() => {
    if (refetchTrigger !== prevTrigger.current) {
      prevTrigger.current = refetchTrigger;
      refetch();
    }
  }, [refetchTrigger, refetch]);

  if (isLoading)
    return (
      <Box mt={4} textAlign="center">
        <CircularProgress size={24} />
        <Typography variant="body2" mt={1} color="text.secondary">
          Cargando pagos asociados...
        </Typography>
      </Box>
    );

  if (isError || !pagos?.length)
    return (
      <Box mt={4}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          💸 Pagos Asociados
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography color="text.secondary">
          No hay pagos registrados para esta factura.
        </Typography>
      </Box>
    );

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        💸 Pagos Asociados
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {pagos.map((pago) => (
          <ListItem
            key={pago.id_pago}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #e0e0e0",
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <PaymentIcon color="primary" fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary={
                <Box display="flex" flexDirection="column">
                  <Typography fontWeight="bold" component="span">
                    {formatCLP(pago.monto)} - {pago.metodoPago?.nombre}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="span"
                    color="text.secondary"
                  >
                    {new Date(pago.fecha_pago).toLocaleDateString("es-CL")}
                  </Typography>
                </Box>
              }
              secondary={
                pago.referencia && (
                  <Tooltip title="Referencia o voucher del pago" arrow>
                    <Typography
                      variant="body2"
                      component="span"
                      fontStyle="italic"
                      color="text.secondary"
                    >
                      Ref: {pago.referencia}
                    </Typography>
                  </Tooltip>
                )
              }
              sx={{ mr: 2 }}
            />

            <Chip
              label={pago.estadoPago?.nombre}
              color={
                pago.estadoPago?.nombre === "Pagado"
                  ? "success"
                  : pago.estadoPago?.nombre === "Pendiente"
                  ? "warning"
                  : "default"
              }
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
PagosAsociados.propTypes = {
  idVenta: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refetchTrigger: PropTypes.any,
};

export default PagosAsociados;
