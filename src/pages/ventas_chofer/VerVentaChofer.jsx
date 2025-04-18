import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { formatCLP } from "../../utils/formatUtils";
import { useGetVentaChoferByIdQuery } from "../../store/services/ventasChoferApi";
import BackButton from "../../components/common/BackButton";
import { useSelector } from "react-redux";

const VerVentaChofer = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetVentaChoferByIdQuery(id);
  const rol = useSelector((state) => state?.auth?.rol);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Error al cargar la venta.
      </Typography>
    );

  const venta = data?.data;

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <BackButton
        to={rol === "chofer" ? "/misventas" : "/ventas-chofer"}
        label="Volver"
      />
      <Typography variant="h4" fontWeight="bold" mb={2}>
        🧾 Venta Nº {venta?.id_venta_chofer}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: "#dcdcdc",
              backgroundColor: "#fafafa",
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Cliente
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {venta?.cliente?.nombre || "-"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} /> Camión
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {venta?.camion?.placa || "-"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                <PaidIcon fontSize="small" sx={{ mr: 1 }} /> Método de Pago
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {venta?.metodoPago?.nombre || "-"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                <ReceiptIcon fontSize="small" sx={{ mr: 1 }} /> Estado de Pago
              </Typography>
              <Chip
                label={venta?.estadoPago?.toUpperCase()}
                color={venta?.estadoPago === "pagado" ? "success" : "warning"}
                variant="filled"
                sx={{ fontWeight: "bold" }}
              />
              <Typography variant="h6" mt={3} color="primary.main">
                Total: {formatCLP(venta?.total_venta)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={5} mb={2}>
        <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} /> Productos Vendidos
      </Typography>

      {venta?.detallesChofer?.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            backgroundColor: "#fff",
          }}
        >
          {venta.detallesChofer.map((item, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={1.5}
              sx={{
                borderBottom:
                  idx !== venta.detallesChofer.length - 1
                    ? "1px solid #e0e0e0"
                    : "none",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={item.producto?.image_url || undefined}
                  alt={item.producto?.nombre_producto || "Producto"}
                />
                <Box>
                  <Typography fontWeight={600}>
                    {item.producto?.nombre_producto || "Producto"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    x {item.cantidad} unidades
                  </Typography>
                </Box>
              </Box>
              <Typography fontWeight="bold">
                {formatCLP(item.subtotal)}
              </Typography>
            </Box>
          ))}
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No hay productos registrados en esta venta.
        </Typography>
      )}
    </Box>
  );
};

export default VerVentaChofer;
