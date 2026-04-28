import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import Header from "../../components/common/Header";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";
import CompactCatalogCard from "../../components/common/CompactCatalogCard";

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

  const crearTipoInsumo = useHasPermission("inventario.tipoinsumo.crear");
  const editarTipoInsumo = useHasPermission("inventario.tipoinsumo.editar");
  const borrarTipoInsumo = useHasPermission("inventario.tipoinsumo.eliminar");

  const { data: tipoInsumo, isLoading: isLoadingTipoInsumo, refetch: refetchTipo } =
    useGetTipoByIdQuery(selectedTipoInsumoId, {
      skip: !selectedTipoInsumoId,
    });

  const {
    data: tiposInsumos,
    isLoading,
    isError,
    refetch,
  } = useGetAllTiposQuery();

  useRegisterRefresh(
    "tipo-insumo",
    async () => {
      await Promise.all([refetch(), refetchTipo()]);
      return true;
    },
    [refetch, refetchTipo]
  );

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
            message: "Tipo de insumo creado correctamente",
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

  const tiposOrdenados = useMemo(
    () =>
      [...(tiposInsumos || [])].sort((a, b) =>
        String(a?.nombre_tipo || "").localeCompare(
          String(b?.nombre_tipo || ""),
          "es",
          { sensitivity: "base" }
        )
      ),
    [tiposInsumos]
  );

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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={2}
      >
        <Header title="Tipo de Insumos" subtitle="Gestión de tipo de insumos" />
      </Box>

      <Box sx={catalogGridSx}>
        {tiposOrdenados.map((tipo) => (
          <CompactCatalogCard
            key={tipo.id_tipo_insumo}
            id={tipo.id_tipo_insumo}
            title={tipo.nombre_tipo}
            description={tipo.descripcion}
            canEdit={editarTipoInsumo}
            canDelete={borrarTipoInsumo}
            isDeleting={isDeleting}
            onEdit={() => handleEdit(tipo.id_tipo_insumo)}
            onDelete={() => confirmDeleteTipoInsumo(tipo.id_tipo_insumo)}
          />
        ))}

        {crearTipoInsumo && (
          <CompactCatalogCard
            createLabel="Crear Tipo"
            onCreate={() => {
              if (!isCreating) setOpen(true);
            }}
          />
        )}
      </Box>

      {tiposOrdenados.length === 0 && !crearTipoInsumo && (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          No hay tipos de insumo registrados.
        </Box>
      )}

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
        message="¿Estás seguro de que deseas eliminar este tipo de insumo? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default TipoInsumoManagement;
