import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Box,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

const statusChip = (estado) => (
  <Chip
    size="small"
    icon={estado === "abierta" ? <LockOpenIcon /> : <LockIcon />}
    label={estado === "abierta" ? "Abierta" : "Cerrada"}
    variant="outlined"
    sx={{
      fontWeight: 600,
      textTransform: "capitalize",
      borderColor: estado === "abierta" ? "success.main" : "error.main",
    }}
  />
);

const getVendedorLabel = (vendedor) => {
  if (!vendedor) return null;
  if (typeof vendedor === "string") return `RUT: ${vendedor}`;
  const nombre = [vendedor?.nombre, vendedor?.apellido]
    .filter(Boolean)
    .join(" ");
  return nombre || vendedor?.rut || null;
};

const SelectCajaModal = ({
  open,
  onBack,
  cajas = [],
  onSelect,
  vendedor,
  isAdmin = false,
}) => {
  const [filtro, setFiltro] = useState("todas");

  const cajasFiltradas = useMemo(() => {
    if (filtro === "abiertas")
      return (cajas || []).filter((c) => c.estado === "abierta");
    if (filtro === "cerradas")
      return (cajas || []).filter((c) => c.estado === "cerrada");
    return cajas || [];
  }, [cajas, filtro]);

  const vacioMsg =
    filtro === "abiertas"
      ? "No hay cajas abiertas disponibles."
      : filtro === "cerradas"
      ? "No hay cajas cerradas."
      : "No hay cajas asignadas.";

  const vendedorLabel = getVendedorLabel(vendedor);

  const dialogContainer =
    typeof window !== "undefined" ? document.body : undefined;

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
      }}
      disableEscapeKeyDown
      fullWidth
      className="select-caja-modal"
      sx={{
        "& .MuiDialog-container": { borderRadius: 0 },
      }}
      maxWidth="sm"
      container={dialogContainer}
      PaperProps={{
        square: true,
        sx: {
          borderRadius: "14px",
          overflow: "hidden",
          border: (t) => `1px solid ${t.palette.divider}`,
        },
      }}
      BackdropProps={{
        sx: { borderRadius: 0 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1.5,
          background: "linear-gradient(90deg,#0ea5e9,#2563eb)",
          color: "white",
        }}
      >
        {
          /* isAdmin && ( */
          <IconButton
            size="small"
            onClick={onBack}
            sx={{ color: "white" }}
            aria-label="Volver a selección de vendedores"
          >
            <ArrowBackIcon />
          </IconButton>
          /*  ) */
        }
        Seleccionar Caja
        <Box flex={1} />
        {vendedorLabel && (
          <Chip
            size="small"
            label={`Usuario: ${vendedorLabel}`}
            sx={{ bgcolor: "rgba(255,255,255,.2)", color: "white" }}
          />
        )}
      </DialogTitle>

      <DialogContent dividers>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={filtro}
          onChange={(_, v) => v && setFiltro(v)}
          sx={{ mb: 2, borderRadius: 0 }}
        >
          <ToggleButton value="todas">Todas</ToggleButton>
          <ToggleButton value="abiertas">Abiertas</ToggleButton>
          <ToggleButton value="cerradas">Cerradas</ToggleButton>
        </ToggleButtonGroup>

        {cajasFiltradas.length === 0 ? (
          <Typography>{vacioMsg}</Typography>
        ) : (
          <List>
            {cajasFiltradas.map((caja) => (
              <div key={caja.id_caja}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => onSelect?.(caja)}
                    sx={{
                      borderLeft: "4px solid",
                      borderColor:
                        caja.estado === "abierta"
                          ? "success.main"
                          : "error.main",
                      ".MuiListItemText-primary": { fontWeight: 600 },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {`Caja #${caja.id_caja}`}
                          {statusChip(caja.estado)}
                        </Box>
                      }
                      secondary={`Sucursal: ${
                        caja?.sucursal?.nombre || "N/A"
                      } · Apertura: ${
                        caja.fecha_apertura
                          ? new Date(caja.fecha_apertura).toLocaleDateString()
                          : "—"
                      }`}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </DialogContent>

     {/*  <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button variant="text" onClick={onBack}>
          {isAdmin ? "Volver" : "Salir"}
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

SelectCajaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  cajas: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  vendedor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      rut: PropTypes.string,
      nombre: PropTypes.string,
      apellido: PropTypes.string,
    }),
  ]),
  isAdmin: PropTypes.bool,
};

export default SelectCajaModal;
