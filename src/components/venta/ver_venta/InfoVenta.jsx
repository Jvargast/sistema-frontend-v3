import {
  Typography,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Person,
  Event,
  Store,
  PointOfSale,
  MonetizationOn,
} from "@mui/icons-material";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const InfoVenta = ({ venta }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const infoItems = [
    {
      icon: <Person sx={{ color: "#007AFF" }} />,
      label: "Vendedor",
      value: `${venta.vendedor.nombre} ${venta.vendedor.apellido}`,
    },
    {
      icon: <Event sx={{ color: "#ff9800" }} />,
      label: "Fecha",
      value: dayjs(venta.fecha).format("DD/MM/YYYY HH:mm"),
    },
    {
      icon: <Store sx={{ color: "#4caf50" }} />,
      label: "Sucursal",
      value: venta.sucursal.nombre,
    },
    {
      icon: <PointOfSale sx={{ color: "#e91e63" }} />,
      label: "Caja",
      value: `#${venta.caja.id_caja} (${venta.caja.estado})`,
    },
    {
      icon: <MonetizationOn sx={{ color: "#388e3c" }} />,
      label: "Total",
      value: `$${parseFloat(venta.total).toLocaleString()}`,
      highlight: true,
    },
  ];

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          textAlign: isMobile ? "left" : "inherit",
        }}
      >
        Información de la Venta
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" flexDirection="column" gap={isMobile ? 1.5 : 2}>
        {infoItems.map(({ icon, label, value, highlight }, idx) => (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              flexDirection: "row",
              flexWrap: "nowrap",
              wordBreak: "break-word",
            }}
          >
            <Box display="flex" alignItems="center">
              {icon}
            </Box>
            <Typography
              variant="body2"
              fontWeight={highlight ? "bold" : "normal"}
              color={highlight ? "primary" : "textPrimary"}
              sx={{
                fontSize: isMobile ? "0.95rem" : "1rem",
                lineHeight: 1.4,
              }}
            >
              <strong>{label}:</strong> {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

InfoVenta.propTypes = {
  venta: PropTypes.shape({
    vendedor: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
    }).isRequired,
    fecha: PropTypes.string.isRequired,
    sucursal: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    caja: PropTypes.shape({
      id_caja: PropTypes.number.isRequired,
      estado: PropTypes.string.isRequired,
    }).isRequired,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default InfoVenta;
