import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Autocomplete,
  Chip,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  useGetClienteByIdQuery,
  useUpdateClienteMutation,
} from "../../store/services/clientesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import InfoFieldGroup from "../../components/common/InfoFieldGroup";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";

const CHIP_COLOR_KEYS = ["primary", "secondary", "success", "warning", "info"];
const hashStr = (s) =>
  Array.from(String(s)).reduce((a, c) => a + c.charCodeAt(0), 0);

const getChipColorKey = (sucursal) => {
  const base = sucursal?.nombre ?? sucursal?.id_sucursal ?? "";
  const h = hashStr(base);
  return CHIP_COLOR_KEYS[h % CHIP_COLOR_KEYS.length];
};

const EditarCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: clienteData,
    isLoading,
    isError,
    refetch,
  } = useGetClienteByIdQuery(id);
  const [updateCliente, { isLoading: isUpdating }] = useUpdateClienteMutation();

  const { data: sucursales = [] } = useGetAllSucursalsQuery();
  const [sucursalesSel, setSucursalesSel] = useState([]);

  const [formData, setFormData] = useState({
    rut: "",
    tipo_cliente: "",
    razon_social: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "+56 ",
    email: "",
    activo: true,
  });

  useEffect(() => {
    if (clienteData) {
      setFormData({
        rut: clienteData?.rut || "",
        tipo_cliente: clienteData.tipo_cliente || "",
        razon_social: clienteData?.razon_social || "",
        nombre: clienteData?.nombre || "",
        apellido: clienteData?.apellido || "",
        direccion: clienteData?.direccion || "",
        telefono: clienteData?.telefono || "",
        email: clienteData?.email || "",
        activo: clienteData?.activo,
      });
      setSucursalesSel(clienteData?.Sucursales ?? []);
    }
  }, [clienteData]);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate(`/clientes/editar/${id}`, { replace: true });
    } else {
      refetch();
    }
  }, [location.state, refetch, navigate, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        sucursalesIds: (sucursalesSel || []).map((s) => Number(s.id_sucursal)),
      };
      await updateCliente({ id, formData: payload }).unwrap();
      dispatch(
        showNotification({
          message: "Cliente actualizado exitosamente.",
          severity: "success",
        })
      );
      navigate("/clientes");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar el cliente: ${
            error?.data?.error || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: "Error al cargar el cliente.",
        severity: "error",
      })
    );
    return <Typography color="error">Error al cargar el cliente.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        borderRadius: 3,
        p: { xs: 1, sm: 3 },
        maxWidth: 950,
        margin: "0 auto",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, gap: 2 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          sx={{ letterSpacing: 0.3 }}
        >
          Editar Cliente
        </Typography>
      </Box>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ letterSpacing: 0.2 }}
          >
            Información del Cliente
          </Typography>
        </Box>
        <Divider sx={{ mb: { xs: 2, sm: 3 } }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <InfoFieldGroup
            fields={[
              {
                label: "RUT",
                name: "rut",
                value: formData.rut,
                onChange: handleInputChange,
                disabled: false,
              },
              {
                label: "Nombre",
                name: "nombre",
                value: formData.nombre,
                onChange: handleInputChange,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                value: formData.email,
                onChange: handleInputChange,
              },
              {
                label: "Estado",
                name: "activo",
                type: "select",
                value: formData.activo ?? true,
                onChange: handleInputChange,
                options: [
                  { value: true, label: "Activo" },
                  { value: false, label: "Inactivo" },
                ],
              },
            ]}
          />
          <InfoFieldGroup
            fields={[
              {
                label: "Teléfono",
                name: "telefono",
                value: formData.telefono,
                onChange: handleInputChange,
              },
              {
                label: "Dirección",
                name: "direccion",
                value: formData.direccion,
                onChange: handleInputChange,
              },
              {
                label: "Tipo de Cliente",
                name: "tipo_cliente",
                type: "select",
                value: formData.tipo_cliente,
                onChange: handleInputChange,
                options: [
                  { value: "persona", label: "Persona" },
                  { value: "empresa", label: "Empresa" },
                ],
              },
              ...(formData.tipo_cliente === "empresa"
                ? [
                    {
                      label: "Razón Social",
                      name: "razon_social",
                      value: formData.razon_social,
                      onChange: handleInputChange,
                    },
                  ]
                : []),
            ]}
          />
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Autocomplete
              multiple
              options={sucursales}
              value={sucursalesSel}
              onChange={(_, val) => setSucursalesSel(val)}
              isOptionEqualToValue={(opt, val) =>
                Number(opt.id_sucursal) === Number(val.id_sucursal)
              }
              getOptionLabel={(opt) =>
                opt?.nombre ?? `Sucursal ${opt?.id_sucursal}`
              }
              filterSelectedOptions
              disableCloseOnSelect
              clearOnBlur={false}
              handleHomeEndKeys
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: (t) => t.palette.background.paper,
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 600,
                },
                "& .MuiAutocomplete-endAdornment .MuiButtonBase-root": {
                  color: "text.secondary",
                },
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const colorKey = getChipColorKey(option);
                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id_sucursal}
                      label={option.nombre ?? `Sucursal ${option.id_sucursal}`}
                      size="small"
                      color={colorKey}
                      variant="filled"
                      sx={{ fontWeight: 700 }}
                    />
                  );
                })
              }
              renderOption={(props, option) => {
                const colorKey = getChipColorKey(option);
                // eslint-disable-next-line react/prop-types
                const { key, ...liProps } = props;
                return (
                  <li key={key} {...liProps}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: (t) => t.palette[colorKey].main,
                        mr: 1,
                        flex: "0 0 auto",
                      }}
                    />
                    {option.nombre ?? `Sucursal ${option.id_sucursal}`}
                  </li>
                );
              }}
              slotProps={{
                paper: {
                  elevation: 6,
                  sx: { borderRadius: 2, overflow: "hidden" },
                },
                listbox: {
                  sx: {
                    "& li": { py: 1 },
                  },
                },
                popper: {
                  sx: { zIndex: (t) => t.zIndex.modal + 1 },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sucursales"
                  placeholder="Agregar sucursal..."
                  size="small"
                />
              )}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: { xs: 3, sm: 4 },
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/clientes")}
            sx={{
              height: "3rem",
              minWidth: "130px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              borderColor: (theme) => theme.palette.grey[400],
              color: (theme) => theme.palette.text.secondary,
              "&:hover": {
                borderColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.main,
                background: (theme) => theme.palette.primary.light + "11",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isUpdating}
            sx={{
              height: "3rem",
              minWidth: "150px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              background: (theme) => theme.palette.primary.main,
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarCliente;
