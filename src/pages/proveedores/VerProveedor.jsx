import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Skeleton } from "@mui/material";
import { useDispatch } from "react-redux";
import ProveedorHeader from "../../components/proveedores/ProveedorHeader";
import ProveedorViewCard from "../../components/proveedores/ProveedorViewCard";
import ProveedorEditForm from "../../components/proveedores/ProveedorEditForm";
import {
  useGetProveedorByIdQuery,
  useUpdateProveedorMutation,
  useDeleteProveedorMutation,
} from "../../store/services/proveedorApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import AlertDialog from "../../components/common/AlertDialog";

export default function VerProveedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: proveedor,
    isLoading,
    refetch,
  } = useGetProveedorByIdQuery(id, { skip: !id });
  const [updateProveedor, { isLoading: saving }] = useUpdateProveedorMutation();
  const [deleteProveedor] = useDeleteProveedorMutation();

  const [edit, setEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onBack = () => navigate("/admin/proveedores");
  const onToggleEdit = () => setEdit((s) => !s);

  const onSave = async (patch) => {
    if (!patch || Object.keys(patch).length === 0) {
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
      await updateProveedor({ id, ...patch }).unwrap();
      dispatch(
        showNotification({
          message: "Proveedor actualizado.",
          severity: "success",
        })
      );
      setEdit(false);
      refetch();
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo actualizar el proveedor.",
          severity: "error",
        })
      );
    }
  };

  const onDelete = () => setConfirmOpen(true);
  const closeDelete = () => {
    if (!confirmLoading) setConfirmOpen(false);
  };
  const confirmDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteProveedor(id).unwrap();
      dispatch(
        showNotification({
          message: "Proveedor eliminado.",
          severity: "success",
        })
      );
      setConfirmOpen(false);
      navigate("/admin/proveedores");
    } catch (err) {
      dispatch(
        showNotification({
          message: err?.data?.error || "No se pudo eliminar el proveedor.",
          severity: "error",
        })
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  if (isLoading || !proveedor) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Skeleton variant="rounded" height={96} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={320} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProveedorHeader
            proveedor={proveedor}
            edit={edit}
            saving={saving}
            onBack={onBack}
            onToggleEdit={onToggleEdit}
            onSave={() =>
              document
                .querySelector("form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                )
            }
            onDelete={onDelete}
          />
        </Grid>

        <Grid item xs={12}>
          {!edit ? (
            <ProveedorViewCard proveedor={proveedor} />
          ) : (
            <ProveedorEditForm
              proveedor={proveedor}
              saving={saving}
              onSubmit={onSave}
            />
          )}
        </Grid>
      </Grid>

      <AlertDialog
        openAlert={confirmOpen}
        onCloseAlert={closeDelete}
        onConfirm={confirmDelete}
        title="Eliminar proveedor"
        message="¿Eliminar este proveedor? Esta acción no se puede deshacer."
        confirmLoading={confirmLoading}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </Box>
  );
}
