import * as React from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/common/Header";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import {
  useGetAllCentrosCostoQuery,
  useCreateCentroCostoMutation,
  useUpdateCentroCostoMutation,
  useDeleteCentroCostoMutation,
} from "../../store/services/centroCostoApi";
import { selectScope } from "../../store/reducers/scopeSlice";
import CentroCostoCard from "../../components/centro_de_costos/CentroCostoCard";
import CentroCostoDialog from "../../components/centro_de_costos/CentroCostoDialog";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";

export default function CentroCostoManagement() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { mode, activeSucursalId } = useSelector(selectScope);

  const { data: sucData, isFetching: loadingSuc } = useGetAllSucursalsQuery();

  const sucursales = React.useMemo(() => {
    if (!sucData) return [];
    return Array.isArray(sucData)
      ? sucData
      : sucData.items || sucData.sucursales || [];
  }, [sucData]);

  const [search, setSearch] = React.useState("");
  const [soloActivos, setSoloActivos] = React.useState(true);
  const [sucursalSel, setSucursalSel] = React.useState(null);

  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    const id = setTimeout(() => setQ(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const params = React.useMemo(() => {
    const p = { page: 1, limit: 50 };
    if (q) p.search = q;
    if (soloActivos) p.activo = true;
    if (sucursalSel?.id_sucursal)
      p.id_sucursal = Number(sucursalSel.id_sucursal);
    if (mode !== "global" && activeSucursalId != null) {
      p.id_sucursal = Number(activeSucursalId);
    }
    return p;
  }, [q, soloActivos, sucursalSel, mode, activeSucursalId]);

  const { data, isLoading, isError, refetch } =
    useGetAllCentrosCostoQuery(params);

  const centros = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.items || data.centros || [];
  }, [data]);

  const [openDlg, setOpenDlg] = React.useState(false);
  const [editItem, setEditItem] = React.useState(null);

  const openCreate = (e) => {
    e?.currentTarget?.blur?.();
    setEditItem(null);
    setOpenDlg(true);
  };
  const openEdit = (cc, e) => {
    e?.currentTarget?.blur?.();
    setEditItem(cc);
    setOpenDlg(true);
  };

  const [createCC, { isLoading: creating }] = useCreateCentroCostoMutation();
  const [updateCC, { isLoading: updating }] = useUpdateCentroCostoMutation();
  const [deleteCC, { isLoading: deleting }] = useDeleteCentroCostoMutation();

  const shouldRefetch = React.useRef(false);

  const handleSubmit = async (payload) => {
    try {
      if (editItem?.id_centro_costo) {
        await updateCC({ id: editItem.id_centro_costo, ...payload }).unwrap();
        dispatch(
          showNotification({
            message: "Centro de Costo actualizado",
            severity: "success",
          })
        );
      } else {
        await createCC(payload).unwrap();
        dispatch(
          showNotification({
            message: "Centro de Costo creado",
            severity: "success",
          })
        );
      }
      shouldRefetch.current = true;
      setOpenDlg(false);
      setEditItem(null);
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo guardar el Centro de Costo",
          severity: "error",
        })
      );
    }
  };

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);
  const askDelete = (cc, e) => {
    e?.currentTarget?.blur?.();
    setToDelete(cc);
    setConfirmOpen(true);
  };
  const doDelete = async () => {
    try {
      await deleteCC(toDelete.id_centro_costo || toDelete.id).unwrap();
      dispatch(
        showNotification({
          message: "Centro de Costo eliminado",
          severity: "success",
        })
      );
      setConfirmOpen(false);
      setToDelete(null);
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo eliminar",
          severity: "error",
        })
      );
    }
  };

  if (isLoading) return <LoaderComponent />;

  if (isError) {
    return (
      <Box p={3}>
        <Header
          title="Centros de Costo"
          subtitle="Gestión de Centros de Costo"
        />
        <Typography color="error" sx={{ mt: 2 }}>
          Error al cargar centros de costo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Header title="Centros de Costo" subtitle="Gestión de Centros de Costo" />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flex={1}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o tipo…"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
            }}
          />

          <Autocomplete
            options={sucursales}
            loading={loadingSuc}
            value={sucursalSel}
            onChange={(_, v) => setSucursalSel(v)}
            getOptionLabel={(o) =>
              o?.nombre || `Sucursal ${o?.id_sucursal || ""}`
            }
            renderInput={(p) => <TextField {...p} label="Sucursal" />}
            sx={{ minWidth: 240 }}
            disabled={mode !== "global"}
          />

          <FormControlLabel
            control={
              <Switch
                checked={soloActivos}
                onChange={(_, v) => setSoloActivos(v)}
                size="small"
              />
            }
            label="Solo activos"
            sx={{ ml: { xs: 0, sm: 1 } }}
          />
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={(e) => openCreate(e)}
          sx={{ alignSelf: { xs: "stretch", md: "center" } }}
        >
          Nuevo Centro de Costo
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {centros.map((cc) => (
          <Grid
            item
            key={cc.id_centro_costo || cc.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex" }}
          >
            <CentroCostoCard
              centro={cc}
              sucursalNombre={
                cc?.sucursal?.nombre ||
                sucursales.find(
                  (s) => Number(s.id_sucursal) === Number(cc.id_sucursal)
                )?.nombre
              }
              onEdit={(e) => openEdit(cc, e)}
              onDelete={(e) => askDelete(cc, e)}
            />
          </Grid>
        ))}

        {centros.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`,
                textAlign: "center",
              }}
            >
              <Typography sx={{ mb: 1.5 }}>
                No hay centros con los filtros actuales.
              </Typography>
              <Button variant="outlined" onClick={() => setSearch("")}>
                Limpiar filtros
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <CentroCostoDialog
        open={openDlg}
        initialData={editItem}
        onClose={() => {
          setOpenDlg(false);
          setEditItem(null);
        }}
        onSubmit={handleSubmit}
        isSaving={creating || updating}
        sucursales={sucursales}
        mode={mode}
        activeSucursalId={activeSucursalId}
        onExited={() => {
          if (shouldRefetch.current) {
            shouldRefetch.current = false;
            refetch();
          }
        }}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Eliminar Centro de Costo</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Seguro que deseas eliminar{" "}
            <b>{toDelete?.nombre || "este centro"}</b>? Esta acción no se puede
            deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={doDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
