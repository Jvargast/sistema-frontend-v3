
const listeners = {};
let refetchMisPedidosPending = false;

export const emitRefetchMisPedidos = () => {
  refetchMisPedidosPending = true;
  if (listeners["refetchMisPedidos"]) {
    listeners["refetchMisPedidos"].forEach((callback) => callback());
    refetchMisPedidosPending = false;
  }
};

export const onRefetchMisPedidos = (callback) => {
  if (!listeners["refetchMisPedidos"]) {
    listeners["refetchMisPedidos"] = [];
  }
  listeners["refetchMisPedidos"].push(callback);

  if (refetchMisPedidosPending) {
    callback();
    refetchMisPedidosPending = false;
  }
};
