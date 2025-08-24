import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateFormulaMutation } from "../../store/services/FormulaProductoApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import ListaInsumos from "../../components/formulas/ListaInsumos";
import ResumenFormula from "../../components/formulas/ResumenFormula";
import SelectorProducto from "../../components/formulas/SelectorProducto";
import BackButton from "../../components/common/BackButton";

const CrearFormula = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nombreFormula, setNombreFormula] = useState("");
  const [productoFinal, setProductoFinal] = useState(null);
  const [cantidadFinal, setCantidadFinal] = useState(1);
  const [insumos, setInsumos] = useState([]);

  const [createFormula, { isLoading }] = useCreateFormulaMutation();

  const handleGuardarFormula = async () => {
    if (!nombreFormula || !productoFinal || insumos.length === 0) {
      dispatch(
        showNotification({
          message: "Completa todos los campos obligatorios",
          severity: "error",
        })
      );
      return;
    }

    try {
      const datos = {
        nombre_formula: nombreFormula,
        id_producto_final: productoFinal.id_producto,
        cantidad_producto_final: cantidadFinal,
        insumos: insumos.map((i) => ({
          id_insumo: i.id_insumo,
          cantidad: i.cantidad,
          unidad_medida: i.unidad_medida,
        })),
      };
      await createFormula(datos).unwrap();
      dispatch(
        showNotification({
          message: "Fórmula creada exitosamente",
          severity: "success",
        })
      );
      navigate("/formulas");
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear la fórmula: ${error.data?.message}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: { xs: 2, md: 5 },
        borderRadius: 4,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          mb: 2,
          minHeight: 40, 
        }}
      >
        <Box sx={{ justifySelf: "start" }}>
          <BackButton to="/formulas" label="Volver" />
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ gridColumn: 2, textAlign: "center" }}
        >
          🛠️ Crear nueva fórmula
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Nombre de la Fórmula"
            value={nombreFormula}
            onChange={(e) => setNombreFormula(e.target.value)}
            required
          />
          <Box mt={2}>
            <SelectorProducto
              label="Selecciona el Producto Final"
              onProductoSeleccionado={setProductoFinal}
              productoSeleccionado={productoFinal}
            />
          </Box>
          {productoFinal && (
            <Box
              mt={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                backgroundColor: (theme) => theme.palette.background.paper,
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Cantidad de &quot;{productoFinal.nombre_producto}&quot;
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setCantidadFinal((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                  sx={{ minWidth: 40, minHeight: 40, borderRadius: "50%" }}
                >
                  −
                </Button>

                <TextField
                  type="number"
                  value={cantidadFinal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCantidadFinal(val >= 1 ? val : 1);
                  }}
                  inputProps={{ min: 1 }}
                  sx={{ width: 80, textAlign: "center" }}
                  size="small"
                />

                <Button
                  variant="outlined"
                  onClick={() => setCantidadFinal((prev) => prev + 1)}
                  sx={{ minWidth: 40, minHeight: 40, borderRadius: "50%" }}
                >
                  +
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                {[10, 50, 100].map((val) => (
                  <Button
                    key={val}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => setCantidadFinal((prev) => prev + val)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      px: 2,
                      minWidth: 60,
                    }}
                  >
                    +{val}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <ResumenFormula
            productoFinal={productoFinal}
            cantidadFinal={cantidadFinal}
            cantidadInsumos={insumos.length}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <ListaInsumos insumos={insumos} setInsumos={setInsumos} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleGuardarFormula}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? "Guardando..." : "Guardar Fórmula"}
        </Button>
      </Box>
    </Paper>
  );
};

export default CrearFormula;
