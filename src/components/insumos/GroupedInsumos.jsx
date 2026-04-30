import Select from "../common/CompatSelect";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Pagination, Tooltip, useTheme, Chip, MenuItem, InputLabel, FormControl } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllInsumosQuery } from "../../store/services/insumoApi";
import LoaderComponent from "../common/LoaderComponent";
import DataGridCustomToolbar from "../common/DataGridCustomToolBar";
import SearchBar from "../common/SearchBar";
import { CustomPagination } from "../common/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import EditIcon from "@mui/icons-material/Edit";
import { useHasPermission } from "../../utils/useHasPermission";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { getImageUrl } from "../../store/services/apiBase";
import ImageCell from "../common/ImageCell";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";
import {
  getActionIconButtonSx,
  getStandardDataGridSx
} from "../common/tableStyles";
import { normalizeDataGridSelection } from "../../utils/dataGridSelection";
import { filterBySearch } from "../../utils/searchUtils";

const GroupedInsumos = ({
  tipo,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  handleEdit,
  setSelectedRows,
  isMobile
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const isSearching = Boolean(search.trim());

  const canEditInsumo = useHasPermission("inventario.insumo.editar");

  const sucursalActiva = useSucursalActiva();
  const { rol } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetAllInsumosQuery({
    tipo,
    page: isSearching ? 1 : pagination.page + 1,
    limit: isSearching ? 1000 : pagination.pageSize,
    includeInventario: true,
    ...(rol === "administrador" && sucursalActiva?.id_sucursal ?
    { id_sucursal: sucursalActiva.id_sucursal } :
    {})
  });

  const handlePaginationChange = (model) => {
    setPagination({ page: model.page, pageSize: model.pageSize });
  };

  useEffect(() => {
    setPagination((prev) =>
      prev.page === 0 ? prev : { ...prev, page: 0 }
    );
  }, [search]);

  useEffect(() => {
    if (isError) {
      dispatch(
        showNotification({
          message: `Error al cargar insumos ${isError}`,
          severity: "error"
        })
      );
    }
  }, [isError, dispatch]);

  const rawRows = useMemo(() => {
    const items = data?.data?.items || [];
    return items.map((row) => {
      let stockTotal = 0;

      if (Array.isArray(row.inventario)) {
        if (rol !== "administrador" && sucursalActiva?.id_sucursal) {
          stockTotal =
          row.inventario.find(
            (inv) => inv.id_sucursal === sucursalActiva.id_sucursal
          )?.cantidad || 0;
        } else {
          stockTotal = row.inventario.reduce(
            (acc, inv) => acc + (inv.cantidad || 0),
            0
          );
        }
      } else {
        stockTotal =
        typeof row?.inventario?.cantidad === "number" ?
        row.inventario.cantidad :
        0;
      }

      return {
        ...row,
        stock: stockTotal
      };
    });
  }, [data?.data?.items, rol, sucursalActiva]);

  const filteredRows = useMemo(
    () =>
      filterBySearch(rawRows, search, [
        "id_insumo",
        "nombre_insumo",
        "codigo_barra",
        "unidad_de_medida",
        "descripcion",
        "tipo.nombre_tipo",
        "TipoInsumo.nombre_tipo"
      ]),
    [rawRows, search]
  );

  const rows = useMemo(() => {
    if (!isSearching) return rawRows;
    const start = pagination.page * pagination.pageSize;
    return filteredRows.slice(start, start + pagination.pageSize);
  }, [filteredRows, isSearching, pagination.page, pagination.pageSize, rawRows]);

  const totalItems = isSearching ?
  filteredRows.length :
  Math.max(0, parseInt(data?.data?.totalItems, 10) || 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / pagination.pageSize));

  if (isLoading) return <LoaderComponent />;

  const searchControl = (
    <Box sx={{ mb: 1.5, maxWidth: { xs: "100%", sm: 420 } }}>
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={setSearch}
        placeholder={`Buscar insumos en ${tipo}...`}
        width={{ xs: "100%", sm: 420 }} />

    </Box>
  );

  if (isMobile) {
    return (
      <Box>
        {searchControl}

        {rows.length === 0 ?
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            color: theme.palette.text.secondary
          }}>

            {search ? "No hay insumos que coincidan." : "No hay insumos."}
          </Box> :

        rows.map((row) =>
        <Box
          key={row.id_insumo}
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
              alt={row.nombre_insumo}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                objectFit: "cover"
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

                    <ImageNotSupportedOutlinedIcon
                sx={{ color: theme.palette.grey[400], fontSize: 32 }} />

                  </Box>
            }
                <Box>
                  <strong>{row.nombre_insumo}</strong>
                  <Typography fontSize={13} color="text.secondary">
                    Stock:{" "}
                    {row.stock === 0 ?
                <Chip
                  label="Sin stock"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: 12, ml: 0.5 }} /> :

                row.stock < 10 ?
                <Chip
                  label={row.stock}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: 12, ml: 0.5 }} /> :


                <b>{row.stock}</b>
                }
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1}>
                <Tooltip title="Ver insumo">
                  <IconButton
                aria-label="Ver insumo"
                size="small"
                onClick={() =>
                navigate(`/insumos/ver/${row.id_insumo}`, {
                  state: { refetch: false }
                })
                }
                sx={getActionIconButtonSx(theme, "info", {
                  width: 38,
                  height: 38
                })}>

                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {canEditInsumo &&
            <Tooltip title="Editar insumo">
              <IconButton
                aria-label="Editar insumo"
                size="small"
                onClick={() => handleEdit(row)}
                sx={getActionIconButtonSx(theme, "primary", {
                  width: 38,
                  height: 38
                })}>

                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
            }
              </Box>
            </Box>
        )
        }
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
          mb={1}>

          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel id="mobile-page-size-label">Por página</InputLabel>
            <Select
              labelId="mobile-page-size-label"
              id="mobile-page-size"
              value={pagination.pageSize}
              label="Por página"
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  page: 0
                }));
              }}>

              {[5, 10, 25, 50].map((option) =>
              <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={pagination.page + 1}
            onChange={(_, value) =>
            setPagination((prev) => ({ ...prev, page: value - 1 }))
            }
            color="primary"
            size="large" />

        </Box>
      </Box>);

  }

  // --- Vista Desktop (DataGrid) ---
  return (
    <Box>
      {searchControl}

      <Box sx={{ height: "600px" }}>

        <DataGrid
          sx={getStandardDataGridSx(theme)}
          rows={rows}
          columns={[
          { field: "id_insumo", headerName: "ID", flex: 0.2 },
          {
            field: "image_url",
            headerName: "Imagen",
            sortable: false,
            resizable: false,
            width: 100,
            renderCell: (params) =>
            <ImageCell url={getImageUrl(params.value)} />

          },
          {
            field: "nombre_insumo",
            headerName: "Nombre",
            flex: 0.55,
            sortable: false,
            resizable: false
          },
          {
            field: "stock",
            headerName:
            rol !== "administrador" && sucursalActiva?.nombre ?
            `Stock (${sucursalActiva.nombre})` :
            "Stock Total",
            flex: 0.25,
            sortable: false,
            resizable: false,
            renderCell: (params) => {
              const stock = params.value ?? 0;
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
          ...(canEditInsumo ?
          [
          {
            field: "acciones",
            headerName: "Acciones",
            flex: 0.3,
            sortable: false,
            renderCell: (params) =>
            <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Ver insumo">
                          <IconButton
                  aria-label="Ver insumo"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/insumos/ver/${params.row.id_insumo}`, {
                      state: { refetch: false }
                    });
                  }}
                  sx={getActionIconButtonSx(theme, "info")}>

                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar insumo">
                          <IconButton
                  aria-label="Editar insumo"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(params.row);
                  }}
                  sx={getActionIconButtonSx(theme, "primary")}>

                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

          }] :

          [])]
          }
          getRowId={(row) => row.id_insumo}
          paginationMode="server"
          rowCount={totalItems}
          paginationModel={pagination}
          checkboxSelection
          onRowSelectionModelChange={(selectedIds) => {
            const selectedIdsList = normalizeDataGridSelection(selectedIds);
            const selectedInsumos = selectedIdsList.
            map(
              (id) =>
              rows.find((r) => String(r.id_insumo) === String(id))
                ?.id_insumo ?? id
            ).
            filter(Boolean);
            setSelectedRows((prev) => ({
              ...prev,
              [tipo]: selectedInsumos
            }));
          }}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10, 25, 50]}
          slots={{
            toolbar: DataGridCustomToolbar,
            pagination: CustomPagination
          }}
          slotProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              setSearch,
              placeholder: `Buscar insumos en ${tipo}...`,
              showSearch: false
            }
          }}
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel />

      </Box>
    </Box>);

};

GroupedInsumos.propTypes = {
  tipo: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  searchInput: PropTypes.string.isRequired,
  setSearchInput: PropTypes.func.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default GroupedInsumos;
