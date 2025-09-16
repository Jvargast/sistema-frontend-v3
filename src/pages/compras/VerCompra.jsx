import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Skeleton, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import {
  useDeleteCompraMutation,
  useGetCompraByIdQuery,
  useUpdateCompraMutation,
} from "../../store/services/compraApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import CompraViewHeader from "../../components/compras/CompraViewHeader";
import CompraOverview from "../../components/compras/CompraOverview";
import CompraDetailItems from "../../components/compras/CompraDetailItems";
import CompraEditForm from "../../components/compras/CompraEditForm";
import CompraItemsTable from "../../components/compras/CompraItemsTable";

export default function VerCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: compra,
    isLoading,
    refetch,
  } = useGetCompraByIdQuery(id, { skip: !id });
  const { data: sucursales = [] } = useGetAllSucursalsQuery();

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [itemsForm, setItemsForm] = useState([]);

  const [updateCompra, { isLoading: saving }] = useUpdateCompraMutation();
  const [deleteCompra, { isLoading: deleting }] = useDeleteCompraMutation();

  const items = useMemo(() => {
    if (!compra) return [];
    return compra.items || compra.CompraItems || compra.detalle || [];
  }, [compra]);

  useEffect(() => {
    if (!compra) return;
    setForm({
      fecha: compra.fecha ? dayjs(compra.fecha).format("YYYY-MM-DD") : "",
      fecha_documento: compra.fecha_documento
        ? dayjs(compra.fecha_documento).format("YYYY-MM-DD")
        : "",
      id_sucursal: compra.id_sucursal ?? null,
      id_proveedor: compra.id_proveedor ?? null,
      estado: compra.estado || "borrador",
      moneda: compra.moneda || "CLP",
      nro_documento: compra.nro_documento || "",
      observaciones: compra.observaciones || "",
    });

    const norm = (items || []).map((it) => ({
      _tid:
        crypto.randomUUID?.() || `${it.id_compra_item || ""}-${Math.random()}`,
      id_compra_item: it.id_compra_item ?? null,
      id_insumo: it.id_insumo ?? it.insumo?.id_insumo ?? null,
      insumo: it.insumo || null,
      descripcion: it.descripcion || "",
      cantidad: Number(it.cantidad || 0),
      precio_unitario: Number(it.precio_unitario || 0),
      afecta_iva: Boolean(
        "afecta_iva" in it ? it.afecta_iva : Number(it.iva_monto || 0) > 0
      ),
      descuento: Number(it.descuento || 0),
    }));
    setItemsForm(norm);
  }, [compra, items]);

  const addItem = (preset = {}) =>
    setItemsForm((rows) => [
      ...rows,
      {
        _tid: crypto.randomUUID?.() || String(Date.now() + Math.random()),
        id_compra_item: null,
        id_insumo: null,
        descripcion: "",
        cantidad: 1,
        precio_unitario: 0,
        afecta_iva: true,
        descuento: 0,
        ...preset,
      },
    ]);
  const updateItem = (tid, patch) =>
    setItemsForm((rows) =>
      rows.map((r) => (r._tid === tid ? { ...r, ...patch } : r))
    );
  const removeItem = (tid) =>
    setItemsForm((rows) => rows.filter((r) => r._tid !== tid));

  const buildItemsDiff = (original, edited) => {
    const byId = new Map(
      (original || [])
        .filter((i) => i.id_compra_item != null)
        .map((i) => [
          Number(i.id_compra_item),
          {
            id_compra_item: Number(i.id_compra_item),
            id_insumo: i.id_insumo ?? i.insumo?.id_insumo ?? null,
            descripcion: i.descripcion || "",
            cantidad: Number(i.cantidad || 0),
            precio_unitario: Number(i.precio_unitario || 0),
            afecta_iva:
              "afecta_iva" in i
                ? Boolean(i.afecta_iva)
                : Number(i.iva_monto || 0) > 0,
            descuento: Number(i.descuento || 0),
          },
        ])
    );
    const editedById = new Map(
      (edited || [])
        .filter((e) => e.id_compra_item != null)
        .map((e) => [Number(e.id_compra_item), e])
    );

    const remove = [];
    for (const id of byId.keys()) {
      if (!editedById.has(id)) remove.push(id);
    }

    const update = [];
    for (const [id, e] of editedById.entries()) {
      const prev = byId.get(id);
      if (!prev) continue;
      const base = {
        id_compra_item: id,
        id_insumo: e.id_insumo ?? null,
        descripcion: e.descripcion || "",
        cantidad: Number(e.cantidad || 0),
        precio_unitario: Number(e.precio_unitario || 0),
        afecta_iva: Boolean(e.afecta_iva),
        descuento: Number(e.descuento || 0),
      };
      const changed =
        base.id_insumo !== (prev.id_insumo ?? null) ||
        base.descripcion !== (prev.descripcion || "") ||
        base.cantidad !== Number(prev.cantidad || 0) ||
        base.precio_unitario !== Number(prev.precio_unitario || 0) ||
        base.afecta_iva !== Boolean(prev.afecta_iva) ||
        base.descuento !== Number(prev.descuento || 0);
      if (changed) update.push(base);
    }

    const add = (edited || [])
      .filter((e) => e.id_compra_item == null) // nuevos
      .map((e) => ({
        id_insumo: e.id_insumo ?? null,
        descripcion: e.descripcion || null,
        cantidad: Number(e.cantidad || 0),
        precio_unitario: Number(e.precio_unitario || 0),
        afecta_iva: Boolean(e.afecta_iva),
        descuento: Number(e.descuento || 0),
      }));

    return { add, update, remove };
  };

  const handleToggleEdit = () => setEdit((s) => !s);

  const handleSave = async () => {
    if (!compra || !form) return;

    const base = {
      fecha: form.fecha || null,
      fecha_documento: form.fecha_documento || null,
      id_sucursal: form.id_sucursal ?? null,
      id_proveedor: form.id_proveedor ?? null,
      estado: form.estado || "borrador",
      moneda: form.moneda || "CLP",
      nro_documento: form.nro_documento || null,
      observaciones: String(form.observaciones || "").trim() || null,
    };

    const prev = {
      fecha: compra.fecha ? dayjs(compra.fecha).format("YYYY-MM-DD") : null,
      fecha_documento: compra.fecha_documento
        ? dayjs(compra.fecha_documento).format("YYYY-MM-DD")
        : null,
      id_sucursal: compra.id_sucursal ?? null,
      id_proveedor: compra.id_proveedor ?? null,
      estado: compra.estado || "borrador",
      moneda: compra.moneda || "CLP",
      nro_documento: compra.nro_documento || null,
      observaciones: compra.observaciones || null,
    };

    const patch = {};
    Object.keys(base).forEach((k) => {
      if ((base[k] ?? null) !== (prev[k] ?? null)) patch[k] = base[k];
    });

    const itemsDiff = buildItemsDiff(items, itemsForm);
    const hasItemsChanges =
      itemsDiff.add.length ||
      itemsDiff.update.length ||
      itemsDiff.remove.length;
    if (hasItemsChanges) {
      patch.items = itemsDiff;
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
      await updateCompra({ id, ...patch }).unwrap();
      dispatch(
        showNotification({
          message: "Compra actualizada.",
          severity: "success",
        })
      );
      setEdit(false);
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo actualizar la compra.",
          severity: "error",
        })
      );
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "¿Eliminar esta compra? Esta acción no se puede deshacer."
      )
    )
      return;
    try {
      await deleteCompra(id).unwrap();
      dispatch(
        showNotification({ message: "Compra eliminada.", severity: "success" })
      );
      navigate("/admin/compras");
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo eliminar la compra.",
          severity: "error",
        })
      );
    }
  };

  if (isLoading || !compra || !form) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={420} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <CompraViewHeader
            compra={compra}
            edit={edit}
            saving={saving || deleting}
            onToggleEdit={handleToggleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </Grid>
        <Grid item xs={12}>
          {!edit ? (
            <CompraOverview compra={compra} sucursales={sucursales} />
          ) : (
            <CompraEditForm
              form={form}
              setForm={setForm}
              sucursales={sucursales}
              onCancel={handleToggleEdit}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {!edit ? (
            <CompraDetailItems items={items} moneda={compra.moneda} />
          ) : (
            <Stack spacing={2}>
              <CompraItemsTable
                items={itemsForm}
                addItem={addItem}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
