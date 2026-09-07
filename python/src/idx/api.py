"""
High-Performance FastAPI REST & WebSocket Microservice Layer for IDX-BEI Toolkit.
"""

import asyncio
import json
import os

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from idx.core.ownership import get_latest_shareholder_drift
from idx.core.query import query_dataset
from idx.core.utils import DATA_DIR, load_json
from idx.graph import (
    calculate_board_centrality,
    detect_cross_holdings,
    get_company_network,
    get_ubo_tree,
)
from idx.signals import broker_concentration_screen, build_briefing, compute_technical_indicators

app = FastAPI(
    title="IDX-BEI Quantitative & Microservice API",
    description="High-performance async REST & WebSocket API for Indonesia Stock Exchange data and quantitative intelligence.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REPO_ROOT = os.path.abspath(os.path.join(DATA_DIR, ".."))
DASHBOARD_DIR = os.path.join(REPO_ROOT, "dashboard")
FRONTEND_DIST = os.path.join(REPO_ROOT, "frontend", "dist")

SERVE_DIR = FRONTEND_DIST if os.path.exists(FRONTEND_DIST) else DASHBOARD_DIR
if os.path.exists(SERVE_DIR):
    app.mount("/dashboard", StaticFiles(directory=SERVE_DIR, html=True), name="dashboard")

if os.path.exists(DATA_DIR):
    app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

FRONTEND_ASSETS = os.path.join(FRONTEND_DIST, "assets")
if os.path.exists(FRONTEND_ASSETS):
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS), name="assets")


@app.get("/", include_in_schema=False)
async def root_redirect():
    """Redirect root path directly to the visual dashboard."""
    return RedirectResponse(url="/dashboard/")


class SQLQueryRequest(BaseModel):
    sql: str
    limit: int | None = 50


class BacktestRequest(BaseModel):
    strategy: str = "foreign_flow"
    holding_days: int = 20
    top_n: int = 10
    min_turnover_rp: float = 1_000_000_000.0
    start_date: str | None = None
    end_date: str | None = None
    stop_loss_pct: float | None = None
    take_profit_pct: float | None = None


@app.get("/health", tags=["System"])
async def health():
    return {"status": "ok", "service": "idx-bei-api", "version": "0.2.0"}


@app.get("/api/dashboard-data", tags=["Market Data"])
async def get_dashboard_data():
    """Return unified dashboard dataset containing companies with prices, super-insiders, and conglomerates."""
    alpha_file = os.path.join(DATA_DIR, "network_alpha_data.json")
    if os.path.exists(alpha_file):
        return load_json(alpha_file)
    return {"companies": [], "super_insiders": [], "conglomerates": []}


@app.get("/api/companies", tags=["Fundamental"])
async def get_companies():
    """Return list of all listed companies with financial metrics, governance, and prices."""
    alpha_file = os.path.join(DATA_DIR, "network_alpha_data.json")
    if os.path.exists(alpha_file):
        data = load_json(alpha_file)
        return data.get("companies", [])
    return []


@app.get("/api/signals", tags=["Signals"])
async def get_signals(
    date: str | None = Query(None, description="Optional trading date (YYYY-MM-DD)"),
):
    try:
        res = build_briefing(date=date)
        json_file = res.get("json")
        if json_file and os.path.exists(json_file):
            return load_json(json_file)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/api/stock/{ticker}", tags=["Market Data"])
async def get_stock_data(ticker: str, limit: int = 120):
    import numpy as np
    import pandas as pd

    ticker = ticker.upper()
    df = query_dataset("stock_summary", where=f"StockCode = '{ticker}'")
    if len(df) == 0:
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found.")

    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.sort_values("Date").reset_index(drop=True)

    tech = compute_technical_indicators(df, ticker=ticker)
    if limit and len(tech) > limit:
        tech = tech.tail(limit).reset_index(drop=True)

    # Standardize time and OHLC fields for charts
    tech["time"] = tech["Date"].dt.strftime("%Y-%m-%d")
    if "OpenPrice" in tech.columns:
        tech["open"] = tech["OpenPrice"].fillna(tech["Close"])
    else:
        tech["open"] = tech["Close"]

    if "High" in tech.columns:
        tech["high"] = tech["High"].fillna(tech["Close"])
    else:
        tech["high"] = tech["Close"]

    if "Low" in tech.columns:
        tech["low"] = tech["Low"].fillna(tech["Close"])
    else:
        tech["low"] = tech["Close"]

    tech["close"] = tech["Close"]
    tech["volume"] = tech["Volume"].fillna(0) if "Volume" in tech.columns else 0

    # Clean NaNs and infs for strict JSON compliance
    clean_df = tech.replace([np.inf, -np.inf], np.nan).where(pd.notnull(tech), None)
    clean_df["Date"] = clean_df["Date"].astype(str)

    records = clean_df.to_dict(orient="records")
    latest = records[-1] if records else {}
    return {
        "ticker": ticker,
        "records": records,
        "latest": latest,
    }


