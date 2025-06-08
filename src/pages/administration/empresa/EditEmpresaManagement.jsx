import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetAllSucursalsQuery,
  useGetEmpresaByIdQuery,
  useUpdateEmpresaMutation,
  useUpdateSucursalMutation,
} from "../../../store/services/empresaApi";
import { showNotification } from "../../../store/reducers/notificacionSlice";
import BackButton from "../../../components/common/BackButton";
import EditarSucursales from "../../../components/empresa/EditarSucursal";

const EditarEmpresa = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    data: empresa,
    isLoading: isLoadingEmpresa,
    refetch: refetchEmpresa,
  } = useGetEmpresaByIdQuery(id);
  const {
    data: sucursales,
    isLoading: isLoadingSucursales,
    refetchSucursales,
  } = useGetAllSucursalsQuery();
  const [updateEmpresa] = useUpdateEmpresaMutation();
  const [updateSucursal] = useUpdateSucursalMutation();

  const [empresaData, setEmpresaData] = useState({});
  const [sucursalData, setSucursalData] = useState({});

  useEffect(() => {
    if (empresa) {
      setEmpresaData(empresa);
    }
  }, [empresa]);

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSucursalChange = (id, field, value) => {
    setSucursalData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdateEmpresa = async () => {
    try {
      await updateEmpresa({ id, ...empresaData });
      dispatch(
        showNotification({
          message: "Empresa actualizada correctamente",
          severity: "success",
        })
      );
      refetchEmpresa();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar empresa` + error,
          severity: "error",
        })
      );
    }
  };

  const handleUpdateSucursal = async (sucursalId) => {
    try {
      await updateSucursal({ id: sucursalId, ...sucursalData[sucursalId] });
      dispatch(
        showNotification({
          message: "Sucursal actualizada correctamente",
          severity: "success",
        })
      );
      refetchSucursales();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al actualizar sucursal` + error,
          severity: "error",
        })
      );
    }
  };

  if (isLoadingEmpresa || isLoadingSucursales) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5">Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <BackButton to="/empresa" label="Volver" />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            color: (theme) => theme.palette.text.primary,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}
        >
          Editar Empresa
        </Typography>
        <Divider
          sx={{
            marginBottom: 4,
            borderColor: "rgba(0, 0, 0, 0.12)",
          }}
        />
        <Card
          sx={{
            marginTop: 4,
            marginBottom: 4,
            borderRadius: "12px",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <CardContent>
            <Grid2 container spacing={4}>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={empresaData.nombre || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { fontSize: "0.9rem", color: "#616161" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RUT"
                  name="rut_empresa"
                  value={empresaData.rut_empresa || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { fontSize: "0.9rem", color: "#616161" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={empresaData.direccion || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { fontSize: "0.9rem", color: "#616161" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid2>
              <Grid2 xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={empresaData.telefono || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { fontSize: "0.9rem", color: "#616161" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={empresaData.email || ""}
                  onChange={handleEmpresaChange}
                  variant="outlined"
                  InputLabelProps={{
                    style: { fontSize: "0.9rem", color: "#616161" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid2>
              <Grid2
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateEmpresa}
                  sx={{
                    textTransform: "none",
                    paddingX: 4,
                    fontWeight: "bold",
                    borderRadius: "8px",
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  Guardar Cambios Empresa
                </Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <EditarSucursales
          sucursales={sucursales}
          idEmpresa={id}
          sucursalData={sucursalData}
          handleSucursalChange={handleSucursalChange}
          handleUpdateSucursal={handleUpdateSucursal}
        />
      </Box>
    </Box>
  );
};

export default EditarEmpresa;
