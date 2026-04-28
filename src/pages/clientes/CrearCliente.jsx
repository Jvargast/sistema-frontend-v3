import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Chip,
  Divider,
  InputAdornment,
  MenuItem,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useCreateClienteMutation } from "../../store/services/clientesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { isPhonePrefixOnlyCL, validatePhoneCL } from "../../utils/phoneCl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AutocompleteDireccion from "../../components/pedido/AutocompleteDireccion";
import MapSelectorGoogle from "../../components/maps/MapSelector";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import SucursalPickerHeader from "../../components/common/SucursalPickerHeader";
import PhoneTextField from "../../components/common/PhoneTextField";
import TextField from "../../components/common/CompatTextField";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";

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

const CrearCliente = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation();
  const [formData, setFormData] = useState({
    tipo_cliente: "persona",
    nombre: "",
    direccion: "",
    telefono: "",
    apellido: "",
    razon_social: "",
    rut: "",
    email: "",
    activo: true,
    lat: null,
    lng: null,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const usuario = useSelector((s) => s.auth);
  const { mode, activeSucursalId } = useSelector((s) => s.scope);

  const sucursalActiva = useSucursalActiva();
  const { data: sucursales = [] } = useGetAllSucursalsQuery();
  const isAdmin = usuario?.rol === "administrador";

  const [idSucursal, setIdSucursal] = useState(
    mode === "global"
      ? null
      : sucursalActiva?.id_sucursal ||
          usuario?.id_sucursal ||
          Number(activeSucursalId) ||
          null
  );

  const selectedSucursal = useMemo(
    () =>
      (sucursales || []).find(
        (sucursal) => Number(sucursal.id_sucursal) === Number(idSucursal)
      ),
    [sucursales, idSucursal]
  );

  const nombreSucursal = selectedSucursal?.nombre || "";

  useEffect(() => {
    if (mode !== "global") {
      const enforced =
        Number(activeSucursalId) ||
        Number(sucursalActiva?.id_sucursal) ||
        Number(usuario?.id_sucursal) ||
        null;
      setIdSucursal(enforced);
    } else {
      setIdSucursal((prev) => prev ?? null);
    }
  }, [mode, activeSucursalId, sucursalActiva?.id_sucursal, usuario?.id_sucursal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setSubmitAttempted(true);
    try {
      if (!idSucursal) {
        dispatch(
          showNotification({
            message: "Selecciona una sucursal para el nuevo cliente.",
            severity: "warning",
          })
        );
        return;
      }

      if (!formData.telefono || isPhonePrefixOnlyCL(formData.telefono)) {
        dispatch(
          showNotification({
            message: "Ingresa un teléfono para el nuevo cliente.",
            severity: "warning",
          })
        );
        return;
      }

      const phoneValidation = validatePhoneCL(formData.telefono);
      if (!phoneValidation.valid) {
        dispatch(
          showNotification({
            message: phoneValidation.msg || "El teléfono no es válido.",
            severity: "warning",
          })
        );
        return;
      }

      if (!formData.direccion?.trim()) {
        dispatch(
          showNotification({
            message: "Ingresa la dirección del cliente.",
            severity: "warning",
          })
        );
        return;
      }

      if (
        typeof formData.lat !== "number" ||
        typeof formData.lng !== "number" ||
        !Number.isFinite(formData.lat) ||
        !Number.isFinite(formData.lng)
      ) {
        dispatch(
          showNotification({
            message:
              "Selecciona una ubicación válida en el mapa o desde el buscador.",
            severity: "warning",
          })
        );
        return;
      }

      await createCliente({
        ...formData,
        id_sucursal: Number(idSucursal),
      }).unwrap();
      dispatch(
        showNotification({
          message: "Cliente creado exitosamente.",
          severity: "success",
        })
      );
      navigate("/clientes");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear el cliente: ${
            error?.data?.error || error?.data?.message || "Desconocido"
          }`,
          severity: "error",
        })
      );
    }
  };

  const handleDireccionChange = (direccion) => {
    setFormData((prev) => ({ ...prev, direccion }));
  };

  const handleCoordsChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      lat: coords.lat,
      lng: coords.lng,
    }));
  };

  const isEmpresa = formData.tipo_cliente === "empresa";
  const locationMissing =
    submitAttempted &&
    (!formData.direccion?.trim() ||
      typeof formData.lat !== "number" ||
      typeof formData.lng !== "number" ||
      !Number.isFinite(formData.lat) ||
      !Number.isFinite(formData.lng));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
        }}
      >
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
          <PersonAddAlt1Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" fontWeight={800} lineHeight={1.1}>
            Crear cliente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra datos comerciales, contacto y ubicación.
          </Typography>
        </Box>
      </Box>

      <Box
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
        <Box sx={{ px: { xs: 2, md: 2.5 }, pt: 2 }}>
          <SucursalPickerHeader
            sucursales={sucursales || []}
            idSucursal={idSucursal}
            canChoose={isAdmin}
            onChange={(id) => setIdSucursal(id)}
            nombreSucursal={nombreSucursal}
          />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: { xs: 2, md: 2.5 } }}
        >
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
                Completa los datos principales antes de guardar.
              </Typography>
            </Box>
            <Chip
              size="small"
              label={isEmpresa ? "Empresa" : "Persona"}
              icon={
                isEmpresa ? (
                  <BusinessOutlinedIcon fontSize="small" />
                ) : (
                  <PersonOutlineOutlinedIcon fontSize="small" />
                )
              }
              sx={{
                borderRadius: 1,
                fontWeight: 800,
                bgcolor: alpha("#0F172A", 0.08),
                color: "#0F172A",
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
              fullWidth
              label={isEmpresa ? "Nombre de contacto" : "Nombre"}
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
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
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
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
                fullWidth
                label="Razón social"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleInputChange}
                required
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
              fullWidth
              label={isEmpresa ? "RUT empresa" : "RUT"}
              name="rut"
              value={formData.rut}
              onChange={handleInputChange}
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
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider sx={{ my: 2.5 }} />

          <Box sx={{ mb: 1.5 }}>
            <Typography variant="h6" fontWeight={800}>
              Ubicación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Busca una dirección o marca la posición en el mapa.
            </Typography>
          </Box>

          <AutocompleteDireccion
            label="Dirección del cliente"
            direccion={formData.direccion}
            setDireccion={handleDireccionChange}
            setCoords={handleCoordsChange}
            required
            error={locationMissing}
            helperText={
              locationMissing
                ? "Debes ingresar dirección y seleccionar ubicación."
                : "Obligatoria. Busca la dirección o marca el punto en el mapa."
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1.5,
              ...fieldSx,
            }}
          />

          <MapSelectorGoogle
            coords={{ lat: formData.lat, lng: formData.lng }}
            setCoords={handleCoordsChange}
            direccion={formData.direccion}
            setDireccion={handleDireccionChange}
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
              disabled={isCreating}
              sx={secondaryButtonSx}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              disabled={isCreating}
              sx={primaryButtonSx(theme)}
            >
              {isCreating ? "Creando..." : "Crear cliente"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CrearCliente;
