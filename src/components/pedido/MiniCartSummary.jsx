import {
  Badge,
  Typography,
  Paper,
  Slide,
  useTheme,
  useMediaQuery,
  Portal,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const MiniCartSummary = ({ onOpenCart }) => {
  const cart = useSelector((state) => state.cart.items || []);
  const total = useSelector((state) => state.cart.total || 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);

  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const visible = !!cart.length;

  if (!visible) return null;

  const container = typeof document !== "undefined" ? document.body : null;

  return (
    <Portal container={container}>
      <Slide in={visible} direction={isMdDown ? "down" : "left"}>
        <Paper
          elevation={isMdDown ? 6 : 10}
          sx={{
            position: "fixed",
            ...(isMdDown
              ? {
                  top: "calc(env(safe-area-inset-top, 0px) + 72px)",
                  right: "4vw",
                  left: "auto",
                  width: "clamp(180px, 56vw, 360px)",
                }
              : {
                  top: 100,
                  right: 12,
                }),
            maxWidth: isMdDown ? "none" : "auto",
            minWidth: isMdDown ? 0 : 220,
            px: isSmDown ? 1.25 : isMdDown ? 1.75 : 3,
            py: isSmDown ? 0.85 : isMdDown ? 1 : 1.5,
            zIndex: Math.max(theme.zIndex.modal + 10, 2100),
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: isSmDown ? 1 : 1.5,
            cursor: "pointer",
            background:
              "linear-gradient(90deg, rgba(36,198,220,0.9) 0%, rgba(81,74,157,0.92) 100%)",
            color: "#fff",
            backdropFilter: "saturate(140%) blur(6px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: isMdDown
              ? "0 8px 24px rgba(81,74,157,0.18)"
              : "0 12px 36px 8px rgba(81,74,157,0.16)",
            transition: "box-shadow .2s, transform .2s",
            "&:hover": {
              boxShadow: "0 14px 44px rgba(81,74,157,0.22)",
              transform: isMdDown ? "translateY(-2px)" : "translateX(-1px)",
            },
          }}
          onClick={onOpenCart}
        >
          <Badge
            badgeContent={totalItems}
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: isSmDown ? 10 : 11,
                height: isSmDown ? 16 : 18,
                minWidth: isSmDown ? 16 : 18,
              },
            }}
          >
            <ShoppingCartIcon fontSize={isMdDown ? "small" : "medium"} />
          </Badge>

          <Typography
            fontWeight={700}
            sx={{
              mx: 0.5,
              fontSize: isSmDown ? 13 : 14,
              whiteSpace: "nowrap",
            }}
          >
            {totalItems} producto{totalItems !== 1 ? "s" : ""}
          </Typography>

          <Typography
            fontWeight={800}
            sx={{
              fontSize: isSmDown ? 13 : 14,
              whiteSpace: "nowrap",
            }}
          >
            ${total.toLocaleString("es-CL")}
          </Typography>

          {!isSmDown && (
            <Typography fontWeight={700} ml={1} sx={{ fontSize: 14 }}>
              Ver carrito →
            </Typography>
          )}
        </Paper>
      </Slide>
    </Portal>
  );
};

MiniCartSummary.propTypes = {
  onOpenCart: PropTypes.func.isRequired,
};

export default MiniCartSummary;
