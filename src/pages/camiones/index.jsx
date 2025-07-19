import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import {
  useCreateCamionMutation,
  useDeleteCamionMutation,
  useGetAllCamionesQuery,
} from "../../store/services/camionesApi";
import CamionCard from "../../components/camion/CamionCard";
import Header from "../../components/common/Header";

const CamionesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCamionId, setSelectedCamionId] = useState(null);

  const {
    data: camiones,
    isLoading,
    isError,
    refetch,
  } = useGetAllCamionesQuery();
  const [createCamion, { isLoading: isCreating }] = useCreateCamionMutation();
  const [deleteCamion, { isLoading: isDeleting }] = useDeleteCamionMutation();

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/camiones", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        await createCamion(data).unwrap();
        dispatch(
          showNotification({
            message: "Camión creado correctamente",
            severity: "success",
          })
        );
        setOpen(false);
        refetch();
      } catch (error) {
        dispatch(
          showNotification({
            message:
              "Error al crear el camión: " +
              (error.data?.error || error.message),
            severity: "error",
          })
        );
      }
    },
    [createCamion, dispatch, refetch]
  );

  const confirmDeleteCamion = (id) => {
    setSelectedCamionId(id);
    setOpenAlert(true);
  };

  const handleDeleteCamion = useCallback(async () => {
    if (!selectedCamionId) return;
    try {
      await deleteCamion(selectedCamionId).unwrap();
      dispatch(
        showNotification({
          message: "Camión eliminado correctamente",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message:
            "Error al eliminar el camión: " +
            (error.data?.error || error.message),
          severity: "error",
        })
      );
    }
    setOpenAlert(false);
  }, [deleteCamion, selectedCamionId, dispatch, refetch]);

  if (isLoading) return <LoaderComponent />;
  if (isError)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5" color="error">
          Error al cargar los camiones
        </Typography>
      </Box>
    );

  const fields = [
    { name: "placa", label: "Placa del Camión", type: "text" },
    { name: "capacidad", label: "Capacidad del Camión", type: "number" },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Disponible", value: "Disponible" },
        { label: "En Ruta", value: "En Ruta" },
        { label: "Mantenimiento", value: "Mantenimiento" },
      ],
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: (theme) => theme.palette.background.default,
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          boxSizing: "border-box",
          bgcolor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[2],
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 4,
            gap: 2,
          }}
        >
          <Header title="Camiones" subtitle="Gestión de Camiones" />
          <Button
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            disabled={isCreating}
            sx={{
              fontSize: { xs: "0.78rem", sm: "0.92rem" },
              fontWeight: 700,
              py: 1.1,
              px: { xs: 2, sm: 3 },
              borderRadius: 2,
              minWidth: { xs: "40px", sm: "auto" },
              boxShadow: "none",
              transition: "background 0.15s",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.dark,
              },
              "& .MuiButton-startIcon": { margin: 0 },
            }}
            aria-label="Añadir Camión"
          >
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              Añadir Camión
            </Box>
          </Button>
        </Box>

        {camiones?.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            <Typography variant="h6">No hay camiones registrados.</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: 2,
            }}
          >
            {camiones?.map((camion) => (
              <Box
                key={camion.id_camion}
                sx={{
                  flex: "1 1 330px",
                  maxWidth: "440px",
                  minWidth: "300px",
                  width: "100%",
                  transition: "transform 0.18s",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.015)",
                  },
                }}
              >
                <CamionCard
                  camion={camion}
                  onDelete={confirmDeleteCamion}
                  isDeleting={isDeleting}
                  onCamionUpdated={refetch}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={fields}
        title="Crear Camión"
      />
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleDeleteCamion}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este camión? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

export default CamionesManagement;
