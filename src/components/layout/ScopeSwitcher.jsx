import {
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
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
  startScopeTransition,
} from "../../store/reducers/scopeSlice";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";

const buildScopeTransitionId = (mode, sucursalId) =>
  `${Date.now()}-${mode}-${sucursalId ?? "global"}`;

const SCOPE_DARK = "#0F172A";

export default function ScopeSwitcher() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const isScopeChanging = useSelector(
    (s) => s.scope?.transition?.isChanging ?? false
  );
  const auth = useSelector((s) => s.auth);

  const isDark = theme.palette.mode === "dark";

  const TOKENS = {
    surface: isDark
      ? alpha(SCOPE_DARK, 0.92)
      : alpha("#FFFFFF", 0.94),
    border:
      theme.palette.roles?.border ??
      (isDark ? alpha("#FFFFFF", 0.14) : alpha(SCOPE_DARK, 0.12)),
    shadow: isDark
      ? "0 8px 24px rgba(0,0,0,0.25)"
      : "0 8px 24px rgba(2,6,23,0.06)",
    togglesBg: isDark
      ? alpha("#FFFFFF", 0.08)
      : alpha(SCOPE_DARK, 0.06),
    toggleSelectedBg: isMobile
      ? isDark
        ? alpha("#FFFFFF", 0.16)
        : "#FFFFFF"
      : SCOPE_DARK,
    toggleSelectedFg: isMobile && !isDark ? SCOPE_DARK : "#FFFFFF",
    surfaceMobile: "transparent",
    mobileControlBg: isDark ? alpha("#FFFFFF", 0.06) : alpha(SCOPE_DARK, 0.045),
    mobileControlBorder: isDark
      ? alpha("#FFFFFF", 0.12)
      : alpha(SCOPE_DARK, 0.12),
    idleToggleBg: isMobile
      ? isDark
        ? alpha("#FFFFFF", 0.07)
        : alpha(SCOPE_DARK, 0.04)
      : isDark
      ? alpha("#FFFFFF", 0.08)
      : alpha(SCOPE_DARK, 0.06),
    idleToggleHoverBg: isMobile
      ? isDark
        ? alpha("#FFFFFF", 0.1)
        : alpha(SCOPE_DARK, 0.08)
      : isDark
      ? alpha("#FFFFFF", 0.12)
      : alpha(SCOPE_DARK, 0.1),
    idleToggleFg: isMobile
      ? isDark
        ? alpha("#FFFFFF", 0.78)
        : alpha(SCOPE_DARK, 0.78)
      : isDark
      ? alpha("#FFFFFF", 0.86)
      : SCOPE_DARK,
    inputBgMobile: isDark ? alpha("#FFFFFF", 0.08) : alpha("#FFFFFF", 0.92),
    inputFgMobile: isDark ? "#FFFFFF" : SCOPE_DARK,
    inputMutedMobile: isDark ? alpha("#FFFFFF", 0.58) : alpha(SCOPE_DARK, 0.52),
    inputIconMobile: isDark ? alpha("#FFFFFF", 0.7) : alpha(SCOPE_DARK, 0.58),
    inputBgDesktop: isDark
      ? alpha("#FFFFFF", 0.08)
      : alpha("#FFFFFF", 0.86),
    inputFgDesktop: isDark ? alpha("#FFFFFF", 0.9) : SCOPE_DARK,
    inputMutedDesktop: isDark ? alpha("#FFFFFF", 0.58) : alpha(SCOPE_DARK, 0.56),
    inputIconDesktop: isDark ? alpha("#FFFFFF", 0.72) : alpha(SCOPE_DARK, 0.62),
    inputBorderMobile: isDark
      ? alpha("#FFFFFF", 0.14)
      : alpha(SCOPE_DARK, 0.12),
    popupBgMobile: isDark ? SCOPE_DARK : "#FFFFFF",
    popupFgMobile: isDark ? alpha("#FFFFFF", 0.9) : SCOPE_DARK,
    popupBorderMobile: isDark
      ? alpha("#FFFFFF", 0.12)
      : alpha(SCOPE_DARK, 0.12),
    popupHoverBgMobile: isDark ? alpha("#FFFFFF", 0.08) : alpha(SCOPE_DARK, 0.06),
    popupSelectedBgMobile: isDark
      ? alpha("#FFFFFF", 0.12)
      : alpha(SCOPE_DARK, 0.1),
    popupBg: isDark ? "#111827" : "#FFFFFF",
    popupFg: isDark ? alpha("#FFFFFF", 0.9) : SCOPE_DARK,
    popupHoverBg: isDark ? alpha("#FFFFFF", 0.08) : alpha(SCOPE_DARK, 0.06),
    popupSelectedBg: isDark ? alpha("#FFFFFF", 0.14) : alpha(SCOPE_DARK, 0.1),
    focusRing: isDark ? alpha("#FFFFFF", 0.18) : alpha(SCOPE_DARK, 0.16),

    divider: isDark
      ? alpha("#FFFFFF", 0.14)
      : alpha(SCOPE_DARK, 0.12),
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
    options.find((o) => Number(o.id_sucursal) === Number(activeSucursalId)) ||
    null;

  const getSucursalLabel = (id) => {
    if (!id) return "Sucursal";

    const sucursal = options.find(
      (option) => Number(option.id_sucursal) === Number(id)
    );

    return sucursal?.nombre || `Sucursal ${id}`;
  };

  const announceScopeChange = (targetMode, targetSucursalId) => {
    dispatch(
      startScopeTransition({
        requestId: buildScopeTransitionId(targetMode, targetSucursalId),
        targetLabel:
          targetMode === "global"
            ? "Vista global"
            : getSucursalLabel(targetSucursalId),
        targetMode,
      })
    );
  };

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
        borderRadius: isMobile ? "12px" : 999,
        bgcolor: isMobile ? TOKENS.surfaceMobile : TOKENS.surface,
        border: isMobile ? "none" : `1px solid ${TOKENS.border}`,
        boxShadow: isMobile ? "none" : TOKENS.shadow,
        backdropFilter: "none",
        transition: "box-shadow 180ms ease, border-color 180ms ease",
        ...(isScopeChanging && !isMobile
          ? {
              boxShadow: `${TOKENS.shadow}, 0 0 0 3px ${TOKENS.focusRing}`,
            }
          : {}),
      }}
      aria-busy={isScopeChanging ? "true" : undefined}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={mode}
        onChange={(_, v) => {
          if (!v) return;
          if (!isAdmin && v === "global") return;
          if (v === mode) return;

          const nextSucursalId =
            v === "sucursal"
              ? activeSucursalId || options[0]?.id_sucursal || null
              : null;

          announceScopeChange(v, nextSucursalId);
          dispatch(setScopeMode(v));
          if (v === "sucursal" && !activeSucursalId && options[0]) {
            dispatch(setActiveSucursal(options[0].id_sucursal));
          }
        }}
        sx={{
          bgcolor: isMobile ? TOKENS.mobileControlBg : TOKENS.togglesBg,
          border: isMobile ? `1px solid ${TOKENS.mobileControlBorder}` : 0,
          borderRadius: isMobile ? "10px" : 999,
          overflow: "hidden",
          p: isMobile ? 0.25 : 0.25,
          width: isMobile ? "100%" : "auto",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            border: 0,
            borderRadius: isMobile ? "8px" : 999,
            px: isMobile ? 1 : 1,
            py: isMobile ? 0.55 : 0.25,
            flex: isMobile ? 1 : "unset",
            minHeight: isMobile ? 34 : "auto",
            color: TOKENS.idleToggleFg,
            bgcolor: "transparent",
            fontWeight: 800,
            letterSpacing: 0,
            gap: 0.5,
            "&:hover": {
              bgcolor: TOKENS.idleToggleHoverBg,
            },
            "&.Mui-selected": {
              bgcolor: TOKENS.toggleSelectedBg,
              color: TOKENS.toggleSelectedFg,
              boxShadow: isMobile
                ? isDark
                  ? "none"
                  : "0 1px 3px rgba(15,23,42,0.12)"
                : "0 4px 14px rgba(2,6,23,0.12)",
              "&:hover": {
                bgcolor: TOKENS.toggleSelectedBg,
              },
              "& .MuiSvgIcon-root": { opacity: 1 },
            },
            ...(!isMobile
              ? {
                  "&.Mui-selected": {
                    background: `linear-gradient(180deg, ${SCOPE_DARK} 0%, ${alpha(
                      SCOPE_DARK,
                      0.92
                    )} 100%)`,
                    color: TOKENS.toggleSelectedFg,
                    "&:hover": {
                      background: `linear-gradient(180deg, ${SCOPE_DARK} 0%, ${alpha(
                        SCOPE_DARK,
                        0.92
                      )} 100%)`,
                    },
                  },
                }
              : {}),
            "& .MuiSvgIcon-root": {
              opacity: 0.86,
              color: "inherit",
            },
            "&.Mui-focusVisible": {
              outline: `2px solid ${
                isMobile
                  ? isDark
                    ? alpha("#FFFFFF", 0.28)
                    : alpha(SCOPE_DARK, 0.2)
                  : TOKENS.focusRing
              }`,
              outlineOffset: 2,
            },
          },
        }}
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
          const nextSucursalId = value?.id_sucursal ?? null;
          const currentId = activeSucursalId ?? null;

          if (Number(nextSucursalId) === Number(currentId)) return;

          announceScopeChange("sucursal", nextSucursalId);
          dispatch(setActiveSucursal(nextSucursalId));
        }}
        loading={isFetching || isScopeChanging}
        loadingText="Cargando..."
        noOptionsText={isFetching ? "Cargando..." : "Sin sucursales"}
        disabled={mode !== "sucursal" || !isAdmin || isFetching}
        sx={{
          minWidth: isMobile ? "100%" : 260,
          flex: isMobile ? "1 0 100%" : "unset",
          mt: isMobile ? 0.5 : 0,
          "& .MuiOutlinedInput-root": {
            height: 36,
            borderRadius: isMobile ? "10px" : 999,
            backgroundColor: isMobile
              ? TOKENS.inputBgMobile
              : TOKENS.inputBgDesktop,
            paddingRight: 1,
            color: isMobile ? TOKENS.inputFgMobile : TOKENS.inputFgDesktop,
            "& .MuiAutocomplete-input": {
              padding: "6px 4px",
              fontWeight: 800,
              letterSpacing: 0,
              color: isMobile ? TOKENS.inputFgMobile : TOKENS.inputFgDesktop,
              "&::placeholder": {
                color: isMobile
                  ? TOKENS.inputMutedMobile
                  : TOKENS.inputMutedDesktop,
                opacity: 1,
              },
            },
            "& fieldset": {
              border: isMobile
                ? `1px solid ${TOKENS.inputBorderMobile}`
                : "none",
            },
            "&.Mui-focused": {
              boxShadow: isMobile
                ? `0 0 0 2px ${
                    isDark ? alpha("#FFFFFF", 0.16) : alpha(SCOPE_DARK, 0.12)
                  }`
                : `0 0 0 3px ${TOKENS.focusRing}`,
              "& fieldset": {
                borderColor: isMobile
                  ? isDark
                    ? alpha("#FFFFFF", 0.28)
                    : alpha(SCOPE_DARK, 0.22)
                  : TOKENS.focusRing,
              },
            },
            "&.Mui-disabled": {
              bgcolor: isMobile
                ? isDark
                  ? alpha("#FFFFFF", 0.045)
                  : alpha(SCOPE_DARK, 0.035)
                : TOKENS.inputBgDesktop,
              color: isMobile
                ? isDark
                  ? alpha("#FFFFFF", 0.48)
                  : alpha(SCOPE_DARK, 0.42)
                : alpha(TOKENS.inputFgDesktop, 0.46),
              "& fieldset": {
                borderColor: isMobile
                  ? isDark
                    ? alpha("#FFFFFF", 0.08)
                    : alpha(SCOPE_DARK, 0.08)
                  : undefined,
              },
            },
            "& .MuiSvgIcon-root": {
              color: isMobile ? TOKENS.inputIconMobile : TOKENS.inputIconDesktop,
            },
          },
        }}
        renderInput={(params) => {
          const inputSlotProps = params.slotProps?.input || {};

          return (
            <TextField
              {...params}
              placeholder="Selecciona sucursal"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...inputSlotProps,
                  startAdornment: (
                    <>
                      <BusinessIcon
                        sx={{
                          mr: 1,
                          fontSize: 18,
                          opacity: 0.75,
                          color: isMobile
                            ? TOKENS.inputIconMobile
                            : TOKENS.inputIconDesktop,
                        }}
                      />
                      {inputSlotProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {isFetching || isScopeChanging ? (
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                      ) : null}
                      {inputSlotProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          );
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: (t) => ({
              mt: 0.75,
              borderRadius: isMobile ? "10px" : 2,
              border: `1px solid ${
                isMobile
                  ? TOKENS.popupBorderMobile
                  : t.palette.roles?.border || "rgba(2,6,23,0.12)"
              }`,
              bgcolor: isMobile ? TOKENS.popupBgMobile : TOKENS.popupBg,
              color: isMobile ? TOKENS.popupFgMobile : TOKENS.popupFg,
              boxShadow: isMobile
                ? "0 16px 34px rgba(0,0,0,0.36)"
                : "0 12px 32px rgba(2,6,23,0.12)",
              overflow: "hidden",
              "& .MuiAutocomplete-option": {
                fontWeight: 600,
                letterSpacing: 0,
                color: isMobile ? TOKENS.popupFgMobile : TOKENS.popupFg,
                "&:hover, &.Mui-focused": {
                  backgroundColor: isMobile
                    ? TOKENS.popupHoverBgMobile
                    : TOKENS.popupHoverBg,
                },
                "&.Mui-selected": {
                  backgroundColor: isMobile
                    ? TOKENS.popupSelectedBgMobile
                    : TOKENS.popupSelectedBg,
                },
              },
            }),
          },
        }}
      />
    </Box>
  );
}