@app.get("/api/broker-flow", tags=["Bandarmology"])
async def get_broker_flow(date: str | None = None, top_k: int = 10):
    import pandas as pd

    broker_path = os.path.join(DATA_DIR, "parquet", "broker_summary.parquet")
    if not os.path.exists(broker_path):
        from idx.core.timeseries import read_dataset

        df = read_dataset("broker_summary")
    else:
        df = pd.read_parquet(broker_path)

    if len(df) == 0:
        raise HTTPException(status_code=404, detail="Broker summary data not available.")

    summary, top_df = broker_concentration_screen(df, on_date=date, top_k=top_k)
    return {"summary": summary, "top_brokers": top_df.to_dict("records")}


@app.get("/api/peers/{ticker}", tags=["Fundamental"])
async def get_peers(ticker: str):
    import pandas as pd

    ticker = ticker.upper()
    ratios_path = os.path.join(DATA_DIR, "parquet", "financial_ratios.parquet")
    if not os.path.exists(ratios_path):
        raise HTTPException(status_code=404, detail="Financial ratios parquet not found.")

    df = pd.read_parquet(ratios_path)
    latest = df.sort_values("fsDate").groupby("code").last().reset_index()
    return latest.to_dict("records")


@app.get("/api/dividend/{ticker}", tags=["Dividends"])
async def get_dividend_analysis(ticker: str):
    from idx.dividend import analyze_stock_dividend

    res = analyze_stock_dividend(ticker)
    if not res.get("has_dividend"):
        raise HTTPException(status_code=404, detail=res.get("message", "Dividend data not found"))
    return res


@app.get("/api/dividend", tags=["Dividends"])
async def screen_dividends(min_yield: float = 3.0, year: str = "2026", limit: int = 25):
    from idx.dividend import screen_upcoming_dividends

    df = screen_upcoming_dividends(min_yield=min_yield, year_filter=year, limit=limit)
    return df.to_dict("records")


@app.get("/api/drift", tags=["Ownership"])
async def get_drift():
    return get_latest_shareholder_drift()


@app.get("/api/graph/ubo/{ticker}", tags=["Knowledge Graph"])
async def get_ubo(ticker: str):
    return get_ubo_tree(ticker)


@app.get("/api/graph/network/{ticker}", tags=["Knowledge Graph"])
async def get_network(ticker: str):
    data = get_company_network(ticker)
    if not data.get("nodes"):
        raise HTTPException(status_code=404, detail=f"No graph network found for {ticker}")
    return data


@app.get("/api/graph/centrality", tags=["Knowledge Graph"])
async def get_centrality(top_n: int = 20):
    df = calculate_board_centrality(top_n=top_n)
    return df.to_dict(orient="records")


@app.get("/api/graph/cross-holdings", tags=["Knowledge Graph"])
async def get_cross():
    return detect_cross_holdings()


@app.post("/api/query/sql", tags=["Analytics"])
async def execute_sql(req: SQLQueryRequest):
    sql = req.sql.strip()
    disallowed = ["insert ", "update ", "delete ", "drop ", "create ", "alter ", "truncate "]
    if any(word in sql.lower() for word in disallowed):
        raise HTTPException(status_code=400, detail="Only read-only SELECT queries are allowed.")

    import duckdb

    con = duckdb.connect(database=":memory:")
    for name in [
        "stock_summary",
        "financial_ratios",
        "corporate_actions",
        "broker_summary",
        "index_summary",
    ]:
        p_file = os.path.join(DATA_DIR, "parquet", f"{name}.parquet")
        if os.path.exists(p_file):
            con.execute(f"CREATE VIEW {name} AS SELECT * FROM read_parquet('{p_file}')")

    try:
        res_df = con.execute(sql).fetchdf()
        return res_df.head(req.limit).to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@app.get("/api/stealth-accumulation", tags=["Bandarmology"])
