import { useEffect, useMemo, useState } from "react";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateInsumoMutation,
  useDeleteInsumosMutation,
  useLazyGetAllInsumosAllQuery,
} from "../../store/services/insumoApi";
import { useGetAllTiposQuery } from "../../store/services/tipoInsumoApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import Header from "../../components/common/Header";
import AlertDialog from "../../components/common/AlertDialog";
import ModalForm from "../../components/common/ModalForm";
import GroupedInsumos from "../../components/insumos/GroupedInsumos";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useHasPermission } from "../../utils/useHasPermission";
import { useIsMobile } from "../../utils/useIsMobile";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import InventarioMatrizInsumos from "../../components/insumos/InventarioMatrizInsumos";
import InventarioTabsInsumosPorSucursal from "../../components/insumos/InventarioTabsInsumosPorSucursal";
import InventarioAccordionInsumosPorInsumo from "../../components/insumos/InventarioAccordionInsumosPorInsumo";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import DangerActionButton from "../../components/common/DangerActionButton";
import PrimaryActionButton from "../../components/common/PrimaryActionButton";

const Insumos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const { rol } = useSelector((state) => state.auth);
  const sucursalActiva = useSucursalActiva();
  const { data: sucursales, isLoading: loadingSucursales } =
    useGetAllSucursalsQuery();

  const {
    data: tiposData,
    isLoading: isLoadingTipos,
    isError: isErrorTipos,
    refetch: refetchTipos,
  } = useGetAllTiposQuery();

  useRegisterRefresh(
    "insumos",
    async () => {
      await Promise.all([refetchTipos()]);
      return true;
    },
    [refetchTipos]
  );

  const tipos = useMemo(
    () => tiposData?.map((t) => t.nombre_tipo) || [],
    [tiposData]
  );

  const [searchInputs, setSearchInputs] = useState({});
  const [searches, setSearches] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const selectedCount = Object.values(selectedRows).flat().length;
  const hasSelected = selectedCount > 0;

  const [createInsumo, { isLoading: isCreating }] = useCreateInsumoMutation();
  const [deleteInsumos, { isLoading: isDeleting }] = useDeleteInsumosMutation();

  const canCreateInsumo = useHasPermission("inventario.insumo.crear");
  const canDeleteInsumo = useHasPermission("inventario.insumo.eliminar");

  const [tabIndex, setTabIndex] = useState(0);
  const [vista, setVista] = useState(0);

  const shouldFetchAll = vista === 1 || vista === 2 || vista === 3;

  const [triggerAll, { data: allInsumos = [], isFetching: isLoadingAll }] =
    useLazyGetAllInsumosAllQuery();

  const insumosAll = allInsumos;

  const insumosFiltradosPorSucursal = useMemo(() => {
    if (rol === "administrador" || !sucursalActiva?.id_sucursal) {
      return insumosAll;
    }
    return insumosAll.map((ins) => ({
      ...ins,
      inventario: Array.isArray(ins.inventario)
        ? ins.inventario.filter(
            (inv) => inv.id_sucursal === sucursalActiva.id_sucursal
          )
        : ins.inventario,
    }));
  }, [insumosAll, rol, sucursalActiva]);

  const sucursalesParaVistas = useMemo(
    () => (rol === "administrador" ? sucursales || [] : []),
    [rol, sucursales]
  );

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const handleVistaChange = (_, value) => setVista(value);

  const handleSearchInputChange = (tipo, value) =>
    setSearchInputs((prev) => ({ ...prev, [tipo]: value }));

  const handleSearch = (tipo) =>
    setSearches((prev) => ({ ...prev, [tipo]: searchInputs[tipo] }));

  const handleEdit = (row) => {
    navigate(`/insumos/editar/${row.id_insumo}`, { state: { refetch: true } });
  };

  const fields = useMemo(
    () => [
      { name: "nombre_insumo", label: "Nombre del Insumo", type: "text" },
      { name: "unidad_de_medida", label: "Unidad de Medida", type: "text" },
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

  useEffect(() => {
    if (shouldFetchAll) {
      triggerAll({ includeInventario: true });
    }
  }, [shouldFetchAll, triggerAll]);

  const handleCreate = async (data) => {
    try {
      const cleanData = {
        ...data,
        codigo_barra: data.codigo_barra || "",
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

  if (isLoadingTipos || loadingSucursales) return <LoaderComponent />;
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
      <Header title="Insumos" subtitle="Gestión de Insumos" />

      {/* Acciones */}
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
                ) {
                  setOpenAlert(true);
                }
              }}
              title="Eliminar Seleccionados"
            >
              <DeleteForeverIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          ) : (
            <DangerActionButton
              label="Eliminar seleccionados"
              startIcon={<DeleteForeverIcon />}
              onClick={() => setOpenAlert(true)}
              disabled={!hasSelected}
              loading={isDeleting}
            />
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
            <PrimaryActionButton
              label="Nuevo insumo"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
            />
          ))}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Tabs
          value={vista}
          onChange={handleVistaChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            p: 1,
            borderRadius: 3,
            bgcolor:
              theme.palette.mode === "light"
                ? theme.palette.background.paper
                : theme.palette.grey[900],
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 24px rgba(0,0,0,0.08)"
                : "0 8px 24px rgba(0,0,0,0.35)",
            "& .MuiTab-root": {
              position: "relative",
              overflow: "hidden",
              WebkitTapHighlightColor: "transparent",
              outline: "none",
              minHeight: 56,
              px: 2.4,
              mx: 0.6,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 0.2,
              border: `1px solid ${theme.palette.divider}`,
              color:
                theme.palette.mode === "light"
                  ? theme.palette.grey[900]
                  : theme.palette.grey[300],
              transition: "all .18s ease",
              "& .MuiTouchRipple-root": { display: "none" },

              "&:hover": {
                background:
                  theme.palette.mode === "light"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.primary.light, 0.16),
                borderColor:
                  theme.palette.mode === "light"
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.light, 0.3),
              },
              "&.Mui-focusVisible, &:focus-visible": {
                outline: "none",
                boxShadow: `0 0 0 3px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
              },
              "&.Mui-selected": {
                borderColor: "transparent",
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[300],
                background:
                  theme.palette.mode === "light"
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 10px 22px ${alpha(
                  theme.palette.primary.main,
                  0.35
                )}`,
              },
            },
          }}
        >
          <Tab disableRipple label="Listado por Tipo" />
          <Tab disableRipple label="Matriz Global" />
          <Tab disableRipple label="Por Sucursal" />
          <Tab disableRipple label="Por Insumo" />
        </Tabs>
      </Box>

      {/* Vista 0: listado por tipo (tu GroupedInsumos actual) */}
      {vista === 0 && (
        <>
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
                  setSearchInput={(value) =>
                    handleSearchInputChange(tipo, value)
                  }
                  setSearch={() => handleSearch(tipo)}
                  handleEdit={handleEdit}
                  setSelectedRows={setSelectedRows}
                  isMobile={isMobile}
                />
              )}
            </Box>
          ))}
        </>
      )}

      {/* Vista 1: Matriz Global (mock) */}
      {vista === 1 &&
        (isLoadingAll ? (
          <LoaderComponent />
        ) : (
          <InventarioMatrizInsumos
            insumos={insumosFiltradosPorSucursal}
            sucursales={
              rol === "administrador"
                ? sucursales || []
                : sucursales?.filter(
                    (s) => s.id_sucursal === sucursalActiva?.id_sucursal
                  ) || []
            }
          />
        ))}

      {/* Vista 2: Tabs por Sucursal */}
      {vista === 2 &&
        (isLoadingAll ? (
          <LoaderComponent />
        ) : (
          <InventarioTabsInsumosPorSucursal
            insumos={insumosFiltradosPorSucursal}
            sucursales={sucursalesParaVistas}
          />
        ))}

      {/* Vista 3: Acordeón por Insumo */}
      {vista === 3 &&
        (isLoadingAll ? (
          <LoaderComponent />
        ) : (
          <InventarioAccordionInsumosPorInsumo
            insumos={insumosFiltradosPorSucursal}
            sucursales={sucursalesParaVistas}
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
