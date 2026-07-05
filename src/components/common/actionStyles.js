import { alpha } from "@mui/material/styles";

const ACTION_DARK = "#0F172A";

export const primaryActionButtonSx = (theme, sx = {}) => ({
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  letterSpacing: 0,
  bgcolor: ACTION_DARK,
  color: theme.palette.common.white,
  boxShadow: "none",
  "&:hover": {
    bgcolor: theme.palette.common.black,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    bgcolor: alpha(ACTION_DARK, 0.16),
    color: alpha(theme.palette.text.primary, 0.4),
    boxShadow: "none",
  },
  ...sx,
});

export const secondaryActionButtonSx = (theme, sx = {}) => ({
  ...(() => {
    const neutral = theme.palette.mode === "dark"
      ? theme.palette.common.white
      : ACTION_DARK;

    return {
      borderRadius: 1,
      textTransform: "none",
      fontWeight: 800,
      letterSpacing: 0,
      color: theme.palette.text.primary,
      borderColor: alpha(neutral, theme.palette.mode === "dark" ? 0.26 : 0.28),
      "&:hover": {
        borderColor: alpha(neutral, theme.palette.mode === "dark" ? 0.52 : 1),
        bgcolor: alpha(neutral, theme.palette.mode === "dark" ? 0.08 : 0.04),
      },
      "&.Mui-disabled": {
        borderColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
      },
      ...sx,
    };
  })(),
});

export const textActionButtonSx = (theme, sx = {}) => ({
  ...(() => {
    const neutral = theme.palette.mode === "dark"
      ? theme.palette.common.white
      : ACTION_DARK;

    return {
      borderRadius: 1,
      textTransform: "none",
      fontWeight: 800,
      color: neutral,
      "&:hover": {
        bgcolor: alpha(neutral, theme.palette.mode === "dark" ? 0.08 : 0.06),
      },
      "&.Mui-disabled": {
        color: theme.palette.action.disabled,
      },
      ...sx,
    };
  })(),
});

export const darkSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: ACTION_DARK,
    "&:hover": {
      bgcolor: alpha(ACTION_DARK, 0.08),
    },
    "& + .MuiSwitch-track": {
      bgcolor: ACTION_DARK,
      opacity: 0.46,
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled": {
    color: alpha(ACTION_DARK, 0.28),
    "& + .MuiSwitch-track": {
      bgcolor: alpha(ACTION_DARK, 0.28),
    },
  },
};

export const darkFilledInputSx = {
  "& .MuiFilledInput-root": {
    borderRadius: 1,
    bgcolor: alpha(ACTION_DARK, 0.04),
    boxShadow: "none",
    ":hover": { bgcolor: alpha(ACTION_DARK, 0.06) },
    "&.Mui-focused": {
      bgcolor: alpha(ACTION_DARK, 0.08),
      boxShadow: `0 0 0 2px ${alpha(ACTION_DARK, 0.16)} inset`,
    },
  },
};

export const neutralStateChipSx = {
  color: ACTION_DARK,
  borderColor: alpha(ACTION_DARK, 0.28),
  bgcolor: alpha(ACTION_DARK, 0.04),
  fontWeight: 700,
};
