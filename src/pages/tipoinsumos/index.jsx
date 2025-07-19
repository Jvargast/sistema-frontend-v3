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
import { useIsMobile } from "../../utils/useIsMobile";
import Header from "../../components/common/Header";

const TipoInsumoManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
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
        gap={2}
      >
        <Header title="Tipo de Insumos" subtitle="Gestión de tipo de insumos" />
        {crearTipoInsumo &&
          (isMobile ? (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(145deg, #64b5f6 60%, #1976d2 100%)`,
                boxShadow: "0 2px 12px 0 #1976d222, 0 1.5px 8px 0 #0001",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isCreating ? "not-allowed" : "pointer",
                opacity: isCreating ? 0.5 : 1,
                transition: "all 0.16s cubic-bezier(.4,0,.2,1)",
                "&:hover": {
                  background: `linear-gradient(120deg, #1976d2 70%, #1565c0 100%)`,
                  transform: "scale(1.08)",
                  boxShadow: "0 4px 24px 0 #1565c033",
                },
              }}
              onClick={() => !isCreating && setOpen(true)}
              title="Añadir Tipo Insumo"
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
                fontWeight: "bold",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                boxShadow: "0 2px 8px 0 #1976d230",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
              disabled={isCreating}
            >
              Añadir Tipo Insumo
            </Button>
          ))}
      </Box>

      <Grid2
        container
        spacing={3}
        alignItems="stretch"
        /* direction={isMobile ? "column" : "row"} */
      >
        {tiposInsumos?.map((tipo) => (
          <Grid2
            key={tipo.id_tipo_insumo}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            display="flex"
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
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                minHeight: 250,
                maxWidth: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: "1 1 auto",
                  overflow: "hidden",
                  pb: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.primary"
                  noWrap
                  title={tipo.nombre_tipo}
                  sx={{ mb: 0.5 }}
                >
                  {tipo.nombre_tipo}
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
                  title={tipo.descripcion}
                >
                  {tipo.descripcion || "Sin descripción"}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: 13, mt: 1 }}
                >
                  ID: {tipo.id_tipo_insumo}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: isMobile ? "center" : "flex-end",
                  gap: 2,
                  pb: 2,
                  px: 2,
                }}
              >
                {editarTipoInsumo &&
                  (isMobile ? (
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: `linear-gradient(120deg, #90caf9, #1976d2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          background: "#1565c0",
                          transform: "scale(1.09)",
                        },
                        boxShadow: "0 2px 8px 0 #1976d222",
                      }}
                      onClick={() => handleEdit(tipo.id_tipo_insumo)}
                      title="Editar"
                    >
                      <Edit sx={{ color: "#fff", fontSize: 22 }} />
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(tipo.id_tipo_insumo)}
                      sx={{ color: "#1976d2", fontWeight: "bold" }}
                    >
                      Editar
                    </Button>
                  ))}
                {borrarTipoInsumo &&
                  (isMobile ? (
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: `linear-gradient(120deg, #ef9a9a, #d32f2f)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          background: "#c62828",
                          transform: "scale(1.09)",
                        },
                        boxShadow: "0 2px 8px 0 #d32f2f22",
                        opacity: isDeleting ? 0.7 : 1,
                      }}
                      onClick={() =>
                        !isDeleting &&
                        confirmDeleteTipoInsumo(tipo.id_tipo_insumo)
                      }
                      title="Eliminar"
                    >
                      <Delete sx={{ color: "#fff", fontSize: 22 }} />
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() =>
                        confirmDeleteTipoInsumo(tipo.id_tipo_insumo)
                      }
                      sx={{ color: "#d32f2f", fontWeight: "bold" }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  ))}
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
