import { useEffect, useMemo, useState } from "react";
import { useLazyGetAllProveedoresQuery } from "../store/services/proveedorApi";
import { cleanRut, formatRut, validateRut } from "../utils/rut";
import { formatPhoneCL, validatePhoneCL } from "../utils/phoneCl";

export const GIROS_SUGERIDOS = [
  "Comercio Minorista",
  "Comercio Mayorista",
  "Servicios Profesionales",
  "Transporte",
  "Construcción",
  "Gastronomía",
  "Tecnología",
  "Educación",
  "Salud",
  "Manufactura",
  "Agricultura",
];

const useProveedorForm = () => {
  const [triggerBuscar, buscarEstado] = useLazyGetAllProveedoresQuery();
  const [form, setForm] = useState({
    rut: "",
    razon_social: "",
    giro: "",
    email: "",
    telefono: "",
    direccion: "",
    activo: true,
  });
  const [rutState, setRutState] = useState({ valid: null, msg: "" });
  const [telState, setTelState] = useState({ valid: null, msg: "" });

  useEffect(() => {
    const f = form.rut || "";
    if (!f) {
      setRutState({ valid: null, msg: "" });
      return;
    }
    const result = validateRut(f);
    setRutState(result);
    const id = setTimeout(() => {
      if (result.valid) {
        const q = cleanRut(f);
        triggerBuscar({ search: q, limit: 1 });
      }
    }, 350);
    return () => clearTimeout(id);
  }, [form.rut, triggerBuscar]);

  useEffect(() => {
    if (!form.telefono) {
      setTelState({ valid: null, msg: "" });
      return;
    }
    setTelState(validatePhoneCL(form.telefono));
  }, [form.telefono]);

  const isDuplicado = useMemo(() => {
    const q = cleanRut(form.rut || "").toLowerCase();
    const items = buscarEstado?.data ?? [];
    if (!q || !Array.isArray(items)) return false;
    return items.some(
      (p) => (p?.rut || "").replace(/[.-]/g, "").toLowerCase() === q
    );
  }, [buscarEstado?.data, form.rut]);

  const onChange = (field) => (e, v) => {
    const raw = v ?? e?.target?.value ?? "";

    if (field === "rut") {
      setForm((s) => ({ ...s, rut: formatRut(raw) }));
      return;
    }
    if (field === "telefono") {
      setForm((s) => ({ ...s, telefono: formatPhoneCL(raw) }));
      return;
    }
    if (field === "giro") {
      const val = (raw ?? "").toString();
      setForm((s) => ({ ...s, giro: val.trimStart() }));
      return;
    }
    if (typeof value === "string") {
      setForm((s) => ({ ...s, [field]: raw.trimStart() }));
    } else {
      setForm((s) => ({ ...s, [field]: raw }));
    }
  };

  const reset = () => {
    setForm({
      rut: "",
      razon_social: "",
      giro: "",
      email: "",
      telefono: "",
      direccion: "",
      activo: true,
    });
    setRutState({ valid: null, msg: "" });
    setTelState({ valid: null, msg: "" });
  };

  const baseCanSave =
    !!form.razon_social &&
    !!form.rut &&
    rutState.valid === true &&
    !isDuplicado &&
    (form.telefono ? telState.valid === true : true);

  return {
    form,
    setForm,
    onChange,
    reset,
    rutState,
    telState,
    isDuplicado,
    baseCanSave,
  };
};

export default useProveedorForm;
