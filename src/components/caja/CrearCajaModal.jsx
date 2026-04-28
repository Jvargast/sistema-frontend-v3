import Modal from "../common/CompatModal";
import Select from "../common/CompatSelect";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Backdrop,
  Button,
  Chip,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Close,
  PointOfSale,
  StorefrontOutlined,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useCreateCajaMutation } from "../../store/services/cajaApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const getModalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 32px)", sm: 520 },
  maxWidth: "100%",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 18px 48px rgba(15, 23, 42, 0.18)"
      : "0 18px 48px rgba(0, 0, 0, 0.45)",
  overflow: "hidden",
});

const CrearCajaModal = ({ onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [idSucursal, setIdSucursal] = useState("");
  const [createCaja, { isLoading }] = useCreateCajaMutation();
  const {
    data: sucursales,
    isLoading: loadingSucursales,
    error
  } = useGetAllSucursalsQuery();

  const selectedSucursal = useMemo(
    () =>
      sucursales?.find(
        (sucursal) => String(sucursal.id_sucursal) === String(idSucursal)
      ),
    [idSucursal, sucursales]
  );

  const handleCrearCaja = async () => {
    if (!idSucursal) {
      dispatch(
        showNotification({
          message: "Seleccione una sucursal para crear la caja",
          severity: "warning",
        })
      );
      return;
    }

    try {
      await createCaja({ id_sucursal: Number(idSucursal) }).unwrap();
      dispatch(
        showNotification({
          message: "Caja creada con éxito",
          severity: "success",
        })
      );
      onClose();
    } catch (error) {
      console.error(error);
      dispatch(
        showNotification({
          message:
            error?.data?.message ||
            error?.data?.error ||
            "No se pudo crear la caja",
          severity: "error",
        })
      );
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}>

      <Fade in={true}>
        <Box sx={getModalStyle(theme)}>
          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor:
                theme.palette.mode === "light"
                  ? alpha(theme.palette.grey[100], 0.72)
                  : alpha(theme.palette.common.white, 0.04),
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1,
                bgcolor: "#0F172A",
                color: theme.palette.common.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PointOfSale fontSize="small" />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                Crear caja
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asocia la nueva caja a una sucursal disponible.
              </Typography>
            </Box>

            <IconButton
              size="small"
              aria-label="Cerrar"
              onClick={onClose}
              sx={{
                borderRadius: "50%",
                color: "text.secondary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.text.primary, 0.08),
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
              }}
            >
              <FormControl
                fullWidth
                size="small"
                disabled={loadingSucursales || Boolean(error)}
              >
                <InputLabel id="sucursal-label">Sucursal</InputLabel>
                <Select
                  id="sucursal-select"
                  labelId="sucursal-label"
                  label="Sucursal"
                  name="sucursal"
                  value={idSucursal}
                  onChange={(e) => setIdSucursal(e.target.value)}
                  renderValue={(value) => {
                    const sucursal = sucursales?.find(
                      (item) =>
                        String(item.id_sucursal) === String(value)
                    );
                    return sucursal?.nombre || "Sucursal";
                  }}
                  sx={{
                    borderRadius: 1,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 1,
                        mt: 0.5,
                      },
                    },
                  }}
                >
                  {loadingSucursales ? (
                    <MenuItem disabled>Cargando sucursales...</MenuItem>
                  ) : error ? (
                    <MenuItem disabled>Error al cargar sucursales</MenuItem>
                  ) : sucursales?.length > 0 ? (
                    sucursales.map((sucursal) => (
                      <MenuItem
                        key={sucursal.id_sucursal}
                        value={sucursal.id_sucursal}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {sucursal.nombre}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {sucursal.direccion || "Sin dirección"}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No hay sucursales disponibles</MenuItem>
                  )}
                </Select>
              </FormControl>

              <Box
                sx={{
                  minHeight: 88,
                  border: "1px solid",
                  borderColor: selectedSucursal ? "divider" : "transparent",
                  borderRadius: 1,
                  bgcolor: selectedSucursal
                    ? alpha(theme.palette.primary.main, 0.04)
                    : alpha(theme.palette.text.primary, 0.04),
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1,
                    bgcolor: selectedSucursal
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.text.secondary, 0.1),
                    color: selectedSucursal
                      ? theme.palette.primary.main
                      : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <StorefrontOutlined fontSize="small" />
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.25,
                    }}
                  >
                    <Typography fontWeight={800} noWrap>
                      {selectedSucursal?.nombre || "Sucursal sin seleccionar"}
                    </Typography>
                    {selectedSucursal && (
                      <Chip
                        size="small"
                        label={`ID ${selectedSucursal.id_sucursal}`}
                        sx={{
                          height: 22,
                          borderRadius: 1,
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {selectedSucursal?.direccion ||
                      "Elige una sucursal para revisar el destino de la caja."}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 1.5,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              bgcolor:
                theme.palette.mode === "light"
                  ? alpha(theme.palette.grey[50], 0.8)
                  : alpha(theme.palette.common.white, 0.03),
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCrearCaja}
              disabled={isLoading || !idSucursal}
              sx={{
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
              }}
            >
              {isLoading ? "Creando..." : "Crear caja"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>);

};

CrearCajaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CrearCajaModal;
