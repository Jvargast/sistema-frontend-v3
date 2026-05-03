import Dialog from "../common/CompatDialog";
import { DialogTitle, DialogContent, IconButton, Slide, CircularProgress, Alert, FormControlLabel, Checkbox, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PropTypes from "prop-types";
import InventarioCamion from "./InventarioCamion";
import { useVaciarCamionMutation } from "../../store/services/inventarioCamionApi";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const Transition = Slide;

const ModalInventarioCamion = ({
  open,
  onClose,
  inventarioData,
  isLoading,
  error,
  id_camion,
  estadoCamion,
  onInventarioUpdated
}) => {
  const dispatch = useDispatch();
  const [descargarDisponibles, setDescargarDisponibles] = useState(true);
  const [descargarRetorno, setDescargarRetorno] = useState(true);
  const [vaciarCamion, { isLoading: vaciando }] = useVaciarCamionMutation();
  const estadoCamionNormalizado = String(estadoCamion || "").trim().toLowerCase();
  const vaciadoBloqueadoPorEstado =
    estadoCamionNormalizado === "en ruta" ||
    estadoCamionNormalizado === "mantenimiento";

  const handleVaciar = async () => {
    if (vaciadoBloqueadoPorEstado) {
      dispatch(
        showNotification({
          message: `No puedes vaciar manualmente un camión en estado ${estadoCamion}.`,
          severity: "warning"
        })
      );
      return;
    }

    try {
      await vaciarCamion({
        id_camion,
        descargarDisponibles,
        descargarRetorno
      }).unwrap();
      dispatch(
        showNotification({
          message: "Camión vaciado correctamente",
          severity: "success"
        })
      );
      if (typeof onInventarioUpdated === "function") {
        onInventarioUpdated();
      }

      onClose();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "Error al vaciar camión",
          severity: "error"
        })
      );
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: (theme) => ({
          borderRadius: { xs: 0, sm: 2 },
          boxShadow: "0 18px 48px rgba(15, 23, 42, 0.18)",
          overflow: "hidden",
          backgroundColor:
          theme.palette.mode === "dark" ?
          theme.palette.background.default :
          theme.palette.background.paper
        })
      }}>

      <DialogTitle
        sx={(theme) => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.25, sm: 1.5 },
          borderBottom: `1px solid ${theme.palette.divider}`

        })}>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.25 },
            minWidth: 0,
            flex: "1 1 auto",
            flexWrap: "wrap",
            pr: 1
          }}
        >
          <Box
            sx={(theme) => ({
              width: 36,
              height: 36,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.28 : 0.08),
              color: theme.palette.mode === "dark" ? theme.palette.common.white : "#0F172A",
              flex: "0 0 auto"
            })}
          >
            <InventoryOutlinedIcon fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={900}
            sx={{
              fontSize: { xs: "1.18rem", sm: "1.34rem" },
              lineHeight: 1.15,
              whiteSpace: { xs: "normal", sm: "nowrap" }
            }}
          >
            Detalle visual del inventario
          </Typography>
          <Typography
            variant="body2"
            sx={(theme) => ({
              px: 0.85,
              py: 0.25,
              borderRadius: 1,
              bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.18 : 0.06),
              color: theme.palette.text.secondary,
              fontWeight: 800,
              whiteSpace: "nowrap"
            })}
          >
            Camión #{id_camion}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={(theme) => ({
            borderRadius: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.primary,
              backgroundColor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.22 : 0.07)
            }
          })}>

          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={(theme) => ({
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
          background: theme.palette.background.paper
        })}>

        {isLoading ?
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={180}>

            <CircularProgress />
          </Box> :
        error ?
        <Alert severity="error">
            Error al obtener el inventario del camión
          </Alert> :

        inventarioData &&
        <InventarioCamion
          inventarioData={inventarioData.data}
          modo="visual"
          productos={[]}
          productosReservados={[]}
          onValidezCambio={() => {}} />


        }

        {inventarioData &&
        <Box sx={{ mt: 3 }}>
            {vaciadoBloqueadoPorEstado &&
          <Alert severity="warning" sx={{ mb: 2 }}>
              No puedes vaciar manualmente este camión mientras está en estado{" "}
              <strong>{estadoCamion}</strong>.
            </Alert>
          }
            <FormControlLabel
            control={
            <Checkbox
              checked={descargarDisponibles}
              onChange={(e) => setDescargarDisponibles(e.target.checked)} />

            }
            label="Descargar disponibles" />

            <FormControlLabel
            control={
            <Checkbox
              checked={descargarRetorno}
              onChange={(e) => setDescargarRetorno(e.target.checked)} />

            }
            label="Descargar retorno" />

            <Box mt={2}>
              <Button
              variant="contained"
              onClick={handleVaciar}
              disabled={vaciando || vaciadoBloqueadoPorEstado}>

                {vaciando ? "Vaciando..." : "Vaciar Camión"}
              </Button>
            </Box>
          </Box>
        }
      </DialogContent>
    </Dialog>);

};

ModalInventarioCamion.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  inventarioData: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  id_camion: PropTypes.number.isRequired,
  estadoCamion: PropTypes.string,
  onInventarioUpdated: PropTypes.func
};

export default ModalInventarioCamion;
