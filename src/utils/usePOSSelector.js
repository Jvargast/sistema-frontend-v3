import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import useVerificarCaja from "./useVerificationCaja";

const getRolName = (rol) =>
  typeof rol === "string" ? rol.toLowerCase() : rol?.nombre?.toLowerCase();

const isOperadorPOS = (user) => {
  const r = getRolName(user?.rol);
  return r === "vendedor" || r === "administrador";
};

export default function usePOSSelector({
  mode,
  activeSucursalId,
  vendedoresAll,
  myPrefs,
  savePrefs,
}) {
  const { user, rol: rolRaw } = useSelector((s) => s.auth);
  const rol = getRolName(rolRaw);

  const myRut = user?.rut || user?.user?.rut || user?.id || null;

  // --- estado UI (modales) ---
  const [openVendedorModal, setOpenVendedorModal] = useState(false);
  const [openCajaModal, setOpenCajaModal] = useState(false);
  const [openAperturaModal, setOpenAperturaModal] = useState(false);
  const [cajaParaApertura, setCajaParaApertura] = useState(null);

  // --- selección de vendedor ---
  const [selectedVendedor, setSelectedVendedor] = useState("");

  // --- refs de control ---
  const lockSelectionRef = useRef(false);
  const lastVendorAppliedRef = useRef(null);
  const settingCajaRef = useRef(false);

  const { estado, seleccionarCaja, isLoading, reloadEstado } = useVerificarCaja(
    selectedVendedor,
    openCajaModal
  );

  const vendedores = useMemo(() => {
    const all = (vendedoresAll || []).filter(isOperadorPOS);
    if (rol === "vendedor") return all.filter((v) => v.rut === myRut);
    if (mode === "global") return all;
    return all.filter((v) =>
      v?.cajasAsignadas?.some((c) => c.id_sucursal === activeSucursalId)
    );
  }, [vendedoresAll, rol, myRut, mode, activeSucursalId]);

  const cajasDelVendedor = useMemo(() => {
    if (!selectedVendedor) return [];
    const vend = vendedores.find((v) => v.rut === selectedVendedor);
    const cajas = vend?.cajasAsignadas || [];
    const branchId = Number(activeSucursalId);
    const visibles =
      mode === "global"
        ? cajas
        : cajas.filter((c) => Number(c.id_sucursal) === branchId);
    return visibles.map((c) => ({
      ...c,
      _vendedor: {
        rut: vend?.rut,
        nombre: vend?.nombre,
        rol: getRolName(vend?.rol),
      },
    }));
  }, [selectedVendedor, vendedores, mode, activeSucursalId]);

  const savedVendorRut = useSelector((s) => s.pos?.vendorRut);
  useEffect(() => {
    if (selectedVendedor) return;
    if (!savedVendorRut) return;

    const existe = vendedores.some(
      (v) => String(v.rut) === String(savedVendorRut)
    );
    if (existe) setSelectedVendedor(savedVendorRut);
  }, [selectedVendedor, savedVendorRut, vendedores]);

  const prevSucursalRef = useRef(null);
  useEffect(() => {
    if (rol !== "administrador") return;
    if (typeof activeSucursalId === "undefined" || activeSucursalId === null)
      return;

    if (prevSucursalRef.current === null) {
      // Primer seteo: solo guarda y no resetea
      prevSucursalRef.current = Number(activeSucursalId);
      return;
    }

    if (Number(prevSucursalRef.current) === Number(activeSucursalId)) return;
    prevSucursalRef.current = Number(activeSucursalId);

    seleccionarCaja(null);
    setSelectedVendedor("");
    lastVendorAppliedRef.current = null;
    settingCajaRef.current = false;
    setOpenCajaModal(false);
    setOpenAperturaModal(false);
    setCajaParaApertura(null);
    setOpenVendedorModal(true);
  }, [rol, activeSucursalId, seleccionarCaja]);

  useEffect(() => {
    if (isLoading || estado.initializing) return;

    // Si ya hay caja seleccionada, no abrimos modal de vendedor
    if (estado?.cajaSeleccionada?.id_caja) {
      setOpenVendedorModal(false);
      return;
    }

    // Vendedor
    if (rol === "vendedor") {
      if (selectedVendedor !== myRut) setSelectedVendedor(myRut || "");
      setOpenVendedorModal(false);
      return;
    }

    if (typeof myPrefs === "undefined") return;

    if (!selectedVendedor) {
      const pref = myPrefs?.preferred_vendor_rut || "";
      const existe =
        pref && vendedores.some((v) => String(v.rut) === String(pref));
      if (existe) {
        setSelectedVendedor(pref);
        setOpenVendedorModal(false);
      } else {
        setOpenVendedorModal(true); // 👈 abrir porque el preferido no pertenece a esta sucursal
      }
      return;
    }

    setOpenVendedorModal(false);
  }, [
    rol,
    myRut,
    myPrefs,
    selectedVendedor,
    isLoading,
    estado?.cajaSeleccionada?.id_caja,
    estado.initializing,
    vendedores,
  ]);

  useEffect(() => {
    if (isLoading || estado.initializing) return;
    if (estado?.cajaSeleccionada?.id_caja) {
      setOpenCajaModal(false);
      setOpenAperturaModal(false);
      setCajaParaApertura(null);
      return;
    }

    if (settingCajaRef.current) return;

    if (rol === "vendedor") {
      setOpenCajaModal(true);
      return;
    }

    if (!selectedVendedor) return;
    if (!cajasDelVendedor?.length) {
      setOpenCajaModal(true);
      return;
    }
    const preferredId = myPrefs?.preferred_cashbox_id;
    const preferida = preferredId
      ? cajasDelVendedor.find((c) => Number(c.id_caja) === Number(preferredId))
      : null;

    if (lastVendorAppliedRef.current === selectedVendedor && !preferida) {
      setOpenCajaModal(true);
      return;
    }
    lastVendorAppliedRef.current = selectedVendedor;

    if (!preferida) {
      setOpenCajaModal(true);
      return;
    }

    if (preferida.estado === "abierta") {
      seleccionarCaja(preferida);
      setOpenCajaModal(false);
      setOpenAperturaModal(false);
      lockSelectionRef.current = true;
    } else {
      setCajaParaApertura(preferida);
      setOpenAperturaModal(true);
      setOpenCajaModal(false);
    }
  }, [
    rol,
    isLoading,
    estado.initializing,
    estado?.cajaSeleccionada?.id_caja,
    selectedVendedor,
    cajasDelVendedor,
    myPrefs,
    seleccionarCaja,
  ]);

  const handleSelectVendedor = useCallback(
    (rut) => {
      if (estado?.cajaSeleccionada) seleccionarCaja(null);
      setSelectedVendedor(rut);
      setOpenVendedorModal(false);
      lastVendorAppliedRef.current = null;
      if (rol === "administrador" && rut) {
        savePrefs?.({ preferred_vendor_rut: rut }).catch(() => {});
      }
      if (estado.initializing) return;
      if (!estado.cajaSeleccionada?.id_caja) setOpenCajaModal(true);
    },
    [
      estado?.cajaSeleccionada,
      seleccionarCaja,
      rol,
      savePrefs,
      estado.initializing,
    ]
  );

  const handleSelectCaja = useCallback(
    async (caja) => {
      settingCajaRef.current = true;
      try {
        if (caja.estado !== "abierta") {
          setCajaParaApertura(caja);
          setOpenAperturaModal(true);
          setOpenCajaModal(false);
          return;
        }
        const ok = seleccionarCaja(caja);
        if (ok) {
          setOpenCajaModal(false);
          setOpenAperturaModal(false);
          lockSelectionRef.current = true;
          if (rol === "administrador") {
            savePrefs?.({
              preferred_branch_id: Number(caja.id_sucursal),
              preferred_cashbox_id: Number(caja.id_caja),
            }).catch(() => {});
          }
        }
      } finally {
        settingCajaRef.current = false;
      }
    },
    [seleccionarCaja, rol, savePrefs]
  );

  const handleCajaAbierta = useCallback(
    (cajaAbierta) => {
      seleccionarCaja({ ...cajaAbierta, estado: "abierta" });
      setOpenAperturaModal(false);
      setOpenCajaModal(false);
      lockSelectionRef.current = true;
      if (rol === "administrador") {
        savePrefs?.({
          preferred_branch_id: Number(cajaAbierta?.id_sucursal),
          preferred_cashbox_id: Number(cajaAbierta?.id_caja),
        }).catch(() => {});
      }
    },
    [seleccionarCaja, rol, savePrefs]
  );

  const vendedoresFiltrados = vendedores;
  const cajasParaModal = useMemo(() => cajasDelVendedor, [cajasDelVendedor]);

  return {
    estado,
    seleccionarCaja,
    reloadEstado,
    // selección de actor
    rol,
    selectedVendedor,
    setSelectedVendedor,

    // colecciones
    vendedoresFiltrados,
    cajasParaModal,

    // modales
    openVendedorModal,
    setOpenVendedorModal,
    openCajaModal,
    setOpenCajaModal,
    openAperturaModal,
    setOpenAperturaModal,
    cajaParaApertura,

    // handlers
    handleSelectVendedor,
    handleSelectCaja,
    handleCajaAbierta,

    // loading
    isLoading,
  };
}
