import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Chip, Tab, Tabs, Typography /* useTheme */ } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function getCantidadEnSucursal(inventario, id_sucursal) {
  if (!Array.isArray(inventario)) {
    return typeof inventario?.cantidad === "number" ? inventario.cantidad : 0;
  }
  return inventario.find((i) => i.id_sucursal === id_sucursal)?.cantidad || 0;
}

function getTotal(inventario) {
  if (Array.isArray(inventario)) {
    return inventario.reduce((acc, i) => acc + (i.cantidad || 0), 0);
  }
  return typeof inventario?.cantidad === "number" ? inventario.cantidad : 0;
}

export default function InventarioTabsInsumosPorSucursal({
  insumos = [],
  sucursales = [],
}) {
  /*  const theme = useTheme(); */

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const noSucursales = !Array.isArray(sucursales) || sucursales.length === 0;

  const columns = useMemo(
    () => [
      {
        field: "nombre_insumo",
        headerName: "Insumo",
        flex: 0.6,
        minWidth: 200,
      },
      {
        field: "stock",
        headerName: "Stock",
        flex: 0.25,
        minWidth: 120,
        renderCell: (params) => {
          const v = params.value ?? 0;
          return v === 0 ? (
            <Chip
              label="0"
              color="error"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          ) : v < 10 ? (
            <Chip
              label={v}
              color="warning"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          ) : (
            <Typography fontWeight={700}>{v}</Typography>
          );
        },
      },
    ],
    []
  );

  const rowsNoSucursales = useMemo(
    () =>
      (insumos || []).map((ins) => ({
        id: ins.id_insumo,
        nombre_insumo: ins.nombre_insumo,
        stock: getTotal(ins.inventario),
      })),
    [insumos]
  );

  const sucIds = useMemo(
    () => (sucursales || []).map((s) => s.id_sucursal),
    [sucursales]
  );

  const rowsBySucursal = useMemo(() => {
    const map = {};
    (sucursales || []).forEach((s) => {
      map[s.id_sucursal] = (insumos || []).map((ins) => ({
        id: `${ins.id_insumo}-${s.id_sucursal}`,
        id_insumo: ins.id_insumo,
        nombre_insumo: ins.nombre_insumo,
        stock: getCantidadEnSucursal(ins.inventario, s.id_sucursal),
      }));
    });
    return map;
  }, [insumos, sucursales]);

  const activeRows = useMemo(() => {
    if (noSucursales) return rowsNoSucursales;
    const activeSucId = sucIds[tab];
    return rowsBySucursal[activeSucId] || [];
  }, [noSucursales, rowsNoSucursales, rowsBySucursal, sucIds, tab]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const totalRows = activeRows?.length ?? 0;

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalRows / (paginationModel.pageSize || 25))
    );
    const maxPage = totalPages - 1;
    if (paginationModel.page > maxPage) {
      setPaginationModel((p) => ({ ...p, page: maxPage }));
    }
  }, [totalRows, paginationModel.pageSize, paginationModel.page]);

  return (
    <Box>
      {!noSucursales && (
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setPage(0);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {sucursales.map((s) => (
            <Tab key={s.id_sucursal} label={s.nombre} />
          ))}
        </Tabs>
      )}

      <Box sx={{ height: "70vh" }}>
        <DataGrid
          rows={activeRows || []}
          columns={columns}
          pagination
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          getRowId={(row) => row.id}
          slotProps={{ pagination: { count: totalRows } }}
        />
      </Box>
    </Box>
  );
}

InventarioTabsInsumosPorSucursal.propTypes = {
  insumos: PropTypes.array,
  sucursales: PropTypes.array,
};
