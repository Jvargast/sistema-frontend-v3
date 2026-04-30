import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, CircularProgress, useTheme, useMediaQuery, Divider, Pagination, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import BackButton from "./BackButton";
import { useSelector } from "react-redux";
import { formatCLP } from "../../utils/formatUtils";
import Header from "./Header";
import TextField from "./CompatTextField";
import Box from "./CompatBox";
import Typography from "./CompatTypography";
import {
  getActionIconButtonSx,
  getStandardTablePaperSx,
  getStandardTableSx,
} from "./tableStyles";

const getRowKey = (row, idx) =>
  row.id ??
  row.id_pago ??
  row.id_pedido ??
  row.id_venta ??
  row.id_cxc ??
  row.id_cotizacion ??
  row.id_venta_chofer ??
  row.id_agenda_carga ??
  row.id_gasto ??
  row.id_compra ??
  row.id_produccion ??
  row.uuid ??
  `${idx}`;

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
      ? theme.palette.grey[100]
      : theme.palette.grey[900];

  const footerBg =
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.grey[900];

  const borderColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[700];

  const actionButtonSx = getActionIconButtonSx(theme, "primary", {
    width: 32,
    height: 32,
    minWidth: 32,
    "& svg": {
      fontSize: 18,
    },
  });

  const actionCellButtonStyles = {
    "& .MuiIconButton-root": actionButtonSx,
    "& .MuiIconButton-colorInfo": getActionIconButtonSx(theme, "info", {
      width: 32,
      height: 32,
      minWidth: 32,
    }),
    "& .MuiIconButton-colorError": getActionIconButtonSx(theme, "error", {
      width: 32,
      height: 32,
      minWidth: 32,
    }),
    "& .MuiIconButton-colorInherit": getActionIconButtonSx(
      theme,
      "secondary",
      {
        width: 32,
        height: 32,
        minWidth: 32,
      }
    ),
  };

  const tableSx = getStandardTableSx(theme, {
    "& .MuiTableCell-root": {
      height: 58,
      verticalAlign: "middle",
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
      height: 46,
      fontWeight: 800,
      fontSize: "0.82rem",
      letterSpacing: 0,
      textTransform: "none",
    },
    "& .MuiTableBody-root .MuiTableCell-root": {
      fontSize: { xs: "0.8rem", sm: "0.92rem" },
      whiteSpace: "nowrap",
    },
    "& .DataTable-actionsCell": {
      px: 1,
      py: 1,
      textAlign: "center",
      ...actionCellButtonStyles,
    },
    "& .DataTable-actionsContent": {
      minHeight: 40,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
    },
  });

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
              const rowKey = getRowKey(row, idx);
              return (
                <Box
                  key={rowKey}
                  sx={{
                    p: 1.75,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 8px 24px rgba(15, 23, 42, 0.06)"
                        : "0 8px 24px rgba(0, 0, 0, 0.22)",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.background.paper,
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
                      <Box
                        key={col.id}
                        className={
                          col.id === "acciones"
                            ? "DataTable-actionsCell"
                            : undefined
                        }
                        sx={{
                          mb: 1.2,
                          ...(col.id === "acciones" && {
                            ...actionCellButtonStyles,
                          }),
                        }}
                      >
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
                          <Box
                            className={
                              col.id === "acciones"
                                ? "DataTable-actionsContent"
                                : undefined
                            }
                            sx={
                              col.id === "acciones"
                                ? {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 1,
                                  }
                                : undefined
                            }
                          >
                            {value}
                          </Box>
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
        <Paper
          elevation={0}
          sx={getStandardTablePaperSx(theme, {
            p: 0,
            borderRadius: 1,
          })}
        >
          <TableContainer sx={{ maxHeight: "calc(100vh - 260px)" }}>
            <Table stickyHeader size="small" sx={tableSx}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={`header-${col.id}`}
                      align={
                        col.id === "acciones"
                          ? "center"
                          : col.align || "center"
                      }
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
                    const rowKey = getRowKey(row, index);
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
                              align={
                                col.id === "acciones"
                                  ? "center"
                                  : col.align || "center"
                              }
                              className={
                                col.id === "acciones"
                                  ? "DataTable-actionsCell"
                                  : undefined
                              }
                              sx={{
                                whiteSpace: "nowrap",
                                color: theme.palette.text.primary,
                                borderBottom: `1px solid ${borderColor}`,
                              }}
                            >
                              {col.id === "acciones" ? (
                                <Box className="DataTable-actionsContent">
                                  {formattedValue}
                                </Box>
                              ) : (
                                formattedValue
                              )}
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
      align: PropTypes.oneOf(["inherit", "left", "center", "right", "justify"]),
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
