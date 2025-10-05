// tokensDark (colores para modo oscuro):
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f6f6f6",
    50: "#5a8dd5",
    100: "#e0e0e0",
    200: "#d3d3d3",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  primary: {
    100: "#dee8f7",
    200: "#bdd1ee",
    300: "#9cbbe6",
    400: "#7ba4dd",
    450: "#6a94c4",
    500: "#5a8dd5",
    600: "#4870ab",
    700: "#365580",
    800: "#a2bce0",
    900: "#121c2b",
    1000: "#000000",
  },
  secondary: {
    50: "#fff9e6",
    100: "#fff2cc",
    200: "#ffe499",
    300: "#ffd666",
    400: "#ffc833",
    500: "#ffd166",
    600: "#000000", // Ajustado para evitar tonos repetidos
    700: "#b98d28",
    800: "#997026",
    900: "#332a14",
    1000: "#1f1f1f", // Ajustado para el contraste
  },
};

// Función que invierte los colores para modo claro:
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}

// tokensLight (colores para modo claro):
export const tokensLight = reverseTokens(tokensDark);

/**
 *
 * @param {("light"|"dark")} mode - Modo de color que deseas ("light" o "dark")
 * @param {string} userRole - Rol del usuario (p.e. "Administrador", "Gerente", etc.)
 * @returns Objeto de configuración de tema para createTheme()
 */
export const themeSettings = (mode, userRole) => {
  let palette = {};

  if (mode === "dark") {
    palette = {
      primary: {
        ...tokensDark.primary,
        main: tokensDark.primary[500],
        light: tokensDark.primary[400],
      },
      secondary: {
        ...tokensDark.secondary,
        main: tokensDark.secondary[500],
      },
      neutral: {
        ...tokensDark.grey,
        main: tokensDark.grey[500],
      },
      background: {
        default: tokensDark.primary[900],
        alt: tokensDark.primary[800],
        search: tokensDark.grey[800],
      },
      mode: "dark",
    };
  } else {
    palette = {
      primary: {
        ...tokensLight.primary,
        main: tokensLight.primary[500],
        light: tokensLight.primary[300],
        charts: tokensLight.primary[700],
      },
      secondary: {
        ...tokensLight.secondary,
        main: tokensLight.secondary[500],
        light: tokensLight.secondary[200],
      },
      neutral: {
        ...tokensLight.grey,
        main: tokensLight.grey[500],
      },
      background: {
        default: tokensLight.grey[1000],
        alt: tokensLight.grey[100],
        search: tokensLight.grey[200],
        charts: tokensLight.primary[800],
      },
      mode: "light",
    };
  }

  // Lógica del color para el sidebar según el userRole
  let sidebarColor;
  switch (userRole) {
    case "administrador":
      sidebarColor = palette.primary[500];
      break;
    case "vendedor":
      sidebarColor = "#2C3E50";
      break;
    case "usuario":
      sidebarColor = "#FFD700";
      break;
    default:
      sidebarColor = palette.background.alt;
      break;
  }

  palette.sidebar = {
    main: sidebarColor,
  };

  palette = {
    ...palette,
    roles: {
      border: "rgba(2,6,23,0.06)",
      grid: "rgba(2,6,23,0.08)",
      textMuted: "#64748b",
    },
    accents: {
      kpiBg:
        "linear-gradient(180deg, rgba(14,165,233,0.12), rgba(14,165,233,0.04))",
      kpiRing: "rgba(14,165,233,0.12)",
    },
  };

  return {
    palette,
    shape: { borderRadius: 16 },
    shadows: [
      "none",
      "0 1px 2px rgba(2,6,23,0.06), 0 1px 1px rgba(2,6,23,0.04)",
      "0 2px 8px rgba(2,6,23,0.06)",
      "0 8px 24px rgba(2,6,23,0.08)",
      ...Array(22).fill("0 2px 8px rgba(2,6,23,0.06)"),
    ],
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: "1px solid rgba(2,6,23,0.06)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: "1px solid rgba(2,6,23,0.06)",
            boxShadow: 2,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 10, fontWeight: 600 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 10, fontSize: 12 },
        },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: "rgba(2,6,23,0.08)" } },
      },
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
        letterSpacing: -0.5,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
        letterSpacing: -0.3,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        letterSpacing: -0.2,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        letterSpacing: -0.2,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        letterSpacing: -0.1,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
      subtitle1: { fontWeight: 600, fontSize: 14, color: "#0f172a" },
    },
  };
};
