import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  /*   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); */

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

  const apiRef = useGridApiRef();
  const gridContainerRef = useRef(null);

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/clientes", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const columns = [
    {
      field: "sequentialId",
      headerName: "ID",
      flex: 0.1,
      minWidth: 60,
      hide: isMobile,
      resizable: false,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 0.2,
      minWidth: 120,
      resizable: false,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 0.3,
      minWidth: 150,
      resizable: false,
      hide: isMobile,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
          title={params.value}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "tipo_cliente",
      headerName: "Tipo Cliente",
      resizable: false,
      width: 120,
      hide: isMobile,
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
      flex: 0.1,
      minWidth: 70,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1} justifyContent="center">
          <Box
            sx={{
              borderRadius: "50%",
              width: 10,
              height: 10,
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
            {isMobile
              ? params.value
                ? "✔"
                : "✖"
              : params.value
              ? "Activo"
              : "Inactivo"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "",
      width: isMobile ? 80 : 120,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="info"
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate(`/clientes/ver/${params.row.id_cliente}`)}
          >
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton
            color="primary"
            size={isMobile ? "small" : "medium"}
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
        mt: "1.5rem",
        mb: "1.5rem",
        p: 2,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
        gap: "1.5rem",
        minWidth: 0,
        overflow: "hidden",
      }}
      minWidth={0}
      ref={gridContainerRef}
    >
      <Header title="Clientes" subtitle="Gestión de clientes" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        {isMobile ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Botón Eliminar */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `linear-gradient(145deg, ${theme.palette.error.light} 60%, ${theme.palette.error.main} 100%)`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.error.main}22, 0 1.5px 8px 0 #0001`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.16s all cubic-bezier(.4,0,.2,1)",
                  cursor:
                    selectedRows.length === 0 || isDeleting
                      ? "not-allowed"
                      : "pointer",
                  opacity: selectedRows.length === 0 || isDeleting ? 0.6 : 1,
                  "&:hover": {
                    background: `linear-gradient(120deg, ${theme.palette.error.main} 70%, ${theme.palette.error.dark} 100%)`,
                    transform: "scale(1.08)",
                    boxShadow: `0 4px 24px 0 ${theme.palette.error.dark}33`,
                  },
                  userSelect: "none",
                }}
                onClick={() => {
                  if (selectedRows.length > 0 && !isDeleting)
                    setOpenAlert(true);
                }}
                title="Eliminar seleccionados"
              >
                <DeleteOutlineIcon sx={{ color: "#fff", fontSize: 28 }} />
              </Box>
              {/* Botón Nuevo */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `linear-gradient(145deg, ${theme.palette.primary.light} 60%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}22, 0 1.5px 8px 0 #0001`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.16s all cubic-bezier(.4,0,.2,1)",
                  cursor: "pointer",
                  "&:hover": {
                    background: `linear-gradient(120deg, ${theme.palette.primary.main} 70%, ${theme.palette.primary.dark} 100%)`,
                    transform: "scale(1.08)",
                    boxShadow: `0 4px 24px 0 ${theme.palette.primary.dark}33`,
                  },
                  userSelect: "none",
                }}
                onClick={() => navigate("/clientes/crear")}
                title="Nuevo cliente"
              >
                <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 28 }} />
              </Box>
            </Box>
          </>
        ) : (
          <>
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
                boxShadow: "0 2px 8px 0 #b71c1c22",
              }}
            >
              {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate("/clientes/crear")}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px 0 #1976d222",
              }}
            >
              Nuevo Cliente
            </Button>
          </>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          flex: 1,
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "100%",
        }}
      >
        <DataGrid
          apiRef={apiRef}
          disableExtendRowFullWidth={false}
          autoHeight={false}
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
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
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
            '& .MuiDataGrid-cell[data-field="activo"]': {
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            },
            '& .MuiDataGrid-columnHeader[data-field="activo"]': {
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: theme.palette.grey[300],
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
            },
          }}
          disableColumnResize={true}
          disableColumnMenu={true}
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
