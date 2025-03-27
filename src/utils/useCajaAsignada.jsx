import { useEffect, useState } from "react";
import { useGetEstadoCajaQuery } from "../store/services/cajaApi";


const useCajaAsignada = (idUsuario) => {
  const { data, isLoading, error } = useGetEstadoCajaQuery();
  const [estadoCaja, setEstadoCaja] = useState({
    cajaAsignada: false,
    caja: null,
    isLoading,
  });

  useEffect(() => {
    if (data) {
      const cajaAsignada = data.caja?.id_usuario_asignado === idUsuario;
      setEstadoCaja({
        cajaAsignada,
        caja: data.caja || null,
        isLoading: false,
      });
    }
  }, [data, idUsuario]);

  return {
    estadoCaja,
    isLoading: estadoCaja.isLoading || isLoading,
    error,
  };
};

export default useCajaAsignada;
