import { Card, CardContent, CardActions, Button, Chip, IconButton, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";
import { getActionIconButtonSx } from "../common/tableStyles";

const getStatusChipSx = (theme, estado) => {
  const tone =
    estado === "Disponible" ? "success" : estado === "En Ruta" ? "warning" : "error";
  const color = theme.palette[tone].main;

  return {
    height: 30,
    borderRadius: 1,
    color: theme.palette.mode === "dark" ? theme.palette.common.white : color,
    bgcolor: alpha(color, theme.palette.mode === "dark" ? 0.24 : 0.11),
    fontWeight: 800,
    fontSize: 13,
    boxShadow: "none",
    "& .MuiChip-icon": {
      color: "inherit",
      ml: 0.75,
    },
    "& .MuiChip-label": {
      px: 1,
    },
    flex: "0 0 auto",
  };
};

const CamionCard = ({ camion, onDelete, isDeleting, onCamionUpdated }) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openInventarioVisual, setOpenInventarioVisual] = useState(false);
  const inventarioRef = useRef(null);
  const dispatch = useDispatch();

  const [desasignarChofer] = useDesasignarChoferMutation();

  const {
    data: inventarioData,
    isLoading: isLoadingInventario,
    error: errorInventario,
    refetch: refetchInventario,
  } = useGetEstadoInventarioCamionQuery(camion?.id_camion);

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
      elevation={0}
      sx={(theme) => ({
        height: "100%",
        minWidth: 0,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 8px 22px rgba(15, 23, 42, 0.06)"
            : "0 8px 22px rgba(0, 0, 0, 0.28)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          borderColor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.42 : 0.18),
          boxShadow:
            theme.palette.mode === "light"
              ? "0 12px 28px rgba(15, 23, 42, 0.1)"
              : "0 12px 28px rgba(0, 0, 0, 0.36)",
        },
      })}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          pb: { xs: 1.25, sm: 1.5 },
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1.25,
            mb: 1.5,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            <Box
              sx={(theme) => ({
                width: 40,
                height: 40,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.28 : 0.07),
                color: theme.palette.mode === "dark" ? theme.palette.common.white : "#0F172A",
                flex: "0 0 auto",
              })}
            >
              <LocalShipping fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={800}
                sx={{ display: "block", lineHeight: 1.2 }}
              >
                Camión #{camion.id_camion}
              </Typography>
              <Typography
                variant="h6"
                title={camion.placa}
                noWrap
                sx={{
                  fontWeight: 900,
                  color: "text.primary",
                  fontSize: { xs: "1rem", sm: "1.12rem" },
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Patente {camion.placa}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={
              camion.estado === "Disponible" ? (
                <LocalShipping fontSize="small" />
              ) : camion.estado === "En Ruta" ? (
                <Visibility fontSize="small" />
              ) : (
                <Edit fontSize="small" />
              )
            }
            label={camion.estado}
            size="small"
            sx={getStatusChipSx(theme, camion.estado)}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 0.85fr) minmax(0, 1.15fr)" },
            gap: 1,
            alignItems: "stretch",
            mb: 1.5,
          }}
        >
          <Box
            sx={(theme) => ({
              minHeight: 44,
              borderRadius: 1,
              bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.2 : 0.04),
              px: 1.25,
              py: 0.85,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            })}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={800}>
              Capacidad
            </Typography>
            <Typography variant="body2" fontWeight={900} color="text.primary">
              {camion.capacidad} elementos
            </Typography>
          </Box>

          {camion.id_chofer_asignado ? (
            <Box
              sx={(theme) => ({
                minHeight: 44,
                px: 1.25,
                py: 0.85,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.info.main, theme.palette.mode === "dark" ? 0.22 : 0.08),
                color: theme.palette.mode === "dark" ? theme.palette.info.light : theme.palette.info.dark,
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              })}
            >
              <PersonAdd fontSize="small" sx={{ flex: "0 0 auto" }} />
              <Box sx={{ minWidth: 0, flex: "1 1 auto" }}>
                <Typography variant="caption" fontWeight={800} sx={{ display: "block" }}>
                  Chofer asignado
                </Typography>
                <Typography fontWeight={800} fontSize={14} noWrap title={camion.chofer?.nombre || ""}>
                  {camion.chofer?.nombre || "Sin nombre"}
                </Typography>
              </Box>
              <Tooltip title="Remover chofer">
                <IconButton
                  size="small"
                  onClick={() => setOpen(true)}
                  aria-label="Remover chofer"
                  sx={{ flex: "0 0 auto", color: theme.palette.error.main }}
                >
                  <RemoveCircleOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              onClick={() => setOpenModal(true)}
              fullWidth
              sx={{
                minHeight: 44,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 800,
                justifyContent: "flex-start",
              }}
            >
              Asignar chofer
            </Button>
          )}
        </Box>

        <Box sx={{ mt: "auto" }}>
          <InventarioCamion ref={inventarioRef} id_camion={camion.id_camion} />
        </Box>
        <Box display="flex" mt={1.5}>
          <Tooltip title="Ver detalle visual" arrow>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenInventarioVisual(true)}
              startIcon={<Visibility />}
              fullWidth
              sx={(theme) => ({
                minHeight: 38,
                color: theme.palette.mode === "dark" ? theme.palette.common.white : "#0F172A",
                bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.18 : 0.04),
                fontWeight: 800,
                textTransform: "none",
                px: 1.5,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.24 : 0.08),
                },
              })}
            >
              Ver detalle visual
            </Button>
          </Tooltip>
        </Box>
      </CardContent>

      <CardActions
        disableSpacing
        sx={(theme) => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.18 : 0.025),
          p: { xs: 1, sm: 1.25 },
          width: "100%",
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        })}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          Acciones
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => setOpenEdit(true)}
              aria-label="Editar camión"
              sx={getActionIconButtonSx(theme, "primary")}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={isDeleting ? "Eliminando..." : "Eliminar"}>
            <span>
              <IconButton
                size="small"
                onClick={() => onDelete(camion.id_camion)}
                aria-label="Eliminar camión"
                disabled={isDeleting}
                sx={getActionIconButtonSx(theme, "error")}
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </CardActions>

      <AsignarChoferModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        camionId={camion.id_camion}
        sucursalId={Number(camion.id_sucursal)}
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
        inventarioData={inventarioData}
        isLoading={isLoadingInventario}
        error={errorInventario}
        id_camion={camion.id_camion}
        estadoCamion={camion.estado}
        onInventarioUpdated={refetchInventario}
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
    id_sucursal: PropTypes.number
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onCamionUpdated: PropTypes.func,
};

export default CamionCard;
