import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  TextField,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PublicIcon from "@mui/icons-material/Public";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BusinessIcon from "@mui/icons-material/Business";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import {
  setActiveSucursal,
  setScopeMode,
} from "../../store/reducers/scopeSlice";

export default function ScopeSwitcher() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const auth = useSelector((s) => s.auth);

  const isDark = theme.palette.mode === "dark";

  const TOKENS = {
    surface: isDark
      ? alpha(theme.palette.primary.main, 0.1)
      : theme.palette.background.paper,
    border:
      theme.palette.roles?.border ??
      (isDark ? alpha("#FFFFFF", 0.12) : alpha(theme.palette.divider, 0.6)),
    shadow: isDark
      ? "0 8px 24px rgba(0,0,0,0.25)"
      : "0 8px 24px rgba(2,6,23,0.06)",
    togglesBg: isDark
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.primary.main, 0.06),
    toggleSelectedBg: isDark
      ? alpha(theme.palette.primary.light, 0.95)
      : theme.palette.primary.main,
    toggleSelectedFg: theme.palette.primary.contrastText,
    surfaceMobile: isDark
      ? alpha(theme.palette.background.default, 0.25)
      : alpha(theme.palette.grey[100], 0.95),
    idleToggleBg: isDark ? alpha("#FFFFFF", 0.08) : alpha("#000000", 0.06),
    idleToggleFg: theme.palette.text.primary,
    inputBgMobile: isDark
      ? alpha(theme.palette.background.paper, 0.16)
      : theme.palette.background.paper,
    inputBgDesktop: isDark
      ? alpha("#FFFFFF", 0.06)
      : alpha(theme.palette.background.paper, 0.6),
    inputBorderMobile: isDark
      ? alpha("#FFFFFF", 0.12)
      : alpha(theme.palette.divider, 0.6),

    divider: isDark
      ? alpha("#FFFFFF", 0.14)
      : alpha(theme.palette.text.primary, 0.12),
  };

  const rolName = (
    typeof auth?.rol === "string" ? auth.rol : auth?.rol?.nombre || ""
  ).toLowerCase();
  const isAdmin = rolName === "administrador";

  const { data: sucData, isFetching } = useGetAllSucursalsQuery(undefined, {
    skip: !isAdmin,
  });

  const options = useMemo(() => {
    const arr = sucData?.items || sucData || [];
    return Array.isArray(arr) ? arr : [];
  }, [sucData]);

  const currentOption =
    options.find((o) => o.id_sucursal === activeSucursalId) || null;

  useEffect(() => {
    if (!isAdmin) {
      const fixedId = auth?.user?.id_sucursal ?? null;
      if (fixedId && fixedId !== activeSucursalId) {
        dispatch(setScopeMode("sucursal"));
        dispatch(setActiveSucursal(fixedId));
      }
    }
  }, [isAdmin, auth?.user?.id_sucursal, activeSucursalId, dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: isMobile ? "wrap" : "nowrap",
        width: isMobile ? "100%" : "auto",
        gap: isMobile ? 0.75 : 1,
        px: isMobile ? 0 : 1,
        py: isMobile ? 0 : 0.75,
        borderRadius: isMobile ? 2 : 999,
        bgcolor: isMobile ? TOKENS.surfaceMobile : TOKENS.surface,
        border: isMobile ? "none" : `1px solid ${TOKENS.border}`,
        boxShadow: isMobile ? "none" : TOKENS.shadow,
        backdropFilter: "none",
      }}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={mode}
        onChange={(_, v) => {
          if (!v) return;
          if (!isAdmin && v === "global") return;
          dispatch(setScopeMode(v));
          if (v === "sucursal" && !activeSucursalId && options[0]) {
            dispatch(setActiveSucursal(options[0].id_sucursal));
          }
        }}
        sx={(t) => ({
          bgcolor: isMobile ? "transparent" : TOKENS.togglesBg,
          borderRadius: 999,
          p: isMobile ? 0 : 0.25,
          width: isMobile ? "100%" : "auto",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            border: 0,
            borderRadius: 999,
            px: isMobile ? 0.75 : 1,
            py: 0.25,
            flex: isMobile ? 1 : "unset",
            "&.Mui-selected": {
              bgcolor: TOKENS.toggleSelectedBg,
              color: TOKENS.toggleSelectedFg,
              "&:hover": { bgcolor: TOKENS.toggleSelectedBg },
            },
            "& .MuiToggleButton-root:not(.Mui-selected)": {
              backgroundColor: TOKENS.idleToggleBg,
              color: TOKENS.idleToggleFg,
              "&:hover": {
                backgroundColor: alpha(TOKENS.idleToggleBg, 0.95),
              },
              "& .MuiSvgIcon-root": { opacity: 0.8 },
            },
            "& .MuiToggleButton-root.Mui-selected": {
              background: `linear-gradient(180deg, ${
                t.palette.primary.main
              } 0%, ${alpha(t.palette.primary.main, 0.92)} 100%)`,
              color: TOKENS.toggleSelectedFg,
              boxShadow: "0 4px 14px rgba(2,6,23,0.12)",
              "&:hover": {
                background: `linear-gradient(180deg, ${
                  t.palette.primary.main
                } 0%, ${alpha(t.palette.primary.main, 0.92)} 100%)`,
              },
              "& .MuiSvgIcon-root": { opacity: 1 },
            },

            "& .MuiToggleButton-root.Mui-focusVisible": {
              outline: `2px solid ${alpha(t.palette.primary.main, 0.35)}`,
              outlineOffset: 2,
            },
          },
        })}
      >
        <Tooltip title="Filtrar por una sucursal específica">
          <ToggleButton value="sucursal" disabled={!isAdmin}>
            <StorefrontIcon sx={{ fontSize: 18, mr: 0.5 }} />
            {!isMobile && "Sucursal"}
            {isMobile && "Sucursal"}
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Ver datos globales (todas las sucursales)">
          <ToggleButton value="global" disabled={!isAdmin}>
            <PublicIcon sx={{ fontSize: 18, mr: 0.5 }} />
            {!isMobile && "Global"}
            {isMobile && "Global"}
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      {!isMobile && (
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, borderColor: TOKENS.divider }}
        />
      )}

      <Autocomplete
        size="small"
        options={options}
        getOptionLabel={(o) => o?.nombre || `Sucursal ${o?.id_sucursal}`}
        value={currentOption}
        onChange={(_, value) => {
          dispatch(setActiveSucursal(value?.id_sucursal ?? null));
        }}
        loading={isFetching}
        loadingText="Cargando..."
        noOptionsText={isFetching ? "Cargando..." : "Sin sucursales"}
        disabled={mode !== "sucursal" || !isAdmin || isFetching}
        sx={(t) => ({
          minWidth: isMobile ? "100%" : 260,
          flex: isMobile ? "1 0 100%" : "unset",
          mt: isMobile ? 0.5 : 0,
          "& .MuiOutlinedInput-root": {
            height: 36,
            borderRadius: isMobile ? 2 : 999,
            backgroundColor: isMobile
              ? TOKENS.inputBgMobile
              : TOKENS.inputBgDesktop,
            paddingRight: 1,
            "& .MuiAutocomplete-input": {
              padding: "6px 4px",
              fontWeight: 600,
              letterSpacing: -0.1,
            },
            "& fieldset": {
              border: isMobile
                ? `1px solid ${TOKENS.inputBorderMobile}`
                : "none",
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 3px ${alpha(t.palette.primary.main, 0.22)}`,
            },
          },
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Selecciona sucursal"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <BusinessIcon sx={{ mr: 1, fontSize: 18, opacity: 0.75 }} />
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isFetching ? (
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        slotProps={{
          paper: {
            elevation: 0,
            sx: (t) => ({
              mt: 0.75,
              borderRadius: 2,
              border: `1px solid ${
                t.palette.roles?.border || "rgba(2,6,23,0.12)"
              }`,
              boxShadow: "0 12px 32px rgba(2,6,23,0.12)",
              overflow: "hidden",
              "& .MuiAutocomplete-option": {
                fontWeight: 600,
                letterSpacing: -0.1,
                "&:hover, &.Mui-focused": {
                  backgroundColor:
                    t.palette.mode === "light"
                      ? alpha(t.palette.primary.main, 0.06)
                      : alpha("#fff", 0.06),
                },
                "&.Mui-selected": {
                  backgroundColor:
                    t.palette.mode === "light"
                      ? alpha(t.palette.primary.main, 0.12)
                      : alpha("#fff", 0.12),
                },
              },
            }),
          },
        }}
      />
    </Box>
  );
}
