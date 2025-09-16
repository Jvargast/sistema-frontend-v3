import { useMemo, useState, useEffect } from "react";
import { validarNombre, validarTipo } from "../utils/centroCosto";
import { useGetAllSucursalsQuery } from "../store/services/empresaApi";
import useSucursalActiva from "./useSucursalActiva";

const toIntOrNull = (v) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

const useCentroCostoForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    ref_id: "",
    restringirSucursal: false,
    id_sucursal: null,
    activo: true,
  });

  const scope = useSucursalActiva();
  const isScoped = !!scope?.id_sucursal;

  const nombreState = useMemo(() => validarNombre(form.nombre), [form.nombre]);
  const tipoState = useMemo(() => validarTipo(form.tipo), [form.tipo]);

  const { data: sucursalesRaw = [], isFetching: loadingSuc } =
    useGetAllSucursalsQuery();

  const sucursales = useMemo(
    () =>
      (sucursalesRaw || []).map((s) => ({
        ...s,
        id_sucursal: s?.id_sucursal ?? s?.id ?? null,
        nombre: s?.nombre ?? s?.name ?? "",
      })),
    [sucursalesRaw]
  );

  useEffect(() => {
    if (isScoped) {
      setForm((prev) => ({
        ...prev,
        restringirSucursal: true,
        id_sucursal: Number(scope.id_sucursal),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        restringirSucursal: false,
        id_sucursal: null,
      }));
    }
  }, [isScoped, scope?.id_sucursal]);

  const onChange = (field) => (e, v) => {
    const value = e?.target?.value ?? v ?? "";

    if (field === "ref_id") {
      const onlyDigits = String(value).replace(/\D/g, "");
      setForm((s) => ({ ...s, ref_id: onlyDigits }));
      return;
    }

    if (field === "id_sucursal") {
      if (isScoped) return;
      setForm((s) => ({ ...s, id_sucursal: toIntOrNull(value) }));
      return;
    }

    if (field === "restringirSucursal") {
      if (isScoped) return;
      const boolVal = !!value;
      setForm((s) => ({
        ...s,
        restringirSucursal: boolVal,
        id_sucursal: boolVal ? s.id_sucursal : null,
      }));
      return;
    }

    if (typeof value === "boolean") {
      setForm((s) => ({ ...s, [field]: value }));
      return;
    }

    if (typeof value === "string") {
      const sanitized = value.replace(/\s+/g, " ").trimStart();
      setForm((s) => ({ ...s, [field]: sanitized }));
      return;
    }

    setForm((s) => ({ ...s, [field]: value }));
  };

  const canSave = nombreState.valid && tipoState.valid;

  const reset = () =>
    setForm({
      nombre: "",
      tipo: "",
      ref_id: "",
      restringirSucursal: isScoped,
      id_sucursal: isScoped ? Number(scope.id_sucursal) : null,
      activo: true,
    });

  const payload = useMemo(
    () => ({
      nombre: String(form.nombre || "").trim(),
      tipo: form.tipo,
      ref_id: form.ref_id ? toIntOrNull(form.ref_id) : null,
      id_sucursal: isScoped ? Number(scope.id_sucursal) : null,
      activo: !!form.activo,
    }),
    [
      form.nombre,
      form.tipo,
      form.ref_id,
      form.activo,
      isScoped,
      scope?.id_sucursal,
    ]
  );

  return {
    form,
    setForm,
    onChange,
    reset,
    nombreState,
    tipoState,
    canSave,
    sucursales,
    loadingSuc,
    payload,
    isScoped,
    scopeSucursal: isScoped
      ? { id_sucursal: Number(scope.id_sucursal), nombre: scope.nombre }
      : null,
  };
};

export default useCentroCostoForm;
