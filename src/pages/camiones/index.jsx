import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
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
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          backgroundColor: "#ffffff",
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#333",
              whiteSpace: "nowrap",
            }}
          >
            Gestión de Camiones
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disableRipple
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            disabled={isCreating}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.9rem" },
              fontWeight: "bold",
              py: 1.5,
              px: { xs: 1.5, sm: 3 },
              minWidth: { xs: "40px", sm: "auto" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { backgroundColor: "#115293" },
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
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No hay camiones registrados.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={{ xs: 2, sm: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            alignItems="stretch"
          >
            {camiones?.map((camion) => (
              <Grid key={camion.id_camion} item xs={4} sm={4} md={4} lg={3}>
                <CamionCard
                  camion={camion}
                  onDelete={confirmDeleteCamion}
                  isDeleting={isDeleting}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

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
