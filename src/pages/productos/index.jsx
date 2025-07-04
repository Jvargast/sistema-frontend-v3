import { useMemo, useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { alpha, Box, Button, IconButton, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  useCreateProductoMutation,
  useDeleteProductosMutation,
  useGetAllProductosQuery,
} from "../../store/services/productoApi";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import Header from "../../components/common/Header";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolBar";
import { CustomPagination } from "../../components/common/CustomPagination";
import { useHasPermission } from "../../utils/useHasPermission";

const Productos = () => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const { data, isLoading, isError, refetch } = useGetAllProductosQuery({
    estado: "Disponible - Bodega",
    search,
    page: page + 1,
    limit: pageSize,
  });

  const canCreateProducto = useHasPermission("inventario.producto.crear");
  const canDeleteProducto = useHasPermission("inventario.producto.eliminar");
  const canEditProducto = useHasPermission("inventario.producto.editar");

  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);

  const { data: categorias } = useGetAllCategoriasQuery();

  const [createProducto] = useCreateProductoMutation();
  const [deleteProductos, { isLoading: isDeleting }] =
    useDeleteProductosMutation();

  const rows =
    data?.productos?.map((row) => ({
      id: row.id_producto,
      nombre: row.nombre_producto,
      marca: row.marca || "",
      codigo_barra: row.codigo_barra || "",
      precio: row.precio,
      descripcion: row.descripcion || "",
      stock: row.inventario?.cantidad || "Sin inventario",
      categoria: row.categoria?.nombre_categoria || "Sin categoría",
      estado: row.estado?.nombre_estado || "Sin estado",
      es_para_venta: Boolean(row.es_para_venta),
      image_url: row.image_url,
    })) || [];

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
      navigate("/productos", { replace: true });
    }
  }, [location.state, refetch, navigate]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.15 },
    {
      field: "image_url",
      headerName: "Imagen",
      flex: 0.2,
      renderCell: (params) => (
        <img
          src={
            params.value ||
            "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
          }
          alt="Producto"
          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
        />
      ),
    },
    { field: "nombre", headerName: "Nombre", flex: 0.3},
    { field: "categoria", headerName: "Categoría", flex: 0.3 },
    { field: "stock", headerName: "Stock", flex: 0.15 },
    ...(canEditProducto
      ? [
          {
            field: "acciones",
            headerName: "Acciones",
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <IconButton
                  color="info"
                  aria-label="Ver producto"
                  onClick={() =>
                    navigate(`/productos/ver/${params.row.id}`, {
                      state: { refetch: false },
                    })
                  }
                  sx={{
                    color: theme.palette.success.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.success.main, 0.12),
                    },
                  }}
                >
                  <VisibilityIcon />
                </IconButton>

                {canEditProducto && (
                  <IconButton
                    color="primary"
                    aria-label="Editar producto"
                    onClick={() =>
                      navigate(`/productos/editar/${params.row.id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            ),
          },
        ]
      : []),
  ];

  const rowsPerPageOptions = [5, 10, 25, 50];

  const handleSubmit = async (data) => {
    try {
      await createProducto(data).unwrap();
      dispatch(
        showNotification({
          message: "Producto creado con éxito",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear producto: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteProductos({ ids: selectedRows }).unwrap();
      dispatch(
        showNotification({
          message: "Productos eliminados correctamente",
          severity: "success",
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar productos: ${error}`,
          severity: "error",
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    dispatch(
      showNotification({
        message: `Error al cargar productos ${isError}`,
        severity: "error",
      })
    );
  }

  return (
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        boxShadow: theme.shadows[3],
        maxWidth: "1200px",
        margin: "auto",
        overflow: "hidden",
      }}
    >
      <Header title="Productos" subtitle="Gestión de productos" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {canDeleteProducto && (
          <Button
            variant="contained"
            color="error"
            disabled={selectedRows.length === 0 || isDeleting}
            onClick={() => setOpenAlert(true)}
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
        )}
        {canCreateProducto && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
            }}
          >
            Nuevo Producto
          </Button>
        )}
      </Box>

      <Box
        sx={{
          height: "600px",
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
            color: theme.palette.text.primary,
            fontWeight: "bold",
            fontSize: "1rem",
            borderColor: theme.palette.grey[300],
            borderBottom: `1px solid ${theme.palette.divider}`,
            "& > div": {
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            "&:not(:last-child)": {
              borderRight: `1px solid ${theme.palette.divider}`,
            },
            display: "flex",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[800],
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "0.5rem",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },
          "& .MuiIconButton-root:focus, & .MuiIconButton-root:focus-visible": {
            outline: "none",
          },
        }}
      >
        <DataGrid
          rows={rows || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
          pageSize={pageSize}
          paginationMode="server"
          rowCount={paginacion?.totalItems || rows.length}
          paginationModel={{ page: page, pageSize: pageSize }}
          pageSizeOptions={rowsPerPageOptions}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          checkboxSelection
          onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
          slots={{
            toolbar: DataGridCustomToolbar,
            pagination: CustomPagination,
          }}
          slotProps={{ toolbar: { searchInput, setSearchInput, setSearch } }}
        />
      </Box>

      <AlertDialog
        openAlert={openAlert}
        title="¿Eliminar Producto?"
        message={`¿Está seguro de eliminar ${selectedRows.length} productos?`}
        onConfirm={handleBulkDelete}
        onCloseAlert={() => setOpenAlert(false)}
      />

      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={[
          {
            name: "nombre_producto",
            label: "Nombre del Producto",
            type: "text",
          },
          { name: "marca", label: "Marca", type: "text" },
          { name: "codigo_barra", label: "Código de Barra", type: "text" },
          { name: "precio", label: "Precio", type: "number" },
          { name: "cantidad_inicial", label: "Cantidad", type: "number" },
          { name: "descripcion", label: "Descripción", type: "text" },
          {
            name: "id_categoria",
            label: "Categoría",
            type: "select",
            options:
              categorias?.map((c) => ({
                value: c.id_categoria,
                label: c.nombre_categoria,
              })) || [],
          },
          { name: "es_para_venta", label: "¿Para Venta?", type: "checkbox" },
        ]}
        title="Añadir Nuevo Producto"
      />
    </Box>
  );
};

export default Productos;
