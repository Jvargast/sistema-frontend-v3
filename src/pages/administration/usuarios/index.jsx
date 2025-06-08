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

const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [createNewUser] = useCreateNewUserMutation();

  // Custom hooks for fetching paginated data
  const {
    data: usuarios,
    isLoading: isLoadingUsuarios,
    page,
    pageSize,
    paginacion,
    handlePageChange,
  } = usePaginatedData(useGetAllUsersQuery, 10);

  const { data: empresas, isLoading: isLoadingEmpresas } =
    useGetAllEmpresasQuery();
  const { data: sucursales, isLoading: isLoadingSucursales } =
    useGetAllSucursalsQuery();
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRolesQuery();

  // Transform data
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
    { name: "rut", label: "RUT", type: "text", defaultValue: "" },
    { name: "nombre", label: "Nombre", type: "text", defaultValue: "" },
    { name: "apellido", label: "Apellido", type: "text", defaultValue: "" },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      defaultValue: "",
    },
    { name: "email", label: "Email", type: "text", defaultValue: "" },
    {
      name: "rolId",
      label: "Rol",
      type: "select",
      options: rolesOptions,
      defaultValue: rolesOptions[0]?.value || "",
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

  const handleEdit = (user) => navigate(`/usuarios/editar/${user.rut}`);

  const isAllLoading =
    isLoadingEmpresas ||
    isLoadingRoles ||
    isLoadingSucursales ||
    isLoadingUsuarios;

  if (isAllLoading) return <LoaderComponent />;

  return (
    <Box sx={{ padding: 4, minHeight: "100vh" }}>
      <BackButton to="/admin" label="Volver al menú" />
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Gestión de Usuarios
      </Typography>
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
