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
  IconButton,
  createFilterOptions,
  Autocomplete,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetProductoByIdQuery,
  useUpdateProductoMutation,
} from "../../store/services/productoApi";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { getImageUrl } from "../../store/services/apiBase";
import { useGetAllInsumosQuery } from "../../store/services/insumoApi";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { data, isLoading, isError, refetch } = useGetProductoByIdQuery(id);
  const { data: insumosResp, isLoading: loadingInsumos } =
    useGetAllInsumosQuery(
      { page: 1, limit: 500, activo: true },
      { refetchOnMountOrArgChange: true }
    );
  const { data: categorias, isLoading: isLoadingCategorias } =
    useGetAllCategoriasQuery();
  const [updateProducto, { isLoading: isUpdating }] =
    useUpdateProductoMutation();

  const insumos = Array.isArray(insumosResp?.data?.items)
    ? insumosResp.data.items
    : Array.isArray(insumosResp?.data)
    ? insumosResp.data
    : Array.isArray(insumosResp)
    ? insumosResp
    : [];

  const rawOptions = insumos.map((i) => ({
    id: Number(i.id_insumo),
    label: `${i.nombre_insumo}${
      i.unidad_de_medida ? ` (${i.unidad_de_medida})` : ""
    }`,
    grupo: (i?.tipo_insumo?.nombre_tipo || "Otros").trim(),
    inventario: Array.isArray(i.inventario) ? i.inventario : [],
    codigo_barra: i.codigo_barra || "",
  }));

  const insumoOptions = [...rawOptions].sort(
    (a, b) => a.grupo.localeCompare(b.grupo) || a.label.localeCompare(b.label)
  );

  const baseFilter = createFilterOptions({
    stringify: (opt) => `${opt.label} ${opt.codigo_barra}`.toLowerCase(),
  });
  const filterOptions = (opts, state) => {
    const res = baseFilter(opts, state);
    res.sort(
      (a, b) => a.grupo.localeCompare(b.grupo) || a.label.localeCompare(b.label)
    );
    return res;
  };

  const [formData, setFormData] = useState({
    nombre_producto: "",
    marca: "",
    codigo_barra: "",
    precio: 0,
    descripcion: "",
    id_categoria: "",
    id_estado_producto: "",
    image_url: "",
    es_para_venta: true,
    activo: true,
    es_retornable: false,
    id_insumo_retorno: "",
  });
  const selectedInsumo =
    insumoOptions.find(
      (o) => o.id === Number(formData.id_insumo_retorno || 0)
    ) || null;
  const [imagePreview, setImagePreview] = useState("");

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
        image_url: data.image_url || "",
        es_para_venta: data.es_para_venta || false,
        activo: data.activo || false,
        es_retornable: data.es_retornable || false,
        id_insumo_retorno: data.id_insumo_retorno || "",
      });
      setImagePreview(data.image_url || "");
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

  useEffect(() => {
    if (
      formData.es_retornable &&
      !formData.id_insumo_retorno &&
      insumoOptions.length
    ) {
      const match = insumoOptions.find((o) => /botellón|envase/i.test(o.label));
      if (match)
        setFormData((p) => ({ ...p, id_insumo_retorno: Number(match.id) }));
    }
  }, [formData.es_retornable, formData.id_insumo_retorno, insumoOptions]);

  const idRet =
    formData.es_retornable && formData.id_insumo_retorno !== ""
      ? String(Number(formData.id_insumo_retorno))
      : "";

  /**
   * Carga de archivo
   */
  const maxSize = 5 * 1024 * 1024;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    /*  acceptedFiles, */
    fileRejections,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        setFormData((prev) => ({ ...prev, imageFile: acceptedFiles[0] }));
        setImagePreview(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  const fileError = fileRejections.length > 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "es_retornable" && !checked) {
        next.id_insumo_retorno = "";
      }
      return next;
    });
    if (name === "image_url") {
      setImagePreview(value || "");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: "",
      imageFile: undefined,
    }));
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new window.FormData();
    fd.append("nombre_producto", formData.nombre_producto);
    fd.append("marca", formData.marca);
    fd.append("codigo_barra", formData.codigo_barra);
    fd.append("precio", String(formData.precio));
    fd.append("descripcion", formData.descripcion);
    fd.append("id_categoria", String(formData.id_categoria));
    fd.append("id_estado_producto", String(formData.id_estado_producto));
    fd.append("es_para_venta", String(formData.es_para_venta));
    fd.append("activo", String(formData.activo));
    fd.append("es_retornable", String(formData.es_retornable));
    fd.append("id_insumo_retorno", idRet);

    if (formData.imageFile) {
      fd.append("image", formData.imageFile);
    } else if (formData.image_url) {
      fd.append("image_url", formData.image_url);
    }

    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      console.log(fd);
      await updateProducto({ id, data: fd }).unwrap();
      dispatch(
        showNotification({
          message: "Producto actualizado correctamente.",
          severity: "success",
        })
      );
      refetch();
      navigate("/productos", { state: { refetch: true } });
    } catch (error) {
      console.log(error);
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
        mb: 4,
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
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}33`,
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
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
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
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                Información General
              </Typography>

              {renderTextField("Nombre del Producto", "nombre_producto")}
              {renderTextField("Marca", "marca")}
              {renderTextField("Código de Barra", "codigo_barra")}
              {renderTextField("Descripción", "descripcion", "text", true, 4)}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                Imagen del Producto
              </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: fileError ? "error.main" : "grey.400",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  background: isDragActive ? "grey.100" : "background.paper",
                  cursor: "pointer",
                  mb: 2,
                  outline: "none",
                  transition: "border .24s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 120,
                }}
              >
                <input {...getInputProps()} />
                <ImageOutlinedIcon
                  sx={{ fontSize: 40, color: "grey.400", mb: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {isDragActive
                    ? "Suelta aquí tu imagen..."
                    : "Arrastra una imagen aquí, o haz clic para buscar en tu dispositivo"}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Solo archivos .jpg, .jpeg, .png. Máx. 5MB.
                </Typography>
                {fileError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Archivo no permitido o demasiado grande.
                  </Typography>
                )}
              </Box>
              {imagePreview ? (
                <Box
                  sx={{
                    mt: 1,
                    width: "100%",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "light"
                        ? theme.palette.grey[50]
                        : theme.palette.grey[900],
                    boxShadow: theme.shadows[1],
                    p: 1,
                    position: "relative",
                  }}
                >
                  <img
                    src={getImageUrl(imagePreview)}
                    alt="Vista previa"
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      maxHeight: 220,
                      objectFit: "contain",
                      borderRadius: 12,
                      boxShadow: "0 2px 16px 0 #0001",
                      background: "#f6f8fa",
                      margin: "0 auto",
                      transition: "box-shadow 0.3s",
                    }}
                  />
                  {formData.imageFile && (
                    <IconButton
                      onClick={handleRemoveImage}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "#fff",
                        boxShadow: 1,
                        "&:hover": { background: theme.palette.error.light },
                        zIndex: 10,
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" color="error" />
                    </IconButton>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      width: "100%",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "text.secondary",
                      fontSize: 13,
                    }}
                    noWrap
                  >
                    {formData.imageFile
                      ? formData.imageFile.name
                      : "Imagen actual"}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    mt: 1,
                    width: "100%",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "light"
                        ? theme.palette.grey[50]
                        : theme.palette.grey[900],
                    boxShadow: theme.shadows[1],
                    p: 1,
                  }}
                >
                  <ImageOutlinedIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.grey[400],
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "text.disabled", fontStyle: "italic" }}
                  >
                    Sin imagen seleccionada
                  </Typography>
                </Box>
              )}
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
            {formData.es_retornable && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={insumoOptions}
                  groupBy={(opt) => opt.grupo}
                  getOptionLabel={(opt) => opt.label}
                  value={selectedInsumo}
                  onChange={(_, newVal) =>
                    setFormData((prev) => ({
                      ...prev,
                      id_insumo_retorno: newVal ? Number(newVal.id) : "",
                    }))
                  }
                  filterOptions={filterOptions}
                  loading={loadingInsumos}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  renderOption={(props, option) => {
                    const stockTotal = option.inventario.reduce(
                      (acc, it) => acc + (Number(it.cantidad) || 0),
                      0
                    );
                    return (
                      <li {...props} key={option.id}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography fontWeight={600}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            Stock total: {stockTotal}
                            {option.codigo_barra
                              ? ` • Código: ${option.codigo_barra}`
                              : ""}
                          </Typography>
                        </Box>
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Insumo destino (envase vacío)"
                      required={formData.es_retornable}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingInsumos ? (
                              <CircularProgress size={18} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      placeholder="Buscar por nombre o código"
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
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
