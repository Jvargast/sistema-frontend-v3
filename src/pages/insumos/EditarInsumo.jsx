import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetInsumoByIdQuery,
  useUpdateInsumoMutation,
} from "../../store/services/insumoApi";
import { useGetAllTiposQuery } from "../../store/services/tipoInsumoApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Edition from "../../components/insumos/Edition";

const EditarInsumo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetInsumoByIdQuery(id);

  const { data: tipos, isLoading: isLoadingTipos } = useGetAllTiposQuery();

  const [updateInsumo, { isLoading: isUpdating }] = useUpdateInsumoMutation();

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(
    "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
  );

  useEffect(() => {
    if (data) {
      setFormData({
        nombre_insumo: data.nombre_insumo || "",
        descripcion: data.descripcion || "",
        codigo_barra: data.codigo_barra || "",
        id_tipo_insumo: data.tipo_insumo?.id_tipo_insumo || "",
        es_para_venta: data.es_para_venta || false,
        precio: data.precio || 0,
        unidad_de_medida: data.unidad_de_medida || "",
        stock: data.inventario?.cantidad || 0,
        image_url:
          data.image_url ||
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg",
      });
      setImagePreview(
        data.image_url ||
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
      );
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "image_url") {
      setImagePreview(
        (type === "checkbox" ? checked : value) ||
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.codigo_barra || formData.codigo_barra.trim() === "") {
        delete formData.codigo_barra;
      }
      const payload = {
        ...formData,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
      };

      await updateInsumo({ id, ...payload }).unwrap();
      dispatch(
        showNotification({
          message: "Insumo actualizado correctamente.",
          severity: "success",
        })
      );
      navigate("/insumos");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar insumo: ${
            error.data?.error || error.message
          }`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading || isLoadingTipos) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error al cargar el insumo.
        </Typography>
      </Box>
    );
  }

  return (
    <Edition
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={formData}
      setFormData={setFormData}
      tipos={tipos}
      navigate={navigate}
      isUpdating={isUpdating}
      imagePreview={imagePreview}
    />
  );
};

export default EditarInsumo;
