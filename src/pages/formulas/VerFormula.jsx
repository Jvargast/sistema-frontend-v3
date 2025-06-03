import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  useGetFormulaByIdQuery,
  useUpdateFormulaMutation,
} from "../../store/services/FormulaProductoApi";
import ElementoDetalle from "../../components/formulas/ElementoDetalle";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const VerFormula = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateFormula, { isLoading: saving }] = useUpdateFormulaMutation();
  const {
    data: formula,
    isLoading,
    error,
    refetch,
  } = useGetFormulaByIdQuery(id);
  const [isEditing, setIsEditing] = useState(false);

  const [nombreFormula, setNombreFormula] = useState("");
  const [productoFinal, setProductoFinal] = useState(null);
  const [cantidadFinal, setCantidadFinal] = useState(null);
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    if (formula) {
      setNombreFormula(formula.nombre_formula);
      setProductoFinal(formula.Producto);
      setCantidadFinal(formula.cantidad_requerida);

      const adaptados = formula.FormulaProductoDetalles.map((d) => ({
        id_formula_detalle: d.id_formula_detalle,
        nombre: d.Insumo?.nombre_insumo,
        cantidad: d.cantidad_requerida,
        descripcion: d.unidad_de_medida || "u.",
        objetoSeleccionado: d.Insumo,
      }));

      setInsumos(adaptados);
    }
  }, [formula]);

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
        backgroundColor: "background.default",
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={2}>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: { xs: "nowrap", md: "nowrap" },
          alignItems: { xs: "center", md: "flex-start" },
          gap: 2,
        }}
      >
        {isEditing && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              setInsumos((prev) => [
                ...prev,
                {
                  id_formula_detalle: undefined, // ← nuevo
                  nombre: "",
                  cantidad: 1,
                  descripcion: "u.",
                  objetoSeleccionado: null,
                },
              ])
            }
            sx={{
              alignSelf: { xs: "center", md: "flex-start" },
              mb: { xs: 1, md: 0 },
              textTransform: "none",
            }}
          >
            Añadir insumo
          </Button>
        )}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            flex: "1 1 0",
          }}
        >
          {insumos.map((det, idx) => (
            <React.Fragment key={det.id_formula_detalle ?? idx}>
              <Box
                sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}
              >
                <ElementoDetalle
                  editable={isEditing}
                  tipo="Insumo"
                  nombre={det.nombre}
                  cantidad={det.cantidad}
                  descripcion={det.descripcion}
                  objetoSeleccionado={det.objetoSeleccionado}
                  onChange={(nuevo) =>
                    setInsumos((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, ...nuevo } : item
                      )
                    )
                  }
                  onDelete={() =>
                    setInsumos((prev) => prev.filter((_, i) => i !== idx))
                  }
                />

                {!isEditing && idx < insumos.length - 1 && (
                  <AddIcon
                    sx={{
                      fontSize: 34,
                      color: "text.secondary",
                      alignSelf: "center",
                      display: { xs: "none", md: "inline-flex" },
                    }}
                  />
                )}
              </Box>
            </React.Fragment>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            mt: { xs: 2, md: 0 },
            alignSelf: { xs: "center", md: "flex-start" },
          }}
        >
          {!isEditing && (
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                mb: { xs: 1, md: 0 },
              }}
            >
              =
            </Typography>
          )}

          <ElementoDetalle
            editable={isEditing}
            tipo="Producto"
            nombre={
              (productoFinal && productoFinal.nombre_producto) ||
              formula.Producto?.nombre_producto
            }
            cantidad={cantidadFinal ?? formula.cantidad_requerida}
            descripcion="unidad"
            onChange={({ nombre, cantidad, objetoSeleccionado }) => {
              if (objetoSeleccionado) setProductoFinal(objetoSeleccionado);
              if (cantidad !== undefined) setCantidadFinal(cantidad);
              if (nombre)
                setProductoFinal((prev) => ({
                  ...prev,
                  nombre_producto: nombre,
                }));
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VerFormula;
