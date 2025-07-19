import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import IndicadoresPanel from "../../components/produccion/IndicadoresPanel";
import {
  useGetAllFormulasQuery,
  useGetFormulaByIdQuery,
} from "../../store/services/FormulaProductoApi";
import ResumenLote from "../../components/produccion/ResumenLote";
import AutocompleteGenerico from "../../components/produccion/AutoCompleteGenerico";
import PreviewFormula from "../../components/formulas/PreviewFormula";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateProduccionMutation } from "../../store/services/produccionApi";
import Header from "../../components/common/Header";

const steps = [
  "Seleccionar fórmula",
  "Cantidad de lote",
  "Revisar insumos",
  "Confirmación",
];

const PanelProduccion = () => {
  //const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formulaSel, setFormulaSel] = useState(null);
  const [cantLote, setCantLote] = useState(1);

  const { data: formulaDetalle, isFetching } = useGetFormulaByIdQuery(
    formulaSel?.id_formula,
    { skip: !formulaSel, refetchOnMountOrArgChange: true }
  );
  const { data: formulasResp, isFetching: loadingFormulas } =
    useGetAllFormulasQuery({ limit: 1000 });
  const [crearProduccion, { isLoading: procesando }] =
    useCreateProduccionMutation();

  const formulas = formulasResp?.formulas ?? [];

  const unidadesSalida = useMemo(() => {
    const rendimiento = Number(formulaDetalle?.cantidad_requerida) || 0;
    return rendimiento * cantLote;
  }, [formulaDetalle, cantLote]);

  const insumos = useMemo(() => {
    if (!formulaDetalle) return [];
    return formulaDetalle.FormulaProductoDetalles.map((d) => ({
      id: d.id_insumo,
      nombre: d.Insumo?.nombre_insumo ?? "—",
      unidad: d.unidad_de_medida || "u.",
      stock: Number(d.Insumo?.inventario?.cantidad) || 0,
      requerido: Number(d.cantidad_requerida) * cantLote,
    }));
  }, [formulaDetalle, cantLote]);

  const stockOk = insumos.every((i) => i.stock >= i.requerido);

  const next = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  const buildPayload = () => ({
    id_formula: formulaSel.id_formula,
    insumos_consumidos: insumos.map((i) => ({
      id_insumo: i.id,
      cantidad: i.requerido,
      unidad: i.unidad,
    })),
    cantidad_lote: cantLote,
  });

  const ejecutarProduccion = async () => {
    try {
      await crearProduccion(buildPayload()).unwrap();
      console.log(buildPayload())
      dispatch(
        showNotification({
          message: "Producción registrada con éxito",
          severity: "success",
        })
      );
      navigate("/produccion/historial");
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.message || "Error al registrar la producción",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Header title="Registro de Producción" subtitle="Proceso Productivo" />
      </Stack>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((l) => (
          <Step key={l}>
            <StepLabel>{l}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selecciona la fórmula a producir
            </Typography>
            <AutocompleteGenerico
              options={formulas}
              isLoading={loadingFormulas}
              getLabel={(f) => f.nombre_formula}
              optionRenderer={(listProps, option, key) => (
                <Box
                  component="li"
                  key={key}
                  {...listProps}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, width: 40, color: "text.secondary" }}
                  >
                    {option.id_formula}
                  </Typography>
                  <Typography variant="body2">
                    {option.nombre_formula}
                  </Typography>
                </Box>
              )}
              onSelect={setFormulaSel}
              labelInput="Buscar fórmula"
              size="small"
              defaultValue={formulaSel}
            />
            {isFetching && formulaSel && (
              <Box mt={2} display="flex" justifyContent="center">
                <CircularProgress size={24} />
              </Box>
            )}

            <Collapse
              in={Boolean(formulaSel && formulaDetalle)}
              timeout={300}
              unmountOnExit
              mountOnEnter
            >
              <Box mt={3}>
                <PreviewFormula formulaDetalle={formulaDetalle} />
              </Box>
            </Collapse>

            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Button variant="contained" disabled={!formulaSel} onClick={next}>
                Siguiente
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card elevation={4}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              textAlign="center"
              sx={{ color: (t) => t.palette.primary.main }}
            >
              ¿Cuántas unidades deseas fabricar?
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                justifyContent="center"
                gap={2}
                sx={(t) => ({
                  bgcolor:
                    t.palette.mode === "light"
                      ? t.palette.grey[100]
                      : t.palette.grey[900],
                  p: 2,
                  borderRadius: 3,
                  width: { xs: "100%", sm: "auto" },
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <IconButton
                  size="large"
                  color="primary"
                  sx={(t) => ({
                    border: `1px solid ${t.palette.primary.main}`,
                    color: t.palette.primary.main,
                    "&:hover": {
                      bgcolor: t.palette.action.hover,
                    },
                  })}
                  onClick={() => setCantLote((v) => Math.max(1, v - 1))}
                >
                  −
                </IconButton>

                <TextField
                  type="number"
                  value={cantLote}
                  onChange={(e) =>
                    setCantLote(Math.max(1, Number(e.target.value) || 1))
                  }
                  inputProps={{
                    min: 1,
                    style: { textAlign: "center", fontSize: 28 },
                  }}
                  sx={{
                    width: 140,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />

                <IconButton
                  size="large"
                  color="primary"
                  sx={(t) => ({
                    border: `1px solid ${t.palette.primary.main}`,
                    color: t.palette.primary.main,
                    "&:hover": {
                      bgcolor: t.palette.action.hover,
                    },
                  })}
                  onClick={() => setCantLote((v) => v + 1)}
                >
                  +
                </IconButton>
              </Stack>
            </Box>

            <Box mt={2} display="flex" justifyContent="center">
              <Stack direction="row" spacing={1.5}>
                {[10, 50, 100].map((v) => (
                  <Button
                    key={v}
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => setCantLote((n) => n + v)}
                    sx={(t) => ({
                      fontWeight: 600,
                      minWidth: 64,
                      bgcolor: t.palette.secondary.main,
                      "&:hover": { bgcolor: t.palette.secondary.dark },
                    })}
                  >
                    +{v}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="space-between" mt={4}>
              <Button
                variant="outlined"
                onClick={back}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Atrás
              </Button>
              <Button
                variant="contained"
                onClick={next}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Siguiente
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && (
        <Card elevation={4}>
          <CardContent>
            {isFetching ? (
              <CircularProgress />
            ) : (
              <>
                <IndicadoresPanel insumos={insumos} />

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Button variant="outlined" onClick={back}>
                    Atrás
                  </Button>
                  <Button
                    variant="contained"
                    onClick={next}
                    disabled={!stockOk}
                  >
                    {stockOk ? "Siguiente" : "Falta stock"}
                  </Button>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeStep === 3 && (
        <Card elevation={4}>
          <CardContent>
            <ResumenLote
              insumos={insumos}
              productoFinal={formulaSel?.Producto?.nombre_producto}
              cantidadFinal={unidadesSalida}
            />

            <Stack direction="row" justifyContent="space-between" mt={3}>
              <Button variant="outlined" onClick={back}>
                Atrás
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<DoneAllIcon />}
                onClick={ejecutarProduccion}
                disabled={procesando}
              >
                {procesando ? "Procesando…" : "Fabricar lote"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PanelProduccion;
