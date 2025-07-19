import {
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  Checkbox,
  Paper,
  useMediaQuery,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PropTypes from "prop-types";
import CajaInfo from "../../caja/CajaInfo";
import { useEffect } from "react";

const BarraSuperior = ({
  selectedVendedor,
  onSelectVendedor,
  selectedCliente,
  onSelectCliente,
  tipoDocumento,
  onChangeTipoDocumento,
  tipoEntrega,
  onChangeTipoEntrega,
  direccionEntrega,
  onChangeDireccionEntrega,
  usarDireccionGuardada,
  onChangeUsarDireccionGuardada,
  onCerrarCaja,
  cajaAbierta,
  cajaAsignada,
  clientes,
  isClosing,
  cajaCerrando,
  theme,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const clienteSeleccionado = clientes?.clientes?.find(
    (c) => c.id_cliente === selectedCliente
  );

  const esEmpresa =
    clienteSeleccionado?.rut && clienteSeleccionado?.razon_social;

  useEffect(() => {
    if (!selectedCliente) {
      onChangeTipoDocumento("boleta");
    } else if (esEmpresa) {
      onChangeTipoDocumento("factura");
    } else {
      onChangeTipoDocumento("boleta");
    }
  }, [selectedCliente]);

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        p: { xs: 1.5, md: 2 },
        mb: 3,
        background: theme.palette.background.paper,
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        {/* Título */}
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight={700}
          color={theme.palette.text.primary}
          sx={{ mb: isMobile ? 1 : 0 }}
        >
          Punto de Venta
        </Typography>
        {/* Botones */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          gap={1}
        >
          <Button
            variant={selectedVendedor ? "contained" : "outlined"}
            onClick={onSelectVendedor}
            sx={{
              minWidth: 170,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 2,
              color: selectedVendedor ? "#fff" : theme.palette.primary.main,
              background: selectedVendedor
                ? theme.palette.primary.main
                : theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.background.paper,
              justifyContent: "flex-start",
              pl: 2,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.main,
                color: "#fff",
                borderColor: theme.palette.primary.main,
                "& .MuiButton-startIcon svg": {
                  color: "#fff !important",
                },
              },
              "& .MuiButton-startIcon svg": {
                color: selectedVendedor ? "#fff" : theme.palette.primary.main,
                transition: "color 0.2s",
              },
            }}
            startIcon={
              selectedVendedor ? (
                <CheckCircleOutlineIcon sx={{ color: "#fff" }} />
              ) : (
                <PersonOutlineIcon color="primary" />
              )
            }
          >
            {selectedVendedor
              ? `Vendedor: ${selectedVendedor}`
              : "Seleccionar Vendedor"}
          </Button>

          <Button
            variant={selectedCliente ? "contained" : "outlined"}
            onClick={onSelectCliente}
            sx={{
              minWidth: 170,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 2,
              color: selectedCliente ? "#fff" : theme.palette.primary.main,
              background: selectedCliente
                ? theme.palette.primary.main
                : theme.palette.background.paper,
              justifyContent: "flex-start",
              pl: 2,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.main,
                color: "#fff",
                borderColor: theme.palette.primary.main,
                "& .MuiButton-startIcon svg": {
                  color: "#fff !important",
                },
              },
              "& .MuiButton-startIcon svg": {
                color: selectedCliente ? "#fff" : theme.palette.primary.main,
                transition: "color 0.2s",
              },
            }}
            startIcon={
              selectedCliente ? (
                <CheckCircleOutlineIcon sx={{ color: "white" }} />
              ) : (
                <PersonOutlineIcon color="primary" />
              )
            }
          >
            {selectedCliente ? (
              <Box
                component="span"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  Cliente seleccionado
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    textShadow: "0 1px 4px rgba(0,0,0,0.09)",
                  }}
                >
                  {clientes?.clientes?.find(
                    (c) => c.id_cliente === selectedCliente
                  )?.nombre || "Desconocido"}
                </Typography>
              </Box>
            ) : (
              "Seleccionar Cliente"
            )}
          </Button>
          {cajaAbierta && (
            <Button
              variant="contained"
              color="error"
              onClick={onCerrarCaja}
              disabled={cajaCerrando || isClosing}
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "0 1px 4px rgba(200,50,50,0.04)",
                py: 1,
                px: 2,
                "&:hover": {
                  backgroundColor: theme.palette.error.dark,
                },
              }}
            >
              {cajaCerrando || isClosing ? "Cerrando..." : "Cerrar Caja"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Caja Info */}
      <Box mb={2}>
        {cajaAsignada && cajaAbierta ? (
          <Box mx={isMobile ? 0 : "auto"}>
            <CajaInfo caja={cajaAsignada} />
          </Box>
        ) : (
          <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 1 }}>
            No hay caja abierta actualmente.
          </Typography>
        )}
      </Box>

      {/* Controles de documento y entrega */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
        alignItems={isMobile ? "stretch" : "center"}
        flexWrap="wrap"
        sx={{
          // Fondo y borde para todo el bloque
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.grey[50],
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          p: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          mt: 2,
        }}
      >
        {/* Documento */}
        <TextField
          select
          label="Documento"
          size="small"
          value={
            (!selectedCliente && tipoDocumento === "boleta") ||
            (selectedCliente && esEmpresa && tipoDocumento === "factura") ||
            (selectedCliente && !esEmpresa && tipoDocumento === "boleta")
              ? tipoDocumento
              : ""
          }
          onChange={(e) => onChangeTipoDocumento(e.target.value)}
          sx={{
            minWidth: 130,
            background: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            "& fieldset": {
              borderColor: theme.palette.divider,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.light,
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
            },
          }}
          disabled={!selectedCliente}
        >
          {!selectedCliente && <MenuItem value="boleta">Boleta</MenuItem>}
          {selectedCliente && esEmpresa && (
            <MenuItem value="factura">Factura</MenuItem>
          )}
          {selectedCliente && !esEmpresa && (
            <MenuItem value="boleta">Boleta</MenuItem>
          )}
        </TextField>

        {/* Tipo de entrega */}
        <TextField
          select
          label="Tipo de Entrega"
          size="small"
          value={tipoEntrega}
          onChange={(e) => onChangeTipoEntrega(e.target.value)}
          sx={{
            minWidth: 180,
            background: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            "& fieldset": {
              borderColor: theme.palette.divider,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.light,
            },
            "& .MuiInputBase-input": {
              fontWeight: 500,
            },
          }}
        >
          <MenuItem value="retiro_en_sucursal">Retiro en Sucursal</MenuItem>
          <MenuItem value="despacho_a_domicilio">Envío a Domicilio</MenuItem>
        </TextField>

        {/* Dirección de entrega (opcional) */}
        {tipoEntrega === "despacho_a_domicilio" && (
          <Box
            display="flex"
            alignItems={isMobile ? "stretch" : "center"}
            flexDirection={isMobile ? "column" : "row"}
            gap={1}
            sx={{
              minWidth: isMobile ? "100%" : 260,
              background:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : theme.palette.grey[100],
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Checkbox
              checked={usarDireccionGuardada}
              onChange={(e) => onChangeUsarDireccionGuardada(e.target.checked)}
              sx={{
                p: 0.5,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              fontSize="1rem"
              sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
            >
              Usar dirección guardada
            </Typography>
            {!usarDireccionGuardada && (
              <TextField
                label="Dirección de entrega"
                size="small"
                value={direccionEntrega}
                onChange={(e) => onChangeDireccionEntrega(e.target.value)}
                sx={{
                  minWidth: 200,
                  background: theme.palette.background.paper,
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "& .MuiInputBase-input": {
                    fontWeight: 500,
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontWeight: 600,
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark,
                  },
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

BarraSuperior.propTypes = {
  selectedVendedor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectVendedor: PropTypes.func.isRequired,
  selectedCliente: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectCliente: PropTypes.func.isRequired,
  tipoDocumento: PropTypes.string.isRequired,
  onChangeTipoDocumento: PropTypes.func.isRequired,
  tipoEntrega: PropTypes.string.isRequired,
  onChangeTipoEntrega: PropTypes.func.isRequired,
  direccionEntrega: PropTypes.string.isRequired,
  onChangeDireccionEntrega: PropTypes.func.isRequired,
  usarDireccionGuardada: PropTypes.bool.isRequired,
  onChangeUsarDireccionGuardada: PropTypes.func.isRequired,
  onCerrarCaja: PropTypes.func.isRequired,
  cajaAbierta: PropTypes.bool,
  cajaAsignada: PropTypes.object,
  clientes: PropTypes.object,
  isClosing: PropTypes.bool,
  cajaCerrando: PropTypes.bool,
  theme: PropTypes.object.isRequired,
};

export default BarraSuperior;
