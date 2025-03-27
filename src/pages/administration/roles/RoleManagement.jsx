import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid2,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoaderComponent from "../../../components/common/LoaderComponent";
import BackButton from "../../../components/common/BackButton";
import AlertDialog from "../../../components/common/AlertDialog";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
} from "../../../store/services/rolesApi";
import { useHasPermission } from "../../../utils/useHasPermission";

const RoleManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [createRole] = useCreateRoleMutation();
  const dispatch = useDispatch();
  const [deleteRole] = useDeleteRoleMutation();

  // Permisos
  const canCreateRole = useHasPermission("crear_roles");
  const canDeleteRole = useHasPermission("eliminar_roles");
  const canEditRole = useHasPermission("editar_roles");

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const { data: roles, isLoading, isError, refetch } = useGetAllRolesQuery();

  const handleCreateRole = async () => {
    //const newRole = { nombre: "Nuevo Rol", descripcion: "Descripción del rol" };
    //await createRole(newRole);
    // Aquí debería ser un modal para crear.
    dispatch(
      showNotification({
        message: "Método no implementado ",
        severity: "info",
      })
    );
  };

  const confirmDeleteRole = (id) => {
    setSelectedRoleId(id);
    setOpenAlert(true);
  };

  const handleDeleteRole = async () => {
    await deleteRole(selectedRoleId);
    dispatch(
      showNotification({
        message: "Rol eliminado correctamente",
        severity: "success",
        duration: 3000,
      })
    );
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/roles", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  if (isLoading) return <LoaderComponent />;

  if (isError)
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Error al cargar los roles
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "auto",
        padding: 3,
        backgroundColor: "#f9fafb",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <BackButton to="/admin" label="Volver al menú" />
        <Typography variant="h3" className="font-bold text-gray-800">
          Gestión de Roles
        </Typography>
        {canCreateRole && ( // Mostrar botón solo si tiene permiso
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateRole}
            sx={{
              fontSize: "0.8rem",
              paddingX: 1,
              paddingY: 1,
              borderRadius: 50,
            }}
          >
            Añadir Rol
          </Button>
        )}
      </Box>

      <Grid2
        container
        spacing={4}
        className="text-lg"
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {roles?.roles?.map((role) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={role.id}>
            <Card
              sx={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  className="font-semibold text-gray-700 capitalize"
                >
                  {role.nombre}
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-2">
                  {role.descripcion}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-600 mt-4"
                >
                  Permisos Aprobados: {role.permissionsCount?.approved || 0}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-600 mt-2"
                >
                  Permisos Denegados: {role.permissionsCount?.notApproved || 0}
                </Typography>
              </CardContent>
              <CardActions className="flex justify-between">
                {canEditRole && ( // Mostrar botón solo si tiene permiso
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/roles/editar/${role.id}`)}
                    className="text-lg"
                  >
                    Editar Permisos
                  </Button>
                )}
                {canDeleteRole && ( // Mostrar botón solo si tiene permiso
                  <Button
                    size="medium"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => confirmDeleteRole(role.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteRole}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default RoleManagement;
