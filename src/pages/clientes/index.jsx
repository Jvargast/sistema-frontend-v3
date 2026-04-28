import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Chip, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
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
import { useSelector } from "react-redux";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";
import { normalizeDataGridSelection } from "../../utils/dataGridSelection";
import { getActionIconButtonSx } from "../../components/common/tableStyles";
import { getSucursalTagSx } from "../../components/common/sucursalTagStyles";

const getPageActionButtonSx = (theme, variant = "primary") => ({
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  boxShadow: "none",
  ...(variant === "danger"
    ? {
        bgcolor: theme.palette.error.main,
        color: theme.palette.common.white,
        "&:hover": {
          bgcolor: theme.palette.error.dark,
          boxShadow: "none",
        },
        "&.Mui-disabled": {
          bgcolor: theme.palette.action.disabledBackground,
          color: theme.palette.action.disabled,
        },
      }
    : {
        bgcolor: "#0F172A",
        color: theme.palette.common.white,
        "&:hover": {
          bgcolor: theme.palette.common.black,
          boxShadow: "none",
        },
      }),
});

const Clientes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const highlightSucursalId =
    mode !== "global" ? Number(activeSucursalId) || null : null;

  const [openAlert, setOpenAlert] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId]);

  const clienteParams = useMemo(() => {
    const base = { search, page: page + 1, limit: pageSize };
    if (mode !== "global" && Number(activeSucursalId)) {
      base.id_sucursal = Number(activeSucursalId);
    }
    return base;
  }, [search, page, pageSize, mode, activeSucursalId]);

  const { data, isLoading, isError, error, refetch } =
    useGetAllClientesQuery(clienteParams);
  const [deleteClientes, { isLoading: isDeleting }] =
    useDeleteClientesMutation();

  useRegisterRefresh(
    "clientes",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

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
      field: "Sucursales",
      headerName: "Sucursales",
      flex: 0.3,
      minWidth: 160,
      sortable: false,
      renderCell: ({ row }) => {
        const list = Array.isArray(row.Sucursales) ? row.Sucursales : [];
        if (!list.length) {
          return (
            <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
              <Chip
                size="small"
                label="Sin sucursal"
                sx={{
                  borderRadius: 1,
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.warning.main, 0.12),
                  color: theme.palette.warning.dark,
                }}
              />
            </Box>
          );
        }

        const max = isMobile ? 2 : 3;
        const shown = list.slice(0, max);
        const rest = list.length - shown.length;

        return (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.5,
              overflow: "hidden",
              py: 0.75,
            }}
          >
            {shown.map((s, index) => {
              const isHighlight =
                highlightSucursalId &&
                Number(s.id_sucursal) === highlightSucursalId;

              return (
                <Chip
                  key={s.id_sucursal}
                  size="small"
                  label={s.nombre ?? `Sucursal ${s.id_sucursal}`}
                  sx={getSucursalTagSx(theme, index, {
                    borderWidth: isHighlight ? 2 : 1,
                    maxWidth: 160,
                  })}
                />
              );
            })}
            {rest > 0 && (
              <Chip
                size="small"
                variant="outlined"
                label={`+${rest}`}
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
        );
      },
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
      headerName: "Acciones",
      width: isMobile ? 92 : 130,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <IconButton
            aria-label="Ver cliente"
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate(`/clientes/ver/${params.row.id_cliente}`)}
            sx={getActionIconButtonSx(theme, "info")}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Editar cliente"
            size={isMobile ? "small" : "medium"}
            onClick={() =>
              navigate(`/clientes/editar/${params.row.id_cliente}`)
            }
            sx={getActionIconButtonSx(theme, "primary")}
          >
            <EditRoundedIcon fontSize="small" />
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton
              aria-label="Eliminar seleccionados"
              disabled={selectedRows.length === 0 || isDeleting}
              onClick={() => {
                if (selectedRows.length > 0 && !isDeleting) setOpenAlert(true);
              }}
              sx={getActionIconButtonSx(theme, "error", {
                width: 40,
                height: 40,
                minWidth: 40,
              })}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Nuevo cliente"
              onClick={() => navigate("/clientes/crear")}
              sx={getActionIconButtonSx(theme, "primary", {
                width: 40,
                height: 40,
                minWidth: 40,
              })}
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={() => setOpenAlert(true)}
              disabled={selectedRows.length === 0 || isDeleting}
              sx={getPageActionButtonSx(theme, "danger")}
            >
              {isDeleting ? "Eliminando..." : "Eliminar seleccionados"}
            </Button>

            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => navigate("/clientes/crear")}
              sx={getPageActionButtonSx(theme, "primary")}
            >
              Nuevo cliente
            </Button>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          flex: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 10px 30px rgba(15, 23, 42, 0.06)"
              : "0 10px 30px rgba(0, 0, 0, 0.24)",
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
          onRowSelectionModelChange={(ids) =>
            setSelectedRows(normalizeDataGridSelection(ids))
          }
          disableRowSelectionExcludeModel
          pageSizeOptions={[5, 10, 25, 50]}
          rowHeight={64}
          columnHeaderHeight={46}
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
            border: 0,
            bgcolor: "background.paper",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              color: theme.palette.text.primary,
              fontWeight: 800,
              borderBottom: `1px solid ${theme.palette.divider}`,
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
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              "&:not(:last-child)": {
                borderRight: `1px solid ${theme.palette.divider}`,
              },
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[50]
                  : theme.palette.grey[900],
              borderTop: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-toolbarContainer": {
              p: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
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
        title="Confirmar eliminación"
        message={`¿Está seguro de que desea eliminar los ${selectedRows.length} clientes seleccionados?`}
      />
    </Box>
  );
};

export default Clientes;
