import {
  Typography,
  List,
  ListItem,
  Divider,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { AttachMoney, ReceiptLong, CalendarToday } from "@mui/icons-material";
import PropTypes from "prop-types";

const PagosVenta = ({ pagos }) => {
  const pagosList = pagos?.[0]?.rows || [];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      >
        💰 Pagos Realizados
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {pagosList.length > 0 ? (
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {pagosList.map((pago) => (
            <ListItem
              key={pago.id_pago}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? 1.5 : 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoney sx={{ color: "#388e3c" }} />
                <Typography
                  fontWeight="bold"
                  fontSize={isMobile ? "0.95rem" : "1.1rem"}
                >
                  Monto: ${parseFloat(pago.monto || 0).toLocaleString()}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <ReceiptLong sx={{ color: "#1976d2" }} />
                <Typography variant="body2" color="text.secondary">
                  Método: {pago.metodoPago?.nombre || "Desconocido"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday sx={{ color: "#ff9800" }} />
                <Typography variant="body2" color="text.secondary">
                  Fecha: {dayjs(pago.fecha_pago).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Box>

              <Chip
                label={`Ref: ${pago.referencia || "N/A"}`}
                variant="outlined"
                sx={{
                  mt: 1,
                  fontSize: "0.8rem",
                  maxWidth: "100%",
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography
          align="center"
          sx={{
            mt: 2,
            fontStyle: "italic",
            color: "gray",
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          💳 No hay pagos registrados para esta venta.
        </Typography>
      )}
    </Box>
  );
};

PagosVenta.propTypes = {
  pagos: PropTypes.arrayOf(
    PropTypes.shape({
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          id_pago: PropTypes.number.isRequired,
          metodoPago: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
          }).isRequired,
          monto: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          fecha_pago: PropTypes.string.isRequired,
          referencia: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default PagosVenta;
