import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Box,
  Divider,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PropTypes from "prop-types";

const ListaDestinos = ({ destinos, entregas, onOpenEntrega, onVerDetallePedido }) => {
  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          📍 Destinos de Entrega
        </Typography>

        <List disablePadding>
          {destinos.map((destino, index) => (
            <Box key={destino.id_pedido}>
              <ListItem sx={{ px: 0, py: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    width: "100%",
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: entregas[destino.id_pedido]?.entregado
                      ? "#e8f5e9"
                      : "#ffffff",
                    transition: "all 0.3s",
                    boxShadow: entregas[destino.id_pedido]?.entregado
                      ? "0 0 6px rgba(0,128,0,0.2)"
                      : "none",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pedido: {destino.id_pedido}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        {destino?.nombre_cliente}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dirección: {destino.direccion}
                      </Typography>
                      {destino.notas && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Notas: {destino.notas}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ alignSelf: "flex-end" }}>
                      <Button
                        size="small"
                        variant="contained"
                        color={
                          entregas[destino.id_pedido]?.entregado
                            ? "success"
                            : "info"
                        }
                        startIcon={
                          entregas[destino.id_pedido]?.entregado ? (
                            <CheckCircleOutlineIcon />
                          ) : (
                            <LocalShippingIcon />
                          )
                        }
                        onClick={() => {
                          if (!entregas[destino.id_pedido]?.entregado) {
                            onOpenEntrega(destino);
                          }
                        }}
                        disabled={entregas[destino.id_pedido]?.entregado}
                        sx={{ textTransform: "none", fontWeight: 500, mr: 1}}
                      >
                        {entregas[destino.id_pedido]?.entregado
                          ? "Entregado"
                          : "Registrar Entrega"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ textTransform: "none", fontWeight: 500 }}
                        onClick={() => onVerDetallePedido(destino)}
                      >
                        Ver Detalle
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </ListItem>
              {index < destinos.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

ListaDestinos.propTypes = {
  destinos: PropTypes.arrayOf(
    PropTypes.shape({
      id_pedido: PropTypes.number.isRequired,
      nombre_cliente: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
      notas: PropTypes.string,
    })
  ).isRequired,
  entregas: PropTypes.objectOf(
    PropTypes.shape({
      entregado: PropTypes.bool,
      entrega: PropTypes.object,
    })
  ).isRequired,
  onOpenEntrega: PropTypes.func.isRequired,
  onVerDetallePedido: PropTypes.func.isRequired,
};

export default ListaDestinos;
