import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

import { formatCLP } from "../../utils/formatUtils";
import {
  useGetGastoByIdQuery,
  useUpdateGastoMutation,
  useDeleteGastoMutation,
  useDeleteGastoAdjuntoMutation,
} from "../../store/services/gastoApi";
import { useGetAllCategoriasGastoQuery } from "../../store/services/categoriaGastoApi";
import { useLazyGetAllProveedoresQuery } from "../../store/services/proveedorApi";
import { useGetAllCentrosCostoQuery } from "../../store/services/centroCostoApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { diff } from "../../utils/gastoUtils";
import GastoHeader from "../../components/gastos/GastoHeader";
import GastoOverview from "../../components/gastos/GastoOverview";
import GastoDetailView from "../../components/gastos/GastoDetailView";
import GastoEditForm from "../../components/gastos/GastoEditForm";
import GastoAdjuntos from "../../components/gastos/GastoAdjuntos";
import { apiUrl } from "../../store/services/apiBase";
import AlertDialog from "../../components/common/AlertDialog";
import BackButton from "../../components/common/BackButton";

export default function VerGasto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const baseUploads = `${apiUrl}/uploads/`;

  const {
    data: gasto,
    isLoading,
    refetch,
  } = useGetGastoByIdQuery(id, { skip: !id });

  const { data: catData } = useGetAllCategoriasGastoQuery({
    activo: true,
    limit: 200,
  });
  const categorias = Array.isArray(catData) ? catData : catData?.items || [];

  const [triggerProv, provRes] = useLazyGetAllProveedoresQuery();
  const proveedoresRaw = Array.isArray(provRes.data)
    ? provRes.data
    : provRes.data?.items || [];
  const proveedores = proveedoresRaw.filter((p) => p?.activo === true);

  const { data: ccData } = useGetAllCentrosCostoQuery({
    activo: true,
    limit: 200,
  });
  const centros = Array.isArray(ccData) ? ccData : ccData?.items || [];

  const [updateGasto, { isLoading: saving }] = useUpdateGastoMutation();
  const [deleteGasto] = useDeleteGastoMutation();
  const [deleteAdjunto, { isLoading: removingAdj }] =
    useDeleteGastoAdjuntoMutation();

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [adjToDelete, setAdjToDelete] = useState(null);

  const openDeleteAdjunto = (adj) => {
    setAdjToDelete(adj);
    setConfirmMode("adjunto");
    setConfirmOpen(true);
  };
  const openDeleteGasto = () => {
    setAdjToDelete(null);
    setConfirmMode("gasto");
    setConfirmOpen(true);
  };
  const closeDeleteDialog = () => {
    if (confirmLoading) return;
    setConfirmOpen(false);
    setConfirmMode(null);
    setAdjToDelete(null);
  };
  useEffect(() => {
    if (!gasto) return;
    setForm({
      fecha: gasto.fecha ? dayjs(gasto.fecha).format("YYYY-MM-DD") : "",
      id_categoria_gasto: gasto.id_categoria_gasto ?? null,
      id_proveedor: gasto.id_proveedor ?? null,
      id_centro_costo: gasto.id_centro_costo ?? null,
      metodo_pago: gasto.metodo_pago ?? "",
      doc_tipo: gasto.tipo_documento ?? "",
      doc_folio: gasto.nro_documento ?? "",
      descripcion: gasto.descripcion ?? "",
      monto_neto: Number(gasto.monto_neto || 0),
      iva: Number(gasto.iva || 0),
      total: Number(gasto.total || 0),
    });
  }, [gasto]);

  const handleChange = (field) => (e, v) => {
    const value = e?.target?.value ?? v ?? "";
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleToggleEdit = () => setEdit((s) => !s);

  const handleSave = async () => {
    if (!form || !gasto) return;

    const montoNetoNext =
      form.monto_neto === "" || form.monto_neto == null
        ? gasto.monto_neto
        : Number(form.monto_neto);

    const ivaNext =
      form.iva === "" || form.iva == null ? gasto.iva : Number(form.iva);

    const totalNext =
      form.total === "" || form.total == null
        ? gasto.total
        : Number(form.total);

    const base = {
      fecha: form.fecha || null,
      id_categoria_gasto:
        form.id_categoria_gasto == null
          ? null
          : Number(form.id_categoria_gasto),
      id_proveedor:
        form.id_proveedor == null ? null : Number(form.id_proveedor),
      id_centro_costo:
        form.id_centro_costo == null ? null : Number(form.id_centro_costo),
      metodo_pago: form.metodo_pago || null,
      descripcion: String(form.descripcion || "").trim(),
      monto_neto: montoNetoNext,
      iva: ivaNext,
      total: totalNext,
    };

    const prev = {
      fecha: gasto.fecha ? dayjs(gasto.fecha).format("YYYY-MM-DD") : "",
      id_categoria_gasto: gasto.id_categoria_gasto ?? null,
      id_proveedor: gasto.id_proveedor ?? null,
      id_centro_costo: gasto.id_centro_costo ?? null,
      metodo_pago: gasto.metodo_pago ?? null,
      descripcion: gasto.descripcion ?? "",
      tipo_documento: gasto.tipo_documento ?? null,
      nro_documento: gasto.nro_documento ?? null,
      monto_neto: Number(gasto.monto_neto || 0),
      iva: Number(gasto.iva || 0),
      total: Number(gasto.total || 0),
    };

    const patch = diff(prev, base);

    const docPrev = {
      tipo: gasto.tipo_documento ?? null,
      folio: gasto.nro_documento ?? null,
    };
    const docNext = {
      tipo: form.doc_tipo || null,
      folio: form.doc_folio || null,
    };
    if (docPrev.tipo !== docNext.tipo || docPrev.folio !== docNext.folio) {
      patch.documento = docNext;
    }

    if (Object.keys(patch).length === 0) {
      dispatch(
        showNotification({
          message: "No hay cambios por guardar.",
          severity: "info",
        })
      );
      setEdit(false);
      return;
    }

    try {
      console.log(patch);
      await updateGasto({ id, ...patch }).unwrap();
      dispatch(
        showNotification({ message: "Gasto actualizado.", severity: "success" })
      );
      setEdit(false);
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo actualizar el gasto.",
          severity: "error",
        })
      );
    }
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      if (confirmMode === "gasto") {
        await deleteGasto(id).unwrap();
        setConfirmOpen(false);
        setConfirmMode(null);
        setAdjToDelete(null);

        dispatch(
          showNotification({ message: "Gasto eliminado.", severity: "success" })
        );
        navigate("/admin/gastos");
        return;
      }
      if (confirmMode === "adjunto" && adjToDelete?.id_adjunto) {
        await deleteAdjunto({ id, adjuntoId: adjToDelete.id_adjunto }).unwrap();
        dispatch(
          showNotification({
            message: "Adjunto eliminado.",
            severity: "success",
          })
        );
        setConfirmOpen(false);
        setConfirmMode(null);
        setAdjToDelete(null);
        refetch();
      }
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo completar la operación.",
          severity: "error",
        })
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  /*   const handleDelete = async () => {
    if (
      !window.confirm("¿Eliminar este gasto? Esta acción no se puede deshacer.")
    )
      return;
    try {
      await deleteGasto(id).unwrap();
      dispatch(
        showNotification({ message: "Gasto eliminado.", severity: "success" })
      );
      navigate("/admin/gastos");
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo eliminar el gasto.",
          severity: "error",
        })
      );
    }
  };

  const handleDeleteAdjuntoConfirmed = async () => {
    if (!adjToDelete?.id_adjunto) return;
    try {
      setConfirmLoading(true);
      await deleteAdjunto({ id, adjuntoId: adjToDelete.id_adjunto }).unwrap();
      dispatch(
        showNotification({ message: "Adjunto eliminado.", severity: "success" })
      );
      setConfirmOpen(false);
      setAdjToDelete(null);
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo eliminar el adjunto.",
          severity: "error",
        })
      );
    } finally {
      setConfirmLoading(false);
    }
  }; */

  const onProvOpen = () => {
    if (!provRes.data) triggerProv({ limit: 10, activo: true });
  };
  const onProvSearch = (_, q, reason) => {
    if (reason !== "input") return;
    const s = q?.trim();
    if (s?.length >= 2) triggerProv({ search: s, limit: 10, activo: true });
  };

  const totalFmt = useMemo(
    () => formatCLP(Number(gasto?.total || 0)),
    [gasto?.total]
  );

  if (isLoading || !gasto || !form) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={420} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
      <BackButton to="/admin/gastos" label="Volver a Gastos" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <GastoHeader
            gasto={gasto}
            edit={edit}
            onToggleEdit={handleToggleEdit}
            onSave={handleSave}
            onDelete={openDeleteGasto}
            saving={saving}
          />
        </Grid>

        <Grid item xs={12}>
          <GastoOverview
            gasto={gasto}
            totalFmt={totalFmt}
            formatCLP={formatCLP}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          {!edit ? (
            <GastoDetailView gasto={gasto} />
          ) : (
            <GastoEditForm
              form={form}
              setForm={setForm}
              categorias={categorias}
              proveedores={proveedores}
              centros={centros}
              provIsFetching={provRes.isFetching}
              onProvOpen={onProvOpen}
              onProvSearch={onProvSearch}
              onChange={handleChange}
              onCancel={handleToggleEdit}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <GastoAdjuntos
            adjuntos={gasto?.adjuntos}
            baseUploads={baseUploads}
            onDelete={openDeleteAdjunto}
            removing={removingAdj}
          />
        </Grid>
      </Grid>
      <AlertDialog
        openAlert={confirmOpen}
        onCloseAlert={closeDeleteDialog}
        onConfirm={handleConfirm}
        title={confirmMode === "gasto" ? "Eliminar gasto" : "Eliminar adjunto"}
        message={
          confirmMode === "gasto"
            ? "¿Eliminar este gasto? También se eliminarán sus adjuntos. Esta acción no se puede deshacer."
            : adjToDelete
            ? `¿Eliminar "${
                adjToDelete.original_name || adjToDelete.filename
              }"? Esta acción no se puede deshacer.`
            : "¿Eliminar adjunto?"
        }
        confirmLoading={confirmLoading}
        confirmLabel={confirmMode === "gasto" ? "Eliminar gasto" : "Eliminar"}
        cancelLabel="Cancelar"
      />
    </Box>
  );
}
