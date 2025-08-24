import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  useGetInsumoByIdQuery,
  useUpdateInsumoMutation,
} from "../../store/services/insumoApi";
import { useGetAllTiposQuery } from "../../store/services/tipoInsumoApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { useCrearInventarioSucursalMutation } from "../../store/services/inventarioApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Edition from "../../components/insumos/Edition";
import ModalForm from "../../components/common/ModalForm";
import LoaderComponent from "../../components/common/LoaderComponent";

const EditarInsumo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isError, refetch } = useGetInsumoByIdQuery(id);
  const { data: tipos, isLoading: isLoadingTipos } = useGetAllTiposQuery();
  const { data: sucursales } = useGetAllSucursalsQuery();

  const [updateInsumo, { isLoading: isUpdating }] = useUpdateInsumoMutation();
  const [agregarInventario] = useCrearInventarioSucursalMutation();

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [openInventario, setOpenInventario] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

  const invArray = useMemo(() => {
    if (!data?.inventario) return [];
    const arr = Array.isArray(data.inventario)
      ? data.inventario
      : [data.inventario];
    return arr.map((i) => ({
      id_sucursal: i.id_sucursal ?? i.sucursal?.id_sucursal,
      nombre: i.sucursal?.nombre ?? i.nombre_sucursal ?? "Sucursal",
      cantidad: i.cantidad ?? 0,
      fecha: i.fecha_actualizacion ?? null,
    }));
  }, [data]);

  const inventarioPorSucursal = useMemo(() => {
    if (!sucursales) return invArray;
    return sucursales.map((s) => {
      const found = invArray.find((x) => x.id_sucursal === s.id_sucursal);
      return {
        id_sucursal: s.id_sucursal,
        nombre: s.nombre,
        cantidad: found?.cantidad ?? 0,
        fecha: found?.fecha ?? null,
      };
    });
  }, [invArray, sucursales]);

  const stockTotal = useMemo(
    () => inventarioPorSucursal.reduce((acc, x) => acc + (x.cantidad || 0), 0),
    [inventarioPorSucursal]
  );

  useEffect(() => {
    if (data) {
      setFormData({
        nombre_insumo: data.nombre_insumo || "",
        descripcion: data.descripcion || "",
        codigo_barra: data.codigo_barra || "",
        id_tipo_insumo:
          data.tipo_insumo?.id_tipo_insumo ?? data.id_tipo_insumo ?? "",
        es_para_venta: Boolean(data.es_para_venta),
        precio: data.precio ?? 0,
        unidad_de_medida: data.unidad_de_medida || "",
        image_url: data.image_url || "",
      });
      setImagePreview(data.image_url || "");
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "image_url") {
      setImagePreview(value || "");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "", imageFile: undefined }));
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new window.FormData();
      fd.append("nombre_insumo", formData.nombre_insumo);
      fd.append("descripcion", formData.descripcion ?? "");
      if (formData.codigo_barra)
        fd.append("codigo_barra", formData.codigo_barra ?? "");
      fd.append("id_tipo_insumo", String(formData.id_tipo_insumo));
      fd.append("es_para_venta", String(!!formData.es_para_venta));
      fd.append("precio", String(formData.precio ?? 0));
      fd.append("unidad_de_medida", formData.unidad_de_medida ?? "");

      if (formData.imageFile) {
        fd.append("image", formData.imageFile);
      } else if (formData.image_url) {
        fd.append("image_url", formData.image_url);
      }

      console.log(formData)

      await updateInsumo({ id, data: fd }).unwrap();
      dispatch(
        showNotification({
          message: "Insumo actualizado correctamente.",
          severity: "success",
        })
      );
      await refetch();
      navigate("/insumos", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar insumo: ${
            error?.data?.error || error?.message
          }`,
          severity: "error",
        })
      );
    }
  };

  const handleAgregarInventario = async (dataForm) => {
    try {
      await agregarInventario({
        tipo: "insumo",
        id_elemento: Number(id),
        id_sucursal: dataForm.id_sucursal,
        cantidad: Number(dataForm.cantidad),
      }).unwrap();

      dispatch(
        showNotification({
          message: "Inventario agregado exitosamente.",
          severity: "success",
        })
      );
      setOpenInventario(false);
      await refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al agregar inventario: ${
            error?.data?.error || error?.message
          }`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading || isLoadingTipos) return <LoaderComponent />;

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <Typography variant="h6" color="error">
          Error al cargar el insumo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 3 }}>
      <Edition
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        setFormData={setFormData}
        tipos={tipos || []}
        navigate={navigate}
        isUpdating={isUpdating}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        onRemoveImage={handleRemoveImage}
      />

      <Divider sx={{ mt: 4, mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        Inventario por Sucursal
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Stock total: <b>{stockTotal}</b>
      </Typography>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          p: 0,
          borderRadius: 2,
          background: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          boxShadow: 1,
        }}
      >
        {(inventarioPorSucursal || []).map((inv) => (
          <Box
            key={inv.id_sucursal}
            component="li"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ fontWeight: 500 }}>{inv.nombre}</Typography>
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
                  ? `Actualizado: ${new Date(inv.fecha).toLocaleString(
                      "es-CL"
                    )}`
                  : "Nunca"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

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
    </Box>
  );
};

export default EditarInsumo;
