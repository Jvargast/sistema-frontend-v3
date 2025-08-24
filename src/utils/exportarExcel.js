import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const getSucursalId = (v) =>
  Number(
    v?.id_sucursal ??
      v?.Sucursal?.id_sucursal ??
      v?.sucursal?.id_sucursal ??
      NaN
  );

const sanitize = (s = "") => s.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");

export function exportarVentasExcel({
  ventas,
  fechaInicio,
  fechaFin,
  vendedorNombre,
  sucursalNombre,
  sucursales = [],
  onExportSuccess,
}) {
  if (!ventas.length) {
    alert("No hay datos para exportar.");
    return;
  }

  const sucMap = new Map(
    (sucursales || []).map((s) => [Number(s.id_sucursal), s.nombre])
  );

  const dataVentas = ventas.map((v) => {
    const idSuc = getSucursalId(v);
    const sucName =
      sucMap.get(idSuc) ||
      v?.Sucursal?.nombre ||
      v?.sucursal?.nombre ||
      (Number.isFinite(idSuc) ? `Sucursal ${idSuc}` : "-");

    return {
      ID: v.id_venta,
      Sucursal: sucName,
      Vendedor: v.vendedor?.nombre,
      Cliente: v.cliente?.nombre,
      Total: Number(v.total),
      Fecha: new Date(v.fecha).toLocaleDateString(),
      Estado: v.estadoVenta?.nombre_estado,
    };
  });

  const resumenEstado = {};
  ventas.forEach((v) => {
    const estado = v.estadoVenta?.nombre_estado || "Desconocido";
    resumenEstado[estado] = (resumenEstado[estado] || 0) + Number(v.total || 0);
  });
  const resumenEstadoArray = Object.entries(resumenEstado).map(
    ([Estado, Total]) => ({
      Estado,
      Total,
    })
  );

  const ventasPagadas = ventas.filter(
    (v) => (v.estadoVenta?.nombre_estado || "").toLowerCase() === "pagada"
  );

  const resumenSucursal = {};
  ventasPagadas.forEach((v) => {
    const idSuc = getSucursalId(v);
    const sucName =
      sucMap.get(idSuc) ||
      v?.Sucursal?.nombre ||
      v?.sucursal?.nombre ||
      (Number.isFinite(idSuc) ? `Sucursal ${idSuc}` : "-");
    resumenSucursal[sucName] =
      (resumenSucursal[sucName] || 0) + Number(v.total || 0);
  });
  const resumenSucursalArray = Object.entries(resumenSucursal).map(
    ([Sucursal, Total]) => ({ Sucursal, Total })
  );

  const wb = XLSX.utils.book_new();
  const wsData = XLSX.utils.json_to_sheet(dataVentas);
  const wsResumenEstado = XLSX.utils.json_to_sheet(resumenEstadoArray);
  const wsResumenSucursal = XLSX.utils.json_to_sheet(resumenSucursalArray);

  wsData["!autofilter"] = { ref: "A1:G1" };
  wsData["!cols"] = [
    { wch: 8 }, // ID
    { wch: 22 }, // Sucursal
    { wch: 20 }, // Vendedor
    { wch: 20 }, // Cliente
    { wch: 12 }, // Total
    { wch: 13 }, // Fecha
    { wch: 18 }, // Estado
  ];

  XLSX.utils.book_append_sheet(wb, wsData, "Ventas");
  XLSX.utils.book_append_sheet(wb, wsResumenEstado, "Resumen por Estado");
  XLSX.utils.book_append_sheet(wb, wsResumenSucursal, "Resumen por Sucursal");

  const fechaIniStr = fechaInicio
    ? new Date(fechaInicio).toISOString().slice(0, 10)
    : "";
  const fechaFinStr = fechaFin
    ? new Date(fechaFin).toISOString().slice(0, 10)
    : "";

  let nombre = "ventas";
  if (fechaIniStr && fechaFinStr) nombre += `-${fechaIniStr}_al_${fechaFinStr}`;
  if (sucursalNombre) nombre += `-${sanitize(sucursalNombre).slice(0, 25)}`;
  if (vendedorNombre) nombre += `-${sanitize(vendedorNombre).slice(0, 25)}`;
  nombre += ".xlsx";

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombre);

  if (onExportSuccess) onExportSuccess(nombre);
}
