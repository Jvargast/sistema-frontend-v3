import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import LoaderComponent from "../common/LoaderComponent";
import PropTypes from "prop-types";

const PaginatedTable = ({
  title,
  data,
  isLoading,
  onPageChange,
  paginacion,
  columns,
}) => {
  const currentPage = (paginacion?.currentPage || 1) - 1;
  const totalItems = paginacion?.totalItems || 0;
  const rowsPerPage = paginacion?.pageSize || 5;

  const rowsPerPageOptions = [5, 10, 25, 50];
  if (!rowsPerPageOptions.includes(rowsPerPage)) {
    rowsPerPageOptions.push(rowsPerPage);
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onPageChange(0, newRowsPerPage);
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div>
      <Typography>{title}</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  style={{
                    width: column.width || "auto",
                    minWidth: column.minWidth || "auto",
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                className="hover:bg-gray-50 transition duration-200"
              >
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.renderCell
                      ? column.renderCell({ value: row[column.field], row })
                      : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </div>
  );
};
PaginatedTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  paginacion: PropTypes.shape({
    currentPage: PropTypes.number,
    totalItems: PropTypes.number,
    pageSize: PropTypes.number,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
      minWidth: PropTypes.number,
      renderCell: PropTypes.func,
    })
  ).isRequired,
};

export default PaginatedTable;
