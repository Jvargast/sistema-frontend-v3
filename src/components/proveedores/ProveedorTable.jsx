import PropTypes from "prop-types";
import { useMemo } from "react";
import { Chip, IconButton, Tooltip, Stack } from "@mui/material";
import { Visibility, PhoneIphone, Email } from "@mui/icons-material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { formatRut } from "../../utils/rut";

function getId(row) {
  return row?.id_proveedor ?? row?.idProveedor ?? row?.id;
}

const ProveedorTable = ({
  rows,
  totalItems,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
  loading,
  errorMessage,
}) => {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        id: "id",
        label: "ID",
        render: (row) => Number(getId(row)),
      },
      {
        id: "razon_social",
        label: "Razón social / Nombre",
        render: (row) => row?.razon_social || row?.nombre || "—",
        minWidth: 220,
      },
      {
        id: "rut",
        label: "RUT",
        render: (row) => formatRut(row?.rut),
      },
      {
        id: "contacto",
        label: "Contacto",
        align: "center",
        render: (row) => (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ flexWrap: "wrap", width: "100%", textAlign: "center" }}
          >
            <Chip
              size="small"
              icon={<PhoneIphone fontSize="small" />}
              label={row?.telefono || "—"}
              sx={{ minWidth: 120, justifyContent: "center" }}
            />
            <Chip
              size="small"
              variant="outlined"
              icon={<Email fontSize="small" />}
              label={row?.email || "—"}
              sx={{
                minWidth: 180,
                justifyContent: "center",
                maxWidth: 240,
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Stack>
        ),
        minWidth: 240,
      },

      {
        id: "estado",
        label: "Estado",
        render: (row) => {
          const activo =
            row?.activo ??
            row?.isActive ??
            String(row?.estado || "").toLowerCase() === "activo";
          return (
            <Chip
              size="small"
              label={activo ? "Activo" : "Inactivo"}
              color={activo ? "success" : "default"}
            />
          );
        },
      },
      {
        id: "creado",
        label: "Creado",
        render: (row) => {
          const f = row?.createdAt || row?.fecha_de_creacion || row?.created_at;
          return f ? dayjs(f).format("DD-MM-YYYY") : "—";
        },
      },
      {
        id: "acciones",
        label: "Acciones",
        align: "right",
        render: (row) => (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Tooltip title="Ver detalle">
              <IconButton
                color="primary"
                onClick={() => navigate(`/admin/proveedores/ver/${getId(row)}`)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [navigate]
  );

  return (
    <DataTable
      title="Listado de Proveedores"
      subtitle="Gestión de proveedores registrados"
      columns={columns}
      rows={rows}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      page={page}
      handleChangePage={(_, newPage) => setPage(newPage)}
      handleChangeRowsPerPage={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
      loading={loading}
      errorMessage={errorMessage}
    />
  );
};

ProveedorTable.propTypes = {
  rows: PropTypes.array.isRequired,
  totalItems: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default ProveedorTable;
