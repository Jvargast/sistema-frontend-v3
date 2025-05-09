import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  LocalShipping,
  PersonAdd,
  Visibility,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import InventarioCamion from "./InventarioCamion";
import { useRef, useState } from "react";
import AsignarChoferModal from "./AsignarChoferModal";
import EditarCamionModal from "./EditarCamionModal";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AlertDialog from "../common/AlertDialog";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDesasignarChoferMutation } from "../../store/services/camionesApi";
import ModalInventarioCamion from "../inventario/ModalInventarioCamion";

const CamionCard = ({ camion, onDelete, isDeleting, onCamionUpdated }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openInventarioVisual, setOpenInventarioVisual] = useState(false);
  const inventarioRef = useRef(null);
  const dispatch = useDispatch();

  const [desasignarChofer] = useDesasignarChoferMutation();

  const handleDesasignarChofer = async () => {
    try {
      await desasignarChofer({ id: camion?.id_camion }).unwrap();
      dispatch(
        showNotification({
          message: "Chofer removido éxitosamente.",
          severity: "success",
          duration: 3000,
        })
      );
      setOpen(false);
    } catch (error) {
      dispatch(
        showNotification({
          message: `No se pudo desasignar, error: ${error?.data?.error}`,
          severity: "error",
          duration: 3000,
        })
      );
      setOpen(false);
    }
  };

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
        backgroundColor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mb: 1,
            gap: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <LocalShipping sx={{ mr: 1, color: "#1565C0" }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              ID: {camion.id_camion}
            </Typography>
          </Box>
          {camion.id_chofer_asignado === null ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={() => setOpenModal(true)}
              disableRipple
              sx={{
                fontSize: { xs: "0rem", sm: "0.65rem", md: "0.7rem" },
                fontWeight: "bold",
                py: { xs: 0.5, sm: 0.5, md: 0.7 },
                px: { xs: 0.5, sm: 1.5, md: 2 },
                width: "auto",
                height: "auto",
                minWidth: "unset",
                borderRadius: 2,
                borderColor: "#1976D2",
                color: "#000000",
                "&:hover": {
                  borderColor: "#115293",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "none",
              }}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                Asignar Chofer
              </Box>
            </Button>
          ) : (
            <Box
              sx={{
                backgroundColor: "#E3F2FD",
                padding: "8px",
                borderRadius: "8px",
                width: "fit-content",
                textAlign: "center",
                display: "flex",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#1565C0",
                  }}
                >
                  Chofer: {camion.chofer?.nombre}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>
                  Rut: {camion.id_chofer_asignado}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => setOpen(true)}>
                  <RemoveCircleOutlineOutlinedIcon sx={{ color: "red" }} />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            textTransform: "capitalize",
            wordBreak: "break-word",
          }}
        >
          Patente: {camion.placa}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
          Número de elementos: <strong>{camion.capacidad}</strong>
        </Typography>

        <Box sx={{ mt: { xs: 1, sm: 2 } }}>
          <InventarioCamion ref={inventarioRef} id_camion={camion.id_camion} />
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Tooltip title="Ver detalle visual" arrow>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpenInventarioVisual(true)}
              sx={{
                fontSize: { xs: "0", sm: "0.75rem" },
                textTransform: "none",
                px: 2,
                py: 0.8,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              startIcon={<Visibility />}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                Ver Detalle Visual
              </Box>
            </Button>
          </Tooltip>
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Chip
            label={camion.estado}
            color={
              camion.estado === "Disponible"
                ? "success"
                : camion.estado === "En Ruta"
                ? "warning"
                : "error"
            }
            sx={{ fontSize: "0.85rem", fontWeight: "bold", px: 1.5, py: 1 }}
          />
        </Box>
      </CardContent>

      <Divider />

      {/* Botones de Acción */}
      <CardActions
        disableSpacing
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.2,
          backgroundColor: "#F5F5F5",
          zIndex: 1,
          p: { xs: 1, sm: 1.5 },
          width: "100%",
        }}
      >
        <Button
          size="medium"
          variant="contained"
          disableRipple
          sx={{
            backgroundColor: "#1565C0",
            "&:hover": { backgroundColor: "#0D47A1" },
            fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
            fontWeight: "bold",
            py: { xs: 1, sm: 1.2 },
            px: { xs: 2, sm: 2.5 },
            width: "100%",
            "& .MuiButton-startIcon": {
              marginLeft: 0,
              marginRight: 0,
            },
          }}
          startIcon={<Edit />}
          onClick={() => setOpenEdit(true)}
          aria-label="Editar camión"
        >
          Editar
        </Button>
        <Button
          size="medium"
          variant="contained"
          color="error"
          disableRipple
          sx={{
            fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
            fontWeight: "bold",
            py: { xs: 1, sm: 1.2 },
            px: { xs: 2, sm: 2.5 },
            width: "100%",
            /* maxWidth: { xs: "100%", sm: "160px", md: "200px" }, */
            "& .MuiButton-startIcon": {
              marginLeft: 0,
              marginRight: 0,
            },
          }}
          startIcon={<Delete />}
          onClick={() => onDelete(camion.id_camion)}
          aria-label="Eliminar camión"
        >
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      </CardActions>
      <AsignarChoferModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        camionId={camion.id_camion}
      />
      <EditarCamionModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        camion={camion}
        onSuccess={() => {
          setOpenEdit(false);
          inventarioRef.current?.refetchInventario();
          onCamionUpdated?.();
        }}
      />
      <AlertDialog
        openAlert={open}
        onCloseAlert={() => setOpen(false)}
        onConfirm={handleDesasignarChofer}
        message="¿Estás seguro que deseas remover el chofer?"
        title="Remover Chofer"
      />
      <ModalInventarioCamion
        open={openInventarioVisual}
        onClose={() => setOpenInventarioVisual(false)}
        idCamion={camion.id_camion}
      />
    </Card>
  );
};


CamionCard.propTypes = {
  camion: PropTypes.shape({
    id_camion: PropTypes.number.isRequired,
    placa: PropTypes.string.isRequired,
    capacidad: PropTypes.number.isRequired,
    estado: PropTypes.string.isRequired,
    id_chofer_asignado: PropTypes.string,
    chofer: PropTypes.shape({
      nombre: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onCamionUpdated: PropTypes.func,
};

export default CamionCard;
