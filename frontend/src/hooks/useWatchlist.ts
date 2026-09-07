import { useState, useEffect } from 'react';
import type { WatchlistItem } from '../types';

const STORAGE_KEY = 'idx_user_watchlist_v1';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load watchlist from localStorage', e);
    }
    // Default initial watchlist with top blue chips
    return [
      { code: 'BBCA', name: 'Bank Central Asia Tbk', sector: 'Financials', price: 6625, daily_change: -75, score: 88, addedAt: new Date().toISOString() },
      { code: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', sector: 'Financials', price: 3820, daily_change: 20, score: 87, addedAt: new Date().toISOString() },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  const isStarred = (code: string): boolean => {
    return watchlist.some((item) => item.code.toUpperCase() === code.toUpperCase());
  };

  const toggleStar = (company: { code: string; name: string; sector?: string; price?: number; daily_change?: number; score?: any }) => {
    const code = company.code.toUpperCase();
    if (isStarred(code)) {
      setWatchlist((prev) => prev.filter((item) => item.code.toUpperCase() !== code));
    } else {
      const newItem: WatchlistItem = {
        code,
        name: company.name,
        sector: company.sector,
        price: company.price,
        daily_change: company.daily_change,
        score: typeof company.score === 'object' ? company.score?.total : company.score,
        addedAt: new Date().toISOString(),
      };
      setWatchlist((prev) => [newItem, ...prev]);
    }
  };

  const removeStar = (code: string) => {
    setWatchlist((prev) => prev.filter((item) => item.code.toUpperCase() !== code.toUpperCase()));
  };

  return {
    watchlist,
    isStarred,
    toggleStar,
    removeStar,
  };
}
