import { useEffect, useState } from "react";
import {
  useGetCajaAsignadaQuery,
  useGetEstadoCajaQuery,
} from "../store/services/cajaApi";
import { useSelector } from "react-redux";

const useVerificarCaja = (selectedVendedor = null) => {
  const usuario = useSelector((state) => state.auth);

  const rutUsuario =
    usuario?.rol === "administrador" && selectedVendedor
      ? selectedVendedor
      : usuario?.user?.id;

  const {
    data: cajaAsignada,
    isLoading: loadingAsignada,
    error: errorCaja,
    refetch: refetchCaja,
  } = useGetCajaAsignadaQuery(rutUsuario ? { rutUsuario } : undefined, {
    skip: !rutUsuario,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: estadoCaja,
    isLoading: loadingEstado,
    error: errorEstado,
    refetch: refetchEstado,
  } = useGetEstadoCajaQuery(rutUsuario ? { rutUsuario } : undefined, {
    skip: !rutUsuario,
    refetchOnMountOrArgChange: true,
  });

  const [estado, setEstado] = useState({
    cajaAbierta: false,
    caja: null,
    asignada: null,
    isLoading: true,
    fechaInvalida: false,
    cajaListaParaAbrir: false,
  });

  useEffect(() => {
    if (cajaAsignada) {
      const caja = cajaAsignada?.caja || null;

      setEstado((prev) => ({
        ...prev,
        asignada: caja, // 📌 Se asigna sin depender de la fecha
        isLoading: loadingAsignada,
        cajaListaParaAbrir: caja?.estado === "cerrada", // 📌 Se puede abrir si está cerrada, sin depender de la fecha
      }));
    } else {
      setEstado((prev) => ({
        ...prev,
        asignada: null,
        isLoading: loadingAsignada,
      }));
    }
  }, [cajaAsignada, loadingAsignada]);

  useEffect(() => {
    if (estadoCaja) {
      const cajaAbierta = estadoCaja?.cajaAbierta || false;
      const caja = estadoCaja?.caja || null;
      setEstado((prev) => ({
        ...prev,
        cajaAbierta: estadoCaja?.cajaAbierta || false,
        caja: estadoCaja?.caja || prev.caja,
        cajaListaParaAbrir: !cajaAbierta && caja?.estado === "cerrada",
      }));
    }
  }, [estadoCaja]);

  useEffect(() => {
    if (usuario?.rol === "administrador" && selectedVendedor) {
      refetchCaja();
      refetchEstado();
    }
  }, [selectedVendedor, refetchCaja, refetchEstado, usuario]);

  return {
    estado,
    isLoading: loadingEstado || loadingAsignada,
    error: errorEstado || errorCaja,
  };
};

export default useVerificarCaja;
