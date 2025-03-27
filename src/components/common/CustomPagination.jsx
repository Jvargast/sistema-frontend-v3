import { gridPageCountSelector, GridPagination, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
import PropTypes from 'prop-types';

// Componente de paginación personalizada
export function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    return (
      <MuiPagination
        color="primary"
        className={className}
        count={pageCount}
        page={page + 1} // Ajuste para que coincida con la lógica de 1-based index
        onChange={(event, newPage) => {
          onPageChange(event, newPage - 1); // Ajuste para que el DataGrid use 0-based index
        }}
      />
    );
  }
  Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  // Componente para integrar la paginación personalizada con el DataGrid
  // Componente para integrar la paginación personalizada con el DataGrid
  export function CustomPagination(props) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
  }