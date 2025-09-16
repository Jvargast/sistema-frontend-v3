import { Box, Grid, Stack, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { showNotification } from "../../store/reducers/notificacionSlice";
import {
  selectScope,
  selectActiveSucursalId,
} from "../../store/reducers/scopeSlice";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import SucursalPickerHeader from "../../components/common/SucursalPickerHeader";
import useCompraForm from "../../hooks/useCompraForm";
import CompraHeaderCard from "../../components/compras/CompraHeaderCard";
import CompraItemsTable from "../../components/compras/CompraItemsTable";
import CompraTotals from "../../components/compras/CompraTotals";
import { useCreateCompraMutation } from "../../store/services/compraApi";
import { useEffect } from "react";

export default function RegistrarCompra() {
  const dispatch = useDispatch();
  const { mode } = useSelector(selectScope);
  const activeSucursalId = useSelector(selectActiveSucursalId);
  const { data: sucursales = [] } = useGetAllSucursalsQuery();

  const {
    header,
    setHeader,
    setProveedor,
    setSucursal,
    items,
    addItem,
    updateItem,
    removeItem,
    resumen,
    canSave,
    payload,
    reset,
  } = useCompraForm();

  const canChooseSucursal = mode === "global";
  useEffect(() => {
    if (!canChooseSucursal) setSucursal(activeSucursalId ?? null);
    //eslint-disable-next-line
  }, [canChooseSucursal, activeSucursalId]);

  const [createCompra, { isLoading: isSaving }] = useCreateCompraMutation();

  const handleSubmit = async () => {
    if (!header.id_proveedor) {
      dispatch(
        showNotification({
          message: "Selecciona un proveedor.",
          severity: "warning",
        })
      );
      return;
    }
    if (!items?.length) {
      dispatch(
        showNotification({
          message: "Agrega al menos un ítem.",
          severity: "warning",
        })
      );
      return;
    }
    try {
      await createCompra(payload).unwrap();
      console.log(payload)
      dispatch(
        showNotification({ message: "Compra registrada", severity: "success" })
      );
      reset();
    } catch (err) {
      const msg = err?.data?.error || "No se pudo registrar la compra";
      dispatch(showNotification({ message: msg, severity: "error" }));
    }
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
      <Header title="Registrar Compra" subtitle="Gestión de Compras" />

      <SucursalPickerHeader
        sucursales={sucursales || []}
        idSucursal={header.id_sucursal}
        canChoose={canChooseSucursal}
        onChange={(id) => setSucursal(Number(id))}
        nombreSucursal={
          (sucursales || []).find(
            (s) => Number(s.id_sucursal) === Number(header.id_sucursal)
          )?.nombre
        }
      />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <CompraHeaderCard
            header={header}
            setHeader={setHeader}
            onProveedor={setProveedor}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack
            spacing={2}
            sx={{
              position: { md: "sticky" },
              top: { md: 88 },
            }}
          >
            <CompraTotals resumen={resumen} />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!canSave || isSaving}
            >
              {isSaving ? "Guardando…" : "Registrar compra"}
            </Button>
            <Button variant="outlined" onClick={reset}>
              Limpiar
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <CompraItemsTable
            items={items}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
