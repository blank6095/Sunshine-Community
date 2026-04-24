import { useState, useCallback, useMemo } from 'react';
import { usePagination } from './usePagination';

export const useTable = (options = {}) => {
  const {
    fetchFn,
    initialFilters = {},
    initialSorter = null,
    initialSelectedIds = [],
    pageSize,
  } = options;

  const pagination = usePagination({ initialPageSize: pageSize });
  const [filters, setFilters] = useState(initialFilters);
  const [sorter, setSorter] = useState(initialSorter);
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!fetchFn) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
        ...(sorter ? { sort: sorter } : {}),
      };

      const result = await fetchFn(params);
      const resultData = Array.isArray(result) ? result : (result.data || []);
      const totalCount = Array.isArray(result) ? result.length : (result.total || 0);
      setData(resultData);
      pagination.setTotal(totalCount);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pagination.page, pagination.pageSize, filters, sorter]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    pagination.goToFirst();
  }, [pagination]);

  const setFiltersAll = useCallback((newFilters) => {
    setFilters(newFilters);
    pagination.goToFirst();
  }, [pagination]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    pagination.goToFirst();
  }, [initialFilters, pagination]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback((ids = []) => {
    if (selectedIds.length >= ids.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ids);
    }
  }, [selectedIds.length]);

  const isSelected = useCallback((id) => selectedIds.includes(id), [selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const hasSelection = useMemo(() => selectedIds.length > 0, [selectedIds.length]);

  const sortBy = useCallback((field, direction = 'asc') => {
    setSorter({ field, direction });
  }, []);

  const clearSorter = useCallback(() => {
    setSorter(null);
  }, []);

  const tableProps = useMemo(() => ({
    loading,
    dataSource: data,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
    },
    onPageChange: pagination.goToPage,
  }), [loading, data, pagination]);

  return {
    data,
    loading,
    error,
    filters,
    sorter,
    selectedIds,
    pagination,
    tableProps,
    hasSelection,
    fetchData,
    setFilter,
    setFilters: setFiltersAll,
    resetFilters,
    toggleSelect,
    toggleSelectAll,
    isSelected,
    clearSelection,
    sortBy,
    clearSorter,
  };
};
