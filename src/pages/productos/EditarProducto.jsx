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
  useTheme,
  Grid,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetProductoByIdQuery,
  useUpdateProductoMutation,
} from "../../store/services/productoApi";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useIsMobile } from "../../utils/useIsMobile";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useIsMobile();

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
    image_url:
      "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg",
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
        image_url:
          data.image_url ||
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg",
        es_para_venta: data.es_para_venta || false,
        activo: data.activo || false,
        es_retornable: data.es_retornable || false,
      });
      setImagePreview(
        data.image_url ||
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
      );
    }
  }, [data]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/productos/editar/${id}`, { replace: true });
    } else {
      refetch();
    }
  }, [location.state, refetch, navigate, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "image_url") {
      setImagePreview(
        value ||
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
      );
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
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={formData[name] || ""}
      onChange={handleChange}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : theme.palette.background.default,
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}33`, // sutil halo al enfocar
          },
          transition: "border-color 0.3s, box-shadow 0.3s",
        },
        "& input, & textarea": {
          padding: "12px",
        },
      }}
      aria-label={label}
    />
  );

  const renderSwitchField = (label, name) => (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(formData[name])}
          onChange={handleChange}
          name={name}
          color="primary"
          sx={{
            "& .MuiSwitch-thumb": {
              boxShadow: (theme) => theme.shadows[2],
            },
          }}
        />
      }
      label={label}
      sx={{ mb: 2 }}
    />
  );

  const renderSelectField = (label, name, options) => (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        mb: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[1],
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          transition: "box-shadow 0.3s",
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: (theme) => theme.shadows[4],
          },
        },
      }}
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
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        py: 4,
        px: 3,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          height: "350px",
          p: isMobile ? 2 : 0,
          gap: isMobile ? 2 : 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imagePreview &&
        imagePreview !==
          "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg" ? (
          <a
            href={imagePreview}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", width: "100%" }}
            tabIndex={-1}
          >
            <img
              src={imagePreview}
              alt="Vista Previa"
              style={{
                maxHeight: "220px",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "12px",
                display: "block",
                margin: "0 auto",
                transition: "box-shadow 0.3s",
                boxShadow: "0 2px 16px 0 #0001",
                cursor: "pointer",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
              }}
            />
          </a>
        ) : (
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: "0 2px 12px 0 #0002",
            }}
          >
            <ImageOutlinedIcon
              sx={{ fontSize: 64, color: theme.palette.grey[400] }}
            />
          </Box>
        )}
        {isMobile && (
          <TextField
            fullWidth
            label="URL de la Imagen"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        )}
      </Box>
      <Box>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.text.primary, fontWeight: "bold", mb: 2 }}
        >
          Editar Producto
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Información General
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTextField("Nombre del Producto", "nombre_producto")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTextField("Marca", "marca")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTextField("Código de Barra", "codigo_barra")}
            </Grid>
            <Grid item xs={12}>
              {renderTextField("Descripción", "descripcion", "text", true, 4)}
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Detalles del Producto
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTextField("Precio", "precio", "number")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTextField("Stock Disponible", "stock", "number")}
            </Grid>

            <Grid item xs={12} md={6}>
              {renderSelectField("Categoría", "id_categoria", categoriaOptions)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderSelectField("Estado", "id_estado_producto", [
                { value: 1, label: "Disponible - Bodega" },
                { value: 2, label: "En tránsito" },
              ])}
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Opciones de Producto
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderSwitchField("¿Es para venta?", "es_para_venta")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderSwitchField("¿Está activo?", "activo")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderSwitchField("¿Es retornable?", "es_retornable")}
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Imagen del Producto
          </Typography>
          {!isMobile && renderTextField("URL de la Imagen", "image_url")}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/productos")}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={isUpdating}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditarProducto;
