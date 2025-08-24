import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const MissingInsumosDialog = ({
  open,
  onClose,
  items = [],
  sucursalNombre,
  sucursalId,
}) => {
  const rows = [...items].sort(
    (a, b) => (Number(b.deficit) || 0) - (Number(a.deficit) || 0)
  );
  const totalDeficit = rows.reduce((s, r) => s + (Number(r.deficit) || 0), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ErrorOutlineIcon color="error" />
          <Typography variant="h6" fontWeight={800}>
            Faltantes de insumos
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip
            size="small"
            icon={<StorefrontOutlinedIcon />}
            label={sucursalNombre || `ID ${sucursalId ?? "—"}`}
            variant="outlined"
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Revisa el detalle de insumos con stock insuficiente para el lote
          solicitado.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1.5 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            mb: 1.5,
            p: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: (t) =>
              t.palette.mode === "light" ? "grey.50" : "grey.900",
          }}
        >
          <Chip
            size="small"
            color="error"
            icon={<ErrorOutlineIcon />}
            label={`Faltantes: ${rows.length}`}
          />
          <Chip
            size="small"
            color="warning"
            icon={<Inventory2OutlinedIcon />}
            label={`Déficit total: ${totalDeficit}`}
          />
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Mostrando {rows.length} ítem(s)
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <Table
          size="small"
          sx={{
            "& thead th": {
              bgcolor: (t) =>
                t.palette.mode === "light" ? "grey.100" : "grey.800",
              fontWeight: 700,
            },
            "& td, & th": { borderBottomColor: "divider" },
            "& tbody tr:hover": {
              bgcolor: (t) =>
                t.palette.mode === "light" ? "grey.50" : "grey.900",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Insumo</TableCell>
              <TableCell align="right">Requerido</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Déficit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      size="small"
                      color="error"
                      variant="outlined"
                      label="Falta"
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {m.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{m.requerido}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{m.stock}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    size="small"
                    color="error"
                    label={`-${m.deficit}`}
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay faltantes 🤘
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

MissingInsumosDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      requerido: PropTypes.number,
      stock: PropTypes.number,
      deficit: PropTypes.number,
    })
  ),
  sucursalNombre: PropTypes.string,
  sucursalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default MissingInsumosDialog;
