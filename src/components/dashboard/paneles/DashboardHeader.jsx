import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";

export default function DashboardHeader({ title, subtitle, onReset }) {
  return (
    <Paper
      elevation={0}
      sx={(t) => ({
        p: { xs: 1.25, sm: 1.75 },
        mb: 2.5,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        border: `1px solid ${t.palette.roles?.border || "rgba(2,6,23,0.06)"}`,
        background: t.palette.background.paper,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
        alignItems: "center",
        columnGap: 12,
        rowGap: 4,

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
          opacity: 0.28,
          WebkitMask:
            "linear-gradient(#000 0 0) top/100% 6px no-repeat, linear-gradient(#000 0 0)",
          mask: "linear-gradient(#000 0 0) top/100% 6px no-repeat, linear-gradient(#000 0 0)",
        },
      })}
    >
      <Box>
        <Breadcrumbs
          separator={
            <NavigateNextRoundedIcon fontSize="small" sx={{ opacity: 0.6 }} />
          }
          aria-label="breadcrumb"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            "& a": { color: "text.secondary" },
            mb: 0.25,
          }}
        >
          <Link
            underline="hover"
            href="#"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            <HomeRoundedIcon fontSize="small" />
            Inicio
          </Link>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mt: 0.25 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: -0.2, lineHeight: 1.15 }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          justifySelf: { xs: "end", sm: "end" },
          alignSelf: { xs: "start", sm: "center" },
        }}
      >
        {onReset ? (
          <Button
            variant="text"
            size="small"
            onClick={onReset}
            startIcon={<RefreshRoundedIcon />}
            sx={(t) => ({
              display: { xs: "none", sm: "inline-flex" },
              color: t.palette.text.secondary,
              fontWeight: 700,
              borderRadius: 2,
              px: 1,
              "&:hover": {
                backgroundColor:
                  t.palette.mode === "light"
                    ? alpha(
                        t.palette.background?.alt ||
                          t.palette.roles?.border ||
                          t.palette.primary.main,
                        0.25
                      )
                    : alpha("#ffffff", 0.08),
              },
              "&:focus-visible": {
                outline: `2px solid ${alpha(t.palette.primary.main, 0.35)}`,
                outlineOffset: 2,
              },
            })}
          >
            Restablecer
          </Button>
        ) : null}

        {onReset ? (
          <Tooltip title="Restablecer">
            <IconButton
              onClick={onReset}
              sx={(t) => ({
                display: { xs: "inline-flex", sm: "none" },
                color: "text.secondary",
                "&:hover": {
                  backgroundColor:
                    t.palette.mode === "light"
                      ? alpha(
                          t.palette.background?.alt ||
                            t.palette.roles?.border ||
                            t.palette.primary.main,
                          0.25
                        )
                      : alpha("#ffffff", 0.08),
                },
              })}
              aria-label="Restablecer"
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : null}

        <Tooltip title="Personalizar paneles">
          <IconButton
            color="inherit"
            sx={(t) => ({
              color: "text.secondary",
              "&:hover": {
                backgroundColor:
                  t.palette.mode === "light"
                    ? alpha(
                        t.palette.background?.alt ||
                          t.palette.roles?.border ||
                          t.palette.primary.main,
                        0.25
                      )
                    : alpha("#ffffff", 0.08),
              },
            })}
            aria-label="Personalizar paneles"
          >
            <TuneRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onReset: PropTypes.func,
};
