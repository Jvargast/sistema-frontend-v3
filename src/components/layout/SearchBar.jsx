import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  InputBase,
  IconButton,
  CircularProgress,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Search } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useSearchQuery } from "../../store/services/busquedaApi";

const SearchBar = ({ onResultSelect }) => {
  const navigate = useNavigate();

  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useSearchQuery(query, {
    skip: query.length < 2,
  });

  const safeResultados = Array.isArray(data?.resultados) ? data.resultados : [];
  const safeSugerencias = Array.isArray(data?.sugerencias)
    ? data.sugerencias
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (safeResultados.length > 0) onResultSelect?.(safeResultados);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    const handleEsc = (e) => e.key === "Escape" && setShowDropdown(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: "100%", sm: 600, md: 800, lg: 1000, xl: 1200 },
        mx: "auto",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        role="search"
        aria-label="Buscar"
        sx={(t) => ({
          display: "flex",
          alignItems: "center",
          width: "100%",
          px: 2,
          py: 1,
          minHeight: 44,
          borderRadius: 9999,
          backgroundColor:
            t.palette.mode === "light"
              ? t.palette.background.paper
              : t.palette.background.default,
          border: `1px solid ${t.palette.roles?.border || "rgba(2,6,23,0.12)"}`,
          transition: "box-shadow .2s ease, border-color .2s ease",
          "&:focus-within": {
            boxShadow: `0 0 0 3px rgba(59,130,246,0.30)`, 
            borderColor: "#3B82F6",
          },
        })}
      >
        <InputBase
          placeholder="Buscar..."
          inputProps={{ "aria-label": "Buscar contenido" }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          sx={(t) => ({
            flexGrow: 1,
            color: t.palette.text.primary,
            "& input::placeholder": {
              color: t.palette.text.secondary,
              opacity: 1,
            },
            fontSize: "0.95rem",
          })}
        />

        <IconButton
          type="submit"
          aria-label="Realizar búsqueda"
          sx={(t) => ({
            color: t.palette.text.secondary,
            "&:hover": {
              backgroundColor:
                t.palette.mode === "light"
                  ? alpha(t.palette.primary.main, 0.08)
                  : alpha("#fff", 0.08),
            },
          })}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Search />
          )}
        </IconButton>
      </Box>

      {showDropdown &&
        (safeResultados.length > 0 || safeSugerencias.length > 0) && (
          <Paper
            ref={dropdownRef}
            elevation={0}
            sx={(t) => ({
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 1300, 
              borderRadius: 3,
              bgcolor: t.palette.background.paper,
              border: `1px solid ${
                t.palette.roles?.border || "rgba(2,6,23,0.12)"
              }`,
              boxShadow: "0 12px 32px rgba(2,6,23,0.12)",
              overflow: "hidden",
              maxHeight: 360,
            })}
          >
            <List
              sx={{
                py: 0.5,
                overflowY: "auto",
                maxHeight: 360,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(100,100,100,0.35)",
                  borderRadius: 3,
                },
              }}
            >
              {safeResultados.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 1.5,
                    color: "text.disabled",
                    fontWeight: 700,
                  }}
                >
                  Sin resultados
                </Typography>
              ) : (
                safeResultados.map((item) => (
                  <ListItemButton
                    key={`${item.tipo}-${item.id}`}
                    onClick={() => {
                      setShowDropdown(false);
                      navigate(`/${item.tipo}/ver/${item.id}`);
                    }}
                    sx={(t) => ({
                      mx: 0.5,
                      my: 0.25,
                      borderRadius: 2,
                      alignItems: "flex-start",
                      gap: 1,
                      "&:hover": {
                        backgroundColor:
                          t.palette.mode === "light"
                            ? alpha(t.palette.primary.main, 0.06)
                            : alpha("#fff", 0.06),
                      },
                    })}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {item.nombre}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            ({item.tipo}) · ID: {item.id}
                          </Typography>
                        </>
                      }
                    />
                    {(item.total !== null || item.fecha !== null) && (
                      <Box
                        sx={{
                          textAlign: "right",
                          minWidth: 120,
                          ml: 2,
                          pt: 0.25,
                        }}
                      >
                        {item.total !== null && (
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {new Intl.NumberFormat("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            }).format(item.total)}
                          </Typography>
                        )}
                        {item.fecha !== null && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.fecha).toLocaleDateString("es-CL")}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </ListItemButton>
                ))
              )}

              {safeSugerencias.length > 0 && (
                <>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography
                    variant="overline"
                    sx={{
                      px: 2,
                      py: 0.75,
                      color: "text.secondary",
                      letterSpacing: 1,
                    }}
                  >
                    Sugerencias
                  </Typography>
                  {safeSugerencias.map((item) => (
                    <ListItemButton
                      key={`${item.tipo}-${item.id}`}
                      onClick={() => {
                        setShowDropdown(false);
                        onResultSelect?.(item);
                      }}
                      sx={(t) => ({
                        mx: 0.5,
                        my: 0.25,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor:
                            t.palette.mode === "light"
                              ? alpha(t.palette.primary.main, 0.06)
                              : alpha("#fff", 0.06),
                        },
                      })}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {item.nombre}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            ({item.tipo})
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                </>
              )}
            </List>
          </Paper>
        )}

      {isError && (
        <Typography
          color="error"
          variant="caption"
          sx={{ position: "absolute", mt: 1 }}
        >
          ❌ Error al buscar
        </Typography>
      )}
    </Box>
  );
};

SearchBar.propTypes = {
  onResultSelect: PropTypes.func,
};

export default SearchBar;
