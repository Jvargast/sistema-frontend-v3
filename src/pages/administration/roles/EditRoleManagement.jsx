import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { FixedSizeList as VirtualizedList } from "react-window";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../../store/services/rolesApi";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import { useGetAllpermisosQuery } from "../../../store/services/permisosRolesApi";
import Row from "../../../components/roles/Row";
import { useHasPermission } from "../../../utils/useHasPermission";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: role, isLoading: isLoadingRole, refetch } = useGetRoleByIdQuery(id);
  const [updateRole] = useUpdateRoleMutation();

  const [page, setPage] = useState(1);
  const limit = 80;
  const [allPermisos, setAllPermisos] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [groupedPermisos, setGroupedPermisos] = useState({});
  const [hasMore, setHasMore] = useState(true);

  // Estado para manejar la carga inicial
  const { data: permisos, isFetching } = useGetAllpermisosQuery({ page, limit });

  const canEditPermisos = useHasPermission("editar_permisos");

  // Reinicia estados al cambiar de rol
  useEffect(() => {
    setPage(1);
    setAllPermisos([]);
    setGroupedPermisos({});
    setHasMore(true);
  }, [id]);

  // Inicializa permisos seleccionados
  useEffect(() => {
    if (role?.rolesPermisos) {
      setSelectedPermisos(role.rolesPermisos.map((rp) => rp.permiso.id));
    }
  }, [role]);

  // Carga progresiva de permisos
  useEffect(() => {
    if (permisos?.permisos) {
      setAllPermisos((prev) => {
        const newPermisos = permisos.permisos.filter(
          (permiso) => !prev.some((p) => p.id === permiso.id)
        );
        return [...prev, ...newPermisos];
      });

      const totalPages = permisos.paginacion?.totalPages || 1;
      setHasMore(page < totalPages);
    }
  }, [permisos, page]);

  // Agrupa los permisos por categoría
  useEffect(() => {
    const grouped = allPermisos.reduce((acc, permiso) => {
      const category = permiso.categoria || "Sin Categoría";
      if (!acc[category]) acc[category] = [];
      acc[category].push(permiso);
      return acc;
    }, {});
    setGroupedPermisos(grouped);
  }, [allPermisos]);

  // Carga todas las páginas necesarias al inicio
  useEffect(() => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetching]);

  const handleSave = async () => {
    try {
      const updatedRole = {
        ...role,
        permisos: selectedPermisos,
      };

      await updateRole({ id, updatedRole });
      refetch();
      dispatch(
        showNotification({
          message: "Permisos actualizados con éxito",
          severity: "success",
        })
      );
      navigate("/roles", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar los permisos: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  const handleTogglePermiso = (permisoId) => {
    setSelectedPermisos((prev) =>
      prev.includes(permisoId)
        ? prev.filter((id) => id !== permisoId)
        : [...prev, permisoId]
    );
  };

  if (isLoadingRole || isFetching) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Editar Rol: {role?.nombre}
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => navigate("/roles")}
        sx={{ marginBottom: 2 }}
      >
        Cancelar
      </Button>
      <Card sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", padding: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Permisos Asociados
          </Typography>
          {Object.entries(groupedPermisos).map(([category, group]) => (
            <Box key={category} sx={{ marginBottom: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 1,
                  color: "primary.main",
                }}
              >
                {category}
              </Typography>
              <VirtualizedList
                height={group.length > 5 ? 300 : group.length * 60}
                itemCount={group.length}
                itemSize={60}
                width="100%"
                onItemsRendered={({ visibleStopIndex }) => {
                  if (visibleStopIndex >= group.length - 1 && hasMore) {
                    setPage((prev) => prev + 1);
                  }
                }}
              >
                {({ index, style }) => (
                  <Row
                    index={index}
                    style={style}
                    group={group}
                    selectedPermisos={selectedPermisos}
                    onTogglePermiso={handleTogglePermiso}
                  />
                )}
              </VirtualizedList>
            </Box>
          ))}
          {canEditPermisos && (
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleSave}
            >
              Guardar Cambios
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditRole;
