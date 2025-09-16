import { useState } from "react";
import { Box, Grid, Snackbar, Alert, useTheme } from "@mui/material";
import Header from "../../components/common/Header";
import useProveedorForm from "../../hooks/useProveedorForm";
import { useCreateProveedorMutation } from "../../store/services/proveedorApi";
import ProveedorForm from "../../components/proveedores/ProveedorForm";
import ProveedorPreview from "../../components/proveedores/ProveedorPreview";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const CrearProveedor = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { form, setForm, onChange, reset, rutState, telState, isDuplicado, baseCanSave } =
    useProveedorForm();
  const [createProveedor, { isLoading: isSaving }] =
    useCreateProveedorMutation();

  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    msg: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProveedor(form).unwrap();
      dispatch(
        showNotification({
          message: "Proveedor creado con éxito",
          severity: "success",
        })
      );
      reset();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo crear el proveedor",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
      <Header title="Nuevo Proveedor" subtitle="Gestión de Proveedores" />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ProveedorForm
            form={form}
            onChange={onChange}
            rutState={rutState}
            telState={telState}
            isDuplicado={isDuplicado}
            canSave={baseCanSave && !isSaving}
            isSaving={isSaving}
            onReset={reset}
            onSubmit={handleSubmit}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ProveedorPreview form={form} setForm={setForm} theme={theme} />
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CrearProveedor;
