import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBase, IconButton, CircularProgress, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useSearchQuery } from "../../store/services/busquedaApi";

const SearchBar = ({ onResultSelect }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = useSearchQuery(query, {
    skip: query.length < 2,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data && data.resultados.length > 0) {
      onResultSelect(data.resultados);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "600px",
          md: "800px",
          lg: "1000px",
          xl: "1200px",
        },
        margin: "0 auto",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="flex items-center w-full rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode == "dark" ? "#1e1e1e" : "#ffffff",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "#444444" : "#000000",
          display: "flex",
          alignItems: "center",
          width: "100%",
          px: 2,
          py: 0.5,
          minHeight: "36px",
          borderRadius: "9999px",
          transition: "box-shadow 0.2s ease-in-out",
          "&:focus-within": {
            boxShadow: "0 0 0 3px rgba(0,123,255,0.3)",
            borderColor: "transparent",
          },
        }}
      >
        <InputBase
          placeholder="Buscar..."
          inputProps={{ "aria-label": "Buscar contenido" }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          sx={{
            flexGrow: 1,
            color: (theme) =>
              theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            "& input::placeholder": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#f4f4f4" : "#666666",
              opacity: 1,
            },
            fontSize: "0.9rem",
          }}
        />
        <IconButton type="submit" className="text-blue-500">
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Search />
          )}
        </IconButton>
      </Box>

      {/* Desplegable de resultados */}
      {showDropdown &&
        data &&
        (data.resultados.length > 0 || data.sugerencias.length > 0) && (
          <div
            ref={dropdownRef}
            className="absolute bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl mt-2 w-full max-h-64 overflow-y-auto shadow-xl z-50 custom-scroll"
          >
            {data.resultados.length > 0 ? (
              data.resultados.map((item) => (
                <div
                  key={`${item.tipo}-${item.id}`}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition flex justify-between items-center"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(`/${item.tipo}/ver/${item.id}`);
                  }}
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.nombre}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ({item.tipo})
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      ID: {item.id}
                    </div>
                  </div>

                  {(item.total !== null || item.fecha !== null) && (
                    <div className="text-right ml-4 min-w-[120px]">
                      {item.total !== null && (
                        <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                          {new Intl.NumberFormat("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          }).format(item.total)}
                        </div>
                      )}
                      {item.fecha !== null && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.fecha).toLocaleDateString("es-CL")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-300 dark:text-gray-400">
                Sin resultados
              </div>
            )}

            {data.sugerencias.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs uppercase text-gray-400 dark:text-gray-500">
                  Sugerencias
                </div>
                {data.sugerencias.map((item) => (
                  <div
                    key={`${item.tipo}-${item.id}`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition flex justify-between items-center"
                    onClick={() => onResultSelect(item)}
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {item.nombre}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ({item.tipo})
                      </div>
                    </div>

                    {(item.total !== null || item.fecha !== null) && (
                      <div className="text-right ml-4 min-w-[120px]">
                        {item.total !== null && (
                          <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                            {new Intl.NumberFormat("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            }).format(item.total)}
                          </div>
                        )}
                        {item.fecha !== null && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.fecha).toLocaleDateString("es-CL")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

      {isError && (
        <div className="absolute text-red-500 text-sm mt-1">
          ❌ Error al buscar
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.4);
          border-radius: 3px;
        }
      `}</style>
    </Box>
  );
};

SearchBar.propTypes = {
  onResultSelect: PropTypes.func,
};

export default SearchBar;
