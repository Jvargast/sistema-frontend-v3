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
  Pagination,
  TextField,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import BackButton from "./BackButton";
import { useSelector } from "react-redux";
import { formatCLP } from "../../utils/formatUtils";
import Header from "./Header";

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
  subtitle,
  headerAction,
  showBackButton = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const rol = useSelector((state) => state?.auth?.rol);

  const headerBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[200]
      : theme.palette.background.paper;

  const footerBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.background.paper;

  const borderColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[700];

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

  return (
    <Box sx={{ p: 2, maxWidth: "100%", mx: "auto", mb: 2 }}>
      {showBackButton && (
        <BackButton
          to={rol === "chofer" ? "/viajes" : "/admin"}
          label="Volver"
        />
      )}
      <Header title={title} subtitle={subtitle} />

      {headerAction && <Box>{headerAction}</Box>}

      {isMobile ? (
        <>
          <Box display="flex" flexDirection="column" gap={2}>
            {rows.map((row, idx) => {
              const rowKey =
                row.id ?? row.id_pedido ?? row.id_venta ?? row.uuid ?? `${idx}`;
              return (
                <Box
                  key={rowKey}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    backgroundColor: `${
                      theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.background.paper
                    }`,
                  }}
                >
                  {columns.map((col) => {
                    const cellValue = col.render
                      ? col.render(row)
                      : row[col.id];
                    const value =
                      col.format === "currency" && typeof cellValue === "number"
                        ? formatCLP(cellValue)
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

                        {typeof value === "string" ||
                        typeof value === "number" ? (
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
              );
            })}
            {rows.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                {errorMessage ?? "Sin resultados en esta página."}
              </Box>
            )}
          </Box>
          {totalItems > rowsPerPage && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(totalItems / rowsPerPage)}
                page={page + 1}
                onChange={(_, value) => handleChangePage(null, value - 1)}
                color="primary"
                size="medium"
              />
            </Box>
          )}
          <Box display="flex" justifyContent="center" mt={1}>
            <TextField
              select
              label="Filas"
              size="small"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              sx={{ width: 90 }}
            >
              {[5, 10, 25].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </>
      ) : (
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
                        bgcolor: headerBg,
                        color: theme.palette.text.primary,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => {
                    const rowKey =
                      row.id ??
                      row.id_pedido ??
                      row.id_venta ??
                      row.uuid ??
                      `${index}`;
                    return (
                      <TableRow
                        key={rowKey}
                        hover
                        sx={{
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.background.default
                              : "#fff",
                        }}
                      >
                        {columns.map((col) => {
                          const cellValue = col.render
                            ? col.render(row)
                            : row[col.id];
                          const formattedValue =
                            col.format === "currency" &&
                            typeof cellValue === "number"
                              ? formatCLP(cellValue)
                              : cellValue;

                          return (
                            <TableCell
                              key={`cell-${rowKey}-${col.id}`}
                              align="center"
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                                whiteSpace: "nowrap",
                                color: theme.palette.text.primary,
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              {formattedValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 6 }}
                    >
                      {errorMessage ?? "Sin resultados en esta página."}
                    </TableCell>
                  </TableRow>
                )}
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
              backgroundColor: footerBg,
              borderTop: `1px solid ${borderColor}`,
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              color: theme.palette.text.primary,
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
  subtitle: PropTypes.string,
  headerAction: PropTypes.node,
  showBackButton: PropTypes.bool,
};

export default DataTable;
