import Tabs from "../../components/common/CompatTabs";
import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Tab,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useGetAllCajasQuery } from "../../store/services/cajaApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import AsignarUsuarioModal from "../../components/caja/AsignarUsuarioModal";
import DetalleCajaModal from "../../components/caja/DetalleCajaModal";
import CrearCajaModal from "../../components/caja/CrearCajaModal";
import BackButton from "../../components/common/BackButton";
import MovimientosCajaModal from "../../components/caja/MovimientosCajaModal";
import {
  Add,
  InfoOutlined,
  PersonAddAltOutlined,
  PointOfSale,
  StorefrontOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import MovimientosCajaList from "../../components/caja/MovimientosCajaList";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import TextField from "../../components/common/CompatTextField";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";
import { getActionIconButtonSx } from "../../components/common/tableStyles";

const cardsGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: 1.5,
  alignItems: "stretch",
};

const getEstadoMeta = (estado, theme) => {
  const key = String(estado || "").toLowerCase();
  const map = {
    abierta: {
      label: "Abierta",
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, 0.1),
    },
    pendiente: {
      label: "Pendiente",
      color: theme.palette.warning.dark,
      bg: alpha(theme.palette.warning.main, 0.14),
    },
    cerrada: {
      label: "Cerrada",
      color: theme.palette.error.main,
      bg: alpha(theme.palette.error.main, 0.1),
    },
  };

  return (
    map[key] || {
      label: estado || "Sin estado",
      color: theme.palette.text.secondary,
      bg: alpha(theme.palette.text.secondary, 0.1),
    }
  );
};

const formatAssignedUser = (caja) => {
  const usuario = caja?.usuarioAsignado;
  if (!usuario) return "No asignado";

  const rol = usuario?.rol?.nombre || usuario?.rol;
  return `${usuario.nombre || "Usuario"}${rol ? ` - ${rol}` : ""}`;
};

const actionButtonSx = (theme, variant = "primary") => ({
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  boxShadow: "none",
  ...(variant === "primary"
    ? {
        bgcolor: "#0F172A",
        color: theme.palette.common.white,
        "&:hover": {
          bgcolor: theme.palette.common.black,
          boxShadow: "none",
        },
      }
    : {
        color: "#0F172A",
        borderColor: alpha("#0F172A", 0.3),
        "&:hover": {
          borderColor: "#0F172A",
          bgcolor: alpha("#0F172A", 0.04),
        },
      }),
});

