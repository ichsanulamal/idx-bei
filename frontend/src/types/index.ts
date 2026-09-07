export type TabType =
  | 'opportunities'
  | 'terminal'
  | 'power_map'
  | 'simulator';

export interface ScoreBreakdown {
  financial: number;
  valuation: number;
  network: number;
  total: number;
}

export interface BoardMember {
  name: string;
  role?: string;
  title?: string;
  is_shared?: boolean;
}

export interface Shareholder {
  name: string;
  percentage: number;
  is_controller?: boolean;
  is_super_insider?: boolean;
}

export interface Subsidiary {
  name: string;
  percentage: number;
  bidang_usaha?: string;
}

export interface Company {
  code: string;
  name: string;
  sector: string;
  sub_sector?: string;
  industry?: string;
  sub_industry?: string;
  roe?: number | null;
  roa?: number | null;
  npm?: number | null;
  de_ratio?: number | null;
  per?: number | null;
  price_bv?: number | null;
  pbv?: number | null;
  price?: number;
  daily_change?: number;
  previous_price?: number;
  dps?: number | null;
  yield?: number | null;
  score: ScoreBreakdown;
  board_members?: BoardMember[];
  directors?: BoardMember[];
  commissioners?: BoardMember[];
  shareholders?: Shareholder[];
  subsidiaries?: Subsidiary[];
  shared_directors?: any[];
  market_cap?: number;
  is_blue_chip?: boolean;
  conglomerate?: string | null;
}

export interface InsiderHolding {
  code: string;
  percentage: number;
  value?: number;
  value_idr?: number;
  is_controller?: boolean;
}

export interface ConnectedRole {
  code: string;
  role: string;
  title: string;
}

export interface SuperInsider {
  name: string;
  clean_name?: string;
  total_value?: number;
  total_value_idr?: number;
  holdings?: InsiderHolding[];
  portfolio?: InsiderHolding[];
  holding_count?: number;
  connected_roles?: ConnectedRole[];
}

export interface Conglomerate {
  controller_name?: string;
  name?: string;
  companies: string[];
  total_assets?: number;
  total_market_cap?: number;
  average_roe?: number;
  median_roe?: number;
  average_pbv?: number;
  dominant_sector?: string;
}

export interface DashboardData {
  companies: Company[];
  super_insiders: SuperInsider[];
  conglomerates: Conglomerate[];
}

export interface StreamEvent {
  type: string;
  ticker?: string;
  price?: number;
  change?: number;
  score?: number;
  ohlc?: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  };
  status?: string;
  data?: any;
}

export interface BacktestParams {
  strategy: 'foreign_flow' | 'bandarmology' | 'sharia_value' | 'composite_alpha' | 'dividend_arbitrage';
  holding_days: number;
  top_n: number;
  min_turnover_rp: number;
  start_date?: string;
  end_date?: string;
  stop_loss_pct?: number;
  take_profit_pct?: number;
}

export interface BacktestMetrics {
  total_return_pct: number;
  cagr_pct?: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown_pct: number;
  win_rate_pct: number;
  profit_factor?: number;
  total_trades: number;
  avg_trade_return_pct: number;
  benchmark_return_pct: number;
  alpha_pct: number;
  strategy?: string;
  holding_days?: number;
}

export interface EquityPoint {
  time: string;
  value: number;
}

export interface BacktestTrade {
  EntryDate: string;
  ExitDate: string;
  StockCode: string;
  EntryPrice: number;
  ExitPrice: number;
  ReturnPct: number;
  Return: number;
}

export interface BacktestResponse {
  metrics: BacktestMetrics;
  equity_curve: EquityPoint[];
  trades: BacktestTrade[];
}

export interface StealthAnomaly {
  StockCode: string;
  PriceChangePct: number;
  SmartMoneyDelta: number;
  NetForeignFlowRpB?: number;
  TurnoverRpB?: number;
  Signal: 'STEALTH_ACCUMULATION' | 'RETAIL_TRAP' | string;
  Priority?: 'HIGH' | 'MEDIUM' | string;
}

export interface StealthAccumulationSummary {
  on_date: string;
  smart_money_turnover_rp_b: number;
  retail_turnover_rp_b: number;
  smart_money_delta: number;
  market_signal: string;
  anomalies_detected: number;
}

export interface StealthAccumulationResponse {
  summary: StealthAccumulationSummary | string;
  signal: string;
  smart_money_delta: number;
  anomalies: StealthAnomaly[];
}

export interface DividendOpportunity {
  StockCode: string;
  StockName?: string;
  Price?: number;
  DPS: number;
  DividendYield: number;
  CumDate: string;
  ExDate: string;
  PaymentDate?: string;
  PayoutRatio?: number;
  TrapScore?: number;
  Recommendation?: string;
}

export interface DividendAnalysis {
  ticker: string;
  has_dividend: boolean;
  message?: string;
  dividend?: {
    dps: number;
    yield_pct: number;
    cum_date: string;
    ex_date: string;
    payment_date: string;
  };
  metrics?: {
    payout_ratio: number;
    cash_coverage: number;
    fcf_yield: number;
    earnings_growth_yoy: number;
  };
  trap_score?: number;
  trap_level?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  recommendation?: 'BUY' | 'HOLD' | 'AVOID' | 'ARBITRAGE';
  playbook?: {
    strategy_a_naive_hold_return?: number;
    strategy_b_pre_cum_exit_return?: number;
    strategy_c_post_ex_rebuy_return?: number;
    best_strategy?: string;
  };
  risk_breakdown?: {
    payout_risk: number;
    cash_flow_risk: number;
    cyclicality_risk: number;
    leverage_risk: number;
  };
}

export interface WatchlistItem {
  code: string;
  name: string;
  sector?: string;
  price?: number;
  daily_change?: number;
  score?: number;
  addedAt: string;
}

export interface LiveAlert {
  id: string;
  ticker: string;
  type: 'STEALTH_ACCUMULATION' | 'RETAIL_TRAP' | 'DIVIDEND_CUM' | 'PASAR_NEGO';
  title: string;
  message: string;
  timestamp: string;
}
