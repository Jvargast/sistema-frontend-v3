// tokensDark (colores para modo oscuro):
export const tokensDark = {
    grey: {
      0: "#ffffff",
      10: "#f6f6f6",
      50: "#5a8dd5",
      100: "#e0e0e0",
      200: "#d3d3d3", // Corregido para evitar valores duplicados
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
      450: "#6a94c4", // Ajustado para mayor contraste
      500: "#5a8dd5",
      600: "#4870ab", // Corregido para consistencia
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
   * themeSettings
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
  
    return {
      palette,
      typography: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
  };
  