import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid2,
  useTheme,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useCreateCategoriaMutation,
  useDeleteCategoriaMutation,
  useGetAllCategoriasQuery,
  useGetCategoriaByIdQuery,
  useUpdateCategoriaMutation,
} from "../../store/services/categoriaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import { useHasPermission } from "../../utils/useHasPermission";
import { useIsMobile } from "../../utils/useIsMobile";
import Header from "../../components/common/Header";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const CategoriaManagement = () => {
  const isMobile = useIsMobile();
  const theme = useTheme();
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

  const crearCategoria = useHasPermission("inventario.categoriaproducto.crear");
  const editarCategoria = useHasPermission(
    "inventario.categoriaproducto.editar"
  );
  const borrarCategoria = useHasPermission(
    "inventario.categoriaproducto.eliminar"
  );

  const { data: categoria, isLoading: isLoadingCategoria } =
    useGetCategoriaByIdQuery(selectedCategoriaId, {
      skip: !selectedCategoriaId,
    });

  const {
    data: categorias,
    isLoading,
    isError,
    refetch,
  } = useGetAllCategoriasQuery();

  useRegisterRefresh(
    "categorias",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  const handleEdit = (id) => {
    setSelectedCategoriaId(id);
    setOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCategoriaId) {
        const updatedCategoria = data;
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

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Header title="Categorías" subtitle="Gestión de Categorías" />
        {crearCategoria &&
          (isMobile ? (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(145deg, ${theme.palette.primary.light} 60%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}22, 0 1.5px 8px 0 #0001`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isCreating ? "not-allowed" : "pointer",
                opacity: isCreating ? 0.7 : 1,
                transition: "all 0.15s",
                "&:hover": {
                  background: `linear-gradient(120deg, ${theme.palette.primary.main} 70%, ${theme.palette.primary.dark} 100%)`,
                  transform: "scale(1.08)",
                  boxShadow: `0 4px 24px 0 ${theme.palette.primary.dark}33`,
                },
              }}
              onClick={() => {
                if (!isCreating) setOpen(true);
              }}
              title="Añadir Categoría"
            >
              <Add sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          ) : (
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
          ))}
      </Box>

      <Grid2 container spacing={3} alignItems="stretch">
        {categorias?.map((categoria) => (
          <Grid2
            key={categoria.id_categoria}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            display="flex"
          >
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%", // <-- esto asegura igual ancho
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  pb: 0,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.primary"
                  noWrap
                  title={categoria.nombre_categoria}
                  sx={{ mb: 1 }}
                >
                  {categoria.nombre_categoria}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: 40,
                    mb: 1,
                  }}
                  title={categoria.descripcion}
                >
                  {categoria.descripcion || "Sin descripción"}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: 13, mt: 1 }}
                >
                  ID: {categoria.id_categoria}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "flex-end",
                  gap: 1,
                  pb: 2,
                  px: 2,
                }}
              >
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
                    disabled={isDeleting}
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
