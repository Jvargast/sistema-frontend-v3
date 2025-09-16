import { useMemo, useState } from "react";

export default function useCompraForm() {
  const [header, setHeader] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    id_proveedor: null,
    proveedor: null,
    id_sucursal: null,
    estado: "borrador",
    moneda: "CLP",
    nro_documento: "",
    fecha_documento: "",
    observaciones: "",
    iva_porcentaje: 0.19,
  });

  const [items, setItems] = useState([]);
  const addItem = (preset = {}) => {
    setItems((rows) => [
      ...rows,
      {
        _tid: crypto.randomUUID?.() || String(Date.now() + Math.random()),
        id_insumo: null,
        insumo: null,
        descripcion: "",
        cantidad: 1,
        precio_unitario: 0,
        afecta_iva: true,
        ...preset,
      },
    ]);
  };

  const updateItem = (tid, patch) => {
    setItems((rows) =>
      rows.map((r) => (r._tid === tid ? { ...r, ...patch } : r))
    );
  };

  const removeItem = (tid) =>
    setItems((rows) => rows.filter((r) => r._tid !== tid));

  const setProveedor = (prov) => {
    setHeader((h) => ({
      ...h,
      id_proveedor: prov?.id_proveedor ?? prov?.id,
      proveedor: prov || null,
    }));
  };

  const setSucursal = (id) =>
    setHeader((h) => ({ ...h, id_sucursal: id ?? null }));

  const resumen = useMemo(() => {
    let subtotal = 0,
      iva = 0;
    const IVA_DEC = Number(header.iva_porcentaje ?? 0);
    for (const it of items) {
      const neto = Number(it.cantidad || 0) * Number(it.precio_unitario || 0);
      subtotal += neto;
      iva += it.afecta_iva ? Math.round(neto * IVA_DEC) : 0;
    }
    return { subtotal, iva, total: subtotal + iva };
  }, [items, header.iva_porcentaje]);

  const itemsValidos = useMemo(
    () =>
      items.length > 0 &&
      items.every(
        (it) =>
          Number(it.cantidad) > 0 &&
          Number(it.precio_unitario) >= 0 &&
          (it.id_insumo || it.descripcion)
      ),
    [items]
  );

  const canSave = Boolean(header.id_proveedor) && itemsValidos;

  const payload = useMemo(
    () => ({
      header: {
        fecha: header.fecha,
        id_proveedor: header.id_proveedor,
        id_sucursal: header.id_sucursal ?? null,
        estado: header.estado || "borrador",
        moneda: header.moneda || "CLP",
        nro_documento: header.nro_documento || null,
        fecha_documento: header.fecha_documento || null,
        observaciones: header.observaciones || null,
        iva_porcentaje: header.iva_porcentaje ?? 0.19,
      },
      items: items.map((it) => ({
        id_insumo: it.id_insumo,
        descripcion: it.descripcion || null,
        cantidad: Number(it.cantidad || 0),
        precio_unitario: Number(it.precio_unitario || 0),
        afecta_iva: Boolean(it.afecta_iva),
      })),
    }),
    [header, items]
  );

  const reset = () => {
    setHeader({
      fecha: new Date().toISOString().slice(0, 10),
      id_proveedor: null,
      proveedor: null,
      id_sucursal: header.id_sucursal ?? null,
      estado: "borrador",
      moneda: "CLP",
      nro_documento: "",
      fecha_documento: "",
      observaciones: "",
      iva_porcentaje: header.iva_porcentaje ?? 0.19,
    });
    setItems([]);
  };

  return {
    header,
    setHeader,
    setProveedor,
    setSucursal,
    items,
    addItem,
    updateItem,
    removeItem,
    resumen,
    canSave,
    payload,
    reset,
  };
}
