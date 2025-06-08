import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  useFindByRutQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} from "../../../store/services/usuariosApi";
import {
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
} from "../../../store/services/empresaApi";
import { useGetAllRolesQuery } from "../../../store/services/rolesApi";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import LoaderComponent from "../../../components/common/LoaderComponent";
import EditUserForm from "../../../components/usuarios/EditUser";
import PasswordModal from "../../../components/usuarios/PasswordModal";

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  //const [passwordData, setPasswordData] = useState({ newPassword: "" });

  const {
    data: userData,
    isFetching,
    error: fetchError,
  } = useFindByRutQuery(id);
  const { data: empresas } = useGetAllEmpresasQuery();
  const { data: sucursales } = useGetAllSucursalsQuery();
  const { data: rolesData } = useGetAllRolesQuery();

  const [updateUser] = useUpdateUserMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();

  // Handlers
  // Handlers
  const handleUpdateUser = useCallback(
    async (userId, data) => {
      try {
        await updateUser({ rut: userId, updates: data }).unwrap();
        dispatch(
          showNotification({
            message: "Usuario actualizado correctamente.",
            severity: "success",
          })
        );
        navigate("/usuarios", { state: { refetch: true } });
      } catch (err) {
        dispatch(
          showNotification({
            message: `Error al actualizar el usuario: ${
              err?.data?.error || "Desconocido"
            }`,
            severity: "error",
          })
        );
      }
    },
    [updateUser, dispatch, navigate]
  );

  const handlePasswordChange = useCallback(
    async (newPassword) => {
      try {
        console.log(
          "Contraseña recibida en handlePasswordChange:",
          newPassword
        );
        if (!newPassword || newPassword.trim().length < 8) {
          dispatch(
            showNotification({
              message: "La contraseña debe tener al menos 8 caracteres.",
              severity: "error",
            })
          );
          return;
        }
        await updateUserPassword({ rut: id, newPassword });
        dispatch(
          showNotification({
            message: "Contraseña actualizada correctamente.",
            severity: "success",
          })
        );
        setPasswordModalOpen(false);
      } catch (err) {
        console.log(err);
        dispatch(
          showNotification({
            message: `Error al cambiar la contraseña: ${
              err?.data?.error || "Desconocido"
            }`,
            severity: "error",
          })
        );
      }
    },
    [updateUserPassword, id, dispatch]
  );

  const rolesOptions =
    rolesData?.roles?.map((role) => ({
      value: role.id,
      label: role.nombre,
    })) || [];
  const empresasOptions =
    empresas?.map((empresa) => ({
      value: empresa.id_empresa,
      label: empresa.nombre,
    })) || [];
  const sucursalesOptions =
    sucursales?.map((sucursal) => ({
      value: sucursal.id_sucursal,
      label: sucursal.nombre,
    })) || [];

  const fieldConfig = [
    [
      { label: "RUT", name: "rut", type: "text", disabled: true },
      { label: "Nombre", name: "nombre", type: "text" },
      { label: "Apellido", name: "apellido", type: "text" },
      { label: "Email", name: "email", type: "email" },
    ],
    [
      {
        label: "Estado",
        name: "activo",
        type: "select",
        options: [
          { value: true, label: "Activo" },
          { value: false, label: "Inactivo" },
        ],
      },
      {
        label: "Rol",
        name: "rolId",
        type: "select",
        options: rolesOptions,
      },
    ],
    [
      {
        label: "Empresa",
        name: "id_empresa",
        type: "select",
        options: empresasOptions,
      },
      {
        label: "Sucursal",
        name: "id_sucursal",
        type: "select",
        options: sucursalesOptions,
      },
    ],
  ];

  if (isFetching) {
    return <LoaderComponent />;
  }

  if (fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: 1,
        }}
      >
        <Typography variant="h5" color="error">
          Error al cargar el usuario: {fetchError.message}
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        maxWidth: 900,
        mx: "auto",
        my: { xs: 2, md: 6 },
        bgcolor: "background.paper",
        borderRadius: 6,
        boxShadow: "0 8px 36px 0 rgba(35, 55, 99, 0.14)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: "primary.main",
            letterSpacing: 0.5,
          }}
        >
          Editar usuario
        </Typography>
        <Button
          onClick={() => setPasswordModalOpen(true)}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 3,
            px: 3.5,
            py: 1.2,
            fontWeight: 600,
            fontSize: "1.08rem",
            boxShadow: "0 2px 8px 0 rgba(80,80,120,0.07)",
            background: "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)",
            color: "#fff",
            textTransform: "none",
            transition: "all 0.15s",
            "&:hover": {
              background: "linear-gradient(90deg, #1e40af 0%, #1e293b 100%)",
              transform: "scale(1.03)",
            },
          }}
        >
          Cambiar contraseña
        </Button>
      </Box>

      <Divider sx={{ my: 0 }} />

      <EditUserForm
        userId={id}
        fetchUserData={() => userData}
        updateUser={handleUpdateUser}
        fieldConfig={fieldConfig}
        onSuccess={() =>
          dispatch(
            showNotification({
              message: "Usuario actualizado correctamente.",
              severity: "success",
            })
          )
        }
        onError={(err) =>
          dispatch(
            showNotification({
              message: `Error: ${err?.message || "Desconocido"}`,
              severity: "error",
            })
          )
        }
      />

      <PasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={handlePasswordChange}
      />
    </Box>
  );
};

export default EditUser;
