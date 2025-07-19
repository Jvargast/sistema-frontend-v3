import { useState, useEffect, useRef } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { VariableSizeList as VirtualizedList } from "react-window";
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

  const {
    data: role,
    isLoading: isLoadingRole,
    refetch,
  } = useGetRoleByIdQuery(id);
  const [updateRole] = useUpdateRoleMutation();

  const [allPermisos, setAllPermisos] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [groupedPermisos, setGroupedPermisos] = useState({});

  const { data: permisosData, isFetching } = useGetAllpermisosQuery({
    page: 1,
    limit: 9999,
  });

  const canEditPermisos = useHasPermission("auth.permisos.editar");
  

  useEffect(() => {
    if (permisosData?.permisos) {
      setAllPermisos(permisosData.permisos);
    }
  }, [permisosData]);

  useEffect(() => {
    if (role?.rolesPermisos) {
      setSelectedPermisos(role.rolesPermisos.map(p => p.permisoId));
    }
  }, [role]);

  

  const listRef = useRef();

  const getItemSize = (index, group) => {
    const permiso = group[index];
  
    const nombreLines = Math.ceil(permiso.nombre.length / 25); 
    const descripcionLines = Math.ceil(permiso.descripcion.length / 40); 
  
    const lineHeight = 20; 
    const verticalPadding = 30; 
  
    const calculatedHeight =
      verticalPadding + (nombreLines + descripcionLines) * lineHeight;
  
    return Math.max(calculatedHeight, 70);
  };
  

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [groupedPermisos]);

  useEffect(() => {
    const grouped = allPermisos.reduce((acc, permiso) => {
      const category = permiso.categoria || "Sin Categoría";
      if (!acc[category]) acc[category] = [];
      acc[category].push(permiso);
      return acc;
    }, {});
    setGroupedPermisos(grouped);
  }, [allPermisos]);

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
    setSelectedPermisos((prev) => {
      const alreadySelected = prev.includes(permisoId);

      if (!alreadySelected) {
        const permisoBase = allPermisos.find((p) => p.id === permisoId);
        if (!permisoBase) return prev;

        const toActivate = new Set(prev);
        const stack = [permisoBase];

        while (stack.length > 0) {
          const current = stack.pop();
          toActivate.add(current.id);

          if (current.Dependencias?.length) {
            current.Dependencias.forEach((dep) => {
              if (!toActivate.has(dep.id)) {
                const fullDep = allPermisos.find((p) => p.id === dep.id);
                if (fullDep) {
                  stack.push(fullDep);
                }
              }
            });
          }
        }

        const nuevosPermisos = [...toActivate].filter(
          (id) => !prev.includes(id)
        );
        const dependenciasExtra = nuevosPermisos.filter(
          (id) => id !== permisoId
        );

        if (dependenciasExtra.length > 0) {
          dispatch(
            showNotification({
              message: `Se activaron ${dependenciasExtra.length} permiso(s) adicional(es) que dependen de "${permisoBase.nombre}".`,
              severity: "info",
            })
          );
        }

        return Array.from(toActivate);
      }
      else {
        const permisoBase = allPermisos.find((p) => p.id === permisoId);
        if (!permisoBase) return prev;

        const toRemove = new Set();
        const stack = [permisoBase];

        while (stack.length > 0) {
          const current = stack.pop();
          if (prev.includes(current.id)) {
            toRemove.add(current.id);

            if (current.RequierenEste?.length) {
              current.RequierenEste.forEach((dep) => {
                if (!toRemove.has(dep.id) && prev.includes(dep.id)) {
                  stack.push(dep);
                }
              });
            }
          }
        }

        if (toRemove.size > 1) {
          const dependientes = [...toRemove].filter(
            (id) => id !== permisoBase.id
          );
          const nombres = dependientes.map((id) => {
            const p = allPermisos.find((pm) => pm.id === id);
            return p?.nombre || `ID-${id}`;
          });

          const proceed = window.confirm(
            `Al desactivar "${
              permisoBase.nombre
            }", también se desactivarán:\n${nombres.join(
              ", "
            )}\n¿Deseas continuar?`
          );
          if (!proceed) {
            return prev;
          }
        }

        const cantidad = toRemove.size;
        if (cantidad > 1) {
          dispatch(
            showNotification({
              message: `Se desactivó "${permisoBase.nombre}" y ${
                cantidad - 1
              } permiso(s) que dependían de él.`,
              severity: "info",
            })
          );
        } else {
          dispatch(
            showNotification({
              message: `Se desactivó el permiso "${permisoBase.nombre}".`,
              severity: "info",
            })
          );
        }

        return prev.filter((id) => !toRemove.has(id));
      }
    });
  };

  if (isLoadingRole || isFetching) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Editar Rol: {role?.nombre}
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => navigate("/admin/roles")}
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
                ref={listRef}
                height={Math.min(
                  300,
                  group.reduce(
                    (acc, _, index) => acc + getItemSize(index, group),
                    0
                  )
                )}
                itemCount={group.length}
                itemSize={(index) => getItemSize(index, group)}
                width="100%"
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
