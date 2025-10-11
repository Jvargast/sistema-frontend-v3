import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid2,
  Divider,
  useTheme,
} from "@mui/material";
import { Add, Edit, Delete, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoaderComponent from "../../../components/common/LoaderComponent";
import AlertDialog from "../../../components/common/AlertDialog";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
} from "../../../store/services/rolesApi";
import { useHasPermission } from "../../../utils/useHasPermission";
import { useRegisterRefresh } from "../../../hooks/useRegisterRefresh";

const RoleManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [createRole] = useCreateRoleMutation();
  const dispatch = useDispatch();
  const [deleteRole] = useDeleteRoleMutation();

  // Permisos
  const canCreateRole = useHasPermission("auth.roles.crear");
  const canDeleteRole = useHasPermission("auth.roles.eliminar");
  const canEditRole = useHasPermission("auth.roles.editar");

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const { data: roles, isLoading, isError, refetch } = useGetAllRolesQuery();

  useRegisterRefresh(
    "roles",
    async () => {
      await refetch();
      return true;
    },
    [refetch]
  );

  const handleCreateRole = async () => {
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
    setOpenAlert(false);
    refetch();
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
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 1, md: 3 },
        p: 2,
      }}
    >
      {/* TÍTULO y BOTONES */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 3 },
          mb: { xs: 2, md: 4 },
          p: 1,
        }}
      >
        {/* Botón Volver */}
        <Button
          onClick={() => navigate("/admin")}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            border: "1.5px solid #212121",
            color: theme.palette.mode === "dark" ? "#fafafa" : "#212121",
            borderRadius: 2,
            px: 2,
            fontWeight: 500,
            fontSize: "1rem",
            background: "transparent",
            minWidth: 0,
            boxShadow: "none",
            transition: "all 0.19s cubic-bezier(.4,0,.2,1)",
            "&:hover": {
              background: theme.palette.action.hover,
              borderColor: "#111",
              boxShadow: theme.shadows[2],
            },
          }}
        >
          Volver
        </Button>
        {/* Título */}
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            textAlign: { xs: "center", sm: "left" },
            flex: 1,
            color: theme.palette.text.primary,
            letterSpacing: 0.2,
            lineHeight: 1.18,
            textShadow:
              theme.palette.mode === "dark"
                ? "0 2px 8px #0003"
                : "0 1px 4px #1a237e13",
          }}
        >
          Gestión de Roles
        </Typography>
        {/* Botón Añadir Rol */}
        {canCreateRole && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateRole}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 700,
              boxShadow: "0 2px 12px #1976d22a",
              background: "linear-gradient(98deg,#4776e6,#4f99e9)",
              color: "#fff",
              fontSize: "1rem",
              whiteSpace: "nowrap",
              textTransform: "none",
              letterSpacing: 0.15,
              minWidth: 0,
              transition: "all 0.19s cubic-bezier(.4,0,.2,1)",
              "&:hover": {
                background: "linear-gradient(96deg,#295cc8 60%,#4f99e9 100%)",
                boxShadow: "0 4px 18px #1565c02b",
              },
            }}
          >
            Añadir Rol
          </Button>
        )}
      </Box>

      {/* Tarjetas */}
      <Grid2 container spacing={3} alignItems="stretch">
        {roles?.roles?.map((role) => (
          <Grid2
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={role.id}
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              maxWidth: { xs: "100%", sm: "100%", md: 360, lg: 360 },
              flex: {
                xs: "1 1 100%",
                sm: "1 1 100%",
                md: "1 1 340px",
                lg: "1 1 340px",
              },
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                minHeight: 230,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 16px 0 #21305212",
                transition: "transform 0.18s, box-shadow 0.18s",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.025)",
                  boxShadow: "0 8px 32px 0 #1565c020",
                },
                p: 1,
                width: "100%",
                maxWidth: { xs: "100%", sm: "unset" },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 1.2,
                  pb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="primary"
                  sx={{
                    textTransform: "capitalize",
                    mb: 0.5,
                    wordBreak: "break-word",
                  }}
                >
                  {role.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    minHeight: 32,
                    wordBreak: "break-word",
                  }}
                >
                  {role.descripcion || "Sin descripción"}
                </Typography>
                <Divider sx={{ mb: 1, borderColor: "grey.200" }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    color="success.main"
                  >
                    Permisos Aprobados:{" "}
                    <b>{role.permissionsCount?.approved || 0}</b>
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    color="error.main"
                  >
                    Permisos Denegados:{" "}
                    <b>{role.permissionsCount?.notApproved || 0}</b>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                  pb: 1.2,
                  pt: 0.2,
                  mt: "auto",
                }}
              >
                {canEditRole && (
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/admin/roles/editar/${role.id}`)}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderWidth: 1.3,
                      borderColor: theme.palette.primary.main,
                      "&:hover": {
                        background: theme.palette.primary.light + "33",
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    Editar
                  </Button>
                )}
                {canDeleteRole && (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => confirmDeleteRole(role.id)}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderWidth: 1.3,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        background: theme.palette.error.light + "24",
                        borderColor: theme.palette.error.main,
                      },
                    }}
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
