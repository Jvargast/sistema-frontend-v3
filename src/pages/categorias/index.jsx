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
  useCreateCategoriaMutation,
  useDeleteCategoriaMutation,
  useGetAllCategoriasQuery,
  useGetCategoriaByIdQuery,
  useUpdateCategoriaMutation,
} from "../../store/services/categoriaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import BackButton from "../../components/common/BackButton";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import { useHasPermission } from "../../utils/useHasPermission";
import { getInitialRoute } from "../../utils/navigationUtils";

const CategoriaManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [createCategoria, { isLoading: isCreating }] =
    useCreateCategoriaMutation();
  const [deleteCategoria, { isLoading: isDeleting }] =
    useDeleteCategoriaMutation();
  const [updateCategoria, { isLoading: isUpdating }] =
    useUpdateCategoriaMutation();

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);

  const { permisos, rol } = useSelector((state) => state.auth);

  const crearCategoria = useHasPermission("inventario.categoriaproducto.crear");
  const editarCategoria = useHasPermission("inventario.categoriaproducto.editar");
  const borrarCategoria = useHasPermission("inventario.categoriaproducto.eliminar");

  const { data: categoria, isLoading: isLoadingCategoria } =
    useGetCategoriaByIdQuery(selectedCategoriaId, {
      skip: !selectedCategoriaId, // Skip the query if no ID is selected);
    });

  const {
    data: categorias,
    isLoading,
    isError,
    refetch,
  } = useGetAllCategoriasQuery();

  const handleEdit = (id) => {
    setSelectedCategoriaId(id); // Establece el ID de la categoría seleccionada
    setOpen(true); // Abre el modal
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCategoriaId) {
        const updatedCategoria = data;
        // Actualización
        await updateCategoria({
          id: selectedCategoriaId,
          updatedCategoria,
        }).unwrap();
        dispatch(
          showNotification({
            message: "Categoría actualizada correctamente",
            severity: "success",
          })
        );
      } else {
        // Creación
        await createCategoria({ ...data }).unwrap();
        dispatch(
          showNotification({
            message: "Categoría creada correctamente",
            severity: "success",
          })
        );
      }
      setOpen(false);
      setSelectedCategoriaId(null);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al crear la categoría: " + error.data?.error,
          severity: "error",
        })
      );
    }
  };

  const confirmDeleteCategoria = (id) => {
    setSelectedCategoriaId(id);
    setOpenAlert(true);
  };

  const handleDeleteCategoria = async () => {
    try {
      await deleteCategoria(selectedCategoriaId).unwrap();
      dispatch(
        showNotification({
          message: "Categoría eliminada correctamente",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error al eliminar la categoría: " + error.data?.error,
          severity: "error",
        })
      );
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/categorias", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  if (isLoading || isLoadingCategoria) return <LoaderComponent />;

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="error">
          Error al cargar las categorías
        </Typography>
      </Box>
    );
  }

  const fields = [
    {
      name: "nombre_categoria",
      label: "Nombre Categoría",
      type: "text",
    },
    {
      name: "descripcion",
      label: "Descripción Categoría",
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
          Gestión de Categorías
        </Typography>
        {crearCategoria && (
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
            Añadir Categoría
          </Button>
        )}
      </Box>

      <Grid2 container spacing={3}>
        {categorias?.map((categoria) => (
          <Grid2 key={categoria.id_categoria} xs={12} sm={6} md={4} lg={3}>
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
                  {categoria.nombre_categoria}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {categoria.descripcion}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mt={2}>
                  ID: {categoria.id_categoria}
                </Typography>
              </CardContent>
              <CardActions>
                {editarCategoria && (
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(categoria.id_categoria)}
                    sx={{ color: "#1976d2", fontWeight: "bold" }}
                  >
                    Editar
                  </Button>
                )}
                {borrarCategoria && (
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={() =>
                      confirmDeleteCategoria(categoria.id_categoria)
                    }
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
          setSelectedCategoriaId(null);
        }}
        onSubmit={handleSubmit}
        fields={fields}
        title={selectedCategoriaId ? "Editar Categoría" : "Crear Categoría"}
        initialData={categoria}
        isLoading={isUpdating || isCreating}
      />

      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteCategoria}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default CategoriaManagement;
