import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllInsumosQuery } from "../../store/services/insumoApi";
import LoaderComponent from "../common/LoaderComponent";
import DataGridCustomToolbar from "../common/DataGridCustomToolBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import EditIcon from "@mui/icons-material/Edit";
import { useHasPermission } from "../../utils/useHasPermission";

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

  // Preprocesar filas con useMemo
  const rows = useMemo(() => {
    return data?.data?.items
      ? data.data.items.map((row) => ({
          ...row,
          stock:
            row.inventario?.cantidad !== undefined
              ? row.inventario.cantidad
              : "Sin Stock", // Calcula el stock
        }))
      : [];
  }, [data?.data?.items]);

  if (isLoading) return <LoaderComponent />;

  return (
    <Box sx={{ marginBottom: "2rem" }}>
      <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>{tipo}</Typography>
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
              renderCell: (params) => (
                <img
                  src={params.value || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                  alt="Insumo"
                  style={{ width: "50px", height: "50px", borderRadius: "8px" }}
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
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(params.row); // Llamar a handleEdit con la fila seleccionada
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
              [tipo]: selectedInsumos, // Actualiza las selecciones del tipo actual
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
