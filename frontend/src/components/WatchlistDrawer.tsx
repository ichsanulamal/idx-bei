import React, { useState } from 'react';
import { Star, Bell, X, Trash2, Zap, AlertTriangle } from 'lucide-react';
import type { WatchlistItem, LiveAlert } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRemoveWatchlist: (code: string) => void;
  onSelectStock: (code: string) => void;
  alerts: LiveAlert[];
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveWatchlist,
  onSelectStock,
  alerts,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'watchlist' | 'alerts'>('watchlist');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '420px',
        maxWidth: '100vw',
        background: '#0a0e1a',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.6)',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('watchlist')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeSubTab === 'watchlist' ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeSubTab === 'watchlist' ? 'rgba(250, 204, 21, 0.15)' : 'transparent',
              color: activeSubTab === 'watchlist' ? '#facc15' : '#9ca3af',
            }}
          >
            <Star size={14} />
            <span>Watchlist ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('alerts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeSubTab === 'alerts' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeSubTab === 'alerts' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeSubTab === 'alerts' ? '#38bdf8' : '#9ca3af',
            }}
          >
            <Bell size={14} />
            <span>Alerts ({alerts.length})</span>
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        {activeSubTab === 'watchlist' ? (
          watchlist.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Star size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <h4 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>Your Watchlist is Empty</h4>
              <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                Click the star icon ⭐ on any stock in Alpha Finder to track and receive smart money alerts.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {watchlist.map((item) => (
                <div
                  key={item.code}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onSelectStock(item.code);
                    onClose();
                  }}
                  className="table-row-hover"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>{item.code}</span>
                      {item.score && (
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                          SMSS {item.score}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {item.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                        {item.price ? `Rp ${item.price.toLocaleString()}` : '—'}
                      </div>
                      {item.daily_change !== undefined && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: item.daily_change >= 0 ? '#10b981' : '#ef4444' }}>
                          {item.daily_change >= 0 ? `+${item.daily_change}` : item.daily_change}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveWatchlist(item.code);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                      }}
                      title="Remove from Watchlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Alerts Feed */
          alerts.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Bell size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <h4 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>No Live Alerts</h4>
              <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                Real-time stealth accumulation and retail trap signals will stream here automatically.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    background: alert.type === 'RETAIL_TRAP' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                    border: `1px solid ${alert.type === 'RETAIL_TRAP' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onSelectStock(alert.ticker);
                    onClose();
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {alert.type === 'RETAIL_TRAP' ? (
                        <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                      ) : (
                        <Zap size={16} style={{ color: '#10b981' }} />
                      )}
                      <strong style={{ color: alert.type === 'RETAIL_TRAP' ? '#f87171' : '#34d399', fontSize: '0.85rem' }}>
                        {alert.title}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{alert.timestamp}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
