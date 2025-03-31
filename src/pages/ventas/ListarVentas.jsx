import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetAllVentasQuery } from "../../store/services/ventasApi";
import HistorialVentas from "./HistorialVentas";
import EmptyState from "../../components/common/EmptyState";
import { Navigate } from "react-router";

const ListaVentas = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isSmallScreen ? 5 : 10);

  const { data, isLoading, isError, refetch } = useGetAllVentasQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  useEffect(() => {
    setRowsPerPage(isSmallScreen ? 5 : 10);
    setPage(0); // reiniciar paginación
  }, [isSmallScreen]);

  const ventas = useMemo(() => data?.ventas || [], [data]);
  const totalItems = useMemo(() => data?.paginacion.totalItems || 0, [data]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
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

  if (!isLoading && ventas.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes ventas"
        subtitle="Puedes comenzar creando una venta para tus clientes."
        buttonText="Crear Ventas"
        onAction={() => Navigate("/punto-venta")}
      />
    );
  }
  if (isError || !ventas.length) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">
          Error al cargar las ventas o no hay datos disponibles.
        </Typography>
      </Box>
    );
  }

  return (
    <HistorialVentas
      ventas={ventas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default ListaVentas;
