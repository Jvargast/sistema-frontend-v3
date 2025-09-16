import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import GastoForm from "../../components/gastos/GastoForm";
import { useCreateGastoMutation } from "../../store/services/gastoApi";
import useGastoForm from "../../hooks/useGastoForm";
import { showNotification } from "../../store/reducers/notificacionSlice";
import {
  selectScope,
  selectActiveSucursalId,
} from "../../store/reducers/scopeSlice";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import SucursalPickerHeader from "../../components/common/SucursalPickerHeader";
import { useEffect, useMemo, useState } from "react";

export default function RegistrarGasto() {
  const dispatch = useDispatch();
  const { mode } = useSelector(selectScope);
  const activeSucursalId = useSelector(selectActiveSucursalId);
  const { data: sucursales = [] } = useGetAllSucursalsQuery();

  const [idSucursal, setIdSucursal] = useState(null);

  useEffect(() => {
    if (mode !== "global") {
      setIdSucursal(activeSucursalId ?? null);
    } else if (!idSucursal && activeSucursalId) {
      setIdSucursal(activeSucursalId);
    }
  }, [mode, activeSucursalId]); // eslint-disable-line

  const canChooseSucursal = mode === "global";

  const {
    form,
    onChange,
    addFiles,
    removeAdjunto,
    netoIvaTotal,
    canSave,
    payload,
    reset,
  } = useGastoForm();

  const [createGasto, { isLoading: isSaving }] = useCreateGastoMutation();

  const canSubmit = canSave && !!idSucursal && !!form.id_centro_costo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idSucursal) {
      dispatch(
        showNotification({
          message: "Debes seleccionar una sucursal para registrar el gasto.",
          severity: "warning",
        })
      );
      return;
    }
    try {
      await createGasto({
        ...payload,
        id_sucursal: Number(idSucursal),
      }).unwrap();
      dispatch(
        showNotification({
          message: "Gasto registrado con éxito",
          severity: "success",
        })
      );
      reset();
    } catch (err) {
      const msg = err?.data?.error || "No se pudo registrar el gasto";
      dispatch(showNotification({ message: msg, severity: "error" }));
    }
  };

  const sucursalActual = useMemo(
    () =>
      (sucursales || []).find(
        (s) => Number(s.id_sucursal) === Number(idSucursal)
      ) || null,
    [sucursales, idSucursal]
  );

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
      <Header title="Registrar Gasto" subtitle="Gestión de Gastos" />

      <SucursalPickerHeader
        sucursales={sucursales || []}
        idSucursal={idSucursal}
        canChoose={canChooseSucursal}
        onChange={(id) => setIdSucursal(Number(id))}
        nombreSucursal={sucursalActual?.nombre}
      />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <GastoForm
            form={form}
            onChange={onChange}
            addFiles={addFiles}
            removeAdjunto={removeAdjunto}
            netoIvaTotal={netoIvaTotal}
            canSave={canSubmit}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onReset={() => {
              reset();
              if (mode === "global") setIdSucursal(null);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
