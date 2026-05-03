import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, IconButton, useTheme } from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import {
  useGetAllFormulasQuery,
  useDeleteFormulaMutation,
} from "../../store/services/FormulaProductoApi";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import AlertDialog from "../../components/common/AlertDialog";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import PrimaryActionButton from "../../components/common/PrimaryActionButton";
import SearchBar from "../../components/common/SearchBar";
import Box from "../../components/common/CompatBox";
import { getActionIconButtonSx } from "../../components/common/tableStyles";
import { filterBySearch } from "../../utils/searchUtils";

const ListarFormulasProductos = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = useState(false);
  const [formulaSel, setFormulaSel] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const formulaQueryParams = useMemo(
    () => ({
      page: search ? 1 : page + 1,
      limit: search ? 1000 : rowsPerPage,
    }),
    [page, rowsPerPage, search]
  );

  const { data, isLoading, refetch } = useGetAllFormulasQuery(
    formulaQueryParams,
    { refetchOnMountOrArgChange: true }
  );

  useRegisterRefresh(
    "formulas",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  const [deleteFormula, { isLoading: isDeleting }] = useDeleteFormulaMutation();

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, search, refetch]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const formulas = useMemo(() => data?.formulas || [], [data]);
  const serverTotalItems = useMemo(
    () => data?.paginacion?.totalItems || 0,
    [data]
  );
  const formulasFiltradas = useMemo(
    () =>
      filterBySearch(formulas, search, [
        "id_formula",
        "nombre_formula",
        "Producto.nombre_producto",
        "Producto.unidad_de_medida",
        "cantidad_requerida",
        (formula) => (formula.activo ? "activa activo" : "inactiva inactivo"),
      ]),
    [formulas, search]
  );
  const rows = useMemo(() => {
    if (!search) return formulas;
    const start = page * rowsPerPage;
    return formulasFiltradas.slice(start, start + rowsPerPage);
  }, [formulas, formulasFiltradas, page, rowsPerPage, search]);
  const totalItems = search ? formulasFiltradas.length : serverTotalItems;

  const pedirConfirmacion = (row) => {
    setFormulaSel(row);
    setAlertOpen(true);
  };

  const confirmarBorrado = async () => {
    try {
      await deleteFormula(formulaSel.id_formula).unwrap();
      dispatch(
        showNotification({
          message: "Fórmula deshabilitada",
          severity: "success",
        })
      );
      await refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.message || "No se pudo deshabilitar",
          severity: "error",
        })
      );
    } finally {
      setAlertOpen(false);
      setFormulaSel(null);
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
      render: (row) => row.Producto?.nombre_producto || "Sin producto",
    },
    {
      id: "cantidad_requerida",
      label: "Cantidad Final",
      render: (row) =>
        `${row.cantidad_requerida} ${row.Producto?.unidad_de_medida || "u."}`,
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
            aria-label="Ver fórmula"
            color="info"
            onClick={() => navigate(`/formulas/ver/${row.id_formula}`)}
            sx={getActionIconButtonSx(theme, "info")}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Eliminar fórmula"
            color="error"
            onClick={() => pedirConfirmacion(row)}
            sx={getActionIconButtonSx(theme, "error")}
          >
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  if (!isLoading && !search && formulas.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes fórmulas registradas"
        subtitle="Agrega tu primera fórmula para empezar."
        buttonText="Crear Fórmula"
        onAction={() => navigate("/formulas/crear")}
      />
    );
  }

  const botonCrear = (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 1.5,
        mt: 1,
        mb: 2,
      }}
    >
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={setSearch}
        placeholder="Buscar fórmulas por nombre, producto o estado..."
        width={{ xs: "100%", sm: 420 }}
      />
      <PrimaryActionButton
        label="Crear fórmula"
        startIcon={<AddCircleOutlineOutlined />}
        onClick={() => navigate("/formulas/crear")}
      />
    </Box>
  );

  return (
    <>
      <DataTable
        title="Fórmulas de Productos"
        subtitle="Gestión de Fórmulas"
        headerAction={botonCrear}
        columns={columns}
        rows={rows}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={(_, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        loading={isLoading}
        errorMessage={
          search
            ? "No hay fórmulas que coincidan con la búsqueda."
            : "No se pudieron cargar las fórmulas o no existen datos disponibles."
        }
        showBackButton={false}
      />

      {formulaSel && (
        <AlertDialog
          openAlert={alertOpen}
          onCloseAlert={() => {
            setAlertOpen(false);
            setFormulaSel(null);
          }}
          onConfirm={confirmarBorrado}
          title="Deshabilitar fórmula"
          message={`¿Estás seguro de deshabilitar la fórmula "${formulaSel.nombre_formula}"? No se borrarán sus producciones asociadas y podrás reactivarla más adelante.`}
          confirmLoading={isDeleting}
        />
      )}
    </>
  );
};

export default ListarFormulasProductos;
