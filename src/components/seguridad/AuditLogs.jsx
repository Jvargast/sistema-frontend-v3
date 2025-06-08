import { Card, CardContent } from "@mui/material";
import PaginatedTable from "./PaginatedTable";
import PropTypes from "prop-types";

const AuditLogs = ({ logs, isLoading, onPageChange, paginacion }) => {
  const columns = [
    { field: "userId", headerName: "Usuario", width: 120, minWidth: 100 },
    { field: "action", headerName: "Acción", width: 150, minWidth: 120 },
    { field: "module", headerName: "Módulo", width: 150, minWidth: 120 },
    { field: "ip_address", headerName: "IP", width: 150, minWidth: 130 },
    {
      field: "createdAt",
      headerName: "Fecha",
      width: 180,
      minWidth: 150,
      renderCell: ({ value }) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <Card>
      <CardContent>
        <PaginatedTable
          title="Registros de Auditoría"
          data={logs}
          isLoading={isLoading}
          onPageChange={onPageChange}
          paginacion={paginacion}
          columns={columns}
        />
      </CardContent>
    </Card>
  );
};

AuditLogs.propTypes = {
  logs: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  paginacion: PropTypes.object.isRequired,
};

export default AuditLogs;
