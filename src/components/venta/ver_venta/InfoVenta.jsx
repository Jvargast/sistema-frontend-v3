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
  console.log(venta);
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

      {venta.cliente ? (
        <Box
          mb={3}
          p={2}
          sx={{
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            alignItems: isMobile ? "flex-start" : "center",
          }}
        >
          <Person sx={{ color: "#007AFF", fontSize: 30 }} />
          <Box>
            <Typography fontWeight="bold" variant="body1" color="primary">
              Cliente
            </Typography>
            <Typography>
              {venta.cliente.razon_social ||
                venta.cliente.nombre ||
                "Sin nombre"}
            </Typography>
            {venta.cliente.tipo_cliente && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: "medium" }}
              >
                {venta.cliente.tipo_cliente}
              </Typography>
            )}

            {venta.cliente.rut && (
              <Typography variant="body2" color="text.secondary">
                RUT: {venta.cliente.rut}
              </Typography>
            )}
            {venta.cliente.direccion && (
              <Typography variant="body2" color="text.secondary">
                Dirección: {venta.cliente.direccion}
              </Typography>
            )}
            {venta.cliente.email && (
              <Typography variant="body2" color="text.secondary">
                Email: {venta.cliente.email}
              </Typography>
            )}
          </Box>
        </Box>
      ) : null}

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
    cliente: PropTypes.shape({
      razon_social: PropTypes.string,
      tipo_cliente: PropTypes.string,
      nombre: PropTypes.string,
      rut: PropTypes.string,
      direccion: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
};

export default InfoVenta;