const ListarCajas = () => {
  const theme = useTheme();
  const { data: cajasData, isLoading, error, refetch } = useGetAllCajasQuery();
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [detalleCajaId, setDetalleCajaId] = useState(null);
  const [movimientosCajaId, setMovimientosCajaId] = useState(null);
  const [search, setSearch] = useState("");
  const [openCrearCajaModal, setOpenCrearCajaModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useRegisterRefresh(
    "cajas",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  const filteredCajas = (cajasData?.rows || []).filter((caja) => {
    const term = search.toLowerCase();
    return (
      caja?.sucursal?.nombre?.toLowerCase().includes(term) ||
      String(caja?.id_caja || "").includes(search) ||
      String(caja?.estado || "").toLowerCase().includes(term)
    );
  });

  if (isLoading) return <LoaderComponent />;
  if (error) return <Typography>Error al cargar las cajas.</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      <BackButton to="/admin" label="Volver al menú" />
      <Typography variant="h4" mb={3} fontWeight={800} textAlign="center">
        Gestión de Cajas
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        centered>

        <Tab label="Listado de Cajas" />
        <Tab label="Movimientos de Cajas" />
      </Tabs>
      {tabIndex === 0 ?
      <>
          <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
            gap: 1.5,
            alignItems: "center",
            mb: 3
          }}>

            <TextField
            label="Buscar caja"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            placeholder="ID, sucursal o estado"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper"
              }
            }} />

            <Button
            variant="contained"
            startIcon={<Add />}
            sx={actionButtonSx(theme, "primary")}
            onClick={() => setOpenCrearCajaModal(true)}>

              Crear caja
            </Button>
          </Box>

          {filteredCajas.length > 0 ?
        <Box sx={cardsGridSx}>
            {filteredCajas.map((caja) => {
              const estado = getEstadoMeta(caja.estado, theme);
              return (
                <Card
                key={caja.id_caja}
                elevation={0}
                sx={{
                  minHeight: 236,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  bgcolor: "background.paper",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 8px 24px rgba(15, 23, 42, 0.07)"
                      : "0 8px 24px rgba(0, 0, 0, 0.28)",
                  transition:
                    "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                  "&:hover": {
                    borderColor: alpha(estado.color, 0.45),
                    transform: "translateY(-1px)",
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 12px 28px rgba(15, 23, 42, 0.1)"
                        : "0 12px 28px rgba(0, 0, 0, 0.36)"
                  }
                }}>

                  <CardContent sx={{ p: 2, flex: 1 }}>
                    <Box display="flex" alignItems="flex-start" gap={1.25}>
                      <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: "#0F172A",
                        color: theme.palette.common.white,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "0 0 auto"
                      }}>

                        <PointOfSale fontSize="small" />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={800} noWrap>
                          Caja #{caja.id_caja}
                        </Typography>
                        <Chip
                        size="small"
                        label={estado.label}
                        sx={{
                          mt: 0.5,
                          height: 22,
                          borderRadius: 1,
                          color: estado.color,
                          bgcolor: estado.bg,
                          fontWeight: 800
                        }} />
                      </Box>

                      <IconButton
                      aria-label="Ver movimientos"
                      onClick={() => setMovimientosCajaId(caja.id_caja)}
                      sx={getActionIconButtonSx(theme, "info")}>

                        <InfoOutlined fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "grid", gap: 1.1, mt: 2 }}>
                      <Box display="flex" gap={1} sx={{ minWidth: 0 }}>
                        <StorefrontOutlined
                        fontSize="small"
                        sx={{ color: "text.secondary", mt: 0.15 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            Sucursal
                          </Typography>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {caja?.sucursal?.nombre || "Sin sucursal"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" gap={1} sx={{ minWidth: 0 }}>
                        <PersonAddAltOutlined
                        fontSize="small"
                        sx={{ color: "text.secondary", mt: 0.15 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            Usuario asignado
                          </Typography>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {formatAssignedUser(caja)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Apertura: {caja.usuario_apertura || "No asignado"}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 2,
                  pt: 0
                }}>

                    <Button
                  variant="contained"
                  startIcon={<PersonAddAltOutlined />}
                  sx={{ ...actionButtonSx(theme, "primary"), flex: 1 }}
                  onClick={() => setSelectedCaja(caja)}>

                      Asignar
                    </Button>
                    <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlined />}
                  sx={{ ...actionButtonSx(theme, "secondary"), flex: 1 }}
                  onClick={() => setDetalleCajaId(caja.id_caja)}>

                      Detalle
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box> :

        <Box
          sx={{
            py: 8,
            textAlign: "center",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper"
          }}>

              No hay cajas para mostrar.
            </Box>
        }
        </> :

      <>
          <MovimientosCajaList />
        </>
      }

      {/* Modal para Crear una Caja */}
      {openCrearCajaModal &&
      <CrearCajaModal onClose={() => setOpenCrearCajaModal(false)} />
      }

      {/* Modal para Asignar Usuario */}
      {selectedCaja &&
      <AsignarUsuarioModal
        caja={selectedCaja}
        onClose={() => setSelectedCaja(null)} />

      }

      {/* Modal para Ver Detalle */}
      {detalleCajaId &&
      <DetalleCajaModal
        idCaja={detalleCajaId}
        onClose={() => setDetalleCajaId(null)} />

      }

      {/* Modal para Ver Movimientos */}
      {movimientosCajaId &&
      <MovimientosCajaModal
        idCaja={movimientosCajaId}
        onClose={() => setMovimientosCajaId(null)} />

      }
    </Box>);

};

export default ListarCajas;
