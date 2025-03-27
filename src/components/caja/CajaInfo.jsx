import { Box, Typography, Paper } from "@mui/material";
import PropTypes from "prop-types";
import StoreIcon from "@mui/icons-material/Store";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";

const CajaInfo = ({ caja }) => {
  if (!caja) return null;

  // Formatear fecha de apertura
  const formatFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2,
        mb: 3,
        backgroundColor: "#f5f5f5",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h3" fontWeight="bold" textAlign="center" mb={2}>
        🏦 Información de la Caja
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        {/* ID de la Caja */}
        <Box display="flex" alignItems="center" gap={1}>
          <ConfirmationNumberIcon sx={{ color: "#0288d1" }} />
          <Typography fontWeight="bold" variant="h5">
            ID Caja:
          </Typography>
          <Typography variant="h5">{caja.id_caja}</Typography>
        </Box>

        {/* Saldo Inicial */}
        <Box display="flex" alignItems="center" gap={1}>
          <AccountBalanceWalletIcon sx={{ color: "#4CAF50" }} />
          <Typography fontWeight="bold" variant="h5">
            Saldo Inicial:
          </Typography>
          <Typography variant="h5">
            ${Number(caja.saldo_inicial).toFixed(0)}
          </Typography>
        </Box>

        {/* Saldo Actual */}
        <Box display="flex" alignItems="center" gap={1}>
          <AccountBalanceWalletIcon sx={{ color: "#4CAF50" }} />
          <Typography fontWeight="bold" variant="h5">
            Saldo Actual:
          </Typography>
          <Typography variant="h5">
            $
            {caja.saldo_final !== null
              ? Number(caja.saldo_final).toFixed(0)
              : Number(caja.saldo_inicial).toFixed(0)}
          </Typography>
        </Box>

        {/* Sucursal */}
        <Box display="flex" alignItems="center" gap={1}>
          <StoreIcon sx={{ color: "#673AB7" }} />
          <Typography fontWeight="bold" variant="h5">
            Sucursal:
          </Typography>
          <Typography variant="h5">
            {caja.sucursal?.nombre || "No asignada"}
          </Typography>
        </Box>
      </Box>

      {/* Fecha de Apertura */}
      <Box display="flex" alignItems="center" gap={1} mt={1}>
        <EventIcon sx={{ color: "#FF9800" }} />
        <Typography variant="h5" fontWeight="bold">
          Fecha de Apertura:
        </Typography>
        <Typography variant="h5">{formatFecha(caja.fecha_apertura)}</Typography>
      </Box>
    </Paper>
  );
};

CajaInfo.propTypes = {
  caja: PropTypes.shape({
    id_caja: PropTypes.number.isRequired,
    saldo_inicial: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    saldo_final: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sucursal: PropTypes.shape({
      nombre: PropTypes.string,
    }),
    fecha_apertura: PropTypes.string,
  }).isRequired,
};

export default CajaInfo;
