import { useEffect, useState } from "react";
import { Add, Edit, Delete } from "@mui/icons-material";
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
  useTheme,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import {
  useCreateSucursalMutation,
  useDeleteSucursalMutation,
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
  useUpdateEmpresaMutation,
  useUpdateSucursalMutation,
} from "../../../store/services/empresaApi";
import CrearSucursalModal from "../../../components/empresa/CrearSucursalModal";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import { useRegisterRefresh } from "../../../hooks/useRegisterRefresh";

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

  useRegisterRefresh(
    "empresa",
    async () => {
      await Promise.all([refetchEmpresas(), refetchSucursales()]);
      return true;
    },
    [refetchEmpresas, refetchSucursales]
  );

  const [createSucursal] = useCreateSucursalMutation();
  const [deleteSucursal] = useDeleteSucursalMutation();
  const [updateSucursal] = useUpdateSucursalMutation();

  const [updateEmpresa] = useUpdateEmpresaMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [openCrearSucursal, setOpenCrearSucursal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const [empresaEditando, setEmpresaEditando] = useState(false);
  const [empresaData, setEmpresaData] = useState({
    nombre: "",
    rut_empresa: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const empresa = empresas?.[0];

  const startEditing = (sucursal) => {
    setEditingId(sucursal.id_sucursal);
    setEditData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion || "",
      telefono: sucursal.telefono || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ nombre: "", direccion: "", telefono: "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateSucursal({ id, ...editData }).unwrap();
      dispatch(
        showNotification({
          message: "Sucursal actualizada",
          severity: "success",
        })
      );
      refetchSucursales();
      cancelEditing();
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: "Error actualizando sucursal",
          severity: "error",
        })
      );
    }
  };

  const theme = useTheme();

  useEffect(() => {
    if (location.state?.refetch) {
      refetchEmpresas();
      refetchSucursales();
      navigate("/empresa", { replace: true });
    }
  }, [location.state, navigate, refetchEmpresas, refetchSucursales]);

  useEffect(() => {
    if (empresa) {
      setEmpresaData({
        nombre: empresa.nombre || "",
        rut_empresa: empresa.rut_empresa || "",
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        email: empresa.email || "",
      });
    }
  }, [empresa]);

  const handleCreateSucursal = async (data) => {
    try {
      await createSucursal(data).unwrap();
      dispatch(
        showNotification({
          message: "Sucursal creada exitosamente",
          severity: "success",
        })
      );
      refetchSucursales();
      setOpenCrearSucursal(false);
    } catch (error) {
      console.error("Error creando sucursal:", error);
      dispatch(
        showNotification({
          message: `Error al crear sucursal: ${
            error.data?.message || error.message
          }`,
          severity: "error",
        })
      );
    }
  };

  const handleDeleteSucursal = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar esta sucursal?")) return;
    try {
      await deleteSucursal(id).unwrap();
      dispatch(
        showNotification({
          message: "Sucursal eliminada exitosamente",
          severity: "success",
        })
      );
      refetchSucursales();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar sucursal: ${
            error.data?.message || error.message
          }`,
          severity: "error",
        })
      );
    }
  };

  const startEditingEmpresa = () => setEmpresaEditando(true);
  const cancelEditingEmpresa = () => {
    setEmpresaEditando(false);
    if (empresa) {
      setEmpresaData({
        nombre: empresa.nombre || "",
        rut_empresa: empresa.rut_empresa || "",
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        email: empresa.email || "",
      });
    }
  };

  const saveEmpresa = async () => {
    try {
      await updateEmpresa({ id: empresa.id_empresa, ...empresaData }).unwrap();
      dispatch(
        showNotification({
          message: "Empresa actualizada",
          severity: "success",
        })
      );
      refetchEmpresas();
      setEmpresaEditando(false);
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: "Error actualizando empresa",
          severity: "error",
        })
      );
    }
  };

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

  return (
    <Box
      sx={{
        padding: 4,
        /* minHeight: "100vh", */
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <BackButton to="/admin" label="Volver al menú" />
        <Card
          sx={{
            marginBottom: 4,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            bgcolor: theme.palette.background.paper,
            minHeight: 140,
            px: 3,
            py: 2,
          }}
        >
          <CardContent>
            <Grid2 container spacing={3} alignItems="center">
              <Grid2
                xs={12}
                md={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 40,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                    boxShadow: theme.shadows[3],
                  }}
                >
                  {empresa?.nombre?.[0] || "E"}
                </Avatar>
              </Grid2>

              <Grid2 xs={12} md={9}>
                {empresaEditando ? (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <TextField
                      label="Nombre"
                      variant="standard"
                      value={empresaData.nombre}
                      onChange={(e) =>
                        setEmpresaData({
                          ...empresaData,
                          nombre: e.target.value,
                        })
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "2.5rem",
                          fontWeight: 500,
                          padding: 0,
                          color: "text.primary",
                        },
                      }}
                    />
                    <TextField
                      label="RUT"
                      variant="standard"
                      value={empresaData.rut_empresa}
                      onChange={(e) =>
                        setEmpresaData({
                          ...empresaData,
                          rut_empresa: e.target.value,
                        })
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "1rem",
                          fontWeight: 500,
                          padding: 0,
                          color: "text.primary",
                        },
                      }}
                    />
                    <TextField
                      label="Dirección"
                      variant="standard"
                      value={empresaData.direccion}
                      onChange={(e) =>
                        setEmpresaData({
                          ...empresaData,
                          direccion: e.target.value,
                        })
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "1rem",
                          fontWeight: 500,
                          padding: 0,
                          color: "text.primary",
                        },
                      }}
                    />
                    <TextField
                      label="Teléfono"
                      variant="standard"
                      value={empresaData.telefono}
                      onChange={(e) =>
                        setEmpresaData({
                          ...empresaData,
                          telefono: e.target.value,
                        })
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "1rem",
                          fontWeight: 500,
                          padding: 0,
                          color: "text.primary",
                        },
                      }}
                    />
                    <TextField
                      label="Email"
                      variant="standard"
                      value={empresaData.email}
                      onChange={(e) =>
                        setEmpresaData({
                          ...empresaData,
                          email: e.target.value,
                        })
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "1rem",
                          fontWeight: 500,
                          padding: 0,
                          color: "text.primary",
                        },
                      }}
                    />

                    <Box display="flex" gap={2} mt={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={saveEmpresa}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={cancelEditingEmpresa}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                        fontSize: "2.5rem",
                      }}
                    >
                      {empresa?.nombre || "Empresa no disponible"}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.3,
                        fontSize: "1rem",
                      }}
                    >
                      <strong>RUT:</strong>{" "}
                      {empresa?.rut_empresa || "No disponible"}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.3,
                        fontSize: "1rem",
                      }}
                    >
                      <strong>Dirección:</strong>{" "}
                      {empresa?.direccion || "No disponible"}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.3,
                        fontSize: "1rem",
                      }}
                    >
                      <strong>Teléfono:</strong>{" "}
                      {empresa?.telefono || "No disponible"}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      <strong>Email:</strong>{" "}
                      {empresa?.email || "No disponible"}
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                      onClick={startEditingEmpresa}
                    >
                      Editar Perfil Empresa
                    </Button>
                  </>
                )}
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Lista de Sucursales */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Sucursales
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ textTransform: "none" }}
            onClick={() => setOpenCrearSucursal(true)}
          >
            Nueva Sucursal
          </Button>
        </Box>

        <Grid2 container spacing={4}>
          {sucursales
            ?.filter((sucursal) => sucursal.id_empresa === empresa?.id_empresa)
            .map((sucursal) => (
              <Grid2 xs={12} sm={6} md={4} key={sucursal.id_sucursal}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                    bgcolor: theme.palette.background.paper,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      {editingId === sucursal.id_sucursal ? (
                        <TextField
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              fontSize: "1rem",
                              padding: 0,
                              color: "text.primary",
                              fontWeight: 500,
                            },
                          }}
                          sx={{
                            bgcolor: "transparent",
                            "& .MuiInputBase-root": {
                              padding: "4px 0",
                            },
                            "& .MuiInputBase-input": {
                              padding: 0,
                            },
                          }}
                          size="small"
                          value={editData.nombre}
                          onChange={(e) =>
                            setEditData({ ...editData, nombre: e.target.value })
                          }
                        />
                      ) : (
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {sucursal.nombre}
                        </Typography>
                      )}

                      <Stack direction="row" spacing={1}>
                        {editingId === sucursal.id_sucursal ? (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => saveEdit(sucursal.id_sucursal)}
                            >
                              Guardar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={cancelEditing}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => startEditing(sucursal)}
                              aria-label="Editar sucursal"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteSucursal(sucursal.id_sucursal)
                              }
                              aria-label="Eliminar sucursal"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </Stack>

                    <Divider sx={{ marginBottom: 2 }} />

                    <List disablePadding>
                      <ListItem>
                        {editingId === sucursal.id_sucursal ? (
                          <TextField
                            variant="standard"
                            placeholder="Nombre"
                            InputProps={{
                              disableUnderline: false,
                              sx: {
                                fontSize: "1rem",
                                padding: 0,
                                borderBottom: "1px solid rgba(0,0,0,0.12)",
                                color: "text.primary",
                              },
                            }}
                            sx={{
                              "& .MuiInputBase-root": {
                                padding: "4px 0",
                              },
                            }}
                            label="Dirección"
                            size="small"
                            value={editData.direccion}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                direccion: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        ) : (
                          <ListItemText
                            primary={
                              <span style={{ fontWeight: 600 }}>Dirección</span>
                            }
                            secondary={
                              <span
                                style={{ color: theme.palette.text.secondary }}
                              >
                                {sucursal.direccion || "No disponible"}
                              </span>
                            }
                          />
                        )}
                      </ListItem>

                      <ListItem>
                        {editingId === sucursal.id_sucursal ? (
                          <TextField
                            variant="standard"
                            placeholder="Nombre"
                            InputProps={{
                              disableUnderline: false,
                              sx: {
                                fontSize: "1rem",
                                padding: 0,
                                borderBottom: "1px solid rgba(0,0,0,0.12)",
                                color: "text.primary",
                              },
                            }}
                            sx={{
                              "& .MuiInputBase-root": {
                                padding: "4px 0",
                              },
                            }}
                            label="Teléfono"
                            size="small"
                            value={editData.telefono}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                telefono: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        ) : (
                          <ListItemText
                            primary={
                              <span style={{ fontWeight: 600 }}>Teléfono</span>
                            }
                            secondary={
                              <span
                                style={{ color: theme.palette.text.secondary }}
                              >
                                {sucursal.telefono || "No disponible"}
                              </span>
                            }
                          />
                        )}
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      </Box>
      <CrearSucursalModal
        open={openCrearSucursal}
        onClose={() => setOpenCrearSucursal(false)}
        onCrearSucursal={handleCreateSucursal}
        idEmpresa={empresa?.id_empresa}
      />
    </Box>
  );
};

export default Empresa;
