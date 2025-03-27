import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { useGetAllCajasQuery } from "../../store/services/cajaApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import AsignarUsuarioModal from "../../components/caja/AsignarUsuarioModal";
import DetalleCajaModal from "../../components/caja/DetalleCajaModal";
import CrearCajaModal from "../../components/caja/CrearCajaModal";
import BackButton from "../../components/common/BackButton";
import MovimientosCajaModal from "../../components/caja/MovimientosCajaModal";
import { InfoOutlined } from "@mui/icons-material";
import MovimientosCajaList from "../../components/caja/MovimientosCajaList";

const ListarCajas = () => {
  const { data: cajasData, isLoading, error } = useGetAllCajasQuery();
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [detalleCajaId, setDetalleCajaId] = useState(null);
  const [movimientosCajaId, setMovimientosCajaId] = useState(null);
  const [search, setSearch] = useState("");
  const [openCrearCajaModal, setOpenCrearCajaModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const filteredCajas = cajasData?.rows.filter(
    (caja) =>
      caja.sucursal.nombre.toLowerCase().includes(search.toLowerCase()) ||
      caja.id_caja.toString().includes(search) ||
      caja.estado.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoaderComponent />;
  if (error) return <Typography>Error al cargar las cajas.</Typography>;

  return (
    <Box p={3}>
      <BackButton to="/admin" label="Volver al menú" />
      <Typography variant="h4" mb={3} fontWeight="bold" textAlign="center">
        Gestión de Cajas
      </Typography>

      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Listado de Cajas" />
        <Tab label="Movimientos de Cajas" />
      </Tabs>
      {tabIndex === 0 ? (
        <>
      {/* Filtros */}
      <Box display="flex" gap={2} mb={4}>
        <TextField
          label="Buscar Caja (ID, Sucursal, Estado)"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            marginLeft: 2,
            "&:hover": {
              backgroundColor: "#388E3C",
            },
          }}
          onClick={() => setOpenCrearCajaModal(true)}
        >
          Crear Caja
        </Button>
      </Box>

      {/* Listado de Cajas */}
      <Grid container spacing={3}>
        {filteredCajas?.map((caja) => (
          <Grid item xs={12} sm={6} md={4} key={caja.id_caja}>
            <Card
              sx={{
                borderLeft: `8px solid ${
                  caja.estado === "abierta"
                    ? "#4caf50" // Verde suave
                    : caja.estado === "pendiente"
                    ? "#ff9800" // Naranja suave
                    : "#f44336" // Rojo suave
                }`,
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                {/* Encabezado con avatar e icono */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#2196f3",
                        color: "#fff",
                        width: 48,
                        height: 48,
                        fontSize: "1.2rem",
                      }}
                    >
                      {caja.id_caja}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Caja #{caja.id_caja}
                    </Typography>
                  </Box>
                  {/* Botón de información para ver movimientos */}
                  <IconButton
                    color="primary"
                    onClick={() => setMovimientosCajaId(caja.id_caja)}
                  >
                    <InfoOutlined />
                  </IconButton>
                </Box>

                {/* Información de la caja */}
                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Sucursal:</strong> {caja.sucursal.nombre}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Estado:</strong> {caja.estado}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Usuario Apertura:</strong>{" "}
                  {caja.usuario_apertura || "No asignado"}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Usuario Asignado:</strong>{" "}
                  {caja.usuario_asignado || "No asignado"}
                </Typography>
              </CardContent>

              <CardActions
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#03a9f4",
                    color: "#fff",
                    flex: 1,
                    "&:hover": {
                      backgroundColor: "#0288d1",
                    },
                  }}
                  onClick={() => setSelectedCaja(caja)}
                >
                  Asignar Usuario
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#ff5722",
                    borderColor: "#ff5722",
                    flex: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255, 87, 34, 0.1)",
                      borderColor: "#e64a19",
                    },
                  }}
                  onClick={() => setDetalleCajaId(caja.id_caja)}
                >
                  Ver Detalle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      </>
    ) : (
        <>
          <MovimientosCajaList />
        </>
      )}

      {/* Modal para Crear una Caja */}
      {openCrearCajaModal && (
        <CrearCajaModal onClose={() => setOpenCrearCajaModal(false)} />
      )}

      {/* Modal para Asignar Usuario */}
      {selectedCaja && (
        <AsignarUsuarioModal
          caja={selectedCaja}
          onClose={() => setSelectedCaja(null)}
        />
      )}

      {/* Modal para Ver Detalle */}
      {detalleCajaId && (
        <DetalleCajaModal
          idCaja={detalleCajaId}
          onClose={() => setDetalleCajaId(null)}
        />
      )}

      {/* Modal para Ver Movimientos */}
      {movimientosCajaId && (
        <MovimientosCajaModal
          idCaja={movimientosCajaId}
          onClose={() => setMovimientosCajaId(null)}
        />
      )}
    </Box>
  );
};

export default ListarCajas;
