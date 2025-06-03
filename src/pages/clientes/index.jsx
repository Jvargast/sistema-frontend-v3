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
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": {
              height: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[500],
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: theme.palette.grey[700],
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
        params.value === "empresa" ? (
          <span
            style={{
              color: theme.palette.success.main,
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Empresa
          </span>
        ) : (
          <span
            style={{
              color: theme.palette.info.main,
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
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
              backgroundColor: params.value
                ? theme.palette.success.main
                : theme.palette.error.main,
            }}
          />
          <Typography
            sx={{
              color: params.value
                ? theme.palette.success.main
                : theme.palette.error.main,
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
            onClick={() =>
              navigate(`/clientes/editar/${params.row.id_cliente}`)
            }
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
              backgroundColor: theme.palette.background.paper,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[200]
                  : theme.palette.grey[800],
              color: theme.palette.text.primary,
              fontWeight: "bold",
              borderBottom: "1px solid #d1d9e6",
              borderColor: theme.palette.grey[300],
              "& > div": {
                borderRight: "1px solid #d1d9e6",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: theme.palette.grey[300],
              display: "flex",
              "&:not(:last-child)": {
                borderRight: "1px solid #d1d9e6",
              },
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              borderTop: `1px solid ${theme.palette.divider}`,
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
