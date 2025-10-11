import * as React from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/common/Header";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import {
  useCreateCategoriaGastoMutation,
  useDeleteCategoriaGastoMutation,
  useGetAllCategoriasGastoQuery,
  useUpdateCategoriaGastoMutation,
} from "../../store/services/categoriaGastoApi";
import CategoriaGastoCard from "../../components/categorias_gasto/CategoriaGastoCard";
import CategoriaGastoDialog from "../../components/categorias_gasto/CategoriaGastoDialog";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const TIPOS_CATEGORIA = [
  { id: "", label: "Todos" },
  { id: "operativo", label: "Operativo" },
  { id: "personal", label: "Personal" },
  { id: "financiero", label: "Financiero" },
  { id: "impuestos", label: "Impuestos" },
  { id: "logistica", label: "Logística" },
  { id: "otros", label: "Otros" },
];

export default function CategoriaGastoManagement() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [search, setSearch] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [deducible, setDeducible] = React.useState("all"); // 'all' | 'si' | 'no'
  const [soloActivos, setSoloActivos] = React.useState(true);

  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    const id = setTimeout(() => setQ(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const params = React.useMemo(() => {
    const p = { page: 1, limit: 50 };
    if (q) p.search = q;
    if (tipo) p.tipo_categoria = tipo;
    if (deducible !== "all") p.deducible = deducible === "si";
    if (soloActivos) p.activo = true;
    return p;
  }, [q, tipo, deducible, soloActivos]);

  const { data, isLoading, isError, refetch } =
    useGetAllCategoriasGastoQuery(params);

  useRegisterRefresh(
    "categorias-gastos",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  const categorias = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.items || [];
  }, [data]);

  const [openDlg, setOpenDlg] = React.useState(false);
  const [editItem, setEditItem] = React.useState(null);

  const [createCat, { isLoading: creating }] =
    useCreateCategoriaGastoMutation();
  const [updateCat, { isLoading: updating }] =
    useUpdateCategoriaGastoMutation();
  const [deleteCat, { isLoading: deleting }] =
    useDeleteCategoriaGastoMutation();

  const openCreate = () => {
    setEditItem(null);
    setOpenDlg(true);
  };
  const openEdit = (cat) => {
    setEditItem(cat);
    setOpenDlg(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editItem) {
        await updateCat({
          id: editItem.id_categoria_gasto || editItem.id,
          ...payload,
        }).unwrap();
        dispatch(
          showNotification({
            message: "Categoría actualizada",
            severity: "success",
          })
        );
      } else {
        await createCat(payload).unwrap();
        dispatch(
          showNotification({
            message: "Categoría creada",
            severity: "success",
          })
        );
      }
      setOpenDlg(false);
      setEditItem(null);
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo guardar la categoría",
          severity: "error",
        })
      );
    }
  };

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);
  const askDelete = (cat) => {
    setToDelete(cat);
    setConfirmOpen(true);
  };
  const doDelete = async () => {
    try {
      const id = toDelete?.id_categoria_gasto || toDelete?.id;
      await deleteCat(id).unwrap();
      dispatch(
        showNotification({
          message: "Categoría eliminada",
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
          title="Categorías de Gasto"
          subtitle="Gestión de categorías de gasto"
        />
        <Typography color="error" sx={{ mt: 2 }}>
          Error al cargar categorías.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Header
        title="Categorías de Gasto"
        subtitle="Gestión de categorías de gasto"
      />

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
            placeholder="Buscar por nombre o descripción…"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="tipo-cat-filter">Tipo</InputLabel>
            <Select
              labelId="tipo-cat-filter"
              value={tipo}
              label="Tipo"
              onChange={(e) => setTipo(e.target.value)}
            >
              {TIPOS_CATEGORIA.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            exclusive
            value={deducible}
            onChange={(_, v) => v && setDeducible(v)}
            size="small"
          >
            <ToggleButton value="all">Todos</ToggleButton>
            <ToggleButton value="si">Deducible</ToggleButton>
            <ToggleButton value="no">No deducible</ToggleButton>
          </ToggleButtonGroup>

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
          onClick={openCreate}
          sx={{ alignSelf: { xs: "stretch", md: "center" } }}
        >
          Nueva Categoría
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {categorias.map((cat) => (
          <Grid
            item
            key={cat.id_categoria_gasto || cat.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <CategoriaGastoCard
              categoria={cat}
              onEdit={() => openEdit(cat)}
              onDelete={() => askDelete(cat)}
            />
          </Grid>
        ))}
        {categorias.length === 0 && (
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
                No hay categorías con los filtros actuales.
              </Typography>
              <Button variant="outlined" onClick={() => setSearch("")}>
                Limpiar filtros
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <CategoriaGastoDialog
        open={openDlg}
        initialData={editItem}
        onClose={() => {
          setOpenDlg(false);
          setEditItem(null);
        }}
        onSubmit={handleSubmit}
        isSaving={creating || updating}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Seguro que deseas eliminar{" "}
            <b>{toDelete?.nombre || "esta categoría"}</b>? Esta acción no se
            puede deshacer.
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
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
