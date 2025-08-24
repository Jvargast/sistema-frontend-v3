import {
  Typography,
  List,
  ListItem,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import {
  Description,
  Event,
  CheckCircle,
  ErrorOutline,
} from "@mui/icons-material";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

const DocumentosVenta = ({ documentos, id_factura }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
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
        {id_factura ? (
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              ID Factura:
            </Typography>
            <Typography fontStyle="italic"> #{id_factura}</Typography>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => navigate(`/facturas/ver/${id_factura}`)}
              sx={{
                ml: 2,
                textTransform: "none",
                fontWeight: "bold",
                borderColor: "#1e88e5",
                color: "#1e88e5",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1e88e5",
                },
              }}
            >
              Ver Factura
            </Button>
          </Box>
        ) : null}
      </Box>

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
                boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: isMobile ? 0.8 : 1.2,
              }}
            >
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
  id_factura: PropTypes.number,
};

export default DocumentosVenta;
