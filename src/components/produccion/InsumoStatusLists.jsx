import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Box from "../common/CompatBox";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";

const InsumoStatusList = ({ items = [] }) => (
  <Box sx={{ mt: 1 }}>
    {items.map((i) => {
      const ok = Number(i.stock) >= Number(i.requerido);
      const InfoIcon = ok ? CheckCircleOutlineOutlinedIcon : CancelOutlinedIcon;
      const color = ok ? "success.main" : "error.main";

      return (
        <Stack
          key={i.id}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ py: 0.5 }}
        >
          <InfoIcon sx={{ fontSize: 18, color }} />
          <Typography variant="body2" sx={{ flex: 1 }}>
            {i.nombre}
          </Typography>
          <Tooltip
            title={`Stock: ${i.stock} / Requerido: ${i.requerido} ${
              i.unidad || ""
            }`}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 96, textAlign: "right" }}
            >
              {i.stock} / {i.requerido} {i.unidad || ""}
            </Typography>
          </Tooltip>
        </Stack>
      );
    })}
  </Box>
);

InsumoStatusList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nombre: PropTypes.string,
      unidad: PropTypes.string,
      stock: PropTypes.number,
      requerido: PropTypes.number,
    })
  ),
};

export default InsumoStatusList;
