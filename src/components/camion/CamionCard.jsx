import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import { Edit, Delete, LocalShipping, PersonAdd } from "@mui/icons-material";
import PropTypes from "prop-types";
import InventarioCamion from "./InventarioCamion";
import { useState } from "react";
import AsignarChoferModal from "./AsignarChoferModal";
import EditarCamionModal from "./EditarCamionModal";

const CamionCard = ({ camion, onDelete, isDeleting }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
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
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <LocalShipping sx={{ mr: 1, color: "#1565C0" }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                p: { xs: 1, sm: 2 },
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
              }}
            >
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
          <InventarioCamion id_camion={camion.id_camion} />
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
};

export default CamionCard;
