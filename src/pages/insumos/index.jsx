import { useMemo, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateInsumoMutation,
  useDeleteInsumosMutation,
} from "../../store/services/insumoApi";
import { useGetAllTiposQuery } from "../../store/services/tipoInsumoApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Header from "../../components/common/Header";
import AlertDialog from "../../components/common/AlertDialog";
import ModalForm from "../../components/common/ModalForm";
import GroupedInsumos from "../../components/insumos/GroupedInsumos";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useHasPermission } from "../../utils/useHasPermission";

const Insumos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const location = useLocation();

  const {
    data: tiposData,
    isLoading: isLoadingTipos,
    isError: isErrorTipos,
  } = useGetAllTiposQuery();

  const tipos = useMemo(
    () => tiposData?.map((tipo) => tipo.nombre_tipo) || [],
    [tiposData]
  );
  const [searchInputs, setSearchInputs] = useState({}); // Maneja el input de búsqueda por tipo
  const [searches, setSearches] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [createInsumo, { isLoading: isCreating }] = useCreateInsumoMutation();
  const [deleteInsumos, { isLoading: isDeleting }] = useDeleteInsumosMutation();

  const canCreateInsumo = useHasPermission("crear_insumo");
  const canDeleteInsumo = useHasPermission("borrar_insumos");


  const handleSearchInputChange = (tipo, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [tipo]: value, // Actualiza el input de búsqueda para el tipo
    }));
  };

  const handleSearch = (tipo) => {
    setSearches((prev) => ({
      ...prev,
      [tipo]: searchInputs[tipo], // Aplica la búsqueda para el tipo
    }));
  };

  const handleEdit = useCallback(
    (row) => {
      navigate(`/insumos/editar/${row.id_insumo}`, {
        state: { refetch: true },
      });
    },
    [navigate]
  );

  const fields = useMemo(
    () => [
      { name: "nombre_insumo", label: "Nombre del Insumo", type: "text" },
      { name: "descripcion", label: "Descripción", type: "text" },
      { name: "codigo_barra", label: "Código de Barra", type: "text" },
      { name: "unidad_de_medida", label: "Unidad de Medida", type: "text" },
      { name: "cantidad_inicial", label: "Cantidad Inicial", type: "number" },
      { name: "es_para_venta", label: "¿Para Venta?", type: "checkbox" },
      {
        name: "id_tipo_insumo",
        label: "Tipo de Insumo",
        type: "select",
        options: tipos.map((tipo, index) => ({
          value: index + 1,
          label: tipo,
        })),
        defaultValue: 1,
      },
    ],
    [tipos]
  );

  const handleCreate = async (data) => {
    try {
      const cleanData = {
        ...data,
        codigo_barra: data.codigo_barra || null,
        unidad_de_medida: data.unidad_de_medida || null,
        precio: data.precio || null,
      };
      await createInsumo(cleanData).unwrap();
      dispatch(
        showNotification({
          message: "Insumo creado con éxito",
          severity: "success",
        })
      );
      setOpenModal(false);
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error: ${error.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const handleDelete = async () => {
    const idsToDelete = Object.values(selectedRows)
      .flat()
      .map((id) => Number(id)) // Convertir a números explícitamente
      .filter((id) => !isNaN(id)); // Filtrar valores no válidos

    if (idsToDelete.length === 0) {
      dispatch(
        showNotification({
          message: "No hay insumos seleccionados para eliminar",
          severity: "warning",
        })
      );
      return;
    }
    try {
      await deleteInsumos({ ids: idsToDelete }).unwrap();
      dispatch(
        showNotification({
          message: "Insumos eliminados con éxito",
          severity: "success",
        })
      );
      setOpenAlert(false);
      setSelectedRows({});
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error: ${error.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  if (isLoadingTipos) return <LoaderComponent />;
  if (isErrorTipos) {
    dispatch(
      showNotification({
        message: `Error al cargar insumos ${isErrorTipos}`,
        severity: "error",
      })
    );
    return null;
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Header title="Insumos" subtitle="Lista de Insumos" />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        {canDeleteInsumo && (<Button
          color="error"
          variant="contained"
          onClick={() => setOpenAlert(true)}
          disabled={
            Object.values(selectedRows).flat().length === 0 || isDeleting
          } 
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
          }}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Seleccionados"}
        </Button>)}
        {canCreateInsumo && <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
          }}
        >
          Nuevo Insumo
        </Button>}
      </Box>

      {tipos.map((tipo) => (
        <GroupedInsumos
          key={tipo}
          tipo={tipo}
          search={searches[tipo] || ""}
          searchInput={searchInputs[tipo] || ""}
          setSearchInput={(value) => handleSearchInputChange(tipo, value)}
          setSearch={() => handleSearch(tipo)}
          handleEdit={handleEdit} // Pasar handleEdit
          setSelectedRows={setSelectedRows} // Para manejar la selección
        />
      ))}

      <AlertDialog
        openAlert={openAlert}
        title="¿Eliminar Insumo?"
        onConfirm={handleDelete}
        onCloseAlert={() => setOpenAlert(false)}
        message={`¿Está seguro de eliminar ${
          Object.values(selectedRows).flat().length
        } insumos?`}
      />

      <ModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreate}
        fields={fields}
        title="Añadir Nuevo Insumo"
        isLoading={isCreating}
      />
    </Box>
  );
};

export default Insumos;
