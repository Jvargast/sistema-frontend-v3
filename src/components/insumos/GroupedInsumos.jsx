import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllInsumosQuery } from "../../store/services/insumoApi";
import LoaderComponent from "../common/LoaderComponent";
import DataGridCustomToolbar from "../common/DataGridCustomToolBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import EditIcon from "@mui/icons-material/Edit";
import { useHasPermission } from "../../utils/useHasPermission";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

const GroupedInsumos = ({
  tipo,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  handleEdit,
  setSelectedRows,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const canEditInsumo = useHasPermission("inventario.insumo.editar");

  const { data, isLoading, isError } = useGetAllInsumosQuery({
    tipo,
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });

  const handlePaginationChange = (model) => {
    setPagination({ page: model.page, pageSize: model.pageSize });
  };

  useEffect(() => {
    if (isError) {
      dispatch(
        showNotification({
          message: `Error al cargar insumos ${isError}`,
          severity: "error",
        })
      );
    }
  }, [isError, dispatch]);

  const rows = useMemo(() => {
    return data?.data?.items
      ? data.data.items.map((row) => ({
          ...row,
          stock:
            row.inventario?.cantidad !== undefined
              ? row.inventario.cantidad
              : "Sin Stock",
        }))
      : [];
  }, [data?.data?.items]);

  if (isLoading) return <LoaderComponent />;

  return (
    <Box sx={{ marginBottom: "2rem" }}>
      <Box
        sx={{
          height: "600px",
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "8px",
            overflow: "hidden",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#23272f" : "#f4f4f4",
            color: (theme) => theme.palette.text.primary,
            fontWeight: "bold",
            fontSize: "1rem",
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderColor: theme.palette.grey[300],
            "& > div": {
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            display: "flex",
            "&:not(:last-child)": {
              borderRight: "1px solid #d1d9e6",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#23272f" : "#f4f4f4",
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "0.5rem",
          },
        }}
      >
        <DataGrid
          sx={{ fontSize: "1rem" }}
          rows={rows}
          columns={[
            { field: "id_insumo", headerName: "ID", flex: 0.25 },
            {
              field: "image_url",
              headerName: "Imagen",
              sortable: false,
              resizable: false,
              width: 100,
              renderCell: (params) =>
                params.value ? (
                  <img
                    src={params.value}
                    alt="Insumo"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <ImageNotSupportedOutlinedIcon
                    sx={{ width: 50, height: 50, color: "grey.400" }}
                  />
                ),
            },
            {
              field: "nombre_insumo",
              headerName: "Nombre",
              flex: 0.5,
              sortable: false,
              resizable: false,
            },
            {
              field: "stock",
              headerName: "Stock",
              flex: 0.315,
              sortable: false,
              resizable: false,
            },
            ...(canEditInsumo
              ? [
                  {
                    field: "acciones",
                    headerName: "Acciones",
                    flex: 0.3,
                    sortable: false,
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          color="info"
                          aria-label="Ver insumo"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/insumos/ver/${params.row.id_insumo}`, {
                              state: { refetch: false },
                            });
                          }}
                          sx={{
                            color: theme.palette.info.main,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.info.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {/* Botón Editar */}
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(params.row);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    ),
                  },
                ]
              : []),
          ]}
          getRowId={(row) => row.id_insumo}
          paginationMode="server"
          rowCount={data?.data.totalItems || 0}
          paginationModel={pagination}
          checkboxSelection
          onRowSelectionModelChange={(selectedIds) => {
            // Mapea sequentialIds a id_insumo
            const selectedInsumos = selectedIds
              .map((id) => rows.find((row) => row.id_insumo === id)?.id_insumo)
              .filter((id) => id);

            setSelectedRows((prev) => ({
              ...prev,
              [tipo]: selectedInsumos,
            }));
          }}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10, 25, 50]}
          slots={{ toolbar: DataGridCustomToolbar }}
          slotProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};
GroupedInsumos.propTypes = {
  tipo: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  searchInput: PropTypes.string.isRequired,
  setSearchInput: PropTypes.func.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default GroupedInsumos;
