const listeners = {};
let refetchMisPedidosPending = false;
let refetchAgendaViajesPending = false;

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

  return () => {
    listeners["refetchMisPedidos"] = listeners["refetchMisPedidos"].filter(
      (cb) => cb !== callback
    );
  };
};

export const emitRefetchAgendaViajes = () => {
  refetchAgendaViajesPending = true;
  if (listeners["refetchAgendaViajes"]) {
    listeners["refetchAgendaViajes"].forEach((callback) => callback());
    refetchAgendaViajesPending = false;
  }
};

export const onRefetchAgendaViajes = (callback) => {
  if (!listeners["refetchAgendaViajes"]) {
    listeners["refetchAgendaViajes"] = [];
  }

  listeners["refetchAgendaViajes"].push(callback);

  if (refetchAgendaViajesPending) {
    callback();
    refetchAgendaViajesPending = false;
  }

  // 🔁 DEVOLVER función de limpieza
  return () => {
    listeners["refetchAgendaViajes"] = listeners["refetchAgendaViajes"].filter(
      (cb) => cb !== callback
    );
  };
};
