import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useGetVentasChoferQuery } from "../../store/services/ventasChoferApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { useSelector } from "react-redux";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";

const estadoColores = { pendiente: "warning", pagado: "success" };

const formatCLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor));

const formatFecha = (fecha) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(fecha));

const getCotSucursalId = (c) =>
  Number(
    c?.id_sucursal ??
      c?.Sucursal?.id_sucursal ??
      c?.sucursal?.id_sucursal ??
      NaN
  );

const ListarVentasChofer = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const rol = useSelector((state) => state?.auth?.rol);

  const queryArgs = useMemo(() => {
    const args = { page: page + 1, limit: rowsPerPage };
    if (mode !== "global" && Number(activeSucursalId)) {
      args.id_sucursal = Number(activeSucursalId);
    }
    return args;
  }, [page, rowsPerPage, mode, activeSucursalId]);

  const { data: sucursalesData } = useGetAllSucursalsQuery();

  const sucursalesArr = useMemo(
    () =>
      Array.isArray(sucursalesData?.sucursales)
        ? sucursalesData.sucursales
        : Array.isArray(sucursalesData)
        ? sucursalesData
        : [],
    [sucursalesData]
  );

  const sucMap = useMemo(
    () => new Map(sucursalesArr.map((s) => [Number(s.id_sucursal), s.nombre])),
    [sucursalesArr]
  );

  const { data, isLoading, refetch } = useGetVentasChoferQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
    keepUnusedDataFor: 30,
  });

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId]);

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const ventas = useMemo(() => data?.data || [], [data]);
  const totalItems = useMemo(() => data?.total?.totalItems || 0, [data]);

  const columns = [
    {
      id: "id_venta_chofer",
      label: "ID",
      render: (row) => row.id_venta_chofer,
    },
    {
      id: "sucursal",
      label: "Sucursal",
      render: (row) => {
        const id = getCotSucursalId(row);
        const nombre =
          row?.Sucursal?.nombre ||
          sucMap.get(Number(id)) ||
          (id ? `Sucursal ${id}` : "—");
        const isActive =
          typeof activeSucursalId !== "undefined" &&
          activeSucursalId !== null &&
          Number(id) === Number(activeSucursalId) &&
          mode !== "global";

        return (
          <Chip
            label={nombre}
            size="small"
            color={isActive ? "primary" : "default"}
            sx={{ fontWeight: "bold" }}
          />
        );
      },
    },
    {
      id: "fechaHoraVenta",
      label: "Fecha",
      render: (row) =>
        row.fechaHoraVenta ? formatFecha(row.fechaHoraVenta) : "Sin fecha",
    },
    {
      id: "cliente",
      label: "Cliente",
      render: (row) => row.cliente?.nombre || "-",
    },
    {
      id: "total_venta",
      label: "Total",
      render: (row) => formatCLP(row.total_venta),
    },
    {
      id: "metodo_pago",
      label: "Método",
      render: (row) => row.metodoPago?.nombre || "-",
    },
    {
      id: "estadoPago",
      label: "Estado",
      render: (row) => (
        <Chip
          label={
            row.estadoPago.charAt(0).toUpperCase() + row.estadoPago.slice(1)
          }
          color={estadoColores[row.estadoPago] || "default"}
          sx={{ fontWeight: "bold", minWidth: 100 }}
        />
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/ventas-chofer/ver/${row.id_venta_chofer}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (!isLoading && totalItems === 0 && mode === "global") {
    return (
      <EmptyState
        title="Aún no hay ventas chofer registradas"
        subtitle="Comienza a registrar ventas durante los viajes."
        buttonText="Ir a mis Agenda Carga"
        onAction={() => navigate("/agenda")}
      />
    );
  }

  return (
    <DataTable
      title={rol === "chofer" ? "Listado de Mis Ventas" : "Ventas Chofer"}
      subtitle="Gestión Ventas"
      columns={columns}
      rows={ventas}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
      loading={isLoading}
      errorMessage="No se pudieron cargar tus ventas."
    />
  );
};

export default ListarVentasChofer;
