import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { format } from "date-fns";
import { getImageUrl } from "../../store/services/apiBase";
import { es } from "date-fns/locale";
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
import { useDispatch } from "react-redux";
import { useGetProductoByIdQuery } from "../../store/services/productoApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import { showNotification } from "../../store/reducers/notificacionSlice";
import BackButton from "../../components/common/BackButton";
import { Info } from "../../components/productos/Info";
import ModalForm from "../../components/common/ModalForm";
import { useCrearInventarioSucursalMutation } from "../../store/services/inventarioApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useSelector } from "react-redux";
import { useHasPermission } from "../../utils/useHasPermission";

const VerProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const sucursalActiva = useSucursalActiva();
  const { rol } = useSelector((state) => state.auth);

  const canEditProducto = useHasPermission("inventario.producto.editar");

  const {
    data: productoData,
    isLoading,
    isError,
    refetch,
  } = useGetProductoByIdQuery(id);

  const [openInventario, setOpenInventario] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

  const [agregarInventarioMutation] = useCrearInventarioSucursalMutation();
  const { data: sucursales } = useGetAllSucursalsQuery();

  const inventarioPorSucursal = useMemo(() => {
    if (!productoData || !productoData.inventario || !sucursales) return [];

    if (sucursalActiva && !rol?.includes("administrador")) {
      const inv = productoData.inventario.find(
        (inv) => inv.id_sucursal === sucursalActiva.id_sucursal
      );

      const s = sucursales.find(
        (s) => s.id_sucursal === sucursalActiva.id_sucursal
      );

      return inv
        ? [
            {
              id_sucursal: s?.id_sucursal,
              nombre: s?.nombre,
              cantidad: inv.cantidad,
              fecha: inv.fecha_actualizacion,
            },
          ]
        : [];
    }

    return sucursales.map((s) => {
      const found = productoData.inventario.find(
        (inv) => inv.id_sucursal === s.id_sucursal
      );
      return {
        id_sucursal: s.id_sucursal,
        nombre: s.nombre,
        cantidad: found ? found.cantidad : 0,
        fecha: found ? found.fecha_actualizacion : null,
      };
    });
  }, [productoData, sucursales, sucursalActiva, rol]);

  const handleAgregarInventario = async (data) => {
    try {
      await agregarInventarioMutation({
        tipo: "producto",
        id_elemento: productoData.id_producto,
        id_sucursal: data.id_sucursal,
        cantidad: Number(data.cantidad),
      }).unwrap();
      setOpenInventario(false);
      dispatch(
        showNotification({
          message: "Inventario agregado exitosamente",
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

  const formData = useMemo(() => {
    if (!productoData) return {};

    const {
      id_producto,
      nombre_producto,
      marca,
      codigo_barra,
      precio,
      descripcion,
      fecha_de_creacion,
      tipo,
      activo,
      categoria,
      estadoProducto,
      inventario,
      image_url,
      es_para_venta,
      es_retornable,
      id_insumo_retorno,
      insumo_retorno,
    } = productoData;

    const insumoRetObj = insumo_retorno || null;
    const insumoRetUI = !es_retornable
      ? null
      : insumoRetObj
      ? {
          id: insumoRetObj.id_insumo,
          label:
            insumoRetObj.nombre_insumo +
            (insumoRetObj.unidad_de_medida
              ? ` (${insumoRetObj.unidad_de_medida})`
              : ""),
          codigo_barra: insumoRetObj.codigo_barra || null,
          image_url: insumoRetObj.image_url || null,
        }
      : id_insumo_retorno
      ? {
          id: id_insumo_retorno,
          label: `ID ${id_insumo_retorno}`,
          codigo_barra: null,
          image_url: null,
        }
      : null;

    return {
      id_producto,
      nombre_producto,
      marca: marca || "No especificada",
      codigo_barra: codigo_barra || "No especificado",
      precio:
        precio !== null
          ? `$ ${Number(precio).toLocaleString("es-CL")}`
          : "No especificado",
      descripcion: descripcion || "No disponible",
      fecha_de_creacion,
      tipo,
      activo,
      categoria: categoria?.nombre_categoria || "No especificada",
      estado: estadoProducto?.nombre_estado || "No especificado",
      inventario_actualizado: inventario?.fecha_actualizacion ?? null,
      image_url,
      es_para_venta,
      es_retornable,
      id_insumo_retorno: id_insumo_retorno ?? null,
      insumo_retorno_ui: insumoRetUI,
    };
  }, [productoData]);

  console.log("FORMDATA", productoData);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/productos/ver/${id}`, { replace: true });
    }
  }, [location.state, refetch, navigate, id]);

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el producto.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el producto.</Typography>;
  }

  return (
    <Box m={3}>
      <BackButton to="/productos" label="Volver" />

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 4,
        }}
      >
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
                getImageUrl(formData.image_url) ||
                "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
              }
              alt={formData.nombre_producto}
              sx={{
                width: 72,
                height: 72,
                bgcolor: theme.palette.grey[300],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!formData.image_url && (
                <ImageNotSupportedIcon
                  sx={{ fontSize: 36, color: theme.palette.grey[700] }}
                />
              )}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight="bold">
                {formData.nombre_producto}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                ID #{formData.id_producto}
              </Typography>
            </Box>
          </Box>

          {canEditProducto && (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/productos/editar/${formData.id_producto}`)
              }
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              Editar Producto
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Info label="Marca" value={formData.marca} />
            <Info label="Código de Barra" value={formData.codigo_barra} />
            <Info label="Precio" value={formData.precio} />
            <Info label="Tipo" value={formData.tipo} />
            <Info label="Fecha de Creación">
              {formData.fecha_de_creacion
                ? format(new Date(formData.fecha_de_creacion), "dd-MM-yyyy", {
                    locale: es,
                  })
                : "No especificada"}
            </Info>
          </Grid>

          <Grid item xs={12} md={6}>
            <Info label="Categoría" value={formData.categoria} />
            <Info label="Estado" value={formData.estado} />
            <Info
              label="Stock Total"
              value={
                Array.isArray(productoData.inventario)
                  ? productoData.inventario.reduce(
                      (acc, inv) => acc + (inv.cantidad || 0),
                      0
                    )
                  : 0
              }
            />

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
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        {inv.nombre}
                      </Typography>
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
                          ? `Actualizado: ${format(
                              new Date(inv.fecha),
                              "dd-MM-yyyy HH:mm",
                              {
                                locale: es,
                              }
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
                  No hay sucursales configuradas.
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
              <Chip
                label={formData.es_retornable ? "Retornable" : "No Retornable"}
                color={formData.es_retornable ? "secondary" : "default"}
              />
            </Box>
            {formData.es_retornable && (
              <Box mt={2}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Insumo retorno asociado
                </Typography>

                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  {formData.insumo_retorno_ui ? (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        variant="rounded"
                        src={getImageUrl(formData.insumo_retorno_ui.image_url)}
                        sx={{ width: 36, height: 36 }}
                      >
                        {formData.insumo_retorno_ui.label?.charAt(0) || "I"}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {formData.insumo_retorno_ui.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.7 }}
                          noWrap
                        >
                          {`ID ${formData.insumo_retorno_ui.id}`}
                          {formData.insumo_retorno_ui.codigo_barra
                            ? ` • Código: ${formData.insumo_retorno_ui.codigo_barra}`
                            : ""}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No configurado
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
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
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              mb: 1,
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              display: "inline-block",
              paddingBottom: 0.5,
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
              textAlign: "justify",
            }}
          >
            {formData.descripcion}
          </Typography>
        </Box>
      </Paper>
      <ModalForm
        open={openInventario}
        onClose={() => setOpenInventario(false)}
        onSubmit={handleAgregarInventario}
        title={`Agregar inventario`}
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
              })) || [],
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
    </Box>
  );
};

export default VerProducto;
