import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  Fade,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PublicIcon from "@mui/icons-material/Public";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import {
  finishScopeTransition,
  selectScopeTransition,
} from "../../store/reducers/scopeSlice";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const FEEDBACK_DURATION_MS = 760;

export default function ScopeTransitionOverlay() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const transition = useSelector(selectScopeTransition);
  const isOpen = Boolean(transition?.isChanging);
  const isGlobal = transition?.targetMode === "global";
  const targetLabel =
    transition?.targetLabel || (isGlobal ? "Vista global" : "Sucursal");

  useEffect(() => {
    if (!isOpen || !transition?.requestId) return undefined;

    const timer = window.setTimeout(() => {
      dispatch(
        finishScopeTransition({ requestId: transition.requestId })
      );
    }, FEEDBACK_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [dispatch, isOpen, transition?.requestId]);

  return (
    <Fade in={isOpen} timeout={{ enter: 180, exit: 180 }} unmountOnExit>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: "fixed",
          top: { xs: 72, md: 78 },
          right: { xs: 12, sm: 24 },
          left: { xs: 12, sm: "auto" },
          zIndex: (t) => t.zIndex.snackbar,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={(t) => ({
            width: isMobile ? "100%" : 340,
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: 1,
            border: `1px solid ${
              t.palette.mode === "light"
                ? alpha(t.palette.primary.main, 0.22)
                : alpha(t.palette.primary.light, 0.22)
            }`,
            bgcolor:
              t.palette.mode === "light"
                ? alpha(t.palette.background.paper, 0.96)
                : alpha(t.palette.background.paper, 0.92),
            color: t.palette.text.primary,
            boxShadow:
              t.palette.mode === "light"
                ? "0 16px 36px rgba(15,23,42,0.18)"
                : "0 16px 36px rgba(0,0,0,0.42)",
            backdropFilter: "blur(10px)",
          })}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "32px minmax(0, 1fr) 22px",
              alignItems: "center",
              gap: 1.25,
              px: 1.5,
              py: 1.25,
            }}
          >
            <Box
              sx={(t) => ({
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                borderRadius: 1,
                bgcolor:
                  t.palette.mode === "light"
                    ? alpha(t.palette.primary.main, 0.1)
                    : alpha(t.palette.primary.light, 0.16),
                color:
                  t.palette.mode === "light"
                    ? t.palette.primary.main
                    : t.palette.primary.light,
              })}
            >
              {isGlobal ? (
                <PublicIcon sx={{ fontSize: 19 }} />
              ) : (
                <StorefrontIcon sx={{ fontSize: 19 }} />
              )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                <SyncAltIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 11,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Cambiando alcance
                </Typography>
              </Box>
              <Typography
                noWrap
                sx={{
                  mt: 0.25,
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1.25,
                }}
              >
                {targetLabel}
              </Typography>
            </Box>

            <CircularProgress size={20} thickness={5} />
          </Box>
          <LinearProgress
            sx={(t) => ({
              height: 3,
              bgcolor:
                t.palette.mode === "light"
                  ? alpha(t.palette.primary.main, 0.12)
                  : alpha(t.palette.primary.light, 0.14),
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  t.palette.mode === "light"
                    ? t.palette.primary.main
                    : t.palette.primary.light,
              },
            })}
          />
        </Box>
      </Box>
    </Fade>
  );
}
