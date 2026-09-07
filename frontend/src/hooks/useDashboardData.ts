import { useState, useEffect, useCallback } from 'react';
import type { DashboardData } from '../types';
import { fetchDashboardData } from '../services/api';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    fetchDashboardData()
      .then((res) => {
        setData(res);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, setData, reload: loadData };
}
