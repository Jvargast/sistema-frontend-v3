import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import BackButton from "./BackButton";
import { useSelector } from "react-redux";

const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);

const DataTable = ({
  columns,
  rows,
  totalItems,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  loading,
  errorMessage,
  title,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const rol = useSelector((state) => state?.auth?.rol);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!rows.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: "100%", mx: "auto", mb: 3 }}>
      <BackButton to={rol === "chofer" ? "/viajes" : "/admin"} label="Volver" />
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        sx={{
          mb: 2,
          color: "#4A90E2",
          fontSize: { xs: "1.2rem", sm: "1.6rem" },
        }}
      >
        {title}
      </Typography>

      {/* Vista Mobile: Tarjetas */}
      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {rows.map((row, idx) => (
            <Box
              key={row.id || idx}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
              }}
            >
              {columns.map((col) => {
                const cellValue = col.render ? col.render(row) : row[col.id];
                const value =
                  col.format === "currency" && typeof cellValue === "number"
                    ? formatoCLP(cellValue)
                    : cellValue;

                return (
                  <Box key={col.id} sx={{ mb: 1.2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      sx={{ mb: 0.5 }}
                    >
                      {col.label}
                    </Typography>

                    {/* Si el valor es un componente (como <Chip> o <Box>), lo mostramos tal cual. Si es texto, lo metemos en Typography */}
                    {typeof value === "string" || typeof value === "number" ? (
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        component="div"
                      >
                        {value}
                      </Typography>
                    ) : (
                      <Box>{value}</Box>
                    )}
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      ) : (
        // Vista Escritorio: Tabla clásica
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 260px)" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={`header-${col.id}`}
                      align="center"
                      sx={{
                        bgcolor: "#f4f6f8",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.id || `row-${index}`} hover>
                    {columns.map((col) => {
                      const cellValue = col.render
                        ? col.render(row)
                        : row[col.id];
                      const formattedValue =
                        col.format === "currency" &&
                        typeof cellValue === "number"
                          ? formatoCLP(cellValue)
                          : cellValue;

                      return (
                        <TableCell
                          key={`cell-${row.id || index}-${col.id}`}
                          align="center"
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.95rem" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formattedValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: "#f4f6f8",
              borderTop: "1px solid #ddd",
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalItems: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default DataTable;
