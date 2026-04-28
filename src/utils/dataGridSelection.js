export function normalizeDataGridSelection(selectionModel) {
  if (Array.isArray(selectionModel)) return selectionModel;
  if (selectionModel instanceof Set) return Array.from(selectionModel);

  const ids = selectionModel?.ids;
  if (Array.isArray(ids)) return ids;
  if (ids instanceof Set) return Array.from(ids);

  return [];
}
