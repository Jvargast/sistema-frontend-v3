import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Stack,
  TextField,
  useTheme,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  useGetFormulaByIdQuery,
  useUpdateFormulaMutation,
} from "../../store/services/FormulaProductoApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import FormulaDisplay from "../../components/formulas/FormulaDisplay";
import useSucursalActiva from "../../hooks/useSucursalActiva";

const VerFormula = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const sucursalActiva = useSucursalActiva();
  const idSucursal = sucursalActiva?.id_sucursal ?? sucursalActiva?.id ?? null;

  const [updateFormula, { isLoading: saving }] = useUpdateFormulaMutation();
  const {
    data: formula,
    isLoading,
    error,
    refetch,
  } = useGetFormulaByIdQuery(
    { id: Number(id) },
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );
  const [isEditing, setIsEditing] = useState(false);

  const [nombreFormula, setNombreFormula] = useState("");
  const [productoFinal, setProductoFinal] = useState(null);
  const [cantidadFinal, setCantidadFinal] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    if (formula) {
      setNombreFormula(formula.nombre_formula);
      setProductoFinal(formula.Producto);
      setCantidadFinal(
        formula.cantidad_producto_final ?? formula.cantidad_requerida ?? 0
      );

      const adaptados = (formula.FormulaProductoDetalles ?? []).map((d) => ({
        id_formula_detalle: d.id_formula_detalle,
        nombre: d.Insumo?.nombre_insumo,
        cantidad: d.cantidad ?? d.cantidad_requerida ?? 0,
        descripcion: d.unidad_medida ?? d.unidad_de_medida ?? "u.",
        objetoSeleccionado: d.Insumo,
      }));

      setInsumos(adaptados);
    }
  }, [formula]);

  const estaActiva = Boolean(formula?.activo);

  const construirPayload = () => ({
    id: formula.id_formula,
    nombre_formula: nombreFormula.trim(),
    id_producto_final: productoFinal.id_producto,
    cantidad_producto_final: Number(cantidadFinal) || 0,
    insumos: insumos.map((i) => ({
      id_insumo: i.objetoSeleccionado.id_insumo,
      cantidad: Number(i.cantidad) || 0,
      unidad_medida: i.descripcion,
    })),
  });

  const handleReactivate = async () => {
    try {
      setReactivating(true);
      await updateFormula({ id: formula.id_formula, activo: true }).unwrap();
      dispatch(
        showNotification({
          message: "Fórmula reactivada.",
          severity: "success",
        })
      );
      await refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message:
            err?.data?.error || err?.data?.message || "No se pudo reactivar",
          severity: "error",
        })
      );
    } finally {
      setReactivating(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateFormula(construirPayload()).unwrap();
      dispatch(
        showNotification({
          message: "Fórmula actualizada.",
          severity: "success",
        })
      );
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error(err);
      dispatch(
        showNotification({
          message: err?.data?.message || "Error al actualizar",
          severity: "error",
        })
      );
    }
  };

  const handleAddInsumo = () => {
    setInsumos((prev) => [
      ...prev,
      {
        id_formula_detalle: `tmp-${Date.now()}`,
        nombre: "",
        cantidad: 0,
        descripcion: "u.",
        objetoSeleccionado: null,
      },
    ]);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !formula) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">Error al cargar la fórmula.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: 900, md: 1100 },
        mx: "auto",
        p: 4,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: "none", fontWeight: "bold" }}
          onClick={() => navigate("/formulas")}
        >
          Volver a Lista
        </Button>

        {isEditing ? (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              sx={{ textTransform: "none" }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando…" : "Guardar"}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<CancelIcon />}
              sx={{ textTransform: "none" }}
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        )}
      </Stack>
      <Divider sx={{ mb: 3 }} />
      {!estaActiva && (
        <Alert
          severity="warning"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button
              onClick={handleReactivate}
              size="small"
              variant="outlined"
              disabled={reactivating}
            >
              {reactivating ? "Reactivando…" : "Reactivar"}
            </Button>
          }
        >
          Esta fórmula está deshabilitada. Puedes reactivarla para volver a
          usarla.
        </Alert>
      )}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "primary.main", textAlign: "center" }}
      >
        🛠️ Fórmula #{formula.id_formula}
      </Typography>
      <Box textAlign="center" mb={2}>
        {isEditing ? (
          <TextField
            label="Nombre de la fórmula"
            value={nombreFormula}
            onChange={(e) => setNombreFormula(e.target.value)}
            fullWidth
          />
        ) : (
          <Typography variant="h5">
            <Box component="span" fontWeight="bold">
              Nombre:
            </Box>{" "}
            {nombreFormula}
          </Typography>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />
      <FormulaDisplay
        insumos={insumos}
        productoFinal={productoFinal}
        cantidadFinal={cantidadFinal}
        editable={isEditing}
        onInsumoChange={(idx, nuevo) =>
          setInsumos((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, ...nuevo } : item))
          )
        }
        onInsumoDelete={(idx) =>
          setInsumos((prev) => prev.filter((_, i) => i !== idx))
        }
        onProductoChange={({ nombre, cantidad, objetoSeleccionado }) => {
          if (objetoSeleccionado) setProductoFinal(objetoSeleccionado);
          if (cantidad !== undefined) setCantidadFinal(cantidad);
          if (nombre)
            setProductoFinal((prev) => ({
              ...prev,
              nombre_producto: nombre,
            }));
        }}
        idSucursal={idSucursal}
        onInsumoAdd={handleAddInsumo}
      />
    </Box>
  );
};

export default VerFormula;
