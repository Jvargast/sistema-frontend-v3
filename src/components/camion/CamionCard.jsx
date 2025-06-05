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
  useTheme,
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
  const theme = useTheme();
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
        boxShadow: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        borderLeft: `6px solid ${
          camion.estado === "Disponible"
            ? theme.palette.success.main
            : camion.estado === "En Ruta"
            ? theme.palette.info.main
            : theme.palette.warning.main
        }`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.2}>
            <LocalShipping
              sx={{ color: theme.palette.primary.main, fontSize: 28 }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.secondary,
                fontSize: 16,
              }}
            >
              ID: {camion.id_camion}
            </Typography>
          </Box>
          {camion.id_chofer_asignado === null ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={() => setOpenModal(true)}
              sx={{
                fontWeight: 700,
                px: 2,
                py: 0.5,
                fontSize: 14,
                borderRadius: 2,
                boxShadow: "none",
                textTransform: "none",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.dark + "08"
                    : theme.palette.primary.light + "13",
              }}
            >
              Asignar Chofer
            </Button>
          ) : (
            <Box
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.dark + "12"
                    : theme.palette.info.light + "22",
                px: 2,
                py: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                minWidth: 150,
                gap: 1.2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.info.dark,
                    fontSize: 15,
                  }}
                >
                  Chofer: {camion.chofer?.nombre}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                  }}
                >
                  Rut: {camion.id_chofer_asignado}
                </Typography>
              </Box>
              <Tooltip title="Remover chofer">
                <IconButton
                  onClick={() => setOpen(true)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <RemoveCircleOutlineOutlinedIcon
                    sx={{ color: theme.palette.error.main }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.dark,
            textTransform: "uppercase",
            wordBreak: "break-word",
            fontSize: 19,
            mb: 0.5,
            letterSpacing: 1,
          }}
        >
          Patente: {camion.placa}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, mt: 0.5, fontSize: 15 }}
        >
          Capacidad:{" "}
          <b style={{ color: theme.palette.info.dark }}>{camion.capacidad}</b>{" "}
          elementos
        </Typography>
        <Box sx={{ mt: 2 }}>
          <InventarioCamion ref={inventarioRef} id_camion={camion.id_camion} />
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Tooltip title="Ver detalle visual" arrow>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenInventarioVisual(true)}
              startIcon={<Visibility />}
              sx={{
                color: theme.palette.info.main,
                fontWeight: 600,
                textTransform: "none",
                px: 2,
                borderRadius: 2,
                "&:hover": { background: theme.palette.info.light + "33" },
              }}
            >
              Ver Detalle Visual
            </Button>
          </Tooltip>
        </Box>

        {/* Estado - Pill Color */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Chip
            icon={
              camion.estado === "Disponible" ? (
                <LocalShipping />
              ) : camion.estado === "En Ruta" ? (
                <Visibility />
              ) : (
                <Edit />
              )
            }
            label={camion.estado}
            sx={{
              fontSize: 14,
              fontWeight: 700,
              px: 2,
              py: 1,
              borderRadius: 2,
              color:
                camion.estado === "Disponible"
                  ? theme.palette.success.dark
                  : camion.estado === "En Ruta"
                  ? theme.palette.warning.dark
                  : theme.palette.error.dark,
              backgroundColor:
                camion.estado === "Disponible"
                  ? theme.palette.success.light + "44"
                  : camion.estado === "En Ruta"
                  ? theme.palette.warning.light + "44"
                  : theme.palette.error.light + "44",
              letterSpacing: 1,
              textTransform: "capitalize",
            }}
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
          gap: 1.5,
          background:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
          zIndex: 1,
          p: { xs: 1, sm: 2 },
          width: "100%",
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          boxShadow: "none",
        }}
      >
        {/* Botón Editar */}
        <Button
          size="medium"
          variant="outlined"
          color="primary"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: 700,
            py: { xs: 1, sm: 1.1 },
            px: { xs: 1.5, sm: 2 },
            width: "100%",
            borderRadius: 2,
            boxShadow: "none",
            textTransform: "none",
            letterSpacing: 0.3,
            transition: "all 0.18s",
            "&:hover": {
              background: theme.palette.primary.light + "33",
              borderColor: theme.palette.primary.main,
            },
            "& .MuiButton-startIcon": {
              marginLeft: 0,
              marginRight: 0.5,
            },
          }}
          startIcon={<Edit />}
          onClick={() => setOpenEdit(true)}
          aria-label="Editar camión"
        >
          Editar
        </Button>

        {/* Botón Eliminar */}
        <Button
          size="medium"
          variant="contained"
          color="error"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: 700,
            py: { xs: 1, sm: 1.1 },
            px: { xs: 1.5, sm: 2 },
            width: "100%",
            borderRadius: 2,
            textTransform: "none",
            letterSpacing: 0.3,
            boxShadow: "none",
            transition: "all 0.18s",
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
            "& .MuiButton-startIcon": {
              marginLeft: 0,
              marginRight: 0.5,
            },
          }}
          startIcon={<Delete />}
          onClick={() => onDelete(camion.id_camion)}
          aria-label="Eliminar camión"
          disabled={isDeleting}
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
