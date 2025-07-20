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
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PropTypes from "prop-types";
import { useMemo } from "react";
import DestinosMap from "./DestinosMap";
import { ordenarDestinosPorCercania } from "../../utils/ordenRutas";

const ListaDestinos = ({
  destinos,
  entregas,
  origen,
  origenInicial,
  onOpenEntrega,
  onVerDetallePedido,
}) => {
  /* const destinosPendientes = destinos.filter(
    (d) => d.lat && d.lng && !entregas[d.id_pedido]?.entregado
  ); */

  const destinosEntregados = destinos
    .filter((d) => entregas[d.id_pedido]?.entregado)
    .map((d) => ({
      ...d,
      hora: entregas[d.id_pedido]?.entrega?.fecha_hora || null,
    }))
    .sort((a, b) => new Date(a.hora) - new Date(b.hora));

  const destinosPendientes = destinos.filter(
    (d) => d.lat && d.lng && !entregas[d.id_pedido]?.entregado
  );

  const recorridoReal = [
    origenInicial,
    ...destinosEntregados.map((d) => ({
      lat: d.lat,
      lng: d.lng,
      nombre_cliente: d.nombre_cliente,
      direccion: d.direccion,
      hora: d.hora,
    })),
  ];

  /*   const rutaOptimizada = useMemo(() => {
    if (!origen) return [];
    return ordenarDestinosPorCercania(destinosPendientes, origen); */

  /*   }, [origen, JSON.stringify(destinosPendientes)]); */

  const origenPendiente = origen;
  const rutaOptimizada = useMemo(() => {
    if (!origenPendiente) return [];
    return [
      origenPendiente,
      ...ordenarDestinosPorCercania(destinosPendientes, origenPendiente),
    ];

    // eslint-disable-next-line
  }, [JSON.stringify(destinosPendientes), JSON.stringify(origenPendiente)]);

  const ordenPorId = {};

  rutaOptimizada.slice(1).forEach((d, i) => {
    if (d && d.id_pedido !== undefined) {
      ordenPorId[d.id_pedido] = i;
    }
  });

  return (
    <>
      <DestinosMap
        destinos={destinosPendientes}
        ruta={rutaOptimizada}
        recorridoReal={recorridoReal}
        origenInicial={origenInicial}
      />

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
                      backgroundColor: (theme) =>
                        entregas[destino.id_pedido]?.entregado
                          ? theme.palette.success.light
                          : theme.palette.background.paper,
                      color: (theme) =>
                        entregas[destino.id_pedido]?.entregado
                          ? theme.palette.getContrastText(
                              theme.palette.success.light
                            )
                          : "inherit",
                      transition: "all 0.3s",
                      boxShadow: (theme) =>
                        entregas[destino.id_pedido]?.entregado
                          ? theme.shadows[2]
                          : "none",
                      border: (theme) => `1.5px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "stretch", sm: "center" }}
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      <Box>
                        {destino.id_pedido && ordenPorId[destino.id_pedido] && (
                          <Chip
                            label={`#${ordenPorId[destino.id_pedido]}`}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              mr: 1,
                              mb: 0.5,
                              fontSize: "1rem",
                              color: "#334155",
                              background:
                                "linear-gradient(90deg, #a8ffce 0%, #f9f9d2 100%)",
                              border: "1.5px solid #a8dadc",
                              boxShadow: "0 2px 8px 0 #22223b11",
                              letterSpacing: 1,
                            }}
                          />
                        )}
                        <Typography variant="body2">
                          Pedido: {destino.id_pedido}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          {destino?.nombre_cliente}
                        </Typography>
                        <Typography variant="body2">
                          Dirección: {destino.direccion}
                        </Typography>
                        {destino.notas && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Notas: {destino.notas}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: { xs: "flex-start", sm: "flex-end" },
                          mt: { xs: 2, sm: 0 },
                        }}
                      >
                        {entregas[destino.id_pedido]?.entregado ? (
                          <>
                            <Chip
                              icon={<CheckCircleOutlineIcon />}
                              label="Entregado"
                              color="success"
                              sx={{
                                fontWeight: 500,
                                mr: 1,
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.875rem",
                                height: 32,
                              }}
                            />
                            <Button
                              size="medium"
                              variant="contained"
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                ml: 1,
                                color: "inherit",
                                borderColor: "success.main",
                                "&:hover": {
                                  borderColor: "success.dark",
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                },
                              }}
                              onClick={() => onVerDetallePedido(destino)}
                            >
                              Ver Detalle
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="info"
                              startIcon={<LocalShippingIcon />}
                              onClick={() => onOpenEntrega(destino)}
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                mr: 1,
                              }}
                            >
                              Registrar Entrega
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="inherit"
                              sx={{ textTransform: "none", fontWeight: 500 }}
                              onClick={() => onVerDetallePedido(destino)}
                            >
                              Ver Detalle
                            </Button>
                          </>
                        )}
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
    </>
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
  origen: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  origenInicial: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onOpenEntrega: PropTypes.func.isRequired,
  onVerDetallePedido: PropTypes.func.isRequired,
};

export default ListaDestinos;
