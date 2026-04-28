import {
  useEffect,
  useState } from "react";
import { Button, IconButton, InputAdornment, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logoImage from "../../assets/images/logoLogin.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginMutation } from "../../store/services/authApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { getInitialRoute } from "../../utils/navigationUtils";
import { finishLogin } from "../../store/reducers/authSlice";
import TextField from "../../components/common/CompatTextField";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";

const formatRut = (value) => {
  const cleanValue = value.replace(/[^0-9kK]/gi, "");
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
  const [credentials, setCredentials] = useState({ rut: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, rol, permisos } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "rut") {
      const raw = value.replace(/[^0-9kK]/gi, "");
      setCredentials((prev) => ({ ...prev, [name]: formatRut(raw) }));
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
    try {
      const data = await login(credentials).unwrap();
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

  return (
    <Box
      minHeight="100svh"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{
        backgroundColor: theme.palette.background.default,
        overflowY: "auto",
        px: 2,
        py: { xs: 4, sm: 6 },
      }}
    >
      <Box justifyContent="center" display="flex" alignItems="center" mb={2}>
        <Box
          src={logoImage}
          alt="logo"
          component="img"
          sx={{
            width: { xs: 180, sm: 220 },
            height: "auto",
            display: "block",
          }}
        />
      </Box>
      <Box
        component="form"
        onSubmit={handleLogin}
        display="flex"
        flexDirection="column"
        gap="1.5rem"
        width="100%"
        maxWidth={360}
        p={{ xs: 3, sm: 4 }}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: theme.shadows[4],
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          sx={{ fontSize: "1.8rem" }}
        >
          Iniciar Sesión
        </Typography>
        <TextField
          label="Rut"
          name="rut"
          value={credentials.rut}
          autoComplete="username"
          fullWidth
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9kK.-]/g, "");
            setCredentials((prev) => ({ ...prev, rut: raw }));
          }}
          onBlur={() =>
            setCredentials((prev) => ({
              ...prev,
              rut: formatRut(prev.rut.replace(/[^0-9kK]/gi, "")),
            }))
          }
        />
        <TextField
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
          slotProps={{
            input: {
              sx: { fontSize: "1.05rem" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={togglePasswordVisibility}
                    edge="end"
                    type="button"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
            inputLabel: {
              shrink: true,
              sx: { fontSize: "1rem" },
            },
          }}
          autoComplete="current-password"
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            fontSize: "1.2rem",
            padding: "0.8rem",
          }}
        >
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
