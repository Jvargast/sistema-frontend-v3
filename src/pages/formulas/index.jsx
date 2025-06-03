import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip, IconButton } from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { AddCircleOutline } from "@mui/icons-material";
import {
  useGetAllFormulasQuery,
  useDeleteFormulaMutation,
} from "../../store/services/FormulaProductoApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import AlertDialog from "../../components/common/AlertDialog";

const ListarFormulasProductos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = useState(false);
  const [formulaSel, setFormulaSel] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllFormulasQuery(
    {
      page: page + 1,
      limit: rowsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteFormula] = useDeleteFormulaMutation();

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const formulas = useMemo(() => data?.formulas || [], [data]);
  const totalItems = useMemo(() => data?.paginacion?.totalItems || 0, [data]);

  const pedirConfirmacion = (row) => {
    setFormulaSel(row);
    setAlertOpen(true);
  };

  const confirmarBorrado = async () => {
    try {
      await deleteFormula(formulaSel.id_formula).unwrap();
      dispatch(
        showNotification({ message: "Fórmula eliminada", severity: "success" })
      );
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.message || "No se pudo eliminar",
          severity: "error",
        })
      );
    }
  };

  const columns = [
    {
      id: "id_formula_producto",
      label: "ID",
      render: (row) => row.id_formula,
    },
    {
      id: "nombre_formula",
      label: "Nombre Fórmula",
      render: (row) => row.nombre_formula,
    },
    {
      id: "Producto",
      label: "Producto Final",
      render: (row) => row.Producto.nombre_producto,
    },
    {
      id: "cantidad_requerida",
      label: "Cantidad Final",
      render: (row) =>
        `${row.cantidad_requerida} ${row.Producto.unidad_de_medida || "u."}`,
    },
    {
      id: "estado",
      label: "Estado",
      render: (row) => (
        <Chip
          label={row.activo ? "Activa" : "Inactiva"}
          color={row.activo ? "success" : "default"}
          sx={{ fontWeight: "bold", minWidth: 100 }}
        />
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      render: (row) => (
        <>
          <IconButton
            color="info"
            onClick={() => navigate(`/formulas/ver/${row.id_formula}`)}
          >
            <Visibility />
          </IconButton>
          <IconButton color="error" onClick={() => pedirConfirmacion(row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  if (!isLoading && formulas.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes fórmulas registradas"
        subtitle="Agrega tu primera fórmula para empezar."
        buttonText="Crear Fórmula"
        onAction={() => navigate("/formulas/nuevo")}
      />
    );
  }

  const botonCrear = (
    <Button
      variant="contained"
      startIcon={<AddCircleOutline />}
      onClick={() => navigate("/formulas/nuevo")}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        fontWeight: 600,
      }}
    >
      Crear fórmula
    </Button>
  );

  return (
    <>
      <DataTable
        title="🛠️ Fórmulas de Productos"
        headerAction={botonCrear}   
        columns={columns}
        rows={formulas}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={(_, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        loading={isLoading}
        errorMessage="No se pudieron cargar las fórmulas o no existen datos disponibles."
      />

      {formulaSel && (
        <AlertDialog
          openAlert={alertOpen}
          onCloseAlert={() => setAlertOpen(false)}
          onConfirm={confirmarBorrado}
          title="Eliminar fórmula"
          message={`¿Estás seguro de eliminar la fórmula "${formulaSel.nombre_formula}"? Esta acción es irreversible.`}
        />
      )}
    </>
  );
};

export default ListarFormulasProductos;
