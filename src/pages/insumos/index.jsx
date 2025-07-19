import { useMemo, useState, useCallback } from "react";
import { Box, Button, Tab, Tabs, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
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
import { useIsMobile } from "../../utils/useIsMobile";

const Insumos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const {
    data: tiposData,
    isLoading: isLoadingTipos,
    isError: isErrorTipos,
  } = useGetAllTiposQuery();

  const tipos = useMemo(
    () => tiposData?.map((tipo) => tipo.nombre_tipo) || [],
    [tiposData]
  );
  const [searchInputs, setSearchInputs] = useState({});
  const [searches, setSearches] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [createInsumo, { isLoading: isCreating }] = useCreateInsumoMutation();
  const [deleteInsumos, { isLoading: isDeleting }] = useDeleteInsumosMutation();

  const canCreateInsumo = useHasPermission("inventario.insumo.crear");
  const canDeleteInsumo = useHasPermission("inventario.insumo.eliminar");

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  const handleSearchInputChange = (tipo, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [tipo]: value,
    }));
  };

  const handleSearch = (tipo) => {
    setSearches((prev) => ({
      ...prev,
      [tipo]: searchInputs[tipo],
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
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

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
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: "center",
          mb: 2,
          gap: isMobile ? 3 : 0,
        }}
      >
        {canDeleteInsumo &&
          (isMobile ? (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(145deg, ${theme.palette.error.light} 60%, ${theme.palette.error.main} 100%)`,
                boxShadow: `0 2px 12px 0 ${theme.palette.error.main}22, 0 1.5px 8px 0 #0001`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor:
                  Object.values(selectedRows).flat().length === 0 || isDeleting
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  Object.values(selectedRows).flat().length === 0 || isDeleting
                    ? 0.6
                    : 1,
                transition: "all 0.15s",
                "&:hover": {
                  background: `linear-gradient(120deg, ${theme.palette.error.main} 70%, ${theme.palette.error.dark} 100%)`,
                  transform: "scale(1.08)",
                  boxShadow: `0 4px 24px 0 ${theme.palette.error.dark}33`,
                },
              }}
              onClick={() => {
                if (
                  Object.values(selectedRows).flat().length > 0 &&
                  !isDeleting
                )
                  setOpenAlert(true);
              }}
              title="Eliminar Seleccionados"
            >
              <DeleteForeverIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          ) : (
            <Button
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
            </Button>
          ))}

        {canCreateInsumo &&
          (isMobile ? (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(145deg, ${theme.palette.primary.light} 60%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}22, 0 1.5px 8px 0 #0001`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  background: `linear-gradient(120deg, ${theme.palette.primary.main} 70%, ${theme.palette.primary.dark} 100%)`,
                  transform: "scale(1.08)",
                  boxShadow: `0 4px 24px 0 ${theme.palette.primary.dark}33`,
                },
              }}
              onClick={() => setOpenModal(true)}
              title="Nuevo Insumo"
            >
              <Add sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          ) : (
            <Button
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
            </Button>
          ))}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tipos.map((tipo) => (
            <Tab label={tipo} key={tipo} />
          ))}
        </Tabs>
      </Box>

      {tipos.map((tipo, idx) => (
        <Box
          key={tipo}
          role="tabpanel"
          hidden={tabIndex !== idx}
          sx={{ mt: 2 }}
        >
          {tabIndex === idx && (
            <GroupedInsumos
              tipo={tipo}
              search={searches[tipo] || ""}
              searchInput={searchInputs[tipo] || ""}
              setSearchInput={(value) => handleSearchInputChange(tipo, value)}
              setSearch={() => handleSearch(tipo)}
              handleEdit={handleEdit}
              setSelectedRows={setSelectedRows}
              isMobile={isMobile}
            />
          )}
        </Box>
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
