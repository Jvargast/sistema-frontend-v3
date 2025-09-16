import { useMemo, useState, useEffect } from "react";
import ProveedorFilters from "../../components/proveedores/ProveedorFilters";
import ProveedorTable from "../../components/proveedores/ProveedorTable";
import { useGetAllProveedoresQuery } from "../../store/services/proveedorApi";

const useDebounced = (val, delay = 400) => {
  const [d, setD] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setD(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return d;
};

export default function ListarProveedores() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);
  useEffect(() => {
    setPage(0);
  }, []);

  const queryArgs = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    }),
    [page, rowsPerPage, debouncedSearch]
  );

  const { data, isLoading, isError } = useGetAllProveedoresQuery(queryArgs, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const proveedores = useMemo(
    () => (Array.isArray(data) ? data : data?.items || data?.proveedores || []),
    [data]
  );

  const totalItems = useMemo(
    () => data?.total || data?.paginacion?.totalItems || proveedores.length,
    [data, proveedores.length]
  );
  return (
    <>
      <ProveedorFilters
        search={search}
        setSearch={setSearch}
        setPage={setPage}
      />

      <ProveedorTable
        rows={proveedores}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        loading={isLoading}
        errorMessage={
          isError ? "No se pudieron cargar los proveedores." : undefined
        }
      />
    </>
  );
}
