import { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
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
import { useSelector } from "react-redux";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const CamionesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    mode,
    activeSucursalId,
    sucursales = [],
  } = useSelector((s) => s.scope);

  const [sucursalFiltro, setSucursalFiltro] = useState("");

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

  useRegisterRefresh(
    "camiones",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  useEffect(() => {
    const next = mode === "global" ? "" : String(activeSucursalId ?? "");
    setSucursalFiltro((prev) => (prev === next ? prev : next));
  }, [mode, activeSucursalId]);

  const targetSucursalId =
    mode === "global"
      ? sucursalFiltro
        ? Number(sucursalFiltro)
        : null
      : activeSucursalId
      ? Number(activeSucursalId)
      : null;

  const camionesVisibles = useMemo(() => {
    if (!Array.isArray(camiones)) return [];
    if (mode === "global") {
      if (!targetSucursalId) return [];
      return camiones.filter(
        (c) => Number(c?.id_sucursal) === Number(targetSucursalId)
      );
    }
    return camiones.filter(
      (c) => Number(c?.id_sucursal) === Number(activeSucursalId)
    );
  }, [camiones, mode, targetSucursalId, activeSucursalId]);

  const opcionesSucursales = useMemo(() => {
    const byId = new Map();

    (Array.isArray(sucursales) ? sucursales : []).forEach((s) => {
      const id = Number(s?.id_sucursal);
      if (!id) return;
      byId.set(id, {
        id_sucursal: id,
        nombre: (s?.nombre ?? `Sucursal ${id}`).trim(),
      });
    });

    (Array.isArray(camiones) ? camiones : []).forEach((c) => {
      const id = Number(c?.id_sucursal);
      if (!id || byId.has(id)) return;
      byId.set(id, {
        id_sucursal: id,
        nombre: (c?.Sucursal?.nombre ?? `Sucursal ${id}`).trim(),
      });
    });

    const ensureId = (raw) => {
      if (!raw) return;
      const id = Number(raw);
      if (!id) return;
      if (!byId.has(id)) {
        const s = (sucursales || []).find((x) => Number(x?.id_sucursal) === id);
        byId.set(id, {
          id_sucursal: id,
          nombre: (s?.nombre ?? `Sucursal ${id}`).trim(),
        });
      }
    };
    ensureId(activeSucursalId);
    ensureId(sucursalFiltro);

    return [...byId.values()].sort((a, b) =>
      String(a.nombre).localeCompare(String(b.nombre))
    );
  }, [sucursales, camiones, activeSucursalId, sucursalFiltro]);

  useEffect(() => {
    if (mode !== "global") return;
    if (!sucursalFiltro) return;
    const existe = opcionesSucursales.some(
      (s) => String(s.id_sucursal) === String(sucursalFiltro)
    );
    if (!existe) setSucursalFiltro("");
    //eslint-disable-next-line
  }, [mode, opcionesSucursales]);

  const sucursalOptions = useMemo(
    () =>
      opcionesSucursales.map((s) => ({
        label: s.nombre,
        value: Number(s.id_sucursal),
      })),
    [opcionesSucursales]
  );

  const initialModalData = useMemo(
    () => ({
      id_sucursal:
        mode === "global"
          ? sucursalFiltro
            ? Number(sucursalFiltro)
            : ""
          : Number(activeSucursalId || 0),
      estado: "Disponible",
    }),
    [mode, sucursalFiltro, activeSucursalId]
  );

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/camiones", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const handleSubmit = useCallback(
    async (data) => {
      const idSucursal =
        mode === "global"
          ? Number(sucursalFiltro || 0)
          : Number(activeSucursalId || 0);

      if (!idSucursal) {
        dispatch(
          showNotification({
            message: "Selecciona una sucursal antes de crear un camión.",
            severity: "warning",
          })
        );
        return;
      }
      try {
        console.log(data);
        await createCamion({ ...data, id_sucursal: idSucursal }).unwrap();
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
    [createCamion, dispatch, refetch, mode, sucursalFiltro, activeSucursalId]
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
      const code = error?.data?.code;
      const msg =
        code === "CAMION_TIENE_CHOFER"
          ? "Este camión tiene un chofer asignado. Desasigna al chofer antes de eliminar."
          : code === "CAMION_NOT_FOUND"
          ? "El camión ya no existe (posible eliminación previa)."
          : error?.data?.error ||
            error?.message ||
            "Error al eliminar el camión";
      dispatch(
        showNotification({
          message: msg,
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
    {
      name: "id_sucursal",
      label: "Sucursal",
      type: "select",
      options: sucursalOptions,
      disabled: mode !== "global",
      defaultValue:
        mode === "global"
          ? sucursalFiltro
            ? Number(sucursalFiltro)
            : ""
          : Number(activeSucursalId || 0),
      required: true,
    },
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
          {mode === "global" && (
            <TextField
              select
              size="small"
              label="Sucursal"
              value={String(sucursalFiltro)}
              onChange={(e) => setSucursalFiltro(e.target.value)}
              sx={{ minWidth: 240 }}
            >
              <MenuItem value="">Selecciona una sucursal…</MenuItem>
              {opcionesSucursales.map((s) => (
                <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            disabled={isCreating || (mode === "global" && !targetSucursalId)}
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

        {mode === "global" && !targetSucursalId ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              color: (t) => t.palette.text.secondary,
            }}
          >
            <Typography variant="h6">
              Selecciona una sucursal para ver sus camiones.
            </Typography>
          </Box>
        ) : camionesVisibles.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              color: (t) => t.palette.text.secondary,
            }}
          >
            <Typography variant="h6">
              No hay camiones registrados en esta sucursal.
            </Typography>
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
            {camionesVisibles?.map((camion) => (
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
        initialData={initialModalData}
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
