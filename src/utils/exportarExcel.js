import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportarVentasExcel({
  ventas,
  fechaInicio,
  fechaFin,
  vendedorNombre,
  onExportSuccess,
}) {
  if (!ventas.length) {
    alert("No hay datos para exportar.");
    return;
  }

  const dataVentas = ventas.map((v) => ({
    ID: v.id_venta,
    Vendedor: v.vendedor?.nombre,
    Cliente: v.cliente?.nombre,
    Total: Number(v.total),
    Fecha: new Date(v.fecha).toLocaleDateString(),
    Estado: v.estadoVenta?.nombre_estado,
  }));

  const resumen = {};
  ventas.forEach((v) => {
    const estado = v.estadoVenta?.nombre_estado || "Desconocido";
    resumen[estado] = (resumen[estado] || 0) + Number(v.total || 0);
  });
  const resumenArray = Object.entries(resumen).map(([estado, total]) => ({
    Estado: estado,
    Total: total,
  }));

  const wb = XLSX.utils.book_new();
  const wsData = XLSX.utils.json_to_sheet(dataVentas);
  const wsResumen = XLSX.utils.json_to_sheet(resumenArray);

  wsData["!autofilter"] = { ref: "A1:F1" };
  wsData["!cols"] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 13 },
    { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(wb, wsData, "Ventas");
  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen por Estado");

  const fechaIniStr = fechaInicio
    ? new Date(fechaInicio).toISOString().slice(0, 10)
    : "";
  const fechaFinStr = fechaFin
    ? new Date(fechaFin).toISOString().slice(0, 10)
    : "";

  let vendedorStr = "";
  if (vendedorNombre) {
    vendedorStr =
      "-" +
      vendedorNombre
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 25);
  }

  let nombre = "ventas";
  if (fechaIniStr && fechaFinStr) nombre += `-${fechaIniStr}_al_${fechaFinStr}`;
  if (vendedorStr) nombre += vendedorStr;
  nombre += ".xlsx";

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombre);

  if (onExportSuccess) onExportSuccess(nombre);
}
