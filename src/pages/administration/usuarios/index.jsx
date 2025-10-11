import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useCreateNewUserMutation,
  useGetAllUsersQuery,
} from "../../../store/services/usuariosApi";
import {
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
} from "../../../store/services/empresaApi";
import { useGetAllRolesQuery } from "../../../store/services/rolesApi";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import LoaderComponent from "../../../components/common/LoaderComponent";
import BackButton from "../../../components/common/BackButton";
import ModalForm from "../../../components/common/ModalForm";
import usePaginatedData from "../../../utils/usePaginateData";
import Header from "../../../components/common/Header";
import MobileUserManagement from "./MobileUserManagement";
import { useIsMobile } from "../../../utils/useIsMobile";
import { useSelector } from "react-redux";
import { useRegisterRefresh } from "../../../hooks/useRegisterRefresh";

const UserManagement = () => {
  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const isSucursalScope = mode !== "global" && Number(activeSucursalId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [createNewUser] = useCreateNewUserMutation();
  const isMobile = useIsMobile();

  const {
    data: usuarios,
    isLoading: isLoadingUsuarios,
    page,
    pageSize,
    paginacion,
    handlePageChange,
  } = usePaginatedData(
    useGetAllUsersQuery,
    10,
    { ...(isSucursalScope ? { id_sucursal: Number(activeSucursalId) } : {}) },
    `${mode}:${activeSucursalId}`
  );

  const {
    data: empresas,
    isLoading: isLoadingEmpresas,
    refetch: empresasRefetch,
  } = useGetAllEmpresasQuery();
  const {
    data: sucursales,
    isLoading: isLoadingSucursales,
    refetch: sucursalesRefetch,
  } = useGetAllSucursalsQuery();
  const { data: rolesData, isLoading: isLoadingRoles, refetch: rolesRefetch } = useGetAllRolesQuery();

  useRegisterRefresh(
    "usuarios",
    async () => {
      await Promise.all([
        empresasRefetch(),
        sucursalesRefetch(),
        rolesRefetch(),
      ]);
      return true;
    },
    [empresasRefetch, sucursalesRefetch, rolesRefetch]
  );

  const rolesOptions =
    rolesData?.roles?.map((role) => ({
      value: role.id,
      label: role.nombre,
    })) || [];

  const usuariosMapped =
    usuarios?.map((user) => ({
      ...user,
      rol: user?.rol?.nombre || "Sin rol",
      Empresa: user?.Empresa?.nombre || "Sin empresa",
      Sucursal: user?.Sucursal?.nombre || "Sin sucursal",
      ultimo_login: user?.ultimo_login
        ? new Date(user.ultimo_login).toLocaleString()
        : "Nunca",
    })) || [];

  const columns = [
    { field: "sequentialId", headerName: "ID", flex: 0.15 },
    { field: "nombre", headerName: "Nombre", flex: 0.3 },
    { field: "apellido", headerName: "Apellido", flex: 0.3 },
    { field: "rut", headerName: "Rut", flex: 0.3 },
    { field: "rol", headerName: "Rol", flex: 0.3 },
    {
      field: "ultimo_login",
      headerName: "Último Login",
      flex: 0.4,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.2,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const fields = [
    {
      name: "rut",
      label: "RUT",
      type: "text",
      defaultValue: "",
      required: true,
      helperText: "Ej: 12.345.678-9",
    },
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      defaultValue: "",
      required: true,
      requiredMessage: "Ingresa el nombre",
    },
    {
      name: "apellido",
      label: "Apellido",
      type: "text",
      defaultValue: "",
      required: true,
      requiredMessage: "Ingresa el apellido",
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      defaultValue: "",
      required: true,
      minLength: 8,
      minLengthMessage: "La contraseña debe tener al menos 8 caracteres",
      helperText: "Mínimo 8 caracteres",
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      defaultValue: "",
      required: true,
      format: "email",
      formatMessage: "Formato de correo inválido",
      helperText: "Ej: usuario@dominio.com",
    },
    {
      name: "rolId",
      label: "Rol",
      type: "select",
      options: rolesOptions,
      defaultValue: rolesOptions[0]?.value || "",
      required: true,
      requiredMessage: "Selecciona un rol",
    },
    {
      name: "id_empresa",
      label: "Empresa",
      type: "select",
      options:
        empresas?.map((empresa) => ({
          value: empresa.id_empresa,
          label: empresa.nombre,
        })) || [],
      required: true,
      requiredMessage: "Selecciona una empresa",
    },
    {
      name: "id_sucursal",
      label: "Sucursal",
      type: "select",
      options:
        sucursales?.map((sucursal) => ({
          value: sucursal.id_sucursal,
          label: sucursal.nombre,
        })) || [],
      defaultValue: isSucursalScope ? Number(activeSucursalId) : "",
      disabled: !!isSucursalScope,
      required: true,
      requiredMessage: "Selecciona una sucursal",
    },
  ];

  const handleAddUser = () => setOpen(true);

  const handleSubmit = async (newUser) => {
    try {
      await createNewUser(newUser).unwrap();
      setOpen(false);
      dispatch(
        showNotification({
          message: "Usuario creado con éxito",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear usuario: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  const handleEdit = (user) => navigate(`/admin/usuarios/editar/${user.rut}`);

  const isAllLoading =
    isLoadingEmpresas ||
    isLoadingRoles ||
    isLoadingSucursales ||
    isLoadingUsuarios;

  if (isAllLoading) return <LoaderComponent />;

  if (isMobile) {
    return (
      <MobileUserManagement
        usuariosMapped={usuariosMapped}
        handleEdit={handleEdit}
        handleAddUser={handleAddUser}
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        fields={fields}
        isAllLoading={isAllLoading}
        page={page}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        paginacion={paginacion}
      />
    );
  }

  return (
    <Box sx={{ padding: 4, minHeight: "100vh" }}>
      <BackButton to="/admin" label="Volver al menú" />
      <Header title="Listado de Usuarios" subtitle="Gestión de Usuarios" />
      <Card
        sx={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Lista de Usuarios
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Nuevo Usuario
            </Button>
          </Box>
          <DataGrid
            rows={usuariosMapped}
            columns={columns}
            getRowId={(row) => row?.rut}
            pagination
            paginationMode="server"
            rowCount={paginacion.totalItems}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={({ page, pageSize }) =>
              handlePageChange(page, pageSize)
            }
            rowsPerPageOptions={[5, 10, 20, 50]}
            pageSizeOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
          />
        </CardContent>
      </Card>
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title="Crear Nuevo Usuario"
      />
    </Box>
  );
};

export default UserManagement;
