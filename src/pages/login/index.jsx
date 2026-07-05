import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logoImage from "../../assets/images/logoLogin.png";
import {
  BadgeOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useLoginMutation } from "../../store/services/authApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { getInitialRoute } from "../../utils/navigationUtils";
import { finishLogin } from "../../store/reducers/authSlice";
import TextField from "../../components/common/CompatTextField";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";

const formatRut = (value = "") => {
  const cleanValue = String(value).replace(/[^0-9kK]/gi, "").toUpperCase();
  if (cleanValue.length < 2) return cleanValue;

  const body = cleanValue.slice(0, -1);
  const dv = cleanValue.slice(-1);
  let formatted = "";
  let i = 0;

  for (let j = body.length - 1; j >= 0; j--) {
    formatted = body[j] + formatted;
    i++;
    if (i === 3 && j !== 0) {
      formatted = "." + formatted;
      i = 0;
    }
  }

  return `${formatted}-${dv}`;
};

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rutInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [credentials, setCredentials] = useState({ rut: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, rol, permisos } = useSelector((state) => state.auth);

  const syncRutValue = useCallback((value) => {
    const rut = formatRut(value);
    setCredentials((prev) => (prev.rut === rut ? prev : { ...prev, rut }));
    return rut;
  }, []);

  const syncRutFromInput = useCallback(() => {
    const input = rutInputRef.current;
    if (!input?.value) return "";

    const rut = syncRutValue(input.value);
    if (input.value !== rut) input.value = rut;
    return rut;
  }, [syncRutValue]);

  useEffect(() => {
    const timeouts = [100, 500, 1000].map((delay) =>
      window.setTimeout(syncRutFromInput, delay)
    );
    return () => timeouts.forEach((id) => window.clearTimeout(id));
  }, [syncRutFromInput]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "rut") {
      syncRutValue(value);
    } else {
      setCredentials((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const initialRoute = getInitialRoute(rol, permisos);
      navigate(initialRoute, { replace: true });
    }
  }, [isAuthenticated, navigate, permisos, rol]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const rut = formatRut(rutInputRef.current?.value || credentials.rut);
    const password = passwordInputRef.current?.value || credentials.password;
    const loginCredentials = { rut, password };
    setCredentials(loginCredentials);

    try {
      const data = await login(loginCredentials).unwrap();
      dispatch(finishLogin(data));
      dispatch(
        showNotification({
          message: "Inicio de sesión exitoso.",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: error?.data?.error || "Error al iniciar sesión.",
          severity: "error",
        })
      );
    }
  };

  const accentBlue = theme.palette.primary?.main || "#0b78c7";
  const accentCyan = "#0891b2";
  const slate = "#0f172a";
  const muted = "#64748b";
  const borderColor = alpha(slate, 0.1);
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 52,
      borderRadius: "8px",
      backgroundColor: "#f8fbfd",
      color: slate,
      transition: "background-color 160ms ease, box-shadow 160ms ease",
      "& fieldset": {
        borderColor,
      },
      "&:hover fieldset": {
        borderColor: alpha(accentBlue, 0.52),
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        boxShadow: `0 0 0 4px ${alpha(accentBlue, 0.12)}`,
      },
      "&.Mui-focused fieldset": {
        borderColor: accentBlue,
        borderWidth: "1px",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "0.95rem",
      py: "12px",
    },
    "& .MuiInputLabel-root": {
      color: muted,
      fontSize: "0.92rem",
      fontWeight: 700,
      letterSpacing: 0,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: accentBlue,
    },
    "& .MuiFormHelperText-root": {
      color: muted,
      fontSize: "0.78rem",
      letterSpacing: 0,
      ml: 0,
      mt: 0.75,
    },
  };

  return (
    <Box
      component="main"
      height="100dvh"
      minHeight="520px"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "relative",
        isolation: "isolate",
        boxSizing: "border-box",
        backgroundColor: "#f5f9fc",
        backgroundImage: [
          "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(237,247,251,0.94) 46%, rgba(249,252,255,1) 100%)",
          `linear-gradient(${alpha(accentBlue, 0.07)} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${alpha(
            accentBlue,
            0.07
          )} 1px, transparent 1px)`,
        ].join(","),
        backgroundSize: "auto, 44px 44px, 44px 44px",
        overflowY: { xs: "auto", sm: "hidden" },
        overflowX: "hidden",
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 1.5, sm: 2.5 },
        "&::after": {
          content: '""',
          position: "absolute",
          left: "50%",
          top: { xs: "47%", sm: "48%" },
          zIndex: 0,
          width: { xs: "min(520px, 108vw)", sm: 620 },
          height: { xs: 132, sm: 170 },
          background:
            "linear-gradient(90deg, rgba(8,145,178,0.11), rgba(246,181,63,0.15), rgba(11,120,199,0.1))",
          transform: "translate(-50%, -50%) rotate(-4deg)",
          transformOrigin: "center",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        width="100%"
        maxWidth={{ xs: 440, sm: 420 }}
        mx="auto"
        sx={{
          position: "relative",
          zIndex: 1,
          p: { xs: 2.25, sm: 3 },
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          backgroundColor: alpha("#ffffff", 0.96),
          boxShadow: "0 24px 80px rgba(15,23,42,0.16)",
          backdropFilter: "blur(16px)",
        }}
        aria-label="Formulario de inicio de sesión"
      >
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            mb: { xs: 2, sm: 2.25 },
          }}
        >
          <Box
            src={logoImage}
            alt="Aguas Valentino"
            component="img"
            sx={{
              width: { xs: 148, sm: 168 },
              height: "auto",
              display: "block",
            }}
          />
        </Box>

        <Typography
          component="h2"
          variant="h4"
          sx={{
            color: slate,
            fontSize: { xs: "1.35rem", sm: "1.55rem" },
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: 0,
            mb: 0.75,
            textAlign: "center",
          }}
        >
          Acceso al portal
        </Typography>

        <Typography
          sx={{
            color: muted,
            fontSize: "0.88rem",
            lineHeight: 1.45,
            letterSpacing: 0,
            mb: 2,
            textAlign: "center",
          }}
        >
          Ingresa con tu RUT y contraseña.
        </Typography>

        <Box display="flex" flexDirection="column" gap={1.75}>
          <TextField
            label="RUT"
            name="rut"
            value={credentials.rut}
            autoComplete="username"
            placeholder="12.345.678-K"
            fullWidth
            inputRef={rutInputRef}
            onChange={handleInputChange}
            onInput={handleInputChange}
            onFocus={() => syncRutFromInput()}
            onBlur={() => syncRutFromInput()}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined
                      sx={{ color: alpha(slate, 0.48), fontSize: 21 }}
                    />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                autoCapitalize: "characters",
                inputMode: "text",
              },
            }}
          />
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            inputRef={passwordInputRef}
            fullWidth
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{ color: alpha(slate, 0.48), fontSize: 21 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      onClick={togglePasswordVisibility}
                      edge="end"
                      type="button"
                      sx={{
                        color: muted,
                        "&:hover": {
                          color: accentBlue,
                          backgroundColor: alpha(accentBlue, 0.08),
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              inputLabel: {
                shrink: true,
              },
            }}
            autoComplete="current-password"
          />
        </Box>

        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={isLoading}
          sx={{
            minHeight: 52,
            mt: 2.25,
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: 0,
            color: "#ffffff",
            background: `linear-gradient(90deg, ${accentBlue}, ${accentCyan})`,
            boxShadow: `0 14px 34px ${alpha(accentBlue, 0.28)}`,
            "&:hover": {
              background: `linear-gradient(90deg, ${accentCyan}, ${accentBlue})`,
              boxShadow: `0 16px 40px ${alpha(accentBlue, 0.34)}`,
            },
            "&.Mui-disabled": {
              color: alpha("#ffffff", 0.78),
              background: `linear-gradient(90deg, ${alpha(
                accentBlue,
                0.58
              )}, ${alpha(accentCyan, 0.58)})`,
            },
          }}
        >
          {isLoading ? (
            <Box display="inline-flex" alignItems="center" gap={1}>
              <CircularProgress size={18} color="inherit" />
              Validando acceso
            </Box>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
