import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetProductoByIdQuery,
  useUpdateProductoMutation,
} from "../../store/services/productoApi";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { data, isLoading, isError, refetch } = useGetProductoByIdQuery(id);
  const { data: categorias, isLoading: isLoadingCategorias } =
    useGetAllCategoriasQuery();
  const [updateProducto, { isLoading: isUpdating }] =
    useUpdateProductoMutation();

  const [formData, setFormData] = useState({
    nombre_producto: "",
    marca: "",
    codigo_barra: "",
    precio: 0,
    descripcion: "",
    id_categoria: "",
    id_estado_producto: "",
    stock: 0,
    image_url: "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg",
    es_para_venta: true, 
    activo: true, 
    es_retornable: false, 
  });
  const [imagePreview, setImagePreview] = useState(
    "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
  );

  const categoriaOptions = categorias
    ? categorias.map((categoria) => ({
        value: categoria.id_categoria,
        label: categoria.nombre_categoria,
      }))
    : [];

  useEffect(() => {
    if (data) {
      setFormData({
        nombre_producto: data.nombre_producto,
        marca: data.marca,
        codigo_barra: data.codigo_barra,
        precio: data.precio,
        descripcion: data.descripcion,
        id_categoria: data.id_categoria,
        id_estado_producto: data.id_estado_producto,
        stock: data.inventario?.cantidad || 0,
        image_url: data.image_url || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg",
        es_para_venta: data.es_para_venta || false,
        activo: data.activo || false,
        es_retornable: data.es_retornable || false,
      });
      setImagePreview(data.image_url || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg");
    }
  }, [data]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/productos/editar/${id}`, { replace: true }); // Limpia el estado
    } else {
      refetch(); // Siempre refresca al cargar
    }
  }, [location.state, refetch, navigate, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({ ...prevData,  [name]: type === "checkbox" ? checked : value,  }));
    if (name === "image_url") {
      setImagePreview(value || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProducto({ id, ...formData }).unwrap();
      dispatch(
        showNotification({
          message: "Producto actualizado correctamente.",
          severity: "success",
        })
      );
      refetch();
      navigate("/productos", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar producto: ${error.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const renderTextField = (
    label,
    name,
    type = "text",
    multiline = false,
    rows = 1
  ) => (
    <div className="w-full">
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        value={formData[name] || ""}
        onChange={handleChange}
        multiline={multiline}
        rows={rows}
        required
        variant="outlined"
        className="bg-white shadow-md rounded-lg text-lg"
        aria-label={label}
      />
    </div>
  );

  const renderSwitchField = (label, name) => (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(formData[name])}
          onChange={handleChange}
          name={name}
          color="primary"
        />
      }
      label={label}
    />
  );

  const renderSelectField = (label, name, options) => (
    <div className="w-full">
      <FormControl
        fullWidth
        variant="outlined"
        className="bg-white shadow-md rounded-lg text-lg"
      >
        <InputLabel>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          label={label}
          required
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );

  if (isLoading || isLoadingCategorias) {
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
          Error al cargar el producto.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Imagen del Producto */}
      <div className="lg:col-span-1 flex justify-center items-center">
        <div className="w-full h-96 bg-gray-100 shadow-md rounded-lg flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Vista Previa"
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Formulario del Producto */}
      <div className="lg:col-span-2">
        <Typography
          variant="h3"
          className="text-gray-800 font-bold text-left mb-6 text-3xl"
        >
          Editar Producto
        </Typography>

        <Divider className="mb-6" />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Información General
          </Typography>
          {renderTextField("Nombre del Producto", "nombre_producto")}
          {renderTextField("Marca", "marca")}
          {renderTextField("Código de Barra", "codigo_barra")}
          {renderTextField("Descripción", "descripcion", "text", true, 4)}
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Detalles del Producto
          </Typography>
          {renderTextField("Precio", "precio", "number")}
          {renderTextField("Stock Disponible", "stock", "number")}
          {renderSelectField("Categoría", "id_categoria", categoriaOptions)}
          {renderSelectField("Estado", "id_estado_producto", [
            { value: 1, label: "Disponible - Bodega" },
            { value: 2, label: "En tránsito" },
          ])}
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Opciones de Producto
          </Typography>
          {renderSwitchField("¿Es para venta?", "es_para_venta")}
          {renderSwitchField("¿Está activo?", "activo")}
          {renderSwitchField("¿Es retornable?", "es_retornable")} 
          <Typography
            variant="h5"
            className="text-gray-700 font-semibold col-span-full"
          >
            Imagen del Producto
          </Typography>
          <div className="w-full col-span-full">
            {renderTextField("URL de la Imagen", "image_url")}
          </div>
          <div className="flex justify-end col-span-full space-x-4 mt-4">
            <Button variant="outlined" onClick={() => navigate("/productos")}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit" disabled={isUpdating}>
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProducto;
