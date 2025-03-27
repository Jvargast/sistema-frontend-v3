import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useDeleteClientesMutation,
  useGetAllClientesQuery,
} from "../../store/services/clientesApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import AlertDialog from "../../components/common/AlertDialog";
import { CustomPagination } from "../../components/common/CustomPagination";
import Header from "../../components/common/Header";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolBar";

const Clientes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [openAlert, setOpenAlert] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, isError, error, refetch } = useGetAllClientesQuery({
    search,
    page: page + 1,
    limit: pageSize,
  });
  const [deleteClientes, { isLoading: isDeleting }] =
    useDeleteClientesMutation();

  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);
  const rows = useMemo(
    () =>
      data?.clientes?.map((row) => ({
        ...row,
        id: row.id_cliente,
      })) || [],
    [data?.clientes]
  );

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/clientes", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const columns = [
    { field: "sequentialId", headerName: "ID", flex: 0.15, resizable: false },
    { field: "nombre", headerName: "Nombre", flex: 0.25, resizable: false },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 0.45,
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            overflowX: "auto", // Habilitar solo scroll horizontal
            overflowY: "hidden", // Deshabilitar scroll vertical
            whiteSpace: "nowrap", // Prevenir que el texto se quiebre
            "&::-webkit-scrollbar": {
              height: "4px", // Altura de la barra de scroll horizontal
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888", // Color del scroll horizontal
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555", // Color del scroll al pasar el cursor
            },
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "tipo_cliente",
      headerName: "Tipo Cliente",
      resizable: false,
      flex: 0.2,
      renderCell: (params) =>
        params.value === "Empresa" ? (
          <span
            style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "0.8rem" }}
          >
            Empresa
          </span>
        ) : (
          <span
            style={{ color: "#3498db", fontWeight: "bold", fontSize: "0.8rem" }}
          >
            Persona
          </span>
        ),
    },
    {
      field: "activo",
      headerName: "Estado",
      resizable: false,
      flex: 0.2,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: params.value ? "#27ae60" : "#e74c3c",
            }}
          />
          <Typography
            sx={{
              color: params.value ? "#27ae60" : "#e74c3c",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {params.value ? "Activo" : "Inactivo"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="info"
            onClick={() => navigate(`/clientes/ver/${params.row.id_cliente}`)}
          >
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => navigate(`/clientes/editar/${params.row.id_cliente}`)}
          >
            <EditRoundedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleBulkDelete = async () => {
    try {
      await deleteClientes({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Clientes eliminados correctamente.",
          severity: "success",
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar clientes: ${error.error}`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: `Error al obtener clientes: ${error.error}`,
        severity: "error",
      })
    );
    return null;
  }

  return (
    <Box
      sx={{
        m: "1.5rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "100vh",
      }}
    >
      <Header title="Clientes" subtitle="Gestión de clientes" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setOpenAlert(true)}
          disabled={selectedRows.length === 0 || isDeleting}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
          }}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/clientes/crear")}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
          }}
        >
          Nuevo Cliente
        </Button>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f9fafc",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          paginationMode="server"
          rowCount={paginacion?.totalItems || rows.length}
          paginationModel={{
            page: page,
            pageSize: pageSize,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          pageSizeOptions={[5, 10, 25, 50]}
          slots={{
            toolbar: DataGridCustomToolbar,
            pagination: CustomPagination,
          }}
          slotProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
          sx={{
            height: "100%",
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e8f0fe",
              color: "#333",
              fontWeight: "bold",
              borderBottom: "1px solid #d1d9e6",
              borderColor: theme.palette.grey[300],
              "& > div": {
                borderRight: "1px solid #d1d9e6", // Separadores entre columnas en encabezados
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: theme.palette.grey[300],
              display: "flex",
              "&:not(:last-child)": {
                borderRight: "1px solid #d1d9e6", // Separadores entre celdas
              },
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.grey[200],
              borderTop: "1px solid",
              borderColor: theme.palette.grey[300],
            },
          }}
        />
      </Box>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleBulkDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar los ${selectedRows.length} clientes seleccionados?`}
      />
    </Box>
  );
};

export default Clientes;
