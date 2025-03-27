import { setUser } from "../store/reducers/authSlice";
import { setCajaAbierta, setCajaAsignada } from "../store/reducers/cajaSlice";
import { cajaApi } from "../store/services/cajaApi";

export const iniciarSesion = (usuario) => async (dispatch) => {
  dispatch(setUser(usuario));

  // Solo para vendedores u otros roles con caja
  const rutUsuario = usuario?.usuario?.rut;
  if (rutUsuario && usuario?.rol === "vendedor") {
    try {
      const { data } = await dispatch(
        cajaApi.endpoints.getCajaAsignada.initiate({ rutUsuario })
      ).unwrap();

      if (data?.id_caja) {
        dispatch(setCajaAsignada(data.id_caja));
        dispatch(setCajaAbierta(true));
      } else {
        dispatch(setCajaAsignada(null));
        dispatch(setCajaAbierta(false));
      }
    } catch (error) {
      console.error("❌ Error al obtener caja asignada:", error);
    }
  }
};
