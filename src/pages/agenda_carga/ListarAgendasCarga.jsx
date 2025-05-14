import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useGetAllAgendasQuery } from "../../store/services/agendaCargaApi";
import { convertirFechaLocal } from "../../utils/fechaUtils";

const estadoColores = {
  pendiente: "warning",
  "en tránsito": "info",
  completado: "success",
  anulado: "error",
};

const ListarAgendasCarga = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllAgendasQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const agendas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_agenda_carga",
      label: "ID",
      render: (row) => row.id_agenda_carga,
    },
    {
      id: "fecha_hora",
      label: "Fecha de Carga",
      render: (row) =>
        row.fecha_hora ? convertirFechaLocal(row.fecha_hora) : "Sin fecha",
    },
    {
      id: "chofer",
      label: "Chofer",
      render: (row) => row.chofer?.nombre || "Sin chofer",
    },
    {
      id: "camion",
      label: "Camión",
      render: (row) => row.camion?.placa || "Sin camión",
    },
    {
      id: "estado",
      label: "Estado",
      render: (row) => {
        const estado = row.estado || "Desconocido";
        const color = estadoColores[estado.toLowerCase()] || "default";
        return (
          <Chip
            label={estado}
            color={color}
            sx={{ fontWeight: "bold", minWidth: 110 }}
          />
        );
      },
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/agendas/ver/${row.id_agenda_carga}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && agendas.length === 0) {
    return (
      <EmptyState
        title="No hay agendas de carga registradas"
        subtitle="Puedes crear una nueva agenda desde el panel principal"
        buttonText="Crear Agenda"
        onAction={() => navigate("/agenda-carga")}
      />
    );
  }

  return (
    <DataTable
      title="🚚 Agendas de Carga"
      columns={columns}
      rows={agendas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar las agendas de carga o no existen datos disponibles."
    />
  );
};

export default ListarAgendasCarga;
