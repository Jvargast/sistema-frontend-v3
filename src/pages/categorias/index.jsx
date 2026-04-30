import { useEffect, useMemo, useState } from "react";
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
import Header from "../../components/common/Header";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";
import CompactCatalogCard from "../../components/common/CompactCatalogCard";
import SearchBar from "../../components/common/SearchBar";
import { filterBySearch } from "../../utils/searchUtils";

const catalogGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: 1.5,
  alignItems: "stretch",
};

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
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

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

  const categoriasFiltradas = useMemo(
    () =>
      filterBySearch(categorias || [], search, [
        "id_categoria",
        "nombre_categoria",
        "descripcion",
      ]),
    [categorias, search]
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
      </Box>

      <Box sx={{ mb: 2, maxWidth: { xs: "100%", sm: 420 } }}>
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={setSearch}
          placeholder="Buscar categorías por nombre o descripción..."
          width={{ xs: "100%", sm: 420 }}
        />
      </Box>

      {categoriasFiltradas.length === 0 && search && (
        <Box sx={{ mb: 2, color: "text.secondary", fontSize: 14 }}>
          No hay categorías que coincidan con la búsqueda.
        </Box>
      )}

      <Box sx={catalogGridSx}>
        {categoriasFiltradas.map((categoria) => (
          <CompactCatalogCard
            key={categoria.id_categoria}
            id={categoria.id_categoria}
            title={categoria.nombre_categoria}
            description={categoria.descripcion}
            canEdit={editarCategoria}
            canDelete={borrarCategoria}
            isDeleting={isDeleting}
            onEdit={() => handleEdit(categoria.id_categoria)}
            onDelete={() => confirmDeleteCategoria(categoria.id_categoria)}
          />
        ))}

        {crearCategoria && (
          <CompactCatalogCard
            createLabel="Crear Categoría"
            onCreate={() => {
              if (!isCreating) setOpen(true);
            }}
          />
        )}
      </Box>

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
