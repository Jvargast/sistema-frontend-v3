import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetCajaAsignadaQuery,
  useGetEstadoCajaQuery,
} from "../store/services/cajaApi";

const normalizeCaja = (c, asignadas = []) => {
  if (!c) return c;
  const a = asignadas.find((x) => x.id_caja === c.id_caja) || {};
  const sucursal =
    c.sucursal ??
    a.sucursal ??
    (c.id_sucursal
      ? { id_sucursal: c.id_sucursal, nombre: a?.sucursal?.nombre }
      : undefined);

  const usuario_asignado =
    c.usuario_asignado ??
    c._vendedor?.rut ??
    a.usuario_asignado ??
    a._vendedor?.rut;

  return {
    ...a,
    ...c,
    sucursal,
    usuario_asignado,
  };
};

const useVerificarCaja = (selectedVendedor = null) => {
  const { user, rol } = useSelector((state) => state.auth);

  const rutUsuario =
    rol === "administrador" && selectedVendedor ? selectedVendedor : user?.id;

  const {
    data: cajasAsignadasData,
    isLoading: loadingAsignadas,
    error: errorAsignadas,
    /* refetch: refetchAsignadas, */
  } = useGetCajaAsignadaQuery(rutUsuario ? { rutUsuario } : undefined, {
    skip: !rutUsuario,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: cajasAbiertasData,
    isLoading: loadingAbiertas,
    error: errorAbiertas,
    /* refetch: refetchAbiertas, */
  } = useGetEstadoCajaQuery(rutUsuario ? { rutUsuario } : undefined, {
    skip: !rutUsuario,
    refetchOnMountOrArgChange: true,
  });

  const [estado, setEstado] = useState({
    cajasAsignadas: [],
    cajasAbiertas: [],
    cajaSeleccionada: null,
    cajaAbierta: false,
    cajaListaParaAbrir: false,
    fechaInvalida: false,
  });

  useEffect(() => {
    const asignadas = cajasAsignadasData?.cajas || [];
    setEstado((prev) => ({ ...prev, cajasAsignadas: asignadas }));
  }, [cajasAsignadasData]);

  useEffect(() => {
    const asignadas = cajasAsignadasData?.cajas || [];
    const abiertasRaw = (cajasAbiertasData?.cajas || []).filter(
      (c) => c.estado === "abierta"
    );
    const abiertas = abiertasRaw.map((c) => normalizeCaja(c, asignadas));

    setEstado((prev) => ({
      ...prev,
      cajasAbiertas: abiertas,
      cajaAbierta: abiertas.length > 0,
      cajaSeleccionada:
        prev.cajaSeleccionada &&
        abiertas.some((c) => c.id_caja === prev.cajaSeleccionada.id_caja)
          ? normalizeCaja(prev.cajaSeleccionada, asignadas)
          : null,
      cajaListaParaAbrir: abiertas.length === 0,
    }));
  }, [cajasAbiertasData, cajasAsignadasData]);

  const seleccionarCaja = useCallback((caja) => {
    if (!caja) {
      setEstado((prev) => ({
        ...prev,
        cajaSeleccionada: null,
        cajaAbierta: false,
        cajaListaParaAbrir: (prev.cajasAbiertas || []).length === 0,
      }));
      return true;
    }
    if (caja.estado !== "abierta") return false;
    setEstado((prev) => {
      if (prev.cajaSeleccionada?.id_caja === caja.id_caja) return prev;
      return {
        ...prev,
        cajaSeleccionada: caja,
        cajaAbierta: true,
        cajaListaParaAbrir: false,
      };
    });
    return true;
  }, []);

  return {
    estado,
    seleccionarCaja,
    isLoading: !rutUsuario || loadingAsignadas || loadingAbiertas,
    error: errorAsignadas || errorAbiertas,
  };
};

export default useVerificarCaja;
