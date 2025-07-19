import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useDeleteVentaMutation,
  useGetAllVentasQuery,
  useRejectVentaMutation,
} from "../../store/services/ventasApi";
import HistorialVentas from "./HistorialVentas";
import EmptyState from "../../components/common/EmptyState";
import { Outlet, useMatch, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const ListaVentas = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isSmallScreen ? 5 : 10);

  const { data, isLoading, isError, refetch } = useGetAllVentasQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  const [deleteVenta] = useDeleteVentaMutation();
  const [rejectVenta] = useRejectVentaMutation();

  const matchVer = useMatch("/admin/ventas/ver/:id");
  const matchEditar = useMatch("/admin/ventas/editar/:id");
  const isDetalle = !!matchVer || !!matchEditar;

  const handleDeleteVenta = async (venta) => {
    try {
      await deleteVenta(venta.id_venta).unwrap();
      refetch();
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      dispatch(
        showNotification({
          message: `Error al eliminar: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const handleRejectVenta = async (venta) => {
    try {
      await rejectVenta(venta.id_venta).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Venta rechazada correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al rechazar venta:", error);
      dispatch(
        showNotification({
          message: `Error al rechazar: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  useEffect(() => {
    setRowsPerPage(isSmallScreen ? 5 : 10);
    setPage(0);
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
        onAction={() => navigate("/punto-venta")}
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
    <>
      {!isDetalle && (
        <HistorialVentas
          ventas={ventas}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onDeleteVenta={handleDeleteVenta}
          onRejectVenta={handleRejectVenta}
        />
      )}

      <Outlet />
    </>
  );
};

export default ListaVentas;
