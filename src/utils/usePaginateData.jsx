import { useState } from "react";

const allowedPageSizes = [5, 10, 20, 50];

const usePaginatedData = (queryFn, initialPageSize = 10) => {
  const safePageSize = allowedPageSizes.includes(initialPageSize)
    ? initialPageSize
    : allowedPageSizes[0];

  const [page, setPage] = useState(0); // DataGrid usa 0-based
  const [pageSize, setPageSize] = useState(safePageSize);

  const { data, isLoading, isError, refetch } = queryFn({
    page: page + 1, // backend espera 1-based
    limit: pageSize,
  });

  const handlePageChange = (newPage, newPageSize = pageSize) => {
    if (newPageSize !== pageSize) {
      setPage(0);
      setPageSize(newPageSize);
    } else {
      setPage(newPage);
    }
  };

  const paginacion = {
    totalItems: data?.total || data?.paginacion?.totalItems || 0,
    totalPages:
      data?.paginacion?.totalPages || Math.ceil((data?.total || 0) / pageSize),
  };

  const rows =
    data?.usuarios || data?.logs || data?.productos || data?.auditLogs || [];

  return {
    data: rows,
    isLoading,
    isError,
    refetch,
    page,
    pageSize,
    paginacion,
    handlePageChange,
  };
};

export default usePaginatedData;
