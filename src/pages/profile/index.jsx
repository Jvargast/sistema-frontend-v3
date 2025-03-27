import { useState } from "react";
import PropTypes from "prop-types";
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
  useMediaQuery,
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

const PerfilHeader = ({ nombre, apellido, email }) => (
  <Box
    display="flex"
    alignItems="center"
    flexDirection={{ xs: "column", sm: "row" }}
    mb={4}
    textAlign={{ xs: "center", sm: "left" }}
  >
    <Avatar
      sx={{
        width: { xs: 80, sm: 100 },
        height: { xs: 80, sm: 100 },
        bgcolor: "primary.main",
        fontSize: { xs: 30, sm: 40 },
      }}
    >
      {nombre[0]}
    </Avatar>
    <Box
      ml={{ sm: 3 }}
      mt={{ xs: 2, sm: 0 }}
      sx={{
        wordBreak: "break-word",
        overflowWrap: "break-word",
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {nombre} {apellido}
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}
      >
        {email}
      </Typography>
    </Box>
  </Box>
);
PerfilHeader.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};



const PerfilInfo = ({ data, editMode, handleInputChange }) => (
  <>
    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
      Información General
    </Typography>
    <Grid container spacing={2}>
      {Object.entries(data).map(([key, value]) => (
        <Grid item xs={12} sm={6} key={key}>
          {editMode ? (
            <TextField
              fullWidth
              label={key}
              name={key}
              defaultValue={value}
              onChange={handleInputChange}
            />
          ) : (
            <Typography variant="body1">
              <strong>{key}:</strong> {value}
            </Typography>
          )}
        </Grid>
      ))}
    </Grid>
  </>
);

PerfilInfo.propTypes = {
  data: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const PerfilActividad = ({ fecha_registro, ultimo_login }) => (
  <>
    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
      Actividad
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          <strong>Fecha de registro:</strong>{" "}
          {new Date(fecha_registro).toLocaleString()}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          <strong>Último login:</strong>{" "}
          {new Date(ultimo_login).toLocaleString()}
        </Typography>
      </Grid>
    </Grid>
  </>
);
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box p={3} bgcolor="grey.100">
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
