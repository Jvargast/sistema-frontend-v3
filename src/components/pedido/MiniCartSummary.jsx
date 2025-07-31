import {
  Badge,
  Typography,
  Paper,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const MiniCartSummary = ({ onOpenCart }) => {
  const cart = useSelector((state) => state.cart.items || []);
  const total = useSelector((state) => state.cart.total || 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const visible = !!cart.length;

  if (!visible) return null;

  return (
    <Slide in={visible} direction={isMobile ? "up" : "left"}>
      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          ...(isMobile
            ? {
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)", 
                left: "4vw",
                right: "4vw",
                top: "auto",
                transform: "none",
              }
            : {
                top: 90,
                right: 10,
                left: "auto",
                bottom: "auto",
                transform: "none",
              }),
          maxWidth: isMobile ? 420 : "auto",
          minWidth: isMobile ? 0 : 220,
          px: isMobile ? 2 : 3,
          py: isMobile ? 1.7 : 1.5,
          zIndex: 1500,
          borderRadius: isMobile ? "999px" : "999px",
          boxShadow: "0px 12px 36px 8px rgba(81,74,157,0.16)",
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: `linear-gradient(90deg, rgba(36,198,220,0.96) 0%, rgba(81,74,157,0.97) 100%)`,
          color: "#fff",
          cursor: "pointer",
          transition: "box-shadow .2s, background .2s",
          "&:hover": { boxShadow: "0px 16px 48px 12px rgba(81,74,157,0.18)" },
        }}
        onClick={onOpenCart}
      >
        <Badge badgeContent={totalItems} color="error" overlap="circular">
          <ShoppingCartIcon fontSize="medium" />
        </Badge>
        <Typography fontWeight={600} fontSize={16} sx={{ mx: 1 }}>
          {totalItems} producto{totalItems !== 1 ? "s" : ""}
        </Typography>
        <Typography fontWeight={700} fontSize={16}>
          ${total.toLocaleString("es-CL")}
        </Typography>
        <Typography fontWeight={600} ml={1} fontSize={15}>
          Ver carrito →
        </Typography>
      </Paper>
    </Slide>
  );
};

MiniCartSummary.propTypes = {
  onOpenCart: PropTypes.func.isRequired,
};

export default MiniCartSummary;
