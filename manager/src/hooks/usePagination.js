import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '../utils/constants';

export const usePagination = (options = {}) => {
  const {
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    pageSizeOptions = PAGINATION.PAGE_SIZE_OPTIONS,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize) || 1;
  }, [total, pageSize]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const goToPage = useCallback((newPage) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setPage(clamped);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const goToNext = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const goToFirst = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLast = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  const getPageInfo = useCallback(() => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return { start, end };
  }, [page, pageSize, total]);

  const getPageNumbers = useCallback(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [page, totalPages]);

  return {
    page,
    pageSize,
    total,
    totalPages,
    pageSizeOptions,
    canGoPrev,
    canGoNext,
    setTotal,
    setPage,
    setPageSize,
    goToPage,
    goToPrev,
    goToNext,
    goToFirst,
    goToLast,
    changePageSize,
    reset,
    getPageInfo,
    getPageNumbers,
  };
};
