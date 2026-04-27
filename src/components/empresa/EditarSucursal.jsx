import {
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";

const EditarSucursales = ({
  sucursales,
  idEmpresa,
  sucursalData,
  handleSucursalChange,
  handleUpdateSucursal,
}) => {
  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginBottom: 3,
          color: (theme) => theme.palette.text.primary,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Editar Sucursales
      </Typography>
      <Divider
        sx={{
          marginBottom: 4,
          borderColor: "rgba(0, 0, 0, 0.12)",
        }}
      />
      <Grid container spacing={4}>
        {sucursales
          ?.filter((sucursal) => sucursal.id_empresa === parseInt(idEmpresa))
          .map((sucursal) => (
            <Grid key={sucursal.id_sucursal} size={{ xs: 12 }}>
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  marginBottom: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: 2,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {sucursal.nombre}
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={
                          sucursalData[sucursal.id_sucursal]?.nombre ||
                          sucursal.nombre
                        }
                        onChange={(e) =>
                          handleSucursalChange(
                            sucursal.id_sucursal,
                            "nombre",
                            e.target.value
                          )
                        }
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
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        value={
                          sucursalData[sucursal.id_sucursal]?.direccion ||
                          sucursal.direccion
                        }
                        onChange={(e) =>
                          handleSucursalChange(
                            sucursal.id_sucursal,
                            "direccion",
                            e.target.value
                          )
                        }
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
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        value={
                          sucursalData[sucursal.id_sucursal]?.telefono ||
                          sucursal.telefono
                        }
                        onChange={(e) =>
                          handleSucursalChange(
                            sucursal.id_sucursal,
                            "telefono",
                            e.target.value
                          )
                        }
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
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                     size={{ xs: 12 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleUpdateSucursal(sucursal.id_sucursal)
                        }
                        sx={{
                          textTransform: "none",
                          paddingX: 3,
                          fontWeight: "bold",
                          backgroundColor: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#1565c0",
                          },
                        }}
                      >
                        Guardar Cambios
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};
EditarSucursales.propTypes = {
  sucursales: PropTypes.array.isRequired,
  idEmpresa: PropTypes.string.isRequired,
  sucursalData: PropTypes.object.isRequired,
  handleSucursalChange: PropTypes.func.isRequired,
  handleUpdateSucursal: PropTypes.func.isRequired,
};

export default EditarSucursales;
