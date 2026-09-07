import type { DashboardData } from '../types';

export async function fetchDashboardData(): Promise<DashboardData> {
  // Check if loaded via window script tag fallback (supports uppercase and camelCase)
  if (typeof window !== 'undefined') {
    const globalData = (window as any).NETWORK_ALPHA_DATA || (window as any).networkAlphaData;
    if (globalData && Array.isArray(globalData.companies) && globalData.companies.length > 0) {
      return globalData;
    }
  }

  const urls = [
    '/api/dashboard-data',
    '/data/network_alpha_data.json',
    '../data/network_alpha_data.json',
    'data/network_alpha_data.json',
    '/network_alpha_data.json',
    '/api/companies',
  ];

  for (const url of urls) {
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const json = await resp.json();
        if (Array.isArray(json)) {
          return {
            companies: json,
            super_insiders: [],
            conglomerates: [],
          };
        }
        if (json && Array.isArray(json.companies)) {
          return json;
        }
      }
    } catch {
      // try next path
    }
  }

  // Graceful fallback mock if completely offline
  return {
    companies: [
      {
        code: 'BBCA',
        name: 'Bank Central Asia Tbk',
        sector: 'Financials',
        score: { financial: 38, valuation: 22, network: 28, total: 88 },
        price: 6625,
        daily_change: -75,
        previous_price: 6700,
        per: 21.5,
        pbv: 4.2,
        roe: 22.1,
        yield: 2.8,
        is_blue_chip: true,
        conglomerate: 'Djarum Group',
      },
      {
        code: 'BBRI',
        name: 'Bank Rakyat Indonesia Tbk',
        sector: 'Financials',
        score: { financial: 36, valuation: 25, network: 26, total: 87 },
        price: 3370,
        daily_change: -20,
        previous_price: 3390,
        per: 11.2,
        pbv: 2.1,
        roe: 19.8,
        yield: 5.6,
        is_blue_chip: true,
      },
      {
        code: 'BMRI',
        name: 'Bank Mandiri (Persero) Tbk',
        sector: 'Financials',
        score: { financial: 37, valuation: 24, network: 27, total: 88 },
        price: 5250,
        daily_change: 25,
        previous_price: 5225,
        per: 9.8,
        pbv: 1.8,
        roe: 19.5,
        yield: 5.2,
        is_blue_chip: true,
      },
      {
        code: 'TLKM',
        name: 'Telkom Indonesia Tbk',
        sector: 'Infrastructure',
        score: { financial: 34, valuation: 26, network: 25, total: 85 },
        price: 2840,
        daily_change: 10,
        previous_price: 2830,
        per: 12.4,
        pbv: 2.3,
        roe: 16.8,
        yield: 4.9,
        is_blue_chip: true,
      },
      {
        code: 'ASII',
        name: 'Astra International Tbk',
        sector: 'Consumer Discretionary',
        score: { financial: 35, valuation: 28, network: 24, total: 87 },
        price: 4920,
        daily_change: -40,
        previous_price: 4960,
        per: 6.9,
        pbv: 0.9,
        roe: 14.2,
        yield: 7.1,
        is_blue_chip: true,
      },
      {
        code: 'ADRO',
        name: 'Alamtri Resources Indonesia Tbk',
        sector: 'Energy',
        score: { financial: 35, valuation: 30, network: 22, total: 87 },
        price: 2700,
        daily_change: -20,
        previous_price: 2720,
        per: 3.1,
        pbv: 0.6,
        roe: 19.7,
        yield: 12.5,
        is_blue_chip: true,
      },
    ],
    super_insiders: [
      {
        name: 'LO KHENG HONG',
        portfolio: [
          { code: 'DILD', percentage: 6.4 },
          { code: 'ABMM', percentage: 4.8 },
        ],
        total_value_idr: 1850000000000,
        holding_count: 5,
      },
    ],
    conglomerates: [
      {
        name: 'Djarum Group',
        companies: ['BBCA', 'TOWR', 'BELI'],
        median_roe: 22.1,
        total_market_cap: 1250000000000000,
        dominant_sector: 'Financials',
      },
    ],
  };
}

export async function fetchStockData(ticker: string): Promise<any> {
  const resp = await fetch(`/api/stock/${ticker.toUpperCase()}`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch stock data for ${ticker}`);
  }
  return await resp.json();
}

export async function fetchUBO(ticker: string): Promise<any> {
  const resp = await fetch(`/api/graph/ubo/${ticker.toUpperCase()}`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch UBO for ${ticker}`);
  }
  return await resp.json();
}

export async function fetchGraphNetwork(ticker: string): Promise<any> {
  const resp = await fetch(`/api/graph/network/${ticker.toUpperCase()}`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch network graph for ${ticker}`);
  }
  return await resp.json();
}

export async function fetchCentrality(topN = 20): Promise<any[]> {
  const resp = await fetch(`/api/graph/centrality?top_n=${topN}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch board centrality');
  }
  return await resp.json();
}

export async function fetchCrossHoldings(): Promise<any[]> {
  const resp = await fetch('/api/graph/cross-holdings');
  if (!resp.ok) {
    throw new Error('Failed to fetch cross holdings');
  }
  return await resp.json();
}

export async function fetchStealthAccumulation(): Promise<any> {
  const resp = await fetch('/api/stealth-accumulation');
  if (!resp.ok) {
    throw new Error('Failed to fetch stealth accumulation');
  }
  return await resp.json();
}

export async function fetchBrokerFlow(date?: string, topK = 5): Promise<any> {
  const url = date ? `/api/broker-flow?date=${date}&top_k=${topK}` : `/api/broker-flow?top_k=${topK}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Failed to fetch broker flow');
  }
  return await resp.json();
}

export async function fetchDividendScreen(minYield = 3.0, year = '2026', limit = 30): Promise<any> {
  const resp = await fetch(`/api/dividend?min_yield=${minYield}&year=${year}&limit=${limit}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch dividend opportunities');
  }
  return await resp.json();
}

export async function fetchDividendAnalysis(ticker: string): Promise<any> {
  const resp = await fetch(`/api/dividend/${ticker.toUpperCase()}`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch dividend analysis for ${ticker}`);
  }
  return await resp.json();
}

export async function runBacktest(params: any): Promise<any> {
  const resp = await fetch('/api/backtest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Backtest failed' }));
    throw new Error(err.detail || 'Backtest failed');
  }
  return await resp.json();
}
