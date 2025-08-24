import { useEffect, useMemo, useState } from "react";

const allowedPageSizes = [5, 10, 20, 50];

const usePaginatedData = (
  queryFn,
  initialPageSize = 10,
  params = {},
  resetKey
) => {
  const safePageSize = allowedPageSizes.includes(initialPageSize)
    ? initialPageSize
    : allowedPageSizes[0];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(safePageSize);

  /*   const { data, isLoading, isError, refetch } = queryFn({
    page: page + 1,
    limit: pageSize,
  }); */

  const queryArgs = useMemo(() => {
    const clean = Object.entries(params).reduce((acc, [k, v]) => {
      if (v === null || v === undefined || v === "") return acc;
      acc[k] = v;
      return acc;
    }, {});
    return { page: page + 1, limit: pageSize, ...clean };
  }, [page, pageSize, params]);

  const { data, isLoading, isError, refetch } = queryFn(queryArgs);

  useEffect(() => {
    if (resetKey !== undefined) setPage(0);
  }, [resetKey]);

  const paginacion = {
    currentPage: data?.paginacion?.currentPage ?? page,
    totalItems: data?.paginacion?.totalItems ?? 0,
    totalPages: data?.paginacion?.totalPages ?? 1,
    pageSize: data?.paginacion?.pageSize ?? pageSize,
  };
  const rows =
    data?.usuarios ||
    data?.logs ||
    data?.productos ||
    data?.auditLogs ||
    data?.data ||
    [];

  const handlePageChange = (newPage, newPageSize = pageSize) => {
    if (newPageSize !== pageSize) {
      setPage(0);
      setPageSize(newPageSize);
    } else {
      setPage(newPage);
    }
  };

  return {
    data: rows,
    isLoading,
    isError,
    refetch,
    page,
    pageSize: paginacion.pageSize,
    paginacion,
    handlePageChange,
  };
};

export default usePaginatedData;
