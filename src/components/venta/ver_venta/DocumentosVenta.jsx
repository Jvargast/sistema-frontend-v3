import {
  Typography,
  List,
  ListItem,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Description,
  Event,
  CheckCircle,
  ErrorOutline,
} from "@mui/icons-material";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const DocumentosVenta = ({ documentos }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          textAlign: isMobile ? "left" : "inherit",
        }}
      >
        📄 Documentos Asociados
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {documentos.length > 0 ? (
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 1.5 : 2,
          }}
        >
          {documentos.map((doc) => (
            <ListItem
              key={doc.id_documento}
              sx={{
                p: isMobile ? 1.5 : 2,
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: isMobile ? 0.8 : 1.2,
              }}
            >
              {/* Tipo de Documento */}
              <Box display="flex" alignItems="center" gap={1}>
                <Description sx={{ color: "#1976d2" }} />
                <Typography
                  fontWeight="bold"
                  fontSize={isMobile ? "0.95rem" : "1rem"}
                >
                  {doc.tipo_documento.toUpperCase()} - {doc.numero}
                </Typography>
              </Box>

              {/* Estado */}
              <Box display="flex" alignItems="center" gap={1}>
                {doc.estado === "emitido" ? (
                  <CheckCircle sx={{ color: "#388e3c" }} />
                ) : (
                  <ErrorOutline sx={{ color: "#d32f2f" }} />
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={isMobile ? "0.85rem" : "0.95rem"}
                >
                  Estado: {doc.estado}
                </Typography>
              </Box>

              {/* Fecha */}
              <Box display="flex" alignItems="center" gap={1}>
                <Event sx={{ color: "#ff9800" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={isMobile ? "0.85rem" : "0.95rem"}
                >
                  Emitido el{" "}
                  {dayjs(doc.fecha_emision).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography
          align="center"
          sx={{
            mt: 2,
            fontStyle: "italic",
            color: "gray",
            fontSize: isMobile ? "0.95rem" : "1rem",
          }}
        >
          📃 No hay documentos asociados a esta venta.
        </Typography>
      )}
    </Box>
  );
};

DocumentosVenta.propTypes = {
  documentos: PropTypes.arrayOf(
    PropTypes.shape({
      id_documento: PropTypes.number.isRequired,
      tipo_documento: PropTypes.string.isRequired,
      numero: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
      fecha_emision: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DocumentosVenta;
