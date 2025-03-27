import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import {
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
} from "../../../store/services/empresaApi";

const Empresa = () => {
  const {
    data: empresas,
    isLoading: isLoadingEmpresas,
    isError: isErrorEmpresas,
    refetch: refetchEmpresas,
  } = useGetAllEmpresasQuery();
  const {
    data: sucursales,
    isLoading: isLoadingSucursales,
    isError: isErrorSucursales,
    refetch: refetchSucursales,
  } = useGetAllSucursalsQuery();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refetch) {
      refetchEmpresas();
      refetchSucursales();
      navigate("/empresa", { replace: true });
    }
  }, [location.state, navigate, refetchEmpresas, refetchSucursales]);

  if (isLoadingEmpresas || isLoadingSucursales) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5">Cargando datos...</Typography>
      </Box>
    );
  }

  if (isErrorEmpresas || isErrorSucursales) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5" color="error">
          Error al cargar los datos
        </Typography>
      </Box>
    );
  }

  const empresa = empresas?.[0]; // Selecciona la primera empresa

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Perfil de la Empresa */}
        <BackButton to="/admin" label="Volver al menú" />
        <Card
          sx={{
            marginBottom: 4,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Grid2 container spacing={4} alignItems="center">
              <Grid2 xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: 36,
                  }}
                >
                  {empresa?.nombre?.[0] || "E"}
                </Avatar>
              </Grid2>
              <Grid2 xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
                  {empresa?.nombre || "Empresa no disponible"}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="body1" sx={{ color: "#555", marginBottom: 1 }}>
                  <strong>RUT:</strong> {empresa?.rut_empresa || "No disponible"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", marginBottom: 1 }}>
                  <strong>Dirección:</strong> {empresa?.direccion || "No disponible"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", marginBottom: 1 }}>
                  <strong>Teléfono:</strong> {empresa?.telefono || "No disponible"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", marginBottom: 2 }}>
                  <strong>Email:</strong> {empresa?.email || "No disponible"}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none", paddingX: 3 }}
                  onClick={() => navigate(`/empresa/editar/${empresa?.id_empresa}`)}
                >
                  Editar Perfil Empresa
                </Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Lista de Sucursales */}
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, color: "#333" }}>
          Sucursales
        </Typography>
        <Grid2 container spacing={4}>
          {sucursales
            ?.filter((sucursal) => sucursal.id_empresa === empresa?.id_empresa)
            .map((sucursal) => (
              <Grid2 xs={12} sm={6} md={4} key={sucursal.id_sucursal}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#444", marginBottom: 1 }}
                    >
                      {sucursal.nombre}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <List disablePadding>
                      <ListItem>
                        <ListItemText
                          primary={<strong>Dirección</strong>}
                          secondary={sucursal.direccion || "No disponible"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={<strong>Teléfono</strong>}
                          secondary={sucursal.telefono || "No disponible"}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Empresa;
