import { useMemo, useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
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
    {
      field: "image_url",
      headerName: "Imagen",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value || "https://via.placeholder.com/50"}
          alt="Producto"
          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
        />
      ),
    },
    { field: "id", headerName: "ID", flex: 0.25 },
    { field: "nombre", headerName: "Nombre", flex: 0.5 },
    { field: "codigo_barra", headerName: "Código de Barra", flex: 0.5 },
    { field: "marca", headerName: "Marca", flex: 0.3 },
    { field: "categoria", headerName: "Categoría", flex: 0.4 },
    { field: "stock", headerName: "Stock", flex: 0.3 },
    ...(canEditProducto
      ? [
          {
            field: "acciones",
            headerName: "Acciones",
            flex: 0.3,
            sortable: false,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/productos/editar/${params.row.id}`)}
                >
                  <EditIcon />
                </IconButton>
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
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "1200px",
        margin: "auto",
        overflow: "hidden", // Prevenir scroll horizontal
      }}
    >
      <Header title="Productos" subtitle="Gestión de productos" />
      {/* Botones de acción */}
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

      {/* DataGrid con estilos */}
      <Box
        sx={{
          height: "600px", // Altura fija con scroll interno
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "8px",
            overflow: "hidden", // Prevenir scroll externo
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f4f4",
            color: "#333",
            fontWeight: "bold",
            fontSize: "1rem",
            borderBottom: "1px solid #d1d9e6",
            borderColor: theme.palette.grey[300],
            "& > div": {
              borderRight: "1px solid #d1d9e6", // Separadores entre columnas en encabezados
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderColor: theme.palette.grey[300],
            color: "#555",
            display: "flex",
            "&:not(:last-child)": {
              borderRight: "1px solid #d1d9e6", // Separadores entre celdas
            },
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#f4f4f4",
            borderTop: "1px solid #ddd",
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "0.5rem",
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

      {/* AlertDialog para confirmación */}
      <AlertDialog
        openAlert={openAlert}
        title="¿Eliminar Producto?"
        message={`¿Está seguro de eliminar ${selectedRows.length} productos?`}
        onConfirm={handleBulkDelete}
        onCloseAlert={() => setOpenAlert(false)}
      />

      {/* ModalForm para agregar o editar productos */}
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
