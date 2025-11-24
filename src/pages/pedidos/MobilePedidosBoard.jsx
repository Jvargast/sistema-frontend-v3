import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Stack,
  Divider,
  Fade,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import SectionHeader from "../../components/common/SectionHeader";
import { obtenerFechaChile, obtenerHoraChile } from "../../utils/formatearHora";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobilePedidosBoard = ({
  columnsState,
  choferes,
  asignarPedido,
  desasignarPedido,
  allPedidosLoading,
  choferesLoading,
  mode,
  sucursales = [],
  sucursalFiltro = "",
  onChangeSucursal = () => {},
  onSacarDeTablero, // 👈 NUEVO
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [choferSeleccionado, setChoferSeleccionado] = useState("");
  const dispatch = useDispatch();

  const handleOpen = (pedido) => {
    setSelectedPedido(pedido);
    setOpen(true);
    setChoferSeleccionado("");
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPedido(null);
    setChoferSeleccionado("");
  };

  const handleAsignar = async () => {
    if (!selectedPedido || !choferSeleccionado) return;
    try {
      await asignarPedido({
        id_pedido: selectedPedido.id_pedido,
        id_chofer: choferSeleccionado,
      });
      dispatch(
        showNotification({
          message: `Pedido #${selectedPedido.id_pedido} asignado correctamente.`,
          severity: "success",
          duration: 3000,
        })
      );
      handleClose();
    } catch {
      dispatch(
        showNotification({
          message: `Pedido #${selectedPedido.id_pedido} asignado correctamente.`,
          severity: "success",
          duration: 3000,
        })
      );
      handleClose();
    }
  };

  const handleDesasignar = async (pedido) => {
    try {
      await desasignarPedido(pedido.id_pedido);
      dispatch(
        showNotification({
          message: `Pedido #${pedido.id_pedido} desasignado.`,
          severity: "success",
          duration: 3000,
        })
      );
    } catch {
      dispatch(
        showNotification({
          message: `Pedido #${pedido.id_pedido} desasignado.`,
          severity: "success",
          duration: 3000,
        })
      );
    }
  };

  if (allPedidosLoading || choferesLoading)
    return (
      <Typography align="center" mt={6}>
        Cargando...
      </Typography>
    );

  return (
    <Box p={1} sx={{ background: (theme) => theme.palette.background.default }}>
      {mode === "global" && (
        <Box sx={{ mb: 2 }}>
          <Select
            fullWidth
            value={sucursalFiltro}
            displayEmpty
            onChange={(e) => onChangeSucursal(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Selecciona una sucursal…</MenuItem>
            {sucursales.map((s) => (
              <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                {s.nombre}
              </MenuItem>
            ))}
          </Select>
          {!sucursalFiltro && (
            <Typography color="text.secondary" mt={1} fontSize={13}>
              Selecciona una sucursal para ver y asignar pedidos.
            </Typography>
          )}
        </Box>
      )}

      {mode === "global" && !sucursalFiltro ? null : (
        <>
          <SectionHeader>Pedidos sin asignar</SectionHeader>

          <Fade in>
            <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 1 }}>
              <Stack spacing={2}>
                {columnsState.sinAsignar.length === 0 && (
                  <Typography
                    align="center"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    No hay pedidos sin asignar.
                  </Typography>
                )}
                {columnsState.sinAsignar.map((pedido) => (
                  <Card
                    key={pedido.id_pedido}
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      bgcolor: "background.paper",
                      mb: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: "info.main", mr: 1 }}>
                          <AssignmentIndIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography fontWeight={600}>
                            #{pedido.id_pedido} —{" "}
                            {pedido.Cliente?.nombre || "Cliente"}
                          </Typography>

                          <Typography
                            fontSize={14}
                            color="text.secondary"
                            noWrap
                          >
                            {pedido.EstadoPedido?.nombre_estado}
                          </Typography>

                          <Typography fontSize={12} color="text.secondary">
                            {obtenerFechaChile(pedido.fecha_pedido)} ·{" "}
                            {obtenerHoraChile(pedido.fecha_pedido)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions
                      sx={{
                        pt: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {onSacarDeTablero && (
                        <Button
                          variant="text"
                          color="error"
                          size="small"
                          sx={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                          onClick={() => onSacarDeTablero(pedido)}
                        >
                          Sacar del tablero
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: 2,
                          fontWeight: "bold",
                          letterSpacing: 0.5,
                          boxShadow: 2,
                          flex: 1,
                        }}
                        startIcon={<PersonIcon />}
                        onClick={() => handleOpen(pedido)}
                      >
                        Asignar Chofer
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Fade>

          <Divider sx={{ my: 3 }} />

          <SectionHeader>Pedidos por chofer</SectionHeader>

          <Stack
            spacing={3}
            sx={{
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "linear-gradient(90deg, #f7fafc 0%, #f1f5f9 100%)"
                  : "linear-gradient(90deg, #222 0%, #333 100%)",
              border: "1.5px solid",
              borderBottom: "none",
              borderTop: "none",
              borderColor: "divider",
              p: 2,
              borderRadius: "0 0 16px 16px",
            }}
          >
            {choferes.map((chofer) => (
              <Box key={chofer.rut} mb={2}>
                <Stack direction="row" alignItems="center" mb={2} gap={1}>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Typography fontWeight="bold" fontSize={16}>
                    {chofer.nombre}
                  </Typography>
                  <Typography color="text.secondary" fontSize={13}>
                    ({chofer.rut})
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    maxHeight: 260,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Stack spacing={1}>
                    {(columnsState[chofer.rut] || []).length === 0 ? (
                      <Typography
                        align="center"
                        color="text.secondary"
                        fontSize={13}
                        fontStyle="italic"
                      >
                        Sin pedidos asignados
                      </Typography>
                    ) : (
                      (columnsState[chofer.rut] || []).map((pedido) => (
                        <Card
                          key={pedido.id_pedido}
                          sx={{
                            borderRadius: 2,
                            boxShadow: 1,
                            bgcolor: "grey.50",
                            borderLeft: "5px solid",
                            borderColor: "success.light",
                            mb: 2,
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Stack direction="row" alignItems="center" gap={2}>
                              <Avatar sx={{ bgcolor: "primary.light" }}>
                                <AssignmentTurnedInIcon />
                              </Avatar>
                              <Box flex={1}>
                                <Typography fontWeight={600}>
                                  #{pedido.id_pedido} —{" "}
                                  {pedido.Cliente?.nombre || "Cliente"}
                                </Typography>

                                <Typography
                                  fontSize={13}
                                  color="text.secondary"
                                  noWrap
                                >
                                  {pedido.EstadoPedido?.nombre_estado}
                                </Typography>

                                <Typography
                                  fontSize={12}
                                  color="text.secondary"
                                >
                                  {obtenerFechaChile(pedido.fecha_pedido)} ·{" "}
                                  {obtenerHoraChile(pedido.fecha_pedido)}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                          <CardActions
                            sx={{
                              pt: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              sx={{
                                borderRadius: 2,
                                fontWeight: "bold",
                                letterSpacing: 0.5,
                              }}
                              onClick={() => handleDesasignar(pedido)}
                            >
                              Desasignar
                            </Button>

                            {onSacarDeTablero && (
                              <Button
                                variant="text"
                                color="inherit"
                                size="small"
                                sx={{
                                  fontWeight: 500,
                                }}
                                onClick={() => onSacarDeTablero(pedido)}
                              >
                                Sacar del tablero
                              </Button>
                            )}
                          </CardActions>
                        </Card>
                      ))
                    )}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Asignar a chofer
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={15} color="text.secondary" mb={1}>
            Selecciona un chofer para asignar el pedido:
          </Typography>
          <Select
            fullWidth
            value={choferSeleccionado}
            displayEmpty
            onChange={(e) => setChoferSeleccionado(e.target.value)}
            sx={{
              mb: 2,
              borderRadius: 2,
              background: "background.paper",
              fontWeight: 600,
              boxShadow: 1,
            }}
          >
            <MenuItem value="" disabled>
              Selecciona un chofer...
            </MenuItem>
            {choferes.map((chofer) => (
              <MenuItem value={chofer.rut} key={chofer.rut}>
                {chofer.nombre}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!choferSeleccionado}
            sx={{ borderRadius: 2, fontWeight: "bold", mt: 1 }}
            onClick={handleAsignar}
          >
            Confirmar Asignación
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

MobilePedidosBoard.propTypes = {
  columnsState: PropTypes.object.isRequired,
  choferes: PropTypes.array.isRequired,
  asignarPedido: PropTypes.func.isRequired,
  desasignarPedido: PropTypes.func.isRequired,
  allPedidosLoading: PropTypes.bool.isRequired,
  choferesLoading: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  sucursales: PropTypes.array,
  sucursalFiltro: PropTypes.string,
  onChangeSucursal: PropTypes.func,
  onSacarDeTablero: PropTypes.func,
};

export default MobilePedidosBoard;
