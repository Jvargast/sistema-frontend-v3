import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Chip,
  Avatar,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetInsumoByIdQuery } from "../../store/services/insumoApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { useCrearInventarioSucursalMutation } from "../../store/services/inventarioApi";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useHasPermission } from "../../utils/useHasPermission";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import ModalForm from "../../components/common/ModalForm";
import { Info } from "../../components/productos/Info";
import { getImageUrl } from "../../store/services/apiBase";

const getInvSucursalId = (inv) =>
  inv?.id_sucursal ?? inv?.sucursal?.id_sucursal ?? null;

const getInvSucursalName = (inv) =>
  inv?.nombre_sucursal ?? inv?.sucursal?.nombre ?? null;

const VerInsumo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  const { rol } = useSelector((s) => s.auth);
  const sucursalActiva = useSucursalActiva();
  const canEditInsumo = useHasPermission("inventario.insumo.editar");

  const {
    data: insumoData,
    isLoading,
    isError,
    refetch,
  } = useGetInsumoByIdQuery(id);
  const { data: sucursales } = useGetAllSucursalsQuery();

  const [openInventario, setOpenInventario] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [agregarInventario] = useCrearInventarioSucursalMutation();

  const insumo = insumoData;
  const inventarioPorSucursal = useMemo(() => {
    if (!insumo || !sucursales) return [];

    const invArray = Array.isArray(insumo.inventario)
      ? insumo.inventario
      : insumo.inventario
      ? [insumo.inventario]
      : [];

    // NO admin: solo la sucursal activa
    if (sucursalActiva && !String(rol).includes("administrador")) {
      const inv = invArray.find(
        (i) => getInvSucursalId(i) === sucursalActiva.id_sucursal
      );
      const s = sucursales.find(
        (s) => s.id_sucursal === sucursalActiva.id_sucursal
      );

      return inv && s
        ? [
            {
              id_sucursal: s.id_sucursal,
              nombre: getInvSucursalName(inv) ?? s.nombre,
              cantidad: inv?.cantidad ?? 0,
              fecha: inv?.fecha_actualizacion ?? null,
            },
          ]
        : [];
    }

    // Admin: todas las sucursales
    return sucursales.map((s) => {
      const found = invArray.find((i) => getInvSucursalId(i) === s.id_sucursal);
      return {
        id_sucursal: s.id_sucursal,
        nombre: getInvSucursalName(found) ?? s.nombre,
        cantidad: found?.cantidad ?? 0,
        fecha: found?.fecha_actualizacion ?? null,
      };
    });
  }, [insumo, sucursales, sucursalActiva, rol]);


  const formData = useMemo(() => {
    if (!insumo) return {};
    const {
      id_insumo,
      nombre_insumo,
      codigo_barra,
      descripcion,
      fecha_de_creacion,
      unidad_de_medida,
      activo,
      es_para_venta,
      image_url,
    } = insumo;

    const stockTotal = (
      Array.isArray(insumo.inventario)
        ? insumo.inventario
        : insumo.inventario
        ? [insumo.inventario]
        : []
    ).reduce((acc, i) => acc + (i?.cantidad || 0), 0);

    return {
      id_insumo,
      nombre_insumo,
      codigo_barra: codigo_barra || "No especificado",
      unidad_de_medida: unidad_de_medida || "No especificada",
      descripcion: descripcion || "No disponible",
      fecha_de_creacion,
      activo,
      es_para_venta,
      image_url,
      stockTotal,
    };
  }, [insumo]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/insumos/ver/${id}`, { replace: true });
    }
  }, [location.state, refetch, navigate, id]);

  const handleAgregarInventario = async (data) => {
    try {
      await agregarInventario({
        tipo: "insumo",
        id_elemento: insumo.id_insumo,
        id_sucursal: data.id_sucursal,
        cantidad: Number(data.cantidad),
      }).unwrap();

      setOpenInventario(false);
      dispatch(
        showNotification({
          message: "Inventario agregado",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: "Error al agregar inventario",
          severity: "error",
        })
      );
    }
  };

  console.log(insumoData);

  if (isLoading) return <LoaderComponent />;

  if (isError || !insumo) {
    dispatch(
      showNotification({
        message: "Error al cargar el insumo.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el insumo.</Typography>;
  }

  return (
    <Box m={3}>
      <BackButton to="/insumos" label="Volver" />

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 4,
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              variant="rounded"
              src={
                getImageUrl(insumo.image_url) ||
                "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
              }
              alt={insumo.nombre_insumo}
              sx={{
                width: 72,
                height: 72,
                bgcolor: theme.palette.grey[300],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!insumo.image_url && (
                <ImageNotSupportedIcon
                  sx={{ fontSize: 36, color: theme.palette.grey[700] }}
                />
              )}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight="bold">
                {insumo.nombre_insumo}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                ID #{insumo.id_insumo}
              </Typography>
            </Box>
          </Box>

          {canEditInsumo && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/insumos/editar/${insumo.id_insumo}`)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              Editar Insumo
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Info label="Código de Barra" value={formData.codigo_barra} />
            <Info label="Unidad de Medida" value={formData.unidad_de_medida} />
            <Info label="Fecha de Creación">
              {formData.fecha_de_creacion
                ? new Date(formData.fecha_de_creacion).toLocaleDateString(
                    "es-CL"
                  )
                : "No especificada"}
            </Info>
          </Grid>

          <Grid item xs={12} md={6}>
            <Info label="Stock Total" value={formData.stockTotal ?? 0} />

            <Typography
              variant="subtitle2"
              sx={{
                mt: 2,
                mb: 0.5,
                fontWeight: 600,
                color: theme.palette.text.secondary,
              }}
            >
              Inventario por Sucursal
            </Typography>

            <Box
              component="ul"
              sx={{
                listStyle: "none",
                pl: 0,
                mb: 2,
                borderRadius: 2,
                background:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                boxShadow: theme.shadows[1],
                overflowY: "auto",
              }}
            >
              {inventarioPorSucursal.length > 0 ? (
                inventarioPorSucursal.map((inv) => (
                  <Box
                    component="li"
                    key={inv.id_sucursal}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      px: 2,
                      py: 1,
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        {inv.nombre}
                      </Typography>
                      {canEditInsumo && (
                        <Tooltip title={`Agregar inventario a "${inv.nombre}"`}>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                              setSucursalSeleccionada(inv.id_sucursal);
                              setOpenInventario(true);
                            }}
                          >
                            <AddCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                      minWidth={70}
                    >
                      <Chip
                        label={inv.cantidad === 0 ? "Sin stock" : inv.cantidad}
                        color={
                          inv.cantidad === 0
                            ? "error"
                            : inv.cantidad < 10
                            ? "warning"
                            : "success"
                        }
                        size="small"
                        sx={{ fontWeight: 700, fontSize: 13, mb: 0.2 }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 11 }}
                      >
                        {inv.fecha
                          ? `Actualizado: ${new Date(inv.fecha).toLocaleString(
                              "es-CL"
                            )}`
                          : "Nunca"}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.disabled,
                    mb: 2,
                    px: 2,
                    py: 1,
                  }}
                >
                  {sucursales?.length
                    ? "Sin movimientos."
                    : "No hay sucursales configuradas."}
                </Typography>
              )}
            </Box>

            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={formData.activo ? "Activo" : "Inactivo"}
                color={formData.activo ? "success" : "error"}
              />
              <Chip
                label={formData.es_para_venta ? "Para Venta" : "Uso Interno"}
                color={formData.es_para_venta ? "primary" : "default"}
              />
            </Box>
          </Grid>
        </Grid>

        <Box
          mt={4}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              mb: 1,
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              display: "inline-block",
              pb: 0.5,
            }}
          >
            Descripción
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              whiteSpace: "pre-line",
              color: theme.palette.text.primary,
              lineHeight: 1.6,
            }}
          >
            {formData.descripcion}
          </Typography>
        </Box>
      </Paper>
      {canEditInsumo && (
        <ModalForm
          open={openInventario}
          onClose={() => setOpenInventario(false)}
          onSubmit={handleAgregarInventario}
          title="Agregar inventario"
          fields={[
            {
              name: "id_sucursal",
              label: "Sucursal",
              type: "select",
              required: true,
              options:
                sucursales?.map((s) => ({
                  value: s.id_sucursal,
                  label: s.nombre,
                })) ?? [],
              defaultValue: sucursalSeleccionada,
            },
            {
              name: "cantidad",
              label: "Cantidad a agregar",
              type: "number",
              required: true,
              min: 1,
            },
          ]}
          isLoading={false}
        />
      )}
    </Box>
  );
};

export default VerInsumo;
