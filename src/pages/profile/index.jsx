import { useState } from "react";
import PropTypes from "prop-types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  TextField,
  Button,
  Grid,
  useTheme,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  useChangePasswordMutation,
  useGetOwnProfileQuery,
  useUpdateMyProfileMutation,
} from "../../store/services/usuariosApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import PasswordModal from "../../components/profile/PasswordModal";
import BackButton from "../../components/common/BackButton";
import { getInitialRoute } from "../../utils/navigationUtils";

const PerfilHeader = ({ nombre, apellido, email }) => {
  const theme = useTheme();

  const initials = `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        borderColor:
          theme.palette.mode === "dark"
            ? theme.palette.primary.dark + "33"
            : "#E2E8F0",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#F9FAFB",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 24px rgba(30,34,54,0.24)"
            : "0 4px 18px rgba(0,0,0,0.09)",
        p: { xs: 2, sm: 3 },
        mb: 4,
        display: "flex",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 4 },
      }}
    >
      <Avatar
        sx={{
          width: { xs: 72, sm: 96 },
          height: { xs: 72, sm: 96 },
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontSize: { xs: 34, sm: 42 },
          fontWeight: 600,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 1px 6px #1a2236"
              : "0 1px 8px #e0e7ef",
        }}
      >
        {initials}
      </Avatar>
      <Box
        sx={{
          textAlign: { xs: "center", sm: "left" },
          flex: 1,
          maxWidth: { sm: "calc(100% - 128px)" },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          sx={{
            letterSpacing: 0.2,
            mb: 0.3,
            lineHeight: 1.17,
            wordBreak: "break-word",
          }}
        >
          {nombre} {apellido}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontWeight: 400,
            letterSpacing: 0.05,
            fontSize: { xs: 16, sm: 18 },
            wordBreak: "break-word",
            mt: 0.4,
          }}
        >
          {email}
        </Typography>
      </Box>
    </Card>
  );
};
PerfilHeader.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

function formatLabel(label) {
  return label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ");
}

const PerfilInfo = ({ data, editMode, handleInputChange }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 },
        mb: 2,
        borderRadius: 3,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#FAFAFA",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Información General
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            {editMode ? (
              <TextField
                fullWidth
                label={formatLabel(key)}
                name={key}
                defaultValue={value}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[900]
                      : "#fff",
                  borderRadius: 2,
                  input: { color: theme.palette.text.primary },
                }}
              />
            ) : (
              <Box
                sx={{
                  p: 2,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[900]
                      : "#F4F4F8",
                  borderRadius: 2,
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[800]
                      : theme.palette.grey[200]
                  }`,
                  minHeight: 64,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {formatLabel(key)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  {value || (
                    <span style={{ color: "#bbb" }}>Sin información</span>
                  )}
                </Typography>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

PerfilInfo.propTypes = {
  data: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const PerfilActividad = ({ fecha_registro, ultimo_login }) => {
  const theme = useTheme();
  const formatearFecha = (date) =>
    date ? new Date(date).toLocaleString() : "Sin información";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 2,
        borderRadius: 3,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#FAFAFA",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Actividad
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#F4F4F8",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200]
              }`,
              minHeight: 70,
            }}
          >
            <AccessTimeIcon
              sx={{
                color: theme.palette.info.main,
                fontSize: 28,
              }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
              >
                Fecha de registro
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
              >
                {formatearFecha(fecha_registro)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#F4F4F8",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200]
              }`,
              minHeight: 70,
            }}
          >
            <LoginIcon
              sx={{
                color: theme.palette.success.main,
                fontSize: 28,
              }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
              >
                Último login
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
              >
                {formatearFecha(ultimo_login)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
PerfilActividad.propTypes = {
  fecha_registro: PropTypes.string.isRequired,
  ultimo_login: PropTypes.string.isRequired,
};

const PerfilAcciones = ({
  editMode,
  setEditMode,
  setPasswordModalOpen,
  handleSave,
}) => (
  <Box
    display="flex"
    flexDirection={{ xs: "column", sm: "row" }}
    justifyContent="flex-end"
    mt={5}
    gap={2}
  >
    {editMode ? (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
        >
          Guardar
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setEditMode(false)}
          sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
        >
          Cancelar
        </Button>
      </>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={() => setEditMode(true)}
        sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
      >
        Editar Perfil
      </Button>
    )}
    <Button
      variant="outlined"
      onClick={() => setPasswordModalOpen(true)}
      sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
    >
      Cambiar Contraseña
    </Button>
  </Box>
);

PerfilAcciones.propTypes = {
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setPasswordModalOpen: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const PerfilUsuario = () => {
  const { data: perfil, isLoading, isError, refetch } = useGetOwnProfileQuery();
  const { permisos } = useSelector((state) => state.auth);
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading) return <LoaderComponent />;

  if (isError || !perfil?.data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h5" color="error">
          Error al cargar el perfil
        </Typography>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMyProfile(formData).unwrap();
      dispatch(
        showNotification({
          message: "Perfil actualizado correctamente",
          severity: "success",
        })
      );
      setEditMode(false);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar el perfil: ${error}`,
          severity: "error",
        })
      );
    }
  };

  const {
    rut,
    nombre,
    apellido,
    email,
    fecha_registro,
    ultimo_login,
    rol,
    Empresa,
    Sucursal,
  } = perfil.data;

  const inicial = getInitialRoute(rol?.nombre, permisos);

  return (
    <Box p={3}>
      <Card
        elevation={3}
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <BackButton to={`${inicial}`} label="Volver" />
        <CardContent>
          <PerfilHeader nombre={nombre} apellido={apellido} email={email} />
          <Divider sx={{ my: 4 }} />
          <PerfilInfo
            data={{
              rut,
              nombre,
              apellido,
              email,
              rol: rol.nombre,
              Empresa: Empresa.nombre,
              Sucursal: Sucursal.nombre,
            }}
            editMode={editMode}
            handleInputChange={handleInputChange}
          />
          <Divider sx={{ my: 4 }} />
          <PerfilActividad
            fecha_registro={fecha_registro}
            ultimo_login={ultimo_login}
          />
          <PerfilAcciones
            editMode={editMode}
            setEditMode={setEditMode}
            setPasswordModalOpen={setPasswordModalOpen}
            handleSave={handleSave}
          />
        </CardContent>
      </Card>

      {/* Modal para cambiar contraseña */}
      <PasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={async (passwordData) => {
          try {
            await changePassword(passwordData).unwrap();
            dispatch(
              showNotification({
                message: "Contraseña actualizada correctamente",
                severity: "success",
              })
            );
            setPasswordModalOpen(false);
          } catch (error) {
            dispatch(
              showNotification({
                message: `Error al actualizar la contraseña: ${error}`,
                severity: "error",
              })
            );
          }
        }}
      />
    </Box>
  );
};

export default PerfilUsuario;