async def get_stealth_accumulation(date: str | None = None):
    import pandas as pd

    from idx.signals import detect_stealth_accumulation

    broker_path = os.path.join(DATA_DIR, "parquet", "broker_summary.parquet")
    stock_path = os.path.join(DATA_DIR, "parquet", "stock_summary.parquet")

    broker_df = pd.read_parquet(broker_path) if os.path.exists(broker_path) else pd.DataFrame()
    stock_df = pd.read_parquet(stock_path) if os.path.exists(stock_path) else pd.DataFrame()

    res = detect_stealth_accumulation(broker_df, stock_df, on_date=date)
    return {
        "summary": res["summary"],
        "signal": res["signal"],
        "smart_money_delta": res["smart_money_delta"],
        "anomalies": res["anomalies_df"].to_dict("records"),
    }


@app.post("/api/backtest", tags=["Backtesting"])
async def backtest_strategy(req: BacktestRequest):
    import numpy as np

    from idx.backtest import run_backtest

    try:
        metrics, trades_df = run_backtest(
            strategy=req.strategy,
            holding_days=req.holding_days,
            top_n=req.top_n,
            min_turnover_rp=req.min_turnover_rp,
            start_date=req.start_date,
            end_date=req.end_date,
            stop_loss_pct=req.stop_loss_pct,
            take_profit_pct=req.take_profit_pct,
        )

        # Sanitize metrics floats for JSON compliance
        cleaned_metrics: dict[str, object] = {}
        for k, v in metrics.items():
            if isinstance(v, float) and (np.isnan(v) or np.isinf(v)):
                cleaned_metrics[k] = None
            else:
                cleaned_metrics[k] = v

        trades_list: list[dict] = []
        equity_curve: list[dict[str, object]] = []

        if len(trades_df) > 0:
            trades_df_sorted = trades_df.sort_values("ExitDate")
            running_equity = 100.0
            first_entry = str(trades_df_sorted.iloc[0]["EntryDate"])
            equity_curve.append({"time": first_entry, "value": 100.0})

            # Calculate portfolio equity growth across rebalancing periods
            for exit_dt, group in trades_df_sorted.groupby("ExitDate"):
                avg_period_return = float(group["Return"].mean())
                running_equity *= 1.0 + avg_period_return
                equity_curve.append({"time": str(exit_dt), "value": round(running_equity, 2)})

            trades_list = (
                trades_df.replace({np.nan: None})
                .sort_values("ExitDate", ascending=False)
                .head(100)
                .to_dict("records")
            )
        else:
            equity_curve.append({"time": "2026-01-01", "value": 100.0})

        return {
            "metrics": cleaned_metrics,
            "equity_curve": equity_curve,
            "trades": trades_list,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


class ConnectionManager:
    """Manages active WebSocket client connections and broadcasts live market events."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        payload = json.dumps(message, default=str)
        dead = []
        for conn in self.active_connections:
            try:
                await conn.send_text(payload)
            except Exception:
                dead.append(conn)
        for d in dead:
            self.disconnect(d)


ws_manager = ConnectionManager()


@app.post("/api/broadcast", tags=["System"])
async def broadcast_event(event: dict):
    """Broadcasts a live event payload to all connected dashboard WebSockets."""
    await ws_manager.broadcast(event)
    return {"status": "broadcast_sent", "active_clients": len(ws_manager.active_connections)}


@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Welcome handshake
        await websocket.send_text(
            json.dumps(
                {
                    "type": "handshake",
                    "status": "connected",
                    "service": "idx-microservice-stream",
                    "timestamp": asyncio.get_event_loop().time(),
                }
            )
        )
        while True:
            # Check for incoming client messages or wait
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=5.0)
                data = json.loads(msg)
                if data.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps({"type": "pong", "time": asyncio.get_event_loop().time()})
                    )
            except TimeoutError:
                # Periodic heartbeat with market status
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "heartbeat",
                            "status": "alive",
                            "timestamp": asyncio.get_event_loop().time(),
                            "connected_clients": len(ws_manager.active_connections),
                        }
                    )
                )
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)


def run_server(host: str = "0.0.0.0", port: int = 8000):
    import uvicorn

    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    run_server()
