import Tabs from "../../components/common/CompatTabs";
import Select from "../../components/common/CompatSelect";
import { useMemo, useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Pagination, Tooltip, useTheme, Tab, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getImageUrl } from "../../store/services/apiBase";
import { Add } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  useCreateProductoMutation,
  useDeleteProductosMutation,
  useGetAllProductosQuery } from
"../../store/services/productoApi";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import Box from "../../components/common/CompatBox";
import Typography from "../../components/common/CompatTypography";

import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import Header from "../../components/common/Header";
import ModalForm from "../../components/common/ModalForm";
import AlertDialog from "../../components/common/AlertDialog";
import DataGridCustomToolbar from "../../components/common/DataGridCustomToolBar";
import SearchBar from "../../components/common/SearchBar";
import { CustomPagination } from "../../components/common/CustomPagination";
import { useHasPermission } from "../../utils/useHasPermission";
import { useIsMobile } from "../../utils/useIsMobile";
import { MenuItem, InputLabel, FormControl } from "@mui/material";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import InventarioMatriz from "../../components/productos/InventarioMatriz";
import InventarioTabsPorSucursal from "../../components/productos/InventarioTabsPorSucursal";
import InventarioAccordionPorProducto from "../../components/productos/InventarioAccordionPorProducto";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { useSelector } from "react-redux";
import ImageCell from "../../components/common/ImageCell";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import DangerActionButton from "../../components/common/DangerActionButton";
import PrimaryActionButton from "../../components/common/PrimaryActionButton";
import {
  getActionIconButtonSx,
  getStandardDataGridSx
} from "../../components/common/tableStyles";
import { normalizeDataGridSelection } from "../../utils/dataGridSelection";
import { filterBySearch } from "../../utils/searchUtils";

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
  const isMobile = useIsMobile();

  const sucursalActiva = useSucursalActiva();
  const { rol } = useSelector((state) => state.auth);

  const pageSizeOptions = [5, 10, 25, 50];

  const [vista, setVista] = useState(0);
  const shouldFetchAll = vista === 1 || vista === 2 || vista === 3;
  const isSearching = Boolean(search.trim());

  const { data, isLoading, isError, refetch } = useGetAllProductosQuery(
    {
      estado: "Disponible - Bodega",
      page: isSearching ? 1 : page + 1,
      limit: isSearching ? 1000 : pageSize
    },
    { refetchOnFocus: true, refetchOnReconnect: true }
  );

  const {
    data: dataTodosProductos,
    isLoading: isLoadingTodos,
    isError: isErrorTodos,
    refetch: refetchAllProductos
  } = useGetAllProductosQuery(
    {
      estado: "Disponible - Bodega",
      limit: 1000
    },
    { skip: !shouldFetchAll }
  );

  const handleTabChange = (_, value) => {
    setVista(value);
  };

  const { data: sucursales, isLoading: loadingSucursales } =
  useGetAllSucursalsQuery();

  const canCreateProducto = useHasPermission("inventario.producto.crear");
  const canDeleteProducto = useHasPermission("inventario.producto.eliminar");
  const canEditProducto = useHasPermission("inventario.producto.editar");

  const paginacion = useMemo(() => data?.paginacion || {}, [data?.paginacion]);

  const { data: categorias, refetch: refetchCategorias } =
  useGetAllCategoriasQuery();

  useRegisterRefresh(
    "productos",
    async () => {
      await Promise.all([
      refetch(),
      refetchAllProductos(),
      refetchCategorias()]
      );
      return true;
    },
    [refetch, refetchAllProductos, refetchCategorias]
  );

  const [createProducto, { isLoading: isCreating }] =
  useCreateProductoMutation();
  const [deleteProductos, { isLoading: isDeleting }] =
  useDeleteProductosMutation();

  const rawRows = useMemo(
    () =>
      data?.productos?.map((row) => {
        const stockTotal = Array.isArray(row.inventario) ?
        rol !== "administrador" && sucursalActiva?.id_sucursal ?
        row.inventario.find(
          (inv) => inv.id_sucursal === sucursalActiva.id_sucursal
        )?.cantidad || 0 :
        row.inventario.reduce((acc, inv) => acc + (inv.cantidad || 0), 0) :
        0;

        return {
          id: row.id_producto,
          nombre: row.nombre_producto,
          marca: row.marca || "",
          codigo_barra: row.codigo_barra || "",
          precio: row.precio,
          descripcion: row.descripcion || "",
          stock: stockTotal,
          categoria: row.categoria?.nombre_categoria || "Sin categoría",
          estado: row.estado?.nombre_estado || "Sin estado",
          es_para_venta: Boolean(row.es_para_venta),
          image_url: row.image_url
        };
      }) || [],
    [data?.productos, rol, sucursalActiva]
  );

  const filteredRows = useMemo(
    () =>
      filterBySearch(rawRows, search, [
        "id",
        "nombre",
        "marca",
        "codigo_barra",
        "descripcion",
        "categoria",
        "estado"
      ]),
    [rawRows, search]
  );

  const rows = useMemo(() => {
    if (!isSearching) return rawRows;
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, isSearching, page, pageSize, rawRows]);

  const listPagination = useMemo(
    () =>
      isSearching ?
      {
        totalItems: filteredRows.length,
        totalPages: Math.max(1, Math.ceil(filteredRows.length / pageSize))
      } :
      paginacion,
    [filteredRows.length, isSearching, pageSize, paginacion]
  );

  const productosFiltradosPorSucursal = useMemo(() => {
    if (rol === "administrador" || !sucursalActiva?.id_sucursal) {
      return dataTodosProductos?.productos || [];
    }

    return (dataTodosProductos?.productos || []).map((prod) => ({
      ...prod,
      inventario: prod.inventario?.filter(
        (inv) => inv.id_sucursal === sucursalActiva.id_sucursal
      )
    }));
  }, [dataTodosProductos?.productos, rol, sucursalActiva]);

  const productosBuscadosParaVistas = useMemo(
    () =>
      filterBySearch(productosFiltradosPorSucursal, search, [
        "id_producto",
        "nombre_producto",
        "marca",
        "codigo_barra",
        "descripcion",
        "categoria.nombre_categoria",
        "estado.nombre_estado",
        (producto) =>
          producto.inventario
            ?.map(
              (item) =>
                item?.sucursal?.nombre ||
                item?.Sucursal?.nombre ||
                item?.nombre_sucursal
            )
            .join(" ")
      ]),
    [productosFiltradosPorSucursal, search]
  );

  useEffect(() => {
    setPage(0);
  }, [search]);

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
    renderCell: (params) => <ImageCell url={getImageUrl(params.value)} />
  },
  { field: "nombre", headerName: "Nombre", flex: 0.3 },
  { field: "categoria", headerName: "Categoría", flex: 0.3 },
  {
    field: "stock",
    headerName: "Stock Total",
    flex: 0.15,
    renderCell: (params) => {
      const stock = params.value;
      return stock === 0 ?
      <Chip
        label="Sin stock"
        color="error"
        size="small"
        sx={{ fontWeight: 700, fontSize: 13 }} /> :

      stock < 10 ?
      <Chip
        label={stock}
        color="warning"
        size="small"
        sx={{ fontWeight: 700, fontSize: 13 }} /> :


      <Typography fontWeight={700} fontSize={15}>
            {stock}
          </Typography>;

    }
  },
  ...(canEditProducto ?
  [
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 0.2,
    sortable: false,
    renderCell: (params) =>
    <Box display="flex" gap={1} sx={{ alignItems: "center" }}>
        <Tooltip title="Ver producto">
          <IconButton
          aria-label="Ver producto"
          size="small"
          sx={getActionIconButtonSx(theme, "info")}
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/productos/ver/${params.row.id}`, {
              state: { refetch: false }
            });
          }}>

            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar producto">
          <IconButton
          aria-label="Editar producto"
          size="small"
          sx={getActionIconButtonSx(theme, "primary")}
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/productos/editar/${params.row.id}`);
          }}>

            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

  }] :

  [])];


  const rowsPerPageOptions = [5, 10, 25, 50];

  const handleSubmit = async (data) => {
    try {
      await createProducto(data).unwrap();
      dispatch(
        showNotification({
          message: "Producto creado con éxito",
          severity: "success"
        })
      );
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear producto: ${error?.data?.error}`,
          severity: "error"
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
          severity: "success"
        })
      );
      setSelectedRows([]);
      refetch();
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al eliminar productos: ${error}`,
          severity: "error"
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

  if (isError || isErrorTodos) {
    dispatch(
      showNotification({
        message: `Error al cargar productos ${isError}`,
        severity: "error"
      })
    );
  }

  return (
    <Box
      sx={{
        mt: "1.5rem",
        mb: "1.5rem",
        p: 2,
        overflow: "hidden"
      }}>

      <Header title="Productos" subtitle="Gestión de productos" />
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: "center",
          mb: 3,
          gap: isMobile ? 3 : 0
        }}>

        {canDeleteProducto && (
        isMobile ?
        <IconButton
          aria-label="Eliminar seleccionados"
          disabled={selectedRows.length === 0 || isDeleting}
          onClick={() => {
            if (selectedRows.length > 0 && !isDeleting) setOpenAlert(true);
          }}
          sx={getActionIconButtonSx(theme, "error", {
            width: 40,
            height: 40,
            minWidth: 40
          })}>

              <DeleteForeverIcon fontSize="small" />
            </IconButton> :

        <DangerActionButton
          label="Eliminar seleccionados"
          startIcon={<DeleteForeverIcon />}
          onClick={() => setOpenAlert(true)}
          disabled={selectedRows.length === 0}
          loading={isDeleting} />)

        }

        {canCreateProducto && (
        isMobile ?
        <IconButton
          aria-label="Nuevo producto"
          onClick={() => setOpen(true)}
          sx={getActionIconButtonSx(theme, "primary", {
            width: 40,
            height: 40,
            minWidth: 40
          })}>

              <Add fontSize="small" />
            </IconButton> :

        <PrimaryActionButton
          label="Nuevo producto"
          startIcon={<Add />}
          onClick={() => setOpen(true)} />)

        }
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
            mb: 2,
            px: 0.5,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 6px 18px rgba(15, 23, 42, 0.04)"
                : "0 6px 18px rgba(0,0,0,0.2)"
          }}>
          <Tabs
            value={vista}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{
              sx: { height: 2, bgcolor: "primary.main" }
            }}
            sx={{
              minHeight: 42,
              "& .MuiTab-root": {
                minHeight: 42,
                px: 1.5,
                textTransform: "none",
                fontWeight: 650,
                fontSize: 13,
                letterSpacing: 0,
                color: "text.secondary",
                borderRadius: 1,
                "&.Mui-selected": {
                  color: "primary.main",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? alpha(theme.palette.primary.main, 0.06)
                      : alpha(theme.palette.primary.light, 0.1)
                }
              }
            }}>

            <Tab label="Listado" />
            <Tab label="Matriz Global" />
            <Tab label="Por Sucursal" />
            <Tab label="Por Producto" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 2, maxWidth: { xs: "100%", sm: 420 } }}>
            <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={setSearch}
            placeholder="Buscar productos por nombre, categoría o código..."
            width={{ xs: "100%", sm: 420 }} />

          </Box>

        {vista === 0 && (
        isMobile ?
        <Box>
              {rows.length === 0 ?
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              color: theme.palette.text.secondary
            }}>

                  No hay productos para mostrar.
                </Box> :

          <>
                  <Box
              display="flex"
              justifyContent="flex-end"
              mb={1}
              alignItems="center"
              gap={1}>

                    <FormControl size="small" sx={{ minWidth: 90 }}>
                      <InputLabel id="mobile-page-size-label">
                        Por página
                      </InputLabel>
                      <Select
                  labelId="mobile-page-size-label"
                  id="mobile-page-size"
                  value={pageSize}
                  label="Por página"
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}>

                        {pageSizeOptions.map((option) =>
                  <MenuItem value={option} key={option}>
                            {option}
                          </MenuItem>
                  )}
                      </Select>
                    </FormControl>
                  </Box>
                  {rows.map((row) =>
            <Box
              key={row.id}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                boxShadow: 2,
                background: theme.palette.background.paper,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2
              }}>

                      <Box display="flex" alignItems="center" gap={2}>
                        {row.image_url ?
                <img
                  src={getImageUrl(row.image_url)}
                  alt={row.nombre}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                    "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";
                  }} /> :


                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: theme.palette.grey[200],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>

                            <ImageOutlinedIcon
                    sx={{
                      color: theme.palette.grey[500],
                      fontSize: 32
                    }} />

                          </Box>
                }
                        <Box>
                          <Typography fontWeight={700} fontSize={16}>
                            {row.nombre}
                          </Typography>
                          <Typography fontSize={13} color="text.secondary">
                            Stock: <b>{row.stock}</b>
                          </Typography>
                          <Typography fontSize={12} color="text.disabled">
                            {row.categoria}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" gap={1}>
                        {canEditProducto &&
                <Tooltip title="Ver producto">
                  <IconButton
                    aria-label="Ver producto"
                    size="small"
                    sx={getActionIconButtonSx(theme, "info", {
                      width: 38,
                      height: 38
                    })}
                    onClick={() => navigate(`/productos/ver/${row.id}`)}>

                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                }
                        {canEditProducto &&
                <Tooltip title="Editar producto">
                  <IconButton
                    aria-label="Editar producto"
                    size="small"
                    sx={getActionIconButtonSx(theme, "primary", {
                      width: 38,
                      height: 38
                    })}
                    onClick={() =>
                    navigate(`/productos/editar/${row.id}`)
                    }>

                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                }
                      </Box>
                    </Box>
            )}
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                count={listPagination.totalPages || 1}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                color="primary"
                size="large"
                siblingCount={0} />

                  </Box>
                </>
          }
            </Box> :

        <Box sx={{ height: "600px" }}>

              <DataGrid
            rows={rows || []}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            pageSize={pageSize}
            paginationMode="server"
            rowCount={listPagination?.totalItems || rows.length}
            paginationModel={{ page: page, pageSize: pageSize }}
            pageSizeOptions={rowsPerPageOptions}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            checkboxSelection
            onRowSelectionModelChange={(ids) =>
              setSelectedRows(normalizeDataGridSelection(ids))
            }
            slots={{
              toolbar: DataGridCustomToolbar,
              pagination: CustomPagination
            }}
            slotProps={{
              toolbar: {
                searchInput,
                setSearchInput,
                setSearch,
                placeholder: "Buscar productos por nombre, categoría o código...",
                showSearch: false
              }
            }}
            disableRowSelectionOnClick
            disableRowSelectionExcludeModel
            sx={getStandardDataGridSx(theme)} />

            </Box>)
        }
        {vista === 1 && (
        isLoadingTodos ?
        <LoaderComponent /> :

        <InventarioMatriz
          productos={productosBuscadosParaVistas}
          sucursales={
          rol === "administrador" ?
          sucursales || [] :
          sucursales?.filter(
            (s) => s.id_sucursal === sucursalActiva.id_sucursal
          ) || []
          } />)

        }

        {vista === 2 && (
        isLoadingTodos ?
        <LoaderComponent /> :

        <InventarioTabsPorSucursal
          productos={productosBuscadosParaVistas}
          sucursales={
          rol === "administrador" ?
          sucursales || [] :
          sucursales?.filter(
            (s) => s.id_sucursal === sucursalActiva.id_sucursal
          ) || []
          } />)

        }

        {vista === 3 && (
        isLoadingTodos ?
        <LoaderComponent /> :

        <InventarioAccordionPorProducto
          productos={productosBuscadosParaVistas}
          sucursales={
          rol === "administrador" ?
          sucursales || [] :
          sucursales?.filter(
            (s) => s.id_sucursal === sucursalActiva.id_sucursal
          ) || []
          } />)

        }
      </Box>

      <AlertDialog
        openAlert={openAlert}
        title="¿Eliminar Producto?"
        message={`¿Está seguro de eliminar ${selectedRows.length} productos?`}
        onConfirm={handleBulkDelete}
        onCloseAlert={() => setOpenAlert(false)} />


      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        fields={[
        {
          name: "nombre_producto",
          label: "Nombre del Producto",
          type: "text"
        },
        { name: "marca", label: "Marca", type: "text" },
        { name: "codigo_barra", label: "Código de Barra", type: "text" },
        { name: "precio", label: "Precio", type: "number" },
        { name: "descripcion", label: "Descripción", type: "text" },
        {
          name: "id_categoria",
          label: "Categoría",
          type: "select",
          options:
          categorias?.map((c) => ({
            value: c.id_categoria,
            label: c.nombre_categoria
          })) || []
        },
        /*  {
          name: "id_sucursal",
          label: "Sucursal",
          type: "select",
          required: true,
          options: sucursales
            ? sucursales.map((s) => ({
                value: s.id_sucursal,
                label: s.nombre,
              }))
            : [],
        }, */
        { name: "es_para_venta", label: "¿Para Venta?", type: "checkbox" }]
        }
        title="Añadir Nuevo Producto"
        isLoading={loadingSucursales || isCreating} />

    </Box>);

};

export default Productos;
