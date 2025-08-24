import PropTypes from "prop-types";
import { Box, Paper, Chip, Tooltip, CircularProgress } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";
import MissingInsumosDialog from "./MissingInsumosDialog";

const FloatingStockBadge = ({
  insumos = [],
  loading = false,
  sucursalNombre,
  sucursalId,
}) => {
  const [open, setOpen] = useState(false);
  const distintos = new Set(insumos.map((i) => i.id)).size;
  const cubiertos = insumos.filter(
    (i) => Number(i.stock) >= Number(i.requerido)
  ).length;
  const faltantes = Math.max(distintos - cubiertos, 0);

  const missingFull = insumos
    .filter((i) => Number(i.stock) < Number(i.requerido))
    .map((i) => {
      const req = Number(i.requerido) || 0;
      const stk = Number(i.stock) || 0;
      return {
        id: i.id,
        name: i?.nombre || `#${i.id}`,
        requerido: req,
        stock: stk,
        deficit: Math.max(req - stk, 0),
      };
    })
    .sort((a, b) => b.deficit - a.deficit);
  const missingList = missingFull.slice(0, 6);

  return (
    <Box
      sx={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: (t) => t.zIndex.modal + 1,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 1,
          borderRadius: 999,
          display: "flex",
          gap: 1.2,
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress size={18} />
        ) : (
          <Inventory2OutlinedIcon color="action" fontSize="small" />
        )}
        <Chip
          icon={<CheckCircleOutlineIcon />}
          label={`${cubiertos}/${distintos}`}
          size="small"
          color="success"
          variant="filled"
          onClick={() => faltantes && setOpen(true)}
          sx={{ cursor: faltantes ? "pointer" : "default" }}
        />
        <Tooltip
          title={
            faltantes ? (
              <Box sx={{ whiteSpace: "pre-line" }}>
                {missingList
                  .map(
                    (m) =>
                      `${m.name}: falta ${m.deficit} (tiene ${m.stock} / requiere ${m.requerido})`
                  )
                  .join("\n")}
                {missingFull.length > missingList.length
                  ? `\n+${missingFull.length - missingList.length} más…`
                  : ""}
              </Box>
            ) : (
              "Todo cubierto"
            )
          }
        >
          <span>
            <Chip
              icon={<ErrorOutlineIcon />}
              label={faltantes}
              size="small"
              color={faltantes ? "error" : "default"}
              variant={faltantes ? "filled" : "outlined"}
              onClick={() => faltantes && setOpen(true)}
              sx={{ cursor: faltantes ? "pointer" : "default" }}
            />
          </span>
        </Tooltip>
      </Paper>
      <MissingInsumosDialog
        open={open}
        onClose={() => setOpen(false)}
        items={missingFull}
        sucursalNombre={sucursalNombre}
        sucursalId={sucursalId}
      />
    </Box>
  );
};

FloatingStockBadge.propTypes = {
  insumos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nombre: PropTypes.string,
      stock: PropTypes.number.isRequired,
      requerido: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
  sucursalNombre: PropTypes.string,
  sucursalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FloatingStockBadge;
