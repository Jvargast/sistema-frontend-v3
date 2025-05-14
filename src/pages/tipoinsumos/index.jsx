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
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateTipoMutation,
  useDeleteTipoMutation,
  useGetAllTiposQuery,
  useGetTipoByIdQuery,
  useUpdateTipoMutation,
} from "../../store/services/tipoInsumoApi";
import { useHasPermission } from "../../utils/useHasPermission";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import { getInitialRoute } from "../../utils/navigationUtils";
import BackButton from "../../components/common/BackButton";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";

const TipoInsumoManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [createTipoInsumo, { isLoading: isCreating }] = useCreateTipoMutation();
  const [deleteTipoInsumo, { isLoading: isDeleting }] = useDeleteTipoMutation();
  const [updateTipoInsumo, { isLoading: isUpdating }] = useUpdateTipoMutation();

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedTipoInsumoId, setSelectedTipoInsumoId] = useState(null);

  const { permisos, rol } = useSelector((state) => state.auth);

  const crearTipoInsumo = useHasPermission("inventario.tipoinsumo.crear");
  const editarTipoInsumo = useHasPermission("inventario.tipoinsumo.editar");
  const borrarTipoInsumo = useHasPermission("inventario.tipoinsumo.eliminar");

  const { data: tipoInsumo, isLoading: isLoadingTipoInsumo } =
    useGetTipoByIdQuery(selectedTipoInsumoId, {
      skip: !selectedTipoInsumoId,
    });

  const {
    data: tiposInsumos,
    isLoading,
    isError,
    refetch,
  } = useGetAllTiposQuery();

  const handleEdit = (id) => {
    setSelectedTipoInsumoId(id);
    setOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedTipoInsumoId) {
        const updatedTipoInsumo = data;
        await updateTipoInsumo({
          id: selectedTipoInsumoId,
          updatedTipoInsumo,
        }).unwrap();
        dispatch(
          showNotification({
            message: "Tipo de insumo actualizado correctamente",
            severity: "success",
          })
        );
      } else {
        await createTipoInsumo({ ...data }).unwrap();
        dispatch(
          showNotification({
            message: "Categoría creada correctamente",
            severity: "success",
          })
        );
      }
      setOpen(false);
      setSelectedTipoInsumoId(null);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al crear el tipo de insumo: " + error.data?.error,
          severity: "error",
        })
      );
    }
  };

  const confirmDeleteTipoInsumo = (id) => {
    setSelectedTipoInsumoId(id);
    setOpenAlert(true);
  };

  const handleDeleteTipoInsumo = async () => {
    try {
      await deleteTipoInsumo(selectedTipoInsumoId).unwrap();
      dispatch(
        showNotification({
          message: "Tipo de insumo eliminado correctamente",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al eliminar el tipo de insumo: " + error.data?.error,
          severity: "error",
        })
      );
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/tipos-insumo", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  if (isLoading || isLoadingTipoInsumo) return <LoaderComponent />;

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="error">
          Error al cargar los tipos de insumo
        </Typography>
      </Box>
    );
  }

  const fields = [
    {
      name: "nombre_tipo",
      label: "Nombre Tipo Insumo",
      type: "text",
    },
    {
      name: "descripcion",
      label: "Descripción Tipo Insumo",
      type: "text",
    },
  ];

  const inicial = getInitialRoute(rol, permisos);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <BackButton to={`${inicial}`} label="Volver" />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h3" fontWeight="bold" color="primary">
          Gestión de Tipo de Insumos
        </Typography>
        {crearTipoInsumo && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            disabled={isCreating}
          >
            Añadir Tipo Insumo
          </Button>
        )}
      </Box>

      <Grid2 container spacing={3}>
        {tiposInsumos?.map((tipo) => (
          <Grid2 key={tipo.id_tipo_insumo} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {tipo.nombre_tipo}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {tipo.descripcion}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mt={2}>
                  ID: {tipo.id_tipo_insumo}
                </Typography>
              </CardContent>
              <CardActions>
                {editarTipoInsumo && (
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(tipo.id_tipo_insumo)}
                    sx={{ color: "#1976d2", fontWeight: "bold" }}
                  >
                    Editar
                  </Button>
                )}
                {borrarTipoInsumo && (
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => confirmDeleteTipoInsumo(tipo.id_categoria)}
                    sx={{ color: "#d32f2f", fontWeight: "bold" }}
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <ModalForm
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedTipoInsumoId(null);
        }}
        onSubmit={handleSubmit}
        fields={fields}
        title={
          selectedTipoInsumoId ? "Editar Tipo Insumo" : "Crear Tipo Insumo"
        }
        initialData={tipoInsumo}
        isLoading={isUpdating || isCreating}
      />

      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteTipoInsumo}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default TipoInsumoManagement;
