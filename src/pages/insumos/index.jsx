import Tabs from "../../components/common/CompatTabs";
import { useEffect, useMemo, useState } from "react";
import { Button, IconButton, ListItemText, MenuItem, Tab, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateInsumoMutation,
  useDeleteInsumosMutation,
  useLazyGetAllInsumosAllQuery } from
"../../store/services/insumoApi";
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
import SearchBar from "../../components/common/SearchBar";
import Box from "../../components/common/CompatBox";
import Menu from "../../components/common/CompatMenu";
import Typography from "../../components/common/CompatTypography";
import { getActionIconButtonSx } from "../../components/common/tableStyles";
import { filterBySearch } from "../../utils/searchUtils";

const VIEW_OPTIONS = [
  {
    value: 0,
    label: "Listado por Tipo",
    description: "Insumos agrupados por clasificación"
  },
  {
    value: 1,
    label: "Matriz Global",
    description: "Comparación de stock por sucursal"
  },
  {
    value: 2,
    label: "Por Sucursal",
    description: "Detalle separado por ubicación"
  },
  {
    value: 3,
    label: "Por Insumo",
    description: "Desglose individual de inventario"
  }
];

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
    refetch: refetchTipos
  } = useGetAllTiposQuery();

  useRegisterRefresh(
    "insumos",
    async () => {
      await Promise.all([refetchTipos()]);
      return true;
    },
    [refetchTipos]
  );

  const tipos = useMemo(() => {
    const seen = new Set();

    return (tiposData || []).reduce((acc, tipo) => {
      const nombre = tipo?.nombre_tipo?.trim();
      if (!nombre || seen.has(nombre)) return acc;
      seen.add(nombre);
      acc.push(nombre);
      return acc;
    }, []);
  }, [tiposData]);

  const tipoOptions = useMemo(() => {
    const seen = new Set();

    return (tiposData || []).reduce((acc, tipo) => {
      if (!tipo?.id_tipo_insumo || seen.has(tipo.id_tipo_insumo)) return acc;
      seen.add(tipo.id_tipo_insumo);
      acc.push({
        value: tipo.id_tipo_insumo,
        label: tipo.nombre_tipo,
      });
      return acc;
    }, []);
  }, [tiposData]);

  const [searchInputs, setSearchInputs] = useState({});
  const [searches, setSearches] = useState({});
  const [inventorySearchInput, setInventorySearchInput] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
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
  const [vistaMenuAnchor, setVistaMenuAnchor] = useState(null);

  const shouldFetchAll = vista === 1 || vista === 2 || vista === 3;
  const currentView = VIEW_OPTIONS.find((option) => option.value === vista);

  const [triggerAll, { data: allInsumos = [], isFetching: isLoadingAll }] =
  useLazyGetAllInsumosAllQuery();

  const insumosAll = allInsumos;

  const insumosFiltradosPorSucursal = useMemo(() => {
    if (rol === "administrador" || !sucursalActiva?.id_sucursal) {
      return insumosAll;
    }
    return insumosAll.map((ins) => ({
      ...ins,
      inventario: Array.isArray(ins.inventario) ?
      ins.inventario.filter(
        (inv) => inv.id_sucursal === sucursalActiva.id_sucursal
      ) :
      ins.inventario
    }));
  }, [insumosAll, rol, sucursalActiva]);

  const insumosBuscadosParaVistas = useMemo(
    () =>
      filterBySearch(insumosFiltradosPorSucursal, inventorySearch, [
        "id_insumo",
        "nombre_insumo",
        "codigo_barra",
        "unidad_de_medida",
        "descripcion",
        "tipo.nombre_tipo",
        "TipoInsumo.nombre_tipo",
        (insumo) =>
          insumo.inventario
            ?.map(
              (item) =>
                item?.sucursal?.nombre ||
                item?.Sucursal?.nombre ||
                item?.nombre_sucursal
            )
            .join(" ")
      ]),
    [insumosFiltradosPorSucursal, inventorySearch]
  );

  const sucursalesParaVistas = useMemo(
    () => rol === "administrador" ? sucursales || [] : [],
    [rol, sucursales]
  );

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const handleVistaSelect = (value) => {
    setVista(value);
    setVistaMenuAnchor(null);
  };

  const handleSearchInputChange = (tipo, value) =>
  setSearchInputs((prev) => ({ ...prev, [tipo]: value }));

  const handleSearch = (tipo, value) =>
  setSearches((prev) => ({
    ...prev,
    [tipo]: String(value ?? searchInputs[tipo] ?? "").trim()
  }));

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
      options: tipoOptions,
      defaultValue: tipoOptions[0]?.value || ""
    }],

    [tipoOptions]
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
        codigo_barra: data.codigo_barra ? data.codigo_barra : null,
        unidad_de_medida: data.unidad_de_medida || null,
        precio: data.precio || null
      };
      await createInsumo(cleanData).unwrap();
      dispatch(
        showNotification({
          message: "Insumo creado con éxito",
          severity: "success"
        })
      );
      setOpenModal(false);
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error: ${error.data?.error}`,
          severity: "error"
        })
      );
    }
  };

  const handleDelete = async () => {
    const idsToDelete = Object.values(selectedRows).
    flat().
    map((id) => Number(id)).
    filter((id) => !isNaN(id));

    if (idsToDelete.length === 0) {
      dispatch(
        showNotification({
          message: "No hay insumos seleccionados para eliminar",
          severity: "warning"
        })
      );
      return;
    }
    try {
      await deleteInsumos({ ids: idsToDelete }).unwrap();
      dispatch(
        showNotification({
          message: "Insumos eliminados con éxito",
          severity: "success"
        })
      );
      setOpenAlert(false);
      setSelectedRows({});
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error: ${error.data?.error}`,
          severity: "error"
        })
      );
    }
  };

  if (isLoadingTipos || loadingSucursales) return <LoaderComponent />;
  if (isErrorTipos) {
    dispatch(
      showNotification({
        message: `Error al cargar insumos ${isErrorTipos}`,
        severity: "error"
      })
    );
    return null;
  }

  return (
    <Box
      sx={{
        mt: "1.5rem",
        mb: "1.5rem",
        p: 2,
        overflow: "hidden"
      }}>
      <Header title="Insumos" subtitle="Gestión de Insumos" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 1.75
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap"
          }}>
          {canDeleteInsumo && (
          isMobile ?
          <IconButton
            aria-label="Eliminar seleccionados"
            disabled={!hasSelected || isDeleting}
            onClick={() => {
              if (hasSelected && !isDeleting) setOpenAlert(true);
            }}
            sx={getActionIconButtonSx(theme, "error", {
              width: 40,
              height: 40,
              minWidth: 40
            })}>

                <DeleteForeverIcon fontSize="small" />
              </IconButton> :

          <DangerActionButton
            label="Eliminar seleccionados"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setOpenAlert(true)}
            disabled={!hasSelected}
            loading={isDeleting} />)

          }
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 1,
            ml: "auto"
          }}>
          <Box
            sx={{
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor:
              theme.palette.mode === "light"
                ? alpha(theme.palette.grey[900], 0.025)
                : alpha(theme.palette.common.white, 0.04),
            boxShadow:
              theme.palette.mode === "light"
                ? "0 10px 24px rgba(15, 23, 42, 0.05)"
                : "0 10px 24px rgba(0,0,0,0.24)",
            width: "fit-content",
            maxWidth: "100%",
            ml: "auto",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1
            }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              justifyContent: "flex-end",
              whiteSpace: "nowrap"
            }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.4
            }}>
            Vista
          </Typography>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDown />}
            onClick={(event) => setVistaMenuAnchor(event.currentTarget)}
            sx={{
              minWidth: 178,
              justifyContent: "space-between",
              borderRadius: 1,
              borderColor: alpha(theme.palette.primary.main, 0.28),
              bgcolor: "background.paper",
              color: "text.primary",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 13,
              px: 1.2,
              py: 0.6,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(15, 23, 42, 0.04)"
                  : "0 4px 12px rgba(0,0,0,0.18)",
              "&:hover": {
                borderColor: alpha(theme.palette.primary.main, 0.46),
                bgcolor:
                  theme.palette.mode === "light"
                    ? alpha(theme.palette.primary.main, 0.04)
                    : alpha(theme.palette.primary.light, 0.08)
              }
            }}>
            {currentView?.label}
          </Button>
          </Box>

          <Menu
            anchorEl={vistaMenuAnchor}
            open={Boolean(vistaMenuAnchor)}
            onClose={() => setVistaMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.5,
                  minWidth: 240,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 16px 36px rgba(15, 23, 42, 0.12)"
                      : "0 16px 36px rgba(0,0,0,0.45)"
                }
              }
            }}>
            {VIEW_OPTIONS.map((option) =>
            <MenuItem
              key={option.value}
              selected={vista === option.value}
              onClick={() => handleVistaSelect(option.value)}
              sx={{
                alignItems: "flex-start",
                borderRadius: 0.75,
                mx: 0.75,
                my: 0.15,
                py: 0.75,
                "&.Mui-selected": {
                  bgcolor:
                    theme.palette.mode === "light"
                      ? alpha(theme.palette.primary.main, 0.08)
                      : alpha(theme.palette.primary.light, 0.12),
                  color: "primary.main",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "light"
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.primary.light, 0.16)
                  }
                }
              }}>
                <ListItemText
                primary={option.label}
                secondary={option.description}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 13.5,
                      fontWeight: 700,
                      lineHeight: 1.25
                    }
                  },
                  secondary: {
                    sx: {
                      fontSize: 11.5,
                      lineHeight: 1.3
                    }
                  }
                }} />
              </MenuItem>
            )}
          </Menu>
          </Box>

          {canCreateInsumo && (
          isMobile ?
          <IconButton
            aria-label="Nuevo insumo"
            onClick={() => setOpenModal(true)}
            sx={getActionIconButtonSx(theme, "primary", {
              width: 40,
              height: 40,
              minWidth: 40
            })}>

                <Add fontSize="small" />
              </IconButton> :

          <PrimaryActionButton
            label="Nuevo insumo"
            startIcon={<Add />}
            onClick={() => setOpenModal(true)} />)

          }
        </Box>
      </Box>

      {vista !== 0 && (
      <Box sx={{ mb: 2, maxWidth: { xs: "100%", sm: 420 }, ml: "auto" }}>
          <SearchBar
          value={inventorySearchInput}
          onChange={setInventorySearchInput}
          onSearch={setInventorySearch}
          placeholder="Buscar insumos por nombre, tipo o código..."
          width={{ xs: "100%", sm: 420 }} />

        </Box>
      )}

      {/* Vista 0: listado por tipo (tu GroupedInsumos actual) */}
      {vista === 0 &&
      <>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "background.paper",
              mb: 2,
              px: 0.5,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 6px 18px rgba(15, 23, 42, 0.04)"
                  : "0 6px 18px rgba(0,0,0,0.2)"
            }}>
            <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              sx: { height: 2, bgcolor: "primary.main" }
            }}
            sx={{
              minHeight: 42,
              "& .MuiTab-root": {
                minHeight: 42,
                px: 1.5,
                textTransform: "none",
                fontWeight: 650,
                fontSize: 13,
                letterSpacing: 0,
                color: "text.secondary",
                borderRadius: 1,
                "&.Mui-selected": {
                  color: "primary.main",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? alpha(theme.palette.primary.main, 0.06)
                      : alpha(theme.palette.primary.light, 0.1)
                }
              }
            }}>

              {tipos.map((tipo, idx) =>
            <Tab label={tipo} key={`${tipo}-${idx}`} />
            )}
            </Tabs>
          </Box>

          {tipos.map((tipo, idx) =>
        <Box
          key={`${tipo}-${idx}`}
          role="tabpanel"
          hidden={tabIndex !== idx}
          sx={{ mt: 2 }}>

              {tabIndex === idx &&
          <GroupedInsumos
            tipo={tipo}
            search={searches[tipo] || ""}
            searchInput={searchInputs[tipo] || ""}
            setSearchInput={(value) =>
            handleSearchInputChange(tipo, value)
            }
            setSearch={(value) => handleSearch(tipo, value)}
            handleEdit={handleEdit}
            setSelectedRows={setSelectedRows}
            isMobile={isMobile} />

          }
            </Box>
        )}
        </>
      }

      {/* Vista 1: Matriz Global (mock) */}
      {vista === 1 && (
      isLoadingAll ?
      <LoaderComponent /> :

      <InventarioMatrizInsumos
        insumos={insumosBuscadosParaVistas}
        sucursales={
        rol === "administrador" ?
        sucursales || [] :
        sucursales?.filter(
          (s) => s.id_sucursal === sucursalActiva?.id_sucursal
        ) || []
        } />)

      }

      {/* Vista 2: Tabs por Sucursal */}
      {vista === 2 && (
      isLoadingAll ?
      <LoaderComponent /> :

      <InventarioTabsInsumosPorSucursal
        insumos={insumosBuscadosParaVistas}
        sucursales={sucursalesParaVistas} />)

      }

      {/* Vista 3: Acordeón por Insumo */}
      {vista === 3 && (
      isLoadingAll ?
      <LoaderComponent /> :

      <InventarioAccordionInsumosPorInsumo
        insumos={insumosBuscadosParaVistas}
        sucursales={sucursalesParaVistas} />)

      }

      <AlertDialog
        openAlert={openAlert}
        title="¿Eliminar Insumo?"
        onConfirm={handleDelete}
        onCloseAlert={() => setOpenAlert(false)}
        message={`¿Está seguro de eliminar ${
        Object.values(selectedRows).flat().length} insumos?`
        } />


      <ModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreate}
        fields={fields}
        title="Añadir Nuevo Insumo"
        isLoading={isCreating} />

    </Box>);

};

export default Insumos;
