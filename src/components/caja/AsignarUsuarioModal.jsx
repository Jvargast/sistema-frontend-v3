import Modal from "../common/CompatModal";
import Select from "../common/CompatSelect";
import { useMemo, useState } from "react";
import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
} from "@mui/material";
import {
  Close,
  PersonAddAltOutlined,
  PointOfSale,
  StorefrontOutlined,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useAssignCajaMutation } from "../../store/services/cajaApi";
import { useGetAllUsersQuery } from "../../store/services/usuariosApi";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const getModalSx = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 32px)", sm: 560 },
  maxWidth: "100%",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 18px 48px rgba(15, 23, 42, 0.18)"
      : "0 18px 48px rgba(0, 0, 0, 0.45)",
  overflow: "hidden",
});

const primaryButtonSx = (theme) => ({
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  bgcolor: "#0F172A",
  color: theme.palette.common.white,
  boxShadow: "none",
  "&:hover": {
    bgcolor: theme.palette.common.black,
    boxShadow: "none",
  },
});

const secondaryButtonSx = {
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 700,
};

const getUserName = (user) =>
  `${user?.nombre || ""} ${user?.apellido || ""}`.trim() || "Usuario";

const getUserRole = (user) => user?.rol?.nombre || user?.rol || "Sin rol";

const AsignarUsuarioModal = ({ caja, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: usuarios, isLoading: cargandoUsuarios, isError } =
    useGetAllUsersQuery();
  const [rutUsuario, setRutUsuario] = useState(caja?.usuario_asignado || "");
  const [updateCaja, { isLoading }] = useAssignCajaMutation();

  const usuariosList = useMemo(() => {
    const raw = usuarios?.usuarios ?? usuarios;
    return Array.isArray(raw) ? raw : [];
  }, [usuarios]);

  const selectedUser = useMemo(
    () => usuariosList.find((user) => String(user.rut) === String(rutUsuario)),
    [rutUsuario, usuariosList]
  );

  const handleAsignarUsuario = async () => {
    if (!rutUsuario) {
      dispatch(
        showNotification({
          message: "Seleccione un usuario para asignar la caja",
          severity: "warning",
        })
      );
      return;
    }

    try {
      await updateCaja({
        id_caja: caja.id_caja,
        usuario_asignado: rutUsuario,
      }).unwrap();
      onClose();
      dispatch(
        showNotification({
          message: "Usuario asignado correctamente",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message:
            error?.data?.message ||
            error?.data?.error ||
            "Error al asignar usuario",
          severity: "error",
        })
      );
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={true}>
        <Box sx={getModalSx(theme)}>
          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor:
                theme.palette.mode === "light"
                  ? alpha(theme.palette.grey[100], 0.72)
                  : alpha(theme.palette.common.white, 0.04),
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1,
                bgcolor: "#0F172A",
                color: theme.palette.common.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonAddAltOutlined fontSize="small" />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                Asignar usuario
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Caja #{caja.id_caja}
              </Typography>
            </Box>

            <IconButton
              size="small"
              aria-label="Cerrar"
              onClick={onClose}
              sx={{
                borderRadius: "50%",
                color: "text.secondary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.text.primary, 0.08),
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1.25,
                  display: "flex",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <PointOfSale fontSize="small" sx={{ color: "text.secondary" }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    Caja
                  </Typography>
                  <Typography fontWeight={800}>#{caja.id_caja}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1.25,
                  display: "flex",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <StorefrontOutlined
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    Sucursal
                  </Typography>
                  <Typography fontWeight={800} noWrap>
                    {caja?.sucursal?.nombre || "Sin sucursal"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {cargandoUsuarios ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={148}
              >
                <CircularProgress size={28} />
              </Box>
            ) : isError || usuariosList.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  color: "text.secondary",
                }}
              >
                No hay usuarios disponibles.
              </Box>
            ) : (
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="usuario-label">Usuario</InputLabel>
                  <Select
                    value={rutUsuario}
                    onChange={(e) => setRutUsuario(e.target.value)}
                    labelId="usuario-label"
                    label="Usuario"
                    id="usuario-asignado-select"
                    renderValue={(value) => {
                      const user = usuariosList.find(
                        (item) => String(item.rut) === String(value)
                      );
                      return user ? getUserName(user) : "Seleccionar usuario";
                    }}
                    sx={{ borderRadius: 1 }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 1,
                          mt: 0.5,
                        },
                      },
                    }}
                  >
                    {usuariosList.map((user) => {
                      const assigned = caja.usuario_asignado === user.rut;
                      return (
                        <MenuItem key={user.rut} value={user.rut}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 1.25,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                bgcolor: alpha("#0F172A", 0.08),
                                color: "#0F172A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                flex: "0 0 auto",
                              }}
                            >
                              {getUserName(user).slice(0, 1).toUpperCase()}
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography variant="body2" fontWeight={800} noWrap>
                                {getUserName(user)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                              >
                                {getUserRole(user)} - {user.rut}
                              </Typography>
                            </Box>
                            {assigned && (
                              <Chip
                                size="small"
                                label="Actual"
                                sx={{
                                  height: 22,
                                  borderRadius: 1,
                                  fontWeight: 800,
                                }}
                              />
                            )}
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    minHeight: 74,
                    border: "1px solid",
                    borderColor: selectedUser ? "divider" : "transparent",
                    borderRadius: 1,
                    bgcolor: selectedUser
                      ? alpha(theme.palette.primary.main, 0.04)
                      : alpha(theme.palette.text.primary, 0.04),
                    p: 1.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Usuario seleccionado
                  </Typography>
                  <Typography fontWeight={800} noWrap>
                    {selectedUser ? getUserName(selectedUser) : "Sin selección"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {selectedUser
                      ? `${getUserRole(selectedUser)} - ${selectedUser.rut}`
                      : "Selecciona quien operará esta caja."}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Divider />

          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 1.5,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              bgcolor:
                theme.palette.mode === "light"
                  ? alpha(theme.palette.grey[50], 0.8)
                  : alpha(theme.palette.common.white, 0.03),
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
              sx={secondaryButtonSx}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddAltOutlined />}
              onClick={handleAsignarUsuario}
              disabled={isLoading || !rutUsuario || cargandoUsuarios}
              sx={primaryButtonSx(theme)}
            >
              {isLoading ? "Asignando..." : "Asignar"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

AsignarUsuarioModal.propTypes = {
  caja: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AsignarUsuarioModal;
