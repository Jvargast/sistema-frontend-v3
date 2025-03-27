import { Card, CardContent, Typography } from "@mui/material";
import PaginatedTable from "./PaginatedTable";
import PropTypes from "prop-types";

const TransactionLogs = ({
  transactions,
  isLoading,
  onPageChange,
  paginacion,
}) => {
  const columns = [
    {
      field: "id_log",
      headerName: "ID",
      width: 70,
      minWidth: 70,
      align: "center",
    },
    {
      field: "id_venta",
      headerName: "ID Venta",
      width: 100,
      minWidth: 90,
      align: "center",
    },
    {
      field: "usuario",
      headerName: "Usuario",
      width: 150,
      minWidth: 120,
      align: "center",
    },
    {
      field: "accion",
      headerName: "Acción",
      width: 130,
      minWidth: 120,
      align: "center",
    },
    {
      field: "detalle",
      headerName: "Detalle",
      minWidth: 250,
      flex: 1,
      renderCell: ({ value }) => (
        <span style={{ color: "#007AFF", fontWeight: "bold" }}>
          {value || "Sin detalles"}
        </span>
      ),
    },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 180,
      minWidth: 150,
      renderCell: ({ value }) => (
        <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>
          {new Date(value).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <Card
      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          mb={2}
          textAlign="center"
        >
          Logs de Ventas  📜
        </Typography>
        <PaginatedTable
          title="Registro de Ventas"
          data={transactions}
          isLoading={isLoading}
          onPageChange={onPageChange}
          paginacion={paginacion}
          columns={columns}
          sx={{
            "& .MuiTable-root": {
              borderRadius: "10px",
              overflow: "hidden",
            },
            "& .MuiTableCell-head": {
              backgroundColor: "#F3F4F6",
              fontWeight: "bold",
              color: "#374151",
              textTransform: "uppercase",
            },
            "& .MuiTableRow-root:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

TransactionLogs.propTypes = {
  transactions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  paginacion: PropTypes.object.isRequired,
};

export default TransactionLogs;
