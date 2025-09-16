import { useMemo, useState } from "react";
import { parseCLP } from "../utils/currency";
import dayjs from "dayjs";

const IVA_PCT = 19;

export default function useGastoForm() {
  const [form, setForm] = useState({
    fecha: dayjs().format("YYYY-MM-DD"),
    id_categoria_gasto: null,
    id_proveedor: null,
    descripcion: "",
    monto_input: "", 
    iva_incluido: true, 
    deducible: true, 
    metodo_pago: "transferencia", // efectivo | transferencia | tarjeta | cheque | otro
    doc_tipo: "", // boleta | factura | recibo | otro
    doc_folio: "",
    id_centro_costo: null, 
    adjuntos: [], 
  });

  const montoNumber = useMemo(
    () => parseCLP(form.monto_input),
    [form.monto_input]
  );

  const netoIvaTotal = useMemo(() => {
    const total = form.iva_incluido
      ? montoNumber
      : Math.round(montoNumber * (1 + IVA_PCT / 100));
    const neto = Math.round(total / (1 + IVA_PCT / 100));
    const iva = total - neto;
    return { neto, iva, total };
  }, [montoNumber, form.iva_incluido]);

  const val = {
    fecha: !!form.fecha,
    categoria: !!form.id_categoria_gasto,
    proveedor: true, 
    monto: montoNumber > 0,
    metodo: !!form.metodo_pago,
  };

  const canSave = val.fecha && val.categoria && val.monto && val.metodo;

  const onChange = (field) => (e, v) => {
    const value = e?.target?.value ?? v ?? "";
    if (field === "monto_input") {
      setForm((s) => ({ ...s, monto_input: value }));
      return;
    }
    if (field === "iva_incluido" || field === "deducible") {
      setForm((s) => ({ ...s, [field]: Boolean(value) }));
      return;
    }
    setForm((s) => ({ ...s, [field]: value }));
  };

  const addFiles = async (files = []) => {
    const toRead = Array.from(files).slice(0, 10);
    const reads = await Promise.all(
      toRead.map(
        (f) =>
          new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () =>
              res({
                name: f.name,
                size: f.size,
                type: f.type,
                b64: String(fr.result).split(",")[1],
              });
            fr.onerror = rej;
            fr.readAsDataURL(f);
          })
      )
    );
    setForm((s) => ({ ...s, adjuntos: [...s.adjuntos, ...reads] }));
  };

  const removeAdjunto = (idx) => {
    setForm((s) => ({
      ...s,
      adjuntos: s.adjuntos.filter((_, i) => i !== idx),
    }));
  };

  const payload = useMemo(
    () => ({
      fecha: form.fecha,
      id_categoria_gasto: form.id_categoria_gasto ?? null,
      id_proveedor: form.id_proveedor ?? null,
      descripcion: String(form.descripcion || "").trim(),
      monto_neto: netoIvaTotal.neto,
      iva: netoIvaTotal.iva,
      total: netoIvaTotal.total,
      iva_incluido: !!form.iva_incluido,
      deducible: !!form.deducible,
      metodo_pago: form.metodo_pago,
      documento:
        form.doc_tipo || form.doc_folio
          ? { tipo: form.doc_tipo || null, folio: form.doc_folio || null }
          : null,
      id_centro_costo: form.id_centro_costo ?? null,
      adjuntos: form.adjuntos,
    }),
    [form, netoIvaTotal]
  );

  const reset = () =>
    setForm((s) => ({
      ...s,
      fecha: dayjs().format("YYYY-MM-DD"),
      id_categoria_gasto: null,
      id_proveedor: null,
      descripcion: "",
      monto_input: "",
      iva_incluido: true,
      deducible: true,
      metodo_pago: "transferencia",
      doc_tipo: "",
      doc_folio: "",
      id_centro_costo: null,
      adjuntos: [],
    }));

  return {
    form,
    onChange,
    setForm,
    addFiles,
    removeAdjunto,
    montoNumber,
    netoIvaTotal,
    canSave,
    payload,
    reset,
  };
}
