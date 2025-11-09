import { useEffect, useState, useCallback, useRef } from "react";
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

  return { ...a, ...c, sucursal, usuario_asignado };
};

const initial = {
  cajasAsignadas: [],
  cajasAbiertas: [],
  cajaSeleccionada: null,
  cajaAbierta: false,
  cajaListaParaAbrir: false,
  fechaInvalida: false,
  initializing: true,
};

const useVerificarCaja = (selectedVendedor = null, openCajaModal = false) => {
  const [pollMs, setPollMs] = useState(0);
  const { user, rol } = useSelector((state) => state.auth);
  const myRut = user?.rut || user?.user?.rut || user?.id || null;
  const rutUsuario =
    rol === "administrador" && selectedVendedor ? selectedVendedor : myRut;

  const {
    data: cajasAsignadasData,
    isLoading: loadingAsignadas,
    error: errorAsignadas,
    refetch: refetchAsignadas,
  } = useGetCajaAsignadaQuery(rutUsuario ? { rutUsuario } : undefined, {
    skip: !rutUsuario,
    refetchOnMountOrArgChange: true,
  });

  const enableEstado = rol !== "administrador" && !!rutUsuario;

  const {
    data: cajasEstadoData,
    isLoading: loadingEstado,
    error: errorEstado,
    refetch: refetchEstado,
  } = useGetEstadoCajaQuery(undefined, {
    skip: !enableEstado,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: pollMs,
  });

  const reloadEstado = useCallback(async () => {
    const tasks = [];
    if (refetchAsignadas) tasks.push(refetchAsignadas());
    if (enableEstado && refetchEstado) tasks.push(refetchEstado());
    if (tasks.length) await Promise.all(tasks);
  }, [enableEstado, refetchAsignadas, refetchEstado]);

  /*   const reloadEstado = useCallback(async () => {
    await Promise.all([refetchAsignadas?.(), refetchEstado?.()]);
  }, [refetchAsignadas, refetchEstado]); */

  const [estado, setEstado] = useState(initial);
  const lastAsignadasRef = useRef([]);
  const lastAbiertasRef = useRef([]);
  const autoSelectedOnceRef = useRef(false);

  useEffect(() => {
    setEstado({ ...initial, initializing: !!rutUsuario });
    lastAsignadasRef.current = [];
    lastAbiertasRef.current = [];
    autoSelectedOnceRef.current = false;
  }, [rutUsuario]);

  useEffect(() => {
    if (typeof cajasAsignadasData === "undefined") return;
    const asignadas = cajasAsignadasData?.cajas || [];
    lastAsignadasRef.current = asignadas;
    setEstado((prev) => ({ ...prev, cajasAsignadas: asignadas }));
  }, [cajasAsignadasData]);

  useEffect(() => {
    const asignadas = lastAsignadasRef.current;
    const abiertasRaw =
      rol === "administrador"
        ? (asignadas || []).filter((c) => c.estado === "abierta")
        : (cajasEstadoData?.cajas || []).filter((c) => c.estado === "abierta");

    const abiertas = (abiertasRaw || []).map((c) =>
      normalizeCaja(c, asignadas)
    );
    lastAbiertasRef.current = abiertas;

    setEstado((prev) => {
      const sigueSeleccionada =
        prev.cajaSeleccionada &&
        abiertas.some((c) => c.id_caja === prev.cajaSeleccionada.id_caja);

      if (
        !sigueSeleccionada &&
        !prev.cajaSeleccionada &&
        abiertas.length > 0 &&
        !autoSelectedOnceRef.current
      ) {
        autoSelectedOnceRef.current = true;
        return {
          ...prev,
          cajasAbiertas: abiertas,
          cajaAbierta: true,
          cajaSeleccionada: abiertas[0],
          cajaListaParaAbrir: false,
          initializing:
            (rol === "administrador" ? loadingAsignadas : loadingEstado) ||
            prev.initializing,
        };
      }

      return {
        ...prev,
        cajasAbiertas: abiertas,
        cajaAbierta: abiertas.length > 0,
        cajaSeleccionada: sigueSeleccionada
          ? normalizeCaja(prev.cajaSeleccionada, asignadas)
          : prev.cajaSeleccionada,
        cajaListaParaAbrir: abiertas.length === 0,
      };
    });
  }, [rol, cajasEstadoData, loadingEstado, loadingAsignadas]);

  useEffect(() => {
    const readyAsignadas =
      typeof cajasAsignadasData !== "undefined" && !loadingAsignadas;
    const readyEstado =
      typeof cajasEstadoData !== "undefined" && !loadingEstado;

    const listo = rol === "administrador" ? readyAsignadas : readyEstado;

    if (rutUsuario && listo) {
      setEstado((prev) =>
        prev.initializing ? { ...prev, initializing: false } : prev
      );
    }
  }, [
    rutUsuario,
    rol,
    cajasAsignadasData,
    cajasEstadoData,
    loadingAsignadas,
    loadingEstado,
  ]);

  useEffect(() => {
    const hasAbierta = (lastAbiertasRef.current || []).length > 0;
    // Solo vendedor, con caja abierta, y SIN modal abierto -> poll
    if (enableEstado) {
      setPollMs(hasAbierta && !openCajaModal ? 15000 : 0);
    } else {
      setPollMs(0);
    }
  }, [enableEstado, openCajaModal, cajasEstadoData, loadingEstado]);

  useEffect(() => {
    if (!enableEstado) {
      setPollMs(0);
      return;
    }
    const hasAbierta = (lastAbiertasRef.current || []).length > 0;
    setPollMs(hasAbierta && !openCajaModal ? 15000 : 0);
  }, [enableEstado, openCajaModal, cajasEstadoData, loadingEstado]);

  const seleccionarCaja = useCallback((caja) => {
    if (!caja) {
      setEstado((prev) => ({
        ...prev,
        cajaSeleccionada: null,
        cajaAbierta: false,
        cajaListaParaAbrir: (lastAbiertasRef.current || []).length === 0,
      }));
      return true;
    }
    const cajaOk =
      caja.estado === "abierta" ? caja : { ...caja, estado: "abierta" };
    setEstado((prev) => {
      if (prev.cajaSeleccionada?.id_caja === cajaOk.id_caja && prev.cajaAbierta)
        return prev;
      return {
        ...prev,
        cajaSeleccionada: normalizeCaja(cajaOk, lastAsignadasRef.current),
        cajaAbierta: true,
        cajaListaParaAbrir: false,
      };
    });
    autoSelectedOnceRef.current = true;
    return true;
  }, []);

  const isLoading =
    !rutUsuario || loadingAsignadas || loadingEstado || estado.initializing;

  return {
    estado,
    seleccionarCaja,
    isLoading,
    reloadEstado,
    error: errorAsignadas || errorEstado,
  };
};

export default useVerificarCaja;
