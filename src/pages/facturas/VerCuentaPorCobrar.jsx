import { useParams } from "react-router-dom";
import { useGetCuentaPorCobrarByIdQuery } from "../../store/services/cuentasPorCobrarApi";
import LoaderComponent from "../../components/common/LoaderComponent";
import CuentaPorCobrarDetalle from "./CuentasPorCobrar";

const VerCuentaPorCobrar = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetCuentaPorCobrarByIdQuery(id);

  if (isLoading) return <LoaderComponent />;
  if (error || !data) return <div>Error al cargar los datos</div>;

  return <CuentaPorCobrarDetalle cuenta={data} />;
};

export default VerCuentaPorCobrar;
