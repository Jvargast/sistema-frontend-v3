import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function getCantidadEnSucursal(inventario, id_sucursal) {
  if (!Array.isArray(inventario))
    return typeof inventario?.cantidad === "number" ? inventario.cantidad : 0;
  return (
    inventario.find((inv) => inv.id_sucursal === id_sucursal)?.cantidad || 0
  );
}

export default function InventarioMatrizInsumos({
  insumos = [],
  sucursales = [],
}) {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const columns = useMemo(() => {
    const base = [
      {
        field: "nombre_insumo",
        headerName: "Insumo",
        flex: 0.6,
        minWidth: 200,
      },
    ];

    const sucCols = (sucursales || []).map((s) => ({
      field: `suc_${s.id_sucursal}`,
      headerName: s.nombre,
      minWidth: 120,
      flex: 0.25,
      sortable: false,
      renderCell: (params) => {
        const value = params.value ?? 0;
        return value === 0 ? (
          <Chip label="0" color="error" size="small" sx={{ fontWeight: 700 }} />
        ) : value < 10 ? (
          <Chip
            label={value}
            color="warning"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        ) : (
          <Typography fontWeight={700}>{value}</Typography>
        );
      },
    }));

    const totalCol = {
      field: "total",
      headerName: "Total",
      minWidth: 120,
      flex: 0.25,
      renderCell: (params) => {
        const total = params.value ?? 0;
        return total === 0 ? (
          <Chip label="0" color="error" size="small" sx={{ fontWeight: 700 }} />
        ) : total < 10 ? (
          <Chip
            label={total}
            color="warning"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        ) : (
          <Typography fontWeight={700}>{total}</Typography>
        );
      },
    };

    return [...base, ...sucCols, totalCol];
  }, [sucursales]);

  const rows = useMemo(() => {
    return (insumos || []).map((ins) => {
      const row = {
        id: ins.id_insumo,
        nombre_insumo: ins.nombre_insumo,
      };
      let total = 0;

      (sucursales || []).forEach((s) => {
        const cant = getCantidadEnSucursal(ins.inventario, s.id_sucursal);
        row[`suc_${s.id_sucursal}`] = cant;
        total += cant;
      });

      // Si no hay sucursales (usuario no admin), usamos el inventario tal cual
      if ((sucursales || []).length === 0) {
        const cant = Array.isArray(ins.inventario)
          ? ins.inventario.reduce((acc, i) => acc + (i.cantidad || 0), 0)
          : typeof ins?.inventario?.cantidad === "number"
          ? ins.inventario.cantidad
          : 0;
        row["total"] = cant;
      } else {
        row["total"] = total;
      }
      return row;
    });
  }, [insumos, sucursales]);

  const totalRows = Array.isArray(rows) ? rows.length : 0;

  useEffect(() => {
    const totalItems = Array.isArray(rows) ? rows.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / (pageSize || 25)));
    const maxPage = totalPages - 1;
    if (page > maxPage) setPage(maxPage);
    //eslint-disable-next-line
  }, [rows?.length, pageSize, page]);

  return (
    <Box
      sx={{
        height: "70vh",
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          fontWeight: 700,
        },
      }}
    >
      <DataGrid
        rows={rows || []}
        columns={columns}
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowId={(row) => row.id}
        slotProps={{ pagination: { count: totalRows } }}
      />
    </Box>
  );
}

InventarioMatrizInsumos.propTypes = {
  insumos: PropTypes.array,
  sucursales: PropTypes.array,
};
