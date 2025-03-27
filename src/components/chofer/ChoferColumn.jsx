import { useGetPedidosAsignadosQuery } from "../../store/services/pedidosApi";
import PropTypes from "prop-types";
import Column from "./Column";

const ChoferColumn = ({ chofer }) => {
  // El chofer podría tener un campo "id_usuario" o "id_chofer"
  // Ajusta según cómo tengas definido el modelo de usuario
  const {
    data: assignedData,
    isLoading,
    isError,
  } = useGetPedidosAsignadosQuery(chofer.rut);

  if (isLoading) {
    return <div>Cargando pedidos de {chofer.nombre}...</div>;
  }

  if (isError) {
    return <div>Error al cargar pedidos de {chofer.nombre}</div>;
  }

  // Recuerda que "getPedidosAsignados" tiene un transformResponse
  // que retorna { pedidos, paginacion }, así que assignedData.pedidos
  // es el array real de pedidos.
  const assignedPedidos = assignedData?.pedidos || [];

  return (
    <Column
      title={chofer.nombre}
      pedidos={assignedPedidos}
      backgroundColor="#e4f7e2"
    />
  );
};

ChoferColumn.propTypes = {
  chofer: PropTypes.shape({
    rut: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChoferColumn;
