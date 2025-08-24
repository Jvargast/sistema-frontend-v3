import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton, MenuItem, TextField } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useGetAllAgendasQuery } from "../../store/services/agendaCargaApi";
import { convertirFechaLocal } from "../../utils/fechaUtils";
import { useSelector } from "react-redux";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";

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

  const { data: sucursales } = useGetAllSucursalsQuery();

  const getAgendaSucursalId = (row) =>
    Number(
      row?.id_sucursal ??
        row?.Sucursal?.id_sucursal ??
        row?.sucursal?.id_sucursal ??
        NaN
    );

  const sucursalesMap = useMemo(
    () =>
      new Map((sucursales || []).map((s) => [Number(s.id_sucursal), s.nombre])),
    [sucursales]
  );

  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const isSucursalScope = mode !== "global" && Number(activeSucursalId);

  const queryArg = {
    page: page + 1,
    limit: rowsPerPage,
    ...(isSucursalScope ? { id_sucursal: Number(activeSucursalId) } : {}),
  };
  const { data, isLoading, refetch } = useGetAllAgendasQuery(queryArg);

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const [sucursalFiltro, setSucursalFiltro] = useState("");

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId]);

  const agendas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_agenda_carga",
      label: "ID",
      render: (row) => row.id_agenda_carga,
    },
    {
      id: "sucursal",
      label: "Sucursal",
      render: (row) => {
        const id = getAgendaSucursalId(row);
        const nombre = sucursalesMap.get(id) || (id ? `Sucursal ${id}` : "—");
        return <Chip label={nombre} size="small" sx={{ fontWeight: "bold" }} />;
      },
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
          onClick={() => navigate(`/admin/agendas/ver/${row.id_agenda_carga}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && totalItems === 0 && mode === "global") {
    return (
      <EmptyState
        title="No hay agendas registradas"
        subtitle="Puedes crear una nueva agenda desde el panel principal"
        buttonText="Crear Agenda"
        onAction={() => navigate("/agenda-carga")}
      />
    );
  }

  return (
    <>
      {mode === "global" && (
        <TextField
          select
          size="small"
          label="Sucursal"
          value={String(sucursalFiltro)}
          onChange={(e) => {
            setSucursalFiltro(e.target.value);
            setPage(0);
          }}
          sx={{ mb: 2, minWidth: 220 }}
        >
          <MenuItem value="">Selecciona una sucursal…</MenuItem>
          {(sucursales || []).map((s) => (
            <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
              {s.nombre}
            </MenuItem>
          ))}
        </TextField>
      )}

      <DataTable
        title="Listado de Agendas de Carga"
        subtitle="Gestión de Agendas de Carga"
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
    </>
  );
};

export default ListarAgendasCarga;
