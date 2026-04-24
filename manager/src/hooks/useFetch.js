import { useState, useCallback, useRef, useEffect } from 'react';

const requestCache = new Map();
const pendingRequests = new Map();

export const useFetch = (fetchFn, options = {}) => {
  const {
    initialData = null,
    enabled = true,
    cacheKey = null,
    cacheTime = 5 * 60 * 1000,
    refetchOnMount = false,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (...args) => {
    if (!enabled) return null;

    const key = cacheKey || `${fetchFn.name}_${JSON.stringify(args)}`;

    if (!refetchOnMount && requestCache.has(key)) {
      const cached = requestCache.get(key);
      if (Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data);
        return cached.data;
      }
    }

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    setLoading(true);
    setError(null);

    try {
      const promise = fetchFn(...args);
      pendingRequests.set(key, promise);
      const result = await promise;

      if (mountedRef.current) {
        setData(result);
        if (cacheKey) {
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
        }
      }
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      pendingRequests.delete(key);
    }
  }, [fetchFn, enabled, cacheKey, cacheTime, refetchOnMount]);

  const refresh = useCallback(async (...args) => {
    requestCache.delete(cacheKey);
    return fetchData(...args);
  }, [fetchData, cacheKey]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      requestCache.delete(cacheKey);
    } else {
      requestCache.clear();
    }
  }, [cacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchData();
    }
  }, [enabled, refetchOnMount, fetchData]);

  return { data, loading, error, fetch: fetchData, refresh, clearCache };
};

export const clearAllCache = () => {
  requestCache.clear();
  pendingRequests.clear();
};
