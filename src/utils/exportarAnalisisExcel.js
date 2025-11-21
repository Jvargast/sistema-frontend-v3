import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const sanitize = (s = "") => s.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");

export function exportarReporteDiarioExcel({
  fecha,
  sucursalNombre,
  ventasEst = [],
  pedidosEst = [],
  productosEst = [],
  pagosEst = [],
  ventasChoferEst = [],
  entregasEst = [],
  onExportSuccess,
}) {
  const hayDatos =
    ventasEst.length ||
    pedidosEst.length ||
    productosEst.length ||
    pagosEst.length ||
    ventasChoferEst.length ||
    entregasEst.length;

  if (!hayDatos) {
    alert("No hay datos de estadísticas para exportar en esta fecha.");
    return;
  }

  const totalVentasMonto = ventasEst.reduce(
    (acc, v) => acc + Number(v.monto_total || 0),
    0
  );
  const totalVentasCount = ventasEst.reduce(
    (acc, v) => acc + Number(v.total_ventas || 0),
    0
  );

  const totalPedidos = pedidosEst.reduce(
    (acc, p) => acc + Number(p.total_pedidos || 0),
    0
  );
  const totalPedidosPagados = pedidosEst.reduce(
    (acc, p) => acc + Number(p.pedidos_pagados || 0),
    0
  );
  const totalPedidosMonto = pedidosEst.reduce(
    (acc, p) => acc + Number(p.monto_total || 0),
    0
  );

  const totalProductosVendidos = productosEst.reduce(
    (acc, p) => acc + Number(p.cantidad_vendida || 0),
    0
  );
  const totalProductosMonto = productosEst.reduce(
    (acc, p) => acc + Number(p.monto_total || 0),
    0
  );

  const totalPagosMonto = pagosEst.reduce(
    (acc, p) => acc + Number(p.monto_total || 0),
    0
  );

  const totalEntregas = entregasEst.reduce(
    (acc, e) => acc + Number(e.total_entregas || 0),
    0
  );
  const totalEntregasExitosas = entregasEst.reduce(
    (acc, e) => acc + Number(e.entregas_exitosas || 0),
    0
  );
  const totalEntregasPendientes = entregasEst.reduce(
    (acc, e) => acc + Number(e.entregas_pendientes || 0),
    0
  );

  const wb = XLSX.utils.book_new();

  const resumenAoa = [
    [`Reporte diario Aguas Valentino`],
    [`Fecha: ${fecha}`, `Sucursal: ${sucursalNombre || "Todas"}`],
    [],
    ["Sección", "Indicador", "Valor"],
    ["Ventas", "Total ventas ($)", totalVentasMonto],
    ["Ventas", "Cantidad de ventas", totalVentasCount],
    ["Pedidos", "Total pedidos", totalPedidos],
    ["Pedidos", "Pedidos pagados", totalPedidosPagados],
    ["Pedidos", "Monto total pedidos ($)", totalPedidosMonto],
    ["Productos", "Unidades vendidas", totalProductosVendidos],
    ["Productos", "Monto total productos ($)", totalProductosMonto],
    ["Pagos", "Monto total pagado ($)", totalPagosMonto],
    ["Entregas", "Total entregas", totalEntregas],
    ["Entregas", "Entregas exitosas", totalEntregasExitosas],
    ["Entregas", "Entregas pendientes", totalEntregasPendientes],
  ];

  const chartDataAoa = [
    ["Indicador", "Valor"],
    ["Ventas - Monto ($)", totalVentasMonto],
    ["Ventas - Cantidad", totalVentasCount],
    ["Pedidos - Monto ($)", totalPedidosMonto],
    ["Pedidos - Total", totalPedidos],
    ["Pedidos - Pagados", totalPedidosPagados],
    ["Productos - Monto ($)", totalProductosMonto],
    ["Productos - Unidades", totalProductosVendidos],
    ["Pagos - Monto ($)", totalPagosMonto],
    ["Entregas - Total", totalEntregas],
    ["Entregas - Exitosas", totalEntregasExitosas],
    ["Entregas - Pendientes", totalEntregasPendientes],
  ];

  if (ventasEst.length) {
    chartDataAoa.push(
      [],
      ["Ventas por tipo de entrega", ""],
      ["TipoEntrega", "MontoTotal"]
    );
    ventasEst.forEach((v) => {
      chartDataAoa.push([
        v.tipo_entrega || "Sin tipo",
        Number(v.monto_total || 0),
      ]);
    });
  }

  const wsResumenDia = XLSX.utils.aoa_to_sheet(resumenAoa);

  wsResumenDia["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

  wsResumenDia["!autofilter"] = { ref: "A4:C4" };

  wsResumenDia["!cols"] = [{ wch: 16 }, { wch: 35 }, { wch: 18 }];

  XLSX.utils.book_append_sheet(wb, wsResumenDia, "Resumen Día");

  const wsChartData = XLSX.utils.aoa_to_sheet(chartDataAoa);

  wsChartData["!cols"] = [{ wch: 30 }, { wch: 18 }];

  XLSX.utils.book_append_sheet(wb, wsChartData, "Gráficos - Datos");

  if (ventasEst.length) {
    const ventasSheetData = ventasEst.map((v) => ({
      Fecha: v.fecha,
      IdSucursal: v.id_sucursal || null,
      TipoEntrega: v.tipo_entrega,
      TotalVentas: Number(v.total_ventas || 0),
      MontoTotalCLP: Number(v.monto_total || 0),
    }));

    const wsVentasTipo = XLSX.utils.json_to_sheet(ventasSheetData);

    wsVentasTipo["!autofilter"] = { ref: "A1:E1" };
    wsVentasTipo["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 22 },
      { wch: 16 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(wb, wsVentasTipo, "Ventas x TipoEntrega");
  }

  if (pedidosEst.length) {
    const pedidosSheetData = pedidosEst.map((p) => ({
      Fecha: p.fecha,
      IdSucursal: p.id_sucursal || null,
      EstadoPago: p.estado_pago,
      IdEstadoPedido: p.id_estado_pedido,
      TotalPedidos: Number(p.total_pedidos || 0),
      PedidosPagados: Number(p.pedidos_pagados || 0),
      MontoTotalCLP: Number(p.monto_total || 0),
    }));

    const wsPedidos = XLSX.utils.json_to_sheet(pedidosSheetData);

    wsPedidos["!autofilter"] = { ref: "A1:G1" };
    wsPedidos["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(wb, wsPedidos, "Pedidos");
  }

  if (productosEst.length) {
    const productosSheetData = productosEst.map((p) => ({
      Fecha: p.fecha,
      IdSucursal: p.id_sucursal || null,
      IdProducto: p.id_producto,
      NombreProducto: p.nombre_item || null,
      IdInsumo: p.id_insumo,
      CantidadVendida: Number(p.cantidad_vendida || 0),
      MontoTotalCLP: Number(p.monto_total || 0),
    }));

    const wsProductos = XLSX.utils.json_to_sheet(productosSheetData);

    wsProductos["!autofilter"] = { ref: "A1:G1" };
    wsProductos["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 28 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(wb, wsProductos, "Productos vendidos");
  }

  if (pagosEst.length) {
    const pagosSheetData = pagosEst.map((p) => ({
      Fecha: p.fecha,
      IdSucursal: p.id_sucursal || null,
      MetodoPago: p.metodo_pago,
      CantidadPagos: Number(p.cantidad_pagos || 0),
      MontoTotalCLP: Number(p.monto_total || 0),
    }));

    const wsPagos = XLSX.utils.json_to_sheet(pagosSheetData);

    wsPagos["!autofilter"] = { ref: "A1:E1" };
    wsPagos["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(wb, wsPagos, "Pagos x Método");
  }

  if (ventasChoferEst.length) {
    const ventasChoferSheetData = ventasChoferEst.map((v) => ({
      Fecha: v.fecha,
      IdSucursal: v.id_sucursal || null,
      IdChofer: v.id_chofer,
      NombreChofer: v.chofer?.nombre || null,
      TotalVentas: Number(v.total_ventas || 0),
      MontoTotalCLP: Number(v.monto_total || 0),
    }));

    const wsVentasChofer = XLSX.utils.json_to_sheet(ventasChoferSheetData);

    wsVentasChofer["!autofilter"] = { ref: "A1:F1" };
    wsVentasChofer["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 26 },
      { wch: 16 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(wb, wsVentasChofer, "Ventas x Chofer");
  }

  if (entregasEst.length) {
    const entregasSheetData = entregasEst.map((e) => ({
      Fecha: e.fecha,
      IdSucursal: e.id_sucursal || null,
      IdChofer: e.id_chofer,
      NombreChofer: e.chofer?.nombre || null,
      TotalEntregas: Number(e.total_entregas || 0),
      EntregasExitosas: Number(e.entregas_exitosas || 0),
      EntregasPendientes: Number(e.entregas_pendientes || 0),
    }));

    const wsEntregas = XLSX.utils.json_to_sheet(entregasSheetData);

    wsEntregas["!autofilter"] = { ref: "A1:G1" };
    wsEntregas["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 26 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(wb, wsEntregas, "Entregas x Chofer");
  }

  let nombre = `reporte-diario-${fecha}`;
  if (sucursalNombre) nombre += `-${sanitize(sucursalNombre).slice(0, 25)}`;
  nombre += ".xlsx";

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, nombre);

  if (onExportSuccess) onExportSuccess(nombre);
}
