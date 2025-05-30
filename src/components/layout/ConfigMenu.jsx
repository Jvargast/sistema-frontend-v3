import { useState } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "@mui/x-date-pickers";

const ConfigMenu = ({ onToggleTheme, onChangeLanguage, currentLang }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageMenuEl, setLanguageMenuEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const isLanguageMenuOpen = Boolean(languageMenuEl);
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setLanguageMenuEl(null);
  };

  const handleNavigateConfig = () => {
    navigate("/configuracion");
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="Abrir configuración"
        onClick={handleOpen}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <SettingsOutlinedIcon sx={{ fontSize: 26 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 220,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.paper
                : theme.palette.background.default,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            onToggleTheme();
            handleClose();
          }}
        >
          <ListItemIcon>
            <Brightness4OutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("general.theme")}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={(event) => setLanguageMenuEl(event.currentTarget)}>
          <ListItemIcon>
            <LanguageOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("general.language")}</ListItemText>
          <ArrowRightIcon fontSize="small" />
        </MenuItem>

        <Menu
          anchorEl={languageMenuEl}
          open={isLanguageMenuOpen}
          onClose={() => setLanguageMenuEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 2,
              minWidth: 180,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.background.paper
                  : theme.palette.background.default,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onChangeLanguage("es");
              handleClose();
            }}
          >
            <ListItemIcon>🇪🇸</ListItemIcon>
            <ListItemText
              sx={{
                fontWeight: currentLang === "es" ? "bold" : "normal",
                color:
                  currentLang === "es" ? theme.palette.primary.main : "inherit",
              }}
            >
              Español
            </ListItemText>
            {currentLang === "es" && <span>✔</span>}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onChangeLanguage("en");
              handleClose();
            }}
          >
            <ListItemIcon>🇬🇧</ListItemIcon>
            <ListItemText
              sx={{
                fontWeight: currentLang === "en" ? "bold" : "normal",
                color:
                  currentLang === "en" ? theme.palette.primary.main : "inherit",
              }}
            >
              English
            </ListItemText>
            {currentLang === "en" && <span>✔</span>}
          </MenuItem>
        </Menu>

        <Divider />

        <MenuItem onClick={handleNavigateConfig}>
          <ListItemIcon>
            <TuneOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("general.advanced_settings")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

ConfigMenu.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  onChangeLanguage: PropTypes.func.isRequired,
  currentLang: PropTypes.string.isRequired,
};

export default ConfigMenu;
