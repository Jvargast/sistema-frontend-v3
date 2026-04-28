import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Chip,
  Divider,
  InputAdornment,
  MenuItem,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDispatch } from "react-redux";
import {
  useGetClienteByIdQuery,
  useUpdateClienteMutation,
} from "../../store/services/clientesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { formatPhoneInputCL } from "../../utils/phoneCl";
import PhoneTextField from "../../components/common/PhoneTextField";
import TextField from "../../components/common/CompatTextField";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";
import {
  getSucursalDotSx,
  getSucursalTagSx,
} from "../../components/common/sucursalTagStyles";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
  },
};

const primaryButtonSx = (theme) => ({
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  bgcolor: "#0F172A",
  color: theme.palette.common.white,
  boxShadow: "none",
  "&:hover": {
    bgcolor: theme.palette.common.black,
    boxShadow: "none",
  },
});

const secondaryButtonSx = {
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
};

const EditarCliente = () => {
  const theme = useTheme();
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
    tipo_cliente: "persona",
    razon_social: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    activo: true,
  });

  useEffect(() => {
    if (clienteData) {
      setFormData({
        rut: clienteData?.rut || "",
        tipo_cliente: clienteData.tipo_cliente || "persona",
        razon_social: clienteData?.razon_social || "",
        nombre: clienteData?.nombre || "",
        apellido: clienteData?.apellido || "",
        direccion: clienteData?.direccion || "",
        telefono: formatPhoneInputCL(clienteData?.telefono) || "",
        email: clienteData?.email || "",
        activo: clienteData?.activo ?? true,
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "activo" ? value === true || value === "true" : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
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
      navigate("/clientes", { state: { refetch: true } });
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar el cliente: ${
            error?.data?.error || error?.data?.message || "Desconocido"
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

  const isEmpresa = formData.tipo_cliente === "empresa";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 1,
            bgcolor: "#0F172A",
            color: theme.palette.common.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonOutlineOutlinedIcon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" fontWeight={800} lineHeight={1.1}>
            Editar cliente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Actualiza datos comerciales, contacto y sucursales.
          </Typography>
        </Box>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          bgcolor: "background.paper",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 10px 30px rgba(15, 23, 42, 0.06)"
              : "0 10px 30px rgba(0, 0, 0, 0.24)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Información del cliente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revisa los campos antes de guardar los cambios.
              </Typography>
            </Box>
            <Chip
              size="small"
              label={formData.activo ? "Activo" : "Inactivo"}
              sx={{
                borderRadius: 1,
                fontWeight: 800,
                color: formData.activo
                  ? theme.palette.success.dark
                  : theme.palette.error.dark,
                bgcolor: formData.activo
                  ? alpha(theme.palette.success.main, 0.12)
                  : alpha(theme.palette.error.main, 0.12),
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            <TextField
              select
              label="Tipo de cliente"
              name="tipo_cliente"
              value={formData.tipo_cliente}
              onChange={handleInputChange}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {isEmpresa ? (
                      <BusinessOutlinedIcon fontSize="small" />
                    ) : (
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    )}
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="persona">Persona</MenuItem>
              <MenuItem value="empresa">Empresa</MenuItem>
            </TextField>

            <TextField
              select
              label="Estado"
              name="activo"
              value={formData.activo}
              onChange={handleInputChange}
              sx={fieldSx}
            >
              <MenuItem value={true}>Activo</MenuItem>
              <MenuItem value={false}>Inactivo</MenuItem>
            </TextField>

            <TextField
              label={isEmpresa ? "Nombre de contacto" : "Nombre"}
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {!isEmpresa && (
              <TextField
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {isEmpresa && (
              <TextField
                label="Razón social"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleInputChange}
                fullWidth
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              label={isEmpresa ? "RUT empresa" : "RUT"}
              name="rut"
              value={formData.rut}
              onChange={handleInputChange}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <PhoneTextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              fullWidth
              sx={fieldSx}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              fullWidth
              sx={{ ...fieldSx, gridColumn: { xs: "auto", md: "1 / -1" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider sx={{ my: 2.5 }} />

          <Box sx={{ mb: 1.5 }}>
            <Typography variant="h6" fontWeight={800}>
              Sucursales
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define dónde queda disponible este cliente.
            </Typography>
          </Box>

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
            renderValue={(value, getItemProps) =>
              (Array.isArray(value) ? value : []).map((option, index) => {
                const { key, ...itemProps } = getItemProps({ index });
                return (
                  <Chip
                    key={key}
                    {...itemProps}
                    label={option.nombre ?? `Sucursal ${option.id_sucursal}`}
                    size="small"
                    sx={getSucursalTagSx(theme, index)}
                  />
                );
              })
            }
            renderOption={(props, option, state) => {
              const { key, ...liProps } = props;
              return (
                <li key={key} {...liProps}>
                  <Box
                    sx={getSucursalDotSx(theme, state.index, { mr: 1 })}
                  />
                  {option.nombre ?? `Sucursal ${option.id_sucursal}`}
                </li>
              );
            }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 0.75,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.16)",
                  overflow: "hidden",
                },
              },
              listbox: {
                sx: {
                  "& li": {
                    py: 1,
                    fontSize: "0.92rem",
                  },
                },
              },
              popper: {
                sx: { zIndex: (t) => t.zIndex.modal + 1 },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper",
                alignItems: "center",
              },
              "& .MuiInputLabel-root": {
                fontWeight: 700,
              },
              "& .MuiAutocomplete-endAdornment .MuiButtonBase-root": {
                color: "text.secondary",
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sucursales"
                placeholder="Agregar sucursal"
                size="small"
              />
            )}
          />

          <Divider sx={{ my: 2.5 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/clientes")}
              disabled={isUpdating}
              sx={secondaryButtonSx}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              disabled={isUpdating}
              sx={primaryButtonSx(theme)}
            >
              {isUpdating ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditarCliente;
