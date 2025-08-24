export function getStockForSucursal(inventarioArr, idSucursal) {
  if (!Array.isArray(inventarioArr) || !idSucursal) return 0;
  const item = inventarioArr.find(
    (i) => Number(i.id_sucursal) === Number(idSucursal)
  );
  return Number(item?.cantidad || 0);
}
