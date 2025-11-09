import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setVendorRut, setCaja } from "../store/reducers/posSlice";

export default function usePOSMemory({
  selectedVendedor,
  setSelectedVendedor,
  estado, 
  seleccionarCaja, 
}) {
  const dispatch = useDispatch();

  const saved = useSelector((s) => s.pos || { vendorRut: null, caja: null });
  const { vendorRut: savedVendorRut, caja: savedCaja } = saved;

  const { mode, activeSucursalId } = useSelector((s) => s.scope || {});

  const triedVendorRef = useRef(false);
  const triedCajaRef = useRef(false);

  useEffect(() => {
    if (selectedVendedor) dispatch(setVendorRut(selectedVendedor));
  }, [selectedVendedor, dispatch]);

  useEffect(() => {
    const cs = estado?.cajaSeleccionada;
    if (cs?.id_caja) {
      dispatch(
        setCaja({
          id_caja: Number(cs.id_caja),
          id_sucursal: Number(cs.id_sucursal),
          estado: "abierta",
          usuario_asignado: cs.usuario_asignado || null,
          _vendedor: cs._vendedor || null,
        })
      );
    }
  }, [estado?.cajaSeleccionada?.id_caja, estado?.cajaSeleccionada, dispatch]);

  useEffect(() => {
    if (!selectedVendedor && savedVendorRut && !triedVendorRef.current) {
      triedVendorRef.current = true;
      setSelectedVendedor(savedVendorRut);
    }
  }, [selectedVendedor, setSelectedVendedor, savedVendorRut]);

  useEffect(() => {
    if (estado?.cajaSeleccionada?.id_caja) return; 
    if (!savedCaja || triedCajaRef.current) return; 
    if (estado?.initializing) return;

    if (
      mode !== "global" &&
      activeSucursalId &&
      Number(savedCaja.id_sucursal) !== Number(activeSucursalId)
    ) {
     
      return;
    }

    const abierta = (estado?.cajasAbiertas || []).find(
      (c) => Number(c.id_caja) === Number(savedCaja.id_caja)
    );

    if (abierta) {
      triedCajaRef.current = true;
      seleccionarCaja(abierta); 
      return;
    }

    triedCajaRef.current = true;
  }, [
    estado?.cajaSeleccionada?.id_caja,
    estado?.initializing,
    estado?.cajasAbiertas,
    savedCaja,
    seleccionarCaja,
    mode,
    activeSucursalId,
  ]);

  return {
    savedVendorRut,
    savedCaja,
    triedVendor: triedVendorRef.current,
    triedCaja: triedCajaRef.current,
  };
}
