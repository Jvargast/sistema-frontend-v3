import {
  Typography,
  Divider,
  Card,
  CardContent,
  TextField,
  Button,
  Grid2,
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
      <Grid2 container spacing={4}>
        {sucursales
          ?.filter((sucursal) => sucursal.id_empresa === parseInt(idEmpresa))
          .map((sucursal) => (
            <Grid2 item xs={12} key={sucursal.id_sucursal}>
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
                  <Grid2 container spacing={4}>
                    <Grid2 xs={12} md={6}>
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
                    </Grid2>
                    <Grid2 xs={12} md={6}>
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
                    </Grid2>
                    <Grid2 xs={12} md={6}>
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
                    </Grid2>
                    <Grid2
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
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
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>
            </Grid2>
          ))}
      </Grid2>
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
