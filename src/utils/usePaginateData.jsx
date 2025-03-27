import { useState, useEffect } from "react";

const usePaginatedData = (queryFn) => {
  const [page, setPage] = useState(0); // Página inicial
  const [pageSize, setPageSize] = useState(5); // Tamaño inicial

  const [queryParams, setQueryParams] = useState({ page: 1, limit: 5 }); // Parámetros para la consulta

  // Actualizar los parámetros de la consulta cuando cambien la página o el tamaño
  useEffect(() => {
    setQueryParams({ page: page + 1, limit: pageSize });
  }, [page, pageSize]);

  const { data, isLoading, isError, refetch } = queryFn(queryParams);

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize || pageSize);
  };

  const paginacion = data?.paginacion || {
    totalItems: 0,
    totalPages: Math.ceil((data?.total || 0) / queryParams.limit),
    currentPage: queryParams.page,
    pageSize: queryParams.limit,
  };

  const rows =
    data?.logs || data?.auditLogs || data?.usuarios || data?.prodcuctos || []; // Ajustar según la respuesta de tu API

  return {
    data: rows,
    isLoading,
    isError,
    refetch,
    paginacion,
    handlePageChange,
  };
};

export default usePaginatedData;
